import connectDB from "@/config/database";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();

        // Rolü olmayan herkesi bul ve 'customer' yap
        const result = await User.updateMany(
            { role: { $exists: false } }, // Rol alanı olmayanlar
            {
                $set: {
                    role: "customer",
                    status: "active"
                }
            }
        );

        return NextResponse.json({
            message: "Veritabanı güncellendi",
            updatedCount: result.modifiedCount
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
