import { NextResponse, type NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "../../../lib/mongodb";
import { Admin } from "../../../models/Admin";
import { isAdmin } from "../_lib/auth";
import { getPagination, isMongoDuplicateKeyError, jsonError, jsonOk, readJsonBody } from "../_lib/http";
import { hashPassword } from "../_lib/password";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return jsonError("Unauthorized.", { status: 401 });
  await connectMongo();

  const { limit, skip, page } = getPagination(req.nextUrl.searchParams);
  const items = await Admin.find({}, null, { sort: { createdAt: -1 }, limit, skip }).lean();
  const total = await Admin.countDocuments();

  const safe = items.map((a) => {
    const { passwordHash, ...rest } = a as { passwordHash?: unknown };
    return rest;
  });

  return jsonOk({ items: safe, page, limit, total });
}

export async function POST(req: NextRequest) {
  await connectMongo();
  const hasAnyAdmin = (await Admin.countDocuments()) > 0;
  if (hasAnyAdmin && !isAdmin(req)) return jsonError("Unauthorized.", { status: 401 });

  try {
    const body = await readJsonBody<{ email?: string; name?: string; password?: string; status?: string }>(
      req
    );

    const email = body.email?.trim().toLowerCase();
    const name = body.name?.trim();
    const password = body.password ?? "";

    if (!email || !email.includes("@")) return jsonError("Invalid email.", { status: 400 });
    if (!name || name.length < 2) return jsonError("Invalid name.", { status: 400 });
    if (password.length < 6) return jsonError("Password must be at least 6 characters.", { status: 400 });

    const passwordHash = await hashPassword(password);

    const created = await Admin.create({
      email,
      name,
      passwordHash,
      status: body.status ?? "ACTIVE",
    });

    return NextResponse.json({ ok: true, data: created.toJSON() }, { status: 201 });
  } catch (err) {
    if (isMongoDuplicateKeyError(err)) return jsonError("Email already exists.", { status: 409 });
    if (err instanceof mongoose.Error.ValidationError) return jsonError(err.message, { status: 400 });
    return jsonError("Failed to create admin.", { status: 500 });
  }
}
