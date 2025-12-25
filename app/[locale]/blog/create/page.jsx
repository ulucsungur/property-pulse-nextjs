'use client';
import { useState } from 'react';
import { addBlog } from '@/app/actions/blogActions';
import { toast } from 'react-toastify';
// DİKKAT: Navigation için kendi yardımcı dosyamızı kullanıyoruz
import { useRouter } from '@/utils/navigation';
import { useTranslations } from 'next-intl';

const BlogCreatePage = () => {
    // Çeviri kancalarını başlat
    const t = useTranslations('BlogCreate');
    const tCat = useTranslations('BlogCreate.categories');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            await addBlog(formData);
            toast.success(t('toastSuccess'));
            router.push('/blog');
        } catch (error) {
            toast.error('Hata: ' + error.message);
            setIsSubmitting(false);
        }
    };

    return (
        <section className='bg-blue-50 dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300'>
            <div className='container m-auto max-w-2xl px-6 mt-16'>

                <div className='bg-white dark:bg-gray-800 px-6 py-8 mb-4 shadow-md rounded-md border dark:border-gray-700 m-4 md:m-0 transition-colors duration-300'>

                    <h2 className='text-3xl text-center font-semibold mb-6 text-gray-800 dark:text-white'>
                        {t('title')}
                    </h2>

                    <form action={handleSubmit}>

                        <div className='mb-4'>
                            <label className='block text-gray-700 dark:text-gray-200 font-bold mb-2'>
                                {t('labelTitle')}
                            </label>
                            <input
                                type='text'
                                id='title'
                                name='title'
                                className='border dark:border-gray-600 rounded w-full py-2 px-3 mb-2
                           dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:border-blue-500'
                                placeholder={t('placeholderTitle')}
                                required
                            />
                        </div>

                        {/* KATEGORİ */}
                        <div className='mb-4'>
                            <label className='block text-gray-700 dark:text-gray-200 font-bold mb-2'>
                                {t('category')}
                            </label>
                            <select
                                id='category'
                                name='category'
                                className='border dark:border-gray-600 rounded w-full py-2 px-3
                           dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-500'
                                required
                            >
                                {/* Value veritabanı için sabit, Label kullanıcı için çevrili */}
                                <option value='Genel'>{tCat('General')}</option>
                                <option value='Emlak İpuçları'>{tCat('RealEstateTips')}</option>
                                <option value='Piyasa Analizi'>{tCat('MarketAnalysis')}</option>
                                <option value='Dekorasyon'>{tCat('Decoration')}</option>
                                <option value='Yatırım'>{tCat('Investment')}</option>
                            </select>
                        </div>

                        {/* İÇERİK */}
                        <div className='mb-4'>
                            <label className='block text-gray-700 dark:text-gray-200 font-bold mb-2'>
                                {t('content')}
                            </label>
                            <textarea
                                id='content'
                                name='content'
                                className='border dark:border-gray-600 rounded w-full py-2 px-3 h-44
                           dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none'
                                placeholder={t('placeholderContent')}
                                required
                            ></textarea>
                        </div>

                        {/* GÖRSEL */}
                        <div className='mb-4'>
                            <label className='block text-gray-700 dark:text-gray-200 font-bold mb-2'>
                                {t('coverImage')}
                            </label>
                            <input
                                type='file'
                                id='image'
                                name='image'
                                className='border dark:border-gray-600 rounded w-full py-2 px-3
                           dark:bg-gray-700 dark:text-gray-300'
                                accept='image/*'
                                required
                            />
                        </div>

                        {/* ETİKETLER */}
                        <div className='mb-4'>
                            <label className='block text-gray-700 dark:text-gray-200 font-bold mb-2'>
                                {t('tags')}
                            </label>
                            <input
                                type='text'
                                id='tags'
                                name='tags'
                                className='border dark:border-gray-600 rounded w-full py-2 px-3
                           dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:border-blue-500'
                                placeholder={t('placeholderTags')}
                            />
                        </div>

                        {/* BUTON */}
                        <div>
                            <button
                                className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline transition duration-200 disabled:opacity-50'
                                type='submit'
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? t('submitting') : t('submit')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default BlogCreatePage;

// 'use client';
// import { useState } from 'react';
// import { addBlog } from '@/app/actions/blogActions';
// import { toast } from 'react-toastify';
// import { useRouter } from '@/utils/navigation'; // next/navigation yerine bizimki
// // 1. IMPORT
// import { useTranslations } from 'next-intl';

// const BlogCreatePage = () => {
//     // 2. KANCALARI BAŞLAT
//     const t = useTranslations('BlogCreate');
//     const tCat = useTranslations('BlogCreate.categories'); // Kategoriler için alt başlık

//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const router = useRouter();

//     const handleSubmit = async (formData) => {
//         setIsSubmitting(true);
//         try {
//             await addBlog(formData);
//             toast.success(t('toastSuccess')); // Çeviri
//             router.push('/blog');
//         } catch (error) {
//             toast.error('Hata: ' + error.message);
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <section className='bg-blue-50 dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300'>
//             <div className='container m-auto max-w-2xl px-6'>

//                 <div className='bg-white dark:bg-gray-800 px-6 py-8 mb-4 shadow-md rounded-md border border-gray-200 dark:border-gray-700 m-4 md:m-0 transition-colors duration-300'>

//                     <h2 className='text-3xl text-center font-semibold mb-6 text-gray-800 dark:text-white'>
//                         {t('title')}
//                     </h2>

//                     <form action={handleSubmit}>
//                         <div className='mb-4'>
//                             <label className='block text-gray-700 dark:text-gray-200 font-bold mb-2'>
//                                 {t('labelTitle')}
//                             </label>
//                             <input
//                                 type='text'
//                                 id='title'
//                                 name='title'
//                                 className='border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 mb-2
//                            bg-white dark:bg-gray-700 text-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:border-blue-500'
//                                 placeholder={t('placeholderTitle')}
//                                 required
//                             />
//                         </div>

//                         <div className='mb-4'>
//                             <label className='block text-gray-700 dark:text-gray-200 font-bold mb-2'>
//                                 {t('category')}
//                             </label>
//                             <select
//                                 id='category'
//                                 name='category'
//                                 className='border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3
//                            bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:border-blue-500'
//                                 required
//                             >
//                                 {/* Value sabit (İngilizce/DB), Label değişken (TR/EN) */}
//                                 <option value='General'>{tCat('General')}</option>
//                                 <option value='RealEstateTips'>{tCat('RealEstateTips')}</option>
//                                 <option value='MarketAnalysis'>{tCat('MarketAnalysis')}</option>
//                                 <option value='Decoration'>{tCat('Decoration')}</option>
//                                 <option value='Investment'>{tCat('Investment')}</option>
//                             </select>
//                         </div>

//                         <div className='mb-4'>
//                             <label className='block text-gray-700 dark:text-gray-200 font-bold mb-2'>
//                                 {t('content')}
//                             </label>
//                             <textarea
//                                 id='content'
//                                 name='content'
//                                 className='border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 h-44
//                            bg-white dark:bg-gray-700 text-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none'
//                                 placeholder={t('placeholderContent')}
//                                 required
//                             ></textarea>
//                         </div>

//                         <div className='mb-4'>
//                             <label className='block text-gray-700 dark:text-gray-200 font-bold mb-2'>
//                                 {t('coverImage')}
//                             </label>
//                             <input
//                                 type='file'
//                                 id='image'
//                                 name='image'
//                                 className='border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3
//                            bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
//                                 accept='image/*'
//                                 required
//                             />
//                         </div>

//                         <div className='mb-4'>
//                             <label className='block text-gray-700 dark:text-gray-200 font-bold mb-2'>
//                                 {t('tags')}
//                             </label>
//                             <input
//                                 type='text'
//                                 id='tags'
//                                 name='tags'
//                                 className='border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3
//                            bg-white dark:bg-gray-700 text-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:border-blue-500'
//                                 placeholder={t('placeholderTags')}
//                             />
//                         </div>

//                         <div>
//                             <button
//                                 className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline transition duration-200 disabled:opacity-50'
//                                 type='submit'
//                                 disabled={isSubmitting}
//                             >
//                                 {isSubmitting ? t('submitting') : t('submit')}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default BlogCreatePage;


// 'use client';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/utils/authOptions';
// import { redirect } from 'next/navigation';
// import { useState } from 'react';
// import { addBlog } from '@/app/actions/blogActions';
// import { toast } from 'react-toastify';
// import { useRouter } from 'next/navigation';

// const BlogCreatePage = () => {
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const router = useRouter();

//     const handleSubmit = async (formData) => {
//         setIsSubmitting(true);
//         try {
//             await addBlog(formData);
//             toast.success('Blog yazısı başarıyla oluşturuldu!');
//             router.push('/blog');
//         } catch (error) {
//             toast.error('Hata: ' + error.message);
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         // DEĞİŞİKLİK: Sayfa arka planı (dark:bg-gray-900)
//         <section className='bg-blue-50 dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300'>
//             <div className='container m-auto max-w-2xl px-6'>

//                 {/* DEĞİŞİKLİK: Form Kartı (dark:bg-gray-800, dark:border-gray-700) */}
//                 <div className='bg-white dark:bg-gray-800 px-6 py-8 mb-4 shadow-md rounded-md border dark:border-gray-700 m-4 md:m-0 transition-colors duration-300'>

//                     {/* DEĞİŞİKLİK: Başlık Rengi */}
//                     <h2 className='text-3xl text-center font-semibold mb-6 text-gray-800 dark:text-white'>
//                         Yeni Blog Yazısı
//                     </h2>

//                     <form action={handleSubmit}>
//                         <div className='mb-4'>
//                             {/* DEĞİŞİKLİK: Label Rengi */}
//                             <label className='block text-gray-700 dark:text-gray-200 font-bold mb-2'>
//                                 Blog Başlığı
//                             </label>
//                             {/* DEĞİŞİKLİK: Input Stilleri (dark:bg-gray-700, dark:text-white, dark:border-gray-600) */}
//                             <input
//                                 type='text'
//                                 id='title'
//                                 name='title'
//                                 className='border dark:border-gray-600 rounded w-full py-2 px-3 mb-2
//                            dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:border-blue-500'
//                                 placeholder='Örn: Emlak Piyasasında Son Durum'
//                                 required
//                             />
//                         </div>

//                         <div className='mb-4'>
//                             <label className='block text-gray-700 dark:text-gray-200 font-bold mb-2'>
//                                 Kategori
//                             </label>
//                             <select
//                                 id='category'
//                                 name='category'
//                                 className='border dark:border-gray-600 rounded w-full py-2 px-3
//                            dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-500'
//                                 required
//                             >
//                                 <option value='Genel'>Genel</option>
//                                 <option value='Emlak İpuçları'>Emlak İpuçları</option>
//                                 <option value='Piyasa Analizi'>Piyasa Analizi</option>
//                                 <option value='Dekorasyon'>Dekorasyon</option>
//                                 <option value='Yatırım'>Yatırım</option>
//                             </select>
//                         </div>

//                         <div className='mb-4'>
//                             <label className='block text-gray-700 dark:text-gray-200 font-bold mb-2'>
//                                 İçerik
//                             </label>
//                             <textarea
//                                 id='content'
//                                 name='content'
//                                 className='border dark:border-gray-600 rounded w-full py-2 px-3 h-44
//                            dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none'
//                                 placeholder='Yazınızı buraya girin...'
//                                 required
//                             ></textarea>
//                         </div>

//                         <div className='mb-4'>
//                             <label className='block text-gray-700 dark:text-gray-200 font-bold mb-2'>
//                                 Kapak Görseli
//                             </label>
//                             {/* File input için border ve text rengi ayarı */}
//                             <input
//                                 type='file'
//                                 id='image'
//                                 name='image'
//                                 className='border dark:border-gray-600 rounded w-full py-2 px-3
//                            dark:bg-gray-700 dark:text-gray-300'
//                                 accept='image/*'
//                                 required
//                             />
//                         </div>

//                         <div className='mb-4'>
//                             <label className='block text-gray-700 dark:text-gray-200 font-bold mb-2'>
//                                 Etiketler (Virgül ile ayırın)
//                             </label>
//                             <input
//                                 type='text'
//                                 id='tags'
//                                 name='tags'
//                                 className='border dark:border-gray-600 rounded w-full py-2 px-3
//                            dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:border-blue-500'
//                                 placeholder='emlak, yatırım, istanbul'
//                             />
//                         </div>

//                         <div>
//                             <button
//                                 className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline transition duration-200'
//                                 type='submit'
//                                 disabled={isSubmitting}
//                             >
//                                 {isSubmitting ? 'Yükleniyor...' : 'Yayınla'}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default BlogCreatePage;
