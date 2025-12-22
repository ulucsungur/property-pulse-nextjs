import Link from 'next/link';
import Image from 'next/image';
import { FaUser, FaCalendarAlt, FaTag } from 'react-icons/fa';

const BlogCard = ({ blog }) => {
    return (
        // DEĞİŞİKLİK 1: Arka plan dark:bg-gray-800
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-md relative overflow-hidden h-full flex flex-col transition-colors duration-300'>
            {/* Blog Görseli */}
            <div className='relative w-full h-52'>
                <Image
                    src={blog.image || '/images/properties/a1.jpg'}
                    alt={blog.title}
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                />
                <div className='absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded uppercase'>
                    {blog.category}
                </div>
            </div>

            <div className='p-4 flex flex-col flex-grow'>
                {/* Başlık */}
                {/* DEĞİŞİKLİK 2: Başlık rengi dark:text-white */}
                <h3 className='text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2'>
                    {blog.title}
                </h3>

                {/* Özet */}
                {/* DEĞİŞİKLİK 3: Açıklama metni dark:text-gray-300 */}
                <p className='text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-grow'>
                    {blog.content.substring(0, 100)}...
                </p>

                {/* Meta Bilgiler */}
                {/* DEĞİŞİKLİK 4: İkon ve küçük yazılar dark:text-gray-400 */}
                <div className='flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs mb-4 border-t dark:border-gray-700 pt-2'>
                    <div className='flex items-center gap-1'>
                        <FaUser /> {blog.author?.username || 'Anonim'}
                    </div>
                    <div className='flex items-center gap-1'>
                        <FaCalendarAlt /> {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                </div>

                {/* Etiketler ve Buton */}
                <div className='flex justify-between items-center mt-auto'>
                    <div className='flex gap-1 overflow-hidden'>
                        {blog.tags.slice(0, 2).map((tag, index) => (
                            // DEĞİŞİKLİK 5: Etiket arka planı ve yazısı
                            <span key={index} className='bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 px-2 py-1 rounded text-[10px] flex items-center gap-1'>
                                <FaTag className='text-[8px]' /> {tag}
                            </span>
                        ))}
                    </div>

                    <Link
                        href={`/blog/${blog._id}`}
                        className='bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition text-center'
                    >
                        Oku
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;

// import Link from 'next/link';
// import Image from 'next/image';
// import { FaUser, FaCalendarAlt, FaTag } from 'react-icons/fa';

// const BlogCard = ({ blog }) => {
//     return (
//         <div className='bg-white rounded-xl shadow-md relative overflow-hidden h-full flex flex-col'>
//             {/* Blog Görseli */}
//             <div className='relative w-full h-52'>
//                 <Image
//                     src={blog.image || '/images/properties/a1.jpg'} // Fallback görsel
//                     alt={blog.title}
//                     fill
//                     className='object-cover'
//                     sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
//                 />
//                 <div className='absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded uppercase'>
//                     {blog.category}
//                 </div>
//             </div>

//             <div className='p-4 flex flex-col flex-grow'>
//                 {/* Başlık */}
//                 <h3 className='text-xl font-bold text-gray-800 mb-2 line-clamp-2'>
//                     {blog.title}
//                 </h3>

//                 {/* Özet (İlk 100 karakter) */}
//                 <p className='text-gray-600 text-sm mb-4 line-clamp-3 flex-grow'>
//                     {blog.content.substring(0, 100)}...
//                 </p>

//                 {/* Meta Bilgiler */}
//                 <div className='flex items-center justify-between text-gray-500 text-xs mb-4 border-t pt-2'>
//                     <div className='flex items-center gap-1'>
//                         <FaUser /> {blog.author?.username || 'Anonim'}
//                     </div>
//                     <div className='flex items-center gap-1'>
//                         <FaCalendarAlt /> {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
//                     </div>
//                 </div>

//                 {/* Etiketler ve Buton */}
//                 <div className='flex justify-between items-center mt-auto'>
//                     <div className='flex gap-1 overflow-hidden'>
//                         {blog.tags.slice(0, 2).map((tag, index) => (
//                             <span key={index} className='bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] flex items-center gap-1'>
//                                 <FaTag className='text-[8px]' /> {tag}
//                             </span>
//                         ))}
//                     </div>

//                     <Link
//                         href={`/blog/${blog._id}`}
//                         className='bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition text-center'
//                     >
//                         Oku
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BlogCard;
