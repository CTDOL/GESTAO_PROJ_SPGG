# Guia do Desenvolvedor

Este documento descreve como configurar, rodar e realizar o build do projeto MATCH em ambiente de desenvolvimento.

## 🚀 Pré-requisitos

*   Node.js (versão 24+ recomendada, preferencialmente gerido via NVM)
*   NPM (Node Package Manager)
*   Terminal (Zsh/Bash)

## 📦 Instalação

Na raiz do projeto, instale as dependências:

```bash
npm install
```

## 💻 Scripts Disponíveis (`package.json`)

*   **`npm run dev`**: Inicia o servidor de desenvolvimento Vite com Hot Module Replacement (HMR). O projeto ficará acessível na porta `3000`. 
*   **`npm run build`**: Executa o compilador do TypeScript (`tsc`) para checagem de tipos e, em seguida, realiza o build de produção (`vite build`). O código otimizado será gerado na pasta `/dist`.
*   **`npm run preview`**: Inicia um servidor web local para visualizar o build de produção gerado na pasta `/dist`.
*   **`npm run tunnel`**: Inicia uma sessão do `ngrok` expondo a porta `3000` para a internet (útil para testes em PWA e mobile).

## 🌍 Acesso Externo e PWA (Ngrok)

Para testar o aplicativo como PWA em smartphones ou compartilhar um ambiente temporário de homologação, utilize o script de túnel:

1. Inicie o projeto normalmente em um terminal:
   ```bash
   npm run dev
   ```

2. Abra um **segundo terminal** e certifique-se de que o Node.js está no PATH (se usar NVM). Exemplo:
   ```bash
   export PATH=$PATH:/Users/cpinfo/.nvm/versions/node/v24.13.0/bin
   ```

3. Execute o script de túnel:
   ```bash
   npm run tunnel
   ```

4. Copie o endereço `https://<hash>.ngrok-free.dev` e abra no celular.
5. No navegador mobile (Chrome/Safari), utilize a opção "Adicionar à Tela Inicial" para instalar o PWA.

*(Nota: O `vite.config.ts` está configurado com `allowedHosts: true` para não bloquear requisições oriundas do domínio seguro do ngrok).*
