import mongoose from "mongoose";

let isConnected = false;

const connectToDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("Connected to Database");
    } catch (err) {
        console.error("Database connection failed:", err);
        throw new Error("Database connection failed");
    }
};

export default connectToDB;
