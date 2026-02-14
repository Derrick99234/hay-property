import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const NewsletterSubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    source: { type: String, trim: true },
  },
  { timestamps: true }
);

NewsletterSubscriberSchema.index({ createdAt: -1 });

export type NewsletterSubscriberDoc = InferSchemaType<typeof NewsletterSubscriberSchema>;

export const NewsletterSubscriber: Model<NewsletterSubscriberDoc> =
  (mongoose.models.NewsletterSubscriber as Model<NewsletterSubscriberDoc>) ||
  mongoose.model<NewsletterSubscriberDoc>("NewsletterSubscriber", NewsletterSubscriberSchema);

