import mongoose from 'mongoose';

// Global değişkeni tanımla (Vercel sunucusu yeniden başlasa bile bu kalır)
let cached = global.mongoose;

// Eğer önbellek yoksa oluştur
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);

    // Zaten bağlıysa var olan bağlantıyı kullan (Hız kazandırır ve hatayı önler)
    if (cached.conn) {
        console.log('MongoDB is already connected');
        return cached.conn;
    }

    // Bağlantı yoksa yeni bağlantı oluştur
    if (!cached.promise) {
        const opts = {
            dbName: 'propertypulse',
            bufferCommands: false, // Next.js 15 için bu false olmalı ki hemen hata fırlatsın
        };

        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};

export default connectToDatabase;

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
