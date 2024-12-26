import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';
export default defineConfig({
  plugins: [react(), 
    sitemap({
      hostname: 'https://readmates.vercel.app',
      dynamicRoutes: [
        '/',
        '/profice',
        '/articles',
        '/create',
      ]
    })
  ],
  build: {
    rollupOptions: {
      input: '/index.html',
    },
  },
  server: {
  },
});
