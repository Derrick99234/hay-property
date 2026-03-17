import type { NextRequest } from "next/server";
import crypto from "crypto";
import mongoose from "mongoose";
import { connectMongo } from "../../../../lib/mongodb";
import { putPublicObject, getPublicUrl } from "../../../../lib/r2";
import { Property } from "../../../../models/Property";
import { isAdmin } from "../../_lib/auth";
import { jsonError, jsonOk, slugify } from "../../_lib/http";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function isFile(value: unknown): value is File {
  if (!value || typeof value !== "object") return false;
  const v = value as { arrayBuffer?: unknown; size?: unknown; type?: unknown; name?: unknown };
  return typeof v.arrayBuffer === "function" && typeof v.size === "number" && typeof v.type === "string" && typeof v.name === "string";
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return jsonError("Unauthorized.", { status: 401 });
  await connectMongo();

  const form = await req.formData();
  const propertySlugRaw = String(form.get("propertySlug") ?? "").trim();
  const propertyId = String(form.get("propertyId") ?? "").trim();

  let doc: any = null;
  if (propertySlugRaw) {
    const propertySlug = slugify(propertySlugRaw);
    if (!propertySlug) return jsonError("Invalid propertySlug.", { status: 400 });
    doc = await Property.findOne({ slug: propertySlug }, { _id: 1, slug: 1 }).lean();
    if (!doc) return jsonError("Not found.", { status: 404 });
  } else {
    if (!mongoose.isValidObjectId(propertyId)) return jsonError("Invalid propertyId.", { status: 400 });
    doc = await Property.findById(propertyId, { _id: 1, slug: 1 }).lean();
    if (!doc) return jsonError("Not found.", { status: 404 });
  }

  const files = form.getAll("images").filter(isFile);
  if (!files.length) return jsonError("No images provided.", { status: 400 });
  if (files.length > 5) return jsonError("Images must be at most 5.", { status: 400 });

  const images: Array<{ url: string; order: number }> = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = ALLOWED_TYPES[file.type];
    if (!ext) return jsonError("Only JPG, PNG, and WEBP images are allowed.", { status: 400 });
    if (file.size <= 0 || file.size > MAX_BYTES) return jsonError("Each image must be at most 5MB.", { status: 400 });

    const slug = slugify(String((doc as any).slug ?? "")) || String((doc as any)._id ?? "");
    const key = `properties/${slug}/${crypto.randomUUID()}.${ext}`;
    const buf = new Uint8Array(await file.arrayBuffer());
    await putPublicObject({ key, body: buf, contentType: file.type });
    images.push({ url: getPublicUrl(key), order: i });
  }

  return jsonOk({ images }, { status: 201 });
}
