import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/statools/' : '/',
  
  // Optimize Dependencies - Prevent Spline issues
  optimizeDeps: {
    exclude: ['@splinetool/runtime', '@splinetool/react-spline'],
    include: ['jstat'] // Include other heavy dependencies
  },
  
  // Build Configuration
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['chart.js', 'react-chartjs-2'],
          'spline-vendor': ['@splinetool/runtime', '@splinetool/react-spline']
        }
      }
    },
    // Increase chunk size warning limit for Spline
    chunkSizeWarningLimit: 1500,
    // Ensure source maps for debugging
    sourcemap: process.env.NODE_ENV !== 'production'
  },
  
  // Server Configuration (for local development)
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  
  // Define global constants
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  },
  
  // Resolve aliases (optional but helpful)
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@assets': '/src/assets'
    }
  }
})