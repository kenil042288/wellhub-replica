import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production builds are served from GitHub Pages under
// /wellhub-replica/; the dev server stays at the domain root
// so LAN preview URLs keep working.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/wellhub-replica/' : '/',
  plugins: [react()],
}))
