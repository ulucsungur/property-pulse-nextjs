import PropertyCard from '@/components/PropertyCard';
import Link from 'next/link';
import connectToDatabase from '@/config/database';
import Property from '@/models/Property';
import AnimationWrapper from './AnimationWrapper';

const HomeProperties = async () => {
    await connectToDatabase();

    const recentPropertiesDoc = await Property.find({})
        .sort({ createdAt: -1 })
        .limit(4)
        .lean();

    const recentProperties = JSON.parse(JSON.stringify(recentPropertiesDoc));

    return (
        <>
            <section className='px-4 py-6'>
                <div className='container-xl lg:container m-auto'>
                    <h2 className='text-3xl font-bold text-blue-500 mb-6 text-center'>
                        Recent Properties
                    </h2>

                    {/* DÜZELTME: AnimationWrapper GRID OLARAK DAVRANIYOR */}
                    <AnimationWrapper className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full'>
                        {recentProperties.length === 0 ? (
                            <p>No Properties Found</p>
                        ) : (
                            recentProperties.map((property) => (
                                <PropertyCard key={property._id} property={property} />
                            ))
                        )}
                    </AnimationWrapper>

                </div>
            </section>
            <section className='m-auto max-w-lg my-10 px-6'>
                <Link
                    href='/properties'
                    className='block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700 transition-transform hover:scale-105'
                >
                    View All Properties
                </Link>
            </section>
        </>
    );
};
export default HomeProperties;
