"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaSpinner } from "react-icons/fa";

const SemanticSearchBox = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setResults([]);

        try {
            const res = await fetch(`/api/semantic-search?query=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data);
            setHasSearched(true);
        } catch (error) {
            console.error("Arama hatası:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-blue-50 py-4 mb-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* --- Arama Formu --- */}
                <div className="flex flex-col items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-800 mb-2">Yapay Zeka Destekli Arama</h2>
                    <p className="text-gray-600 mb-4 text-sm">
                        Nasıl bir ev aradığınızı cümlelerle anlatın (Örn: "Deniz manzaralı, huzurlu ve geniş bir villa")
                    </p>

                    <form onSubmit={handleSearch} className="w-full max-w-2xl flex gap-2">
                        <input
                            type="text"
                            placeholder="Hayalinizdeki evi tarif edin..."
                            className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
                            Ara
                        </button>
                    </form>
                </div>

                {/* --- Sonuçlar --- */}
                <div className="space-y-4">
                    {loading && <p className="text-center text-gray-500">Yapay zeka en uygun evleri analiz ediyor...</p>}

                    {!loading && hasSearched && results.filter(p => p.score > 0.60).length === 0 && (
                        <p className="text-center text-red-500">Aradığınız kriterlere uygun ev bulunamadı.</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* BURAYA DİKKAT: .filter ekledik */}
                        {results
                            .filter((property) => property.score > 0.75) // %60'ın altındakileri gizle
                            .map((property) => (
                                <Link href={`/properties/${property._id}`} key={property._id} className="block group h-full">
                                    {/* ... (kart içeriği aynı) ... */}
                                    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 h-full flex flex-col border border-gray-100">

                                        <div className="relative h-48 w-full">
                                            <Image
                                                src={property.images && property.images[0] ? property.images[0] : "/images/properties/a1.jpg"}
                                                alt={property.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition duration-500"
                                            />
                                            <div className={`absolute top-2 right-2 text-white text-xs font-bold px-2 py-1 rounded-full shadow ${property.score > 0.8 ? 'bg-green-600' : 'bg-yellow-500'}`}>
                                                %{(property.score * 100).toFixed(0)} Eşleşme
                                            </div>
                                        </div>

                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{property.name}</h3>
                                            <p className="text-gray-500 text-sm mb-3 line-clamp-2">{property.description}</p>
                                            {/* ... (geri kalan aynı) ... */}
                                            <div className="mt-auto flex justify-between items-center text-sm text-gray-600 border-t pt-2">
                                                <span>{property.beds} Yatak • {property.baths} Banyo</span>
                                                <span className="font-semibold text-blue-600">
                                                    {property.rates?.monthly ? `$${property.rates.monthly}/ay` : 'Fiyat Sorunuz'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SemanticSearchBox;
