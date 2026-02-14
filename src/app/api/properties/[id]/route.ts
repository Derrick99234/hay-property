import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "../../../../lib/mongodb";
import { Property } from "../../../../models/Property";
import { isAdmin } from "../../_lib/auth";
import { isMongoDuplicateKeyError, jsonError, jsonOk, readJsonBody } from "../../_lib/http";

export const runtime = "nodejs";

function getParam(params: { id?: string }) {
  return params.id ?? "";
}

function findByIdOrSlug(idOrSlug: string) {
  if (mongoose.isValidObjectId(idOrSlug)) {
    return Property.findById(idOrSlug).populate("createdBy", "email name");
  }
  return Property.findOne({ slug: idOrSlug.toLowerCase() }).populate("createdBy", "email name");
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  await connectMongo();
  const admin = isAdmin(req);

  const params = await ctx.params;
  const id = getParam(params);
  if (!id) return jsonError("Missing id.", { status: 400 });

  const doc = await findByIdOrSlug(id).lean();
  if (!doc) return jsonError("Not found.", { status: 404 });
  if (!admin && (doc as { status?: string }).status !== "AVAILABLE") return jsonError("Not found.", { status: 404 });

  return jsonOk(doc);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return jsonError("Unauthorized.", { status: 401 });
  await connectMongo();

  const params = await ctx.params;
  const id = getParam(params);
  if (!id) return jsonError("Missing id.", { status: 400 });

  try {
    const body = await readJsonBody<{
      title?: string;
      slug?: string;
      description?: string;
      price?: number;
      currency?: string;
      status?: string;
      address?: string;
      city?: string;
      state?: string;
      country?: string;
      lat?: number | null;
      lng?: number | null;
      metadata?: unknown;
      images?: Array<{ url: string; alt?: string; order?: number }>;
      createdById?: string;
    }>(req);

    const update: Record<string, unknown> = {};
    if (typeof body.title === "string") update.title = body.title.trim();
    if (typeof body.slug === "string") update.slug = body.slug.trim().toLowerCase();
    if (typeof body.description === "string") update.description = body.description;
    if (typeof body.price === "number") update.price = body.price;
    if (typeof body.currency === "string") update.currency = body.currency;
    if (typeof body.status === "string") update.status = body.status;
    if (typeof body.address === "string") update.address = body.address;
    if (typeof body.city === "string") update.city = body.city;
    if (typeof body.state === "string") update.state = body.state;
    if (typeof body.country === "string") update.country = body.country;
    if (typeof body.createdById === "string") {
      if (!mongoose.isValidObjectId(body.createdById)) return jsonError("Invalid createdById.", { status: 400 });
      update.createdBy = body.createdById;
    }
    if ("metadata" in body) update.metadata = body.metadata;
    if (Array.isArray(body.images)) {
      update.images = body.images.map((img) => ({
        url: String(img.url),
        alt: typeof img.alt === "string" ? img.alt : undefined,
        order: typeof img.order === "number" ? img.order : 0,
      }));
    }

    if (body.lat === null || body.lng === null) update.location = undefined;
    if (typeof body.lng === "number" && typeof body.lat === "number") {
      update.location = { type: "Point", coordinates: [body.lng, body.lat] };
    }

    const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id.toLowerCase() };
    const doc = await Property.findOneAndUpdate(query, update, { new: true, runValidators: true })
      .populate("createdBy", "email name")
      .lean();
    if (!doc) return jsonError("Not found.", { status: 404 });

    return jsonOk(doc);
  } catch (err) {
    if (isMongoDuplicateKeyError(err)) return jsonError("Slug already exists.", { status: 409 });
    if (err instanceof mongoose.Error.ValidationError) return jsonError(err.message, { status: 400 });
    return jsonError("Failed to update property.", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return jsonError("Unauthorized.", { status: 401 });
  await connectMongo();

  const params = await ctx.params;
  const id = getParam(params);
  if (!id) return jsonError("Missing id.", { status: 400 });

  const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id.toLowerCase() };
  const deleted = await Property.findOneAndDelete(query).lean();
  if (!deleted) return jsonError("Not found.", { status: 404 });
  return jsonOk({ id: (deleted as { _id: unknown })._id });
}
