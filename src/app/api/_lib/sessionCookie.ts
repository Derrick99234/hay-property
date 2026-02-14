import { NextResponse } from "next/server";
import { SESSION_COOKIE, type SessionRole } from "../../auth/_lib/session";

export function setSession(res: NextResponse, input: { role: SessionRole; subject: string }) {
  const payload = encodeURIComponent(`${input.role}:${input.subject}`);
  res.cookies.set(SESSION_COOKIE, payload, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSession(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

