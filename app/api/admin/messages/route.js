import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const start = parseInt(searchParams.get("_start")) || 0;
        const end = parseInt(searchParams.get("_end")) || 10;

        // Sadece bana (session.user.id) gelen mesajları getir
        // Veya Adminsem tüm mesajları görebilirim (Opsiyonel, şimdilik sadece alıcı görsün)
        const query = { recipient: session.user.id };

        const total = await Message.countDocuments(query);

        const messages = await Message.find(query)
            .sort({ createdAt: -1 }) // En yeni en üstte
            .skip(start)
            .limit(end - start)
            .populate("property", "name"); // Hangi ilan için geldiğini görmek için

        const response = NextResponse.json(messages);
        response.headers.set("x-total-count", total.toString());

        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
