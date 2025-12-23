import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions"; // Senin path'in
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        await connectDB();

        // 1. Kim İstiyor? (Session Kontrolü)
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const start = parseInt(searchParams.get("_start")) || 0;
        const end = parseInt(searchParams.get("_end")) || 10;

        // 2. Filtreleme Mantığı
        let query = {};

        // Eğer kullanıcı 'admin' DEĞİLSE, sadece kendi ilanlarını görsün
        if (session.user.role !== 'admin') {
            query = { owner: session.user.id };
        }

        // 3. Verileri Çek
        const total = await Property.countDocuments(query);
        const properties = await Property.find(query)
            .sort({ createdAt: -1 })
            .skip(start)
            .limit(end - start)
            .populate("owner", "username email"); // Sahibinin adını da getir

        const response = NextResponse.json(properties);
        response.headers.set("x-total-count", total.toString());
        response.headers.set("Access-Control-Expose-Headers", "x-total-count");

        return response;

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// İlan Ekleme (POST)
export async function POST(request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();

        // Yeni ilanı, isteği yapan kişinin ID'siyle oluştur
        const newProperty = await Property.create({
            ...body,
            owner: session.user.id
        });

        return NextResponse.json(newProperty);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
