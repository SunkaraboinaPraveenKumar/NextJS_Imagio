import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose || { conn: null, promise: null };

if (!cached.conn) {
    (global as any).mongoose = cached;
}

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    if (!MONGODB_URL) throw new Error('MONGODB_URL is missing');

    try {
        cached.promise = cached.promise || mongoose.connect(
            MONGODB_URL,
            { dbName: 'prav_imagio', bufferCommands: false }
        );

        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        throw new Error("Failed to connect to MongoDB");
    }
}
