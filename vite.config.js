import { fileURLToPath, URL as NodeURL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const fromSrc = (path) => fileURLToPath(new NodeURL(`./src/${path}`, import.meta.url))

// The Django backend has no CORS headers configured, so a browser on
// http://localhost:5173 cannot call http://127.0.0.1:8000 directly.
// Instead the app calls "/api/..." on its own origin and Vite forwards
// ("proxies") those requests to the backend origin taken from VITE_API_URL.
// See src/shared/lib/apiClient.js.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = new URL(env.VITE_API_URL || 'http://127.0.0.1:8000/api')

  const proxy = {
    [apiUrl.pathname]: { target: apiUrl.origin, changeOrigin: true },
    '/media': { target: apiUrl.origin, changeOrigin: true },
  }

  return {
    plugins: [react(), tailwindcss()],
    // Path aliases, so imports read "@shared/utils/format" instead of "../../../utils/format".
    // Keep jsconfig.json in sync so editors resolve them too.
    resolve: {
      alias: {
        '@app': fromSrc('app'),
        '@features': fromSrc('features'),
        '@shared': fromSrc('shared'),
      },
    },
    server: { port: 5173, proxy },
    preview: { port: 4173, proxy },
  }
})
