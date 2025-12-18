import connectToDatabase from "@/config/database";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        await connectToDatabase();

        const { username, email, password } = await request.json();

        // 1. Validasyon
        if (!username || !email || !password) {
            return NextResponse.json(
                { message: "Tüm alanları doldurunuz." },
                { status: 400 }
            );
        }

        // 2. Kullanıcı Zaten Var mı?
        const userExists = await User.findOne({ email });

        if (userExists) {
            return NextResponse.json(
                { message: "Bu email adresi zaten kayıtlı." },
                { status: 400 }
            );
        }

        // 3. Şifreyi Şifrele (Hash)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Yeni Kullanıcıyı Oluştur
        await User.create({
            username,
            email,
            password: hashedPassword,
            //image: "/images/profile.png"
        });

        return NextResponse.json(
            { message: "Kullanıcı başarıyla oluşturuldu." },
            { status: 201 }
        );

    } catch (error) {
        console.error("Register Error:", error);
        return NextResponse.json(
            { message: "Sunucu hatası oluştu." },
            { status: 500 }
        );
    }
}
