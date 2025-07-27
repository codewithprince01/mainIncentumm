import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',     // Accept connections from any IP
    port: 5173,          // Port number
    strictPort: true,    // Force specific port
    open: true,          // Auto open the browser (optional)
    cors: true,          // Enable CORS
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Backend server address
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
