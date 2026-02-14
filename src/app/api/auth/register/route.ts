import { NextResponse, type NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "../../../../lib/mongodb";
import { User } from "../../../../models/User";
import { jsonError } from "../../_lib/http";
import { hashPassword } from "../../_lib/password";
import { setSession } from "../../_lib/sessionCookie";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  await connectMongo();

  try {
    const body = (await req.json()) as { email?: string; name?: string; password?: string };

    const email = body.email?.trim().toLowerCase();
    const name = body.name?.trim();
    const password = body.password ?? "";

    if (!email || !email.includes("@")) return jsonError("Invalid email.", { status: 400 });
    if (!name || name.length < 2) return jsonError("Invalid name.", { status: 400 });
    if (password.length < 6) return jsonError("Password must be at least 6 characters.", { status: 400 });

    const passwordHash = await hashPassword(password);
    const created = await User.create({ email, name, passwordHash, status: "ACTIVE" });

    const res = NextResponse.json({ ok: true, data: created.toJSON() }, { status: 201 });
    setSession(res, { role: "user", subject: String((created as { _id: unknown })._id) });
    return res;
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) return jsonError(err.message, { status: 400 });
    const code = (err as { code?: unknown }).code;
    if (code === 11000) return jsonError("Email already exists.", { status: 409 });
    return jsonError("Failed to register.", { status: 500 });
  }
}

