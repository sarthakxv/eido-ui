import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.assisterr.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1/slm'),
        headers: {
          'X-Api-Key': "bGk1-3mKWHJZe4Zl1iPCy6VCz-rh04vyot4OC1PMkyA",
        },
      },
    },
  },
})
