"use server";

import connectToDatabase from "@/config/database";
import Message from "@/models/Message";
import { getUserSession } from "@/utils/getUserSession";
import { revalidatePath } from "next/cache";

export default async function getUnreadMessageCount() {
    await connectToDatabase();

    const session = await getUserSession();

    // if (!session?.userId) {
    //     return 0;
    // }
    if (!session || !session?.userId) throw new Error("Unauthorized");

    const { userId } = session;

    const count = await Message.countDocuments({
        recipient: userId,
        isRead: false,
    });
    // 🟩 ÖNEMLİ: Sayfayı yenile
    revalidatePath("/messages");
    return { count };
}
