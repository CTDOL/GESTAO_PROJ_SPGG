# Instruções para Configuração do Servidor (Deploy Automatizado)

**Contexto para a IA do Servidor:**
Este projeto (`GESTAO_PROJ_SPGG`) é uma aplicação Frontend construída com **React e Vite**. Já configuramos uma pipeline de CI/CD via GitHub Actions que realiza o build da aplicação (`npm run build`) e faz o envio da pasta `dist/` para o servidor através de **FTP**.

Sua missão como IA responsável pela infraestrutura do servidor é garantir que o ambiente esteja preparado para receber e servir esses arquivos corretamente.

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

*(Nota: O workflow padrão do GitHub Actions está configurado para enviar os arquivos para o caminho `/public_html/`. Se a raiz da aplicação for outra, por favor, avise o usuário humano para atualizar o arquivo `deploy.yml` na linha `server-dir`).*

---

## 2. Configuração do Servidor Web (SPA Fallback)
Como esta é uma Single Page Application (SPA) baseada em Vite/React, o roteamento (React Router) acontece do lado do cliente. Se o servidor for Apache ou Nginx, é necessário configurar um fallback para `index.html` caso o usuário acesse uma rota diretamente (ex: `/dashboard`), evitando o erro "404 Not Found".

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
   ```

**Se o servidor utilizar Nginx:**
1. Adicione a seguinte diretiva no bloco `location /` ou `server`:
   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```

---

## 3. Checklist de Validação
- [ ] Usuário FTP criado com sucesso?
- [ ] Permissões de escrita (`chmod 755` para diretórios, `644` para arquivos) validadas na pasta de destino?
- [ ] Servidor Web configurado para direcionar rotas 404 para `index.html` (SPA fallback)?
- [ ] Credenciais (Server, Username e Password) entregues ao responsável para cadastro no GitHub?

Após realizar essas configurações, o ambiente estará 100% pronto para o CI/CD!
