'use server';
import connectToDatabase from "@/config/database";
import User from "@/models/User";
import { getUserSession } from "@/utils/getUserSession";


async function checkBookmarkStatus(propertyId) {
    await connectToDatabase();
    const sessionUser = await getUserSession();

    if (!sessionUser || !sessionUser.userId) {
        throw new Error('User ID is required')
    }

    const { userId } = sessionUser;

    const user = await User.findById(userId)

    const isBookmarked = user.bookmarks.includes(propertyId)

    return {
        isBookmarked
    }
}

export default checkBookmarkStatus;
