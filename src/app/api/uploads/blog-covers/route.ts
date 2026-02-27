import type { NextRequest } from "next/server";
import crypto from "crypto";
import mongoose from "mongoose";
import { connectMongo } from "../../../../lib/mongodb";
import { putPublicObject, getPublicUrl } from "../../../../lib/r2";
import { Blog } from "../../../../models/Blog";
import { isAdmin } from "../../_lib/auth";
import { jsonError, jsonOk } from "../../_lib/http";

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
  const blogId = String(form.get("blogId") ?? "").trim();
  if (!mongoose.isValidObjectId(blogId)) return jsonError("Invalid blogId.", { status: 400 });

  const exists = await Blog.exists({ _id: blogId });
  if (!exists) return jsonError("Not found.", { status: 404 });

  const cover = form.get("cover");
  if (!isFile(cover)) return jsonError("No cover image provided.", { status: 400 });

  const ext = ALLOWED_TYPES[cover.type];
  if (!ext) return jsonError("Only JPG, PNG, and WEBP images are allowed.", { status: 400 });
  if (cover.size <= 0 || cover.size > MAX_BYTES) return jsonError("Cover image must be at most 5MB.", { status: 400 });

  const key = `blogs/${blogId}/cover/${crypto.randomUUID()}.${ext}`;
  const buf = new Uint8Array(await cover.arrayBuffer());
  await putPublicObject({ key, body: buf, contentType: cover.type });

  return jsonOk({ url: getPublicUrl(key) }, { status: 201 });
}

