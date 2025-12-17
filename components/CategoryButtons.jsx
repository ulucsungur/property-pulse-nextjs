import Link from "next/link";
import { PROPERTY_TYPES } from "@/config/propertyTypes"; // Merkezi listeyi çağır
import {
    FaBuilding, FaHome, FaHotel, FaWarehouse, FaStore, FaLandmark, FaBed, FaMountain, FaQuestionCircle
} from "react-icons/fa";

const CategoryButtons = () => {

    // Hangi kategoriye hangi ikonun geleceğini belirleyen harita
    // Anahtar kelimeler (Key), config dosyasındaki 'value' ile AYNI olmalı
    const iconMap = {
        "Apartment": <FaBuilding />,
        "Condo": <FaLandmark />,
        "House": <FaHome />,
        "Villa": <FaHotel />,
        "Cottage": <FaWarehouse />,
        "Room": <FaBed />,
        "Studio": <FaStore />,
        "Loft": <FaBuilding />,
        "Chalet": <FaMountain />,
        "Other": <FaQuestionCircle />,
    };

    return (
        <section className="bg-blue-50 py-4 border-t border-blue-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="text-center font-bold text-gray-700 mb-4">Browse by Category</h3>
                <div className="flex flex-wrap justify-center gap-4">

                    {/* Config dosyasındaki listeyi döngüye sokuyoruz */}
                    {PROPERTY_TYPES.map((type) => (
                        <Link
                            key={type.value}
                            href={`/properties?type=${type.value}`}
                            className="bg-white hover:bg-blue-600 hover:text-white text-gray-700 font-medium py-2 px-6 rounded-full shadow-sm transition duration-300 flex items-center gap-2 border border-gray-200"
                        >
                            {/* İkonu haritadan bul, yoksa varsayılan ev ikonu koy */}
                            <span className="text-lg">{iconMap[type.value] || <FaHome />}</span>

                            {/* Etiketi config dosyasından al (İngilizce gelecek) */}
                            <span>{type.label}</span>
                        </Link>
                    ))}

                    {/* Filtreyi Temizle Butonu */}
                    <Link
                        href="/properties"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-full shadow-sm transition duration-300"
                    >
                        View All
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CategoryButtons;
