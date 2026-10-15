import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    preview: {
        allowedHosts: ['red-trains-invite.loca.lt'],
    },
    plugins: [
        tailwindcss(),
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: [
                'icon.svg',
                'logo.svg',
                'favicon.ico',
                'apple-touch-icon.png',
            ],
            manifest: {
                name: 'Loopo - Knitting & crocheting perfectly organized',
                short_name: 'Loopo',
                description:
                    'Track stitches, rows, and pattern repeats effortlessly.',
                start_url: '/',
                display: 'standalone',
                background_color: '#FDFBF7',
                theme_color: '#FF5A5F',
                icons: [
                    {
                        src: '/icon.svg',
                        sizes: '144x144',
                        type: 'image/svg+xml',
                        purpose: 'any',
                    },
                    {
                        src: '/web-app-manifest-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                    {
                        src: '/web-app-manifest-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
                navigateFallback: '/index.html',
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
