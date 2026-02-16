import { NextResponse } from "next/server";
import { SESSION_COOKIE, type SessionRole } from "../../auth/_lib/session";
import { signJwt } from "./jwt";

export async function setSession(res: NextResponse, input: { role: SessionRole; subject: string }) {
  const token = await signJwt({ role: input.role, sub: input.subject, ttlSeconds: 60 * 60 * 24 * 7 });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
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
