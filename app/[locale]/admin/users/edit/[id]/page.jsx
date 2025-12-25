"use client";

import React, { useEffect } from "react";
import { useNavigation } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

export default function UserEdit() {
    const { list } = useNavigation();

    // REFINE GÜCÜ BURADA:
    // 1. URL'deki ID'yi alır.
    // 2. API'ye (api/admin/users/ID) istek atar.
    // 3. Formu doldurur.
    // 4. Kaydet deyince PUT isteği atar.
    const {
        refineCore: { onFinish, formLoading, queryResult },
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        refineCoreProps: {
            resource: "admin/users", // API yolunu bulması için kritik ayar
            action: "edit",
            redirect: "list" // Kayıttan sonra listeye dön
        },
    });

    // API'den gelen mevcut kullanıcı verisi
    const userData = queryResult?.data?.data;

    // Form alanlarını doldur
    useEffect(() => {
        if (userData) {
            setValue("role", userData.role);
            setValue("status", userData.status);
        }
    }, [userData, setValue]);

    if (formLoading) return <div className="p-8 text-gray-500">Loading user information...</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mt-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Authorization Regulation</h1>
                <button
                    onClick={() => list("admin/users")}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 text-sm"
                >
                    Leave
                </button>
            </div>

            <div className="flex items-center gap-4 mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                {userData?.image && (
                    <img src={userData.image} alt="User" className="w-12 h-12 rounded-full" />
                )}
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">{userData?.username || userData?.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{userData?.email}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onFinish)} className="space-y-6">

                {/* ROL SEÇİMİ */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        User Role
                    </label>
                    <select
                        {...register("role")}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="customer">Customer (Standart Müşteri)</option>
                        <option value="agent">Agent (Emlakçı - İlan Girebilir)</option>
                        <option value="admin">Admin (Süper Yönetici)</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        * <b>Agent:</b> You can access the ad posting and blog writing panel.<br />
                        * <b>Admin:</b> Manage the entire system.
                    </p>
                </div>

                {/* DURUM SEÇİMİ */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Account status
                    </label>
                    <select
                        {...register("status")}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                    >
                        <option value="active">🟢 Active (Aktif)</option>
                        <option value="banned">🔴 Banned (Engelli)</option>
                    </select>
                </div>

                {/* Buton */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md w-full sm:w-auto"
                    >
                        Save & Update
                    </button>
                </div>

            </form>
        </div>
    );
}
