import Link from "next/link";
import Image from "next/image";
import { FaBed, FaBath, FaRulerCombined, FaMoneyBill, FaMapMarker } from 'react-icons/fa'

const FeaturedPropertyCard = ({ property }) => {
    const getRateDisplay = () => {
        const { rates } = property;
        if (rates.monthly) {
            return `$${rates.monthly.toLocaleString()}/mo`;
        } else if (rates.weekly) {
            return `$${rates.weekly.toLocaleString()}/wk`;
        } else if (rates.nightly) {
            return `$${rates.nightly.toLocaleString()}/night`;
        }
    };
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md relative flex flex-col md:flex-row border border-gray-100 dark:border-gray-700">
            <div className="relative w-full aspect-[4/3] md:aspect-auto md:w-2/5">
                <Link href={`/properties/${property._id}`} className="block h-full">
                    <Image
                        src={property.images[0]}
                        alt={property.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover rounded-t-xl md:rounded-tr-none md:rounded-l-xl"
                    />
                </Link>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{property.name}</h3>
                <div className="text-gray-600 dark:text-gray-400 mb-4">{property.type}</div>
                <h3 className="absolute top-[10px] left-[10px] bg-white dark:bg-gray-900 px-4 py-2 rounded-lg text-blue-500 font-bold text-right md:text-center lg:text-right">
                    {getRateDisplay()}
                </h3>
                <div className="flex justify-center gap-4 text-gray-500 dark:text-gray-300 mb-4 text-sm">
                    <p>
                        <FaBed className="inline-block mr-2" />     {property.beds}{' '}
                        <span className="md:hidden lg:inline">Beds</span>
                    </p>
                    <p>
                        <FaBath className="inline-block mr-2" />     {property.baths}{' '}
                        <span className="md:hidden lg:inline">Baths</span>
                    </p>
                    <p>
                        <FaRulerCombined className="inline-block mr-2" />     {property.square_feet}{' '}
                        <span className="md:hidden lg:inline">sqft</span>
                    </p>
                </div>

                <div className="flex justify-center gap-4 text-gray-500 dark:text-gray-300 mb-4 text-sm">
                    {property.rates.nightly && (<p><FaMoneyBill className="inline mr-2" /> Nightly</p>)}
                    {property.rates.weekly && (<p><FaMoneyBill className="inline mr-2" /> Weekly</p>)}
                    {property.rates.monthly && (<p><FaMoneyBill className="inline mr-2" /> Monthly</p>)}
                </div>

                <div className="border border-gray-200 dark:border-gray-700 mb-5"></div>

                <div className="flex flex-col lg:flex-row justify-between mb-4">
                    <div className="flex align-middle gap-2 mb-4 lg:mb-0">
                        <FaMapMarker className="text-orange-700" />
                        <span className="flex flex-col lg:flex-row justify-between mb-4"> {property.location.city} {property.location.state}</span>
                    </div>
                    <a
                        href={`/properties/${property._id}`}
                        className="h-[36px] bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-center text-sm"
                    >
                        Details
                    </a>
                </div>
            </div>
        </div>);
}

export default FeaturedPropertyCard;
