import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 5000,
    host: '0.0.0.0',
    watch: {
        usePolling: true,
    },
    proxy: {
        '/api': {
            target: 'http://localhost:5010',
            changeOrigin: true,
            rewrite: path => path.replace(/^\/api/, '')
        },
    },
  }

  
})
