"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/utils/navigation"; // Kendi oluşturduğumuz navigation'dan
import { useTransition } from "react";
import Image from "next/image"; // Bayrak ikonu için (Opsiyonel, şimdilik metin kullanacağız)

export default function LangSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const toggleLanguage = () => {
        const nextLocale = locale === "tr" ? "en" : "tr";

        startTransition(() => {
            // Mevcut sayfada dili değiştir (URL'yi güncelle)
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <button
            onClick={toggleLanguage}
            disabled={isPending}
            className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
            {/* Basitçe TR / EN yazısı */}
            <span className="font-bold text-sm text-gray-700 dark:text-gray-200">
                {locale === "tr" ? "EN" : "TR"}
            </span>
            {/* İstersen buraya bayrak emojisi veya resmi koyabilirsin */}
            <span className="text-xs text-gray-500">
                {locale === "tr" ? "Switch to English" : "Türkçe'ye Geç"}
            </span>
        </button>
    );
}
