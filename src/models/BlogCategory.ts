import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const BlogCategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  },
  { timestamps: true }
);

BlogCategorySchema.index({ name: 1 });

export type BlogCategoryDoc = InferSchemaType<typeof BlogCategorySchema>;

export const BlogCategory: Model<BlogCategoryDoc> =
  (mongoose.models.BlogCategory as Model<BlogCategoryDoc>) ||
  mongoose.model<BlogCategoryDoc>("BlogCategory", BlogCategorySchema);
