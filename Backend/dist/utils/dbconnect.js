import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mydb";
/**
 * Connect to MongoDB
 */
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("✅ MongoDB Connected Successfully!");
    }
    catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1); // Exit the process with failure
    }
};
export default connectDB;
