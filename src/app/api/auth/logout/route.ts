import { NextResponse, type NextRequest } from "next/server";
import { clearSession } from "../../_lib/sessionCookie";

export const runtime = "nodejs";

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  clearSession(res);
  return res;
}

