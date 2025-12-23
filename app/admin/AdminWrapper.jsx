"use client";

import { useState } from "react";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";
import dataProvider from "@refinedev/simple-rest";
import Link from "next/link";

export default function AdminWrapper({ children, session }) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider(API_URL)}
            resources={[
                { name: "dashboard", list: "/admin" },
                { name: "admin/users", list: "/admin/users", edit: "/admin/users/edit/:id" },
                { name: "properties", list: "/admin/properties" },
                { name: "admin/messages", list: "/admin/messages" },
            ]}
            options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
            }}
        >
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">

                {/* --- 1. MOBİL OVERLAY (Menü açılınca arkası kararsın) --- */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-[9998] md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* --- 2. SIDEBAR (SOL MENÜ) --- */}
                <aside
                    className={`
            fixed top-0 left-0 h-full w-72 bg-slate-900 text-white shadow-2xl z-[9999]
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0 md:static md:h-screen md:sticky md:top-0
          `}
                >
                    {/* Menü Başlığı ve Kapat Butonu */}
                    <div className="flex items-center justify-between px-6 h-20 border-b border-slate-700 bg-slate-950">
                        <span className="text-xl font-bold tracking-wider">YÖNETİM</span>
                        {/* Sadece mobilde çıkan Kapat (X) butonu */}
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="md:hidden text-white bg-red-600 hover:bg-red-700 rounded px-3 py-1 text-sm font-bold"
                        >
                            KAPAT
                        </button>
                    </div>

                    <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100%-80px)]">
                        <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-slate-800 transition">
                            <span>📊</span> <span>Dashboard</span>
                        </Link>

                        <Link href="/admin/properties" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-slate-800 transition">
                            <span>🏠</span> <span>İlanlar</span>
                        </Link>

                        <Link href="/admin/messages" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-slate-800 transition">
                            <span>💬</span> <span>Mesajlar</span>
                        </Link>

                        {session?.user?.role === "admin" && (
                            <Link href="/admin/users" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-slate-800 transition">
                                <span>👥</span> <span>Kullanıcılar</span>
                            </Link>
                        )}

                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3 mt-10 rounded bg-slate-800 hover:bg-slate-700 transition text-sm text-gray-300">
                            <span>⬅️</span> <span>Siteye Dön</span>
                        </Link>
                    </nav>
                </aside>

                {/* --- 3. İÇERİK ALANI --- */}
                <div className="flex-1 flex flex-col min-w-0">

                    {/* !!! MOBİL İÇİN MENÜ AÇMA BUTONU (ÇOK BELİRGİN) !!! */}
                    <div className="md:hidden p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            MENÜYÜ AÇ
                        </button>
                    </div>

                    {/* Sayfa İçeriği */}
                    <main className="flex-1 p-4 md:p-8">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>

                </div>

            </div>
        </Refine>
    );
}
