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
                setUnreadCount(result.count);
            } else {
                setUnreadCount(0);
            }
        }
        fetchUnreadCount();
    }, [getUnreadMessageCount, session]);

    return (
        <GlobalContext.Provider value={{ unreadCount, setUnreadCount }}>
            {children}
        </GlobalContext.Provider>
    );
};

export function useGlobalContext() {
    return useContext(GlobalContext);
}
