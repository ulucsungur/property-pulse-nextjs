import connectToDatabase from "@/config/database";
import Message from "@/models/Message";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const message = await Message.findById(id);

        if (!message) return NextResponse.json({ message: "Message not found" }, { status: 404 });

        if (message.recipient.toString() !== session.user.id) {
            return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });
        }

        // DÜZELTME BURADA: 'read' değil 'isRead'
        // Mevcut durumu tersine çevir (Toggle)
        const nextState = !message.isRead;

        const updatedMessage = await Message.findByIdAndUpdate(
            id,
            { isRead: nextState }, // Veritabanındaki 'isRead' alanını güncelle
            { new: true }
        );

        // Cache temizle
        revalidatePath('/messages');

        // Frontend'e 'isRead' olarak dönüyoruz
        return NextResponse.json({ isRead: updatedMessage.isRead }, { status: 200 });

    } catch (error) {
        console.error("PUT API Error:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}

// DELETE aynı kalıyor (sadece revalidatePath ekli)
export async function DELETE(request, { params }) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || !session.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const message = await Message.findById(id);
        if (!message) return NextResponse.json({ message: "Message not found" }, { status: 404 });
        if (message.recipient.toString() !== session.user.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await message.deleteOne();
        revalidatePath('/messages');

        return NextResponse.json({ message: "Message Deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

// import connectToDatabase from "@/config/database";
// import Message from "@/models/Message";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/utils/authOptions";
// import { NextResponse } from "next/server";

// export const dynamic = 'force-dynamic';

// // PUT: Okundu Durumunu Güncelle (Emir ile)
// export async function PUT(request, { params }) {
//     try {
//         await connectToDatabase();
//         const { id } = await params;
//         const session = await getServerSession(authOptions);

//         if (!session || !session.user) return NextResponse.json("Unauthorized", { status: 401 });

//         const message = await Message.findById(id);
//         if (!message) return NextResponse.json("Message not found", { status: 404 });

//         if (message.recipient.toString() !== session.user.id) return NextResponse.json("Unauthorized", { status: 401 });

//         // Frontend'den gelen veriyi oku
//         // { read: true } veya { read: false } gelecek
//         const { read } = await request.json();

//         // Veritabanını güncelle
//         message.read = read;
//         await message.save();

//         return NextResponse.json({ read: message.read }, { status: 200 });

//     } catch (error) {
//         console.error(error);
//         return NextResponse.json("Something went wrong", { status: 500 });
//     }
// }

// // DELETE: Sil (Aynı Kalıyor)
// export async function DELETE(request, { params }) {
//     try {
//         await connectToDatabase();
//         const { id } = await params;
//         const session = await getServerSession(authOptions);

//         if (!session || !session.user) return NextResponse.json("Unauthorized", { status: 401 });

//         const message = await Message.findById(id);
//         if (!message) return NextResponse.json("Not Found", { status: 404 });

//         await message.deleteOne();

//         return NextResponse.json("Deleted", { status: 200 });

//     } catch (error) {
//         return NextResponse.json("Error", { status: 500 });
//     }
// }
