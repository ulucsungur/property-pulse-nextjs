"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Grafikleri Dinamik Import (Hata önleyici)
const AdminCharts = dynamic(() => import("./Charts"), {
    ssr: false,
    loading: () => <div className="h-64 flex items-center justify-center text-gray-400">Grafikler yükleniyor...</div>
});

export default function AdminDashboard() {
    // Veriyi tutacak state
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // API'ye manuel istek atıyoruz (Refine'ı aradan çıkardık)
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/stats", { cache: "no-store" });
                if (!res.ok) throw new Error("Veri çekilemedi");

                const data = await res.json();
                console.log("✅ API'den Gelen Saf Veri:", data); // Konsolda bunu kesin göreceksin
                setStats(data);
            } catch (error) {
                console.error("Fetch Hatası:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Panel yükleniyor...</div>;
    }

    return (
        <div className="space-y-8 pb-10">

            {/* BAŞLIK */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Yönetim Paneli</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Sistemin anlık durumu ve istatistikler.</p>
            </div>

            {/* KPI KARTLARI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard
                    title="Kullanıcılar"
                    value={stats?.kpi?.totalUsers || 0}
                    color="blue"
                    icon="👥"
                />
                <KpiCard
                    title="Aktif İlanlar"
                    value={stats?.kpi?.totalProperties || 0}
                    color="green"
                    icon="🏠"
                />
                <KpiCard
                    title="Kategoriler"
                    value={stats?.charts?.propertyTypes?.length || 0}
                    color="orange"
                    icon="📂"
                />
            </div>

            {/* GRAFİKLER */}
            {/* Veri varsa grafiği çiz */}
            {stats && <AdminCharts stats={stats.charts} />}

        </div>
    );
}

// Kart Bileşeni
function KpiCard({ title, value, color, icon }) {
    const borderColors = {
        blue: "border-l-blue-500",
        green: "border-l-green-500",
        orange: "border-l-orange-500",
    };
    const textColors = {
        blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        green: "text-green-600 bg-green-50 dark:bg-green-900/20",
        orange: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
    };

    return (
        <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 border-l-4 ${borderColors[color]}`}>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">{title}</p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{value}</p>
                </div>
                <div className={`p-3 rounded-full text-2xl ${textColors[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
