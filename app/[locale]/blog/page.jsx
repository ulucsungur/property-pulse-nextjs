import { getBlogs } from '@/app/actions/blogActions';
import BlogCard from '@/components/BlogCard';
import { getTranslations } from 'next-intl/server'; // Server Component için çeviri fonksiyonu

// Metadata'yı dinamik hale getiriyoruz (TR/EN değişsin diye)
export async function generateMetadata({ params }) {
    const { locale } = await params; // Next.js 15'te params Promise'dir
    const t = await getTranslations({ locale, namespace: 'Blog' });

    return {
        title: locale === 'tr' ? 'Emlak Rehberi ve Blog' : 'Real Estate Guide & Blog',
        description: locale === 'tr'
            ? 'Gayrimenkul dünyasından en güncel haberler, yatırım tavsiyeleri ve ipuçları.'
            : 'Latest news, investment advice, and tips from the real estate world.',
    };
}


const BlogPage = async ({ params }) => {
    // 1. Dili ve Çeviriyi Al
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Blog' });

    // 2. Verileri Çek
    const blogs = await getBlogs();

    return (
        <section className='bg-blue-50 dark:bg-gray-900 py-6 min-h-screen transition-colors duration-300'>
            <div className='container-xl lg:container m-auto px-4 py-6'>

                <div className='flex flex-col md:flex-row justify-between items-center mb-8'>
                    {/* Başlık Çevirisi */}
                    <h1 className='text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0 mt-16'>
                        {t('pageTitle')}
                    </h1>
                </div>

                {blogs.length === 0 ? (
                    <div className='text-center py-10'>
                        {/* "Yazı Yok" Mesajı Çevirisi */}
                        <p className='text-gray-500 text-xl'>{t('noPosts')}</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {blogs.map((blog) => (
                            <BlogCard key={blog._id} blog={blog} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogPage;


// import { getBlogs } from '@/app/actions/blogActions';
// import BlogCard from '@/components/BlogCard';

// // Sayfa Metadata
// export const metadata = {
//     title: 'Blog | Property Pulse',
//     description: 'Emlak dünyasından en son haberler ve ipuçları.',
// };

// const BlogPage = async () => {
//     const blogs = await getBlogs();

//     return (
//         <section className='bg-blue-50 dark:bg-gray-900 py-6 min-h-screen transition-colors duration-300'>
//             <div className='container-xl lg:container m-auto px-4 py-6'>

//                 <div className='flex flex-col md:flex-row justify-between items-center mb-8'>
//                     {/* DEĞİŞİKLİK: Başlık rengi dark:text-white */}
//                     <h1 className='text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0'>
//                         Blog & News
//                     </h1>
//                 </div>

//                 {blogs.length === 0 ? (
//                     <div className='text-center py-10'>
//                         <p className='text-gray-500 text-xl'>Henüz hiç blog yazısı eklenmemiş.</p>
//                     </div>
//                 ) : (
//                     <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
//                         {blogs.map((blog) => (
//                             <BlogCard key={blog._id} blog={blog} />
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </section>
//     );
// };

// export default BlogPage;
