import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "../../../../lib/mongodb";
import { User } from "../../../../models/User";
import { getSession } from "../../_lib/auth";
import { jsonError, jsonOk } from "../../_lib/http";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return jsonOk({ session: null });
  if (session.role !== "user") return jsonOk({ session });
  if (!mongoose.isValidObjectId(session.subject)) return jsonOk({ session: null });

  await connectMongo();
  const user = await User.findById(session.subject).lean();
  if (!user) return jsonOk({ session: null });

  const { passwordHash, ...safe } = user as { passwordHash?: unknown };
  return jsonOk({ session, user: safe });
}
