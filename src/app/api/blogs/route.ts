import { NextResponse, type NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "../../../lib/mongodb";
import { Blog } from "../../../models/Blog";
import { getSession, isAdmin } from "../_lib/auth";
import { getPagination, isMongoDuplicateKeyError, jsonError, jsonOk, readJsonBody, slugify } from "../_lib/http";

export const runtime = "nodejs";

async function ensureUniqueSlug(base: string) {
  const safeBase = slugify(base);
  if (!safeBase) return "";
  let candidate = safeBase;
  for (let i = 2; i < 50; i++) {
    const exists = await Blog.exists({ slug: candidate });
    if (!exists) return candidate;
    candidate = `${safeBase}-${i}`;
  }
  return `${safeBase}-${Date.now().toString(36)}`;
}

export async function GET(req: NextRequest) {
  await connectMongo();

  const admin = await isAdmin(req);
  const { limit, skip, page } = getPagination(req.nextUrl.searchParams);
  const publishedOnly = !admin;

  const filter: Record<string, unknown> = {};
  if (publishedOnly) filter.published = true;

  const items = await Blog.find(filter, null, { sort: { createdAt: -1 }, limit, skip })
    .populate("author", "email name")
    .lean();
  const total = await Blog.countDocuments(filter);

  return jsonOk({ items, page, limit, total });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return jsonError("Unauthorized.", { status: 401 });
  await connectMongo();

  try {
    const body = await readJsonBody<{
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      category?: string;
      coverUrl?: string;
      published?: boolean;
      publishedAt?: string;
    }>(req);

    const title = body.title?.trim();
    const slug = await ensureUniqueSlug(body.slug ?? title ?? "");
    const session = await getSession(req);
    const authorId = session?.subject ?? "";

    if (!title || title.length < 2) return jsonError("Invalid title.", { status: 400 });
    if (!slug || slug.length < 2) return jsonError("Invalid slug.", { status: 400 });
    if (!mongoose.isValidObjectId(authorId)) return jsonError("Invalid authorId.", { status: 400 });

    const created = await Blog.create({
      title,
      slug,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category,
      coverUrl: body.coverUrl,
      published: Boolean(body.published),
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
      author: authorId,
    });

    return NextResponse.json({ ok: true, data: created.toJSON() }, { status: 201 });
  } catch (err) {
    if (isMongoDuplicateKeyError(err)) return jsonError("Slug already exists.", { status: 409 });
    if (err instanceof mongoose.Error.ValidationError) return jsonError(err.message, { status: 400 });
    return jsonError("Failed to create blog.", { status: 500 });
  }
}
