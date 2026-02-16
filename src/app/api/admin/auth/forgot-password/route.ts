import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "../../../../../lib/mongodb";
import { Admin } from "../../../../../models/Admin";
import { PasswordResetToken } from "../../../../../models/PasswordResetToken";
import { jsonError, jsonOk, readJsonBody } from "../../../_lib/http";
import { generateResetToken, hashResetToken } from "../../../_lib/passwordReset";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await readJsonBody<{ email?: string }>(req);
    const email = body.email?.trim().toLowerCase();
    if (!email || !email.includes("@")) return jsonError("Invalid email.", { status: 400 });

    await connectMongo();
    const admin = await Admin.findOne({ email }, { _id: 1 }).lean();
    if (admin?._id && mongoose.isValidObjectId(String(admin._id))) {
      const token = generateResetToken();
      const tokenHash = hashResetToken(token);
      const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
      await PasswordResetToken.create({ role: "admin", subjectId: admin._id, tokenHash, expiresAt });
    }

    return jsonOk({ sent: true });
  } catch {
    return jsonOk({ sent: true });
  }
}

