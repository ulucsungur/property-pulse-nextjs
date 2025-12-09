export const dynamic = "force-dynamic";

import connectToDatabase from "@/config/database";
import Message from "@/models/Message";
import "@/models/Property";
import { getUserSession } from "@/utils/getUserSession";
import MessageCard from "@/components/MessageCard";

export default async function MessagesPage() {
    await connectToDatabase();
    const sessionUser = await getUserSession();

    if (!sessionUser?.userId) {
        return <h1 className="text-center mt-10">Please log in.</h1>;
    }

    const { userId } = sessionUser;

    let messages = await Message.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .populate("property", "name")
        .lean();

    messages = messages.filter((m) => m && m._id);

    const safeMessages = JSON.parse(JSON.stringify(messages));

    return (
        <section className="bg-blue-50">
            <div className="container m-auto py-24 max-w-6xl">
                <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
                    <h2 className="text-2xl font-bold mb-6 text-center">Your Messages</h2>
                    <div className="space-y-4">
                        {safeMessages.length === 0 ? (
                            <p className="text-center">No messages.</p>
                        ) : (
                            safeMessages.map((msg) => (
                                <MessageCard key={msg._id} message={msg} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}



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
