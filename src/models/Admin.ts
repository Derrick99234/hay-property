import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    status: { type: String, enum: ["ACTIVE", "DISABLED"], default: "ACTIVE" },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

AdminSchema.index({ createdAt: -1 });

AdminSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete (ret as { passwordHash?: unknown }).passwordHash;
    return ret;
  },
});

export type AdminDoc = InferSchemaType<typeof AdminSchema>;

export const Admin: Model<AdminDoc> =
  (mongoose.models.Admin as Model<AdminDoc>) || mongoose.model<AdminDoc>("Admin", AdminSchema);
