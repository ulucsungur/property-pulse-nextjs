
import PropertyHeaderImage from "@/components/PropertyHeaderImage";
import PropertyDetails from "@/components/PropertyDetails";
import PropertyImages from "@/components/PropertyImages";
import BookmarkButton from "@/components/BookmarkButton";
import ShareButtons from "@/components/ShareButtons";
import PropertyContactForm from "@/components/PropertyContactForm";
import connectToDatabase from "@/config/database";
import Property from "@/models/Property";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { convertToSerializableObject } from "@/utils/convertToObject";


const PropertyPage = async ({ params }) => {
    await connectToDatabase();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    //const propertyDoc = await Property.findById(id).lean();
    const propertyDoc = await Property.findById(id).populate("owner", "_id name email").lean();
    //const property = convertToSerializableObject(propertyDoc);
    const property = JSON.parse(JSON.stringify(propertyDoc));


    if (!property) {
        return <h1 className="text-center text-2xl font-bold">Property not found</h1>;
    }

    return (
        <>
            {/* <!-- Header Image --> */}
            <PropertyHeaderImage image={property.images[0]} />
            {/* <!-- Go Back --> */}
            <section>
                <div className="container m-auto py-6 px-6">
                    <Link
                        href="/properties"
                        className="text-blue-500 hover:text-blue-600 flex items-center"
                    >
                        <FaArrowLeft className="mr-2" />  Back to Properties
                    </Link>
                </div>
            </section>
            {/* <!-- Property Info --> */}
            <section className="bg-blue-50">
                <div className="container m-auto py-10 px-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Main Content (8/12 = ~70%) */}
                        <div className="md:col-span-8">
                            <PropertyDetails property={property} />
                        </div>

                        {/* Aside (4/12 = ~30%) */}
                        <aside className="md:col-span-4 space-y-4">
                            <BookmarkButton property={property} />
                            <ShareButtons property={property} />
                            <PropertyContactForm property={property} />
                        </aside>
                    </div>
                </div>

            </section>
            <PropertyImages images={property.images} />
        </>
    );
};

export default PropertyPage;
