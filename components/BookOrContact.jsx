"use client";
import { useState } from "react";
import PropertyBooking from "./PropertyBooking";
import PropertyContactForm from "./PropertyContactForm";
import { FaCalendarCheck, FaEnvelope } from "react-icons/fa";

const BookOrContact = ({ property }) => {
    // Varsayılan olarak 'booking' sekmesi açık olsun
    const [activeTab, setActiveTab] = useState("booking");

    return (
        <div className="bg-white dark:bg-gray-800  rounded-lg shadow-md overflow-hidden">
            {/* --- TAB BUTONLARI --- */}
            <div className="flex border-b">
                <button
                    className={`flex-1 py-4 text-center font-bold flex items-center justify-center gap-2 transition duration-300 ${activeTab === "booking"
                        ? "bg-blue-50 text-blue-600 border-b-4 border-blue-600"
                        : "bg-gray-50 dark:bg-gray-700 text-gray-500 hover:bg-gray-100"
                        }`}
                    onClick={() => setActiveTab("booking")}
                >
                    <FaCalendarCheck /> Rezervasyon
                </button>

                <button
                    className={`flex-1 py-4 text-center font-bold flex items-center justify-center gap-2 transition duration-300 ${activeTab === "message"
                        ? "bg-blue-50 text-blue-600 border-b-4 border-blue-600"
                        : "bg-gray-50 dark:bg-gray-700 text-gray-500 hover:bg-gray-100"
                        }`}
                    onClick={() => setActiveTab("message")}
                >
                    <FaEnvelope /> Mesaj At
                </button>
            </div>

            {/* --- İÇERİK ALANI --- */}
            <div className="transition-all duration-300 ease-in-out">
                {activeTab === "booking" ? (
                    <PropertyBooking property={property} />
                ) : (
                    // Mevcut Contact Formunun tasarımını bozmadan buraya yüklüyoruz
                    <div className="p-6">
                        <PropertyContactForm property={property} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookOrContact;
