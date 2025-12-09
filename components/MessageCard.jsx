"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import markMessageAsRead from "@/app/actions/markMessageAsRead";
import { deleteMessage } from "@/app/actions/deleteMessage";
import { useGlobalContext } from "@/context/GlobalContext";
import replyMessage from "@/app/actions/replyMessage";

const MessageCard = ({ message }) => {
    const [isRead, setIsRead] = useState(message?.isRead ?? false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [loading, setLoading] = useState(false);

    const { setUnreadCount } = useGlobalContext();

    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState("");



    if (isDeleted) return null;
    const handleReadClick = async () => {
        const desired = !isRead; // toggle locally
        setIsRead(desired);
        setLoading(true);

        try {
            const res = await markMessageAsRead(message._id, desired);
            // res is now { success: boolean, isRead?: boolean, error?: string }

            if (!res || res.success === false) {
                // rollback UI
                setIsRead((prev) => !prev);
                toast.error("Server update failed: " + (res?.error || "unknown"));
            } else {
                // server succeeded, use returned value (authoritative)
                setIsRead(res.isRead);
                setUnreadCount((prev) => (res.isRead ? prev - 1 : prev + 1));
                if (res.isRead) toast.success("Marked as New");
                else toast.info("Marked as Read");
            }
        } catch (err) {
            // network / unexpected errors
            setIsRead((prev) => !prev);
            toast.error("Request failed");
            console.error("handleReadClick error:", err);
        } finally {
            setLoading(false);
        }
    };

    // const handleReadClick = async () => {
    //     const desired = !isRead; // toggle

    //     setIsRead(desired);
    //     setLoading(true);

    //     try {
    //         const newVal = await markMessageAsRead(message._id, desired);

    //         setIsRead(newVal);

    //         // unreadCount update
    //         setUnreadCount((prev) => (newVal ? prev - 1 : prev + 1));

    //         if (newVal) toast.success("Marked as Read");
    //         else toast.info("Marked as New");

    //     } catch (err) {
    //         setIsRead((prev) => !prev);
    //         toast.error("Failed to update");
    //     }

    //     setLoading(false);
    // };

    const handleDelete = async () => {
        if (!confirm("Are you sure?")) return;

        const res = await deleteMessage(message._id);

        if (res.success) {
            setIsDeleted(true);
            setUnreadCount((prev) => (isRead ? prev : prev - 1));
            toast.success("Message deleted");
        } else {
            toast.error("Delete failed");
        }
    };

    const handleReply = async () => {
        setLoading(true);

        const res = await replyMessage(message._id, replyText);

        if (res.success) {
            toast.success("Reply sent");
        } else {
            toast.error(res.error || "Reply failed");
        }

        setLoading(false);
        setReplyText("");
        setShowReply(false);
    }

    return (
        <div className={`relative border rounded-md p-4 shadow-md
            ${isRead ? "bg-gray-100" : "bg-white border-blue-300"}`}>

            {!isRead && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    New
                </div>
            )}

            <h2 className="text-xl mb-4">
                <span className="font-bold">Property Inquiry:</span>{" "}
                {message.property?.name ?? "—"}
            </h2>

            <p className="text-gray-700">{message.body}</p>

            <ul className="mt-4 text-sm bg-white/50 p-2 rounded border">
                <li><strong>Reply Email: </strong>{message.email}</li>
                <li><strong>Reply Phone: </strong>{message.phone}</li>
                <li><strong>Received: </strong>{new Date(message.createdAt).toLocaleString()}</li>
            </ul>

            <button
                onClick={handleReadClick}
                disabled={loading}
                className={`mt-4 mr-3 px-4 py-2 rounded-md text-white
                    ${isRead ? "bg-gray-500" : "bg-blue-500"}`}
            >
                {loading ? "..." : (isRead ? "Mark as New" : "Mark as Read")}
            </button>

            <button
                onClick={handleDelete}
                className="mt-4 mr-3  bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
                Delete
            </button>

            <button
                onClick={() => setShowReply((prev) => !prev)}
                className="mt-4 mr-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
                Reply
            </button>
            {showReply && (
                <div className="mt-3">
                    <textarea
                        className="w-full border p-2 rounded"
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your reply..."
                    ></textarea>
                    <button
                        onClick={handleReply}
                        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reply"}
                    </button>

                </div>
            )}
        </div>
    );
};

export default MessageCard;




// "use client";

// import { useState } from "react";
// import { toast } from "react-toastify";
// import markMessageAsRead from "@/app/actions/markMessageAsRead";
// import { deleteMessage } from "@/app/actions/deleteMessage";
// import { useGlobalContext } from "@/context/GlobalContext";

// const MessageCard = ({ message }) => {
//     const [isRead, setIsRead] = useState(message?.isRead ?? false);
//     const [isDeleted, setIsDeleted] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const { setUnreadCount } = useGlobalContext();

//     if (isDeleted) return null;

//     const handleReadClick = async () => {
//         const desired = !isRead;

//         setIsRead(desired);
//         setLoading(true);

//         try {
//             const newVal = await markMessageAsRead(message._id, desired);

//             setIsRead(newVal);
//             setUnreadCount((prev) => (newVal ? prev - 1 : prev + 1));

//             if (newVal) toast.success("Marked as Read");
//             else toast.info("Marked as New");
//         } catch (err) {
//             setIsRead((prev) => !prev);
//             toast.error("Failed to update");
//         }

//         setLoading(false);
//     };

//     const handleDelete = async () => {
//         if (!confirm("Are you sure you want to delete this message?")) return;

//         const res = await deleteMessage(message._id);

//         if (res.success) {
//             toast.success("Message deleted");
//             setIsDeleted(true);
//             setUnreadCount((prev) => (isRead ? prev : prev - 1));
//         } else {
//             toast.error("Delete failed");
//         }
//     };

//     return (
//         <div className={`relative border rounded-md p-4 shadow-md
//             ${isRead ? "bg-gray-100" : "bg-white border-blue-300"}`}>

//             {!isRead && (
//                 <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-md">
//                     New
//                 </div>
//             )}

//             <h2 className="text-xl mb-4">
//                 <span className="font-bold">Property Inquiry:</span>{" "}
//                 {message.property?.name ?? "—"}
//             </h2>

//             <p className="text-gray-700">{message.body}</p>

//             <ul className="mt-4 text-sm bg-white/50 p-2 rounded border">
//                 <li><strong>Reply Email: </strong>{message.email}</li>
//                 <li><strong>Reply Phone: </strong>{message.phone}</li>
//                 <li><strong>Received: </strong>{new Date(message.createdAt).toLocaleString()}</li>
//             </ul>

//             <button
//                 onClick={handleReadClick}
//                 disabled={loading}
//                 className={`mt-4 mr-3 px-4 py-2 rounded-md text-white
//                     ${isRead ? "bg-gray-500" : "bg-blue-500"}`}
//             >
//                 {loading ? "..." : (isRead ? "Mark as New" : "Mark as Read")}
//             </button>

//             <button
//                 onClick={handleDelete}
//                 className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
//             >
//                 Delete
//             </button>
//         </div>
//     );
// };

// export default MessageCard;
