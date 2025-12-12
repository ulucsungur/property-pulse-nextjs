import connectToDatabase from "@/config/database"; // İsim düzeltildi
import Property from "@/models/Property";
import { generateEmbedding } from "@/utils/generateEmbedding";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Senin fonksiyon isminle bağlantı
        await connectToDatabase();

        const properties = await Property.find({ embedding: { $exists: false } });

        if (properties.length === 0) {
            return NextResponse.json({ message: "Güncellenecek mülk kalmadı, hepsi tamam!" });
        }

        let count = 0;
        const errors = [];

        for (const prop of properties) {
            const textToEmbed = `
        Title: ${prop.name}
        Type: ${prop.type}
        Description: ${prop.description}
        Amenities: ${prop.amenities ? prop.amenities.join(", ") : ""}
        Location: ${prop.location?.city}, ${prop.location?.state}, ${prop.location?.street}
        Features: ${prop.beds} beds, ${prop.baths} baths, ${prop.square_feet} sqft
      `;

            try {
                const vector = await generateEmbedding(textToEmbed);
                prop.embedding = vector;
                await prop.save();
                count++;
                console.log(`OK: ${prop.name}`);
            } catch (err) {
                console.error(`HATA (${prop.name}):`, err);
                errors.push(prop.name);
            }
        }

        return NextResponse.json({
            success: true,
            processed: count,
            errors: errors
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
