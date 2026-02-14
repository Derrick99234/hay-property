import mongoose from "mongoose";

type MongooseGlobal = typeof globalThis & {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const globalForMongoose = globalThis as MongooseGlobal;

export async function connectMongo() {
  const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hay_property";
  if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI in environment.");
  }

  if (!globalForMongoose.mongoose) {
    globalForMongoose.mongoose = { conn: null, promise: null };
  }

  if (globalForMongoose.mongoose.conn) return globalForMongoose.mongoose.conn;

  if (!globalForMongoose.mongoose.promise) {
    globalForMongoose.mongoose.promise = mongoose.connect(MONGODB_URI, {
      dbName: undefined,
    });
  }

  globalForMongoose.mongoose.conn = await globalForMongoose.mongoose.promise;
  return globalForMongoose.mongoose.conn;
}
