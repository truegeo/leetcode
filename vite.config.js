import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// This is the simplest possible config.
// It just tells Vite where your HTML file is.
export default defineConfig({
  root: 'viewer',
  plugins: [react()],
})