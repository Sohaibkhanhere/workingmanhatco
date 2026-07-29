import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose;
let mongod: MongoMemoryServer | null = (global as any).mongod;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  let uri = MONGODB_URI;

  if (!uri || uri.includes('localhost')) {
    if (!mongod) {
      mongod = await MongoMemoryServer.create();
      (global as any).mongod = mongod;
    }
    uri = mongod.getUri();
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
