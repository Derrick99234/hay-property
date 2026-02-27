import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "../../../../lib/mongodb";
import { Purchase } from "../../../../models/Purchase";
import { getSession, isAdmin } from "../../_lib/auth";
import { jsonError, jsonOk, readJsonBody } from "../../_lib/http";

export const runtime = "nodejs";

const ALLOWED_STEP_KEYS = new Set([
  "development.phase1.clearingFencingGatehouse",
  "development.phase1.earthRoadDevelopment",
  "development.phase1.plotSetOut",
  "development.phase1.allocation",
  "development.phase2.streetLight",
  "development.phase2.finalRoadTarr",
]);

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) return jsonError("Unauthorized.", { status: 401 });
  await connectMongo();

  const params = await ctx.params;
  const id = String(params.id ?? "").trim();
  if (!mongoose.isValidObjectId(id)) return jsonError("Invalid id.", { status: 400 });

  const body = await readJsonBody<{ steps?: Record<string, boolean> }>(req);
  const steps = body.steps && typeof body.steps === "object" ? body.steps : null;
  if (!steps) return jsonError("Missing steps.", { status: 400 });

  const $set: Record<string, unknown> = {};
  const $unset: Record<string, "" | 1> = {};
  for (const [k, v] of Object.entries(steps)) {
    if (!ALLOWED_STEP_KEYS.has(k)) return jsonError("Invalid step key.", { status: 400 });
    if (v) $set[k] = new Date();
    else $unset[k] = 1;
  }

  const update: Record<string, unknown> = {};
  if (Object.keys($set).length) update.$set = $set;
  if (Object.keys($unset).length) update.$unset = $unset;
  if (!Object.keys(update).length) return jsonError("No updates.", { status: 400 });

  const doc = await Purchase.findByIdAndUpdate(id, update, { new: true, runValidators: true })
    .populate("property", "title slug city state price currency images status")
    .populate("user", "email name")
    .lean();
  if (!doc) return jsonError("Not found.", { status: 404 });
  return jsonOk(doc);
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  await connectMongo();

  const session = await getSession(req);
  if (!session) return jsonError("Unauthorized.", { status: 401 });

  const params = await ctx.params;
  const id = String(params.id ?? "").trim();
  if (!mongoose.isValidObjectId(id)) return jsonError("Invalid id.", { status: 400 });

  const doc = await Purchase.findById(id)
    .populate("property", "title slug city state price currency images status")
    .populate("user", "email name")
    .lean();
  if (!doc) return jsonError("Not found.", { status: 404 });

  if (session.role === "user") {
    const ownerId = String((doc as any).user?._id ?? "");
    if (!ownerId || ownerId !== session.subject) return jsonError("Not found.", { status: 404 });
  } else if (!(await isAdmin(req))) {
    return jsonError("Unauthorized.", { status: 401 });
  }

  return jsonOk(doc);
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin(req))) return jsonError("Unauthorized.", { status: 401 });
  await connectMongo();

  const params = await ctx.params;
  const id = String(params.id ?? "").trim();
  if (!mongoose.isValidObjectId(id)) return jsonError("Invalid id.", { status: 400 });

  const deleted = await Purchase.findByIdAndDelete(id).lean();
  if (!deleted) return jsonError("Not found.", { status: 404 });
  return jsonOk({ id: (deleted as { _id: unknown })._id });
}
