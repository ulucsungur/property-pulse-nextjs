import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function generateEmbedding(text) {
    try {
        // text-embedding-004 modeli güncel ve hızlıdır
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

        // Metni vektöre çevir
        const result = await model.embedContent(text);
        const embedding = result.embedding;

        return embedding.values;
    } catch (error) {
        console.error("Embedding hatası:", error);
        throw error;
    }
}
