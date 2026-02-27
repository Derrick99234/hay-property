import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "../../../lib/mongodb";
import { Property } from "../../../models/Property";
import { Purchase } from "../../../models/Purchase";
import { getSession, isAdmin } from "../_lib/auth";
import { getPagination, isMongoDuplicateKeyError, jsonError, jsonOk, readJsonBody } from "../_lib/http";

export const runtime = "nodejs";

const STEP_DEFS = [
  { key: "development.phase1.clearingFencingGatehouse", label: "Clearing / Property fencing / Gate-house development", phase: "Development Phase 1" },
  { key: "development.phase1.earthRoadDevelopment", label: "Earth road development", phase: "Development Phase 1" },
  { key: "development.phase1.plotSetOut", label: "Plot set out", phase: "Development Phase 1" },
  { key: "development.phase1.allocation", label: "Allocation", phase: "Development Phase 1" },
  { key: "development.phase2.streetLight", label: "Street light", phase: "Development Phase 2" },
  { key: "development.phase2.finalRoadTarr", label: "Final road tarr", phase: "Development Phase 2" },
] as const;

function getByPath(obj: unknown, path: string) {
  let cur: any = obj;
  for (const part of path.split(".")) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = cur[part];
  }
  return cur;
}

function computeProgress(purchase: unknown) {
  const completed = STEP_DEFS.map((s) => Boolean(getByPath(purchase, s.key)));
  const firstIncomplete = completed.findIndex((c) => !c);
  const doneCount = completed.filter(Boolean).length;
  const total = STEP_DEFS.length;

  const steps = STEP_DEFS.map((s, idx) => ({
    key: s.key,
    label: s.label,
    phase: s.phase,
    status: completed[idx] ? "COMPLETED" : idx === firstIncomplete ? "ONGOING" : "PENDING",
  }));

  const overallStatus = doneCount === total ? "COMPLETED" : "ONGOING";
  const percent = total ? Math.round((doneCount / total) * 100) : 0;
  return { steps, overallStatus, percent };
}

export async function GET(req: NextRequest) {
  await connectMongo();

  const session = await getSession(req);
  if (!session) return jsonError("Unauthorized.", { status: 401 });

  const { limit, skip, page } = getPagination(req.nextUrl.searchParams);

  const query: Record<string, unknown> = {};
  if (session.role === "user") {
    if (!mongoose.isValidObjectId(session.subject)) return jsonError("Unauthorized.", { status: 401 });
    query.user = session.subject;
  } else if (!(await isAdmin(req))) {
    return jsonError("Unauthorized.", { status: 401 });
  }

  const items = await Purchase.find(query, null, { sort: { createdAt: -1 }, limit, skip })
    .populate("property", "title slug city state price currency images status")
    .populate("user", "email name")
    .lean();
  const total = await Purchase.countDocuments(query);

  const mapped = items.map((p: any) => ({
    ...p,
    progress: computeProgress(p),
  }));

  return jsonOk({ items: mapped, page, limit, total });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return jsonError("Unauthorized.", { status: 401 });
  await connectMongo();

  try {
    const body = await readJsonBody<{ userId?: string; propertyId?: string }>(req);
    const userId = String(body.userId ?? "").trim();
    const propertyId = String(body.propertyId ?? "").trim();
    if (!mongoose.isValidObjectId(userId)) return jsonError("Invalid userId.", { status: 400 });
    if (!mongoose.isValidObjectId(propertyId)) return jsonError("Invalid propertyId.", { status: 400 });

    const prop = await Property.findById(propertyId, { _id: 1, status: 1 }).lean();
    if (!prop) return jsonError("Property not found.", { status: 404 });

    const created = await Purchase.create({ user: userId, property: propertyId });
    await Property.updateOne({ _id: propertyId }, { $set: { status: "SOLD" } }).catch(() => {});

    return jsonOk(created.toJSON(), { status: 201 });
  } catch (err) {
    if (isMongoDuplicateKeyError(err)) return jsonError("Purchase already exists.", { status: 409 });
    if (err instanceof mongoose.Error.ValidationError) return jsonError(err.message, { status: 400 });
    return jsonError("Failed to create purchase.", { status: 500 });
  }
}

