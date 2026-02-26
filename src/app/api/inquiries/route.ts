import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "../../../lib/mongodb";
import { Inquiry } from "../../../models/Inquiry";
import { Property } from "../../../models/Property";
import { jsonError, jsonOk, readJsonBody } from "../_lib/http";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  await connectMongo();
  try {
    const body = await readJsonBody<{
      type?: "INSPECTION" | "INFO";
      propertyId?: string;
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
      inspectionDate?: string;
      inspectionTime?: string;
      peopleCount?: number;
    }>(req);

    const type = body.type === "INFO" ? "INFO" : "INSPECTION";
    const propertyId = String(body.propertyId ?? "");
    const name = String(body.name ?? "").trim();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const inspectionDate = typeof body.inspectionDate === "string" ? body.inspectionDate.trim() : "";
    const inspectionTime = typeof body.inspectionTime === "string" ? body.inspectionTime.trim() : "";
    const peopleCount = typeof body.peopleCount === "number" ? body.peopleCount : undefined;

    if (!mongoose.isValidObjectId(propertyId)) return jsonError("Invalid propertyId.", { status: 400 });
    if (name.length < 2) return jsonError("Name is required.", { status: 400 });
    if (!email && !phone) return jsonError("Please provide email or phone.", { status: 400 });

    const property = await Property.findById(propertyId, { slug: 1, title: 1, status: 1 }).lean();
    if (!property) return jsonError("Property not found.", { status: 404 });

    const created = await Inquiry.create({
      type,
      propertyId,
      propertySlug: String((property as any).slug ?? ""),
      propertyTitle: String((property as any).title ?? ""),
      name,
      email: email || undefined,
      phone: phone || undefined,
      message: message || undefined,
      inspectionDate: inspectionDate || undefined,
      inspectionTime: inspectionTime || undefined,
      peopleCount,
      status: "NEW",
    });

    const subject = encodeURIComponent(`${type === "INSPECTION" ? "Book Inspection" : "Request Info"}: ${String((property as any).title ?? "")}`);
    const lines = [
      `Type: ${type}`,
      `Property: ${String((property as any).title ?? "")}`,
      `Slug: ${String((property as any).slug ?? "")}`,
      `Name: ${name}`,
      email ? `Email: ${email}` : "",
      phone ? `Phone: ${phone}` : "",
      inspectionDate ? `Inspection date: ${inspectionDate}` : "",
      inspectionTime ? `Inspection time: ${inspectionTime}` : "",
      typeof peopleCount === "number" ? `People: ${peopleCount}` : "",
      message ? `Message: ${message}` : "",
    ].filter(Boolean);

    const mailto = `mailto:info@hayproperties.com?subject=${subject}&body=${encodeURIComponent(lines.join("\n"))}`;

    return jsonOk({ id: String((created as any)._id), mailto });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) return jsonError(err.message, { status: 400 });
    return jsonError("Failed to submit inquiry.", { status: 500 });
  }
}

