import { defineConfig, Plugin, ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'http';

// Plugin Vite customizado para mockar um Backend e salvar no disco (public/database.json)
const localDatabasePlugin = (): Plugin => {
  return {
    name: 'local-database-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        // Intercepta requisições para a API de mock
        if (req.url === '/api/database') {
          const dbPath = path.resolve(process.cwd(), 'public/database.json');
          
          if (req.method === 'GET') {
            fs.readFile(dbPath, 'utf-8', (err: NodeJS.ErrnoException | null, data: string) => {
              if (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Erro ao ler o arquivo.' }));
                return;
              }
              res.setHeader('Content-Type', 'application/json');
              res.end(data || '[]');
            });
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: Buffer) => {
              body += chunk.toString();
            });
            req.on('end', () => {
              fs.writeFile(dbPath, body, (err: NodeJS.ErrnoException | null) => {
                if (err) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Erro ao escrever no arquivo.' }));
                  return;
                }
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true }));
              });
            });
            return;
          }
        }
        next();
      });
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    localDatabasePlugin(), // Ativa a nossa mini-api
  ],
  server: {
    port: 3000,
    host: true,
    allowedHosts: true, // Libera conexões públicas via ngrok e túneis
    watch: {
      ignored: ['**/public/database.json'], // Evita reload infinito ao salvar os dados
    },
  },
});
