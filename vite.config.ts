import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The web page lives in web/ and builds to web/dist, which the server serves. In dev, /api goes to the server on 3000.
export default defineConfig({
  root: 'web',
  plugins: [react()],
  build: { outDir: 'dist', emptyOutDir: true },
  server: { proxy: { '/api': 'http://127.0.0.1:3000' } },
})
