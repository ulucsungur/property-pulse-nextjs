'use client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { addBlog } from '@/app/actions/blogActions';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const BlogCreatePage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            await addBlog(formData);
            toast.success('Blog yazısı başarıyla oluşturuldu!');
            router.push('/blog');
        } catch (error) {
            toast.error('Hata: ' + error.message);
            setIsSubmitting(false);
        }
    };

    return (
        // DEĞİŞİKLİK: Sayfa arka planı (dark:bg-gray-900)
        <section className='bg-blue-50 dark:bg-gray-900 min-h-screen py-12 transition-colors duration-300'>
            <div className='container m-auto max-w-2xl px-6'>

                {/* DEĞİŞİKLİK: Form Kartı (dark:bg-gray-800, dark:border-gray-700) */}
                <div className='bg-white dark:bg-gray-800 px-6 py-8 mb-4 shadow-md rounded-md border dark:border-gray-700 m-4 md:m-0 transition-colors duration-300'>

                    {/* DEĞİŞİKLİK: Başlık Rengi */}
                    <h2 className='text-3xl text-center font-semibold mb-6 text-gray-800 dark:text-white'>
                        Yeni Blog Yazısı
                    </h2>

                    <form action={handleSubmit}>
                        <div className='mb-4'>
                            {/* DEĞİŞİKLİK: Label Rengi */}
                            <label className='block text-gray-700 dark:text-gray-200 font-bold mb-2'>
                                Blog Başlığı
                            </label>
                            {/* DEĞİŞİKLİK: Input Stilleri (dark:bg-gray-700, dark:text-white, dark:border-gray-600) */}
                            <input
                                type='text'
                                id='title'
                                name='title'
                                className='border dark:border-gray-600 rounded w-full py-2 px-3 mb-2 
                           dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:border-blue-500'
                                placeholder='Örn: Emlak Piyasasında Son Durum'
                                required
                            />
                        </div>

                        <div className='mb-4'>
                            <label className='block text-gray-700 dark:text-gray-200 font-bold mb-2'>
                                Kategori
                            </label>
                            <select
                                id='category'
                                name='category'
                                className='border dark:border-gray-600 rounded w-full py-2 px-3 
                           dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-500'
                                required
                            >
                                <option value='Genel'>Genel</option>
                                <option value='Emlak İpuçları'>Emlak İpuçları</option>
                                <option value='Piyasa Analizi'>Piyasa Analizi</option>
                                <option value='Dekorasyon'>Dekorasyon</option>
                                <option value='Yatırım'>Yatırım</option>
                            </select>
                        </div>

                        <div className='mb-4'>
                            <label className='block text-gray-700 dark:text-gray-200 font-bold mb-2'>
                                İçerik
                            </label>
                            <textarea
                                id='content'
                                name='content'
                                className='border dark:border-gray-600 rounded w-full py-2 px-3 h-44 
                           dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none'
                                placeholder='Yazınızı buraya girin...'
                                required
                            ></textarea>
                        </div>

                        <div className='mb-4'>
                            <label className='block text-gray-700 dark:text-gray-200 font-bold mb-2'>
                                Kapak Görseli
                            </label>
                            {/* File input için border ve text rengi ayarı */}
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

                        <div className='mb-4'>
                            <label className='block text-gray-700 dark:text-gray-200 font-bold mb-2'>
                                Etiketler (Virgül ile ayırın)
                            </label>
                            <input
                                type='text'
                                id='tags'
                                name='tags'
                                className='border dark:border-gray-600 rounded w-full py-2 px-3 
                           dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:border-blue-500'
                                placeholder='emlak, yatırım, istanbul'
                            />
                        </div>

                        <div>
                            <button
                                className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline transition duration-200'
                                type='submit'
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Yükleniyor...' : 'Yayınla'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default BlogCreatePage;

// 'use client'; // Form etkileşimi ve toast için client component

// import { useState } from 'react';
// import { addBlog } from '@/app/actions/blogActions';
// import { toast } from 'react-toastify';
// import { useRouter } from 'next/navigation'; // Redirect gerekirse manuel kontrol için

// const BlogCreatePage = () => {
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const router = useRouter();

//     const handleSubmit = async (formData) => {
//         setIsSubmitting(true);
//         try {
//             // Server Action çağrısı
//             await addBlog(formData);
//             toast.success('The blog post has been successfully created!');
//             router.push('/blog');
//         } catch (error) {
//             toast.error('Hata: ' + error.message);
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <section className='bg-blue-50'>
//             <div className='container m-auto max-w-2xl py-12 px-6'>
//                 <div className='bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0'>
//                     <h2 className='text-3xl text-center font-semibold mb-6'>
//                         Yeni Blog Yazısı
//                     </h2>

//                     <form action={handleSubmit}>
//                         <div className='mb-4'>
//                             <label className='block text-gray-700 font-bold mb-2'>
//                                 Blog Başlığı
//                             </label>
//                             <input
//                                 type='text'
//                                 id='title'
//                                 name='title'
//                                 className='border rounded w-full py-2 px-3 mb-2'
//                                 placeholder='Örn: Emlak Piyasasında Son Durum'
//                                 required
//                             />
//                         </div>

//                         <div className='mb-4'>
//                             <label className='block text-gray-700 font-bold mb-2'>
//                                 Kategori
//                             </label>
//                             <select
//                                 id='category'
//                                 name='category'
//                                 className='border rounded w-full py-2 px-3'
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
//                             <label className='block text-gray-700 font-bold mb-2'>
//                                 İçerik
//                             </label>
//                             <textarea
//                                 id='content'
//                                 name='content'
//                                 className='border rounded w-full py-2 px-3 h-44' // Yüksekliği artırdık
//                                 placeholder='Yazınızı buraya girin...'
//                                 required
//                             ></textarea>
//                         </div>

//                         <div className='mb-4'>
//                             <label className='block text-gray-700 font-bold mb-2'>
//                                 Kapak Görseli
//                             </label>
//                             <input
//                                 type='file'
//                                 id='image'
//                                 name='image'
//                                 className='border rounded w-full py-2 px-3'
//                                 accept='image/*'
//                                 required
//                             />
//                         </div>

//                         <div className='mb-4'>
//                             <label className='block text-gray-700 font-bold mb-2'>
//                                 Etiketler (Virgül ile ayırın)
//                             </label>
//                             <input
//                                 type='text'
//                                 id='tags'
//                                 name='tags'
//                                 className='border rounded w-full py-2 px-3'
//                                 placeholder='emlak, yatırım, istanbul'
//                             />
//                         </div>

//                         <div>
//                             <button
//                                 className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline'
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
