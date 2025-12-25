import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    experimental: {
        serverActions: {
            bodySizeLimit: '5mb', // Limiti 5MB'a çıkardık. İhtiyaca göre '10mb' yapabilirsiniz.
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'maps.googleapis.com',
            },
        ],
    },
    serverExternalPackages: ['mongoose'],
};

// Config'i next-intl ile sarmalıyoruz
export default withNextIntl(nextConfig);
