import connectToDatabase from "@/config/database"; // İsim düzeltildi
import Property from "@/models/Property";
import { generateEmbedding } from "@/utils/generateEmbedding";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        // Senin fonksiyon isminle bağlantıyı çağırıyoruz
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const queryText = searchParams.get("query");

        if (!queryText) {
            return NextResponse.json({ error: "Arama metni gerekli" }, { status: 400 });
        }

        const vector = await generateEmbedding(queryText);

        const results = await Property.aggregate([
            {
                "$vectorSearch": {
                    "index": "vector_index",
                    "path": "embedding",
                    "queryVector": vector,
                    "numCandidates": 100,
                    "limit": 20
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "name": 1,
                    "type": 1,
                    "description": 1,
                    "location": 1,
                    "images": 1,
                    "beds": 1,
                    "baths": 1,
                    "square_feet": 1,
                    "rates": 1,
                    "score": { "$meta": "vectorSearchScore" }
                }
            }
        ]);

        return NextResponse.json(results);

    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}
