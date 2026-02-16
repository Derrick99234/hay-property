import type { NextRequest } from "next/server";
import { parseSessionCookie } from "../../auth/_lib/session";

export async function getSession(req: NextRequest) {
  return await parseSessionCookie(req.headers.get("cookie"));
}

export async function isAdmin(req: NextRequest) {
  const session = await getSession(req);
  return session?.role === "admin";
}

export async function isSelfOrAdmin(req: NextRequest, userId: string) {
  const session = await getSession(req);
  if (!session) return false;
  if (session.role === "admin") return true;
  return session.role === "user" && session.subject === userId;
}
