import mongoose from "mongoose";
import 'dotenv/config'

export default async function dbconnect() {
    if (mongoose.connection.readyState >= 1) {
        console.log("Already connected to MongoDB");
        return;
    }

    try {
        await mongoose.connect(process.env.DATABASE_URL || "");
        console.log("DB connection successful");
    } catch (error) {
        console.error("Error in DB connection:", error);
        process.exit(1); 
    }
}
