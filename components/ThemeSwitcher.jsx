'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FaMoon, FaSun } from 'react-icons/fa';

const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // Hydration hatasını önlemek için
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <button
            className="flex items-center justify-center p-2 rounded-full text-white hover:bg-gray-700 transition-colors"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle Dark Mode"
        >
            {theme === 'dark' ? (
                <FaSun className="text-yellow-400 text-xl" />
            ) : (
                <FaMoon className="text-white text-xl" />
            )}
        </button>
    );
};

export default ThemeSwitcher;
