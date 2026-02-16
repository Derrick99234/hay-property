import { NextResponse, type NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "../../../lib/mongodb";
import { Blog } from "../../../models/Blog";
import { BlogCategory } from "../../../models/BlogCategory";
import { isAdmin } from "../_lib/auth";
import { isMongoDuplicateKeyError, jsonError, jsonOk, readJsonBody, slugify } from "../_lib/http";

export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  await connectMongo();

  const [stored, blogNames] = await Promise.all([
    BlogCategory.find({}, null, { sort: { name: 1 } }).lean(),
    Blog.distinct("category", { category: { $exists: true, $ne: "" } }),
  ]);

  const bySlug = new Map<string, { name: string; slug: string }>();

  for (const c of stored) {
    const name = String((c as any).name ?? "").trim();
    const slug = String((c as any).slug ?? "").trim().toLowerCase();
    if (!name || !slug) continue;
    bySlug.set(slug, { name, slug });
  }

  for (const raw of blogNames) {
    const name = String(raw ?? "").trim();
    if (!name) continue;
    const slug = slugify(name);
    if (!slug) continue;
    if (!bySlug.has(slug)) bySlug.set(slug, { name, slug });
  }

  const items = Array.from(bySlug.values()).sort((a, b) => a.name.localeCompare(b.name));
  return jsonOk({ items });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return jsonError("Unauthorized.", { status: 401 });
  await connectMongo();

  try {
    const body = await readJsonBody<{ name?: string }>(req);
    const name = body.name?.trim();
    if (!name || name.length < 2) return jsonError("Invalid name.", { status: 400 });

    const slug = slugify(name);
    if (!slug || slug.length < 2) return jsonError("Invalid name.", { status: 400 });

    const created = await BlogCategory.create({ name, slug });
    return NextResponse.json({ ok: true, data: created.toJSON() }, { status: 201 });
  } catch (err) {
    if (isMongoDuplicateKeyError(err)) return jsonError("Category already exists.", { status: 409 });
    if (err instanceof mongoose.Error.ValidationError) return jsonError(err.message, { status: 400 });
    return jsonError("Failed to create category.", { status: 500 });
  }
}
