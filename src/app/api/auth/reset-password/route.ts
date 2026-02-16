import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "../../../../lib/mongodb";
import { User } from "../../../../models/User";
import { PasswordResetToken } from "../../../../models/PasswordResetToken";
import { jsonError, jsonOk, readJsonBody } from "../../_lib/http";
import { hashPassword } from "../../_lib/password";
import { hashResetToken } from "../../_lib/passwordReset";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await readJsonBody<{ token?: string; password?: string }>(req);
  const token = body.token?.trim() ?? "";
  const password = body.password ?? "";
  if (!token) return jsonError("Invalid reset token.", { status: 400 });
  if (password.length < 6) return jsonError("Password must be at least 6 characters.", { status: 400 });

  await connectMongo();
  const tokenHash = hashResetToken(token);
  const doc = await PasswordResetToken.findOneAndDelete({ role: "user", tokenHash }).lean();
  if (!doc) return jsonError("Invalid or expired reset link.", { status: 400 });
  const subjectId = String((doc as { subjectId: unknown }).subjectId);
  if (!mongoose.isValidObjectId(subjectId)) return jsonError("Invalid token.", { status: 400 });

  const passwordHash = await hashPassword(password);
  const updated = await User.findByIdAndUpdate(subjectId, { passwordHash }).lean();
  if (!updated) return jsonError("Invalid reset link.", { status: 400 });

  return jsonOk({ updated: true });
}

