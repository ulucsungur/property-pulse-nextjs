import connectToDatabase from "@/config/database";
import Booking from "@/models/Booking";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions"; // authOptions yolun farklıysa güncelle
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectToDatabase();

        // 1. Kullanıcı giriş yapmış mı kontrol et
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Rezervasyon yapmak için giriş yapmalısınız." },
                { status: 401 }
            );
        }

        // 2. Formdan gelen verileri al
        const body = await request.json();
        const { property_id, check_in, check_out, total_price, total_days } = body;

        // 3. Basit bir doğrulama
        if (!property_id || !check_in || !check_out || !total_price) {
            return NextResponse.json(
                { error: "Eksik bilgi gönderildi." },
                { status: 400 }
            );
        }

        // 4. Yeni rezervasyonu oluştur
        const newBooking = new Booking({
            property: property_id,
            user: session.user.id, // Giriş yapan kullanıcının ID'si
            check_in,
            check_out,
            total_days,
            total_price,
            status: "pending" // Varsayılan olarak beklemede
        });

        await newBooking.save();

        return NextResponse.json(
            { message: "Rezervasyon talebiniz alındı!", booking: newBooking },
            { status: 201 }
        );

    } catch (error) {
        console.error("Booking Error:", error);
        return NextResponse.json(
            { error: "Rezervasyon oluşturulurken bir hata oluştu." },
            { status: 500 }
        );
    }
}
