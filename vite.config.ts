/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
  },
  build: {
    rollupOptions: {
      output: {
        // This helps with organizing chunks
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    // For serving locale files
    fs: {
      allow: ['..']
    }
  }
});
