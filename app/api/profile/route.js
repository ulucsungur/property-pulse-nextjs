import connectToDatabase from "@/config/database";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { NextResponse } from "next/server";
import cloudinary from "@/config/cloudinary";
import { Readable } from "stream";

// Helper: Cloudinary Upload (addProperty'deki ile aynı)
async function uploadToCloudinary(file) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "propertypulse_users", resource_type: "image" }, // Klasör adını değiştirebilirsin
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        Readable.from(buffer).pipe(uploadStream);
    });
}

// PUT: Profili Güncelle
export async function PUT(request) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();

        // Form verilerini al
        const username = formData.get("username");
        const surname = formData.get("surname");
        const phone = formData.get("phone");
        const country = formData.get("country");
        const dateOfBirth = formData.get("dateOfBirth");
        const imageFile = formData.get("image");

        // Güncellenecek veri objesi
        const updateData = {
            username,
            surname,
            phone,
            country,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        };

        // Eğer yeni resim varsa Cloudinary'e yükle
        if (imageFile && imageFile instanceof File && imageFile.size > 0) {
            const uploadedImage = await uploadToCloudinary(imageFile);
            updateData.image = uploadedImage.secure_url;
        }

        // Veritabanını güncelle
        const user = await User.findByIdAndUpdate(session.user.id, updateData, { new: true });

        return NextResponse.json({ message: "Profil güncellendi", user }, { status: 200 });

    } catch (error) {
        console.error("Profile Update Error:", error);
        return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
    }
}

// GET: Profil Verilerini Getir (Mevcut verileri forma doldurmak için)
export async function GET(request) {
    try {
        await connectToDatabase();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(session.user.id);

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
