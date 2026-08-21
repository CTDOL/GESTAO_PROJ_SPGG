import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: true, // Libera conexões públicas via ngrok e túneis
    watch: {
      ignored: ['**/public/database.sqlite'], // Evita reload ao salvar os dados
    },
    proxy: {
      // Backend real (PHP + SQLite) roda separado: php -S localhost:8080 -t public
      // Ver README para instruções de dev.
      '/api.php': 'http://localhost:8080',
    },
  },
});
