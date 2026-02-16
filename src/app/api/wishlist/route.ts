import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "../../../lib/mongodb";
import { Property } from "../../../models/Property";
import { User } from "../../../models/User";
import { getSession } from "../_lib/auth";
import { jsonError, jsonOk, readJsonBody } from "../_lib/http";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.role !== "user") return jsonError("Unauthorized.", { status: 401 });
  if (!mongoose.isValidObjectId(session.subject)) return jsonError("Unauthorized.", { status: 401 });

  await connectMongo();
  const user = await User.findById(session.subject, { wishlist: 1 }).lean();
  if (!user) return jsonError("Unauthorized.", { status: 401 });

  const rawIds: unknown[] = Array.isArray((user as any).wishlist) ? (user as any).wishlist : [];
  const ids = rawIds.map((id) => String(id)).filter((id) => id.length > 0);
  if (ids.length === 0) return jsonOk({ ids: [], items: [] });

  const items = await Property.find(
    { _id: { $in: ids } },
    { title: 1, slug: 1, city: 1, state: 1, price: 1, currency: 1, status: 1, images: 1, createdAt: 1 }
  )
    .lean();

  const byId = new Map(items.map((p: any) => [String(p._id), p]));
  const ordered = ids.map((id: string) => byId.get(id)).filter(Boolean);

  return jsonOk({ ids, items: ordered });
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.role !== "user") return jsonError("Unauthorized.", { status: 401 });
  if (!mongoose.isValidObjectId(session.subject)) return jsonError("Unauthorized.", { status: 401 });

  const body = await readJsonBody<{ propertyId?: string }>(req);
  const propertyId = body.propertyId ?? "";
  if (!mongoose.isValidObjectId(propertyId)) return jsonError("Invalid propertyId.", { status: 400 });

  await connectMongo();
  const prop = await Property.findById(propertyId, { status: 1 }).lean();
  if (!prop) return jsonError("Not found.", { status: 404 });
  if (String((prop as any).status ?? "") !== "AVAILABLE") return jsonError("Not found.", { status: 404 });

  const updated = await User.updateOne({ _id: session.subject }, { $addToSet: { wishlist: propertyId } });
  if (!updated.matchedCount) return jsonError("Unauthorized.", { status: 401 });

  return jsonOk({ propertyId });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.role !== "user") return jsonError("Unauthorized.", { status: 401 });
  if (!mongoose.isValidObjectId(session.subject)) return jsonError("Unauthorized.", { status: 401 });

  const body = await readJsonBody<{ propertyId?: string }>(req);
  const propertyId = body.propertyId ?? "";
  if (!mongoose.isValidObjectId(propertyId)) return jsonError("Invalid propertyId.", { status: 400 });

  await connectMongo();
  const updated = await User.updateOne({ _id: session.subject }, { $pull: { wishlist: propertyId } });
  if (!updated.matchedCount) return jsonError("Unauthorized.", { status: 401 });

  return jsonOk({ propertyId });
}
