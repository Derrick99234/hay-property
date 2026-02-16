import { verifyJwt } from "../../api/_lib/jwt";

export type SessionRole = "user" | "admin";

export const SESSION_COOKIE = "hay_session_v1";

export async function parseSessionCookie(cookieHeader: string | null | undefined) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map((p) => p.trim());
  const pair = parts.find((p) => p.startsWith(`${SESSION_COOKIE}=`));
  if (!pair) return null;
  const token = pair.slice(SESSION_COOKIE.length + 1);
  const payload = await verifyJwt(token);
  if (!payload) return null;
  return { role: payload.role as SessionRole, subject: payload.sub };
}
