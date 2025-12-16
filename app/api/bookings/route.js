import connectToDatabase from "@/config/database";
import Booking from "@/models/Booking";
import Message from "@/models/Message";
import Property from "@/models/Property";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectToDatabase();

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
        }

        const body = await request.json();
        const { property_id, check_in, check_out, total_price, total_days } = body;

        if (!property_id || !check_in || !check_out || !total_price) {
            return NextResponse.json({ error: "Eksik bilgi." }, { status: 400 });
        }

        // 1. Rezervasyonu Kaydet
        const newBooking = new Booking({
            property: property_id,
            user: session.user.id,
            check_in,
            check_out,
            total_days,
            total_price,
            status: "pending"
        });

        await newBooking.save();

        // 2. Otomatik Bilgilendirme Mesajı Oluştur
        try {
            const property = await Property.findById(property_id);

            if (property) {
                const messageData = {
                    sender: property.owner, // Gönderen: Ev Sahibi
                    recipient: session.user.id, // Alan: Rezervasyonu Yapan
                    property: property_id,
                    name: "Property System", // Mesaj başlığı
                    email: session.user.email || "system@propertypulse.com",
                    phone: "000-000-0000", // Zorunlu alan hatası almamak için placeholder
                    body: `Merhaba ${session.user.name || ''}! \n"${property.name}" için rezervasyon talebiniz başarıyla alındı. \n\n📅 Tarihler: ${new Date(check_in).toLocaleDateString()} - ${new Date(check_out).toLocaleDateString()} \n💰 Toplam Tutar: $${total_price} \n\nEv sahibi en kısa sürede onay verecektir.`,
                    read: false
                };

                await Message.create(messageData);
            }
        } catch (msgError) {
            // Mesaj hatası rezervasyon sürecini bozmasın, sadece loglayalım
            console.error("Otomatik mesaj oluşturulamadı:", msgError);
        }

        return NextResponse.json(
            { message: "Rezervasyon talebiniz alındı!", booking: newBooking },
            { status: 201 }
        );

    } catch (error) {
        console.error("Booking Hatası:", error);
        return NextResponse.json(
            { error: "Bir hata oluştu." },
            { status: 500 }
        );
    }
}
