import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` (dev/prod)
  loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
  };
});