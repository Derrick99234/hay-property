export type SessionRole = "user" | "admin";

export const SESSION_COOKIE = "hay_session_v1";

export function setSessionCookie(input: { role: SessionRole; subject: string }) {
  const payload = encodeURIComponent(`${input.role}:${input.subject}`);
  document.cookie = `${SESSION_COOKIE}=${payload}; Path=/; SameSite=Lax; Max-Age=2592000`;
}

export function clearSessionCookie() {
  document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0`;
}

export function parseSessionCookie(cookieHeader: string | null | undefined) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map((p) => p.trim());
  const pair = parts.find((p) => p.startsWith(`${SESSION_COOKIE}=`));
  if (!pair) return null;
  const raw = pair.slice(SESSION_COOKIE.length + 1);
  try {
    const decoded = decodeURIComponent(raw);
    const [role, subject] = decoded.split(":");
    if (role !== "user" && role !== "admin") return null;
    if (!subject) return null;
    return { role: role as SessionRole, subject };
  } catch {
    return null;
  }
}
