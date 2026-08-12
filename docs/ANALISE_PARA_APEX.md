# Análise de Migração/Desenvolvimento: MATCH MVP para Oracle APEX

Este documento foi estruturado especificamente para ser lido por uma Inteligência Artificial assistente, com o objetivo de guiar o desenvolvimento do sistema **MATCH** (Sistema Integrado de Controle de Projetos) em **Oracle APEX**.

## 1. Contexto do Projeto e Negócio

*   **Nome do Projeto:** MATCH
*   **Objetivo:** Sistema web centralizado para gestão de projetos usando PMBOK Canvas v5 e metodologias ágeis.
*   **Público-Alvo:** PMO/Gerentes de Projeto (Visão tática/operacional), Equipe de Execução (Operacional) e Diretoria/Sponsors (Visão executiva).
*   **Premissas de Negócio:**
    *   Todo problema mapeado precisa de uma solução/benefício correspondente.
    *   Escopo estrito (Princípio da Essencialidade).
    *   Engajamento integral (Visão 360º de Stakeholders).
    *   Baseado no PMBOK 7ª Edição (Orientação a valor, 12 princípios, 8 domínios).

## 2. Paradigma de Transição Arquitetural

**De (Stack Atual - React):**
*   **Frontend:** React.js, Tailwind CSS, TypeScript, Vite.
*   **Estado:** Hooks do React (useState, useEffect) com "Prop Drilling".
*   **Arquitetura:** PWA, Client-side rendering forte.

**Para (Stack Alvo - Oracle APEX):**
*   **Arquitetura:** Server-driven UI (PL/SQL + Metadados APEX).
*   **Frontend:** Universal Theme (Theme 42), Oracle JET (para gráficos), CSS customizado mínimo (APEX Theme Roller).
*   **Estado:** Session State do APEX (Page Items, Application Items), APEX Collections para estados em memória/temporários.
*   **Backend:** PL/SQL, Oracle Database.

## 3. Mapeamento de Funcionalidades para Componentes APEX

| Funcionalidade Original (React) | Componente Sugerido em Oracle APEX | Observações Técnicas para IA |
| :--- | :--- | :--- |
| **1. Dashboard de Portfólio** | Cards Region / Interactive Report / Interactive Grid | Usar *Cards Region* para visualização visual dos projetos (com badge de status). Interactive Report para listagem analítica. |
| **2. PMBOK Canvas v5** | Static Content Regions (organizados em Grid) / Cards | Utilizar o *Grid Layout* do Universal Theme para simular os blocos visuais do Canvas. Cada bloco pode ser uma região com campos (Page Items) ou um Interactive Grid para itens múltiplos (ex: múltiplos stakeholders). |
| **3. Dashboard Executivo** | Oracle JET Charts (Bar, Line, Pie, Status Meter Gauge) | Usar *Chart Regions* nativas do APEX. *Status Meter Gauge* para KPIs e orçamento consumido. |
| **4. Quadro Kanban** | APEX Cards Region (Group by Status) ou Plugin Externo | A partir do APEX 22.1+, a região de Cards pode ser agrupada. Para *Drag & Drop* verdadeiro, considerar integrar bibliotecas JS leves ou plugins APEX Kanban comunitários. |
| **5. Cronograma Gantt** | Oracle JET Gantt Chart | Utilizar a região nativa de *Chart* do tipo *Gantt*. Requer queries formatadas com Start Date, End Date, Task Name, e Parent Task. |
| **6. Timesheet** | Interactive Grid / Formulário Master-Detail | *Interactive Grid* permite edição em lote rápida (como uma planilha Excel), ideal para desenvolvedores apontarem várias horas rapidamente. |
| **7. Relatórios (PDF/Excel)** | APEX Native Printing / AOP (APEX Office Print) | O APEX suporta download nativo de Interactive Reports/Grids em Excel/PDF. Para relatórios altamente customizados, usar Oracle BI Publisher ou AOP. |
| **8. Arquivos & Chat** | Timeline Region / File Browse Item | Usar tipo de região *Timeline* para histórico de mensagens. Armazenar arquivos em tabelas via tipo de dado `BLOB` integrado com *File Browse*. |

## 4. Proposta de Modelo de Dados (Entity-Relationship)

Para a IA que for construir o schema, aqui estão as tabelas principais necessárias:

1.  **MTC_PROJETOS**: `ID`, `NOME`, `STATUS`, `ORCAMENTO_TOTAL`, `DATA_INICIO`, `DATA_FIM`, `ID_GERENTE`.
2.  **MTC_CANVAS_ITENS**: `ID`, `ID_PROJETO`, `TIPO_BLOCO` (Justificativa, Objetivo, Beneficio, Risco, etc), `DESCRICAO`.
3.  **MTC_STAKEHOLDERS**: `ID`, `ID_PROJETO`, `NOME`, `PAPEL`, `MATRIZ_PODER`, `MATRIZ_INTERESSE`.
4.  **MTC_TAREFAS**: `ID`, `ID_PROJETO`, `TITULO`, `DESCRICAO`, `STATUS` (Todo, In_progress, Review, Completed), `RESPONSAVEL`, `ESFORCO_ESTIMADO`, `DATA_INICIO`, `DATA_FIM`.
5.  **MTC_TIMESHEET**: `ID`, `ID_TAREFA`, `ID_USUARIO`, `DATA_APONTAMENTO`, `HORAS`, `TIPO_ATIVIDADE`.
6.  **MTC_ARQUIVOS_COMENTARIOS**: `ID`, `ID_PROJETO`, `ID_USUARIO`, `TEXTO`, `ARQUIVO_BLOB`, `DATA_CRIACAO`.

## 5. Diretrizes de Prompting para o Desenvolvedor IA

Quando for atuar no desenvolvimento APEX, a IA deve focar em:

*   **"Low-Code First":** Priorizar componentes nativos do Universal Theme antes de escrever JavaScript/CSS customizado.
*   **PL/SQL encapsulado:** Lógica de negócio pesada (como cálculo de saúde financeira ou métricas de dashboard) deve ser encapsulada em *Packages PL/SQL* no banco, não em Page Processes soltos.
*   **Segurança:** Implementar APEX Authorization Schemes baseados nos papéis mapeados (PMO, Equipe, Diretoria).
*   **Responsividade:** Garantir que o Grid Layout flua corretamente para mobile, visando manter a característica de PWA do projeto original.

---
**Fim da análise.** Este arquivo pode ser usado como contexto principal (`<context>`) em prompts futuros para a geração de scripts DDL, PL/SQL ou configurações de páginas APEX.
