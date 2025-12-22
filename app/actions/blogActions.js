'use server';

import connectDB from '@/config/database';
import Blog from '@/models/Blog';
import { getUserSession } from '@/utils/getUserSession'; // DÜZELTİLDİ: Import ismi
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import cloudinary from '@/config/cloudinary';

// GET: Tüm Blog Yazılarını Getir
export async function getBlogs() {
    try {
        await connectDB();
        const blogs = await Blog.find({})
            .sort({ createdAt: -1 })
            .populate('author', 'username image')
            .lean();

        return JSON.parse(JSON.stringify(blogs));
    } catch (error) {
        console.error('Blogları getirme hatası:', error);
        return [];
    }
}

// GET: Tekil Blog Yazısı Getir
export async function getBlog(id) {
    try {
        await connectDB();
        const blog = await Blog.findById(id)
            .populate('author', 'username image email')
            .populate('comments.user', 'username image')
            .lean();

        if (!blog) return null;

        return JSON.parse(JSON.stringify(blog));
    } catch (error) {
        console.error('Blog detayı getirme hatası:', error);
        return null;
    }
}

// POST: Yeni Blog Ekle
export async function addBlog(formData) {
    await connectDB();

    // DÜZELTİLDİ: Fonksiyon çağrısı
    const sessionUser = await getUserSession();

    if (!sessionUser || !sessionUser.userId) {
        throw new Error('Yazı eklemek için giriş yapmalısınız.');
    }

    const title = formData.get('title');
    const content = formData.get('content');
    const category = formData.get('category');
    const tags = formData.get('tags').split(',').map((tag) => tag.trim());
    const image = formData.get('image');

    let imageUrl = '';
    if (image && image.size > 0) {
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const imageBase64 = `data:${image.type};base64,${buffer.toString('base64')}`;

        const result = await cloudinary.uploader.upload(imageBase64, {
            folder: 'property-pulse-blog',
        });
        imageUrl = result.secure_url;
    }

    const newBlog = new Blog({
        title,
        content,
        category,
        tags,
        image: imageUrl,
        author: sessionUser.userId,
    });

    await newBlog.save();

    revalidatePath('/blog');
    return { success: true };
    //redirect('/blog');
}

// POST: Yorum Ekle
export async function addComment(blogId, formData) {
    // DÜZELTİLDİ: Fonksiyon çağrısı
    const sessionUser = await getUserSession();

    if (!sessionUser || !sessionUser.userId) {
        throw new Error('Yorum yapmak için giriş yapmalısınız.');
    }

    const text = formData.get('comment');
    if (!text) return;

    await connectDB();

    const blog = await Blog.findById(blogId);
    if (!blog) throw new Error('Blog bulunamadı');

    const newComment = {
        user: sessionUser.userId,
        text: text,
    };

    blog.comments.unshift(newComment);

    await blog.save();

    revalidatePath(`/blog/${blogId}`);
}
