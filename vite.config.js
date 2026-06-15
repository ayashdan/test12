import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192-v2.png', 'icons/icon-512-v2.png'],
      manifest: {
        name: 'BLITZ — NFL Picks',
        short_name: 'BLITZ',
        description: 'Predict every NFL game. Track your picks. Win.',
        theme_color: '#020817',
        background_color: '#020817',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192-v2.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512-v2.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512-v2.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-webfonts', expiration: { maxAgeSeconds: 31536000 } },
          },
        ],
      },
    }),
  ],
})
