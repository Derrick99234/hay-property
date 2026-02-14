import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "../../../../lib/mongodb";
import { Blog } from "../../../../models/Blog";
import { isAdmin } from "../../_lib/auth";
import { isMongoDuplicateKeyError, jsonError, jsonOk, readJsonBody } from "../../_lib/http";

export const runtime = "nodejs";

function getParam(params: { id?: string }) {
  return params.id ?? "";
}

function findByIdOrSlug(idOrSlug: string) {
  if (mongoose.isValidObjectId(idOrSlug)) {
    return Blog.findById(idOrSlug).populate("author", "email name");
  }
  return Blog.findOne({ slug: idOrSlug.toLowerCase() }).populate("author", "email name");
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  await connectMongo();
  const admin = isAdmin(req);

  const params = await ctx.params;
  const id = getParam(params);
  if (!id) return jsonError("Missing id.", { status: 400 });

  const doc = await findByIdOrSlug(id).lean();
  if (!doc) return jsonError("Not found.", { status: 404 });
  if (!admin && !(doc as { published?: boolean }).published) return jsonError("Not found.", { status: 404 });

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
      excerpt?: string;
      content?: string;
      category?: string;
      coverUrl?: string;
      published?: boolean;
      publishedAt?: string | null;
      authorId?: string;
    }>(req);

    const update: Record<string, unknown> = {};
    if (typeof body.title === "string") update.title = body.title.trim();
    if (typeof body.slug === "string") update.slug = body.slug.trim().toLowerCase();
    if (typeof body.excerpt === "string") update.excerpt = body.excerpt;
    if (typeof body.content === "string") update.content = body.content;
    if (typeof body.category === "string") update.category = body.category;
    if (typeof body.coverUrl === "string") update.coverUrl = body.coverUrl;
    if (typeof body.published === "boolean") update.published = body.published;
    if (body.publishedAt === null) update.publishedAt = undefined;
    if (typeof body.publishedAt === "string") update.publishedAt = new Date(body.publishedAt);
    if (typeof body.authorId === "string") {
      if (!mongoose.isValidObjectId(body.authorId)) return jsonError("Invalid authorId.", { status: 400 });
      update.author = body.authorId;
    }

    const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id.toLowerCase() };
    const doc = await Blog.findOneAndUpdate(query, update, { new: true, runValidators: true })
      .populate("author", "email name")
      .lean();
    if (!doc) return jsonError("Not found.", { status: 404 });

    return jsonOk(doc);
  } catch (err) {
    if (isMongoDuplicateKeyError(err)) return jsonError("Slug already exists.", { status: 409 });
    if (err instanceof mongoose.Error.ValidationError) return jsonError(err.message, { status: 400 });
    return jsonError("Failed to update blog.", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return jsonError("Unauthorized.", { status: 401 });
  await connectMongo();

  const params = await ctx.params;
  const id = getParam(params);
  if (!id) return jsonError("Missing id.", { status: 400 });

  const query = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id.toLowerCase() };
  const deleted = await Blog.findOneAndDelete(query).lean();
  if (!deleted) return jsonError("Not found.", { status: 404 });
  return jsonOk({ id: (deleted as { _id: unknown })._id });
}
