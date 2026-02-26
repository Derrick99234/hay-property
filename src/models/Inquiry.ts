import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const InquirySchema = new Schema(
  {
    type: { type: String, enum: ["INSPECTION", "INFO"], required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    propertySlug: { type: String, trim: true },
    propertyTitle: { type: String, trim: true },

    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    message: { type: String, trim: true },

    inspectionDate: { type: String, trim: true },
    inspectionTime: { type: String, trim: true },
    peopleCount: { type: Number, min: 1, max: 20 },

    status: { type: String, enum: ["NEW", "PROCESSED"], default: "NEW" },
  },
  { timestamps: true }
);

InquirySchema.index({ createdAt: -1 });
InquirySchema.index({ propertyId: 1, createdAt: -1 });

export type InquiryDoc = InferSchemaType<typeof InquirySchema>;

export const Inquiry: Model<InquiryDoc> =
  (mongoose.models.Inquiry as Model<InquiryDoc>) || mongoose.model<InquiryDoc>("Inquiry", InquirySchema);

