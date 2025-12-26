import connectDB from "@/config/database";
import User from "@/models/User";
import { getUserSession } from "@/utils/getUserSession";
import { NextResponse } from "next/server";

// ----------------------------------------------------------------
// 1. GET METODU: Kullanıcı verilerini oku (Formu doldurmak için şart)
// ----------------------------------------------------------------
export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = await params; // Next.js 15: params await edilmeli

        // Yetki Kontrolü
        const sessionUser = await getUserSession();
        if (!sessionUser || sessionUser.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Kullanıcıyı bul
        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Kullanıcıyı döndür (Refine bunu alıp forma basacak)
        return NextResponse.json(user);

    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ message: 'Server Error' }, { status: 500 });
    }
}

// ----------------------------------------------------------------
// 2. PATCH METODU: Kullanıcıyı güncelle (Save butonuna basınca çalışır)
// ----------------------------------------------------------------
export async function PATCH(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        // Yetki Kontrolü
        const sessionUser = await getUserSession();
        if (!sessionUser || sessionUser.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Gelen veriyi al
        const body = await request.json();
        const { role, status } = body;

        // Güncelle
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role, status },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(updatedUser);

    } catch (error) {
        console.error("PATCH Error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}


// import connectDB from "@/config/database";
// import User from "@/models/User";
// import { NextResponse } from "next/server";

// // 1. GET: Tek bir kullanıcıyı getir (Edit sayfası formunu doldurmak için)
// export async function GET(request, { params }) {
//     try {
//         await connectDB();
//         const { id } = await params; // Next.js 15: params await edilmeli

//         const user = await User.findById(id);

//         if (!user) {
//             return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
//         }

//         return NextResponse.json(user);
//     } catch (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }

// // 2. PATCH: Kullanıcıyı Güncelle (Rol ve Durum değişimi için)
// export async function PATCH(request, { params }) {
//     try {
//         await connectDB();
//         const { id } = await params;
//         const body = await request.json();

//         // Sadece izin verilen alanları güncelle (Güvenlik)
//         const { role, status } = body;

//         const updatedUser = await User.findByIdAndUpdate(
//             id,
//             { role, status },
//             { new: true } // Güncellenmiş veriyi döndür
//         );

//         return NextResponse.json(updatedUser);
//     } catch (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }

// // 3. DELETE: Kullanıcıyı Sil (Opsiyonel)
// export async function DELETE(request, { params }) {
//     try {
//         await connectDB();
//         const { id } = await params;

//         await User.findByIdAndDelete(id);

//         return NextResponse.json({ message: "Kullanıcı silindi" });
//     } catch (error) {
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }
