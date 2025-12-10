import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectToDatabase() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        mongoose.set("strictQuery", true);

        const opts = {
            dbName: "propertypulse",
            bufferCommands: true,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        };

        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((m) => m);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}



// import mongoose from 'mongoose';

// let cached = global.mongoose;

// if (!cached) {
//     cached = global.mongoose = { conn: null, promise: null };
// }

// const connectToDatabase = async () => {
//     mongoose.set('strictQuery', true);

//     if (cached.conn) {
//         console.log('MongoDB is already connected');
//         return cached.conn;
//     }

//     if (!cached.promise) {
//         const opts = {
//             dbName: 'propertypulse',
//             bufferCommands: true, // <--- BURASI ÇOK ÖNEMLİ: TRUE OLMALI
//             serverSelectionTimeoutMS: 5000,
//             socketTimeoutMS: 45000,
//         };

//         cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
//             return mongoose;
//         });
//     }

//     try {
//         cached.conn = await cached.promise;
//     } catch (e) {
//         cached.promise = null;
//         throw e;
//     }

//     return cached.conn;
// };

// export default connectToDatabase;

// import mongoose from "mongoose";

// let isConnected = false; // Track the connection status

// const connectToDatabase = async () => {
//     mongoose.set('strictQuery', true); // Enable strict query mode

//     if (isConnected) {
//         console.log("Already connected to the database.");
//         return;
//     }

//     try {
//         await mongoose.connect(process.env.MONGODB_URI, {
//             serverSelectionTimeoutMS: 30000,
//         });
//         isConnected = true;
//         console.log("Successfully connected to the database.");
//     } catch (error) {
//         console.error("Error connecting to the database:", error);
//         throw error;
//     }
// };


// export default connectToDatabase;
