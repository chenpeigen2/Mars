import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Single-file build: all JS, CSS and the 8K texture (base64) inline into one .html
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  server: { host: true, port: 5173 },
  build: {
    target: 'esnext',
    assetsInlineLimit: 100_000_000,
    chunkSizeWarningLimit: 100_000,
    cssCodeSplit: false,
    rollupOptions: {
      input: { mars: 'index.html' },
    },
  },
})
