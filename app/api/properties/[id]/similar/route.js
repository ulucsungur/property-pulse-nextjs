import connectToDatabase from "@/config/database";
import Property from "@/models/Property";
import { NextResponse } from "next/server";

// Dinamik olmasını zorunlu kılıyoruz ki her istekte yeni veri baksın
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
    try {
        await connectToDatabase();

        // URL'den ID'yi al
        const { id } = await params;

        // 1. Şu an baktığımız evin 'embedding' (vektör) verisini çek
        const currentProperty = await Property.findById(id).select('embedding');

        // Eğer evin vektörü yoksa (eski kayıt vs.) boş dön
        if (!currentProperty || !currentProperty.embedding || currentProperty.embedding.length === 0) {
            return NextResponse.json([]);
        }

        // 2. MongoDB Atlas Vector Search ile benzerlerini ara
        const similarProperties = await Property.aggregate([
            {
                "$vectorSearch": {
                    "index": "vector_index", // Atlas'ta kurduğumuz index adı
                    "path": "embedding",
                    "queryVector": currentProperty.embedding, // Referans vektörümüz
                    "numCandidates": 50, // Performans için aday havuzu
                    "limit": 4 // Kendisi dahil 4 tane getir
                }
            },
            {
                "$match": {
                    "_id": { "$ne": currentProperty._id } // Kendisini listeden çıkar
                }
            },
            {
                "$limit": 3 // Geriye kalan en iyi 3 taneyi al
            },
            {
                "$project": { // Sadece lazım olan alanları gönder (Trafik tasarrufu)
                    "_id": 1,
                    "name": 1,
                    "type": 1,
                    "location": 1,
                    "beds": 1,
                    "baths": 1,
                    "square_feet": 1,
                    "images": 1,
                    "rates": 1,
                    "score": { "$meta": "vectorSearchScore" }
                }
            }
        ]);

        return NextResponse.json(similarProperties);

    } catch (error) {
        console.error("Benzer ilanlar API hatası:", error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}
