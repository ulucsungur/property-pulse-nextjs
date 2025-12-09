"use server";

import connectToDatabase from "@/config/database";
import Message from "@/models/Message";
import { getUserSession } from "@/utils/getUserSession";
import { revalidatePath } from "next/cache";

export default async function replyMessage(originalMessageId, text) {
    await connectToDatabase();

    const session = await getUserSession();
    if (!session?.userId) {
        return { success: false, error: "Unauthorized" };
    }

    const original = await Message.findById(originalMessageId);
    if (!original) {
        return { success: false, error: "Original message not found" };
    }

    const newMessage = new Message({
        sender: session.userId,
        recipient: original.sender,
        property: original.property,
        name: "Reply Message",
        email: "noreply@propertypulse.com",
        phone: "",
        body: text,
        isRead: false,
    });

    await newMessage.save();

    // mesaj sayfasi yenilensin
    revalidatePath("/messages");

    return { success: true };
}
