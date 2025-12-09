'use server';
import connectToDatabase from "@/config/database";
import Property from "@/models/Property";
import { getUserSession } from "@/utils/getUserSession";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function updateProperty(propertyId, formData) {
    await connectToDatabase();

    const sessionUser = await getUserSession();
    if (!sessionUser?.userId) {
        throw new Error("User not authenticated");
    }
    const { userId } = sessionUser;

    const existingProperty = await Property.findById(propertyId);
    //verify ownership
    if (existingProperty.owner.toString() !== userId) {
        throw new Error("Current user is not the owner of the property");
    }

    const propertyData = {
        owner: userId,
        type: formData.get("type"),
        name: formData.get("name"),
        description: formData.get("description"),
        location: {
            street: formData.get("location.street"),
            city: formData.get("location.city"),
            state: formData.get("location.state"),
            zipCode: formData.get("location.zipCode"),
        },
        beds: parseInt(formData.get("beds") || "0"),
        baths: parseInt(formData.get("baths") || "0"),
        square_feet: parseInt(formData.get("square_feet") || "0"),
        amenities: formData.getAll("amenities"),
        rates: {
            nightly: parseFloat(formData.get("rates.nightly") || "0"),
            weekly: parseFloat(formData.get("rates.weekly") || "0"),
            monthly: parseFloat(formData.get("rates.monthly") || "0"),
        },
        seller_info: {
            name: formData.get("seller_info.name"),
            email: formData.get("seller_info.email"),
            phone: formData.get("seller_info.phone"),
        }
    };

    const updatedProperty = await Property.findByIdAndUpdate(
        propertyId,
        propertyData,
        { new: true }
    );

    if (!updatedProperty) {
        throw new Error("Property update failed");
    }

    // Revalidate the property detail page and profile page
    revalidatePath('/', 'layout');

    // Redirect to the updated property's detail page
    redirect(`/properties/${updatedProperty._id}`);

}

export default updateProperty;
