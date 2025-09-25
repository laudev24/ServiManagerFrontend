import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/

export default defineConfig({
  base: '',
  plugins: [
    react(),
  VitePWA({
    registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'ServiManager',
        short_name: 'ServiManager',
        description: 'Proyecto integrador ORT',
        theme_color: '#ffffff',
        icons: [
    // {
    //   "src": "/icons/icon-192.png",
    //   "sizes": "192x192",
    //   "type": "LogoDiegoVidal.jpeg"
    // },
    // {
    //   "src": "/icons/icon-512.png",
    //   "sizes": "512x512",
    //   "type": "LogoDiegoVidal.jpeg"
    // },
    // {
    //   "src": "/icons/maskable-512.png",
    //   "sizes": "512x512",
    //   "type": "LogoDiegoVidal.jpeg",
    //   "purpose": "maskable"
    // }
  ],
      },
  })],
})


