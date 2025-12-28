'use client'; // Client component olduğu için
import { useTranslations } from 'next-intl';
// 1. DEĞİŞİKLİK: Link'i kendi navigation dosyamızdan çekiyoruz
import { Link } from "@/utils/navigation";
import { useSearchParams } from 'next/navigation';
import { PROPERTY_TYPES } from "@/config/propertyTypes";
import {
    FaBuilding, FaHome, FaHotel, FaWarehouse, FaStore, FaLandmark, FaBed, FaMountain, FaQuestionCircle
} from "react-icons/fa";

const CategoryButtons = () => {
    // JSON'daki "Categories" başlığını oku
    const t = useTranslations('Categories');
    // 2. YENİ: URL'deki ?type=Apartment gibi değerleri alıyoruz
    const searchParams = useSearchParams();
    const currentType = searchParams.get('type');

    const iconMap = {
        "Apartment": <FaBuilding />,
        "Condo": <FaLandmark />,
        "House": <FaHome />,
        "Villa": <FaHotel />,
        "Cottage or Cabin": <FaWarehouse />, // JSON'daki anahtarla uyumlu olmalı
        "Room": <FaBed />,
        "Studio": <FaStore />,
        "Loft": <FaBuilding />,
        "Chalet": <FaMountain />,
        "Other": <FaQuestionCircle />,
    };

    return (
        <section className="bg-blue-50 dark:bg-gray-950 py-4 border-t border-blue-100 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-center gap-2">

                    {PROPERTY_TYPES.map((type) => {
                        // 3. YENİ: Bu buton şu an aktif mi kontrolü
                        const isActive = currentType === type.value;

                        return (
                            <Link
                                key={type.value}
                                href={`/properties?type=${type.value}`}
                                className={`
                                    flex items-center gap-1.5 py-1.5 px-4 rounded-full shadow-sm transition duration-300 text-sm font-medium border
                                    ${isActive
                                        ? 'bg-blue-600 text-white border-blue-600 scale-105 shadow-md' // Aktif Stil
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600' // Pasif Stil
                                    }
                                `}
                            >
                                <span className="text-base">{iconMap[type.value] || <FaHome />}</span>
                                <span>{t(type.value)}</span>
                            </Link>
                        );
                    })}

                    <Link
                        href="/properties"
                        className={`
                            py-1.5 px-4 rounded-full shadow-sm transition duration-300 text-sm font-medium
                            ${!currentType // Eğer URL'de type yoksa "Hepsini Gör" aktiftir
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                            }
                        `}
                    >
                        {t('ViewAll')}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CategoryButtons;

// import Link from "next/link";
// import { PROPERTY_TYPES } from "@/config/propertyTypes";
// import { useTranslations } from 'next-intl';
// import {
//     FaBuilding, FaHome, FaHotel, FaWarehouse, FaStore, FaLandmark, FaBed, FaMountain, FaQuestionCircle
// } from "react-icons/fa";

// const CategoryButtons = () => {
//     const t = useTranslations('Categories');

//     const iconMap = {
//         "Apartment": <FaBuilding />,
//         "Condo": <FaLandmark />,
//         "House": <FaHome />,
//         "Villa": <FaHotel />,
//         "Cottage": <FaWarehouse />,
//         "Room": <FaBed />,
//         "Studio": <FaStore />,
//         "Loft": <FaBuilding />,
//         "Chalet": <FaMountain />,
//         "Other": <FaQuestionCircle />,
//     };

//     return (
//         // py-4 -> py-2 yaptık, dikey boşluğu azalttık
//         <section className="bg-blue-50 dark:bg-gray-900 py-2 border-t border-blue-100 dark:border-gray-800">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 {/* Başlık margin'ini azalttık (mb-4 -> mb-2) */}
//                 {/* <h3 className="text-center font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide opacity-80">Kategoriler</h3> */}

//                 {/* gap-4 -> gap-2 yaptık, butonları birbirine yaklaştırdık */}
//                 <div className="flex flex-wrap justify-center gap-2">

//                     {PROPERTY_TYPES.map((type) => (
//                         <Link
//                             key={type.value}
//                             href={`/properties?type=${type.value}`}
//                             // Butonları küçülttük: py-1.5 px-4, text-sm
//                             className="bg-white hover:bg-blue-600 hover:text-white text-gray-700 font-medium py-1.5 px-4 rounded-full shadow-sm transition duration-300 flex items-center gap-1.5 border border-gray-200 text-sm"
//                         >
//                             <span className="text-base">{iconMap[type.value] || <FaHome />}</span>
//                             <span>{type.label}</span>
//                         </Link>
//                     ))}

//                     <Link
//                         href="/properties"
//                         // "View All" butonunu da aynı boyuta getirdik
//                         className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-1.5 px-4 rounded-full shadow-sm transition duration-300 text-sm"
//                     >
//                         View All
//                     </Link>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default CategoryButtons;
