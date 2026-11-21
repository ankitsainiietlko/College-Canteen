import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The API host used by the dev proxy and by the preview server.
const apiTarget = process.env.VITE_API_URL || 'http://localhost:5000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Dev-only proxy so the browser talks to a same-origin /api and the
    // backend's CORS allow-list is not exercised during local development.
    // Production builds are unaffected.
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
  preview: {
    // `vite preview` stands in for the Express server when the production
    // build is served for browser tests. In production the API and the
    // Socket.IO endpoint are same-origin on the Express process, but here the
    // preview server answers the page, so BOTH endpoints have to be forwarded
    // to the backend — otherwise the WebSocket never connects and the
    // real-time layer silently stays offline.
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/socket.io': {
        target: apiTarget,
        changeOrigin: true,
        ws: true,
      },
    },
  },
})