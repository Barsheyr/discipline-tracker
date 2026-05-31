import mongoose from "mongoose";
let isConnected = false;
export async function connectDB() {
    if (isConnected)
        return;
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/discipline-tracker";
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB connected");
}
