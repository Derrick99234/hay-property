import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    status: { type: String, enum: ["ACTIVE", "DISABLED"], default: "ACTIVE" },
    wishlist: { type: [Schema.Types.ObjectId], ref: "Property", default: [] },
  },
  { timestamps: true }
);

UserSchema.index({ createdAt: -1 });

UserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete (ret as { passwordHash?: unknown }).passwordHash;
    return ret;
  },
});

export type UserDoc = InferSchemaType<typeof UserSchema>;

if (process.env.NODE_ENV !== "production") {
  delete (mongoose.models as Record<string, unknown>).User;
}

export const User: Model<UserDoc> =
  (mongoose.models.User as Model<UserDoc>) || mongoose.model<UserDoc>("User", UserSchema);
