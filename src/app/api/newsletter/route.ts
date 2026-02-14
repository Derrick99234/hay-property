import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import { connectMongo } from "../../../lib/mongodb";
import { NewsletterSubscriber } from "../../../models/NewsletterSubscriber";
import { isMongoDuplicateKeyError, jsonError, jsonOk } from "../_lib/http";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { email?: string; source?: string };
    const email = body.email?.trim().toLowerCase();
    if (!email || !email.includes("@")) return jsonError("Invalid email.", { status: 400 });

    await connectMongo();
    await NewsletterSubscriber.create({ email, source: body.source });
    return jsonOk({ email });
  } catch (err) {
    if (isMongoDuplicateKeyError(err)) return jsonOk({ subscribed: true });
    if (err instanceof mongoose.Error.ValidationError) return jsonError(err.message, { status: 400 });
    const msg = err instanceof Error ? err.message : "";
    if (/ECONNREFUSED|ServerSelection|TopologyDescription|failed to connect/i.test(msg)) {
      return jsonError("Newsletter service is temporarily unavailable.", { status: 503 });
    }
    return jsonError("Failed to subscribe.", { status: 500 });
  }
}
