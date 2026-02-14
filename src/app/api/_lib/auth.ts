import type { NextRequest } from "next/server";
import { parseSessionCookie } from "../../auth/_lib/session";

export function getSession(req: NextRequest) {
  return parseSessionCookie(req.headers.get("cookie"));
}

export function isAdmin(req: NextRequest) {
  const session = getSession(req);
  return session?.role === "admin";
}

export function isSelfOrAdmin(req: NextRequest, userId: string) {
  const session = getSession(req);
  if (!session) return false;
  if (session.role === "admin") return true;
  return session.role === "user" && session.subject === userId;
}
