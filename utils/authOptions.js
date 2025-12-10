import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import connectToDatabase from "@/config/database";
import User from "@/models/User";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),

        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],

    session: {
        strategy: "jwt", // Daha hızlı – Vercel için ideal
    },

    callbacks: {
        // 🔥 1) Kullanıcı giriş yaptığında çalışır
        async signIn({ user }) {
            await connectToDatabase();

            let existingUser = await User.findOne({ email: user.email });

            if (!existingUser) {
                const username = (user.name || "")
                    .slice(0, 20)
                    .replace(/\s+/g, "")
                    .toLowerCase();

                const newUser = await User.create({
                    email: user.email,
                    username,
                    image: user.image,
                });

                user.id = newUser._id.toString();
            } else {
                user.id = existingUser._id.toString();
            }

            return true;
        },

        // 🔥 2) JWT token içini dolduruyoruz (DB sorgusu YOK)
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },

        // 🔥 3) Session’a user.id ekleniyor (DB sorgusu YOK)
        async session({ session, token }) {
            if (token?.id) {
                session.user.id = token.id;
            }
            return session;
        },
    },
};



// import GoogleProvider from "next-auth/providers/google";
// import GitHubProvider from "next-auth/providers/github";
// import connectToDatabase from "@/config/database";
// import User from "@/models/User";

// //console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
// export const authOptions = {
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//             authorization: {
//                 params: {
//                     prompt: "consent",
//                     access_type: "offline",
//                     response_type: "code"
//                 }
//             },
//         }),
//         // ...add more providers here
//         GitHubProvider({
//             clientId: process.env.GITHUB_ID,
//             clientSecret: process.env.GITHUB_SECRET,
//         }),

//     ],
//     callbacks: {
//         //Invoked on successful sign in
//         async signIn({ profile }) {
//             // 1. Connect to DB
//             await connectToDatabase();

//             // 2. Check if user exists
//             const userExists = await User.findOne({ email: profile.email });
//             // 3. If not, create a new user
//             if (!userExists) {
//                 //Truncate name and make lowercase for username
//                 const username = profile.name.slice(0, 20).replace(" ", "").toLowerCase();
//                 await User.create({
//                     email: profile.email,
//                     username,
//                     image: profile.picture
//                 });
//             }
//             return true; // Allow sign in
//         },
//         // Session callback function that modifies the session object
//         async session({ session }) {
//             // 1. Get the user from the database if needed
//             const user = await User.findOne({ email: session.user.email });
//             // 2. assign user id to session object
//             session.user.id = user._id.toString();
//             // 3. return session;
//             return session;
//         }
//     },
// };
