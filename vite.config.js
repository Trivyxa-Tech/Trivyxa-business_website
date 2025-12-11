import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 🔥 IMPORTANT: Your backend Railway URL
const backendURL = "https://trivyxa-businesswebsitebackend-production.up.railway.app";

export default defineConfig({
  plugins: [react()],

  // LOCAL DEVELOPMENT SETTINGS
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",   // Spring Boot backend (local)
        changeOrigin: true,
        secure: false,
      }
    }
  },

  // PRODUCTION VARIABLE INJECTION (Railway)
  define: {
    __BACKEND_URL__: JSON.stringify(backendURL)
  }
})
