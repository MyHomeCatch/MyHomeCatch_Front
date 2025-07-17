import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
   server: {
	 proxy: {
		 '/api': {
			 target: 'http://localhost:3000', // json-server
			 changeOrigin: true,
			 rewrite: (path) => path.replace(/^\/api/, ''),
		 },
		},
	 },
})
