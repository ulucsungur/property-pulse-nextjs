import connectToDatabase from "@/config/database";
import Property from "@/models/Property";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { NextResponse } from "next/server";

// GET: Tek bir ilanı getir
export async function GET(request, { params }) {
    try {
        await connectToDatabase();
        const { id } = await params; // Next.js 15 için await şart

        const property = await Property.findById(id);

        if (!property) {
            return NextResponse.json({ message: "Property Not Found" }, { status: 404 });
        }

        return NextResponse.json(property);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}

// DELETE: İlanı Sil
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        // 1. Session Kontrolü
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
        }

        await connectToDatabase();

        // 2. İlanı Bul
        const property = await Property.findById(id);
        if (!property) {
            return NextResponse.json({ message: "Property Not Found" }, { status: 404 });
        }

        // 3. Sahiplik Kontrolü (Başkasının ilanını silemesin)
        if (property.owner.toString() !== session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // 4. Sil
        await property.deleteOne();

        return NextResponse.json({ message: "Property Deleted" }, { status: 200 });

    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
