# Arquitetura e Tecnologia

## 🛠️ Stack Tecnológico

O ProjTrack foi desenvolvido como um MVP robusto utilizando tecnologias modernas do ecossistema front-end.

*   **Core:** React.js (com Functional Components e Hooks)
*   **Linguagem:** TypeScript (tipagem estática para maior segurança e previsibilidade)
*   **Estilização:** Tailwind CSS (utility-first CSS) + CSS customizado (`index.css`)
*   **Ícones:** Lucide React
*   **Geração de Relatórios:** `jspdf` (para PDF) e `html2canvas` (para capturas de tela)
*   **Build Tool / Dev Server:** Vite
*   **Arquitetura:** PWA (Progressive Web App) - Pronto para ser instalado em dispositivos móveis e desktops.

## 📂 Estrutura de Diretórios

A estrutura segue o padrão de componentes modulares do React:

```text
GESTAOPROJETOCURSO/
├── docs/                      # Documentação técnica do sistema
├── public/                    # Assets estáticos públicos (ícones, manifest PWA)
├── src/                       # Código-fonte principal
│   ├── components/            # Componentes React reutilizáveis
│   │   ├── Navbar.tsx         # Menu de navegação superior
│   │   ├── PMBOKCanvasView.tsx# Visão do Canvas v5
│   │   ├── KanbanBoard.tsx    # Quadro Kanban de tarefas
│   │   ├── GanttChart.tsx     # Gráfico de Gantt
│   │   ├── TimesheetView.tsx  # Apontamento de horas
│   │   ├── ... e outros
│   ├── types/                 # Definições de interfaces TypeScript (models)
│   │   └── index.ts           # Types globais (Project, Task, CanvasItem, etc)
│   ├── App.tsx                # Componente Raiz (Roteamento de abas e estados globais)
│   ├── main.tsx               # Entry point do React
│   └── index.css              # Estilos globais e tokens (Tailwind customizado)
├── package.json               # Dependências e scripts npm
├── vite.config.ts             # Configuração do bundler Vite
├── tsconfig.json              # Configurações do compilador TypeScript
└── index.html                 # Template HTML principal
```

## 🧩 Gerenciamento de Estado

No modelo MVP atual, o gerenciamento de estado é feito de forma local e elevada (Lifting State Up) através do componente pai `App.tsx` utilizando React Hooks (`useState`, `useEffect`). O estado global dos projetos é injetado nos componentes filhos via "prop drilling". 

*(Para versões futuras, recomenda-se a adoção de Context API, Redux Toolkit ou Zustand para escalar a gestão de estado).*
