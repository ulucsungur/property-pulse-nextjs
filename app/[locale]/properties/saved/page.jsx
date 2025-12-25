export const dynamic = 'force-dynamic';

import PropertyCard from '@/components/PropertyCard';
import connectDB from '@/config/database';
import User from '@/models/User';
import { getUserSession } from '@/utils/getUserSession';
// 1. IMPORT: Server Component için çeviri fonksiyonu
import { getTranslations } from 'next-intl/server';

// Next.js 15: params bir Promise'dir, async alınır.
const SavedPropertiesPage = async ({ params }) => {
    // 2. Dili ve Çeviriyi Al
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'SavedProperties' });

    const sessionUser = await getUserSession();

    if (!sessionUser || !sessionUser.userId) {
        return (
            <section className="bg-blue-50 dark:bg-gray-900 min-h-screen pt-20">
                <div className="container m-auto px-4 py-6">
                    <div className="bg-white dark:bg-gray-800 px-6 py-8 shadow-md rounded-md border border-gray-200 dark:border-gray-700 text-center">
                        <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
                            {t('loginRequired')}
                        </h1>
                    </div>
                </div>
            </section>
        );
    }

    const { userId } = sessionUser;

    await connectDB();

    const user = await User.findById(userId).populate('bookmarks').lean();
    const bookmarks = user ? JSON.parse(JSON.stringify(user.bookmarks)) : [];

    return (
        <section className='bg-blue-50 dark:bg-gray-900 min-h-screen pt-10 pb-20'>
            <div className='container-xl lg:container m-auto px-4 py-6'>
                {/* Başlık */}
                <h1 className='text-3xl font-bold mb-6 mt-6 text-gray-800 dark:text-white'>
                    {t('title')}
                </h1>

                {bookmarks.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 px-6 py-8 shadow-md rounded-md border border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-gray-500 dark:text-gray-300 text-lg">
                            {t('noBookmarks')}
                        </p>
                    </div>
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
