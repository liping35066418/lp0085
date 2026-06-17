import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3835,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8835',
        changeOrigin: true,
      },
    },
  },
});
