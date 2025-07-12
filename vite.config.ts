import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
    target: 'es2022',
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      external: [],
      output: {
        // Ensure web components are properly bundled
        manualChunks: {
          'webc': ['@kern-ux-annex/webc'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
    cors: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
  define: {
    // Set production mode for Lit to avoid dev warnings
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  optimizeDeps: {
    include: ['@kern-ux-annex/webc'],
    // Exclude web components from pre-bundling for better compatibility
    exclude: [],
  },
  esbuild: {
    // Support for custom elements and web components
    target: 'es2022',
    keepNames: true,
  },
});
