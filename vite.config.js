/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the site under /statools/; Vercel serves it from the domain root.
  base: process.env.VERCEL ? '/' : '/statools/',
  server: {
    hmr: {
      clientPort: 443
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  define: {
    'global': 'globalThis',
    'process.env': {}
  }
})