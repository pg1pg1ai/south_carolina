import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // mapbox-gl: no manual chunk; GettingHere imports it dynamically so it loads on scroll
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('node_modules/react') || id.includes('react-router-dom')) return 'react-vendor';
        },
      },
    },
  },
})
