"use client";
import { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import { FaSpinner } from "react-icons/fa";

const SimilarProperties = ({ propertyId }) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSimilarProperties = async () => {
            try {
                const res = await fetch(`/api/properties/${propertyId}/similar`);

                if (!res.ok) {
                    console.error("Benzer ilanlar çekilemedi");
                    return;
                }

                const data = await res.json();
                setProperties(data);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (propertyId) {
            fetchSimilarProperties();
        }
    }, [propertyId]);

    // Yükleniyorsa dönen bir çark göster
    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
        );
    }

    // Eğer benzer ilan bulunamadıysa (veya boş döndüyse) bileşeni gizle
    if (properties.length === 0) {
        return null;
    }

    return (
        <div className="bg-blue-50 dark:bg-gray-900 px-6 py-10 rounded-xl shadow-sm mt-10">
            <h3 className="text-2xl font-bold text-blue-800 dark:text-white mb-6 text-center md:text-left">
                You might also like these
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {properties.map((property) => (
                    <PropertyCard key={property._id} property={property} />
                ))}
            </div>
        </div>
    );
};

export default SimilarProperties;
