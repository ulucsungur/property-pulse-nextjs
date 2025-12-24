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

                {/* --- 1. MOBİL OVERLAY --- */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9998] md:hidden"
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
                    <div className="flex items-center justify-between px-6 h-16 border-b border-slate-700 bg-slate-950">
                        <span className="text-lg font-bold tracking-wider text-blue-400">ADMIN PANEL</span>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="md:hidden text-slate-400 hover:text-white transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-64px)]">
                        <SidebarLink href="/admin" icon="📊" label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
                        <SidebarLink href="/admin/properties" icon="🏠" label="Ads" onClick={() => setIsMobileMenuOpen(false)} />
                        <SidebarLink href="/admin/messages" icon="💬" label="Messages" onClick={() => setIsMobileMenuOpen(false)} />

                        {session?.user?.role === "admin" && (
                            <SidebarLink href="/admin/users" icon="👥" label="Users" onClick={() => setIsMobileMenuOpen(false)} />
                        )}

                        <div className="pt-4 mt-4 border-t border-slate-800">
                            <Link href="/" className="flex items-center space-x-3 px-4 py-3 rounded text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition">
                                <span>⬅️</span> <span>Back to Site</span>
                            </Link>
                        </div>
                    </nav>
                </aside>

                {/* --- 3. İÇERİK ALANI --- */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                    {/* YENİ MOBİL ÜST BAR (HEADER) */}
                    <header className="md:hidden flex items-center justify-between px-4 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-[9997]">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <span className="font-semibold text-gray-800 dark:text-white text-sm tracking-wide">YÖNETİM</span>
                        <div className="w-10"></div> {/* Dengeleme için boş div */}
                    </header>

                    {/* Sayfa İçeriği */}
                    <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>

            </div>
        </Refine>
    );
}

// Sidebar Link Bileşeni (Tekrarı önlemek için)
function SidebarLink({ href, icon, label, onClick }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors group"
        >
            <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
            <span className="font-medium">{label}</span>
        </Link>
    );
}
