import connectDB from '@/config/database';
import Faq from '@/models/Faq';
import { getUserSession } from '@/utils/getUserSession';
import { NextResponse } from 'next/server';

export const POST = async (request) => {
    try {
        await connectDB();
        const sessionUser = await getUserSession();

        if (!sessionUser || sessionUser.user.role !== 'admin') {
            return new NextResponse('Yetkisiz erişim', { status: 401 });
        }

        const body = await request.json();

        // VERİYİ DÜZ (FLAT) OLARAK KAYDEDİYORUZ
        const newFaq = new Faq({
            question_tr: body.question_tr,
            answer_tr: body.answer_tr,
            question_en: body.question_en,
            answer_en: body.answer_en,
            order: Number(body.order) || 0,
        });

        await newFaq.save();
        return NextResponse.json(newFaq, { status: 201 });

    } catch (error) {
        console.error('API POST HATASI:', error);
        return new NextResponse('Sunucu Hatası: ' + error.message, { status: 400 });
    }
};

export const GET = async () => {
    try {
        await connectDB();
        const faqs = await Faq.find({}).sort({ order: 1 });
        return NextResponse.json(faqs);
    } catch (error) {
        return new NextResponse('Veriler çekilemedi', { status: 500 });
    }
};
