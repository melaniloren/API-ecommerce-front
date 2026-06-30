import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-i18next'] //Forzamos una única instancia de estos paquetes para evitar problemas de traducción y contexto en React
  }
})