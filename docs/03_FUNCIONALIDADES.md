# Funcionalidades Principais (Features)

O ProjTrack MVP foi concebido para entregar uma experiência fluida através da segregação do gerenciamento do projeto em **Abas (Views)** específicas. 

## 1. Dashboard de Portfólio de Projetos
*   **Visão Global:** KPIs de progresso médio geral e total de projetos cadastrados.
*   **Visão Financeira:** Orçamento total alocado vs. executado em todo o portfólio.
*   **Cartões de Projeto:** Cada cartão exibe status, progresso, métricas financeiras, e a identificação **ID único** (ex: `PROJ-001`).
*   **Ações:** Criar novo projeto (com auto-geração ou customização do ID), excluir e buscar/filtrar pelo ID ou Nome.

## 2. PMBOK Canvas v5
A adaptação fiel do método PMBOK Canvas v5 garante o alinhamento visual do projeto em blocos lógicos:
*   **Propósito (Por quê?):** Justificativa, Objetivo, Benefícios.
*   **O Que?:** Características do Produto, Escopo, Não Escopo.
*   **Quem? (Stakeholders):** Patrocinador, Equipe, Clientes e Resistentes.
*   **Restrições e Riscos (Como e E Se?):** Premissas, Restrições e Mapeamento de Riscos.
*   **Plano de Ação (Quando e Quanto?):** Cronograma macro (Entregas e Datas) associado ao Investimento por fase.

## 3. Dashboard Executivo
*   **Métricas de Progresso e Saúde do Projeto:** Resumo financeiro de orçamento disponível vs consumido.
*   **Gráficos Visuais:** Burn-down/Burn-up intuitivos.
*   **Indicadores de Atraso e Custo:** Alertas dinâmicos para desvios no Plano de Ação.

## 4. Quadro Kanban (Gestão Ágil de Tarefas)
*   **Colunas:** A Fazer (`todo`), Em Andamento (`in_progress`), Em Revisão (`review`), Concluído (`completed`).
*   **Integração:** Tarefas vinculadas diretamente às entregas mapeadas no Canvas v5.
*   **Atribuição:** Controle de prioridades (Alta, Média, Baixa), responsáveis, prazos e métricas de esforço (horas estimadas vs gastas).

## 5. Cronograma Gantt
*   Representação visual das entregas mapeadas no Plano de Ação do Canvas, escalonadas ao longo da linha do tempo do projeto.

## 6. Timesheet (Apontamento de Horas)
*   **Registro de Esforço:** A equipe aponta horas trabalhadas nas tarefas, vinculando uma data, descrição e classificação (Desenvolvimento, Reunião, Design).
*   **Auditoria de Esforço:** Contabilização total para métricas financeiras (valor da hora TI).

## 7. Módulo de Relatórios (PDF / Excel)
*   **Geração Estática:** Exportação com `jspdf` e `html2canvas` para congelar o status atual e enviar como anexo de reuniões de Status Report.

## 8. Arquivos & Chat (Colaboração)
*   **Timeline Histórica:** Log temporal de mensagens e arquivos submetidos por membros do time (mockup no front-end para o MVP).
