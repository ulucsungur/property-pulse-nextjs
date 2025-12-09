import PropertyEditForm from "@/components/PropertyEditForm";
import connectToDatabase from "@/config/database";
import Property from "@/models/Property";
import { convertToSerializableObject } from "@/utils/convertToObject";

const PropertyEditPage = async ({ params }) => {
    await connectToDatabase();
    const { id } = params;

    if (!id) {
        return <h1 className="text-center text-2xl font-bold mt-10">Missing property id</h1>;
    }

    const propertyDoc = await Property.findById(id.toString()).lean();
    const property = convertToSerializableObject(propertyDoc);

    if (!property) {
        return <h1 className="text-center text-2xl font-bold mt-10">Property not found</h1>;
    }

    return (
        <section className="bg-blue-50">
            <div className="container m-auto max-w-2xl py-24">
                <div className="bg-white px-6 py-8 shadow-md rounded-md border border-gray-300 m-4 md.m-0">
                    <PropertyEditForm property={property} />
                </div>
            </div>
        </section>
    );
};

export default PropertyEditPage;
