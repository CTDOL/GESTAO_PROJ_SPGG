import React, { useState } from 'react';
import { Project, PMBOKCanvasData, DeliveryItem } from '../types';
import { Target, X, CheckCircle2, DollarSign, Calendar, ShieldCheck, Sparkles, FileText, Star, AlertTriangle, Users, Lock, Tag } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (newProject: Project) => void;
  onEditProject?: (updatedProject: Project) => void;
  existingProjectsCount?: number;
  projectToEdit?: Project;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onAddProject,
  onEditProject,
  existingProjectsCount = 1,
  projectToEdit,
}) => {
  const isEditing = !!projectToEdit;
  const autoCode = isEditing ? projectToEdit.code : `PROJ-00${existingProjectsCount + 1}`;

  // Canvas de Projeto v5 Form Fields
  const [code, setCode] = useState(autoCode);
  const [name, setName] = useState('');
  const [proposito, setProposito] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [beneficios, setBeneficios] = useState('');
  const [produto, setProduto] = useState('');
  const [escopo, setEscopo] = useState('');
  const [naoEscopo, setNaoEscopo] = useState('');
  const [stakeholders, setStakeholders] = useState('Patrocinador: Diretoria Executiva | Cliente: PMO');
  const [resistentes, setResistentes] = useState('Usuários operacionais apegados a planilhas antigas');
  const [premissasRestricoes, setPremissasRestricoes] = useState('Equipe TI 100% dedicada | Conformidade LGPD obrigatória');
  const [riscos, setRiscos] = useState('Resistência inicial de adoção e atrasos em integrações');
  const [budget, setBudget] = useState<number>(120000);
  const [durationMonths, setDurationMonths] = useState<number>(6);

  React.useEffect(() => {
    if (isOpen) {
      if (isEditing && projectToEdit) {
        setCode(projectToEdit.code);
        setName(projectToEdit.name);
        setProposito(projectToEdit.canvasData.proposito[0]?.description || '');
        setObjetivo(projectToEdit.canvasData.objetivo[0]?.description || '');
        setJustificativa(projectToEdit.canvasData.justificativa[0]?.description || '');
        setBeneficios(projectToEdit.canvasData.beneficios[0]?.description || '');
        setProduto(projectToEdit.canvasData.produto[0]?.description || '');
        setEscopo(projectToEdit.canvasData.escopo[0]?.description || '');
        setNaoEscopo(projectToEdit.canvasData.naoEscopo[0]?.description || '');
        setStakeholders(projectToEdit.canvasData.stakeholders[0]?.description || '');
        setResistentes(projectToEdit.canvasData.resistentes[0]?.description || '');
        setPremissasRestricoes(projectToEdit.canvasData.premissas[0]?.description || '');
        setRiscos(projectToEdit.canvasData.riscos[0]?.description || '');
        setBudget(projectToEdit.budget);
        setDurationMonths(projectToEdit.durationMonths);
      } else {
        setCode(`PROJ-00${existingProjectsCount + 1}`);
        setName('');
        setProposito('');
        setObjetivo('');
        setJustificativa('');
        setBeneficios('');
        setProduto('');
        setEscopo('');
        setNaoEscopo('');
        setStakeholders('Patrocinador: Diretoria Executiva | Cliente: PMO');
        setResistentes('Usuários operacionais apegados a planilhas antigas');
        setPremissasRestricoes('Equipe TI 100% dedicada | Conformidade LGPD obrigatória');
        setRiscos('Resistência inicial de adoção e atrasos em integrações');
        setBudget(120000);
        setDurationMonths(6);
      }
    }
  }, [isOpen, isEditing, projectToEdit, existingProjectsCount]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const projectCode = code.trim().toUpperCase() || autoCode;
    const monthlyBudget = Math.round(budget / 5);

    if (isEditing && projectToEdit && onEditProject) {
      // EDITA O PROJETO EXISTENTE
      const updatedCanvasData = {
        ...projectToEdit.canvasData,
        nomeProjeto: name,
        codigoProjeto: projectCode,
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
        // Não altera o plano de ação (Entregas e investimentos), pois o usuário pode já ter alterado no Gantt.
        // Se a pessoa quiser alterar investimentos, ela usa a tela Gantt.
      };

      const updatedProject = {
        ...projectToEdit,
        code: projectCode,
        name,
        description: proposito,
        budget,
        durationMonths,
        canvasData: updatedCanvasData
      };
      
      onEditProject(updatedProject);
    } else {
      // CRIA NOVO PROJETO
      const projectId = `proj-${Date.now()}`;
      const defaultDeliveries: DeliveryItem[] = [
        { id: `del-1-${projectId}`, order: 1, name: 'Requisitos', month: 'Mês 1', monthNumber: 1, investment: Math.round(monthlyBudget * 0.5), completed: false, progress: 0, status: 'Planejado' },
        { id: `del-2-${projectId}`, order: 2, name: 'UX/UI', month: 'Mês 2', monthNumber: 2, investment: Math.round(monthlyBudget * 0.8), completed: false, progress: 0, status: 'Planejado' },
        { id: `del-3-${projectId}`, order: 3, name: 'Desenvolvimento', month: `Mês ${Math.round(durationMonths * 0.6)}`, monthNumber: 4, investment: Math.round(monthlyBudget * 2), completed: false, progress: 0, status: 'Planejado' },
        { id: `del-4-${projectId}`, order: 4, name: 'Integrações', month: `Mês ${Math.round(durationMonths * 0.8)}`, monthNumber: 5, investment: Math.round(monthlyBudget * 1.2), completed: false, progress: 0, status: 'Planejado' },
        { id: `del-5-${projectId}`, order: 5, name: 'Homologação', month: `Mês ${durationMonths}`, monthNumber: 6, investment: Math.round(monthlyBudget * 0.5), completed: false, progress: 0, status: 'Planejado' }
      ];

      const newCanvasData: PMBOKCanvasData = {
        nomeProjeto: name,
        codigoProjeto: projectCode,
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
        code: projectCode,
        name,
        description: proposito || 'Novo projeto cadastrado.',
        budget,
        durationMonths,
        canvasData: newCanvasData,
        tasks: [
          { id: `tsk-init-${projectId}`, title: 'Reunião de Kick-off', description: 'Alinhamento.', status: 'in_progress', priority: 'alta', assignee: 'Marcos Silva', assigneeRole: 'Líder Técnico', deliveryId: defaultDeliveries[0].id, dueDate: '2026-09-15', hoursSpent: 8, estimatedHours: 16 }
        ],
        timesheet: [],
        files: [],
        discussions: [
          { id: `disc-init-${projectId}`, author: 'Sistema', role: 'Notificação', text: `Projeto [${projectCode}] ${name} cadastrado com sucesso.`, timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '), avatarColor: 'bg-indigo-600' }
        ],
        status: 'Aguardando'
      };
      onAddProject(newProject);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel bg-slate-900 rounded-2xl max-w-3xl w-full p-6 border border-slate-700 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Cadastrar Novo Projeto (Canvas v5)</h3>
              <p className="text-xs text-slate-400">Atribuição de ID de identificação único e preenchimento do Canvas v5.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ID do Projeto & Nome do Projeto & Propósito */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-black text-indigo-400 uppercase tracking-wider mb-1">
                ID / Código do Projeto *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex: PROJ-002"
                className="w-full px-3 py-2 bg-slate-950 border border-indigo-500/40 rounded-xl text-xs text-indigo-300 font-extrabold focus:outline-none focus:border-indigo-500 uppercase font-mono"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-xs font-black text-slate-200 uppercase tracking-wider mb-1">
                Nome do Projeto *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: ProjTrack V2"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-200 uppercase tracking-wider mb-1">
                Propósito (Objetivo Estratégico)
              </label>
              <input
                type="text"
                value={proposito}
                onChange={(e) => setProposito(e.target.value)}
                placeholder="Ex: Aumentar a taxa de sucesso nas entregas..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Coluna 1 do Canvas v5: Objetivo, Justificativa, Benefícios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-bold text-indigo-300 mb-1">
                Objetivo (Verbo infinitivo + Produto)
              </label>
              <textarea
                rows={2}
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value)}
                placeholder="Ex: Desenvolver e implantar a plataforma..."
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1">
                Justificativa (Listar problemas)
              </label>
              <textarea
                rows={2}
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
                placeholder="Ex: Descentralização em planilhas, perda de histórico..."
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-300 mb-1">
                Benefícios (Quais serão os ganhos?)
              </label>
              <textarea
                rows={2}
                value={beneficios}
                onChange={(e) => setBeneficios(e.target.value)}
                placeholder="Ex: Redução de 40% de tempo admin, visibilidade..."
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Coluna 2 do Canvas v5: Produto, Escopo, Não Escopo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-bold text-blue-300 mb-1">
                Características do Produto/Serviço
              </label>
              <textarea
                rows={2}
                value={produto}
                onChange={(e) => setProduto(e.target.value)}
                placeholder="Ex: Plataforma web responsiva com Kanban e Gantt..."
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-300 mb-1">
                Escopo (O que será feito?)
              </label>
              <textarea
                rows={2}
                value={escopo}
                onChange={(e) => setEscopo(e.target.value)}
                placeholder="Ex: Mapeamento de requisitos, UX/UI, Fullstack..."
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">
                Não Escopo (O que NÃO será feito?)
              </label>
              <textarea
                rows={2}
                value={naoEscopo}
                onChange={(e) => setNaoEscopo(e.target.value)}
                placeholder="Ex: App nativo iOS/Android, folha de pagamento..."
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Stakeholders e Resistentes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-bold text-violet-300 mb-1">
                Stakeholders (Patrocinadores, Equipe)
              </label>
              <textarea
                rows={2}
                value={stakeholders}
                onChange={(e) => setStakeholders(e.target.value)}
                placeholder="Ex: Patrocinador (CEO), Cliente (PMO)..."
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-pink-300 mb-1">
                Resistentes
              </label>
              <textarea
                rows={2}
                value={resistentes}
                onChange={(e) => setResistentes(e.target.value)}
                placeholder="Ex: Usuários operacionais..."
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Premissas, Restrições e Riscos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1">
                Premissas
              </label>
              <textarea
                rows={2}
                value={premissasRestricoes}
                onChange={(e) => setPremissasRestricoes(e.target.value)}
                placeholder="Ex: Dedicação exclusiva de TI..."
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-orange-300 mb-1">
                Restrições
              </label>
              <textarea
                rows={2}
                placeholder="Restrições geradas automaticamente com base no Orçamento e Prazo"
                disabled
                className="w-full px-3 py-1.5 bg-slate-900/50 border border-slate-700/50 rounded-lg text-xs text-slate-500 cursor-not-allowed"
                value={`Orçamento de R$ ${budget.toLocaleString('pt-BR')} e conformidade LGPD.`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-300 mb-1">
                Riscos
              </label>
              <textarea
                rows={2}
                value={riscos}
                onChange={(e) => setRiscos(e.target.value)}
                placeholder="Ex: Baixa adoção inicial, atrasos..."
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Plano de Ação: Orçamento e Prazo */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-black text-emerald-400 uppercase tracking-wider mb-1">
                Orçamento Máximo (R$)
              </label>
              <input
                type="number"
                step="5000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-extrabold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-indigo-400 uppercase tracking-wider mb-1">
                Prazo Limite (Meses)
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-extrabold focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              Gerar & Cadastrar Projeto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
