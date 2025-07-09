import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { version } from './package.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // cache all the imports
      workbox: {
        globPatterns: ['**/*'],
      },
      // cache all the static assets in the public folder
      includeAssets: ['**/*'],
      manifest: {
        name: 'ZigZag',
        short_name: 'ZigZag',
        icons: [
          {
            src: '/favicon/android-chrome-192x192.png',
            type: 'image/png',
            sizes: '192x192',
          },
          {
            src: '/favicon/android-chrome-512x512.png',
            type: 'image/png',
            sizes: '512x512',
          },
        ],

        scope: '/',
        start_url: '/',
        background_color: '#111111',
        display: 'fullscreen',
        theme_color: '#111111',
        description:
          'Stay on the wall and zigzag as far as you can! Just tap the screen to change the ball’s direction. One wrong move and you’re off the edge! How far can you make it?',
      },
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
});
