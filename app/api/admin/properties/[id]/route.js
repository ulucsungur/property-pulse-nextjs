import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { NextResponse } from "next/server";

// GET: Tek İlan Getir (Edit Formu İçin)
export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const property = await Property.findById(id);
        return NextResponse.json(property);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: İlan Sil
export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        const { id } = await params;

        const property = await Property.findById(id);

        // Güvenlik: Sadece sahibi veya Admin silebilir
        if (property.owner.toString() !== session.user.id && session.user.role !== 'admin') {
            return NextResponse.json({ error: "Yetkisiz işlem" }, { status: 403 });
        }

        await property.deleteOne();
        return NextResponse.json({ message: "Silindi" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH: İlan Güncelle (Opsiyonel, Edit sayfası için)
export async function PATCH(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        const updatedProperty = await Property.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(updatedProperty);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
