'use server';
import cloudinary from "@/config/cloudinary";
import connectToDatabase from "@/config/database";
import Property from "@/models/Property";
import { getUserSession } from "@/utils/getUserSession";
import { revalidatePath } from "next/cache";


async function deleteProperty(propertyId) {
    await connectToDatabase();
    const sessionUser = await getUserSession();
    if (!sessionUser || !sessionUser.userId) {
        throw new Error("User IS is required to delete a property");
    }

    const { userId } = sessionUser;

    const property = await Property.findById(propertyId);
    if (!property) {
        throw new Error("Property not found");
    }

    // Check if the user is the owner of the property
    if (property.owner.toString() !== userId) {
        throw new Error("You are not authorized to delete this property");
    }

    // Delete images from Cloudinary
    const publicIds = property.images.map(imageUrl => {
        const parts = imageUrl.split('/');
        return parts.at(-1).split('.').at(0); // Extract public ID from URL
    });

    // Delete images in Cloudinary
    if (publicIds.length > 0) {
        for (let publicId of publicIds) {
            await cloudinary.uploader.destroy('propertypulse/' + publicId);
        }
    }
    await property.deleteOne();
    revalidatePath('/', 'layout');

}

export default deleteProperty;
