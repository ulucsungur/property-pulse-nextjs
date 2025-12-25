import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "./utils/routing";

// 1. Dil Middleware'ini Hazırla
const intlMiddleware = createMiddleware(routing);

// 2. Auth Middleware'ini Hazırla
// Eğer kullanıcı giriş yapmışsa (authorized), intlMiddleware çalışmaya devam etsin.
const authMiddleware = withAuth(
    function onSuccess(req) {
        return intlMiddleware(req);
    },
    {
        callbacks: {
            // Token varsa (giriş yapılmışsa) true döner
            authorized: ({ token }) => token != null,
        },
        pages: {
            signIn: "/login", // Giriş yapılmamışsa buraya at
        },
    }
);

export default function middleware(req) {
    // 3. Hangi Sayfalar Korumalı? (Senin eski config matcher'ın)
    // Not: Artık URL'ler '/tr/profile' veya '/en/profile' olacağı için
    // sadece '/profile' diye aratmak yetmez, 'pathname' içinde geçiyor mu diye bakacağız.

    const protectedPaths = [
        "/properties/add",
        "/profile",
        "/properties/saved",
        "/messages",
        "/admin" // Admin'i de korumaya almak iyi fikirdir
    ];

    // İstek atılan yol korumalı listesinde var mı?
    const isProtected = protectedPaths.some((path) =>
        req.nextUrl.pathname.includes(path)
    );

    if (isProtected) {
        // Korumalı sayfaysa önce Auth kontrolü yap, sonra dil yönlendirmesi
        return authMiddleware(req);
    } else {
        // Korumalı değilse (Home, Blog vb.) sadece dil yönlendirmesi yap
        return intlMiddleware(req);
    }
}

export const config = {
    // Middleware tüm sayfalarda çalışmalı ki dili ayarlayabilsin.
    // Ancak api, _next ve statik dosyalarda çalışmasın.
    matcher: ['/((?!api|_next|.*\\..*).*)']
};


// export { default } from "next-auth/middleware"
// export const config = { matcher: ["/properties/add", "/profile", "/properties/saved", "/properties/messages"] }
