//import properties from '@/properties.json';
import PropertyCard from './PropertyCard';
import Link from 'next/link';
import connectToDatabase from '@/config/database';
import Property from '@/models/Property';

const HomeProperties = async () => {

    await connectToDatabase();
    const recentProperties = await Property.find({}).sort({ createdAt: -1 }).limit(3).lean();

    //const recentProperties = properties.slice(0, 6);
    return (
        <>
            <section className="bg-blue-50 dark:bg-gray-900 px-4 py-6">
                <div className="container-xl lg:container m-auto px-4 py-6">
                    <h2 className="text-2xl font-bold mb-6 text-blue-500 text-center">Recent Properties</h2>
                    {recentProperties.length === 0 ? (<p>No Properties Found</p>) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {recentProperties.map((property) => (
                                <PropertyCard key={property._id} property={property} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
            <section className="m-auto max-w-lg my-6 px-6">
                <Link href="/properties" className="block text-center bg-black text-white py-3 px-6 rounded hover:bg-gray-600 transition-colors">
                    View All Properties
                </Link>
            </section>
        </>
    );
}

export default HomeProperties;
