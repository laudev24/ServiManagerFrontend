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
        name: 'Mi PWA React',
        short_name: 'PWAReact',
        description: 'Mi Progressive Web App con React y Vite',
        theme_color: '#ffffff',
        icons: [],
      },
  })],
})
