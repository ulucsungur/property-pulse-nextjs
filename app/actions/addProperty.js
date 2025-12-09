'use server';
import connectToDatabase from "@/config/database";
import Property from "@/models/Property";
import { getUserSession } from "@/utils/getUserSession";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/config/cloudinary";
import { Readable } from "stream";

// Helper: Cloudinary stream upload
async function uploadToCloudinary(file) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "propertypulse", resource_type: "image" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        Readable.from(buffer).pipe(uploadStream);
    });
}

async function addProperty(formData) {
    await connectToDatabase();

    const sessionUser = await getUserSession();
    if (!sessionUser?.userId) {
        throw new Error("User not authenticated");
    }
    const { userId } = sessionUser;


    // Formdan gelen dosyaları al
    const rawImages = formData.getAll("images");
    //console.log("Raw images:", rawImages);

    const images = rawImages.filter(f => f instanceof File && f.size > 0);
    //console.log("Filtered images:", images);

    if (images.length === 0) {
        throw new Error("At least one image is required");
    }

    // Cloudinary upload
    const imageUrls = [];
    for (const imageFile of images) {
        try {
            const uploaded = await uploadToCloudinary(imageFile);
            imageUrls.push(uploaded.secure_url);
        } catch (err) {
            console.error("Cloudinary upload error:", err);
            throw new Error("Image upload failed");
        }
    }

    // Property veri nesnesi
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
        },
        images: imageUrls,
    };

    // MongoDB kaydı
    const newProperty = new Property(propertyData);
    await newProperty.save();

    // Revalidate ve redirect
    revalidatePath("/", "layout");
    redirect(`/properties/${newProperty._id}`);
}

export default addProperty;
