'use client';
import { useState } from "react";
import { toast } from "react-toastify";
import { useGlobalContext } from "@/context/GlobalContext";
import { FaPaperPlane, FaTimes } from "react-icons/fa";

const MessageCard = ({ message }) => {
    const [isRead, setIsRead] = useState(message.read);
    const [isDeleted, setIsDeleted] = useState(false);

    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isSending, setIsSending] = useState(false);

    const { setUnreadCount } = useGlobalContext();

    // İlan silinmiş mi kontrolü (ID yoksa silinmiştir)
    const isPropertyDeleted = !message.property || !message.property._id;

    // --- OKUNDU/OKUNMADI YAPMA (GARANTİ YÖNTEM) ---
    const handleReadClick = async () => {
        // Şu anki durumun tersini hesapla
        const newStatus = !isRead;

        try {
            const res = await fetch(`/api/messages/${message._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                // Backend'e açıkça ne yapması gerektiğini söylüyoruz
                body: JSON.stringify({ read: newStatus }),
            });

            if (res.status === 200) {
                const data = await res.json();

                // State'i güncelle
                setIsRead(data.read);

                // Sayacı güncelle (Eğer okunduysa sayıyı azalt, okunmadıysa artır)
                setUnreadCount((prevCount) => (data.read ? prevCount - 1 : prevCount + 1));

                // Mesaj
                if (data.read) {
                    toast.success("Mesaj okundu olarak işaretlendi");
                } else {
                    toast.info("Mesaj okunmadı (Yeni) olarak işaretlendi");
                }
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
        }
    };

    // --- SİLME ---
    const handleDeleteClick = async () => {
        if (!window.confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;

        try {
            const res = await fetch(`/api/messages/${message._id}`, {
                method: "DELETE",
            });

            if (res.status === 200) {
                setIsDeleted(true);
                if (!isRead) {
                    setUnreadCount((prev) => prev - 1);
                }
                toast.success("Mesaj Silindi");
            }
        } catch (error) {
            toast.error("Mesaj silinemedi");
        }
    };

    // --- CEVAPLA ---
    const handleReplySubmit = async (e) => {
        e.preventDefault();

        if (!message.property || !message.property._id) {
            toast.error("İlan yayından kalktığı için cevap gönderilemez.");
            return;
        }

        setIsSending(true);

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipient: message.sender._id,
                    property: message.property._id,
                    name: "Ev Sahibi",
                    email: "reply@propertypulse.com",
                    phone: "",
                    body: `[YANIT]: ${replyText}`,
                })
            });

            if (res.status === 200) {
                toast.success("Cevap gönderildi!");
                setIsReplyModalOpen(false);
                setReplyText("");
            } else {
                toast.error("Gönderilemedi.");
            }
        } catch (error) {
            toast.error("Hata oluştu.");
        } finally {
            setIsSending(false);
        }
    };

    if (isDeleted) return null;

    return (
        <>
            <div className={`relative p-4 rounded-md shadow-md border mb-4 transition-colors ${isRead
                ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                : 'bg-blue-50 dark:bg-gray-700 border-blue-200 dark:border-blue-500'
                }`}>

                {/* NEW ETİKETİ */}
                {!isRead && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                        New
                    </div>
                )}

                <h2 className="text-xl mb-2 text-gray-800 dark:text-white">
                    <span className="font-bold">Konu:</span> {message.property?.name || "Bilinmeyen İlan"}
                </h2>

                <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap mb-4">
                    {message.body}
                </p>

                <div className="text-gray-500 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-100 dark:border-gray-700 mb-4">
                    <div className="mb-1"><strong>Gönderen:</strong> {message.sender?.username}</div>
                    <div className="mb-1"><strong>Email:</strong> {message.email}</div>
                    <div className="mb-1"><strong>Telefon:</strong> {message.phone}</div>
                    <div><strong>Date:</strong> {new Date(message.createdAt).toLocaleString()}</div>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={handleReadClick}
                        className={`py-2 px-4 rounded-md text-sm transition-colors shadow-sm text-white ${isRead
                            ? "bg-gray-500 hover:bg-gray-600"
                            : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {isRead ? "Mark As Unread" : "Mark As Read"}
                    </button>

                    <button
                        onClick={() => !isPropertyDeleted && setIsReplyModalOpen(true)}
                        disabled={isPropertyDeleted}
                        className={`py-2 px-4 rounded-md text-sm shadow-sm text-white ${isPropertyDeleted
                            ? "bg-gray-400 cursor-not-allowed" // Silinmişse Gri ve Tıklanmaz
                            : "bg-green-600 hover:bg-green-700" // Normalse Yeşil
                            }`}
                    >
                        {isPropertyDeleted ? "The ad has been deleted." : "Reply"}
                    </button>

                    <button onClick={handleDeleteClick} className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm shadow-sm">
                        Delete
                    </button>
                </div>
            </div>

            {/* MODAL */}
            {isReplyModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Cevap Yaz</h3>
                            <button onClick={() => setIsReplyModalOpen(false)} className="text-gray-500 hover:text-red-500">
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleReplySubmit}>
                            <div className="mb-4">
                                <textarea
                                    className="w-full border rounded p-3 h-32 focus:outline-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    placeholder="Your Messages..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsReplyModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded transition">İptal</button>
                                <button type="submit" disabled={isSending} className="bg-blue-600 text-white py-2 px-4 rounded">
                                    {isSending ? "..." : "Send"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default MessageCard;
