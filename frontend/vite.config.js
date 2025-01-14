import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const isServer = true;
let proxy =  isServer ? "https://mdl.segmentationfault.tech:3001" : "http://localhost:3001"
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: proxy, // Replace with your backend server port
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
