'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Şifreler eşleşmiyor!");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                toast.error(data.message || "Kayıt olurken bir hata oluştu.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-blue-50 dark:bg-gray-700 min-h-screen flex-grow">
            <div className="container m-auto max-w-2xl py-24">
                <div className="bg-white dark:bg-gray-800 px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-3xl text-center font-bold mb-6 bg-white dark:bg-gray-800">
                            Kayıt Ol
                        </h2>

                        {/* Kullanıcı Adı */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">
                                Kullanıcı Adı
                            </label>
                            <input
                                type="text"
                                className="border rounded w-full py-2 px-3 focus:outline-blue-500"
                                placeholder="Adınız Soyadınız"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                className="border rounded w-full py-2 px-3 focus:outline-blue-500"
                                placeholder="Email Adresiniz"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Şifre */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">
                                Şifre
                            </label>
                            <input
                                type="password"
                                className="border rounded w-full py-2 px-3 focus:outline-blue-500"
                                placeholder="Şifreniz"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                required
                            />
                        </div>

                        {/* Şifre Tekrar */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2">
                                Şifre Tekrar
                            </label>
                            <input
                                type="password"
                                className="border rounded w-full py-2 px-3 focus:outline-blue-500"
                                placeholder="Şifrenizi doğrulayın"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Kayıt Butonu */}
                        <div className="mb-4">
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Kaydediliyor..." : "Kayıt Ol"}
                            </button>
                        </div>
                    </form>

                    {/* --- SOSYAL GİRİŞ AYIRACI --- */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <p className="mx-4 text-gray-500 font-bold">VEYA</p>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* --- SOSYAL BUTONLAR --- */}
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                            className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full transition duration-300"
                        >
                            <FaGoogle className="mr-2" /> Register with Google
                        </button>
                        <button
                            onClick={() => signIn("github", { callbackUrl: "/" })}
                            className="flex items-center justify-center bg-gray-900 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-full w-full transition duration-300"
                        >
                            <FaGithub className="mr-2" /> Register with GitHub
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p>
                            Zaten hesabınız var mı?{" "}
                            <Link href="/login" className="text-blue-600 hover:underline">
                                Giriş Yap
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RegisterPage;
