'use client';

import { useState } from 'react';
import { addComment } from '@/app/actions/blogActions';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { FaPaperPlane } from 'react-icons/fa';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const CommentSection = ({ blogId, comments }) => {
    const { data: session } = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            await addComment(blogId, formData);
            toast.success('Yorumunuz eklendi!');
            document.getElementById('commentForm').reset();
        } catch (error) {
            toast.error(error.message || 'Bir hata oluştu');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // DEĞİŞİKLİK: Arka plan dark:bg-gray-800 ve gölge ayarı
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6 transition-colors duration-300'>
            {/* DEĞİŞİKLİK: Başlık rengi dark:text-white */}
            <h3 className='text-xl font-bold mb-4 dark:text-white'>Yorumlar ({comments.length})</h3>

            {/* Yorum Yapma Formu */}
            {session ? (
                <form action={handleSubmit} id="commentForm" className='mb-8'>
                    <div className='flex items-start gap-4'>
                        <Image
                            src={session.user.image || '/images/profile.png'}
                            width={40}
                            height={40}
                            className='rounded-full'
                            alt='Profil'
                        />
                        <div className='flex-grow'>
                            {/* DEĞİŞİKLİK: Textarea arka planı, border ve yazı rengi */}
                            <textarea
                                name='comment'
                                rows='3'
                                className='w-full border rounded-lg p-3 focus:outline-none focus:border-blue-500 resize-none 
                           dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400'
                                placeholder='Düşüncelerini paylaş...'
                                required
                            ></textarea>
                            <div className='flex justify-end mt-2'>
                                <button
                                    type='submit'
                                    disabled={isSubmitting}
                                    className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2 disabled:bg-gray-400'
                                >
                                    {isSubmitting ? 'Gönderiliyor...' : <><FaPaperPlane /> Gönder</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                // DEĞİŞİKLİK: Giriş yap uyarısı arka planı dark:bg-gray-700 ve yazı rengi
                <div className='bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6 text-center text-gray-600 dark:text-gray-300'>
                    Yorum yapmak için lütfen <Link href="/login" className='text-blue-600 dark:text-blue-400 font-bold hover:underline'>giriş yapın</Link>.
                </div>
            )}

            {/* Yorum Listesi */}
            <div className='space-y-6'>
                {comments.length === 0 ? (
                    <p className='text-gray-500 dark:text-gray-400 italic'>Henüz yorum yapılmamış. İlk yorumu sen yap!</p>
                ) : (
                    comments.map((comment, index) => (
                        // DEĞİŞİKLİK: Border rengi dark:border-gray-700
                        <div key={index} className='flex gap-4 border-b dark:border-gray-700 pb-4 last:border-0'>
                            <div className='flex-shrink-0'>
                                <Image
                                    src={comment.user?.image || '/images/profile.png'}
                                    width={40}
                                    height={40}
                                    className='rounded-full object-cover'
                                    alt='User'
                                />
                            </div>
                            <div>
                                <div className='flex items-center gap-2 mb-1'>
                                    {/* DEĞİŞİKLİK: Kullanıcı adı rengi dark:text-gray-200 */}
                                    <span className='font-bold text-gray-800 dark:text-gray-200'>
                                        {comment.user?.username || 'Kullanıcı'}
                                    </span>
                                    <span className='text-xs text-gray-400'>
                                        {new Date(comment.createdAt).toLocaleDateString('tr-TR', {
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                {/* DEĞİŞİKLİK: Yorum metni rengi dark:text-gray-300 */}
                                <p className='text-gray-700 dark:text-gray-300 text-sm'>{comment.text}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;

// 'use client';

// import { useState } from 'react';
// import { addComment } from '@/app/actions/blogActions';
// import Image from 'next/image';
// import { toast } from 'react-toastify';
// import { FaPaperPlane } from 'react-icons/fa';
// import Link from 'next/link';
// import { useSession } from 'next-auth/react';

// const CommentSection = ({ blogId, comments }) => {
//     const { data: session } = useSession();
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     // Optimistic UI yerine basit revalidation kullanıyoruz (server action ile)

//     const handleSubmit = async (formData) => {
//         setIsSubmitting(true);
//         try {
//             await addComment(blogId, formData);
//             toast.success('Yorumunuz eklendi!');
//             // Formu manuel resetlemek için textarea value kontrolü veya basit bir key değişimi yapılabilir
//             // Burada HTML form reset'i yeterli olacak çünkü revalidate ile sayfa yenilenecek
//             document.getElementById('commentForm').reset();
//         } catch (error) {
//             toast.error(error.message || 'Bir hata oluştu');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className='bg-white p-6 rounded-lg shadow-md mt-6'>
//             <h3 className='text-xl font-bold mb-4'>Yorumlar ({comments.length})</h3>

//             {/* Yorum Yapma Formu */}
//             {session ? (
//                 <form action={handleSubmit} id="commentForm" className='mb-8'>
//                     <div className='flex items-start gap-4'>
//                         <Image
//                             src={session.user.image || '/images/profile.png'}
//                             width={40}
//                             height={40}
//                             className='rounded-full'
//                             alt='Profil'
//                         />
//                         <div className='flex-grow'>
//                             <textarea
//                                 name='comment'
//                                 rows='3'
//                                 className='w-full border rounded-lg p-3 focus:outline-none focus:border-blue-500 resize-none'
//                                 placeholder='Düşüncelerini paylaş...'
//                                 required
//                             ></textarea>
//                             <div className='flex justify-end mt-2'>
//                                 <button
//                                     type='submit'
//                                     disabled={isSubmitting}
//                                     className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2 disabled:bg-gray-400'
//                                 >
//                                     {isSubmitting ? 'Gönderiliyor...' : <><FaPaperPlane /> Gönder</>}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </form>
//             ) : (
//                 <div className='bg-gray-100 p-4 rounded-lg mb-6 text-center text-gray-600'>
//                     Yorum yapmak için lütfen <Link href="/login" className='text-blue-600 font-bold hover:underline'>giriş yapın</Link>.
//                 </div>
//             )}

//             {/* Yorum Listesi */}
//             <div className='space-y-6'>
//                 {comments.length === 0 ? (
//                     <p className='text-gray-500 italic'>Henüz yorum yapılmamış. İlk yorumu sen yap!</p>
//                 ) : (
//                     comments.map((comment, index) => (
//                         <div key={index} className='flex gap-4 border-b pb-4 last:border-0'>
//                             <div className='flex-shrink-0'>
//                                 <Image
//                                     src={comment.user?.image || '/images/profile.png'}
//                                     width={40}
//                                     height={40}
//                                     className='rounded-full object-cover'
//                                     alt='User'
//                                 />
//                             </div>
//                             <div>
//                                 <div className='flex items-center gap-2 mb-1'>
//                                     <span className='font-bold text-gray-800'>
//                                         {comment.user?.username || 'Kullanıcı'}
//                                     </span>
//                                     <span className='text-xs text-gray-400'>
//                                         {new Date(comment.createdAt).toLocaleDateString('tr-TR', {
//                                             hour: '2-digit', minute: '2-digit'
//                                         })}
//                                     </span>
//                                 </div>
//                                 <p className='text-gray-700 text-sm'>{comment.text}</p>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CommentSection;
