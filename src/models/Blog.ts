import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String },
    content: { type: String },
    category: { type: String, trim: true },
    coverUrl: { type: String, trim: true },

    published: { type: Boolean, default: false },
    publishedAt: { type: Date },

    author: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

BlogSchema.index({ author: 1, createdAt: -1 });
BlogSchema.index({ published: 1, publishedAt: -1 });

export type BlogDoc = InferSchemaType<typeof BlogSchema>;

export const Blog: Model<BlogDoc> =
  (mongoose.models.Blog as Model<BlogDoc>) || mongoose.model<BlogDoc>("Blog", BlogSchema);

