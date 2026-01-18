import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
//['babel-plugin-react-compiler']
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [],
      },
    }),
    tailwindcss(),
  ],
  base: '/',
});
