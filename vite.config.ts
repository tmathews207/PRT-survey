import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png', 'icon-maskable-512.png'],
      workbox: {
        // Admin dashboard + Excel export are lazy-loaded and only used by the admin,
        // not the respondent-facing survey -- keep them out of the install precache.
        globIgnores: ['**/AdminPage-*.js', '**/xlsx-*.js'],
      },
      manifest: {
        name: 'PRT Survey',
        short_name: 'PRT Survey',
        description: 'Anonymous survey on physical readiness training',
        start_url: '/',
        display: 'standalone',
        background_color: '#1e3a5f',
        theme_color: '#1e3a5f',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
