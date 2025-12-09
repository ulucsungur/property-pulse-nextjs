'use server';
import connectToDatabase from "@/config/database";
import Message from "@/models/Message";
import { getUserSession } from "@/utils/getUserSession";

async function addMessage(previousState, formData) {
    await connectToDatabase();

    const sessionUser = await getUserSession();
    if (!sessionUser?.userId) {
        throw new Error("User not authenticated");
    }
    const { userId } = sessionUser;

    const recipient = formData.get("recipient");

    if (userId === recipient) {
        return { error: "You cannot send message to yourself." };
    }

    const newMessage = new Message({
        sender: userId,
        recipient,
        property: formData.get("property"),
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        body: formData.get("message"),
        timestamp: new Date(),
    })
    await newMessage.save();

    return { submitted: true, message: "Message sent successfully." };

}

export default addMessage;
