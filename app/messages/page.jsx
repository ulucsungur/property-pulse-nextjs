import connectToDB from '@/config/database';
import Message from '@/models/Message';
import '@/models/Property';
import { convertToSerializableObject } from '@/utils/convertToObject';
import { getUserSession } from '@/utils/getUserSession';
import MessageCard from '@/components/MessageCard';

// Sayfa her açıldığında/yenilendiğinde veritabanından taze veri çekmesini sağlar.
export const dynamic = 'force-dynamic';

const MessagesPage = async () => {
    // 1. Veritabanı Bağlantısı
    await connectToDB();

    // 2. Kullanıcı Oturumu
    const sessionUser = await getUserSession();
    const { userId } = sessionUser || {};

    // -- GİRİŞ YAPILMAMIŞSA --
    if (!userId) {
        return (
            <section className="bg-blue-50 dark:bg-gray-900 min-h-screen">
                <div className="container m-auto py-24 max-w-6xl">
                    <div className="bg-white dark:bg-gray-800 px-6 py-8 mb-4 shadow-md rounded-md border border-gray-200 dark:border-gray-700 m-4 md:m-0">
                        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Your Messages</h1>
                        <p className="text-gray-600 dark:text-gray-300">You must be logged in to view messages.</p>
                    </div>
                </div>
            </section>
        );
    }

    // -- MESAJLARI ÇEK (Tek Sorgu) --
    // lean() kullanmak performansı artırır ve gereksiz Mongoose verilerini temizler
    const readMessages = await Message.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .populate('sender', 'username')
        .populate('property', 'name')
        .lean();

    // -- VERİYİ DÜZENLE --
    // Mongoose nesnelerini React'in anlayacağı düz JSON objesine çeviriyoruz.
    // Bu işlem "Buton çalışmıyor" sorununu çözer çünkü React'e temiz veri gider.
    const messages = readMessages.map((msg) => {
        const serialized = convertToSerializableObject(msg);
        // Ek güvenlik: ID'lerin string olduğundan emin olalım
        serialized._id = serialized._id.toString();
        serialized.sender = serialized.sender ? convertToSerializableObject(serialized.sender) : null;
        serialized.property = serialized.property ? convertToSerializableObject(serialized.property) : null;
        return serialized;
    });

    // Sıralama: Okunmamışlar (read: false) en üstte
    messages.sort((a, b) => {
        if (a.isRead === b.isRead) return 0;
        return a.isRead ? 1 : -1; // Okunmuşlar (true) alta, okunmamışlar (false) üste
    });

    return (
        // -- DARK MODE VE ARKAPLAN DÜZELTMESİ --
        // dark:bg-gray-900 sınıfı tüm sayfa arka planını koyu yapar
        <section className="bg-blue-50 dark:bg-gray-900 min-h-screen">
            <div className="container m-auto py-24 max-w-6xl">

                {/* İç Kutu: dark:bg-gray-800 (Koyu Gri) */}
                <div className="bg-white dark:bg-gray-800 px-6 py-8 mb-4 shadow-md rounded-md border border-gray-200 dark:border-gray-700 m-4 md:m-0">
                    <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Your Messages</h1>

                    <div className="space-y-4">
                        {messages.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-300">You have no messages</p>
                        ) : (
                            messages.map((message) => (
                                <MessageCard key={message._id} message={message} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MessagesPage;

// import connectToDatabase from "@/config/database";
// import Message from "@/models/Message";
// import "@/models/Property";
// import { convertToSerializableObject } from "@/utils/convertToObject";
// import { getUserSession } from "@/utils/getUserSession";
// import MessageCard from "@/components/MessageCard";

// export const dynamic = 'force-dynamic';

// const MessagesPage = async () => {
//     await connectToDatabase();

//     const sessionUser = await getUserSession();

//     if (!sessionUser || !sessionUser.userId) {
//         return <section className="bg-blue-50 dark:bg-gray-900 min-h-screen"></section>;
//     }

//     const { userId } = sessionUser;

//     // populate işleminde veritabanında silinmiş olanlar null dönebilir
//     const messagesDoc = await Message.find({ recipient: userId })
//         .sort({ read: 1, createdAt: -1 })
//         .populate("sender", "username")
//         .populate("property", "name")
//         .lean();

//     const messages = messagesDoc.map((messageDoc) => {
//         // Ana mesajı dönüştür
//         const message = convertToSerializableObject(messageDoc);

//         // Sender (Gönderen) null ise (silinmişse) varsayılan obje ata
//         message.sender = messageDoc.sender
//             ? convertToSerializableObject(messageDoc.sender)
//             : { username: 'Silinmiş Kullanıcı' };

//         // Property (Ev) null ise (silinmişse) varsayılan obje ata
//         message.property = messageDoc.property
//             ? convertToSerializableObject(messageDoc.property)
//             : { name: 'İlan Yayından Kaldırıldı' };

//         return message;
//     });

//     return (
//         <section className="bg-blue-50 dark:bg-gray-900 min-h-screen">
//             <div className="container m-auto py-24 max-w-6xl">
//                 <div className="bg-white dark:bg-gray-800 px-6 py-8 mb-4 shadow-md rounded-md border border-gray-200 dark:border-gray-700 m-4 md:m-0">
//                     <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Your Messages</h1>

//                     <div className="space-y-4">
//                         {messages.length === 0 ? (
//                             <p className="text-gray-500 dark:text-gray-300">You have no messages</p>
//                         ) : (
//                             messages.map((message) => (
//                                 <MessageCard key={message._id} message={message} />
//                             ))
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default MessagesPage;

// export const dynamic = "force-dynamic";

// import connectToDatabase from "@/config/database";
// import Message from "@/models/Message";
// import "@/models/Property";
// import { getUserSession } from "@/utils/getUserSession";
// import MessageCard from "@/components/MessageCard";

// export default async function MessagesPage() {
//     await connectToDatabase();
//     const sessionUser = await getUserSession();

//     if (!sessionUser?.userId) {
//         return <h1 className="text-center mt-10">Please log in.</h1>;
//     }

//     const { userId } = sessionUser;

//     let messages = await Message.find({ recipient: userId })
//         .sort({ createdAt: -1 })
//         .populate("property", "name")
//         .lean();

//     messages = messages.filter((m) => m && m._id);

//     const safeMessages = JSON.parse(JSON.stringify(messages));

//     return (
//         <section className="bg-blue-50">
//             <div className="container m-auto py-24 max-w-6xl">
//                 <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
//                     <h2 className="text-2xl font-bold mb-6 text-center">Your Messages</h2>
//                     <div className="space-y-4">
//                         {safeMessages.length === 0 ? (
//                             <p className="text-center">No messages.</p>
//                         ) : (
//                             safeMessages.map((msg) => (
//                                 <MessageCard key={msg._id} message={msg} />
//                             ))
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }



// import connectToDatabase from "@/config/database";
// import Message from "@/models/Message";
// import "@/models/Property";
// import { getUserSession } from "@/utils/getUserSession";
// import MessageCard from "@/components/MessageCard";

// export default async function MessagesPage() {
//     await connectToDatabase();
//     const sessionUser = await getUserSession();

//     if (!sessionUser?.userId) {
//         return <h1 className="text-center mt-10">Please log in.</h1>;
//     }

//     const { userId } = sessionUser;

//     let messages = await Message.find({ recipient: userId })
//         .sort({ createdAt: -1 })
//         .populate("property", "name")
//         .lean();

//     // Null kayıt varsa dışla
//     messages = messages.filter((m) => m && m._id);

//     // Safe JSON
//     const safeMessages = JSON.parse(JSON.stringify(messages));

//     return (
//         <section className="bg-blue-50">
//             <div className="container m-auto py-24 max-w-6xl">
//                 <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
//                     <h2 className="text-2xl font-bold mb-6 text-center">Your Messages</h2>
//                     <div className="space-y-4">
//                         {safeMessages.length === 0 ? (
//                             <p className="text-center">No messages.</p>
//                         ) : (
//                             safeMessages.map((msg) => (
//                                 <MessageCard key={msg._id} message={msg} />
//                             ))
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// }
