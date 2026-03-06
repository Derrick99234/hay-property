import type { NextRequest } from "next/server";
import { connectMongo } from "../../../../../lib/mongodb";
import { ChatSession } from "../../../../../models/ChatSession";
import { jsonError, jsonOk } from "../../../_lib/http";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const headerSid = req.headers.get("x-hp-chat-sid")?.trim();
  const cookieSid = req.cookies.get("hp_chat_sid")?.value?.trim();
  const sessionId = headerSid || cookieSid || "";
  if (!sessionId) return jsonError("Missing session.", { status: 400 });

  await connectMongo();
  await ChatSession.deleteOne({ sessionId });

  const res = jsonOk({ ok: true });
  res.cookies.set("hp_chat_sid", "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}

