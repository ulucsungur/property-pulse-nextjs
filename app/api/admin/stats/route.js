import connectToDB from '@/config/database';
import Property from '@/models/Property';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        await connectToDB();

        // 1. KPI Verileri (Toplam Sayılar)
        const totalProperties = await Property.countDocuments();
        const totalUsers = await User.countDocuments();

        // 2. Pie Chart Verisi (Kategorilere Göre)
        const propertyTypes = await Property.aggregate([
            {
                $group: {
                    _id: "$type", // "Apartment", "Villa" vb.
                    count: { $sum: 1 }
                }
            }
        ]);

        // 3. Bar Chart Verisi (Aylık İlanlar - Son 6 Ay)
        // Not: Veritabanında tarih alanı 'createdAt' olmalıdır.
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyStats = await Property.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo } // Son 6 aydakileri al
                }
            },
            {
                $group: {
                    // Tarihi YYYY-MM formatına çevirip grupluyoruz (Örn: 2025-12)
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } } // Tarihe göre eskiden yeniye sırala
        ]);

        // 4. Veriyi Birleştirip Gönder
        const responseData = {
            kpi: {
                totalProperties,
                totalUsers
            },
            charts: {
                propertyTypes,
                monthly: monthlyStats // <--- İşte eksik olan parça buydu!
            }
        };

        return NextResponse.json(responseData, { status: 200 });

    } catch (error) {
        console.error("Admin Stats Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// import connectDB from "@/config/database";
// import Property from "@/models/Property";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// export const dynamic = 'force-dynamic';

// export async function GET(request) {
//     try {
//         console.log("--- ADMIN STATS API BAŞLADI ---");

//         await connectDB();
//         console.log("✅ Veritabanı bağlantısı başarılı");

//         // 1. Kullanıcı Sayısını Kontrol Et
//         const totalUsers = await User.countDocuments();
//         console.log(`📊 Toplam Kullanıcı: ${totalUsers}`);

//         // 2. İlan Sayısını Kontrol Et
//         const totalProperties = await Property.countDocuments();
//         console.log(`🏠 Toplam İlan: ${totalProperties}`);

//         // 3. Kategori Dağılımı
//         const categoryStats = await Property.aggregate([
//             { $group: { _id: "$type", count: { $sum: 1 } } },
//         ]);

//         // 4. Rol Dağılımı
//         const userRoleStats = await User.aggregate([
//             { $group: { _id: "$role", count: { $sum: 1 } } },
//         ]);
//         console.log("📈 İstatistikler hesaplandı");

//         return NextResponse.json({
//             kpi: {
//                 totalUsers,
//                 totalProperties,
//             },
//             charts: {
//                 propertyTypes: categoryStats.map((item) => ({
//                     name: item._id || "Tanımsız",
//                     value: item.count,
//                 })),
//                 userRoles: userRoleStats.map((item) => ({
//                     name: item._id || "Bilinmiyor",
//                     value: item.count,
//                 })),
//             },
//         });

//     } catch (error) {
//         console.error("❌ API HATASI DETAYI:", error);
//         return NextResponse.json(
//             { error: "İstatistik verisi alınamadı: " + error.message },
//             { status: 500 }
//         );
//     }
// }
