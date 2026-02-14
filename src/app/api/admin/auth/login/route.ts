import { NextResponse, type NextRequest } from "next/server";
import { connectMongo } from "../../../../../lib/mongodb";
import { Admin } from "../../../../../models/Admin";
import { jsonError } from "../../../_lib/http";
import { verifyPassword } from "../../../_lib/password";
import { setSession } from "../../../_lib/sessionCookie";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  await connectMongo();

  const body = (await req.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !email.includes("@")) return jsonError("Invalid email.", { status: 400 });
  if (!password) return jsonError("Invalid password.", { status: 400 });

  const admin = await Admin.findOne({ email }).lean();
  if (!admin) return jsonError("Invalid credentials.", { status: 401 });
  if ((admin as { status?: string }).status === "DISABLED") return jsonError("Account disabled.", { status: 403 });

  const ok = await verifyPassword(password, String((admin as { passwordHash: unknown }).passwordHash));
  if (!ok) return jsonError("Invalid credentials.", { status: 401 });

  const { passwordHash, ...safe } = admin as { passwordHash?: unknown };
  const res = NextResponse.json({ ok: true, data: safe });
  setSession(res, { role: "admin", subject: String((admin as { _id: unknown })._id) });
  return res;
}

