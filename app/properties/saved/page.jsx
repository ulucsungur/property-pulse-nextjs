import PropertyCard from "@/components/PropertyCard";
import connectToDatabase from "@/config/database";
import User from "@/models/User";
import { getUserSession } from "@/utils/getUserSession";


const SavedPropertiesPage = async () => {
    const { userId } = await getUserSession();
    //console.log(userId) // terminalde görebilirsin

    await connectToDatabase();

    const { bookmarks } = await User.findById(userId).populate('bookmarks');

    //console.log(bookmarks) // terminalde görebilirsin

    return (
        <section className="px-4 py-8 pt-28">
            <div className="container lg:container m-auto px-4 py-6">
                <h1 className="text-3xl font-bold mb-6">Saved Properties</h1>
                {bookmarks.length === 0 ? (
                    <p>You have no saved properties.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookmarks.map((property) => (
                            <PropertyCard key={property._id} property={property} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default SavedPropertiesPage;
