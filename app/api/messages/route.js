import connectToDatabase from "@/config/database";
import Message from "@/models/Message";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// POST: Yeni Mesaj Gönder (Veya Cevap Yaz)
export async function POST(request) {
    try {
        await connectToDatabase();

        const { name, email, phone, body, property, recipient } = await request.json();

        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { message: "You must be logged in to send a message" },
                { status: 401 }
            );
        }

        const { user } = session;

        // Kendine mesaj atamama kontrolü (İsteğe bağlı, cevaplaşmada gerekmez ama güvenlik için durabilir)
        if (user.id === recipient) {
            return NextResponse.json(
                { message: "Can not send message to yourself" },
                { status: 400 }
            );
        }

        const newMessage = new Message({
            sender: user.id,    // Gönderen: Şu anki oturum açmış kullanıcı
            recipient,          // Alan: Karşı tarafın ID'si
            property,           // İlgili Evin ID'si
            name,
            email,
            phone,
            body: body,
            read: false,
        });

        await newMessage.save();

        return NextResponse.json({ message: "Message Sent" }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
