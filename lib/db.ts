import mongoose from "mongoose";
import "@/lib/models/user";
import "@/lib/models/product";
import "@/lib/models/cart";
import "@/lib/models/order";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

// global cache (Next.js hot reload fix)
let cached: { conn: typeof import("mongoose") | null; promise: Promise<typeof import("mongoose")> | null } = { conn: null, promise: null };

if (!cached) {
  cached = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
