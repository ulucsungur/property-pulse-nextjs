import PropertyCard from '@/components/PropertyCard';
import connectToDatabase from '@/config/database';
import Property from '@/models/Property';
import AnimationWrapper from './AnimationWrapper';

const FeaturedProperties = async () => {
    await connectToDatabase();

    const propertiesDoc = await Property.find({
        is_featured: true,
    }).lean();

    const properties = JSON.parse(JSON.stringify(propertiesDoc));

    return (
        properties.length > 0 && (
            <section className="bg-blue-50 dark:bg-gray-900 px-4 pt-6 pb-10">
                <div className='container-xl lg:container m-auto'>
                    <h2 className='text-3xl font-bold text-blue-500 mb-6 text-center'>
                        Featured Properties
                    </h2>

                    {/* DÜZELTME BURADA: */}
                    {/* AnimationWrapper'a doğrudan Grid sınıflarını veriyoruz. */}
                    {/* Böylece araya fazladan div girmiyor, düzen bozulmuyor. */}
                    <AnimationWrapper className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
                        {properties.map((property) => (
                            <PropertyCard key={property._id} property={property} />
                        ))}
                    </AnimationWrapper>

                </div>
            </section>
        )
    );
};
export default FeaturedProperties;
