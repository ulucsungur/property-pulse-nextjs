import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUserSession } from "@/utils/getUserSession";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const sessionUser = await getUserSession();
    if (!sessionUser || !sessionUser.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, type, location, beds, baths, amenities, locale = 'en' } = body;

    const apiKey = process.env.GOOGLE_API_KEY?.trim();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // DİLE GÖRE PROMPT OLUŞTURMA
    let prompt = "";
    if (locale === 'tr') {
      prompt = `
        Sen profesyonel bir gayrimenkul metin yazarıısın. Aşağıdaki bilgilere dayanarak etkileyici ve profesyonel bir emlak ilan açıklaması yaz.
        - Başlık: ${name}
        - Tip: ${type}
        - Konum: ${location?.city}, ${location?.state}
        - Özellikler: ${beds} Yatak Odası, ${baths} Banyo
        - Olanaklar: ${Array.isArray(amenities) ? amenities.join(', ') : amenities}
        
        Kurallar:
        - SADECE TÜRKÇE yaz.
        - Profesyonel ve davetkar bir dil kullan.
        - En fazla 4 paragraf olsun.
        - Sadece açıklama metnini döndür.
      `;
    } else {
      prompt = `
        You are a professional real estate copywriter. Write a compelling property description.
        - Title: ${name}
        - Type: ${type}
        - Location: ${location?.city}, ${location?.state}
        - Features: ${beds} Beds, ${baths} Baths
        - Amenities: ${amenities}
        
        Rules:
        - Write in ENGLISH.
        - Professional tone.
        - Under 4 paragraphs.
        - Return ONLY the description text.
      `;
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return NextResponse.json({ description: text });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
//  ----24.12.25 çalışıyor ama sadece eng üretiyor----------------
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { getUserSession } from "@/utils/getUserSession";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     const sessionUser = await getUserSession();
//     if (!sessionUser || !sessionUser.userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body = await request.json();
//     // locale bilgisini aldık, gelmezse varsayılan 'en'
//     const { name, type, location, beds, baths, amenities, locale = 'en' } = body;

//     const apiKey = process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY.trim() : "";
//     if (!apiKey) {
//       return NextResponse.json({ error: "API Key bulunamadı." }, { status: 500 });
//     }

//     const genAI = new GoogleGenerativeAI(apiKey);
//     // Model ismini "gemini-1.5-flash" olarak güncelledim (en stabil olanı)
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//     // Dile göre talimatı belirle
//     const targetLanguage = locale === 'tr' ? 'TURKISH' : 'ENGLISH';

//     const prompt = `
//       You are a professional real estate copywriter. Write a compelling, professional, 
//       and SEO-friendly property description based on the following details.
      
//       Details:
//       - Title: ${name}
//       - Type: ${type}
//       - Location: ${location?.city || ''}, ${location?.state || ''}
//       - Features: ${beds} Beds, ${baths} Baths
//       - Amenities: ${Array.isArray(amenities) ? amenities.join(', ') : amenities}
      
//       Rules:
//       - Write the entire description in ${targetLanguage}.
//       - Use a professional yet inviting tone.
//       - Keep it under 4 paragraphs.
//       - Return ONLY the description text.
//     `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     return NextResponse.json({ description: text });

//   } catch (error) {
//     console.error("AI Generate Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }



// ----------------çalışan kod ------------------

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { getUserSession } from "@/utils/getUserSession";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     // 1. Session Kontrolü
//     const sessionUser = await getUserSession();
//     if (!sessionUser || !sessionUser.userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // 2. Body verisini al
//     const body = await request.json();
//     const { name, type, location, beds, baths, amenities } = body;

//     // 3. API Key Temizliği (KRİTİK NOKTA BURASI)
//     // .trim() komutu, .env dosyasından gelen anahtarın başındaki/sonundaki görünmez boşlukları siler.
//     const apiKey = process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY.trim() : "";

//     // Kontrol için konsola sadece ilk 4 harfini yazdıralım (güvenlik için tamamını yazmıyoruz)
//     console.log("Kullanılan API Key (İlk 4 hane):", apiKey ? apiKey.substring(0, 4) + "..." : "YOK");

//     if (!apiKey) {
//       return NextResponse.json({ error: "API Key bulunamadı veya boş." }, { status: 500 });
//     }

//     // 4. Modeli Başlat
//     const genAI = new GoogleGenerativeAI(apiKey);
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//     // 5. Prompt Hazırla
//     const prompt = `
//       You are a professional real estate copywriter. Write a compelling, professional, 
//       and SEO-friendly property description based on the following details.
      
//       Details:
//       - Title: ${name}
//       - Type: ${type}
//       - Location: ${location?.city || ''}, ${location?.state || ''}
//       - Features: ${beds} Beds, ${baths} Baths
//       - Amenities: ${Array.isArray(amenities) ? amenities.join(', ') : amenities}
      
//       Rules:
//       - Write in ENGLISH.
//       - Use a professional yet inviting tone.
//       - Use emojis sparingly.
//       - Keep it under 4 paragraphs.
//       - Return ONLY the description text.
//     `;

//     // 6. Üret
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     return NextResponse.json({ description: text });

//   } catch (error) {
//     console.error("AI Generate Error:", error);
//     // Hatanın tam detayını frontend'e gönderiyoruz
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
