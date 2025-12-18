import connectToDatabase from "@/config/database";
import Property from "@/models/Property";
import { generateEmbedding } from "@/utils/generateEmbedding";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const queryText = searchParams.get("query");

        if (!queryText) {
            return NextResponse.json({ error: "Arama metni gerekli" }, { status: 400 });
        }

        // --- 1. AŞAMA: NİYET ANALİZİ (Intent Detection) ---
        // Kullanıcının cümlesinden filtreleri ayıkla
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Veritabanındaki geçerli tiplerimiz (Config dosyasından veya veritabanından alınabilir)
        const validTypes = "Apartment, Condo, House, Villa, Cottage, Room, Studio, Chalet";

        const prompt = `
      Kullanıcının arama sorgusunu analiz et ve aşağıdaki JSON formatında filtreleri çıkar.
      Sorgu: "${queryText}"
      
      Kurallar:
      1. 'type' alanı sadece şu listeden biri olabilir (En yakınını seç): ${validTypes}. Eğer emin değilsen null dön.
         - Örnek: "Dağ evi" -> "Cottage" veya "Chalet"
         - Örnek: "Yazlık" -> "House" veya "Villa"
         - Örnek: "Residence" -> "Condo" veya "Apartment"
      2. JSON dışında hiçbir şey yazma. Sadece saf JSON döndür.
      
      İstenen JSON Formatı:
      {
        "type": "string veya null"
      }
    `;

        const result = await model.generateContent(prompt);
        const textResponse = result.response.text();

        // JSON'u temizle (Bazen markdown ```json ... ``` dönebilir)
        const cleanedJson = textResponse.replace(/```json|```/g, "").trim();
        let filters = {};

        try {
            filters = JSON.parse(cleanedJson);
        } catch (e) {
            console.error("JSON Parse Hatası:", e);
        }

        console.log("🤖 Yapay Zeka Filtreleri:", filters);

        // --- 2. AŞAMA: VEKTÖR OLUŞTURMA ---
        const vector = await generateEmbedding(queryText);

        // --- 3. AŞAMA: MONGODB AGGREGATION (Hybrid Search) ---
        // Filtre varsa $match ekleyeceğiz, yoksa sadece vektör arayacağız.

        const pipeline = [];

        // A. Önce Vektör Araması (Her zaman çalışır)
        const vectorSearchStage = {
            "$vectorSearch": {
                "index": "vector_index",
                "path": "embedding",
                "queryVector": vector,
                "numCandidates": 100,
                "limit": 20
            }
        };

        // B. Eğer AI bir 'type' bulduysa, Vektör aramasının içine 'filter' ekle
        // Not: Atlas Vector Search'te 'filter' kullanmak için index tanımında da filterable field olması gerekir.
        // Şimdilik daha basit bir yöntemle: Vektörden gelenleri sonra filtreleyelim ($match ile)
        // (Büyük veride bu performanssızdır ama şu an 17 ev için en kolayı budur)

        pipeline.push(vectorSearchStage);

        // Filtreleme Aşaması
        if (filters.type) {
            pipeline.push({
                "$match": {
                    "type": filters.type // AI'nın bulduğu tip ile eşleşenleri al
                }
            });
        }

        // Projeksiyon (İstenen Alanlar)
        pipeline.push({
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
        });

        const results = await Property.aggregate(pipeline);

        return NextResponse.json(results);

    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}
