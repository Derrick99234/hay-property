import { NextResponse, type NextRequest } from "next/server";
import { jsonError } from "@/app/api/_lib/http";
import { setSession } from "@/app/api/_lib/sessionCookie";
import { connectMongo } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import { verifyPassword } from "@/app/api/_lib/password";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  await connectMongo();

  const body = (await req.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";

  console.log(`email: ${email}, password: ${password}`)

  if (!email || !email.includes("@")) return jsonError("Invalid email.", { status: 400 });
  if (!password) return jsonError("Invalid password.", { status: 400 });

  const admin = await Admin.findOne({ email }).lean();
  if (!admin) return jsonError("Admin not found.", { status: 401 });
  if ((admin as { status?: string }).status === "DISABLED") return jsonError("Account disabled.", { status: 403 });

  const ok = await verifyPassword(password, String((admin as { passwordHash: unknown }).passwordHash));
  if (!ok) return jsonError("Invalid credentials.", { status: 401 });

  const { passwordHash, ...safe } = admin as { passwordHash?: unknown };
  const res = NextResponse.json({ ok: true, data: safe });
  await setSession(res, { role: "admin", subject: String((admin as { _id: unknown })._id) });
  return res;
}
