import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Two builds of the same page:
//  - default: web/dist, served by the Node server, which answers questions at /api.
//  - `--mode static`: dist-static/index.html, one file with the whole chatbot inside it (no server, no network). It swaps
//    the page's API module for api-local.ts, which runs the same search in the browser.
export default defineConfig(({ mode }) => {
  const local = mode === 'static'
  return {
    root: 'web',
    plugins: [react(), ...(local ? [viteSingleFile()] : [])],
    resolve: local ? { alias: [{ find: './api', replacement: fileURLToPath(new URL('./web/src/api-local.ts', import.meta.url)) }] } : {},
    build: {
      outDir: local ? '../dist-static' : 'dist',
      emptyOutDir: true,
      ...(local ? { assetsInlineLimit: 100_000_000, cssCodeSplit: false } : {}),
    },
    server: { proxy: { '/api': 'http://127.0.0.1:3000' } },
  }
})
