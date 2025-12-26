'use client';

import { useState, useEffect, useRef } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { FaChevronDown, FaCheck } from 'react-icons/fa'; // React Icons kullanıyoruz

const CurrencySelect = () => {
    const { currency, switchCurrency } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Sembolleri eşleştirelim
    const symbols = {
        TRY: '₺',
        USD: '$',
        EUR: '€',
        GBP: '£'
    };

    // Dropdown dışına tıklanırsa kapatma mantığı
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (code) => {
        switchCurrency(code);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* --- Tetikleyici Buton --- */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="
          flex items-center justify-between gap-2 
          w-24 px-3 py-1.5 
          bg-white dark:bg-gray-800 
          border border-gray-300 dark:border-gray-600 
          rounded-md shadow-sm 
          text-sm font-medium text-gray-700 dark:text-gray-200 
          hover:bg-gray-50 dark:hover:bg-gray-700 
          focus:outline-none transition-colors
        "
            >
                <span>
                    {symbols[currency]} {currency}
                </span>
                <FaChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* --- Açılır Menü (Dropdown) --- */}
            {isOpen && (
                <div className="
          absolute right-0 mt-2 w-32 
          bg-white dark:bg-gray-800 
          border border-gray-200 dark:border-gray-700 
          rounded-md shadow-lg 
          z-50 overflow-hidden
          animate-in fade-in zoom-in-95 duration-100
        ">
                    <div className="py-1">
                        {['TRY', 'USD', 'EUR', 'GBP'].map((code) => (
                            <button
                                key={code}
                                onClick={() => handleSelect(code)}
                                className={`
                  w-full text-left px-4 py-2 text-sm flex items-center justify-between
                  ${currency === code
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
                            >
                                <span>{symbols[code]} {code}</span>
                                {currency === code && <FaCheck className="w-3 h-3" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrencySelect;
