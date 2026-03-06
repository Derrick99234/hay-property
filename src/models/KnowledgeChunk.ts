import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const KnowledgeChunkSchema = new Schema(
  {
    sourceType: { type: String, required: true, trim: true },
    sourceId: { type: String, required: true, trim: true },
    chunkIndex: { type: Number, required: true },

    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    contentHash: { type: String, required: true, trim: true },

    embeddingModel: { type: String, default: "none", trim: true },
    embedding: { type: [Number], default: [] },
  },
  { timestamps: true }
);

KnowledgeChunkSchema.index({ sourceType: 1, sourceId: 1, chunkIndex: 1 }, { unique: true });
KnowledgeChunkSchema.index({ updatedAt: -1 });
KnowledgeChunkSchema.index({ title: "text", content: "text" });

export type KnowledgeChunkDoc = InferSchemaType<typeof KnowledgeChunkSchema>;

export const KnowledgeChunk: Model<KnowledgeChunkDoc> =
  (mongoose.models.KnowledgeChunk as Model<KnowledgeChunkDoc>) ||
  mongoose.model<KnowledgeChunkDoc>("KnowledgeChunk", KnowledgeChunkSchema);
