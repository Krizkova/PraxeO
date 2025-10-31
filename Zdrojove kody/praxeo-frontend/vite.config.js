import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
        port: 5173, // výchozí port frontendové aplikace
        proxy: {
            '/api': {
                target: 'http://localhost:8080', // backend běžící na Spring Bootu
                changeOrigin: true,
                secure: false,
            },
        },
    },
})
