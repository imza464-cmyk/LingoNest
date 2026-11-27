import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => ({
  base: './',
  plugins: [react()],
  server: {
    port: 5175,
    strictPort: false,
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: isSsrBuild
      ? undefined
      : {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes('@neon/auth') || id.includes('better-auth')) {
                  return 'vendor-auth';
                }
                if (id.includes('lucide-react')) {
                  return 'vendor-icons';
                }
                if (id.includes('react')) {
                  return 'vendor-react';
                }
              }
              if (id.includes('/src/data/') || id.includes('\\src\\data\\')) {
                return 'curriculum-data';
              }
              return undefined;
            },
          },
        },
  },
}));
