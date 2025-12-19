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
        // Her aramada sonuçları önce temizle ki eski sonuçlar kalmasın
        setResults([]);

        try {
            const res = await fetch(`/api/semantic-search?query=${encodeURIComponent(query)}`);

            // Eğer sunucu 200 OK dışı bir şey dönerse (örn: 500 hatası)
            if (!res.ok) {
                console.error("API Error:", res.status);
                setResults([]); // Sonuçları boşalt
                return;
            }

            const data = await res.json();

            // KORUMA: Gelen veri gerçekten bir dizi mi? (Array check)
            if (Array.isArray(data)) {
                setResults(data);
            } else {
                console.error("Unexpected data format:", data);
                setResults([]);
            }

            setHasSearched(true);
        } catch (error) {
            console.error("Search error:", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSearch} className="w-full flex flex-col md:flex-row gap-2">
                <input
                    type="text"
                    placeholder="Describe your dream home (e.g., a sea-view villa in Sarıyer)."
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-white bg-white dark:bg-gray-700 w-full"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 w-full md:w-auto"
                >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
                    Ara
                </button>
            </form>

            {/* --- Sonuçlar Alanı --- */}
            {/* Sadece arama yapıldıysa ve sonuç varsa gösterelim (Hero içinde temiz dursun) */}
            {hasSearched && (
                <div className="mt-4 bg-white p-4 rounded-lg shadow-xl absolute left-0 right-0 z-50 max-h-96 overflow-y-auto w-full md:max-w-3xl md:mx-auto border border-gray-200">

                    {/* Sonuç Yoksa */}
                    {results.length === 0 && !loading && (
                        <p className="text-center text-gray-500 py-4">
                            No listings were found that match your criteria.
                        </p>
                    )}

                    {/* Sonuçlar Varsa */}
                    <div className="space-y-4">
                        {/* .filter kullanmadan önce results'ın dizi olduğundan eminiz */}
                        {results
                            .filter((property) => property.score > 0.60)
                            .map((property) => (
                                <Link href={`/properties/${property._id}`} key={property._id} className="block group">
                                    <div className="flex items-center gap-4 border-b pb-4 last:border-0 hover:bg-gray-50 p-2 rounded transition">
                                        {/* Küçük Resim */}
                                        <div className="relative w-20 h-20 flex-shrink-0">
                                            <Image
                                                src={property.images && property.images[0] ? property.images[0] : "/images/placeholder.jpg"}
                                                alt={property.name}
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                        </div>

                                        {/* Yazılar */}
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800 group-hover:text-blue-600 line-clamp-1">
                                                {property.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {property.location?.city}, {property.location?.state}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                    {property.type}
                                                </span>
                                                <span className="text-xs text-green-600 font-bold">
                                                    %{(property.score * 100).toFixed(0)} Match
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SemanticSearchBox;
