'use client';
import { useState, useEffect } from 'react';
import { FaPaperPlane, FaCalendarCheck, FaExclamationCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

const BookOrContact = ({ property }) => {
    const t = useTranslations('PropertySidebar');
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState('booking');

    // --- REZERVASYON STATE'LERİ ---
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [nights, setNights] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    // Sadece GECELİK fiyat varsa rezervasyon yapılabilir
    const nightlyRate = property.rates.nightly;

    // --- İLETİŞİM FORMU STATE'LERİ ---
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || '');
            setEmail(session.user.email || '');
        }
    }, [session]);

    // --- HESAPLAMA (Sadece Nightly Rate varsa çalışır) ---
    useEffect(() => {
        if (nightlyRate && checkIn && checkOut) {
            const start = new Date(checkIn);
            const end = new Date(checkOut);
            const diffTime = end.getTime() - start.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 0) {
                setNights(diffDays);
                setTotalPrice(diffDays * nightlyRate);
            } else {
                setNights(0);
                setTotalPrice(0);
            }
        } else {
            setNights(0);
            setTotalPrice(0);
        }
    }, [checkIn, checkOut, nightlyRate]);

    const handleBookProperty = () => {
        toast.success(t('toastBookSuccess'));
        setCheckIn('');
        setCheckOut('');
        setNights(0);
        setTotalPrice(0);
    };

    const handleMessageSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name, email, phone, body: message,
                    recipient: property.owner, property: property._id
                })
            });

            const result = await res.json();

            if (res.status === 200 || res.status === 201) {
                toast.success(t('toastMsgSuccess'));
                setMessage('');
                setPhone('');
                if (!session?.user) { setName(''); setEmail(''); }
            } else {
                toast.error(result.message || "Hata oluştu");
            }
        } catch (error) {
            toast.error("Sunucu hatası.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">

            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                    className={`flex-1 py-2 font-bold text-center transition-colors ${activeTab === 'booking' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'
                        }`}
                    onClick={() => setActiveTab('booking')}
                >
                    {t('tabBooking')}
                </button>
                <button
                    className={`flex-1 py-2 font-bold text-center transition-colors ${activeTab === 'contact' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'
                        }`}
                    onClick={() => setActiveTab('contact')}
                >
                    {t('tabContact')}
                </button>
            </div>

            {/* --- REZERVASYON SEKME İÇERİĞİ --- */}
            {activeTab === 'booking' && (
                <div className="fade-in">
                    {/* EĞER GECELİK FİYAT VARSA: Formu Göster */}
                    {nightlyRate ? (
                        <>
                            <p className="text-center text-gray-500 dark:text-gray-400 mb-2">{t('nightlyPrice')}</p>
                            <div className="text-center text-3xl font-bold text-blue-600 mb-6">
                                ${nightlyRate.toLocaleString()}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">{t('checkIn')}</label>
                                <input type="date" className="border rounded w-full py-2 px-3 dark:bg-gray-700 dark:text-white dark:border-gray-600" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">{t('checkOut')}</label>
                                <input type="date" className="border rounded w-full py-2 px-3 dark:bg-gray-700 dark:text-white dark:border-gray-600" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                            </div>

                            {nights > 0 && (
                                <div className="bg-blue-50 dark:bg-gray-900 p-4 rounded-lg mb-4 text-sm border border-blue-100 dark:border-gray-700">
                                    <div className="flex justify-between mb-1 text-gray-600 dark:text-gray-400">
                                        <span>{t('summaryStay')}:</span>
                                        <span>{t('summaryNights', { count: nights })}</span>
                                    </div>
                                    <div className="flex justify-between mb-3 text-gray-600 dark:text-gray-400">
                                        <span>{t('summaryNightly')}:</span>
                                        <span>${nightlyRate}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg text-blue-600 border-t pt-2 border-gray-200 dark:border-gray-700">
                                        <span>{t('total')}:</span>
                                        <span>${totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            )}

                            <button onClick={handleBookProperty} className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full py-3 rounded-full flex items-center justify-center gap-2 transition shadow-md">
                                <FaCalendarCheck /> {t('bookBtn')}
                            </button>
                        </>
                    ) : (
                        // EĞER GECELİK FİYAT YOKSA: Uyarı Mesajı Göster
                        <div className="text-center py-6">
                            <FaExclamationCircle className="text-orange-500 text-4xl mx-auto mb-3" />
                            <p className="text-gray-600 dark:text-gray-300 mb-6 px-2">
                                {t('bookingDisabled')}
                            </p>
                            <button
                                onClick={() => setActiveTab('contact')}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full transition shadow-md"
                            >
                                {t('tabContact')}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* --- İLETİŞİM FORMU (Aynı) --- */}
            {activeTab === 'contact' && (
                <div className="fade-in">
                    <form onSubmit={handleMessageSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">{t('name')}</label>
                            <input type="text" placeholder={t('placeholderName')} className="border rounded w-full py-2 px-3 dark:bg-gray-700 dark:text-white" required value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">{t('email')}</label>
                            <input type="email" placeholder={t('placeholderEmail')} className="border rounded w-full py-2 px-3 dark:bg-gray-700 dark:text-white" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">{t('phone')}</label>
                            <input type="text" placeholder={t('placeholderPhone')} className="border rounded w-full py-2 px-3 dark:bg-gray-700 dark:text-white" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">{t('message')}</label>
                            <textarea className="border rounded w-full py-2 px-3 dark:bg-gray-700 dark:text-white h-32 resize-none" placeholder={t('placeholderMsg')} value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
                        </div>
                        <button type="submit" disabled={isSending} className="bg-blue-600 hover:bg-blue-700 text-white font-bold w-full py-3 rounded-full flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50">
                            <FaPaperPlane /> {isSending ? '...' : t('sendBtn')}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default BookOrContact;

// "use client";
// import { useState } from "react";
// import PropertyBooking from "./PropertyBooking";
// import PropertyContactForm from "./PropertyContactForm";
// import { FaCalendarCheck, FaEnvelope } from "react-icons/fa";

// const BookOrContact = ({ property }) => {
//     // Varsayılan olarak 'booking' sekmesi açık olsun
//     const [activeTab, setActiveTab] = useState("booking");

//     return (
//         <div className="bg-white dark:bg-gray-800  rounded-lg shadow-md overflow-hidden">
//             {/* --- TAB BUTONLARI --- */}
//             <div className="flex border-b">
//                 <button
//                     className={`flex-1 py-4 text-center font-bold flex items-center justify-center gap-2 transition duration-300 ${activeTab === "booking"
//                         ? "bg-blue-50 text-blue-600 border-b-4 border-blue-600"
//                         : "bg-gray-50 dark:bg-gray-700 text-gray-500 hover:bg-gray-100"
//                         }`}
//                     onClick={() => setActiveTab("booking")}
//                 >
//                     <FaCalendarCheck /> Rezervasyon
//                 </button>

//                 <button
//                     className={`flex-1 py-4 text-center font-bold flex items-center justify-center gap-2 transition duration-300 ${activeTab === "message"
//                         ? "bg-blue-50 text-blue-600 border-b-4 border-blue-600"
//                         : "bg-gray-50 dark:bg-gray-700 text-gray-500 hover:bg-gray-100"
//                         }`}
//                     onClick={() => setActiveTab("message")}
//                 >
//                     <FaEnvelope /> Mesaj At
//                 </button>
//             </div>

//             {/* --- İÇERİK ALANI --- */}
//             <div className="transition-all duration-300 ease-in-out">
//                 {activeTab === "booking" ? (
//                     <PropertyBooking property={property} />
//                 ) : (
//                     // Mevcut Contact Formunun tasarımını bozmadan buraya yüklüyoruz
//                     <div className="p-6">
//                         <PropertyContactForm property={property} />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default BookOrContact;
