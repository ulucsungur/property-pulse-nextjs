"use client";

import React from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function AdminCharts({ stats }) {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Bar Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Kullanıcı Dağılımı</h3>

                {/* ResponsiveContainer SİLDİK. Yerine sabit genişlikli ama scroll edilebilir yapı kurduk */}
                <div className="min-w-[300px] flex justify-center">
                    <BarChart width={500} height={350} data={stats.userRoles}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#888" />
                        <YAxis axisLine={false} tickLine={false} stroke="#888" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff', borderRadius: '8px' }}
                            cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                        />
                        <Bar dataKey="value" name="Kişi" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={50} />
                    </BarChart>
                </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">İlan Kategorileri</h3>

                <div className="min-w-[300px] flex justify-center">
                    <PieChart width={400} height={350}>
                        <Pie
                            data={stats.propertyTypes}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {stats.propertyTypes?.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', color: '#fff', borderRadius: '8px' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </div>
            </div>
        </div>
    );
}
