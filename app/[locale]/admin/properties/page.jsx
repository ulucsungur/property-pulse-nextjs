"use client";

import React, { useEffect, useState } from "react";
// 1. DÜZELTME: Router'ı kendi navigation dosyamızdan çekiyoruz (Dil koruması için)
import { useRouter } from "@/utils/navigation";
import { useTranslations } from 'next-intl';

export default function PropertyList() {
    // 2. KANCALARI BAŞLAT
    const t = useTranslations('AdminProperties');
    const tCat = useTranslations('Categories'); // Apartment -> Daire çevirisi için

    const router = useRouter();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await fetch("/api/admin/properties", { cache: "no-store" });
                const data = await res.json();
                setProperties(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Hata:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    if (loading) return <div className="p-8 text-gray-500 dark:text-gray-400">{t('loading')}</div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-16">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center mt-4">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                    {t('title')}
                </h1>

                {/* YENİ EKLE BUTONU */}
                <button
                    onClick={() => router.push("/properties/add")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition shadow-md"
                >
                    {t('add')}
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                    <thead className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-semibold">
                        <tr>
                            <th className="p-4">{t('tableImage')}</th>
                            <th className="p-4">{t('tableHeader')}</th>
                            <th className="p-4">{t('tableLocation')}</th>
                            <th className="p-4">{t('tablePrice')}</th>
                            <th className="p-4 text-right">{t('tableTransactions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {properties.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center">{t('noAds')}</td></tr>
                        ) : (
                            properties.map((prop) => (
                                <tr key={prop._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                    <td className="p-4">
                                        <img
                                            src={prop.images?.[0] || "/images/no-image.png"}
                                            alt="Prop"
                                            className="w-16 h-12 object-cover rounded-md border dark:border-gray-600"
                                        />
                                    </td>
                                    <td className="p-4 font-medium text-gray-900 dark:text-white">
                                        {prop.name}
                                        {/* TİP ÇEVİRİSİ: tCat(prop.type) */}
                                        <div className="text-xs text-gray-500 dark:text-gray-400 font-normal mt-0.5">
                                            {tCat(prop.type)}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {prop.location?.city}, {prop.location?.state}
                                    </td>
                                    <td className="p-4 font-semibold text-green-600 dark:text-green-400">
                                        {/* Fiyat gösterimi basit tutuldu, istenirse formatlanabilir */}
                                        ₺{prop.rates?.monthly || prop.rates?.weekly || 0}
                                    </td>
                                    <td className="p-4 text-right">
                                        {/* DÜZENLE BUTONU */}
                                        <button
                                            onClick={() => router.push(`/properties/${prop._id}/edit`)}
                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3 font-medium"
                                        >
                                            {t('edit')}
                                        </button>

                                        {/* SİL BUTONU */}
                                        <button
                                            onClick={async () => {
                                                if (confirm(t('confirmDelete'))) {
                                                    await fetch(`/api/admin/properties/${prop._id}`, { method: "DELETE" });
                                                    // Sayfayı yenilemek yerine state'ten silmek daha modern olur ama
                                                    // mevcut yapını bozmamak için reload bırakıyorum.
                                                    window.location.reload();
                                                }
                                            }}
                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                                        >
                                            {t('delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // Yönlendirme için

// export default function PropertyList() {
//     const router = useRouter(); // Next.js Router
//     const [properties, setProperties] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // Verileri çek (Burası aynı kalıyor, sadece liste)
//     useEffect(() => {
//         const fetchProperties = async () => {
//             try {
//                 const res = await fetch("/api/admin/properties", { cache: "no-store" });
//                 const data = await res.json();
//                 setProperties(Array.isArray(data) ? data : []);
//             } catch (error) {
//                 console.error("Hata:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchProperties();
//     }, []);

//     if (loading) return <div className="p-8 text-gray-500">Ads are loading...</div>;

//     return (
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-16">
//             <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center mt-6">
//                 <h1 className="text-xl font-bold text-gray-800 dark:text-white">My ads</h1>

//                 {/* YENİ EKLE BUTONU: Mevcut /properties/add sayfasına atar */}
//                 <button
//                     onClick={() => router.push("/properties/add")}
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition"
//                 >
//                     + Add new listing
//                 </button>
//             </div>

//             <div className="overflow-x-auto">
//                 <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
//                     <thead className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-semibold">
//                         <tr>
//                             <th className="p-4">Image</th>
//                             <th className="p-4">Header</th>
//                             <th className="p-4">Location</th>
//                             <th className="p-4">Price</th>
//                             <th className="p-4 text-right">Transactions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
//                         {properties.length === 0 ? (
//                             <tr><td colSpan="5" className="p-8 text-center">Henüz ilan yok.</td></tr>
//                         ) : (
//                             properties.map((prop) => (
//                                 <tr key={prop._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
//                                     <td className="p-4">
//                                         <img
//                                             src={prop.images?.[0] || "/images/no-image.png"}
//                                             alt="Prop"
//                                             className="w-16 h-12 object-cover rounded-md border dark:border-gray-600"
//                                         />
//                                     </td>
//                                     <td className="p-4 font-medium text-gray-900 dark:text-white">
//                                         {prop.name}
//                                         <div className="text-xs text-gray-500 font-normal mt-0.5">{prop.type}</div>
//                                     </td>
//                                     <td className="p-4">
//                                         {prop.location?.city}, {prop.location?.state}
//                                     </td>
//                                     <td className="p-4 font-semibold text-green-600">
//                                         ₺{prop.rates?.monthly || prop.rates?.weekly || 0}
//                                     </td>
//                                     <td className="p-4 text-right">
//                                         {/* DÜZENLE BUTONU: Mevcut edit sayfasına atar */}
//                                         <button
//                                             onClick={() => router.push(`/properties/${prop._id}/edit`)}
//                                             className="text-blue-600 hover:text-blue-800 mr-3 font-medium"
//                                         >
//                                             Edit (AI)
//                                         </button>

//                                         {/* SİL BUTONU: Hızlı silme için burada kalabilir */}
//                                         <button
//                                             onClick={async () => {
//                                                 if (confirm("Are you sure want to delete it?")) {
//                                                     await fetch(`/api/admin/properties/${prop._id}`, { method: "DELETE" });
//                                                     window.location.reload();
//                                                 }
//                                             }}
//                                             className="text-red-500 hover:text-red-700 font-medium"
//                                         >
//                                             Delete
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }
