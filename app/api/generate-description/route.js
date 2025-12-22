import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUserSession } from "@/utils/getUserSession"; 
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // 1. Session Kontrolü
    const sessionUser = await getUserSession();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Body verisini al
    const body = await request.json();
    const { name, type, location, beds, baths, amenities } = body;

    // 3. API Key Temizliği (KRİTİK NOKTA BURASI)
    // .trim() komutu, .env dosyasından gelen anahtarın başındaki/sonundaki görünmez boşlukları siler.
    const apiKey = process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY.trim() : "";

    // Kontrol için konsola sadece ilk 4 harfini yazdıralım (güvenlik için tamamını yazmıyoruz)
    console.log("Kullanılan API Key (İlk 4 hane):", apiKey ? apiKey.substring(0, 4) + "..." : "YOK");

    if (!apiKey) {
      return NextResponse.json({ error: "API Key bulunamadı veya boş." }, { status: 500 });
    }

    // 4. Modeli Başlat
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

    // 5. Prompt Hazırla
    const prompt = `
      You are a professional real estate copywriter. Write a compelling, professional, 
      and SEO-friendly property description based on the following details.
      
      Details:
      - Title: ${name}
      - Type: ${type}
      - Location: ${location?.city || ''}, ${location?.state || ''}
      - Features: ${beds} Beds, ${baths} Baths
      - Amenities: ${Array.isArray(amenities) ? amenities.join(', ') : amenities}
      
      Rules:
      - Write in ENGLISH.
      - Use a professional yet inviting tone.
      - Use emojis sparingly.
      - Keep it under 4 paragraphs.
      - Return ONLY the description text.
    `;

    // 6. Üret
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ description: text });

  } catch (error) {
    console.error("AI Generate Error:", error);
    // Hatanın tam detayını frontend'e gönderiyoruz
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/utils/authOptions";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await request.json();
//     const { name, type, location, beds, baths, amenities } = body;

//     const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//     // --- PROMPT İNGİLİZCEYE ÇEVRİLDİ ---
//     const prompt = `
//       You are a professional real estate copywriter. Write a compelling, professional, 
//       and SEO-friendly property description based on the following details.
      
//       Details:
//       - Title: ${name}
//       - Type: ${type}
//       - Location: ${location?.city}, ${location?.state}
//       - Features: ${beds} Beds, ${baths} Baths
//       - Amenities: ${amenities}
      
//       Rules:
//       - Write in ENGLISH.
//       - Use a professional yet inviting tone.
//       - Use emojis sparingly.
//       - Keep it under 4 paragraphs.
//       - Return ONLY the description text.
//     `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     return NextResponse.json({ description: text });

//   } catch (error) {
//     console.error("AI Generate Error:", error);
//     return NextResponse.json({ error: "Failed to generate description." }, { status: 500 });
//   }
// }

// // import { GoogleGenerativeAI } from "@google/generative-ai";
// // import { getServerSession } from "next-auth/next";
// // import { authOptions } from "@/utils/authOptions";
// // import { NextResponse } from "next/server";

// // export async function POST(request) {
// //     try {
// //         // 1. Güvenlik: Sadece üye olanlar kullanabilsin
// //         const session = await getServerSession(authOptions);
// //         if (!session || !session.user) {
// //             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //         }

// //         // 2. Form verilerini al
// //         const body = await request.json();
// //         const { name, type, location, beds, baths, amenities } = body;

// //         // 3. Prompt Hazırla (Yapay Zekaya Emir Ver)
// //         const prompt = `
// //       Sen uzman bir emlak metin yazarısın. Aşağıdaki özelliklere sahip bir mülk için 
// //       ilgi çekici, profesyonel ve SEO uyumlu bir ilan açıklaması (Description) yaz.
      
// //       Özellikler:
// //       - Başlık: ${name}
// //       - Tip: ${type}
// //       - Konum: ${location?.city}, ${location?.state}
// //       - Yatak: ${beds}, Banyo: ${baths}
// //       - Olanaklar: ${amenities}
      
// //       Kurallar:
// //       - Türkçe yaz.
// //       - Samimi ama profesyonel bir dil kullan.
// //       - Emojiler kullan.
// //       - En fazla 3-4 paragraf olsun.
// //       - Sadece açıklama metnini döndür, başka bir şey yazma.
// //     `;

// //         // 4. Gemini'ye Gönder
// //         const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
// //         const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// //         const result = await model.generateContent(prompt);
// //         const response = await result.response;
// //         const text = response.text();

// //         return NextResponse.json({ description: text });

// //     } catch (error) {
// //         console.error("AI Generate Error:", error);
// //         return NextResponse.json({ error: "AI metin üretemedi." }, { status: 500 });
// //     }
// // }
