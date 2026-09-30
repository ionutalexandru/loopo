import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Loopo - Knitting & crocheting perfectly organized',
        short_name: 'Loopo',
        description: 'Track stitches, rows, and pattern repeats effortlessly.',
        start_url: '/',
        display: 'standalone',
        background_color: '#FDFBF7',
        theme_color: '#FF5A5F',
        icons: [
            {
                src: '/favicon.svg',
                sizes: '144x144',
                type: 'image/svg+xml',
            },
            {
                src: '/web-app-manifest-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/web-app-manifest-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
        screenshots: [
            {
                src: 'screenshot_1.png',
                sizes: '1312x1422',
                type: 'image/png',
            },
            {
                src: 'screenshot_1.png',
                sizes: '1312x1422',
                type: 'image/png',
                form_factor: 'wide',
            },
        ],
    };
}
