"use server";

import connectToDatabase from "@/config/database";
import Message from "@/models/Message";
import { getUserSession } from "@/utils/getUserSession";
import { revalidatePath } from "next/cache";

export default async function markMessageAsRead(id, targetStatus) {
    try {
        console.log("[markMessageAsRead] called", { id, targetStatus });
        await connectToDatabase();

        const session = await getUserSession();
        console.log("[markMessageAsRead] session:", !!session, session?.userId);

        if (!session?.userId) {
            console.error("[markMessageAsRead] unauthorized - no session");
            return { success: false, error: "Unauthorized" };
        }

        const msg = await Message.findById(id);
        if (!msg) {
            console.error("[markMessageAsRead] not found:", id);
            return { success: false, error: "Message not found" };
        }

        if (msg.recipient.toString() !== session.userId) {
            console.error("[markMessageAsRead] recipient mismatch", {
                recipient: msg.recipient.toString(),
                sessionUserId: session.userId,
            });
            return { success: false, error: "Unauthorized (recipient mismatch)" };
        }

        msg.isRead = !!targetStatus;
        await msg.save();

        // Double-check from DB
        const fresh = await Message.findById(id).lean();
        console.log("[markMessageAsRead] saved, fresh.isRead:", fresh?.isRead);

        revalidatePath("/messages");

        return { success: true, isRead: !!fresh?.isRead };
    } catch (error) {
        console.error("[markMessageAsRead] ERROR:", error);
        return { success: false, error: String(error) };
    }
}


// "use server";

// import connectToDatabase from "@/config/database";
// import Message from "@/models/Message";
// import { getUserSession } from "@/utils/getUserSession";
// import { revalidatePath } from "next/cache";

// export default async function markMessageAsRead(id, targetStatus) {
//     await connectToDatabase();

//     const session = await getUserSession();
//     if (!session?.userId) throw new Error("Unauthorized");

//     const msg = await Message.findById(id);
//     if (!msg) throw new Error("Message not found");

//     if (msg.recipient.toString() !== session.userId) {
//         throw new Error("Unauthorized");
//     }

//     // Explicit hedef durumu uygula
//     msg.read = targetStatus;
//     await msg.save();

//     revalidatePath("/messages");

//     return msg.isRead;
// }
