export const dynamic = 'force-dynamic';

import PropertyCard from '@/components/PropertyCard';
import Pagination from '@/components/Pagination';
import connectToDatabase from '@/config/database';
import Property from '@/models/Property';

const PropertiesPage = async ({ searchParams }) => {
    await connectToDatabase();

    // URL parametrelerini al (page, pageSize, type)
    const params = await searchParams;
    const page = parseInt(params.page) || 1;
    const pageSize = parseInt(params.pageSize) || 9;
    const type = params.type || ''; // URL'de 'type' varsa al, yoksa boş

    const skip = (page - 1) * pageSize;

    // --- SORGUYU OLUŞTUR ---
    const query = {};

    // Eğer URL'de bir tip varsa (örn: ?type=Villa), sorguya ekle
    if (type) {
        // Veritabanındaki 'type' alanı ile eşleşmeli (Büyük/Küçük harf duyarlı olabilir)
        // Genelde veritabanında "Apartment" kayıtlıdır.
        query.type = type;
    }

    // --- ÖNEMLİ: Sorguyu hem count hem find işlemine ver ---
    // Toplam sayıyı da filtrelenmiş sonuca göre bulmalıyız ki sayfalama bozulmasın.
    const total = await Property.countDocuments(query);
    const propertiesDoc = await Property.find(query).skip(skip).limit(pageSize).sort({ createdAt: -1 });
    const properties = JSON.parse(JSON.stringify(propertiesDoc));

    const showPagination = total > pageSize;

    return (
        <section className="px-4 py-8 pt-28 pb-20">
            <div className="container-xl lg:container m-auto px-4 py-6">

                {/* Kullanıcıya ne aradığını gösterelim */}
                {type && (
                    <div className="mb-6 bg-blue-100 p-3 rounded-lg text-blue-800">
                        Sonuçlar şu kategoriye göre filtrelendi: <strong>{type}</strong>
                        <a href="/properties" className="ml-4 text-sm underline text-red-600 hover:text-red-800">Filtreyi Temizle</a>
                    </div>
                )}

                {properties.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-xl text-gray-500">Bu kategoride henüz ilan yok.</p>
                        <a href="/properties" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">Tüm İlanları Gör</a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {properties.map((property) => (
                            <PropertyCard key={property._id} property={property} />
                        ))}
                    </div>
                )}
            </div>

            {showPagination && (
                <Pagination
                    totalItems={total}
                    page={page}
                    pageSize={pageSize}
                // Sayfalama bileşenine type bilgisini de göndermek gerekebilir 
                // (Şimdilik basit pagination varsa çalışır, ama sayfa değiştirince filtre kaybolabilir. 
                // Eğer kaybolursa Pagination bileşenini de güncellememiz gerekir. Şimdilik dene bakalım.)
                />
            )}
        </section>
    );
}

export default PropertiesPage;
