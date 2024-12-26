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
