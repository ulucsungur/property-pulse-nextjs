import connectToDatabase from "@/config/database";
import Property from "@/models/Property";
import { generateEmbedding } from "@/utils/generateEmbedding";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectToDatabase();

        // Filtre yok! Hepsini getir.
        const properties = await Property.find({});

        let count = 0;

        // Tüm evleri döngüye sok
        for (const prop of properties) {
            const textToEmbed = `
        Title: ${prop.name}
        Type: ${prop.type}
        Description: ${prop.description}
        Amenities: ${prop.amenities ? prop.amenities.join(", ") : ""}
        Location: ${prop.location?.city}, ${prop.location?.state}
        Features: ${prop.beds} beds, ${prop.baths} baths
      `;

            try {
                // Vektörü oluştur
                const vector = await generateEmbedding(textToEmbed);

                // Vektör dolu mu kontrol et
                if (vector && vector.length > 0) {
                    prop.embedding = vector;
                    await prop.save();
                    count++;
                    console.log(`✅ GÜNCELLENDİ: ${prop.name}`);
                } else {
                    console.log(`⚠️ BOŞ VEKTÖR DÖNDÜ: ${prop.name}`);
                }

            } catch (err) {
                console.error(`❌ HATA (${prop.name}):`, err.message);
            }
        }

        return NextResponse.json({
            message: "Tüm kayıtlar zorla güncellendi.",
            processed: count
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
