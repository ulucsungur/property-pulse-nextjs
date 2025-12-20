"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import PieChart from "@/components/charts/PieChart";
import RadarChart from "@/components/charts/RadarChart";

const ChartPage = () => {
    const { data: session, status } = useSession();
    const [cityData, setCityData] = useState(null);
    const [monthlyData, setMonthlyData] = useState(null);
    const [rentalTypeData, setRentalTypeData] = useState(null);
    const [bookmarkData, setBookmarkData] = useState(null);

    useEffect(() => {
        if (!session) return;

        fetch("/api/chartData/city")
            .then(res => res.json())
            .then(setCityData);

        fetch("/api/chartData/monthly")
            .then(res => res.json())
            .then(setMonthlyData);

        fetch("/api/chartData/rentalType")
            .then(res => res.json())
            .then(setRentalTypeData);

        fetch("/api/chartData/bookmarkedCities")
            .then(res => res.json())
            .then(setBookmarkData);
    }, [session]);

    if (status === "loading") {
        return <p className="text-center mt-10">Oturum kontrol ediliyor...</p>;
    }

    if (!session) {
        return <p className="text-center mt-10">Bu sayfayı görmek için giriş yapmalısınız.</p>;
    }

    if (!cityData || !monthlyData || !rentalTypeData || !bookmarkData) {
        return <p className="text-center mt-10">Grafikler yükleniyor...</p>;
    }

    return (
        <main className="p-6 pt-28 pb-20">
            <h1 className="text-2xl font-bold mb-6 text-center">İlan Verileri</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-200 shadow rounded p-4 h-[400px] flex items-center justify-center">
                    <BarChart data={cityData} />
                </div>
                <div className="bg-white dark:bg-gray-200 shadow rounded p-4 h-[400px] flex items-center justify-center">
                    <LineChart data={monthlyData} />
                </div>
                <div className="bg-white dark:bg-gray-200 shadow rounded p-4 h-[400px] flex items-center justify-center">
                    <PieChart data={rentalTypeData} />
                </div>
                <div className="bg-white dark:bg-gray-200 shadow rounded p-4 h-[400px] flex items-center justify-center">
                    <RadarChart data={bookmarkData} />
                </div>
            </div>
        </main>
    );
};

export default ChartPage;




// "use client";
// import { useEffect, useState } from "react";
// import BarChart from "@/components/charts/BarChart";
// import LineChart from "@/components/charts/LineChart";
// import PieChart from "@/components/charts/PieChart";
// import RadarChart from "@/components/charts/RadarChart"; // ✅ Area yerine RadarChart

// const ChartPage = () => {
//     const [cityData, setCityData] = useState(null);
//     const [monthlyData, setMonthlyData] = useState(null);
//     const [rentalTypeData, setRentalTypeData] = useState(null);
//     const [bookmarkData, setBookmarkData] = useState(null);

//     useEffect(() => {
//         fetch("/api/chartData/city")
//             .then(res => {
//                 if (!res.ok) throw new Error("Şehir verisi alınamadı");
//                 return res.json();
//             })
//             .then(setCityData)
//             .catch(err => {
//                 console.error(err);
//                 setCityData({ labels: [], datasets: [] });
//             });

//         fetch("/api/chartData/monthly")
//             .then(res => {
//                 if (!res.ok) throw new Error("Aylık veri alınamadı");
//                 return res.json();
//             })
//             .then(setMonthlyData)
//             .catch(err => {
//                 console.error(err);
//                 setMonthlyData({ labels: [], datasets: [] });
//             });

//         fetch("/api/chartData/rentalType")
//             .then(res => {
//                 if (!res.ok) throw new Error("Kiralama türü verisi alınamadı");
//                 return res.json();
//             })
//             .then(setRentalTypeData)
//             .catch(err => {
//                 console.error(err);
//                 setRentalTypeData({ labels: [], datasets: [] });
//             });

//         fetch("/api/chartData/bookmarkedCities")
//             .then(res => {
//                 if (!res.ok) throw new Error("Bookmark verisi alınamadı");
//                 return res.json();
//             })
//             .then(setBookmarkData)
//             .catch(err => {
//                 console.error(err);
//                 setBookmarkData({ labels: [], datasets: [] });
//             });
//     }, []);

//     if (!cityData || !monthlyData || !rentalTypeData || !bookmarkData) {
//         return <p className="text-center mt-10">Grafikler yükleniyor...</p>;
//     }

//     return (
//         <main className="p-6">
//             <h1 className="text-2xl font-bold mb-6 text-center">İlan Verileri</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-white shadow rounded p-4 h-[400px] flex items-center justify-center">
//                     <h2 className="text-lg font-semibold mb-2">Şehirlere Göre İlan Sayısı</h2>
//                     <BarChart data={cityData} />
//                 </div>
//                 <div className="bg-white shadow rounded p-4 h-[400px] flex items-center justify-center">
//                     <h2 className="text-lg font-semibold mb-2">Aylık İlan Sayısı</h2>
//                     <LineChart data={monthlyData} />
//                 </div>
//                 <div className="bg-white shadow rounded p-4 h-[400px] flex items-center justify-center">
//                     <h2 className="text-lg font-semibold mb-2">Kiralama Türü Dağılımı</h2>
//                     <PieChart data={rentalTypeData} />
//                 </div>
//                 <div className="bg-white shadow rounded p-4 h-[400px] flex items-center justify-center">
//                     <h2 className="text-lg font-semibold mb-2">Bookmark Alan İlanlar (Şehirlere Göre)</h2>
//                     <RadarChart data={bookmarkData} /> {/* ✅ RadarChart kullanılıyor */}
//                 </div>
//             </div>
//         </main>
//     );
// };

// export default ChartPage;
