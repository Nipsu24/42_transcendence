import { defineConfig } from "vite";
import react       from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(), 
		tailwind(), 
	],
	server: {
	  proxy: {
		'/players': {
		  target: 'http://localhost:3001',
		  changeOrigin: true,
		},
	  }
	},
  })



