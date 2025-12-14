import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Your backend Railway URL (Spring Boot API)
const backendURL = "http://trivyxa-businesswebsitebackend-production.up.railway.app";

export default defineConfig({
  plugins: [react()],

  // Railway deployment needs this to serve the built files correctly
  build: {
    outDir: "dist",
  },

  // Production Backend URL injected into the code
  define: {
    __BACKEND_URL__: JSON.stringify(backendURL),
  }
});
