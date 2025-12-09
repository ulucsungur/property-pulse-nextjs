'use server';
import connectToDatabase from "@/config/database";
import User from "@/models/User";
import { getUserSession } from "@/utils/getUserSession";
import { revalidatePath } from "next/cache";


async function bookmarkProperty(propertyId) {
    await connectToDatabase();
    const sessionUser = await getUserSession();

    if (!sessionUser || !sessionUser.userId) {
        throw new Error('User ID is required')
    }

    const { userId } = sessionUser;

    const user = await User.findById(userId)

    let isBookmarked = user.bookmarks.includes(propertyId)

    let message;

    if (isBookmarked) {
        //if already bookmarked, then remove
        user.bookmarks.pull(propertyId);
        message = 'Bookmark Removed';
        isBookmarked = false;
    } else {
        //if not bookmarked, then add
        user.bookmarks.push(propertyId);
        message = 'Bookmark Added';
        isBookmarked = true;
    }
    await user.save();
    revalidatePath('/properties/saved', 'page');
    return {
        message,
        isBookmarked
    }
}

export default bookmarkProperty;
