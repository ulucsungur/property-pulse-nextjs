'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { FaBookmark } from 'react-icons/fa';
import { useTranslations } from 'next-intl'; // Çeviri kancası
import checkBookmarkStatus from '@/app/actions/checkBookmarkStatus';
import bookmarkProperty from '@/app/actions/bookmarkProperty';

const BookmarkButton = ({ property }) => {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const t = useTranslations('PropertySidebar'); // JSON'dan metinleri çek

    const [isBookmarked, setIsBookmarked] = useState(false);
    const [loading, setLoading] = useState(true);

    // 1. Sayfa Yüklendiğinde Durumu Kontrol Et
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const checkStatus = async () => {
            try {
                const res = await checkBookmarkStatus(property._id);
                if (res.isBookmarked) setIsBookmarked(res.isBookmarked);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false); // Yükleme bitti, butonu göster
            }
        };

        checkStatus();
    }, [property._id, userId]);

    // 2. Tıklama İşlemi
    const handleClick = async () => {
        if (!userId) {
            toast.error('Bookmark işlemi için giriş yapmalısınız.');
            return;
        }

        try {
            const res = await bookmarkProperty(property._id);
            if (res.error) return toast.error(res.error);

            setIsBookmarked(res.isBookmarked);
            toast.success(res.message);
        } catch (error) {
            console.error(error);
            toast.error('Bir hata oluştu');
        }
    };

    // Yükleniyorsa "..." göster
    if (loading) return <p className="text-center text-gray-400">...</p>;

    // Yüklendiyse Butonu Göster
    return isBookmarked ? (
        <button
            onClick={handleClick}
            className="bg-red-500 hover:bg-red-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center gap-2 transition shadow-md"
        >
            <FaBookmark /> {t('removeBookmark')}
        </button>
    ) : (
        <button
            onClick={handleClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center gap-2 transition shadow-md"
        >
            <FaBookmark /> {t('bookmark')}
        </button>
    );
};

export default BookmarkButton;

// 'use client'
// import { useState, useEffect } from "react";
// import bookmarkProperty from "@/app/actions/bookmarkProperty";
// import checkBookmarkStatus from "@/app/actions/checkBookmarkStatus";
// import { toast } from 'react-toastify';
// import { useSession } from "next-auth/react";
// import { FaBookmark } from "react-icons/fa";
// import { set } from "mongoose";

// const BookmarkButton = ({ property }) => {

//     const { data: session } = useSession()
//     const userId = session?.user?.id;

//     const [isBookmarked, setIsBookmarked] = useState(false);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (!userId) {
//             setLoading(false);
//             return;
//         }
//         checkBookmarkStatus(property._id).then((res) => {
//             if (res.error) toast.error(res.error)
//             if (res.isBookmarked) setIsBookmarked(res.isBookmarked);
//             setLoading(false);
//         });
//     }, [property._id, userId, checkBookmarkStatus]);

//     const handleClick = async () => {
//         if (!userId) {
//             toast.error('You need to be signed in to bookmark a listing')
//             return
//         }
//         bookmarkProperty(property._id).then((res) => {
//             if (res.error) return toast.error(res.error);
//             setIsBookmarked(res.isBookmarked);
//             toast.success(res.message)
//         })
//     }

//     if (loading) {
//         return (
//             <button
//                 className="bg-gray-400 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center cursor-not-allowed"
//                 disabled
//             >
//                 <FaBookmark className="mr-2" /> Loading...
//             </button>
//         );
//     }
//     return isBookmarked ? (
//         <button
//             className="bg-red-500 hover:bg-red-600 text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
//             onClick={handleClick}
//         >
//             <FaBookmark className="mr-2" /> Remove Bookmark
//         </button>
//     ) : (<button
//         className="bg-blue-500 hover:bg-blue-600s text-white font-bold w-full py-2 px-4 rounded-full flex items-center justify-center"
//         onClick={handleClick}
//     >
//         <FaBookmark className="mr-2" /> Bookmark Property
//     </button>);
// }
// export default BookmarkButton;
