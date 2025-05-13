import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` (dev/prod)
  const env = loadEnv(mode, process.cwd());
  return {
    // Your config
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_GMAPS_API_KEY),
    },
    plugins: [react()],
  };
});