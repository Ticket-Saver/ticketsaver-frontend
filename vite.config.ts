import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import Unfonts from 'unplugin-fonts/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Unfonts({
      google: {
        families: [
          {
            name: 'Audiowide',
            styles: 'wght@400'
          },
          {
            name: 'Rajdhani',
            styles: 'wght@400;700'
          },
          {
            name: 'Roboto',
            styles: 'ital,wght@0,400;1,200',
            defer: true
          }
        ]
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 4000, // 4MB
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            '@auth0/auth0-react',
            '@tanstack/react-query'
          ]
        }
      }
    }
  },
  server: {
    host: true,
    // port: Number(process.env.PORT) || 3000
    port: Number(process.env.PORT) || 3000,
    proxy: {
      // Todas las solicitudes que comiencen con /api se redirigirán
      '/api': {
        // target: 'http://127.0.0.1:8123',
        target: 'https://panel.ticketsaver.net/api',
        changeOrigin: true,
        secure: false,
        // Habilitar logging para ver las URLs que se están consultando
        configure: (proxy, options) => {
          proxy.on('error', (err, req) => {
            console.log('🔴 Proxy error:', err.message)
            console.log('🔴 Request URL:', req.url)
            console.log('🔴 Target:', options.target)
          })

          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('🟡 Proxying request:')
            console.log('  - Original URL:', req.url)
            console.log('  - Target URL:', `${options.target}${req.url?.replace('/api', '') || ''}`)
            console.log('  - Method:', req.method)
          })

          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('🟢 Proxy response:')
            console.log('  - Status:', proxyRes.statusCode)
            console.log('  - URL:', req.url)
          })
        },
        // Si tu backend necesita el prefijo /api, comenta la siguiente línea:
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
