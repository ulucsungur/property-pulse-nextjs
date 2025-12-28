import connectDB from '@/config/database';
import Faq from '@/models/Faq';
import { getUserSession } from '@/utils/getUserSession';
import { NextResponse } from 'next/server';

// PUT: Güncelle (Sadece Admin)
export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = await params; // Next.js 15: params await edilmeli

        // 1. Yetki Kontrolü
        const sessionUser = await getUserSession();
        if (!sessionUser || sessionUser.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // 2. Veriyi Al
        const body = await request.json();

        // 3. Güncelle
        const updatedFaq = await Faq.findByIdAndUpdate(id, body, { new: true });

        if (!updatedFaq) {
            return NextResponse.json({ message: 'FAQ not found' }, { status: 404 });
        }

        return NextResponse.json(updatedFaq);

    } catch (error) {
        console.error('FAQ PUT Error:', error);
        return NextResponse.json({ message: 'Failed to update FAQ' }, { status: 500 });
    }
}

// DELETE: Sil (Sadece Admin)
export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;

        // 1. Yetki Kontrolü
        const sessionUser = await getUserSession();
        if (!sessionUser || sessionUser.user.role !== 'admin') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // 2. Sil
        const deletedFaq = await Faq.findByIdAndDelete(id);

        if (!deletedFaq) {
            return NextResponse.json({ message: 'FAQ not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'FAQ deleted successfully' });

    } catch (error) {
        console.error('FAQ DELETE Error:', error);
        return NextResponse.json({ message: 'Failed to delete FAQ' }, { status: 500 });
    }
}
