// vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'; // Asegúrate de que este plugin esté instalado

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', // Asegúrate de que esta ruta sea correcta y el archivo exista
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});