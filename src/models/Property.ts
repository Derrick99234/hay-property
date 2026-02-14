import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const PropertyImageSchema = new Schema(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const GeoPointSchema = new Schema(
  {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: {
      type: [Number],
      default: undefined,
      validate: {
        validator: (v: number[]) => !v || v.length === 2,
        message: "coordinates must be [lng, lat]",
      },
    },
  },
  { _id: false }
);

const PropertySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String },

    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "NGN" },
    status: { type: String, enum: ["DRAFT", "AVAILABLE", "SOLD"], default: "DRAFT" },

    address: { type: String },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, default: "Nigeria", trim: true },

    location: { type: GeoPointSchema, default: undefined },
    metadata: { type: Schema.Types.Mixed, default: undefined },

    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    images: { type: [PropertyImageSchema], default: [] },
  },
  { timestamps: true }
);

PropertySchema.index({ createdBy: 1, createdAt: -1 });
PropertySchema.index({ status: 1 });
PropertySchema.index({ city: 1, state: 1 });
PropertySchema.index({ location: "2dsphere" });

export type PropertyDoc = InferSchemaType<typeof PropertySchema>;

export const Property: Model<PropertyDoc> =
  (mongoose.models.Property as Model<PropertyDoc>) ||
  mongoose.model<PropertyDoc>("Property", PropertySchema);

