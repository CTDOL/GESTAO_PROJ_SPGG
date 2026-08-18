export type StatusType = 'backlog' | 'in_progress' | 'review' | 'completed';
export type PriorityType = 'alta' | 'media' | 'baixa';

export interface CanvasItem {
  id: string;
  title: string;
  description: string;
  tag?: string;
}

export interface PMBOKCanvasData {
  nomeProjeto: string;
  codigoProjeto?: string;
  proposito: CanvasItem[];
  objetivo: CanvasItem[];
  justificativa: CanvasItem[];
  produto: CanvasItem[];
  stakeholders: CanvasItem[];
  resistentes: CanvasItem[];
  premissas: CanvasItem[];
  restricoes: CanvasItem[];
  riscos: CanvasItem[];
  escopo: CanvasItem[];
  naoEscopo: CanvasItem[];
  beneficios: CanvasItem[];
  planoAcao: DeliveryItem[];
}

export interface DeliveryItem {
  id: string;
  order: number;
  name: string;
  month: string;
  monthNumber: number;
  investment: number;
  completed: boolean;
  progress: number;
  status: 'Concluído' | 'Em Andamento' | 'Planejado';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: StatusType;
  priority: PriorityType;
  assignee: string;
  assigneeRole: string;
  deliveryId: string;
  lgpdTag?: boolean;
  dueDate: string;
  hoursSpent: number;
  estimatedHours: number;
}

export interface TimesheetEntry {
  id: string;
  date: string;
  member: string;
  role: string;
  deliveryId: string;
  deliveryName: string;
  hours: number;
  description: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  category: 'Requisitos' | 'Design UX/UI' | 'Arquitetura & LGPD' | 'Manuais & Treinamento';
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface DiscussionMessage {
  id: string;
  author: string;
  role: string;
  text: string;
  timestamp: string;
  avatarColor: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  isActive?: boolean;
}

export interface Project {
  id: string;
  code: string; // Ex: PROJ-001, PROJ-002
  name: string;
  description: string;
  budget: number;
  durationMonths: number;
  canvasData: PMBOKCanvasData;
  tasks: Task[];
  timesheet: TimesheetEntry[];
  files: ProjectFile[];
  discussions: DiscussionMessage[];
  teamMembers?: TeamMember[];
  status?: 'Aguardando' | 'Iniciado';
}
