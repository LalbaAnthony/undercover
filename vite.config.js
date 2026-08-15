/* eslint-disable no-undef */
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa';
import { VITE_APP_NAME, VITE_APP_SHORT_NAME, VITE_APP_DESCRIPTION, VITE_APP_THEME_COLOR, VITE_APP_BG_COLOR } from './config.js';

// Get the version from package.json. Assigning it here, before Vite loads its
// own env, is what exposes it as import.meta.env.VITE_APP_VERSION in the client.
const version = require('./package.json')?.version || '0.0.0';
process.env.VITE_APP_VERSION = version;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: VITE_APP_NAME,
        short_name: VITE_APP_SHORT_NAME,
        description: VITE_APP_DESCRIPTION,
        theme_color: `#${VITE_APP_THEME_COLOR}`, // the constants are stored without '#'
        background_color: `#${VITE_APP_BG_COLOR}`,
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // 0.0.0.0 is required for the port to be reachable from outside the container
    host: true,
    port: 5173,
    // The published port is mapped 1:1 by compose; silently picking another one
    // would break both the HMR websocket and the port mapping.
    strictPort: true,
    watch: {
      // Bind mounts do not propagate inotify events on Docker Desktop
      usePolling: true,
    },
  },
})
