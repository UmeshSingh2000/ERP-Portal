import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5172, // Replace with your desired port number
    host: true, // Set to true to expose the server on your local network
    hmr: {
      // Configure HMR settings if needed
    },
  },
})
