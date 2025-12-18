import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials"; // YENİ IMPORT
import connectToDatabase from "@/config/database";
import User from "@/models/User";
import bcrypt from "bcryptjs"; // YENİ IMPORT

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

        // --- YENİ EKLENEN PROVIDER: EMAIL/ŞİFRE GİRİŞİ ---
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                await connectToDatabase();

                // Kullanıcıyı bul (Şifresiyle birlikte çekmek için .select('+password'))
                const user = await User.findOne({ email: credentials.email }).select("+password");

                if (!user) {
                    throw new Error("Kullanıcı bulunamadı.");
                }

                // Eğer kullanıcının şifresi yoksa (Google ile kayıt olmuşsa)
                if (!user.password) {
                    throw new Error("Lütfen Google veya GitHub ile giriş yapınız.");
                }

                // Şifre eşleşiyor mu?
                const isMatch = await bcrypt.compare(credentials.password, user.password);

                if (!isMatch) {
                    throw new Error("Şifre hatalı.");
                }

                // Her şey tamamsa kullanıcıyı döndür
                return user;
            }
        })
        // ------------------------------------------------
    ],

    // JWT stratejisi kullanıyoruz (Credentials auth için zorunludur)
    session: {
        strategy: "jwt",
    },

    callbacks: {
        // 1. Giriş yapıldığında çalışır
        async signIn({ user, account, profile }) {
            // Sadece Google/GitHub girişlerinde veritabanına kayıt/kontrol yaparız
            // Credentials girişinde zaten authorize fonksiyonu kontrolü yaptı.
            if (account.provider === 'google' || account.provider === 'github') {
                await connectToDatabase();
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

        // 2. JWT token oluşturulurken
        async jwt({ token, user }) {
            if (user) {
                token.userId = user.id;
            }
            return token;
        },

        // 3. Session oluşturulurken
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
// import connectToDatabase from "@/config/database";
// import User from "@/models/User";

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
//     ],

//     callbacks: {
//         async jwt({ token, account, profile }) {
//             // First time login
//             if (account && profile) {
//                 await connectToDatabase();

//                 let existingUser = await User.findOne({ email: profile.email });

//                 if (!existingUser) {
//                     const username = profile.name
//                         .split(" ")
//                         .join("")
//                         .slice(0, 20)
//                         .toLowerCase();

//                     existingUser = await User.create({
//                         email: profile.email,
//                         username,
//                         image: profile.picture,
//                     });
//                 }

//                 token.userId = existingUser._id.toString();
//             }

//             return token;
//         },

//         async session({ session, token }) {
//             session.user.id = token.userId;
//             return session;
//         },
//     },
// };


// // import GoogleProvider from "next-auth/providers/google";
// // import GitHubProvider from "next-auth/providers/github";
// // import connectToDatabase from "@/config/database";
// // import User from "@/models/User";

// // export const authOptions = {
// //     providers: [
// //         GoogleProvider({
// //             clientId: process.env.GOOGLE_CLIENT_ID,
// //             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// //             authorization: {
// //                 params: {
// //                     prompt: "consent",
// //                     access_type: "offline",
// //                     response_type: "code",
// //                 },
// //             },
// //         }),

// //         GitHubProvider({
// //             clientId: process.env.GITHUB_ID,
// //             clientSecret: process.env.GITHUB_SECRET,
// //         }),
// //     ],

// //     session: {
// //         strategy: "jwt", // Daha hızlı – Vercel için ideal
// //     },

// //     callbacks: {
// //         // 🔥 1) Kullanıcı giriş yaptığında çalışır
// //         async signIn({ user }) {
// //             await connectToDatabase();

// //             let existingUser = await User.findOne({ email: user.email });

// //             if (!existingUser) {
// //                 const username = (user.name || "")
// //                     .slice(0, 20)
// //                     .replace(/\s+/g, "")
// //                     .toLowerCase();

// //                 const newUser = await User.create({
// //                     email: user.email,
// //                     username,
// //                     image: user.image,
// //                 });

// //                 user.id = newUser._id.toString();
// //             } else {
// //                 user.id = existingUser._id.toString();
// //             }

// //             return true;
// //         },

// //         // 🔥 2) JWT token içini dolduruyoruz (DB sorgusu YOK)
// //         async jwt({ token, user }) {
// //             if (user) {
// //                 token.id = user.id;
// //             }
// //             return token;
// //         },

// //         // 🔥 3) Session’a user.id ekleniyor (DB sorgusu YOK)
// //         async session({ session, token }) {
// //             if (token?.id) {
// //                 session.user.id = token.id;
// //             }
// //             return session;
// //         },
// //     },
// // };



// // import GoogleProvider from "next-auth/providers/google";
// // import GitHubProvider from "next-auth/providers/github";
// // import connectToDatabase from "@/config/database";
// // import User from "@/models/User";

// // //console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
// // export const authOptions = {
// //     providers: [
// //         GoogleProvider({
// //             clientId: process.env.GOOGLE_CLIENT_ID,
// //             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// //             authorization: {
// //                 params: {
// //                     prompt: "consent",
// //                     access_type: "offline",
// //                     response_type: "code"
// //                 }
// //             },
// //         }),
// //         // ...add more providers here
// //         GitHubProvider({
// //             clientId: process.env.GITHUB_ID,
// //             clientSecret: process.env.GITHUB_SECRET,
// //         }),

// //     ],
// //     callbacks: {
// //         //Invoked on successful sign in
// //         async signIn({ profile }) {
// //             // 1. Connect to DB
// //             await connectToDatabase();

// //             // 2. Check if user exists
// //             const userExists = await User.findOne({ email: profile.email });
// //             // 3. If not, create a new user
// //             if (!userExists) {
// //                 //Truncate name and make lowercase for username
// //                 const username = profile.name.slice(0, 20).replace(" ", "").toLowerCase();
// //                 await User.create({
// //                     email: profile.email,
// //                     username,
// //                     image: profile.picture
// //                 });
// //             }
// //             return true; // Allow sign in
// //         },
// //         // Session callback function that modifies the session object
// //         async session({ session }) {
// //             // 1. Get the user from the database if needed
// //             const user = await User.findOne({ email: session.user.email });
// //             // 2. assign user id to session object
// //             session.user.id = user._id.toString();
// //             // 3. return session;
// //             return session;
// //         }
// //     },
// // };
