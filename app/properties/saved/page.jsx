export const dynamic = 'force-dynamic';

import PropertyCard from '@/components/PropertyCard';
import connectDB from '@/config/database';
import User from '@/models/User';
import { getUserSession } from '@/utils/getUserSession';

const SavedPropertiesPage = async () => {
    const sessionUser = await getUserSession();

    if (!sessionUser || !sessionUser.userId) {
        return (
            <h1 className='text-2xl text-center mt-10'>
                Giriş yapmanız gerekiyor.
            </h1>
        );
    }

    const { userId } = sessionUser;

    await connectDB();

    // populate ve lean kullanıyoruz
    const user = await User.findById(userId).populate('bookmarks').lean();

    // === ÇÖZÜM BURADA ===
    // MongoDB objelerini (ObjectId, Date) string'e çevirmek için JSON dönüşümü yapıyoruz.
    // Bu sayede "Only plain objects..." hatası ortadan kalkar.
    const bookmarks = user ? JSON.parse(JSON.stringify(user.bookmarks)) : [];

    return (
        <section className='px-4 py-6'>
            <div className='container-xl lg:container m-auto px-4 py-6'>
                <h1 className='text-2xl mb-4'>Kaydedilen İlanlar</h1>
                {bookmarks.length === 0 ? (
                    <p>Hiç kayıtlı ilanınız yok.</p>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {bookmarks.map((property) => (
                            <PropertyCard key={property._id} property={property} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default SavedPropertiesPage;

// import PropertyCard from "@/components/PropertyCard";
// import connectToDatabase from "@/config/database";
// import User from "@/models/User";
// import { getUserSession } from "@/utils/getUserSession";


// const SavedPropertiesPage = async () => {
//     const { userId } = await getUserSession();
//     //console.log(userId) // terminalde görebilirsin

//     await connectToDatabase();

//     const { bookmarks } = await User.findById(userId).populate('bookmarks');

//     //console.log(bookmarks) // terminalde görebilirsin

//     return (
//         <section className="px-4 py-8 pt-28">
//             <div className="container lg:container m-auto px-4 py-6">
//                 <h1 className="text-3xl font-bold mb-6">Saved Properties</h1>
//                 {bookmarks.length === 0 ? (
//                     <p>You have no saved properties.</p>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {bookmarks.map((property) => (
//                             <PropertyCard key={property._id} property={property} />
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </section>
//     );
// }

// export default SavedPropertiesPage;
