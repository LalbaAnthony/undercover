import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv';
import path from 'path';

// Resolve the path to the .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    'process.env': {
      VITE_SITE_NAME: process.env.VITE_SITE_NAME,
      VITE_COMPANY_NAME: process.env.VITE_COMPANY_NAME,
      VITE_AUTHOR_NAME: process.env.VITE_AUTHOR_NAME,
      VITE_APP_VERSION: process.env.VITE_APP_VERSION,
      VITE_BACKEND_API_URL: process.env.VITE_BACKEND_API_URL,
      VITE_FRONT_URL: process.env.VITE_FRONT_URL,
    }
  },
})
