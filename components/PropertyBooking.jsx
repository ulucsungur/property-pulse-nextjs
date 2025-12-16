"use client";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify"; // Toast kütüphanesi eklendi

const PropertyBooking = ({ property }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const [days, setDays] = useState(0);
    const [loading, setLoading] = useState(false);

    const nightlyRate = property.rates.nightly;

    useEffect(() => {
        if (startDate && endDate && nightlyRate) {
            const diffInTime = endDate.getTime() - startDate.getTime();
            const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

            if (diffInDays >= 0) {
                setDays(diffInDays);
                setTotalPrice(diffInDays * nightlyRate);
            } else {
                setDays(0);
                setTotalPrice(0);
            }
        }
    }, [startDate, endDate, nightlyRate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (totalPrice === 0 || !startDate || !endDate) {
            toast.error("Lütfen geçerli bir tarih aralığı seçin.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    property_id: property._id,
                    check_in: startDate,
                    check_out: endDate,
                    total_price: totalPrice,
                    total_days: days,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Rezervasyon talebiniz başarıyla alındı!");
                // Formu temizle
                setStartDate(null);
                setEndDate(null);
            } else {
                toast.error(data.error || "Bir hata oluştu.");
            }
        } catch (error) {
            console.error("Rezervasyon hatası:", error);
            toast.error("Sunucu ile iletişim kurulamadı.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-b-lg shadow-md border-t-0">
            {/* Not: rounded-b-lg yaptık çünkü üstüne sekme (tab) gelecek */}

            {!nightlyRate ? (
                <div className="text-red-500 text-center mb-4">
                    Bu mülk için gecelik kiralama aktif değil. Mesaj atınız.
                </div>
            ) : (
                <div className="text-center mb-6">
                    <p className="text-gray-500 text-sm">Gecelik Fiyat</p>
                    <p className="text-3xl font-bold text-blue-600">${nightlyRate}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-500" /> Giriş Tarihi
                    </label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        minDate={new Date()}
                        placeholderText="Tarih Seçin"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2 flex items-center gap-2">
                        <FaCalendarAlt className="text-red-500" /> Çıkış Tarihi
                    </label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate || new Date()}
                        placeholderText="Tarih Seçin"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!startDate}
                    />
                </div>

                {days > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
                        <div className="flex justify-between text-gray-600 mb-1">
                            <span>Konaklama:</span>
                            <span>{days} Gece</span>
                        </div>
                        <div className="flex justify-between text-gray-600 mb-3">
                            <span>Gecelik:</span>
                            <span>${nightlyRate}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-blue-800 border-t border-blue-200 pt-2">
                            <span>Toplam:</span>
                            <span>${totalPrice}</span>
                        </div>
                    </div>
                )}

                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full w-full focus:outline-none flex items-center justify-center gap-2 transition duration-300 disabled:opacity-50"
                    type="submit"
                    disabled={!nightlyRate || days === 0 || loading}
                >
                    {loading ? "İşleniyor..." : <><FaPaperPlane /> Rezervasyon Yap</>}
                </button>
            </form>
        </div>
    );
};

export default PropertyBooking;
