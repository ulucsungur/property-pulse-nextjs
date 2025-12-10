import mongoose from "mongoose";

let isConnected = false;

const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);

    // 1. Mongoose'un kendi bağlantı durumunu kontrol et (Daha güvenli)
    if (mongoose.connections.length > 0) {
        isConnected = mongoose.connections[0].readyState;
        if (isConnected === 1) {
            console.log("Already connected to the database.");
            return;
        }
        await mongoose.disconnect();
    }

    try {
        // 2. Bağlantıyı başlat
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'property-pulse', // Veritabanı adını buraya yazıyoruz (Garanti olsun)
            bufferCommands: false,    // Vercel için önemli: Bağlantı yoksa bekleme, hata ver
            serverSelectionTimeoutMS: 5000, // 30sn yerine 5sn (Vercel limitine takılmamak için)
        });

        isConnected = true;
        console.log("Successfully connected to the database.");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        // Hatayı fırlatma, sadece logla (Bazen anlık kopmalar olabilir)
    }
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
