import { PMBOKCanvasData, Task, TimesheetEntry, ProjectFile, DiscussionMessage } from '../types';

export const initialPMBOKData: PMBOKCanvasData = {
  nomeProjeto: "ProjTrack - Sistema Integrado de Controle de Projetos",
  codigoProjeto: "PROJ-001",
  proposito: [
    {
      id: "prop-1",
      title: "Objetivo Estratégico",
      description: "Aumentar a taxa de sucesso nas entregas da empresa, garantindo visibilidade, padronização e controle de ponta a ponta em todos os projetos do portfólio.",
      tag: "Estratégico"
    }
  ],
  objetivo: [
    {
      id: "obj-1",
      title: "Desenvolver e Implantar",
      description: "Desenvolver e implantar um sistema web centralizado para a gestão e controle de projetos.",
      tag: "Entregável"
    }
  ],
  justificativa: [
    {
      id: "just-1",
      title: "Descentralização & Perda de Histórico",
      description: "Atualmente, o controle dos projetos é descentralizado em diversas planilhas e e-mails, gerando falhas de comunicação e perda de rastreabilidade.",
      tag: "Problema"
    },
    {
      id: "just-2",
      title: "Capacidade & Atrasos",
      description: "Dificuldade constante em mensurar a capacidade real da equipe de TI, acarretando atrasos frequentes nas entregas críticas.",
      tag: "Impacto Operacional"
    }
  ],
  produto: [
    {
      id: "prod-1",
      title: "Plataforma 100% Web Responsiva",
      description: "Acessível e otimizada para desktop e mobile via navegadores modernos.",
      tag: "Arquitetura"
    },
    {
      id: "prod-2",
      title: "Dashboards Interativos de Portfólio",
      description: "Visões integradas em formato Gantt, Kanban e Cronograma de marcos.",
      tag: "Módulo"
    },
    {
      id: "prod-3",
      title: "Timesheet & Gestão de Recursos",
      description: "Módulo para apontamento diário de horas por entrega e controle de capacidade da equipe.",
      tag: "Módulo"
    },
    {
      id: "prod-4",
      title: "Central de Arquivos & Comunicação",
      description: "Repositório centralizado de documentos por projeto e histórico de discussões.",
      tag: "Módulo"
    },
    {
      id: "prod-5",
      title: "Relatórios Automáticos PDF/Excel",
      description: "Geração em tempo real de status reports gerenciais e consolidados para executivos.",
      tag: "Relatórios"
    }
  ],
  stakeholders: [
    {
      id: "stk-1",
      title: "Patrocinador (Sponsor)",
      description: "Diretoria Executiva / CEO - Responsável pela aprovação do orçamento total de R$ 120.000.",
      tag: "Aprovação"
    },
    {
      id: "stk-2",
      title: "Cliente Interno",
      description: "Escritório de Projetos (PMO) e Gerentes de Projeto (usuários chave do sistema).",
      tag: "Usuários Chave"
    },
    {
      id: "stk-3",
      title: "Equipe de Execução TI",
      description: "Líder Técnico, Desenvolvedores (Frontend/Backend), Designer UX/UI e Analista de QA.",
      tag: "Time de TI"
    }
  ],
  resistentes: [
    {
      id: "res-1",
      title: "Colaboradores Operacionais",
      description: "Usuários acostumados ao modelo legado de planilhas locais que podem apresentar resistência à migração e novos controles.",
      tag: "Gestão da Mudança"
    }
  ],
  premissas: [
    {
      id: "prem-1",
      title: "Dedicação Exclusiva de TI",
      description: "A equipe de TI alocada terá 100% de dedicação ao projeto durante o ciclo de 6 meses.",
      tag: "Recursos"
    },
    {
      id: "prem-2",
      title: "Infraestrutura Cloud Existente",
      description: "A infraestrutura de servidores em nuvem atual da empresa suportará a nova aplicação web.",
      tag: "Infra"
    }
  ],
  restricoes: [
    {
      id: "rest-1",
      title: "Teto Orçamentário",
      description: "Orçamento financeiro máximo fixado rigorosamente em R$ 120.000,00.",
      tag: "Financeiro"
    },
    {
      id: "rest-2",
      title: "Prazo de Lançamento",
      description: "Prazo limite para implantação oficial estabelecido em 6 meses improrrogáveis.",
      tag: "Cronograma"
    },
    {
      id: "rest-3",
      title: "Conformidade LGPD",
      description: "Obrigatória adequação aos termos e exigências da Lei Geral de Proteção de Dados Pessoais.",
      tag: "Compliance"
    }
  ],
  riscos: [
    {
      id: "risc-1",
      title: "Baixa Adoção Inicial",
      description: "Resistência dos colaboradores operacionais à utilização regular da ferramenta em detrimento do Excel.",
      tag: "Alto Impacto"
    },
    {
      id: "risc-2",
      title: "Integração ERP de RH",
      description: "Complexidade não mapeada na integração de dados dos funcionários com o ERP de RH legado.",
      tag: "Médio Impacto"
    },
    {
      id: "risc-3",
      title: "Scope Creep (Expansão de Escopo)",
      description: "Solicitações excessivas de novos recursos durante o desenvolvimento extrapolando o orçamento.",
      tag: "Alto Impacto"
    }
  ],
  escopo: [
    {
      id: "esc-1",
      title: "Levantamento & Fluxos",
      description: "Mapeamento completo de requisitos funcionais e fluxos junto ao PMO e Gerentes de Projeto.",
      tag: "Fase 1"
    },
    {
      id: "esc-2",
      title: "Design UX/UI",
      description: "Prototipagem de alta fidelidade e design de interface responsivo para todas as telas.",
      tag: "Fase 2"
    },
    {
      id: "esc-3",
      title: "Desenvolvimento Fullstack",
      description: "Modelagem de Banco de Dados, APIs de Backend e Frontend interativo.",
      tag: "Fase 3 & 4"
    },
    {
      id: "esc-4",
      title: "Dashboards & Relatórios",
      description: "Desenvolvimento dos painéis gerenciais e mecanismo de exportação em PDF e Excel.",
      tag: "Fase 4"
    },
    {
      id: "esc-5",
      title: "Homologação & Treinamento",
      description: "Testes integrados de QA, homologação com usuários chave e capacitação presencial/online.",
      tag: "Fase 5"
    }
  ],
  naoEscopo: [
    {
      id: "nesc-1",
      title: "App Móvel Nativo",
      description: "Não serão desenvolvidos aplicativos nativos iOS/Android nesta versão (apenas Web Responsivo).",
      tag: "Exclusão"
    },
    {
      id: "nesc-2",
      title: "Módulo Financeiro/Folha",
      description: "Não haverá cálculo de folha de pagamento, bônus ou gestão contábil financeira interna.",
      tag: "Exclusão"
    },
    {
      id: "nesc-3",
      title: "Integração com Fornecedores",
      description: "Sem integração com sistemas externos de fornecedores ou clientes terceirizados.",
      tag: "Exclusão"
    }
  ],
  beneficios: [
    {
      id: "ben-1",
      title: "Redução de 40% em Tempo Admin",
      description: "Economia drástica de tempo gasto para consolidar dados manuais e preparar relatórios de status.",
      tag: "Produtividade"
    },
    {
      id: "ben-2",
      title: "Visibilidade em Tempo Real",
      description: "Acompanhamento transparente do andamento, riscos e alocação de recursos do portfólio.",
      tag: "Gestão"
    },
    {
      id: "ben-3",
      title: "Previsibilidade de Custos & Prazos",
      description: "Redução de estouros orçamentários e atrasos nas entregas operacionais.",
      tag: "Controle"
    },
    {
      id: "ben-4",
      title: "Histórico Auditável Seguro",
      description: "Centralização de evidências e histórico para auditorias e compliance LGPD.",
      tag: "Governança"
    }
  ],
  planoAcao: [
    {
      id: "del-1",
      order: 1,
      name: "Requisitos mapeados e documentados",
      month: "Mês 1",
      monthNumber: 1,
      investment: 10000,
      completed: true,
      progress: 100,
      status: "Concluído"
    },
    {
      id: "del-2",
      order: 2,
      name: "Protótipos de interface (UX/UI) aprovados",
      month: "Mês 2",
      monthNumber: 2,
      investment: 15000,
      completed: true,
      progress: 100,
      status: "Concluído"
    },
    {
      id: "del-3",
      order: 3,
      name: "Módulos de gestão e tarefas desenvolvidos",
      month: "Mês 4",
      monthNumber: 4,
      investment: 50000,
      completed: false,
      progress: 75,
      status: "Em Andamento"
    },
    {
      id: "del-4",
      order: 4,
      name: "Relatórios e integrações finalizados",
      month: "Mês 5",
      monthNumber: 5,
      investment: 35000,
      completed: false,
      progress: 25,
      status: "Em Andamento"
    },
    {
      id: "del-5",
      order: 5,
      name: "Sistema homologado e equipe treinada",
      month: "Mês 6",
      monthNumber: 6,
      investment: 10000,
      completed: false,
      progress: 0,
      status: "Planejado"
    }
  ]
};

export const initialTasks: Task[] = [
  {
    id: "tsk-101",
    title: "Mapeamento dos fluxos de aprovação com o PMO",
    description: "Entrevistar gerentes de projeto para consolidar a estrutura analítica de projetos.",
    status: "completed",
    priority: "alta",
    assignee: "Marcos Silva",
    assigneeRole: "Líder Técnico",
    deliveryId: "del-1",
    dueDate: "2026-03-15",
    hoursSpent: 32,
    estimatedHours: 32
  },
  {
    id: "tsk-102",
    title: "Documentação de requisitos de privacidade LGPD",
    description: "Mapear campos de dados pessoais sensíveis e criar logs de auditoria conforme exigência legal.",
    status: "completed",
    priority: "alta",
    assignee: "Ana Costa",
    assigneeRole: "Analista de QA",
    deliveryId: "del-1",
    lgpdTag: true,
    dueDate: "2026-03-28",
    hoursSpent: 24,
    estimatedHours: 24
  },
  {
    id: "tsk-201",
    title: "Design de alta fidelidade das telas de Dashboard & PMBOK Canvas",
    description: "Criação do design system em Figma e validação com o cliente interno (PMO).",
    status: "completed",
    priority: "alta",
    assignee: "Juliana Lima",
    assigneeRole: "Designer UX/UI",
    deliveryId: "del-2",
    dueDate: "2026-04-20",
    hoursSpent: 50,
    estimatedHours: 48
  },
  {
    id: "tsk-301",
    title: "Desenvolvimento do Módulo Kanban e Quadro de Tarefas",
    description: "Construção de componentes interativos drag-and-drop com filtros por responsável e prioridade.",
    status: "in_progress",
    priority: "alta",
    assignee: "Lucas Mendes",
    assigneeRole: "Dev Frontend",
    deliveryId: "del-3",
    dueDate: "2026-06-15",
    hoursSpent: 64,
    estimatedHours: 80
  },
  {
    id: "tsk-302",
    title: "Implementação da API de Apontamento de Horas (Timesheet)",
    description: "Criar endpoints seguros para registrar horas trabalhadas com validação de limite semanal.",
    status: "in_progress",
    priority: "media",
    assignee: "Rodrigo Xavier",
    assigneeRole: "Dev Backend",
    deliveryId: "del-3",
    dueDate: "2026-06-30",
    hoursSpent: 40,
    estimatedHours: 60
  },
  {
    id: "tsk-401",
    title: "Desenvolvimento do Gerador de Status Report em PDF/Excel",
    description: "Integrar biblioteca de renderização em PDF com layouts gráficos executivos.",
    status: "review",
    priority: "media",
    assignee: "Lucas Mendes",
    assigneeRole: "Dev Frontend",
    deliveryId: "del-4",
    dueDate: "2026-07-20",
    hoursSpent: 28,
    estimatedHours: 35
  },
  {
    id: "tsk-402",
    title: "Integração segura com ERP de RH (Carga de Recursos)",
    description: "Sincronização agendada de usuários e cargos preservando criptografia LGPD.",
    status: "in_progress",
    priority: "alta",
    assignee: "Rodrigo Xavier",
    assigneeRole: "Dev Backend",
    deliveryId: "del-4",
    lgpdTag: true,
    dueDate: "2026-07-28",
    hoursSpent: 30,
    estimatedHours: 50
  },
  {
    id: "tsk-501",
    title: "Homologação final com Gerentes de Projeto & PMO",
    description: "Sessões presenciais de validação e roteiro de testes de aceitação de usuário (UAT).",
    status: "backlog",
    priority: "alta",
    assignee: "Ana Costa",
    assigneeRole: "Analista de QA",
    deliveryId: "del-5",
    dueDate: "2026-08-25",
    hoursSpent: 0,
    estimatedHours: 40
  },
  {
    id: "tsk-502",
    title: "Treinamento das equipes operacionais e disponibilização do manual",
    description: "Minicursos para mitigação da resistência à adoção e publicação do manual online.",
    status: "backlog",
    priority: "media",
    assignee: "Marcos Silva",
    assigneeRole: "Líder Técnico",
    deliveryId: "del-5",
    dueDate: "2026-08-31",
    hoursSpent: 0,
    estimatedHours: 30
  }
];

export const initialTimesheet: TimesheetEntry[] = [
  {
    id: "ts-1",
    date: "2026-08-01",
    member: "Lucas Mendes",
    role: "Dev Frontend",
    deliveryId: "del-3",
    deliveryName: "Módulos de gestão e tarefas desenvolvidos",
    hours: 8,
    description: "Implementação da interface visual do Kanban e filtros por status"
  },
  {
    id: "ts-2",
    date: "2026-08-02",
    member: "Rodrigo Xavier",
    role: "Dev Backend",
    deliveryId: "del-4",
    deliveryName: "Relatórios e integrações finalizados",
    hours: 7.5,
    description: "Desenvolvimento da rota REST para exportação dos relatórios gerenciais"
  },
  {
    id: "ts-3",
    date: "2026-08-03",
    member: "Juliana Lima",
    role: "Designer UX/UI",
    deliveryId: "del-3",
    deliveryName: "Módulos de gestão e tarefas desenvolvidos",
    hours: 6,
    description: "Ajuste fino nos protótipos de alta fidelidade da tela de Timesheet"
  },
  {
    id: "ts-4",
    date: "2026-08-04",
    member: "Ana Costa",
    role: "Analista de QA",
    deliveryId: "del-3",
    deliveryName: "Módulos de gestão e tarefas desenvolvidos",
    hours: 8,
    description: "Elaboração e execução de casos de teste para o módulo de tarefas"
  }
];

export const initialFiles: ProjectFile[] = [
  {
    id: "file-1",
    name: "Canvas_PMBOK_ProjTrack_V1.pdf",
    category: "Requisitos",
    size: "2.4 MB",
    uploadedAt: "2026-03-10",
    uploadedBy: "Marcos Silva (Líder Técnico)"
  },
  {
    id: "file-2",
    name: "Especificacao_Conformidade_LGPD.pdf",
    category: "Arquitetura & LGPD",
    size: "1.8 MB",
    uploadedAt: "2026-03-25",
    uploadedBy: "Ana Costa (Analista de QA)"
  },
  {
    id: "file-3",
    name: "Protótipos_UX_UI_Figma_Export.zip",
    category: "Design UX/UI",
    size: "14.5 MB",
    uploadedAt: "2026-04-18",
    uploadedBy: "Juliana Lima (UX/UI)"
  },
  {
    id: "file-4",
    name: "Manual_do_Usuario_ProjTrack_Draft.pdf",
    category: "Manuais & Treinamento",
    size: "3.1 MB",
    uploadedAt: "2026-07-30",
    uploadedBy: "Marcos Silva (Líder Técnico)"
  }
];

export const initialDiscussions: DiscussionMessage[] = [
  {
    id: "disc-1",
    author: "Diretoria Executiva / CEO",
    role: "Patrocinador",
    text: "Orçamento de R$ 120.000 liberado e alocado. Excelente progresso no mapeamento inicial dos requisitos!",
    timestamp: "2026-03-02 10:15",
    avatarColor: "bg-emerald-600"
  },
  {
    id: "disc-2",
    author: "Marcos Silva",
    role: "Líder Técnico",
    text: "Equipe de TI 100% focada. Os protótipos de UX/UI foram validados com o PMO e a infraestrutura em nuvem já está provisionada.",
    timestamp: "2026-04-22 14:30",
    avatarColor: "bg-indigo-600"
  },
  {
    id: "disc-3",
    author: "Ana Costa",
    role: "Analista de QA",
    text: "Validando os fluxos de anonimização e criptografia de logs conforme a LGPD. Módulo de tarefas em fase adiantada de testes.",
    timestamp: "2026-08-03 16:45",
    avatarColor: "bg-amber-600"
  }
];
