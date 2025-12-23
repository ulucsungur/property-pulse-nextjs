"use client";

import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";
import dataProvider from "@refinedev/simple-rest";
import Link from "next/link";

export default function AdminWrapper({ children, session }) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

    return (
        <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider(API_URL)}
            resources={[
                {
                    name: "dashboard",
                    list: "/admin",
                },
                {
                    name: "properties",
                    list: "/admin/properties",
                    show: "/admin/properties/show/:id",
                },
                {
                    name: "admin/users", // "users" yerine "admin/users" yazdık ki API yolunu bulsun
                    list: "/admin/users",
                    edit: "/admin/users/edit/:id",
                },
                {
                    name: "admin/messages", // API yoluyla uyumlu isim
                    list: "/admin/messages",
                }
            ]}
            options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
            }}
        >
            {/* Container: Light/Dark Mode Arkaplan */}
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

                {/* SOL MENÜ (SIDEBAR) - Her zaman koyu kalabilir veya dark mode'a göre açılabilir */}
                <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-lg sticky top-0 h-screen overflow-y-auto z-50">
                    <div className="p-6 text-xl font-bold border-b border-slate-700 tracking-wider">
                        YÖNETİM
                    </div>

                    <nav className="flex-1 p-4 space-y-2 mt-4">
                        <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-slate-800 transition">
                            <span>📊</span>
                            <span>Dashboard</span>
                        </Link>

                        <Link href="/admin/properties" className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-slate-800 transition">
                            <span>🏠</span>
                            <span>İlanlar</span>
                        </Link>
                        <Link href="/admin/messages" className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-slate-800 transition">
                            <span>💬</span>
                            <span>Mesajlar</span>
                        </Link>

                        {session?.user?.role === "admin" && (
                            <Link href="/admin/users" className="flex items-center space-x-3 px-4 py-3 rounded hover:bg-slate-800 transition">
                                <span>👥</span>
                                <span>Kullanıcılar</span>
                            </Link>
                        )}

                        <Link href="/" className="flex items-center space-x-3 px-4 py-3 mt-8 rounded bg-slate-800 hover:bg-slate-700 transition text-sm text-gray-300">
                            <span>⬅️</span>
                            <span>Siteye Dön</span>
                        </Link>
                    </nav>

                    <div className="p-4 bg-slate-950 text-xs text-gray-400 border-t border-slate-800">
                        <div>{session?.user?.name || session?.user?.email}</div>
                        <div className="uppercase text-blue-400 mt-1 font-semibold">{session?.user?.role}</div>
                    </div>
                </aside>

                {/* SAĞ İÇERİK ALANI */}
                <main className="flex-1 p-8 overflow-y-auto h-screen">
                    {children}
                </main>
            </div>
        </Refine>
    );
}
