import mongoose from "mongoose";

const MONGODB_URI = process.env.DATABASE_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the DATABASE_URI environment variable.");
}

const dbConnect = async (): Promise<void> => {
  if (mongoose.connection.readyState > 1) return;
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
};

export default dbConnect;
