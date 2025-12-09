import mongoose from "mongoose";

let isConnected = false; // Track the connection status

const connectToDatabase = async () => {
    mongoose.set('strictQuery', true); // Enable strict query mode

    if (isConnected) {
        console.log("Already connected to the database.");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 30000,
        });
        isConnected = true;
        console.log("Successfully connected to the database.");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error;
    }
};


export default connectToDatabase;
