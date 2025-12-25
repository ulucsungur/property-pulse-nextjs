import PropertyEditForm from "@/components/PropertyEditForm";
import connectToDatabase from "@/config/database";
import Property from "@/models/Property";
import { convertToSerializableObject } from "@/utils/convertToObject";

const PropertyEditPage = async ({ params }) => {
    await connectToDatabase();

    // Next.js 15 params await
    const { id } = await params;

    if (!id) {
        return <h1 className="text-center text-2xl font-bold mt-10">Missing property id</h1>;
    }

    const propertyDoc = await Property.findById(id).lean();
    const property = convertToSerializableObject(propertyDoc);

    if (!property) {
        return <h1 className="text-center text-2xl font-bold mt-10">Property not found</h1>;
    }

    return (
        // DÜZELTME 1: Dış arka plan (dark:bg-gray-900)
        <section className="bg-blue-50 dark:bg-gray-900 min-h-screen">
            <div className="container m-auto max-w-2xl py-24">
                {/* DÜZELTME 2: Form kutusu arka planı (dark:bg-gray-800) ve border */}
                <div className="bg-white dark:bg-gray-800 px-6 py-8 shadow-md rounded-md border border-gray-200 dark:border-gray-700 m-4 md:m-0">
                    <PropertyEditForm property={property} />
                </div>
            </div>
        </section>
    );
};

export default PropertyEditPage;
