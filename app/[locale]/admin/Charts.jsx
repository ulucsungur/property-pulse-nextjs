"use client";

import React from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell
} from "recharts";
import { useTranslations, useLocale } from 'next-intl'; // useLocale eklendi

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#82ca9d", "#ffc658"];

export default function AdminCharts({ stats }) {
    const t = useTranslations('AdminDashboard');
    const tCat = useTranslations('Categories');
    const locale = useLocale(); // Tarih formatı için dili alıyoruz (tr/en)

    if (!stats) return null;

    // --- 1. PIE CHART VERİSİ ---
    const pieData = stats.propertyTypes?.map(item => ({
        name: tCat(item._id || item.name) || item._id,
        value: item.count || item.value
    })) || [];

    // --- 2. BAR CHART VERİSİ (GELİŞMİŞ) ---
    const processBarData = (data) => {
        if (!data || !Array.isArray(data)) return [];

        return data.map(item => {
            // Gelen veri formatı muhtemelen: { _id: "2025-12", count: 5 }
            let displayName = item._id;

            // Tarihi güzelleştir: "2025-12" -> "Ara 2025"
            if (item._id && item._id.includes('-')) {
                const [year, month] = item._id.split('-');
                const date = new Date(year, month - 1); // Ay 0-indexlidir

                // Dile göre ay ismi (Oca 2025 / Jan 2025)
                displayName = date.toLocaleDateString(locale === 'en' ? 'en-US' : 'tr-TR', {
                    month: 'short',
                    year: 'numeric'
                });
            }

            return {
                name: displayName,
                value: item.count || item.value || 0
            };
        });
    };

    const barData = processBarData(stats.monthly);

    // KONSOL KONTROLÜ (F12'de veriyi görmek için)
    console.log("Bar Chart Ham Veri:", stats.monthly);
    console.log("Bar Chart İşlenmiş Veri:", barData);

    // Tooltip Stili
    const tooltipStyle = {
        backgroundColor: '#1f2937',
        borderColor: '#374151',
        color: '#f3f4f6',
        borderRadius: '8px',
        padding: '10px',
        fontSize: '14px'
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* --- PIE CHART --- */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
                    {t('chartPropertyTypes')}
                </h3>
                <div className="min-w-[300px] flex justify-center">
                    <PieChart width={400} height={350}>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            label={({ name, percent }) => `${name} (%${(percent * 100).toFixed(0)})`}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </div>
            </div>

            {/* --- BAR CHART --- */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">
                    {t('chartMonthly')}
                </h3>

                <div className="min-w-[300px] flex justify-center items-center h-[350px]">
                    {/* VERİ YOKSA UYARI GÖSTER */}
                    {barData.length === 0 ? (
                        <p className="text-gray-400 italic">Bu dönem için veri bulunamadı.</p>
                    ) : (
                        <BarChart width={500} height={350} data={barData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                stroke="#888"
                                fontSize={12}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                stroke="#888"
                                allowDecimals={false} // Tam sayı göster
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                                contentStyle={tooltipStyle}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar
                                dataKey="value"
                                name="İlan"
                                fill="#3B82F6"
                                radius={[4, 4, 0, 0]}
                                barSize={50}
                            />
                        </BarChart>
                    )}
                </div>
            </div>

        </div>
    );
}

// "use client";

// import React from "react";
// import {
//     BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
//     PieChart, Pie, Cell
// } from "recharts";

// const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

// export default function AdminCharts({ stats }) {
//     if (!stats) return null;

//     return (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

//             {/* Bar Chart */}
//             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
//                 <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Kullanıcı Dağılımı</h3>

//                 {/* ResponsiveContainer SİLDİK. Yerine sabit genişlikli ama scroll edilebilir yapı kurduk */}
//                 <div className="min-w-[300px] flex justify-center">
//                     <BarChart width={500} height={350} data={stats.userRoles}>
//                         <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
//                         <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#888" />
//                         <YAxis axisLine={false} tickLine={false} stroke="#888" />
//                         <Tooltip
//                             contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff', borderRadius: '8px' }}
//                             cursor={{ fill: 'rgba(255,255,255,0.1)' }}
//                         />
//                         <Bar dataKey="value" name="Kişi" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={50} />
//                     </BarChart>
//                 </div>
//             </div>

//             {/* Pie Chart */}
//             <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
//                 <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Ads Categories</h3>

//                 <div className="min-w-[300px] flex justify-center">
//                     <PieChart width={400} height={350}>
//                         <Pie
//                             data={stats.propertyTypes}
//                             cx="50%"
//                             cy="50%"
//                             innerRadius={60}
//                             outerRadius={100}
//                             paddingAngle={5}
//                             dataKey="value"
//                             stroke="none"
//                         >
//                             {stats.propertyTypes?.map((entry, index) => (
//                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                             ))}
//                         </Pie>
//                         <Tooltip
//                             contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff', borderRadius: '8px' }}
//                         />
//                         <Legend verticalAlign="bottom" height={36} iconType="circle" />
//                     </PieChart>
//                 </div>
//             </div>
//         </div>
//     );
// }
