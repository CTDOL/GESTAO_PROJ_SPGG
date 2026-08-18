# Instruções para Configuração do Servidor (Deploy Automatizado e Concorrência)

**Contexto para a IA do Servidor:**
Este projeto (`GESTAO_PROJ_SPGG`) é uma aplicação Frontend construída com **React e Vite**, utilizando uma arquitetura **Flat-file Database** para MVP. 

Recentemente, a arquitetura foi evoluída para suportar **acessos simultâneos** através de um sistema de **Bloqueio Otimista (Optimistic Locking)** via cabeçalhos HTTP (`X-Last-Modified`) e travas de sistema de arquivos (`flock` com `LOCK_EX` no PHP).

Já configuramos uma pipeline de CI/CD via GitHub Actions que realiza o build da aplicação (`npm run build`) e faz o envio da pasta `dist/` para o servidor através de **FTP**.

Sua missão como IA responsável pela infraestrutura do servidor é garantir que o ambiente esteja preparado para receber e servir esses arquivos corretamente, mantendo a integridade dos dados em acessos simultâneos.

---

## 1. Configuração do Acesso FTP
A pipeline no GitHub depende de credenciais FTP válidas com permissão de escrita no diretório público.

**Ações necessárias:**
1. Crie ou valide uma conta FTP dedicada para o domínio `gesprospgg.ctdol.com.br`.
2. Garanta que o usuário FTP tenha permissão de **leitura e escrita** na pasta pública onde o site será servido (ex: `public_html/` ou `public_html/gesprospgg/`).
3. Forneça ao usuário humano (ou registre em um cofre de senhas) as 3 informações abaixo, pois elas precisam ser cadastradas como **Secrets no GitHub**:
   - `FTP_SERVER`: (Endereço do servidor FTP, ex: ftp.gesprospgg.ctdol.com.br ou IP)
   - `FTP_USERNAME`: (Usuário do FTP)
   - `FTP_PASSWORD`: (Senha do FTP)

*(Nota: O workflow padrão do GitHub Actions está configurado para enviar os arquivos para o caminho `/public_html/`. Se a raiz da aplicação for outra, atualize o arquivo `deploy.yml`).*

---

## 2. Permissões de Arquivo (Crucial para Concorrência)
Devido ao mecanismo de Bloqueio Otimista, o backend PHP precisa de permissões corretas para ler o tempo de modificação (`filemtime`) e aplicar o lock no arquivo (`flock`).

**Ações necessárias:**
1. Certifique-se de que o usuário web (ex: `www-data` no Apache/Nginx) possua permissões de leitura/escrita absolutas sobre o arquivo `database.json`.
2. Recomenda-se permissões `664` ou `666` para o arquivo JSON e `755` para a pasta pai, garantindo que a API não sofra gargalos ao processar solicitações concorrentes.

---

## 3. Configuração do Servidor Web (SPA Fallback e Headers)
Como esta é uma Single Page Application (SPA) baseada em Vite/React, o roteamento (React Router) acontece do lado do cliente. Se o servidor for Apache ou Nginx, é necessário configurar um fallback para `index.html`. 
Além disso, verifique se o servidor não está bloqueando ou cacheando indevidamente o cabeçalho `X-Last-Modified`.

**Se o servidor utilizar Apache (cPanel/Hostinger):**
1. Crie um arquivo `.htaccess` na raiz do diretório público com o seguinte conteúdo:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>

   # Evita cache agressivo no arquivo JSON para garantir o funcionamento do Optimistic Locking
   <Files "database.json">
     FileETag None
     Header unset ETag
     Header set Cache-Control "max-age=0, no-cache, no-store, must-revalidate"
     Header set Pragma "no-cache"
     Header set Expires "Wed, 11 Jan 1984 05:00:00 GMT"
   </Files>
   ```

**Se o servidor utilizar Nginx:**
1. Adicione a seguinte diretiva no bloco `location /` ou `server`:
   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }

   # Prevenção de cache para o DB
   location ~ \.json$ {
       add_header Cache-Control "no-cache, no-store, must-revalidate";
   }
   ```

---

## 4. Checklist de Validação
- [ ] Usuário FTP criado com sucesso e credenciais passadas para o GitHub?
- [ ] Servidor Web configurado para direcionar rotas 404 para `index.html` (SPA fallback)?
- [ ] Regras anti-cache aplicadas ao `database.json` para permitir que o `X-Last-Modified` funcione com precisão milissegundo?
- [ ] Permissões de escrita (`chmod 666` ou superior) testadas no arquivo `database.json`?

Após realizar essas configurações, o ambiente de produção estará 100% preparado para receber acessos concorrentes na infraestrutura do MVP!
