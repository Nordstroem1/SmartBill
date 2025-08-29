import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
const pfxPath = path.resolve(process.cwd(), 'localhost.pfx')
let httpsOptions = true
try {
  if (fs.existsSync(pfxPath)) {
    httpsOptions = {
      pfx: fs.readFileSync(pfxPath),
      passphrase: 'Honda363#!'
    }
  }
} catch {}

export default defineConfig({
  plugins: [react()],
  server: {
    https: httpsOptions,
    host: 'localhost',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://localhost:7094',
        changeOrigin: true,
  secure: false
      }
    }
  }
})
