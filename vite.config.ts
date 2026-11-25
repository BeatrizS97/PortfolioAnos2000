import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  // Configuração dos testes (Vitest). jsdom simula o navegador; o setupTests.ts roda antes de cada arquivo de teste.
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setupTests.ts'],
    // Os testes de tela carregam as janelas sob demanda (lazy), então o primeiro carregamento pode demorar.
    testTimeout: 15000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});