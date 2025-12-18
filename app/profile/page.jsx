'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import profileDefault from "@/assets/images/profile.png";
import { FaEdit, FaTrash, FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";

const ProfilePage = () => {
    const { data: session, update: updateSession } = useSession();

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        surname: "",
        email: "",
        phone: "",
        country: "",
        dateOfBirth: "",
        image: ""
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!session?.user?.id) return;

            try {
                const userRes = await fetch('/api/profile');
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setFormData({
                        username: userData.username || "",
                        surname: userData.surname || "",
                        email: userData.email || "",
                        phone: userData.phone || "",
                        country: userData.country || "",
                        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : "",
                        image: userData.image || profileDefault
                    });
                }

                const propRes = await fetch(`/api/properties/user/${session.user.id}`);
                if (propRes.ok) {
                    const propData = await propRes.json();
                    setProperties(propData);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (session?.user?.id) fetchData();
    }, [session]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        const data = new FormData();
        data.append("username", formData.username);
        data.append("surname", formData.surname);
        data.append("phone", formData.phone);
        data.append("country", formData.country);
        data.append("dateOfBirth", formData.dateOfBirth);
        if (imageFile) {
            data.append("image", imageFile);
        }

        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                body: data
            });

            if (res.ok) {
                const updatedUser = await res.json();
                toast.success("Profil güncellendi!");
                setIsEditing(false);

                await updateSession({
                    ...session,
                    user: {
                        ...session.user,
                        name: formData.username,
                        image: updatedUser.user.image
                    }
                });

                if (updatedUser.user.image) {
                    setFormData(prev => ({ ...prev, image: updatedUser.user.image }));
                    setPreviewImage(null);
                }

            } else {
                toast.error("Güncelleme başarısız.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Bir hata oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteProperty = async (propertyId) => {
        if (!window.confirm("Bu ilanı silmek istediğinize emin misiniz?")) return;
        try {
            const res = await fetch(`/api/properties/${propertyId}`, { method: "DELETE" });
            if (res.status === 200) {
                setProperties((prev) => prev.filter((p) => p._id !== propertyId));
                toast.success("İlan başarıyla silindi");
            } else {
                toast.error("Silme işlemi başarısız");
            }
        } catch (error) {
            toast.error("Bir hata oluştu");
        }
    };
    const displayImage = previewImage ||
        (formData.image && formData.image.startsWith('http') ? formData.image : profileDefault);

    return (
        <section className="bg-blue-50 min-h-screen">
            <div className="container m-auto py-10 px-4">
                <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border">
                    <h1 className="text-3xl font-bold mb-8 text-gray-800">Hesabım</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                        {/* --- SOL TARA: PROFİL KARTI --- */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center sticky top-24">

                                {/* DÜZELTME: relative ve sizes eklendi */}
                                <div className="relative w-36 h-36 mx-auto mb-4 group">
                                    <Image
                                        src={displayImage}
                                        alt="User"
                                        fill
                                        className="rounded-full object-cover border-4 border-white shadow-md"
                                        sizes="(max-width: 768px) 100vw, 150px"
                                        priority
                                    />
                                    {isEditing && (
                                        <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity text-white">
                                            <FaCamera size={24} />
                                            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                        </label>
                                    )}
                                </div>

                                {!isEditing ? (
                                    <>
                                        <h2 className="text-2xl font-bold text-gray-800">{formData.username} {formData.surname}</h2>
                                        <p className="text-gray-500 mb-1">{formData.email}</p>
                                        {formData.country && <p className="text-sm text-gray-400 mb-4">{formData.country}</p>}

                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition shadow-md flex items-center justify-center gap-2"
                                        >
                                            <FaEdit /> Profili Düzenle
                                        </button>
                                    </>
                                ) : (
                                    <form onSubmit={handleSubmit} className="text-left space-y-3">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Ad</label>
                                            <input name="username" type="text" value={formData.username} onChange={handleChange} className="w-full border rounded p-2 text-sm" required />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Soyad</label>
                                            <input name="surname" type="text" value={formData.surname} onChange={handleChange} className="w-full border rounded p-2 text-sm" placeholder="Soyadınız" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Telefon</label>
                                            <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="w-full border rounded p-2 text-sm" placeholder="555-555-5555" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Ülke</label>
                                            <input name="country" type="text" value={formData.country} onChange={handleChange} className="w-full border rounded p-2 text-sm" placeholder="Türkiye" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase">Doğum Tarihi</label>
                                            <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} className="w-full border rounded p-2 text-sm" />
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <button type="submit" disabled={isSaving} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-md text-sm font-bold transition">
                                                {isSaving ? "..." : "Kaydet"}
                                            </button>
                                            <button type="button" onClick={() => { setIsEditing(false); setPreviewImage(null); }} className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-md text-sm font-bold transition">
                                                İptal
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* --- SAĞ TARAF: İLANLARIM --- */}
                        <div className="lg:col-span-3">
                            <h2 className="text-2xl font-bold mb-6 border-b pb-2">İlanlarım</h2>

                            {!loading && properties.length === 0 && (
                                <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
                                    <p className="text-gray-500 mb-4">Henüz hiç ilan yayınlamadınız.</p>
                                    <Link href="/properties/add" className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition">
                                        İlk İlanını Ekle
                                    </Link>
                                </div>
                            )}

                            {loading ? (
                                <p className="text-center text-gray-500">Yükleniyor...</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {properties.map((property, index) => (
                                        <div key={property._id} className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 border border-gray-100 hover:shadow-md transition">
                                            {/* Resim */}

                                            <Link
                                                href={`/properties/${property._id}`}
                                                className="relative w-full md:w-48 h-32 flex-shrink-0 block"
                                            >
                                                <Image
                                                    src={property.images[0]}
                                                    alt={property.name}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                    sizes="(max-width: 768px) 100vw, 200px"
                                                    priority={index === 0}
                                                />
                                            </Link>

                                            <div className="flex-1 w-full text-center md:text-left">
                                                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">{property.type}</div>
                                                <Link href={`/properties/${property._id}`} className="font-bold text-xl text-gray-800 hover:text-blue-600 mb-2 block line-clamp-1">
                                                    {property.name}
                                                </Link>
                                                <p className="text-gray-500 text-sm">
                                                    <i className="fa-solid fa-location-dot mr-1"></i>
                                                    {property.location.street}, {property.location.city}
                                                </p>
                                            </div>

                                            <div className="flex gap-3 w-full md:w-auto justify-center">
                                                <Link
                                                    href={`/properties/${property._id}/edit`}
                                                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition flex items-center gap-2"
                                                >
                                                    <FaEdit /> <span className="hidden md:inline">Düzenle</span>
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteProperty(property._id)}
                                                    className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition flex items-center gap-2"
                                                >
                                                    <FaTrash /> <span className="hidden md:inline">Sil</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProfilePage;
