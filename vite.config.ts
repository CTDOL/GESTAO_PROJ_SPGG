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
            fs.stat(dbPath, (err, stats) => {
              if (err) {
                // Se o arquivo não existir, retorna array vazio e mtime 0
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('X-Last-Modified', '0');
                res.end('[]');
                return;
              }
              fs.readFile(dbPath, 'utf-8', (err, data) => {
                if (err) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Erro ao ler o arquivo.' }));
                  return;
                }
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('X-Last-Modified', stats.mtimeMs.toString());
                res.end(data || '[]');
              });
            });
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: Buffer) => {
              body += chunk.toString();
            });
            req.on('end', () => {
              // Verifica a versão
              const clientMtime = req.headers['x-last-modified'];
              if (clientMtime && fs.existsSync(dbPath)) {
                const stats = fs.statSync(dbPath);
                // Dá uma tolerância de 1 segundo (1000ms) para arredondamentos de filesystem
                if (parseFloat(clientMtime as string) < stats.mtimeMs - 1000) {
                  res.statusCode = 409;
                  res.end(JSON.stringify({ error: 'Conflict' }));
                  return;
                }
              }

              fs.writeFile(dbPath, body, (err: NodeJS.ErrnoException | null) => {
                if (err) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Erro ao escrever no arquivo.' }));
                  return;
                }
                res.statusCode = 200;
                res.setHeader('X-Last-Modified', Date.now().toString());
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
