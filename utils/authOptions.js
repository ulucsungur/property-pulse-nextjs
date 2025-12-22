import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/config/database";
// import User from "@/models/User";  <-- BU SATIRI SİLDİK (Döngüyü kırmak için)
import bcrypt from "bcryptjs";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                await connectToDatabase();

                // DÖNGÜYÜ KIRAN HAMLE: User modelini burada import ediyoruz
                const User = (await import("@/models/User")).default;

                // Kullanıcıyı bul
                const user = await User.findOne({ email: credentials.email }).select("+password");

                if (!user) {
                    throw new Error("Kullanıcı bulunamadı.");
                }

                if (!user.password) {
                    throw new Error("Lütfen Google veya GitHub ile giriş yapınız.");
                }

                const isMatch = await bcrypt.compare(credentials.password, user.password);

                if (!isMatch) {
                    throw new Error("Şifre hatalı.");
                }

                return user;
            }
        })
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async signIn({ user, account, profile }) {
            if (account.provider === 'google' || account.provider === 'github') {
                await connectToDatabase();

                // DÖNGÜYÜ KIRAN HAMLE: User modelini burada import ediyoruz
                const User = (await import("@/models/User")).default;

                const userExists = await User.findOne({ email: user.email });

                if (!userExists) {
                    const username = profile.name.slice(0, 20).toLowerCase();
                    const newUser = await User.create({
                        email: user.email,
                        username,
                        image: profile.picture,
                    });
                    user.id = newUser._id.toString();
                } else {
                    user.id = userExists._id.toString();
                }
            }
            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.userId = user.id;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.userId;
            }
            return session;
        },
    },
};
// import GoogleProvider from "next-auth/providers/google";
// import GitHubProvider from "next-auth/providers/github";
// import CredentialsProvider from "next-auth/providers/credentials"; // YENİ IMPORT
// import connectToDatabase from "@/config/database";
// //import User from "@/models/User";
// import bcrypt from "bcryptjs"; // YENİ IMPORT

// export const authOptions = {
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         }),

//         GitHubProvider({
//             clientId: process.env.GITHUB_ID,
//             clientSecret: process.env.GITHUB_SECRET,
//         }),

//         // --- YENİ EKLENEN PROVIDER: EMAIL/ŞİFRE GİRİŞİ ---
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 email: { label: "Email", type: "email" },
//                 password: { label: "Password", type: "password" }
//             },
//             async authorize(credentials) {
//                 await connectToDatabase();

//                 // Kullanıcıyı bul (Şifresiyle birlikte çekmek için .select('+password'))
//                 const user = await User.findOne({ email: credentials.email }).select("+password");

//                 if (!user) {
//                     throw new Error("Kullanıcı bulunamadı.");
//                 }

//                 // Eğer kullanıcının şifresi yoksa (Google ile kayıt olmuşsa)
//                 if (!user.password) {
//                     throw new Error("Lütfen Google veya GitHub ile giriş yapınız.");
//                 }

//                 // Şifre eşleşiyor mu?
//                 const isMatch = await bcrypt.compare(credentials.password, user.password);

//                 if (!isMatch) {
//                     throw new Error("Şifre hatalı.");
//                 }

//                 // Her şey tamamsa kullanıcıyı döndür
//                 return user;
//             }
//         })
//         // ------------------------------------------------
//     ],

//     // JWT stratejisi kullanıyoruz (Credentials auth için zorunludur)
//     session: {
//         strategy: "jwt",
//     },

//     callbacks: {
//         // 1. Giriş yapıldığında çalışır
//         async signIn({ user, account, profile }) {
//             // Sadece Google/GitHub girişlerinde veritabanına kayıt/kontrol yaparız
//             // Credentials girişinde zaten authorize fonksiyonu kontrolü yaptı.
//             if (account.provider === 'google' || account.provider === 'github') {
//                 await connectToDatabase();
//                 const userExists = await User.findOne({ email: user.email });

//                 if (!userExists) {
//                     const username = profile.name.slice(0, 20).toLowerCase();
//                     const newUser = await User.create({
//                         email: user.email,
//                         username,
//                         image: profile.picture,
//                     });
//                     user.id = newUser._id.toString();
//                 } else {
//                     user.id = userExists._id.toString();
//                 }
//             }
//             return true;
//         },

//         // 2. JWT token oluşturulurken
//         async jwt({ token, user }) {
//             if (user) {
//                 token.userId = user.id;
//             }
//             return token;
//         },

//         // 3. Session oluşturulurken
//         async session({ session, token }) {
//             if (session.user) {
//                 session.user.id = token.userId;
//             }
//             return session;
//         },
//     },
// };
