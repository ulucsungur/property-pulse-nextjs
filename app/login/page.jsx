'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
// 1. IMPORT ET
import AnimationWrapper from '@/components/AnimationWrapper';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });
            if (res.error) {
                toast.error("Giriş başarısız! Email veya şifre hatalı.");
            } else {
                toast.success("Giriş başarılı! Yönlendiriliyorsunuz...");
                window.location.href = "/";
            }
        } catch (error) {
            console.error(error);
            toast.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-blue-50 dark:bg-gray-900 min-h-screen flex-grow flex items-center justify-center">
            <div className="container m-auto max-w-2xl py-10">
                <AnimationWrapper className="bg-white dark:bg-gray-800 px-6 py-8 mb-4 shadow-xl rounded-xl border dark:border-gray-700 m-4 md:m-0">
                    <form onSubmit={handleSubmit}>
                        {/* Ufak düzeltme: 'mb-6bg-white' hatası giderildi ve dark mode text rengi eklendi */}
                        <h2 className="text-3xl text-center font-bold mb-6 text-gray-800 dark:text-white">
                            Giriş Yap
                        </h2>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                className="border dark:border-gray-600 rounded w-full py-2 px-3 focus:outline-blue-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Email Adresiniz"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Şifre */}
                        <div className="mb-6">
                            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
                                Şifre
                            </label>
                            <input
                                type="password"
                                className="border dark:border-gray-600 rounded w-full py-2 px-3 focus:outline-blue-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Şifreniz"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Giriş Butonu */}
                        <div className="mb-4">
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50 transform hover:scale-[1.02]"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                            </button>
                        </div>
                    </form>

                    {/* --- SOSYAL GİRİŞ AYIRACI --- */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                        <p className="mx-4 text-gray-500 dark:text-gray-400 font-bold">VEYA</p>
                        <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
                    </div>

                    {/* --- SOSYAL BUTONLAR --- */}
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                            className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full transition duration-300 transform hover:scale-[1.02]"
                        >
                            <FaGoogle className="mr-2" /> Login with Google
                        </button>
                        <button
                            onClick={() => signIn("github", { callbackUrl: "/" })}
                            className="flex items-center justify-center bg-gray-900 hover:bg-black text-white font-bold py-2 px-4 rounded-full w-full transition duration-300 transform hover:scale-[1.02]"
                        >
                            <FaGithub className="mr-2" /> Login with GitHub
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Hesabınız yok mu?{" "}
                            <Link href="/register" className="text-blue-600 hover:underline dark:text-blue-400">
                                Kayıt Ol
                            </Link>
                        </p>
                    </div>
                </AnimationWrapper>
            </div>
        </section>
    );
};

export default LoginPage;
