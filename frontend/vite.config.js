import { defineConfig } from 'vite'
import { cpSync } from 'node:fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: '.',
  plugins: [{
    name: 'copy-classic-scripts',
    apply: 'build',
    closeBundle() {
      cpSync(resolve(__dirname, 'js'), resolve(__dirname, '../src/main/resources/static/js'), { recursive: true })
    },
  }],
  build: {
    outDir: resolve(__dirname, '../src/main/resources/static'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        login: resolve(__dirname, 'login.html'),
        index: resolve(__dirname, 'index.html'),
        rooms: resolve(__dirname, 'rooms.html'),
        guests: resolve(__dirname, 'guests.html'),
        booking: resolve(__dirname, 'booking.html'),
        bookings: resolve(__dirname, 'bookings.html'),
        availability: resolve(__dirname, 'availability.html'),
        report: resolve(__dirname, 'report.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: '/login.html',
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
