import Link from "next/link";
import { PROPERTY_TYPES } from "@/config/propertyTypes";
import {
    FaBuilding, FaHome, FaHotel, FaWarehouse, FaStore, FaLandmark, FaBed, FaMountain, FaQuestionCircle
} from "react-icons/fa";

const CategoryButtons = () => {

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
        // py-4 -> py-2 yaptık, dikey boşluğu azalttık
        <section className="bg-blue-50 dark:bg-gray-900 py-2 border-t border-blue-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Başlık margin'ini azalttık (mb-4 -> mb-2) */}
                {/* <h3 className="text-center font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide opacity-80">Kategoriler</h3> */}

                {/* gap-4 -> gap-2 yaptık, butonları birbirine yaklaştırdık */}
                <div className="flex flex-wrap justify-center gap-2">

                    {PROPERTY_TYPES.map((type) => (
                        <Link
                            key={type.value}
                            href={`/properties?type=${type.value}`}
                            // Butonları küçülttük: py-1.5 px-4, text-sm
                            className="bg-white hover:bg-blue-600 hover:text-white text-gray-700 font-medium py-1.5 px-4 rounded-full shadow-sm transition duration-300 flex items-center gap-1.5 border border-gray-200 text-sm"
                        >
                            <span className="text-base">{iconMap[type.value] || <FaHome />}</span>
                            <span>{type.label}</span>
                        </Link>
                    ))}

                    <Link
                        href="/properties"
                        // "View All" butonunu da aynı boyuta getirdik
                        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-1.5 px-4 rounded-full shadow-sm transition duration-300 text-sm"
                    >
                        View All
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CategoryButtons;
