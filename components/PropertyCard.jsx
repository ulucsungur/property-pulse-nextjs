'use client';
import Image from "next/image";
import { Link } from "@/utils/navigation";
import { FaBed, FaBath, FaRulerCombined, FaMoneyBill, FaMapMarker } from "react-icons/fa";
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl'; // 2. IMPORT: Çeviri kancası
import { useCurrency } from '@/context/CurrencyContext';

const PropertyCard = ({ property }) => {
    const t = useTranslations('PropertyCard');
    const { formatPrice } = useCurrency();

    // const getRateDisplay = () => {
    //     const { rates } = property;
    //     if (rates.monthly) {
    //         return `$${rates.monthly.toLocaleString()}/${t('mo')}`;
    //     } else if (rates.weekly) {
    //         return `$${rates.weekly.toLocaleString()}/${t('wk')}`;
    //     } else if (rates.nightly) {
    //         return `$${rates.nightly.toLocaleString()}/${t('night')}`;
    //     }
    // };
    const getDisplayPrice = () => {
        if (property.rates.monthly) {
            // 3. FORMATLAMA KULLAN
            return `${formatPrice(property.rates.monthly)} /mo`;
        } else if (property.rates.weekly) {
            return `${formatPrice(property.rates.weekly)} /wk`;
        } else if (property.rates.nightly) {
            return `${formatPrice(property.rates.nightly)} /night`;
        }
        return '';
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        show: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 50, duration: 0.5 }
        }
    };

    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="rounded-xl shadow-md relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-shadow hover:shadow-xl"
        >
            <Link href={`/properties/${property._id}`}>
                <Image
                    src={property.images[0]}
                    alt={property.name}
                    width='0'
                    height='0'
                    sizes="100vw"
                    priority
                    className="w-full h-auto rounded-t-xl object-cover aspect-[4/3]" // Resim oranını sabitledik
                />
            </Link>

            <div className="p-4">
                <div className="text-left md:text-center lg:text-left mb-6">
                    {/* Mülk Tipi */}
                    <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                        {property.type}
                    </div>
                    {/* Başlık */}
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-1">
                        {property.name}
                    </h3>
                </div>

                {/* Fiyat Etiketi */}
                <h3 className="absolute top-[10px] right-[10px] bg-white dark:bg-gray-900 px-4 py-2 rounded-lg text-blue-600 dark:text-blue-400 font-bold text-right md:text-center lg:text-right shadow-sm text-sm">
                    {/* {getRateDisplay()} */}
                    {getDisplayPrice()}
                </h3>

                {/* Özellikler (Yatak, Banyo, m2) */}
                <div className="flex justify-center gap-4 text-gray-500 dark:text-gray-300 mb-4 text-sm">
                    <p className="flex items-center gap-1">
                        <FaBed className="md:hidden lg:inline" /> {property.beds}{' '}
                        <span className="md:hidden lg:inline">{t('beds')}</span>
                    </p>
                    <p className="flex items-center gap-1">
                        <FaBath className="md:hidden lg:inline" /> {property.baths}{' '}
                        <span className="md:hidden lg:inline">{t('baths')}</span>
                    </p>
                    <p className="flex items-center gap-1">
                        <FaRulerCombined className="md:hidden lg:inline" />
                        {property.square_feet} <span className="md:hidden lg:inline">{t('sqft')}</span>
                    </p>
                </div>

                {/* Fiyat Tipleri (Yeşil Yazılar) */}
                {/* 4. DÜZELTME: Dark mode için dark:text-green-400 eklendi */}

                <div className="flex justify-center gap-4 text-green-900 dark:text-green-400 text-sm mb-4 h-6">
                    {/* Sadece verisi olanları gösteriyoruz */}
                    {Number(property.rates.nightly) > 0 && (
                        <p className="flex items-center gap-1">
                            <FaMoneyBill className="md:hidden lg:inline" /> {t('nightly')}
                        </p>
                    )}
                    {Number(property.rates.weekly) > 0 && (
                        <p className="flex items-center gap-1">
                            <FaMoneyBill className="md:hidden lg:inline" /> {t('weekly')}
                        </p>
                    )}
                    {Number(property.rates.monthly) > 0 && (
                        <p className="flex items-center gap-1">
                            <FaMoneyBill className="md:hidden lg:inline" /> {t('monthly')}
                        </p>
                    )}
                </div>

                <div className="border border-gray-100 dark:border-gray-700 mb-5"></div>

                <div className="flex flex-col lg:flex-row justify-between mb-4 items-center">
                    {/* Konum (Turuncu Yazı) */}
                    {/* 5. DÜZELTME: Dark mode için dark:text-orange-300 eklendi */}
                    <div className="flex align-middle gap-2 mb-4 lg:mb-0 text-orange-700 dark:text-orange-300">
                        <FaMapMarker className="mt-1 text-orange-500 dark:text-orange-400" />
                        <span> {property.location.city} {property.location.state} </span>
                    </div>

                    {/* Detay Butonu */}
                    <Link
                        href={`/properties/${property._id}`}
                        className="h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm transition-colors w-full lg:w-auto block"
                    >
                        {t('details')}
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

export default PropertyCard;


// 'use client';
// import Image from "next/image";
// import Link from "next/link";
// import { FaBed, FaBath, FaRulerCombined, FaMoneyBill, FaMapMarker } from "react-icons/fa";
// import { motion } from 'framer-motion';
// import { fadeIn } from '@/utils/motion';


// const PropertyCard = ({ property, index }) => { // index prop'u alabilirsek harika olur (sırayla gelmesi için)

//     // ... getRateDisplay fonksiyonu aynı ...
//     const getRateDisplay = () => {
//         const { rates } = property;
//         if (rates.monthly) {
//             return `$${rates.monthly.toLocaleString()}/mo`;
//         } else if (rates.weekly) {
//             return `$${rates.weekly.toLocaleString()}/wk`;
//         } else if (rates.nightly) {
//             return `$${rates.nightly.toLocaleString()}/night`;
//         }
//     };

//     const itemVariants = {
//         hidden: { y: 20, opacity: 0 }, // Başlangıç: 50px aşağıda ve görünmez
//         show: {
//             y: 0,
//             opacity: 1,
//             transition: { type: 'spring', stiffness: 50, duration: 0.5 } // Bitiş: Yerinde ve görünür
//         }
//     };

//     return (
//         <motion.div
//             variants={itemVariants}
//             // initial="hidden"
//             // whileInView="show"
//             // viewport={{ once: true, amount: 0.1 }}
//             whileHover={{ y: -5 }}
//             className="rounded-xl shadow-md relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-shadow hover:shadow-xl"
//         >
//             <Link href={`/properties/${property._id}`}>
//                 <Image
//                     src={property.images[0]}
//                     alt=""
//                     width='0'
//                     height='0'
//                     sizes="100vw"
//                     priority
//                     className="w-full h-auto rounded-t-xl"
//                 />
//             </Link>

//             {/* ... geri kalan içerik (div className="p-4" ...) tamamen aynı kalsın ... */}
//             <div className="p-4">
//                 <div className="text-left md:text-center lg:text-left mb-6">
//                     <div className="text-gray-600 dark:text-gray-400">{property.type}</div>
//                     <h3 className="text-xl font-bold text-gray-800 dark:text-white">{property.name}</h3>
//                 </div>
//                 <h3
//                     className="absolute top-[10px] right-[10px] bg-white dark:bg-gray-900 px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right"
//                 >
//                     {getRateDisplay()}
//                 </h3>

//                 <div className="flex justify-center gap-4 text-gray-500 dark:text-gray-300 mb-4 text-sm">
//                     <p>
//                         <FaBed className="md:hidden lg:inline" /> {property.beds}{' '}
//                         <span className="md:hidden lg:inline">Beds</span>
//                     </p>
//                     <p>
//                         <FaBath className="md:hidden lg:inline" /> {property.baths}{' '}
//                         <span className="md:hidden lg:inline">Baths</span>
//                     </p>
//                     <p>
//                         <FaRulerCombined className="md:hidden lg:inline" />
//                         {property.square_feet} <span className="md:hidden lg:inline">sqft</span>
//                     </p>
//                 </div>

//                 <div
//                     className="flex justify-center gap-4 text-green-900 text-sm mb-4"
//                 >
//                     <p><FaMoneyBill className="md:hidden lg:inline" /> Nightly</p>
//                     <p><FaMoneyBill className="md:hidden lg:inline" /> Weekly</p>
//                     <p><FaMoneyBill className="md:hidden lg:inline" /> Monthly</p>
//                 </div>

//                 <div className="border border-gray-100 dark:border-gray-700 mb-5"></div>

//                 <div className="flex flex-col lg:flex-row justify-between mb-4">
//                     <div className="flex align-middle gap-2 mb-4 lg:mb-0">
//                         <FaMapMarker className="mt-1 text-orange-500" />
//                         <span className="text-orange-700"> {property.location.city} {property.location.state} </span>
//                     </div>
//                     <Link
//                         href={`/properties/${property._id}`}
//                         className="h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm"
//                     >
//                         Details
//                     </Link>
//                 </div>
//             </div>
//         </motion.div>
//     );
// }

// export default PropertyCard;
