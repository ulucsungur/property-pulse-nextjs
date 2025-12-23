import connectDB from "@/config/database";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

// PATCH: Okundu/Okunmadı yap
export async function PATCH(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json(); // { read: true } gelecek

        const updatedMessage = await Message.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(updatedMessage);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Mesajı sil
export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        await Message.findByIdAndDelete(id);
        return NextResponse.json({ message: "Mesaj silindi" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
