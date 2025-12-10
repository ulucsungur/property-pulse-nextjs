/** @type {import('next').NextConfig} */
const nextConfig = {
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
            }
        ],
    },
    serverExternalPackages: ['mongoose'],
};

export default nextConfig;



// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//         remotePatterns: [
//             {
//                 protocol: 'https',
//                 hostname: 'lh3.googleusercontent.com',
//                 port: '',
//                 pathname: '**',
//             },
//             {
//                 protocol: 'https',
//                 hostname: 'avatars.githubusercontent.com',
//                 pathname: '**',
//             },
//             {
//                 protocol: 'https',
//                 hostname: 'res.cloudinary.com',
//                 pathname: '**',
//             }
//         ],
//     },
// };

// export default nextConfig;
