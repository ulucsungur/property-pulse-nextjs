import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import PropertySearchForm from "@/components/PropertySearchForm";
import connectToDatabase from "@/config/database";
import Property from "@/models/Property";
import { convertToSerializableObject } from "@/utils/convertToObject";
import { FaArrowCircleLeft } from "react-icons/fa";


const SearchResultPage = async ({ searchParams }) => {
    //console.log(location, propertyType)
    // searchParams önce await edilmeli
    const params = await searchParams;

    const location = params?.location || "";
    const propertyType = params?.propertyType || "";


    await connectToDatabase();

    const locationPattern = new RegExp(location || '', 'i');

    let query = {
        $or: [
            { name: locationPattern },
            { description: locationPattern },
            { 'location.street': locationPattern },
            { 'location.city': locationPattern },
            { 'location.state': locationPattern },
            { 'location.zipCode': locationPattern }

        ],
    };

    if (propertyType && propertyType !== 'All') {
        const typePattern = new RegExp(propertyType, 'i');
        query.type = typePattern;
    }

    const propertiesQueryResults = await Property.find(query).lean();
    const properties = convertToSerializableObject(propertiesQueryResults);
    //console.log(properties)
    return (
        <>
            <section className="bg-blue-700 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start">
                    <PropertySearchForm />
                </div>
            </section>
            <section className="px-4 py-6">
                <div className="container-xl lg:container m-auto px-4 py-6">
                    <Link href="/properties" className="inline-flex items-center text-blue-600 hover:underline mb-4">
                        <FaArrowCircleLeft className="mr-2 mb-1" />
                        Back to All Properties
                    </Link>
                    <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
                    {properties.length === 0 ? (
                        <p>No properties found matching your criteria.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {properties.map((property) => (
                                <PropertyCard key={property._id} property={property} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

        </>
    );
}

export default SearchResultPage;
