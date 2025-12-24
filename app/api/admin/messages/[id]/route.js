import connectToDB from '@/config/database';
import Message from '@/models/Message';
import { getSessionUser } from '@/utils/getUserSession'; // veya Admin session kontrolün
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// PUT (veya PATCH)
export async function PUT(request, { params }) {
    try {
        await connectToDB();
        const { id } = await params;

        // Admin yetki kontrolü buraya eklenebilir
        // const session = ... if role !== admin return 401...

        // Frontend'den gelen isRead verisini al
        const { isRead } = await request.json();

        // DÜZELTME: Veritabanındaki 'isRead' alanını güncelle
        const updatedMessage = await Message.findByIdAndUpdate(
            id,
            { isRead: isRead },
            { new: true }
        );

        if (!updatedMessage) {
            return NextResponse.json({ message: "Message not found" }, { status: 404 });
        }

        return NextResponse.json(updatedMessage, { status: 200 });

    } catch (error) {
        console.error("Admin Message Update Error:", error);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

// DELETE
export async function DELETE(request, { params }) {
    try {
        await connectToDB();
        const { id } = await params;

        await Message.findByIdAndDelete(id);

        return NextResponse.json({ message: "Deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

// import connectDB from "@/config/database";
// import Message from "@/models/Message";
// import { NextResponse } from "next/server";

// // PATCH: Okundu/Okunmadı yap
// export async function PATCH(request, { params }) {
//     try {
//         await connectDB();
//         const { id } = await params;
//         const body = await request.json(); // { read: true } gelecek

//         const updatedMessage = await Message.findByIdAndUpdate(id, body, { new: true });
//         return NextResponse.json(updatedMessage);
//     } catch (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }

// // DELETE: Mesajı sil
// export async function DELETE(request, { params }) {
//     try {
//         await connectDB();
//         const { id } = await params;

//         await Message.findByIdAndDelete(id);
//         return NextResponse.json({ message: "Mesaj silindi" });
//     } catch (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }
