import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "../../../../lib/mongodb";
import { Admin } from "../../../../models/Admin";
import { isAdmin } from "../../_lib/auth";
import { isMongoDuplicateKeyError, jsonError, jsonOk, readJsonBody } from "../../_lib/http";
import { hashPassword } from "../../_lib/password";

export const runtime = "nodejs";

function getIdFromParams(params: { id?: string }) {
  return params.id ?? "";
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return jsonError("Unauthorized.", { status: 401 });
  const params = await ctx.params;
  const id = getIdFromParams(params);
  if (!id) return jsonError("Missing id.", { status: 400 });

  await connectMongo();
  const doc = await Admin.findById(id).lean();
  if (!doc) return jsonError("Not found.", { status: 404 });

  const { passwordHash, ...rest } = doc as { passwordHash?: unknown };
  return jsonOk(rest);
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return jsonError("Unauthorized.", { status: 401 });
  const params = await ctx.params;
  const id = getIdFromParams(params);
  if (!id) return jsonError("Missing id.", { status: 400 });

  await connectMongo();

  try {
    const body = await readJsonBody<{
      email?: string;
      name?: string;
      password?: string;
      status?: string;
      lastLoginAt?: string;
    }>(req);

    const update: Record<string, unknown> = {};
    if (typeof body.email === "string") update.email = body.email.trim().toLowerCase();
    if (typeof body.name === "string") update.name = body.name.trim();
    if (typeof body.status === "string") update.status = body.status;
    if (typeof body.lastLoginAt === "string") update.lastLoginAt = new Date(body.lastLoginAt);
    if (typeof body.password === "string") {
      if (body.password.length < 6) return jsonError("Password must be at least 6 characters.", { status: 400 });
      update.passwordHash = await hashPassword(body.password);
    }

    const doc = await Admin.findByIdAndUpdate(id, update, { new: true, runValidators: true }).lean();
    if (!doc) return jsonError("Not found.", { status: 404 });

    const { passwordHash, ...rest } = doc as { passwordHash?: unknown };
    return jsonOk(rest);
  } catch (err) {
    if (isMongoDuplicateKeyError(err)) return jsonError("Email already exists.", { status: 409 });
    if (err instanceof mongoose.Error.ValidationError) return jsonError(err.message, { status: 400 });
    return jsonError("Failed to update admin.", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return jsonError("Unauthorized.", { status: 401 });
  const params = await ctx.params;
  const id = getIdFromParams(params);
  if (!id) return jsonError("Missing id.", { status: 400 });

  await connectMongo();
  const deleted = await Admin.findByIdAndDelete(id).lean();
  if (!deleted) return jsonError("Not found.", { status: 404 });
  return jsonOk({ id });
}

