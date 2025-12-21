'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import profileDefault from "@/assets/images/profile.png";
import { signOut, useSession } from "next-auth/react";
import UnreadMessageCount from "./UnreadMessageCount";
import ThemeSwitcher from "./ThemeSwitcher";

const Navbar = () => {
    const { data: session } = useSession();

    const profileImage = (session?.user?.image && session.user.image.startsWith('http'))
        ? session.user.image
        : profileDefault;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    // --- YENİ: Scroll Takibi State'i ---
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    // -----------------------------------

    const pathname = usePathname();

    return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${isScrolled || pathname !== '/'
            ? "bg-blue-900 dark:bg-gray-900 shadow-lg py-2 border-blue-800 dark:border-gray-800"
            : "bg-blue-900/80 dark:bg-gray-900/80 backdrop-blur-md py-4 border-transparent"
            }`}>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">

                    {/* --- HAMBURGER MENU (MOBİL) --- */}
                    <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                        <button
                            type="button"
                            className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-200 hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition"
                            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>

                    {/* --- LOGO VE MENÜLER --- */}
                    <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
                        <Link className="flex flex-shrink-0 items-center gap-2 group" href="/">
                            {/* Logo'ya hover efekti ekledik */}
                            <div className="group-hover:scale-110 transition duration-300">
                                <Logo />
                            </div>
                            <span className="hidden md:block text-white text-2xl font-bold ml-2 tracking-tight">PropertyPulse</span>
                        </Link>

                        <div className="hidden md:ml-6 md:block">
                            <div className="flex space-x-2">
                                {/* Linklerdeki hover efektini modernleştirdik (white/10) */}
                                <Link href="/" className={`${pathname === '/' ? 'bg-black/40' : 'hover:bg-white/10'} text-white rounded-md px-3 py-2 transition duration-200`}>Home</Link>
                                <Link href="/properties" className={`${pathname === '/properties' ? 'bg-black/40' : 'hover:bg-white/10'} text-white rounded-md px-3 py-2 transition duration-200`}>Properties</Link>
                                {session && (
                                    <>
                                        <Link href="/chart" className={`${pathname === '/chart' ? 'bg-black/40' : 'hover:bg-white/10'} text-white rounded-md px-3 py-2 transition duration-200`}>Charts</Link>
                                        <Link href="/properties/add" className={`${pathname === '/properties/add' ? 'bg-black/40' : 'hover:bg-white/10'} text-white rounded-md px-3 py-2 transition duration-200`}>Add Property</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- SAĞ TARAF --- */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0 gap-3">

                        {/* 1. DARK MODE BUTONU */}
                        <ThemeSwitcher />

                        {/* 2. AUTH KISMI */}
                        {!session ? (
                            // GİRİŞ YAPMAMIŞSA
                            <div className="hidden md:block">
                                <div className="flex items-center gap-2">
                                    <Link href="/login" className="text-white hover:bg-white/10 rounded-md px-4 py-2 transition">Login</Link>
                                    <Link href="/register" className="text-white hover:bg-white/10 rounded-md px-4 py-2 transition">Register</Link>
                                </div>
                            </div>
                        ) : (
                            // GİRİŞ YAPMIŞSA
                            <>
                                <Link href="/messages" className="relative group">
                                    <button type="button" className="relative rounded-full bg-gray-800/50 p-1.5 text-gray-200 hover:text-white hover:bg-gray-700 transition focus:outline-none">
                                        <span className="sr-only">View notifications</span>
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                        </svg>
                                    </button>
                                    <UnreadMessageCount />
                                </Link>

                                {/* Profil Dropdown */}
                                <div className="relative ml-2">
                                    <div>
                                        <button
                                            type="button"
                                            className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 transition transform hover:scale-105"
                                            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                                        >
                                            <span className="sr-only">Open user menu</span>
                                            <Image className="h-9 w-9 rounded-full object-cover border-2 border-white/20" src={profileImage} width={40} height={40} alt="User" />
                                        </button>
                                    </div>
                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 border dark:border-gray-700 animate-fade-in-down">
                                            <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" onClick={() => setIsProfileMenuOpen(false)}>Your Profile</Link>
                                            <Link href="/properties/saved" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" onClick={() => setIsProfileMenuOpen(false)}>Saved Properties</Link>
                                            <button
                                                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left dark:text-red-400 dark:hover:bg-gray-700"
                                                onClick={() => {
                                                    setIsProfileMenuOpen(false);
                                                    signOut({ callbackUrl: '/' });
                                                }}
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* --- MOBİL MENÜ --- */}
            {isMobileMenuOpen && (
                <div id="mobile-menu" className="bg-blue-800 dark:bg-gray-900 shadow-inner">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        <Link href="/"
                            className="text-white block rounded-md px-3 py-2 text-base font-medium hover:bg-black/20"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >Home</Link>
                        <Link href="/properties" className="text-white block rounded-md px-3 py-2 text-base font-medium hover:bg-black/20"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >Properties</Link>
                        {session && (
                            <>
                                <Link href="/chart"
                                    className="text-white block rounded-md px-3 py-2 text-base font-medium hover:bg-black/20"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >Charts</Link>
                                <Link href="/properties/add"
                                    className="text-white block rounded-md px-3 py-2 text-base font-medium hover:bg-black/20"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >Add Property</Link>
                            </>
                        )}

                        {!session && (
                            <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                                <Link href="/login"
                                    className="block text-white bg-gray-900/50 rounded-md px-3 py-2 text-base font-medium text-center hover:bg-gray-900"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >Login</Link>
                                <Link href="/register"
                                    className="block text-blue-900 bg-white rounded-md px-3 py-2 text-base font-medium text-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
