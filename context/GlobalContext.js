'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import getUnreadMessageCount from '@/app/actions/getUnreadMessageCount';

// Create a Global Context
const GlobalContext = createContext();

// Create a Provider component
export function GlobalProvider({ children }) {
    const [unreadCount, setUnreadCount] = useState(0);

    const { data: session } = useSession();

    // Fetch unread message count when session changes
    useEffect(() => {
        async function fetchUnreadCount() {
            if (session?.user) {
                const result = await getUnreadMessageCount();
                // API'den gelen veriyi direkt bas, sayı olduğu için sorun yok
                if (result && result.count) {
                    setUnreadCount(result.count);
                }
            } else {
                setUnreadCount(0);
            }
        }
        fetchUnreadCount();
    }, [session]); // getUnreadMessageCount import olduğu için dependency array'e eklemeye gerek yok

    // --- YENİ EKLENEN KISIM: GÜVENLİ GÜNCELLEME FONKSİYONU ---
    // Bu fonksiyon, setUnreadCount'un yerini alacak ve eksiye düşmeyi engelleyecek.
    const setUnreadCountSafe = (action) => {
        setUnreadCount((prev) => {
            let newValue;

            // Eğer parametre bir fonksiyon ise (örneğin: prev => prev - 1)
            if (typeof action === 'function') {
                newValue = action(prev);
            } else {
                // Eğer direkt sayı ise (örneğin: 5)
                newValue = action;
            }

            // KORUMA: Sonuç 0'dan küçükse 0 yap, değilse aynen bırak
            return newValue < 0 ? 0 : newValue;
        });
    };
    // ---------------------------------------------------------

    return (
        <GlobalContext.Provider value={{
            unreadCount,
            setUnreadCount: setUnreadCountSafe // Dışarıya bizim güvenli fonksiyonumuzu veriyoruz
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export function useGlobalContext() {
    return useContext(GlobalContext);
}
