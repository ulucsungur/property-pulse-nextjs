"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify"; // Hata/Başarı mesajı için (Opsiyonel)

export default function MessagesList() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    // Verileri Çek
    const fetchMessages = async () => {
        try {
            // Cache: no-store önemli, her zaman taze veri gelsin
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

    // Okundu Olarak İşaretle
    const markAsRead = async (id, currentStatus) => {
        // Optimistic Update (Hemen arayüzde değiştir)
        const newStatus = !currentStatus;

        // DÜZELTME 1: 'read' yerine 'isRead' state'ini güncelliyoruz
        setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: newStatus } : m));

        try {
            const res = await fetch(`/api/admin/messages/${id}`, {
                method: "PUT", // Standart olsun diye PUT yaptım (PATCH de olur)
                headers: { "Content-Type": "application/json" },
                // DÜZELTME 2: Body olarak 'isRead' gönderiyoruz
                body: JSON.stringify({ isRead: newStatus })
            });

            if (!res.ok) throw new Error("Update failed");

        } catch (error) {
            // Hata olursa eski haline döndür
            setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: currentStatus } : m));
            console.error("Update error:", error);
        }
    };

    // Sil
    const deleteMessage = async (id) => {
        if (!confirm("Mesajı silmek istiyor musunuz?")) return;

        // Arayüzden hemen sil
        setMessages(prev => prev.filter(m => m._id !== id));

        await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    };

    if (loading) return <div className="p-8 text-gray-500">Mesajlar yükleniyor...</div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Incoming Messages (CRM)</h1>
                <span className="text-sm text-gray-500">{messages.length} message</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                    <thead className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-semibold">
                        <tr>
                            <th className="p-4">Status</th>
                            <th className="p-4">Sender</th>
                            <th className="p-4">Advert</th>
                            <th className="p-4">Message</th>
                            <th className="p-4">Date</th>
                            <th className="p-4 text-right">Transactions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {messages.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center">Inbox is empty.</td></tr>
                        ) : (
                            messages.map((msg) => (
                                // DÜZELTME 3: msg.read -> msg.isRead
                                <tr key={msg._id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition ${!msg.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}>
                                    <td className="p-4">
                                        {msg.isRead ? (
                                            <span className="text-green-500 text-xs border border-green-200 px-2 py-1 rounded-full bg-green-50">Okundu</span>
                                        ) : (
                                            <span className="text-blue-600 text-xs border border-blue-200 px-2 py-1 rounded-full bg-blue-50 font-bold">YENİ</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900 dark:text-white">{msg.name}</div>
                                        <div className="text-xs text-gray-500">{msg.email}</div>
                                        <div className="text-xs text-gray-500">{msg.phone}</div>
                                    </td>
                                    <td className="p-4 font-medium text-blue-600">
                                        {msg.property?.name || "Deleted Ad."}
                                    </td>
                                    <td className="p-4 max-w-xs truncate" title={msg.body}>
                                        {msg.body}
                                    </td>
                                    <td className="p-4 text-xs text-gray-500">
                                        {new Date(msg.createdAt).toLocaleDateString("tr-TR")}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            // DÜZELTME 4: markAsRead fonksiyonuna msg.isRead gönderiyoruz
                                            onClick={() => markAsRead(msg._id, msg.isRead)}
                                            className="text-blue-600 hover:text-blue-800 mr-3 text-xs uppercase font-semibold"
                                        >
                                            {msg.isRead ? "Mark as unread" : "Mark as read"}
                                        </button>
                                        <button
                                            onClick={() => deleteMessage(msg._id)}
                                            className="text-red-500 hover:text-red-700 text-xs uppercase font-semibold"
                                        >
                                            Delete
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
