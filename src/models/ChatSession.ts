import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const ChatMessageSchema = new Schema(
  {
    role: { type: String, required: true, trim: true },
    text: { type: String, required: true },
    at: { type: Date, required: true },
  },
  { _id: false }
);

const ChatSessionSchema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true, trim: true },
    expiresAt: { type: Date, required: true },
    messages: { type: [ChatMessageSchema], default: [] },
  },
  { timestamps: true }
);

ChatSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type ChatSessionDoc = InferSchemaType<typeof ChatSessionSchema>;

export const ChatSession: Model<ChatSessionDoc> =
  (mongoose.models.ChatSession as Model<ChatSessionDoc>) ||
  mongoose.model<ChatSessionDoc>("ChatSession", ChatSessionSchema);

