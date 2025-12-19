'use server';
import connectToDatabase from "@/config/database";
import Property from "@/models/Property";
import { getUserSession } from "@/utils/getUserSession";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import cloudinary from "@/config/cloudinary";
import { Readable } from "stream";

// Helper: Cloudinary Upload (addProperty ile aynı)
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

// Helper: Cloudinary Delete (Public ID bulup siler)
async function deleteFromCloudinary(imageUrl) {
    try {
        // URL'den public_id'yi çıkar (Örn: propertypulse/resim_adi)
        const parts = imageUrl.split('/');
        const fileName = parts[parts.length - 1];
        const publicId = `propertypulse/${fileName.split('.')[0]}`;

        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary Delete Error:", error);
    }
}

async function updateProperty(propertyId, formData) {
    await connectToDatabase();

    const sessionUser = await getUserSession();
    if (!sessionUser?.userId) {
        throw new Error("User not authenticated");
    }
    const { userId } = sessionUser;

    const existingProperty = await Property.findById(propertyId);
    if (!existingProperty) throw new Error("Property not found");

    // Sahiplik Kontrolü
    if (existingProperty.owner.toString() !== userId) {
        throw new Error("Current user is not the owner of the property");
    }

    // --- RESİM YÖNETİMİ ---

    // 1. Silinecek resimler (Frontend'den checkbox ile gelecek)
    const imagesToDelete = formData.getAll("delete_images");
    let currentImages = [...existingProperty.images];

    // Silinecekleri Cloudinary'den ve listeden uçur
    if (imagesToDelete.length > 0) {
        for (const imageUrl of imagesToDelete) {
            await deleteFromCloudinary(imageUrl);
            currentImages = currentImages.filter((img) => img !== imageUrl);
        }
    }

    // 2. Yeni eklenecek resimler
    const newImageFiles = formData.getAll("new_images").filter(f => f instanceof File && f.size > 0);

    for (const imageFile of newImageFiles) {
        const uploaded = await uploadToCloudinary(imageFile);
        currentImages.push(uploaded.secure_url);
    }

    // Toplam resim sayısı kontrolü (Örn: En fazla 4 resim)
    if (currentImages.length > 4) {
        // İstersen burada hata fırlatabilirsin veya sadece ilk 4'ü alabilirsin
        // throw new Error("Maximum 4 images allowed");
        currentImages = currentImages.slice(0, 4);
    }
    // -----------------------

    const propertyData = {
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
        images: currentImages, // Güncellenmiş resim listesi
    };

    const updatedProperty = await Property.findByIdAndUpdate(
        propertyId,
        propertyData,
        { new: true }
    );

    if (!updatedProperty) {
        throw new Error("Property update failed");
    }

    revalidatePath('/', 'layout');
    redirect(`/properties/${updatedProperty._id}`);
}

export default updateProperty;

// 'use server';
// import connectToDatabase from "@/config/database";
// import Property from "@/models/Property";
// import { getUserSession } from "@/utils/getUserSession";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

// async function updateProperty(propertyId, formData) {
//     await connectToDatabase();

//     const sessionUser = await getUserSession();
//     if (!sessionUser?.userId) {
//         throw new Error("User not authenticated");
//     }
//     const { userId } = sessionUser;

//     const existingProperty = await Property.findById(propertyId);
//     //verify ownership
//     if (existingProperty.owner.toString() !== userId) {
//         throw new Error("Current user is not the owner of the property");
//     }

//     const propertyData = {
//         owner: userId,
//         type: formData.get("type"),
//         name: formData.get("name"),
//         description: formData.get("description"),
//         location: {
//             street: formData.get("location.street"),
//             city: formData.get("location.city"),
//             state: formData.get("location.state"),
//             zipCode: formData.get("location.zipCode"),
//         },
//         beds: parseInt(formData.get("beds") || "0"),
//         baths: parseInt(formData.get("baths") || "0"),
//         square_feet: parseInt(formData.get("square_feet") || "0"),
//         amenities: formData.getAll("amenities"),
//         rates: {
//             nightly: parseFloat(formData.get("rates.nightly") || "0"),
//             weekly: parseFloat(formData.get("rates.weekly") || "0"),
//             monthly: parseFloat(formData.get("rates.monthly") || "0"),
//         },
//         seller_info: {
//             name: formData.get("seller_info.name"),
//             email: formData.get("seller_info.email"),
//             phone: formData.get("seller_info.phone"),
//         }
//     };

//     const updatedProperty = await Property.findByIdAndUpdate(
//         propertyId,
//         propertyData,
//         { new: true }
//     );

//     if (!updatedProperty) {
//         throw new Error("Property update failed");
//     }

//     // Revalidate the property detail page and profile page
//     revalidatePath('/', 'layout');

//     // Redirect to the updated property's detail page
//     redirect(`/properties/${updatedProperty._id}`);

// }

// export default updateProperty;
