import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/life-in-the-uk-test-pern-app/',
  server: {
    port: 5173,
    proxy: {
      '/auth': {
        //target: 'http://localhost:5000',
        target: 'https://life-in-the-uk-test-pern-app.onrender.com',
        changeOrigin: true,
      },
      '/api': {
        //target: 'http://localhost:5000',
        target: 'https://life-in-the-uk-test-pern-app.onrender.com',
        changeOrigin: true,
      },
    },
  },
});
