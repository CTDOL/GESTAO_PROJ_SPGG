import { Project, PMBOKCanvasData, DeliveryItem } from '../types';

interface CreateProjectParams {
  code: string;
  name: string;
  proposito: string;
  objetivo: string;
  justificativa: string;
  produto: string;
  escopo: string;
  naoEscopo: string;
  stakeholders: string;
  resistentes: string;
  premissasRestricoes: string;
  riscos: string;
  beneficios: string;
  budget: number;
  durationMonths: number;
}

export const createNewProject = (params: CreateProjectParams): Project => {
  const {
    code,
    name,
    proposito,
    objetivo,
    justificativa,
    produto,
    escopo,
    naoEscopo,
    stakeholders,
    resistentes,
    premissasRestricoes,
    riscos,
    beneficios,
    budget,
    durationMonths,
  } = params;

  const projectId = `proj-${Date.now()}`;
  const monthlyBudget = Math.round(budget / 5);

  const defaultDeliveries: DeliveryItem[] = [
    { id: `del-1-${projectId}`, order: 1, name: 'Requisitos', month: 'Mês 1', monthNumber: 1, investment: Math.round(monthlyBudget * 0.5), completed: false, progress: 0, status: 'Planejado' },
    { id: `del-2-${projectId}`, order: 2, name: 'UX/UI', month: 'Mês 2', monthNumber: 2, investment: Math.round(monthlyBudget * 0.8), completed: false, progress: 0, status: 'Planejado' },
    { id: `del-3-${projectId}`, order: 3, name: 'Desenvolvimento', month: `Mês ${Math.round(durationMonths * 0.6)}`, monthNumber: 4, investment: Math.round(monthlyBudget * 2), completed: false, progress: 0, status: 'Planejado' },
    { id: `del-4-${projectId}`, order: 4, name: 'Integrações', month: `Mês ${Math.round(durationMonths * 0.8)}`, monthNumber: 5, investment: Math.round(monthlyBudget * 1.2), completed: false, progress: 0, status: 'Planejado' },
    { id: `del-5-${projectId}`, order: 5, name: 'Homologação', month: `Mês ${durationMonths}`, monthNumber: 6, investment: Math.round(monthlyBudget * 0.5), completed: false, progress: 0, status: 'Planejado' }
  ];

  const newCanvasData: PMBOKCanvasData = {
    nomeProjeto: name,
    codigoProjeto: code,
    proposito: [{ id: `prop-${projectId}`, title: 'Objetivo Estratégico', description: proposito || 'Aumentar a taxa de sucesso nas entregas.', tag: 'Estratégico' }],
    objetivo: [{ id: `obj-${projectId}`, title: 'Objetivo do Projeto', description: objetivo || 'Desenvolver a plataforma.', tag: 'Entregável' }],
    justificativa: [{ id: `just-${projectId}`, title: 'Problema a Resolver', description: justificativa || 'Eliminar controle descentralizado.', tag: 'Problema' }],
    produto: [{ id: `prod-${projectId}`, title: 'Produto', description: produto || 'Sistema 100% web.', tag: 'Características' }],
    stakeholders: [{ id: `stk-1-${projectId}`, title: 'Patrocinador & Cliente', description: stakeholders, tag: 'Stakeholder' }],
    resistentes: [{ id: `res-1-${projectId}`, title: 'Resistentes à Mudança', description: resistentes, tag: 'Resistente' }],
    premissas: [{ id: `prem-1-${projectId}`, title: 'Premissas', description: premissasRestricoes, tag: 'Premissa' }],
    restricoes: [{ id: `rest-1-${projectId}`, title: 'Teto & LGPD', description: `Orçamento de R$ ${budget.toLocaleString('pt-BR')} e conformidade LGPD.`, tag: 'Restrição' }],
    riscos: [{ id: `risc-1-${projectId}`, title: 'Riscos', description: riscos, tag: 'Alto Impacto' }],
    escopo: [{ id: `esc-1-${projectId}`, title: 'Escopo', description: escopo || 'Requisitos e dev.', tag: 'Escopo' }],
    naoEscopo: [{ id: `nesc-1-${projectId}`, title: 'Não Escopo', description: naoEscopo || 'App nativo.', tag: 'Exclusão' }],
    beneficios: [{ id: `ben-1-${projectId}`, title: 'Benefícios', description: beneficios || 'Redução de tempo.', tag: 'Ganho' }],
    planoAcao: defaultDeliveries
  };

  const newProject: Project = {
    id: projectId,
    code,
    name,
    description: proposito || 'Novo projeto cadastrado.',
    budget,
    durationMonths,
    canvasData: newCanvasData,
    tasks: [
      { id: `tsk-init-${projectId}`, title: 'Reunião de Kick-off', description: 'Alinhamento estratégico do projeto.', status: 'backlog', priority: 'alta', assignee: 'Marcos Silva', assigneeRole: 'Líder Técnico', deliveryId: defaultDeliveries[0].id, dueDate: '2026-09-15', hoursSpent: 0, estimatedHours: 16 }
    ],
    timesheet: [],
    files: [],
    discussions: [
      { id: `disc-init-${projectId}`, author: 'Sistema', role: 'Notificação', text: `Projeto [${code}] ${name} cadastrado com sucesso e aguardando início.`, timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '), avatarColor: 'bg-indigo-600' }
    ],
    status: 'Aguardando'
  };

  return newProject;
};

export const updateExistingProject = (
  projectToEdit: Project,
  params: CreateProjectParams
): Project => {
  const { code, name, proposito, objetivo, justificativa, produto, escopo, naoEscopo, stakeholders, resistentes, premissasRestricoes, riscos, beneficios, budget, durationMonths } = params;

  const updatedCanvasData: PMBOKCanvasData = {
    ...projectToEdit.canvasData,
    nomeProjeto: name,
    codigoProjeto: code,
    proposito: [{ ...projectToEdit.canvasData.proposito[0], description: proposito }],
    objetivo: [{ ...projectToEdit.canvasData.objetivo[0], description: objetivo }],
    justificativa: [{ ...projectToEdit.canvasData.justificativa[0], description: justificativa }],
    produto: [{ ...projectToEdit.canvasData.produto[0], description: produto }],
    escopo: [{ ...projectToEdit.canvasData.escopo[0], description: escopo }],
    naoEscopo: [{ ...projectToEdit.canvasData.naoEscopo[0], description: naoEscopo }],
    beneficios: [{ ...projectToEdit.canvasData.beneficios[0], description: beneficios }],
    stakeholders: [{ ...projectToEdit.canvasData.stakeholders[0], description: stakeholders }],
    resistentes: [{ ...projectToEdit.canvasData.resistentes[0], description: resistentes }],
    premissas: [{ ...projectToEdit.canvasData.premissas[0], description: premissasRestricoes }],
    restricoes: [{ ...projectToEdit.canvasData.restricoes[0], description: `Orçamento de R$ ${budget.toLocaleString('pt-BR')} e conformidade LGPD.` }],
    riscos: [{ ...projectToEdit.canvasData.riscos[0], description: riscos }],
  };

  return {
    ...projectToEdit,
    code,
    name,
    description: proposito,
    budget,
    durationMonths,
    canvasData: updatedCanvasData
  };
};
