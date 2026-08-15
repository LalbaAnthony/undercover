/* eslint-disable no-undef */
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa';
import dotenv from 'dotenv';
import path from 'path';

// Resolve the path to the .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Get the version from package.json
const version = require('./package.json')?.version || '0.0.0';
process.env.VITE_APP_VERSION = version;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: process.env.VITE_APP_NAME,
        short_name: process.env.VITE_APP_SHORT_NAME,
        description: process.env.VITE_APP_DESCRIPTION,
        theme_color: `#${process.env.VITE_APP_THEME_COLOR}`, // we cannot use '#'
        background_color: `#${process.env.VITE_APP_BG_COLOR}`,
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
  define: {
    'process.env': {
      VITE_APP_SHORT_NAME: 'Undercover',
      VITE_APP_NAME: 'Undercover',
      VITE_APP_COMPANY_NAME: 'Undercover',
      VITE_APP_AUTHOR_NAME: 'Anthony Lalba',
      VITE_APP_DESCRIPTION: 'Undercover',
      VITE_APP_THEME_COLOR: '0E133C',
      VITE_APP_BG_COLOR: '0E133C',
      VITE_URL: 'http://localhost:5173',
      VITE_GIT_REPO: 'https://github.com/LalbaAnthony/undercover',
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
