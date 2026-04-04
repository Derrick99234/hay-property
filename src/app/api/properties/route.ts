import { NextResponse, type NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "../../../lib/mongodb";
import { rewriteToPublicBaseUrl } from "../../../lib/r2";
import { sanitizeRichText } from "../../../lib/richText";
import { Property } from "../../../models/Property";
import { getSession, isAdmin } from "../_lib/auth";
import { getPagination, isMongoDuplicateKeyError, jsonError, jsonOk, readJsonBody, slugify } from "../_lib/http";

export const runtime = "nodejs";

async function ensureUniqueSlug(base: string) {
  const safeBase = slugify(base);
  if (!safeBase) return "";
  let candidate = safeBase;
  for (let i = 2; i < 50; i++) {
    const exists = await Property.exists({ slug: candidate });
    if (!exists) return candidate;
    candidate = `${safeBase}-${i}`;
  }
  return `${safeBase}-${Date.now().toString(36)}`;
}

export async function GET(req: NextRequest) {
  await connectMongo();

  const admin = await isAdmin(req);
  const { limit, skip, page } = getPagination(req.nextUrl.searchParams);
  const filter: Record<string, unknown> = {};
  if (!admin) filter.status = "AVAILABLE";

  const items = await Property.find(filter, null, { sort: { createdAt: -1 }, limit, skip })
    .populate("createdBy", "email name")
    .lean();
  const normalized = items.map((p: any) => ({
    ...p,
    images: Array.isArray(p.images)
      ? p.images.map((img: any) => ({ ...img, url: rewriteToPublicBaseUrl(String(img?.url ?? "").trim()) }))
      : [],
  }));
  const total = await Property.countDocuments(filter);

  return jsonOk({ items: normalized, page, limit, total });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return jsonError("Unauthorized.", { status: 401 });
  await connectMongo();

  try {
    const body = await readJsonBody<{
      title?: string;
      slug?: string;
      description?: string;
      features?: string[];
      price?: number;
      currency?: string;
      status?: string;
      address?: string;
      city?: string;
      state?: string;
      country?: string;
      lat?: number;
      lng?: number;
      metadata?: unknown;
      images?: Array<{ url: string; alt?: string; order?: number }>;
    }>(req);

    const title = body.title?.trim();
    const slug = await ensureUniqueSlug(body.slug ?? title ?? "");
    const session = await getSession(req);
    const createdById = session?.subject ?? "";

    if (!title || title.length < 2) return jsonError("Invalid title.", { status: 400 });
    if (!slug || slug.length < 2) return jsonError("Invalid slug.", { status: 400 });
    if (typeof body.price !== "number" || body.price < 0) return jsonError("Invalid price.", { status: 400 });
    if (!mongoose.isValidObjectId(createdById)) return jsonError("Invalid createdById.", { status: 400 });

    const images = Array.isArray(body.images)
      ? body.images
          .map((img) => ({
            url: rewriteToPublicBaseUrl(String(img.url ?? "").trim()),
            alt: typeof img.alt === "string" ? img.alt : undefined,
            order: typeof img.order === "number" ? img.order : 0,
          }))
          .filter((img) => img.url.length > 0)
      : [];

    const features = Array.isArray(body.features) ? body.features.map((x) => String(x ?? "").trim()).filter(Boolean).slice(0, 20) : [];

    if (images.length > 5) return jsonError("Images must be at most 5.", { status: 400 });
    if ((body.status ?? "DRAFT") === "AVAILABLE" && images.length < 3) {
      return jsonError("Images must be at least 3 for AVAILABLE listings.", { status: 400 });
    }

    const location =
      typeof body.lng === "number" && typeof body.lat === "number"
        ? { type: "Point", coordinates: [body.lng, body.lat] }
        : undefined;

    const description = typeof body.description === "string" ? sanitizeRichText(body.description) : "";

    const created = await Property.create({
      title,
      slug,
      description,
      features,
      price: body.price,
      currency: body.currency ?? "NGN",
      status: body.status ?? "DRAFT",
      address: body.address,
      city: body.city,
      state: body.state,
      country: body.country ?? "Nigeria",
      location,
      metadata: body.metadata,
      images,
      createdBy: createdById,
    });

    return NextResponse.json({ ok: true, data: created.toJSON() }, { status: 201 });
  } catch (err) {
    if (isMongoDuplicateKeyError(err)) return jsonError("Slug already exists.", { status: 409 });
    if (err instanceof mongoose.Error.ValidationError) return jsonError(err.message, { status: 400 });
    return jsonError("Failed to create property.", { status: 500 });
  }
}
