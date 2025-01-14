import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env variables regardless of the prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target:
            env.VITE_SERVER === 'true'
              ? env.VITE_API_BASE_URL_REMOTE
              : env.VITE_API_BASE_URL_LOCAL,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
