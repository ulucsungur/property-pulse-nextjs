'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaEdit, FaSpinner } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

const AdminFaqPage = () => {
    const t = useTranslations('AdminFaq');
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { locale } = useParams();

    // Form State
    const [formData, setFormData] = useState({
        question_tr: '', answer_tr: '',
        question_en: '', answer_en: '',
        order: 0
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const res = await fetch('/api/faq');
            const data = await res.json();
            setFaqs(data);
        } catch (error) {
            toast.error('SSS verileri yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const method = editingId ? 'PUT' : 'POST';
            const url = editingId ? `/api/faq/${editingId}` : '/api/faq';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    order: Number(formData.order) // Sayıya çevirdiğimizden emin olalım
                }),
            });

            if (res.ok) {
                toast.success(editingId ? t('successUpdate') : t('successAdd'));
                setFormData({ question_tr: '', answer_tr: '', question_en: '', answer_en: '', order: 0 });
                setEditingId(null);
                fetchFaqs();
            } else {
                // BACKEND'DEN GELEN HATA MESAJINI OKU
                const errorMessage = await res.text();
                toast.error(`Hata: ${errorMessage}`);
                console.error('Server Hatası:', errorMessage);
            }
        } catch (error) {
            toast.error('İstek gönderilemedi.');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Emin misiniz?')) return;
        try {
            const res = await fetch(`/api/faq/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Silindi');
                fetchFaqs();
            }
        } catch (error) {
            toast.error('Silme işlemi başarısız');
        }
    };

    if (loading) return <div className="flex justify-center p-10"><FaSpinner className="animate-spin text-3xl text-blue-500" /></div>;

    return (
        <div className="container mx-auto p-6 mt-16">
            <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>

            {/* FAQ Form */}
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-8 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-blue-600 border-b pb-2">{t('trContent')}</h3>
                        <input
                            type="text" placeholder={`${t('question')} (EN)`} className="w-full p-2 border rounded"
                            value={formData.question_tr || ''} onChange={(e) => setFormData({ ...formData, question_tr: e.target.value })} required
                        />
                        <textarea
                            placeholder={`${t('answer')} (TR)`} className="w-full p-2 border rounded h-24"
                            value={formData.answer_tr || ''} onChange={(e) => setFormData({ ...formData, answer_tr: e.target.value })} required
                        />
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-red-600 border-b pb-2">{t('enContent')}</h3>
                        <input
                            type="text" placeholder={`${t('question')} (EN)`} className="w-full p-2 border rounded"
                            value={formData.question_en} onChange={(e) => setFormData({ ...formData, question_en: e.target.value })} required
                        />
                        <textarea
                            placeholder={`${t('answer')} (EN)`} className="w-full p-2 border rounded h-24"
                            value={formData.answer_en} onChange={(e) => setFormData({ ...formData, answer_en: e.target.value })} required
                        />
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <input
                        type="number" placeholder="Sıralama" className="w-24 p-2 border rounded"
                        value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    />
                    <button
                        type="submit" disabled={submitting}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
                    >
                        {submitting ? <FaSpinner className="animate-spin" /> : editingId ? <FaEdit /> : <FaPlus />}
                        {editingId ? t('update') : t('add')}
                    </button>
                </div>
            </form>

            {/* FAQ List Tablosu */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden border dark:border-slate-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                    <thead className="bg-gray-50 dark:bg-slate-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('orderCol')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('questionCol')}</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t('actionsCol')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                        {faqs.map((faq) => (
                            <tr key={faq._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {faq.order}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{faq.question_tr}</div>
                                    <div className="text-sm text-gray-400 italic">{faq.question_en}</div>
                                </td>
                                {/* KRİTİK NOKTA: Butonlar mutlaka <td> içinde olmalı */}
                                <td className="px-6 py-4 text-right text-sm font-medium space-x-3 whitespace-nowrap">
                                    <button
                                        type="button" // Buton tipi belirtmek iyidir
                                        onClick={() => {
                                            setEditingId(faq._id);
                                            setFormData({
                                                question_tr: faq.question_tr,
                                                answer_tr: faq.answer_tr,
                                                question_en: faq.question_en,
                                                answer_en: faq.answer_en,
                                                order: faq.order
                                            });
                                        }}
                                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                    >
                                        <FaEdit size={18} className="inline" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(faq._id)}
                                        className="text-red-600 hover:text-red-900 transition-colors"
                                    >
                                        <FaTrash size={18} className="inline" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {faqs.length === 0 && (
                    <div className="p-10 text-center text-gray-500">{t('noQuestions')}</div>
                )}
            </div>
        </div>
    );
};

export default AdminFaqPage;
