import type { NextRequest } from "next/server";
import { connectMongo } from "../../../lib/mongodb";
import { User } from "../../../models/User";
import { isAdmin } from "../_lib/auth";
import { getPagination, jsonError, jsonOk } from "../_lib/http";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) return jsonError("Unauthorized.", { status: 401 });
  await connectMongo();

  const { limit, skip, page } = getPagination(req.nextUrl.searchParams);
  const items = await User.find({}, null, { sort: { createdAt: -1 }, limit, skip }).lean();
  const total = await User.countDocuments();

  const safe = items.map((u) => {
    const { passwordHash, ...rest } = u as { passwordHash?: unknown };
    return rest;
  });

  return jsonOk({ items: safe, page, limit, total });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return jsonError("Unauthorized.", { status: 401 });
  return jsonError("Creating users from admin is disabled.", { status: 403 });
}
