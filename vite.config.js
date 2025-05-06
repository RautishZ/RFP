import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'generate-spa-redirect',
      closeBundle() {
        // Create a _redirects file in the dist folder (Vercel will use this)
        fs.writeFileSync(
          resolve(__dirname, 'dist', '_redirects'),
          '/* /index.html 200'
        );
        
        // For Vercel specific SPA fallback
        const vercelConfig = {
          "rewrites": [
            { "source": "/(.*)", "destination": "/index.html" }
          ]
        };
        fs.writeFileSync(
          resolve(__dirname, 'dist', 'vercel.json'),
          JSON.stringify(vercelConfig, null, 2)
        );
      }
    }
  ],
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
