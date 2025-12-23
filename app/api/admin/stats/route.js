import connectDB from "@/config/database";
import Property from "@/models/Property";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        console.log("--- ADMIN STATS API BAŞLADI ---");

        await connectDB();
        console.log("✅ Veritabanı bağlantısı başarılı");

        // 1. Kullanıcı Sayısını Kontrol Et
        const totalUsers = await User.countDocuments();
        console.log(`📊 Toplam Kullanıcı: ${totalUsers}`);

        // 2. İlan Sayısını Kontrol Et
        const totalProperties = await Property.countDocuments();
        console.log(`🏠 Toplam İlan: ${totalProperties}`);

        // 3. Kategori Dağılımı
        const categoryStats = await Property.aggregate([
            { $group: { _id: "$type", count: { $sum: 1 } } },
        ]);

        // 4. Rol Dağılımı
        const userRoleStats = await User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } },
        ]);
        console.log("📈 İstatistikler hesaplandı");

        return NextResponse.json({
            kpi: {
                totalUsers,
                totalProperties,
            },
            charts: {
                propertyTypes: categoryStats.map((item) => ({
                    name: item._id || "Tanımsız",
                    value: item.count,
                })),
                userRoles: userRoleStats.map((item) => ({
                    name: item._id || "Bilinmiyor",
                    value: item.count,
                })),
            },
        });

    } catch (error) {
        console.error("❌ API HATASI DETAYI:", error);
        return NextResponse.json(
            { error: "İstatistik verisi alınamadı: " + error.message },
            { status: 500 }
        );
    }
}
