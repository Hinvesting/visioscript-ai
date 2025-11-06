import dbConnect from "@/lib/db";

// Adapter to expose a `connectDB` named export expected by routes.
export async function connectDB() {
  return dbConnect();
}

export default connectDB;
