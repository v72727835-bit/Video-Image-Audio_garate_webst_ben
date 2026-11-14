import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Preserve connection across hot reloads in dev / serverless invocations.
const globalForMongoose = global as unknown as { _mongoose?: Cached };
const cached: Cached = globalForMongoose._mongoose || { conn: null, promise: null };
globalForMongoose._mongoose = cached;

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (MongoDB Atlas or local mongod)."
    );
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB || "lumina_studio",
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
