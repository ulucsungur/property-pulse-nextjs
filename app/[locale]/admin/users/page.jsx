"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useNavigation } from "@refinedev/core";
import { useTranslations } from 'next-intl';
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa"; // İkonlar

export default function UserList() {
    const t = useTranslations('AdminUsers');
    const { edit } = useNavigation();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- SIRALAMA STATE'İ ---
    const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'asc' });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/admin/users", { cache: "no-store" });
                if (!res.ok) throw new Error("Veri çekilemedi");
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

    // --- SIRALAMA MANTIĞI ---
    const sortedUsers = useMemo(() => {
        let items = [...users];
        if (sortConfig.key !== null) {
            items.sort((a, b) => {
                let aValue, bValue;

                switch (sortConfig.key) {
                    case 'username':
                        aValue = (a.username || a.name || "").toLowerCase();
                        bValue = (b.username || b.name || "").toLowerCase();
                        break;
                    case 'email':
                        aValue = a.email.toLowerCase();
                        bValue = b.email.toLowerCase();
                        break;
                    case 'role':
                        aValue = a.role.toLowerCase();
                        bValue = b.role.toLowerCase();
                        break;
                    case 'status':
                        aValue = (a.status || "active").toLowerCase();
                        bValue = (b.status || "active").toLowerCase();
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
    }, [users, sortConfig]);

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

    if (loading) return <div className="p-8 text-gray-500 dark:text-gray-400">{t('loading')}</div>;
    if (error) return <div className="p-8 text-red-500">{t('error')}: {error}</div>;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-20">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                    {t('title')}
                </h1>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t('total')}: {users.length}
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                    <thead className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-semibold">
                        <tr>
                            <th className="p-4 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => requestSort('username')}>
                                {t('tableUser')} {getSortIcon('username')}
                            </th>
                            <th className="p-4 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => requestSort('email')}>
                                {t('tableEmail')} {getSortIcon('email')}
                            </th>
                            <th className="p-4 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => requestSort('role')}>
                                {t('tableRole')} {getSortIcon('role')}
                            </th>
                            <th className="p-4 cursor-pointer hover:text-blue-500 transition-colors" onClick={() => requestSort('status')}>
                                {t('tableStatus')} {getSortIcon('status')}
                            </th>
                            <th className="p-4 text-right">{t('tableTransactions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {sortedUsers.length === 0 ? (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-500">{t('noUsers')}</td></tr>
                        ) : (
                            sortedUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                    <td className="p-4 font-medium flex items-center gap-3">
                                        {user.image ? (
                                            <img src={user.image} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                                                {(user.username || user.name || "?").charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span className="dark:text-white">{user.username || user.name}</span>
                                    </td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${user.role === "admin" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                                            user.role === "agent" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                                "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${user.status === "banned" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            }`}>
                                            {user.status || t('active')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => edit("admin/users", user._id)}
                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
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
//----281225 çalışan----------
// "use client";

// import React, { useEffect, useState } from "react";
// import { useNavigation } from "@refinedev/core";
// // 1. IMPORT
// import { useTranslations } from 'next-intl';

// export default function UserList() {
//     // 2. KANCALARI BAŞLAT
//     const t = useTranslations('AdminUsers');
//     const { edit } = useNavigation();

//     // State tanımları
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const res = await fetch("/api/admin/users", { cache: "no-store" });

//                 if (!res.ok) {
//                     throw new Error("Veri çekilemedi");
//                 }

//                 const data = await res.json();
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

//     if (loading) return <div className="p-8 text-gray-500">{t('loading')}</div>;
//     if (error) return <div className="p-8 text-red-500">{t('error')}: {error}</div>;

//     return (
//         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mt-16">
//             {/* Üst Başlık */}
//             <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
//                 <h1 className="text-xl font-bold text-gray-800 dark:text-white">
//                     {t('title')}
//                 </h1>
//                 <span className="text-sm text-gray-500">
//                     {t('total')}: {users.length}
//                 </span>
//             </div>

//             {/* Tablo */}
//             <div className="overflow-x-auto">
//                 <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
//                     <thead className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-semibold">
//                         <tr>
//                             <th className="p-4">{t('tableUser')}</th>
//                             <th className="p-4">{t('tableEmail')}</th>
//                             <th className="p-4">{t('tableRole')}</th>
//                             <th className="p-4">{t('tableStatus')}</th>
//                             <th className="p-4 text-right">{t('tableTransactions')}</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
//                         {users.length === 0 ? (
//                             <tr>
//                                 <td colSpan="5" className="p-8 text-center text-gray-500">
//                                     {t('noUsers')}
//                                 </td>
//                             </tr>
//                         ) : (
//                             users.map((user) => (
//                                 <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
//                                     <td className="p-4 font-medium flex items-center gap-3">
//                                         {user.image ? (
//                                             <img src={user.image} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
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
//                                             {user.status || t('active')}
//                                         </span>
//                                     </td>
//                                     <td className="p-4 text-right">
//                                         <button
//                                             onClick={() => edit("admin/users", user._id)}
//                                             className="text-blue-600 hover:text-blue-800 font-medium text-sm"
//                                         >
//                                             {t('edit')}
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
