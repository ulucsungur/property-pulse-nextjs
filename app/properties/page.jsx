//import properties from '@/properties.json';
import PropertyCard from '@/components/PropertyCard';
import Pagination from '@/components/Pagination';
import connectToDatabase from '@/config/database';
import Property from '@/models/Property';

const PropertiesPage = async ({ searchParams }) => {
    //console.log(searchParams)
    // console.log(properties)
    await connectToDatabase();
    const params = await searchParams;
    const page = parseInt(params.page) || 1;
    const pageSize = parseInt(params.pageSize) || 9;

    const skip = (page - 1) * pageSize;
    const total = await Property.countDocuments({});
    const properties = await Property.find({}).skip(skip).limit(parseInt(pageSize));

    const showPagination = total > pageSize

    return (
        <section className="px-4 py-8">
            <div className="container-xl lg:container m-auto px-4 py-6">
                {properties.length === 0 ? (<p>No Properties Found</p>) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {properties.map((property) => (
                            <PropertyCard key={property._id} property={property} />
                        ))}
                    </div>
                )}
            </div>
            {showPagination && (
                <Pagination totalItems={total} page={parseInt(page)} pageSize={parseInt(pageSize)} />
            )}

        </section>



    );
}

export default PropertiesPage;
