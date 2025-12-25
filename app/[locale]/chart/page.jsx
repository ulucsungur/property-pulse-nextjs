"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from 'next-intl'; // 1. Import
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import PieChart from "@/components/charts/PieChart";
import RadarChart from "@/components/charts/RadarChart";

const ChartPage = () => {
    // 2. Çeviri kancasını 'Charts' başlığıyla başlat
    const t = useTranslations('Charts');

    const { data: session, status } = useSession();
    const [cityData, setCityData] = useState(null);
    const [monthlyData, setMonthlyData] = useState(null);
    const [rentalTypeData, setRentalTypeData] = useState(null);
    const [bookmarkData, setBookmarkData] = useState(null);

    useEffect(() => {
        if (!session) return;

        // Promise.all kullanarak fetch işlemlerini paralel ve temiz yapabiliriz
        Promise.all([
            fetch("/api/chartData/city").then(res => res.json()),
            fetch("/api/chartData/monthly").then(res => res.json()),
            fetch("/api/chartData/rentalType").then(res => res.json()),
            fetch("/api/chartData/bookmarkedCities").then(res => res.json())
        ]).then(([city, monthly, type, bookmark]) => {
            setCityData(city);
            setMonthlyData(monthly);
            setRentalTypeData(type);
            setBookmarkData(bookmark);
        }).catch(err => console.error("Veri çekme hatası:", err));

    }, [session]);

    if (status === "loading") {
        return <p className="text-center mt-10">{t('loadingSession')}</p>;
    }

    if (!session) {
        return <p className="text-center mt-10">{t('loginRequired')}</p>;
    }

    if (!cityData || !monthlyData || !rentalTypeData || !bookmarkData) {
        return <p className="text-center mt-10">{t('loadingData')}</p>;
    }

    return (
        <main className="p-6 pt-28 pb-20 bg-blue-50 dark:bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
                {t('title')}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

                {/* 1. Bar Chart: Şehirler */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 h-[450px] flex flex-col">
                    <h2 className="text-lg font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">
                        {t('chartCity')}
                    </h2>
                    <div className="flex-1 flex items-center justify-center relative w-full">
                        <BarChart data={cityData} />
                    </div>
                </div>

                {/* 2. Line Chart: Aylık */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 h-[450px] flex flex-col">
                    <h2 className="text-lg font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">
                        {t('chartMonthly')}
                    </h2>
                    <div className="flex-1 flex items-center justify-center relative w-full">
                        <LineChart data={monthlyData} />
                    </div>
                </div>

                {/* 3. Pie Chart: Türler */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 h-[450px] flex flex-col">
                    <h2 className="text-lg font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">
                        {t('chartType')}
                    </h2>
                    <div className="flex-1 flex items-center justify-center relative w-full">
                        <PieChart data={rentalTypeData} />
                    </div>
                </div>

                {/* 4. Radar Chart: Bookmark */}
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 h-[450px] flex flex-col">
                    <h2 className="text-lg font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">
                        {t('chartBookmark')}
                    </h2>
                    <div className="flex-1 flex items-center justify-center relative w-full">
                        <RadarChart data={bookmarkData} />
                    </div>
                </div>

            </div>
        </main>
    );
};

export default ChartPage;
