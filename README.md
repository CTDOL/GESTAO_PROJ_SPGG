<div align="center">
  <img src="https://raw.githubusercontent.com/CTDOL/GESTAO_PROJ_SPGG/main/public/icon.png" alt="ProjTrack Logo" width="120" height="120">
  
  # ProjTrack
  
  **Sistema Integrado de Gestão de Portfólio & Controle de Projetos**

  <p>
    <a href="https://gesprospgg.ctdol.com.br" target="_blank">Acessar Aplicação em Produção 🚀</a>
  </p>

  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
</div>

<br />

O **ProjTrack** é uma solução completa em modelo PWA (Progressive Web App) criada para gerenciar projetos do início ao fim, baseada nas melhores práticas do PMBOK. Conta com uma arquitetura inovadora de "Flat-file" para persistência de dados (sem complexidades de banco de dados tradicionais), focada em extrema velocidade, segurança e design premium.

---

## 🌟 Funcionalidades Principais

- 📊 **Visão de Portfólio (Dashboard):** Visão consolidada de orçamento, prazos e avanço físico de múltiplos projetos simultaneamente.
- 📋 **PMBOK Canvas v5:** Ferramenta interativa de concepção de projeto (Justificativas, Stakeholders, Escopo, Riscos, etc.).
- 📝 **Quadro Kanban:** Gerenciamento ágil de tarefas com colunas interativas e status visual.
- 🕒 **Timesheet & Gantt:** Acompanhamento preciso das horas da equipe de TI e cronograma visual de entregas.
- 📁 **Arquivos e Discussões:** Simulação de repositório de artefatos com controle de logs e aprovações.
- 📱 **PWA Nativo:** Instale o sistema como um app nativo no Desktop ou Celular diretamente pelo navegador.
- 💾 **Persistência Inteligente:** Salvamento ultra-rápido via API PHP local, com fallback automático para LocalStorage.

---

## 🛠️ Arquitetura e Tecnologias

A aplicação possui um Frontend reativo de ponta com um Backend invisível, operando no modelo *Flat-file Database*.

- **Frontend:** React 19, TypeScript, Tailwind CSS, Vite. Ícones gerenciados via `lucide-react`.
- **Backend:** Micro-API nativa em `PHP` (`public/api.php`) que lê/escreve as informações na própria raiz do sistema (`database.json`).
- **Infraestrutura:** Hospedagem em VPS/cPanel com Apache/Nginx e SPA Fallback routing.
- **Integração (CI/CD):** Deploy 100% automatizado via **GitHub Actions** (Workflow FTP ativado ao atualizar a branch `main`).

---

## 🚀 Como rodar localmente

Siga as instruções abaixo para rodar o projeto no seu ambiente de desenvolvimento:

### 1. Clonar o repositório
```bash
git clone https://github.com/CTDOL/GESTAO_PROJ_SPGG.git
cd GESTAO_PROJ_SPGG
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Rodar o servidor de desenvolvimento
```bash
npm run dev
```

> **Aviso de Ambiente de Dev:** Ao rodar via Vite localmente (`npm run dev`), o ambiente usará a memória `localStorage` do seu navegador como banco de dados secundário seguro, já que o Vite não interpreta PHP localmente. 

---

## 🔄 Fluxo de Deploy (CI/CD)

Não é necessário realizar envios manuais para a hospedagem. O repositório está vinculado a um arquivo de Workflow (`.github/workflows/deploy.yml`).

Sempre que uma nova *feature* for aprovada e ocorrer um `git push` para a branch principal (`main`), o GitHub Actions assumirá o controle:
1. Fazendo o Checkout e instalando o `npm ci`.
2. Rodando o build de produção hiper-otimizado (`npm run build`).
3. Enviando apenas a pasta final `/dist` de forma silenciosa para o VPS via **FTP**.

---

<div align="center">
  <p>Desenvolvido com 💜 por CTDOL.</p>
</div>
