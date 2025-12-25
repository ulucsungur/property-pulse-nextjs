"use client";

import React, { useEffect, useState } from "react";
import { useNavigation } from "@refinedev/core";
// 1. IMPORT
import { useTranslations } from 'next-intl';

export default function UserList() {
    // 2. KANCALARI BAŞLAT
    const t = useTranslations('AdminUsers');
    const { edit } = useNavigation();

    // State tanımları
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/admin/users", { cache: "no-store" });

                if (!res.ok) {
                    throw new Error("Veri çekilemedi");
                }

                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error("Fetch Hatası:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div className="p-8 text-gray-500">{t('loading')}</div>;
    if (error) return <div className="p-8 text-red-500">{t('error')}: {error}</div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-16">
            {/* Üst Başlık */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                    {t('title')}
                </h1>
                <span className="text-sm text-gray-500">
                    {t('total')}: {users.length}
                </span>
            </div>

            {/* Tablo */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                    <thead className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-semibold">
                        <tr>
                            <th className="p-4">{t('tableUser')}</th>
                            <th className="p-4">{t('tableEmail')}</th>
                            <th className="p-4">{t('tableRole')}</th>
                            <th className="p-4">{t('tableStatus')}</th>
                            <th className="p-4 text-right">{t('tableTransactions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">
                                    {t('noUsers')}
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                    <td className="p-4 font-medium flex items-center gap-3">
                                        {user.image ? (
                                            <img src={user.image} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                {(user.username || user.name || "?").charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        {user.username || user.name}
                                    </td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${user.role === "admin" ? "bg-purple-100 text-purple-700" :
                                            user.role === "agent" ? "bg-blue-100 text-blue-700" :
                                                "bg-gray-100 text-gray-600"
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${user.status === "banned" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                            }`}>
                                            {user.status || t('active')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => edit("admin/users", user._id)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                        >
                                            {t('edit')}
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
// import { useNavigation } from "@refinedev/core";

// export default function UserList() {
//     const { edit } = useNavigation();

//     // State tanımları
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Veriyi Refine yerine manuel çekiyoruz
//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 // API'ye direkt istek (Parametresiz, tümünü getirir)
//                 const res = await fetch("/api/admin/users", { cache: "no-store" });

//                 if (!res.ok) {
//                     throw new Error("Veri çekilemedi");
//                 }

//                 const data = await res.json();
//                 console.log("✅ Gelen Kullanıcılar:", data); // Konsol kontrolü
//                 setUsers(data);
//             } catch (err) {
//                 console.error("Fetch Hatası:", err);
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchUsers();
//     }, []);

//     if (loading) return <div className="p-8 text-gray-500">Users loading...</div>;
//     if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

//     return (
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-16">
//             {/* Üst Başlık */}
//             <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
//                 <h1 className="text-xl font-bold text-gray-800 dark:text-white">User Lists</h1>
//                 <span className="text-sm text-gray-500">Toplam: {users.length} enrollment</span>
//             </div>

//             {/* Tablo */}
//             <div className="overflow-x-auto">
//                 <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
//                     <thead className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-semibold">
//                         <tr>
//                             <th className="p-4">User</th>
//                             <th className="p-4">Email</th>
//                             <th className="p-4">Role</th>
//                             <th className="p-4">Status</th>
//                             <th className="p-4 text-right">Transactions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
//                         {users.length === 0 ? (
//                             <tr>
//                                 <td colSpan="5" className="p-8 text-center text-gray-500">
//                                     No users found.
//                                 </td>
//                             </tr>
//                         ) : (
//                             users.map((user) => (
//                                 <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
//                                     <td className="p-4 font-medium flex items-center gap-3">
//                                         {user.image ? (
//                                             <img src={user.image} alt={user.username} className="w-8 h-8 rounded-full" />
//                                         ) : (
//                                             <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
//                                                 {(user.username || user.name || "?").charAt(0).toUpperCase()}
//                                             </div>
//                                         )}
//                                         {user.username || user.name}
//                                     </td>
//                                     <td className="p-4">{user.email}</td>
//                                     <td className="p-4">
//                                         <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${user.role === "admin" ? "bg-purple-100 text-purple-700" :
//                                             user.role === "agent" ? "bg-blue-100 text-blue-700" :
//                                                 "bg-gray-100 text-gray-600"
//                                             }`}>
//                                             {user.role}
//                                         </span>
//                                     </td>
//                                     <td className="p-4">
//                                         <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${user.status === "banned" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
//                                             }`}>
//                                             {user.status || 'active'}
//                                         </span>
//                                     </td>
//                                     <td className="p-4 text-right">
//                                         <button
//                                             // Refine navigasyonunu kullanıyoruz
//                                             onClick={() => edit("admin/users", user._id)}
//                                             className="text-blue-600 hover:text-blue-800 font-medium text-sm"
//                                         >
//                                             Edit
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
