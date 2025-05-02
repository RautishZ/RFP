import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Disable WebSocket for HMR (Hot Module Replacement)
    hmr: false,
    // Use HTTP polling instead of WebSocket
    watch: {
      usePolling: true,
      interval: 1000,
    }
  },
})
