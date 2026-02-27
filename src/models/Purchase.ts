import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const Phase1Schema = new Schema(
  {
    clearingFencingGatehouse: { type: Date, default: undefined },
    earthRoadDevelopment: { type: Date, default: undefined },
    plotSetOut: { type: Date, default: undefined },
    allocation: { type: Date, default: undefined },
  },
  { _id: false }
);

const Phase2Schema = new Schema(
  {
    streetLight: { type: Date, default: undefined },
    finalRoadTarr: { type: Date, default: undefined },
  },
  { _id: false }
);

const PurchaseSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    property: { type: Schema.Types.ObjectId, ref: "Property", required: true, index: true },
    purchasedAt: { type: Date, default: () => new Date() },
    development: {
      phase1: { type: Phase1Schema, default: () => ({}) },
      phase2: { type: Phase2Schema, default: () => ({}) },
    },
  },
  { timestamps: true }
);

PurchaseSchema.index({ user: 1, property: 1 }, { unique: true });
PurchaseSchema.index({ createdAt: -1 });

export type PurchaseDoc = InferSchemaType<typeof PurchaseSchema>;

export const Purchase: Model<PurchaseDoc> =
  (mongoose.models.Purchase as Model<PurchaseDoc>) || mongoose.model<PurchaseDoc>("Purchase", PurchaseSchema);

