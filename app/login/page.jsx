'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // NextAuth'un kendi signIn fonksiyonunu kullanıyoruz
            const res = await signIn("credentials", {
                redirect: false, // Sayfa yenilenmesin, biz yönlendirelim
                email,
                password,
            });
            if (res.error) {
                toast.error("Giriş başarısız! Email veya şifre hatalı.");
            } else {
                toast.success("Giriş başarılı! Yönlendiriliyorsunuz...");
                // router.push("/"); yerine bunu kullanıyoruz:
                window.location.href = "/";
                // -------------------------
            }
        } catch (error) {
            console.error(error);
            toast.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-blue-50 min-h-screen flex-grow">
            <div className="container m-auto max-w-2xl py-24">
                <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-3xl text-center font-bold mb-6 text-gray-800">
                            Giriş Yap
                        </h2>

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
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2">
                                Şifre
                            </label>
                            <input
                                type="password"
                                className="border rounded w-full py-2 px-3 focus:outline-blue-500"
                                placeholder="Şifreniz"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Giriş Butonu */}
                        <div className="mb-4">
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
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
                            <FaGoogle className="mr-2" /> Google ile Giriş Yap
                        </button>
                        <button
                            onClick={() => signIn("github", { callbackUrl: "/" })}
                            className="flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-full w-full transition duration-300"
                        >
                            <FaGithub className="mr-2" /> GitHub ile Giriş Yap
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p>
                            Hesabınız yok mu?{" "}
                            <Link href="/register" className="text-blue-600 hover:underline">
                                Kayıt Ol
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
