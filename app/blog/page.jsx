import { getBlogs } from '@/app/actions/blogActions';
import BlogCard from '@/components/BlogCard';

// Sayfa Metadata
export const metadata = {
    title: 'Blog | Property Pulse',
    description: 'Emlak dünyasından en son haberler ve ipuçları.',
};

const BlogPage = async () => {
    const blogs = await getBlogs();

    return (
        <section className='bg-blue-50 dark:bg-gray-900 py-6 min-h-screen transition-colors duration-300'>
            <div className='container-xl lg:container m-auto px-4 py-6'>

                <div className='flex flex-col md:flex-row justify-between items-center mb-8'>
                    {/* DEĞİŞİKLİK: Başlık rengi dark:text-white */}
                    <h1 className='text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0'>
                        Blog & News
                    </h1>
                </div>

                {blogs.length === 0 ? (
                    <div className='text-center py-10'>
                        <p className='text-gray-500 text-xl'>Henüz hiç blog yazısı eklenmemiş.</p>
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
