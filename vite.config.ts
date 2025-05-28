import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['swiper-container', 'swiper-slide'].includes(tag),
        }
      }
    }),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        cleanupOutdatedCaches: false
      },
      manifest: {
        name: 'Denis',
        short_name: 'Denis',
        description: 'Un pur moment de plaisir',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icons/logo.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
