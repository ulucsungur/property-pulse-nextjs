"use server";

import connectToDatabase from "@/config/database";
import Message from "@/models/Message";
import { revalidatePath } from "next/cache";

export async function deleteMessage(id) {
    try {
        await connectToDatabase();

        const deleted = await Message.findByIdAndDelete(id);

        if (!deleted) {
            return { success: false, message: "Message not found" };
        }

        // Messages sayfasını yenile
        revalidatePath("/messages");

        return { success: true };
    } catch (error) {
        console.error("Delete error:", error);
        return { success: false, message: "Server error" };
    }
}
