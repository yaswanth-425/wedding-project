import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const scriptUrl = env.VITE_GOOGLE_SCRIPT_URL || ''
  const scriptPath = scriptUrl ? new URL(scriptUrl).pathname : ''

  return {
    plugins: [react(), TanStackRouterVite()],
    resolve: {
      alias: { '@': '/src' },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.svg', '.jpg', '.png'],
    },
    assetsInclude: ['**/*.svg', '**/*.jpg', '**/*.png'],
    server: {
      proxy: {
        '/api/rsvp': {
          target: 'https://script.google.com',
          changeOrigin: true,
          rewrite: () => scriptPath,
        },
      },
    },
  }
})
