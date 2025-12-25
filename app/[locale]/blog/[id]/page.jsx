import { getBlog } from '@/app/actions/blogActions';
import CommentSection from '@/components/CommentSection';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaCalendarAlt, FaUser } from 'react-icons/fa';

const BlogDetailPage = async ({ params }) => {
    // params promise olduğu için await edilmeli (Next.js 15)
    const { id } = await params;
    const blog = await getBlog(id);

    if (!blog) {
        return (
            <h1 className='text-center text-2xl font-bold mt-10'>
                Blog yazısı bulunamadı.
            </h1>
        );
    }

    return (
        <section className='bg-blue-50 dark:bg-gray-900 py-10 min-h-screen transition-colors duration-300'>
            <div className='container m-auto px-6 max-w-4xl'>
                {/* Geri Dön Butonu */}
                <Link
                    href='/blog'
                    className='text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center mb-6 transition'
                >
                    <FaArrowLeft className='mr-2' /> Back to Blog Lists
                </Link>

                {/* Ana İçerik */}
                <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-300'>
                    {/* Kapak Görseli */}
                    <div className='relative w-full h-64 md:h-96'>
                        <Image
                            src={blog.image}
                            alt={blog.title}
                            fill
                            className='object-cover'
                            priority
                        />
                    </div>

                    <div className='p-8'>
                        {/* Meta */}
                        <div className='flex items-center justify-between text-gray-500 text-sm mb-6'>
                            <div className='flex items-center gap-2'>
                                <Image
                                    src={blog.author?.image || '/images/profile.png'}
                                    width={30}
                                    height={30}
                                    className="rounded-full"
                                    alt="Author"
                                />
                                <span className="font-semibold">{blog.author?.username}</span>
                            </div>
                            <div className='flex items-center gap-1'>
                                <FaCalendarAlt /> {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                            </div>
                        </div>

                        {/* Başlık */}
                        <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6'>
                            {blog.title}
                        </h1>

                        {/* İçerik (HTML render edilmiyor, text olarak basılıyor güvenlik için) */}
                        {/* Eğer Rich Text gerekirse dangerouslySetInnerHTML kullanılabilir ama sanitize gerekir */}
                        <div className='prose max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap'>
                            {blog.content}
                        </div>

                        {/* Etiketler */}
                        <div className='mt-8 pt-6 border-t dark:border-gray-700'>
                            <div className='flex flex-wrap gap-2'>
                                {blog.tags.map((tag, idx) => (
                                    <span key={idx} className='bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium'>
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Yorum Alanı */}
                <CommentSection blogId={blog._id} comments={blog.comments} />
            </div>
        </section>
    );
};

export default BlogDetailPage;
