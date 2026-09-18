import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => ({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react(), tailwindcss()],
  // Secrets must remain server-side. Do not expose GEMINI_API_KEY through
  // Vite define/import.meta.env or any client bundle.
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
}));
