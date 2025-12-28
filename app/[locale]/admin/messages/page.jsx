
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useTranslations, useLocale } from 'next-intl';
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"; // İkonlar

export default function MessagesList() {
    const t = useTranslations('AdminMessages');
    const locale = useLocale();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- SIRALAMA STATE'İ (Varsayılan: Tarihe göre azalan) ---
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    const fetchMessages = async () => {
        try {
            const res = await fetch("/api/admin/messages", { cache: "no-store" });
            const data = await res.json();
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Hata:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    // --- SIRALAMA MANTIĞI ---
    const sortedMessages = useMemo(() => {
        let items = [...messages];
        if (sortConfig.key !== null) {
            items.sort((a, b) => {
                let aValue, bValue;

                switch (sortConfig.key) {
                    case 'status':
                        aValue = a.isRead;
                        bValue = b.isRead;
                        break;
                    case 'sender':
                        aValue = a.name.toLowerCase();
                        bValue = b.name.toLowerCase();
                        break;
                    case 'property':
                        aValue = (a.property?.name || '').toLowerCase();
                        bValue = (b.property?.name || '').toLowerCase();
                        break;
                    case 'createdAt':
                        aValue = new Date(a.createdAt).getTime();
                        bValue = new Date(b.createdAt).getTime();
                        break;
                    default:
                        aValue = a[sortConfig.key];
                        bValue = b[sortConfig.key];
                }

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return items;
    }, [messages, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <FaSort className="inline ml-1 opacity-30 text-xs" />;
        return sortConfig.direction === 'asc' ?
            <FaSortUp className="inline ml-1 text-blue-500" /> :
            <FaSortDown className="inline ml-1 text-blue-500" />;
    };

    // Okundu Olarak İşaretle
    const markAsRead = async (id, currentStatus) => {
        const newStatus = !currentStatus;
        setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: newStatus } : m));

        try {
            const res = await fetch(`/api/admin/messages/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isRead: newStatus })
            });
            if (!res.ok) throw new Error("Update failed");
        } catch (error) {
            setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: currentStatus } : m));
            toast.error("Güncelleme başarısız");
        }
    };

    // Sil
    const deleteMessage = async (id) => {
        if (!confirm(t('confirmDelete'))) return;
        setMessages(prev => prev.filter(m => m._id !== id));
        await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    };

    if (loading) return <div className="p-8 text-gray-500 dark:text-gray-400">{t('loading')}</div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-16">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                    {t('title')}
                </h1>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {messages.length} {t('messageCount')}
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                    <thead className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-semibold">
                        <tr>
                            <th className="p-4 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => requestSort('status')}>
                                {t('tableStatus')} {getSortIcon('status')}
                            </th>
                            <th className="p-4 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => requestSort('sender')}>
                                {t('tableSender')} {getSortIcon('sender')}
                            </th>
                            <th className="p-4 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => requestSort('property')}>
                                {t('tableAdvert')} {getSortIcon('property')}
                            </th>
                            <th className="p-4">{t('tableMessage')}</th>
                            <th className="p-4 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => requestSort('createdAt')}>
                                {t('tableDate')} {getSortIcon('createdAt')}
                            </th>
                            <th className="p-4 text-right">{t('tableTransactions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {sortedMessages.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center">{t('empty')}</td></tr>
                        ) : (
                            sortedMessages.map((msg) => (
                                <tr key={msg._id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition ${!msg.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}>
                                    <td className="p-4">
                                        {msg.isRead ? (
                                            <span className="text-green-500 text-xs border border-green-200 px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                                                {t('statusRead')}
                                            </span>
                                        ) : (
                                            <span className="text-blue-600 text-xs border border-blue-200 px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 dark:border-blue-700 font-bold">
                                                {t('statusNew')}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900 dark:text-white">{msg.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{msg.email}</div>
                                    </td>
                                    <td className="p-4 font-medium text-blue-600 dark:text-blue-400">
                                        {msg.property?.name || t('deletedAd')}
                                    </td>
                                    <td className="p-4 max-w-xs truncate" title={msg.body}>
                                        {msg.body}
                                    </td>
                                    <td className="p-4 text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(msg.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => markAsRead(msg._id, msg.isRead)}
                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3 text-xs uppercase font-semibold"
                                        >
                                            {msg.isRead ? t('markUnread') : t('markRead')}
                                        </button>
                                        <button
                                            onClick={() => deleteMessage(msg._id)}
                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xs uppercase font-semibold"
                                        >
                                            {t('delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ------281225 çalışan------
// "use client";

// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// // 1. IMPORTLAR
// import { useTranslations, useLocale } from 'next-intl';

// export default function MessagesList() {
//     // 2. KANCALARI BAŞLAT
//     const t = useTranslations('AdminMessages');
//     const locale = useLocale(); // Tarih formatı için

//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // Verileri Çek
//     const fetchMessages = async () => {
//         try {
//             const res = await fetch("/api/admin/messages", { cache: "no-store" });
//             const data = await res.json();
//             setMessages(Array.isArray(data) ? data : []);
//         } catch (error) {
//             console.error("Hata:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchMessages();
//     }, []);

//     // Okundu Olarak İşaretle
//     const markAsRead = async (id, currentStatus) => {
//         const newStatus = !currentStatus;

//         // Optimistic Update
//         setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: newStatus } : m));

//         try {
//             const res = await fetch(`/api/admin/messages/${id}`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ isRead: newStatus })
//             });

//             if (!res.ok) throw new Error("Update failed");

//         } catch (error) {
//             setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: currentStatus } : m));
//             console.error("Update error:", error);
//             toast.error("Güncelleme başarısız");
//         }
//     };

//     // Sil
//     const deleteMessage = async (id) => {
//         if (!confirm(t('confirmDelete'))) return; // Çeviri

//         setMessages(prev => prev.filter(m => m._id !== id));
//         await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
//     };

//     if (loading) return <div className="p-8 text-gray-500">{t('loading')}</div>;

//     return (
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-16">
//             <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
//                 <h1 className="text-xl font-bold text-gray-800 dark:text-white">
//                     {t('title')}
//                 </h1>
//                 <span className="text-sm text-gray-500">
//                     {messages.length} {t('messageCount')}
//                 </span>
//             </div>

//             <div className="overflow-x-auto">
//                 <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
//                     <thead className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-semibold">
//                         <tr>
//                             <th className="p-4">{t('tableStatus')}</th>
//                             <th className="p-4">{t('tableSender')}</th>
//                             <th className="p-4">{t('tableAdvert')}</th>
//                             <th className="p-4">{t('tableMessage')}</th>
//                             <th className="p-4">{t('tableDate')}</th>
//                             <th className="p-4 text-right">{t('tableTransactions')}</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
//                         {messages.length === 0 ? (
//                             <tr><td colSpan="6" className="p-8 text-center">{t('empty')}</td></tr>
//                         ) : (
//                             messages.map((msg) => (
//                                 <tr key={msg._id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition ${!msg.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}>
//                                     <td className="p-4">
//                                         {msg.isRead ? (
//                                             <span className="text-green-500 text-xs border border-green-200 px-2 py-1 rounded-full bg-green-50">
//                                                 {t('statusRead')}
//                                             </span>
//                                         ) : (
//                                             <span className="text-blue-600 text-xs border border-blue-200 px-2 py-1 rounded-full bg-blue-50 font-bold">
//                                                 {t('statusNew')}
//                                             </span>
//                                         )}
//                                     </td>
//                                     <td className="p-4">
//                                         <div className="font-medium text-gray-900 dark:text-white">{msg.name}</div>
//                                         <div className="text-xs text-gray-500">{msg.email}</div>
//                                         <div className="text-xs text-gray-500">{msg.phone}</div>
//                                     </td>
//                                     <td className="p-4 font-medium text-blue-600">
//                                         {msg.property?.name || t('deletedAd')}
//                                     </td>
//                                     <td className="p-4 max-w-xs truncate" title={msg.body}>
//                                         {msg.body}
//                                     </td>
//                                     <td className="p-4 text-xs text-gray-500">
//                                         {/* TARİH FORMATI: Dile göre otomatik değişir */}
//                                         {new Date(msg.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'tr-TR')}
//                                     </td>
//                                     <td className="p-4 text-right">
//                                         <button
//                                             onClick={() => markAsRead(msg._id, msg.isRead)}
//                                             className="text-blue-600 hover:text-blue-800 mr-3 text-xs uppercase font-semibold"
//                                         >
//                                             {msg.isRead ? t('markUnread') : t('markRead')}
//                                         </button>
//                                         <button
//                                             onClick={() => deleteMessage(msg._id)}
//                                             className="text-red-500 hover:text-red-700 text-xs uppercase font-semibold"
//                                         >
//                                             {t('delete')}
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }


// "use client";

// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// // 1. IMPORTLAR
// import { useTranslations, useLocale } from 'next-intl';

// export default function MessagesList() {
//     // 2. KANCALARI BAŞLAT
//     const t = useTranslations('AdminMessages');
//     const locale = useLocale(); // Tarih formatı için

//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // Verileri Çek
//     const fetchMessages = async () => {
//         try {
//             const res = await fetch("/api/admin/messages", { cache: "no-store" });
//             const data = await res.json();
//             setMessages(Array.isArray(data) ? data : []);
//         } catch (error) {
//             console.error("Hata:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchMessages();
//     }, []);

//     // Okundu Olarak İşaretle
//     const markAsRead = async (id, currentStatus) => {
//         const newStatus = !currentStatus;

//         // Optimistic Update
//         setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: newStatus } : m));

//         try {
//             const res = await fetch(`/api/admin/messages/${id}`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ isRead: newStatus })
//             });

//             if (!res.ok) throw new Error("Update failed");

//         } catch (error) {
//             setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: currentStatus } : m));
//             console.error("Update error:", error);
//             toast.error("Güncelleme başarısız");
//         }
//     };

//     // Sil
//     const deleteMessage = async (id) => {
//         if (!confirm(t('confirmDelete'))) return; // Çeviri

//         setMessages(prev => prev.filter(m => m._id !== id));
//         await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
//     };

//     if (loading) return <div className="p-8 text-gray-500">{t('loading')}</div>;

//     return (
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-16">
//             <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
//                 <h1 className="text-xl font-bold text-gray-800 dark:text-white">
//                     {t('title')}
//                 </h1>
//                 <span className="text-sm text-gray-500">
//                     {messages.length} {t('messageCount')}
//                 </span>
//             </div>

//             <div className="overflow-x-auto">
//                 <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
//                     <thead className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-semibold">
//                         <tr>
//                             <th className="p-4">{t('tableStatus')}</th>
//                             <th className="p-4">{t('tableSender')}</th>
//                             <th className="p-4">{t('tableAdvert')}</th>
//                             <th className="p-4">{t('tableMessage')}</th>
//                             <th className="p-4">{t('tableDate')}</th>
//                             <th className="p-4 text-right">{t('tableTransactions')}</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
//                         {messages.length === 0 ? (
//                             <tr><td colSpan="6" className="p-8 text-center">{t('empty')}</td></tr>
//                         ) : (
//                             messages.map((msg) => (
//                                 <tr key={msg._id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition ${!msg.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}>
//                                     <td className="p-4">
//                                         {msg.isRead ? (
//                                             <span className="text-green-500 text-xs border border-green-200 px-2 py-1 rounded-full bg-green-50">
//                                                 {t('statusRead')}
//                                             </span>
//                                         ) : (
//                                             <span className="text-blue-600 text-xs border border-blue-200 px-2 py-1 rounded-full bg-blue-50 font-bold">
//                                                 {t('statusNew')}
//                                             </span>
//                                         )}
//                                     </td>
//                                     <td className="p-4">
//                                         <div className="font-medium text-gray-900 dark:text-white">{msg.name}</div>
//                                         <div className="text-xs text-gray-500">{msg.email}</div>
//                                         <div className="text-xs text-gray-500">{msg.phone}</div>
//                                     </td>
//                                     <td className="p-4 font-medium text-blue-600">
//                                         {msg.property?.name || t('deletedAd')}
//                                     </td>
//                                     <td className="p-4 max-w-xs truncate" title={msg.body}>
//                                         {msg.body}
//                                     </td>
//                                     <td className="p-4 text-xs text-gray-500">
//                                         {/* TARİH FORMATI: Dile göre otomatik değişir */}
//                                         {new Date(msg.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'tr-TR')}
//                                     </td>
//                                     <td className="p-4 text-right">
//                                         <button
//                                             onClick={() => markAsRead(msg._id, msg.isRead)}
//                                             className="text-blue-600 hover:text-blue-800 mr-3 text-xs uppercase font-semibold"
//                                         >
//                                             {msg.isRead ? t('markUnread') : t('markRead')}
//                                         </button>
//                                         <button
//                                             onClick={() => deleteMessage(msg._id)}
//                                             className="text-red-500 hover:text-red-700 text-xs uppercase font-semibold"
//                                         >
//                                             {t('delete')}
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// "use client";

// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify"; // Hata/Başarı mesajı için (Opsiyonel)

// export default function MessagesList() {
//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // Verileri Çek
//     const fetchMessages = async () => {
//         try {
//             // Cache: no-store önemli, her zaman taze veri gelsin
//             const res = await fetch("/api/admin/messages", { cache: "no-store" });
//             const data = await res.json();
//             setMessages(Array.isArray(data) ? data : []);
//         } catch (error) {
//             console.error("Hata:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchMessages();
//     }, []);

//     // Okundu Olarak İşaretle
//     const markAsRead = async (id, currentStatus) => {
//         // Optimistic Update (Hemen arayüzde değiştir)
//         const newStatus = !currentStatus;

//         // DÜZELTME 1: 'read' yerine 'isRead' state'ini güncelliyoruz
//         setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: newStatus } : m));

//         try {
//             const res = await fetch(`/api/admin/messages/${id}`, {
//                 method: "PUT", // Standart olsun diye PUT yaptım (PATCH de olur)
//                 headers: { "Content-Type": "application/json" },
//                 // DÜZELTME 2: Body olarak 'isRead' gönderiyoruz
//                 body: JSON.stringify({ isRead: newStatus })
//             });

//             if (!res.ok) throw new Error("Update failed");

//         } catch (error) {
//             // Hata olursa eski haline döndür
//             setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: currentStatus } : m));
//             console.error("Update error:", error);
//         }
//     };

//     // Sil
//     const deleteMessage = async (id) => {
//         if (!confirm("Mesajı silmek istiyor musunuz?")) return;

//         // Arayüzden hemen sil
//         setMessages(prev => prev.filter(m => m._id !== id));

//         await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
//     };

//     if (loading) return <div className="p-8 text-gray-500">Mesajlar yükleniyor...</div>;

//     return (
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-16">
//             <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
//                 <h1 className="text-xl font-bold text-gray-800 dark:text-white">Incoming Messages (CRM)</h1>
//                 <span className="text-sm text-gray-500">{messages.length} message</span>
//             </div>

//             <div className="overflow-x-auto">
//                 <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
//                     <thead className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-semibold">
//                         <tr>
//                             <th className="p-4">Status</th>
//                             <th className="p-4">Sender</th>
//                             <th className="p-4">Advert</th>
//                             <th className="p-4">Message</th>
//                             <th className="p-4">Date</th>
//                             <th className="p-4 text-right">Transactions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
//                         {messages.length === 0 ? (
//                             <tr><td colSpan="6" className="p-8 text-center">Inbox is empty.</td></tr>
//                         ) : (
//                             messages.map((msg) => (
//                                 // DÜZELTME 3: msg.read -> msg.isRead
//                                 <tr key={msg._id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition ${!msg.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}>
//                                     <td className="p-4">
//                                         {msg.isRead ? (
//                                             <span className="text-green-500 text-xs border border-green-200 px-2 py-1 rounded-full bg-green-50">Okundu</span>
//                                         ) : (
//                                             <span className="text-blue-600 text-xs border border-blue-200 px-2 py-1 rounded-full bg-blue-50 font-bold">YENİ</span>
//                                         )}
//                                     </td>
//                                     <td className="p-4">
//                                         <div className="font-medium text-gray-900 dark:text-white">{msg.name}</div>
//                                         <div className="text-xs text-gray-500">{msg.email}</div>
//                                         <div className="text-xs text-gray-500">{msg.phone}</div>
//                                     </td>
//                                     <td className="p-4 font-medium text-blue-600">
//                                         {msg.property?.name || "Deleted Ad."}
//                                     </td>
//                                     <td className="p-4 max-w-xs truncate" title={msg.body}>
//                                         {msg.body}
//                                     </td>
//                                     <td className="p-4 text-xs text-gray-500">
//                                         {new Date(msg.createdAt).toLocaleDateString("tr-TR")}
//                                     </td>
//                                     <td className="p-4 text-right">
//                                         <button
//                                             // DÜZELTME 4: markAsRead fonksiyonuna msg.isRead gönderiyoruz
//                                             onClick={() => markAsRead(msg._id, msg.isRead)}
//                                             className="text-blue-600 hover:text-blue-800 mr-3 text-xs uppercase font-semibold"
//                                         >
//                                             {msg.isRead ? "Mark as unread" : "Mark as read"}
//                                         </button>
//                                         <button
//                                             onClick={() => deleteMessage(msg._id)}
//                                             className="text-red-500 hover:text-red-700 text-xs uppercase font-semibold"
//                                         >
//                                             Delete
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// "use client";

// import React, { useEffect, useState } from "react";

// export default function MessagesList() {
//     const [messages, setMessages] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // Verileri Çek
//     const fetchMessages = async () => {
//         try {
//             const res = await fetch("/api/admin/messages", { cache: "no-store" });
//             const data = await res.json();
//             setMessages(Array.isArray(data) ? data : []);
//         } catch (error) {
//             console.error("Hata:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchMessages();
//     }, []);

//     // Okundu Olarak İşaretle
//     const markAsRead = async (id, currentStatus) => {
//         // Optimistic Update (Hemen arayüzde değiştir, sonra API'ye at)
//         const newStatus = !currentStatus;
//         setMessages(prev => prev.map(m => m._id === id ? { ...m, read: newStatus } : m));

//         await fetch(`/api/admin/messages/${id}`, {
//             method: "PATCH",
//             body: JSON.stringify({ read: newStatus })
//         });
//     };

//     // Sil
//     const deleteMessage = async (id) => {
//         if (!confirm("Mesajı silmek istiyor musunuz?")) return;

//         setMessages(prev => prev.filter(m => m._id !== id));
//         await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
//     };

//     if (loading) return <div className="p-8 text-gray-500">Mesajlar yükleniyor...</div>;

//     return (
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
//             <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
//                 <h1 className="text-xl font-bold text-gray-800 dark:text-white">Incoming Messages (CRM)</h1>
//                 <span className="text-sm text-gray-500">{messages.length} message</span>
//             </div>

//             <div className="overflow-x-auto">
//                 <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
//                     <thead className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-semibold">
//                         <tr>
//                             <th className="p-4">Status</th>
//                             <th className="p-4">Sender</th>
//                             <th className="p-4">Advert</th>
//                             <th className="p-4">Message</th>
//                             <th className="p-4">Date</th>
//                             <th className="p-4 text-right">Transactions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
//                         {messages.length === 0 ? (
//                             <tr><td colSpan="6" className="p-8 text-center">Inbox is empty.</td></tr>
//                         ) : (
//                             messages.map((msg) => (
//                                 <tr key={msg._id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition ${!msg.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}>
//                                     <td className="p-4">
//                                         {msg.read ? (
//                                             <span className="text-green-500 text-xs border border-green-200 px-2 py-1 rounded-full bg-green-50">Okundu</span>
//                                         ) : (
//                                             <span className="text-blue-600 text-xs border border-blue-200 px-2 py-1 rounded-full bg-blue-50 font-bold">YENİ</span>
//                                         )}
//                                     </td>
//                                     <td className="p-4">
//                                         <div className="font-medium text-gray-900 dark:text-white">{msg.name}</div>
//                                         <div className="text-xs text-gray-500">{msg.email}</div>
//                                         <div className="text-xs text-gray-500">{msg.phone}</div>
//                                     </td>
//                                     <td className="p-4 font-medium text-blue-600">
//                                         {msg.property?.name || "Deleted Ad."}
//                                     </td>
//                                     <td className="p-4 max-w-xs truncate" title={msg.body}>
//                                         {msg.body}
//                                     </td>
//                                     <td className="p-4 text-xs text-gray-500">
//                                         {new Date(msg.createdAt).toLocaleDateString("tr-TR")}
//                                     </td>
//                                     <td className="p-4 text-right">
//                                         <button
//                                             onClick={() => markAsRead(msg._id, msg.read)}
//                                             className="text-blue-600 hover:text-blue-800 mr-3 text-xs uppercase font-semibold"
//                                         >
//                                             {msg.read ? "Mark as unread" : "Mark as read"}
//                                         </button>
//                                         <button
//                                             onClick={() => deleteMessage(msg._id)}
//                                             className="text-red-500 hover:text-red-700 text-xs uppercase font-semibold"
//                                         >
//                                             Delete
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }
