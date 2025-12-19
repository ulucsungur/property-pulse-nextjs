export function convertToSerializableObject(leanDocument) {
    // 1. Veri yoksa veya null ise, direkt null dön (Hata verme)
    if (!leanDocument) {
        return null;
    }

    // 2. En güvenli ve temiz yöntem: String'e çevirip tekrar JSON yap
    // Bu işlem ObjectId'leri stringe, Tarihleri stringe çevirir ve null alanları korur.
    return JSON.parse(JSON.stringify(leanDocument));
}
