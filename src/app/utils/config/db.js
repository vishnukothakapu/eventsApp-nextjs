import mongoose from "mongoose";

let isConnected = false;

const connectToDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    try {
        const uri = process.env.MONGO_URI;

        if (!uri) {
            throw new Error("MONGODB_URI is not defined in environment variables.");
        }

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000,
        });

        isConnected = true;
        console.log("Connected to MongoDB Atlas");
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        throw new Error("Database connection failed");
    }
};

export default connectToDB;
