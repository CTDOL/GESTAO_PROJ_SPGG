import React, { useState } from 'react';
import { Project } from '../types';
import { useProjectStore } from '../store/ProjectContext';
import { usePortfolioMetrics } from '../hooks/usePortfolioMetrics';
import { 
  FolderKanban, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Plus, 
  Search,
  BarChart3,
  Trash2,
  AlertTriangle,
  Tag
} from 'lucide-react';

interface PortfolioDashboardViewProps {
  onOpenNewProjectModal: () => void;
  setActiveTab: (tab: string) => void;
}

export const PortfolioDashboardView: React.FC<PortfolioDashboardViewProps> = ({
  onOpenNewProjectModal,
  setActiveTab,
}) => {
  const { projects, setActiveProjectId, deleteProject, updateProject } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [maxBudget, setMaxBudget] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Aguardando' | 'Iniciado'>('Todos');
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const { 
    totalProjects, 
    totalPortfolioBudget, 
    totalRealizedBudget, 
    averageProgress, 
    totalHoursLogged 
  } = usePortfolioMetrics(projects);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBudget = maxBudget ? p.budget <= Number(maxBudget) : true;
    
    const pStatus = p.status || 'Aguardando';
    const matchesStatus = statusFilter === 'Todos' || pStatus === statusFilter;
    
    return matchesSearch && matchesBudget && matchesStatus;
  });

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-indigo-600 text-white shadow-sm">
                Visão de Portfólio
              </span>
              <span className="text-xs text-slate-400">Dashboard Consolidado da Empresa</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">
              Dashboard Geral dos Projetos Registrados
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl">
              Identificação por ID único de cada projeto, acompanhamento de orçamento global e avanço físico em tempo real.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenNewProjectModal}
              className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Cadastrar Novo Projeto</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Portfolio KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 glass-panel-hover">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Projetos Registrados</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <FolderKanban className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{totalProjects}</span>
            <span className="text-xs text-indigo-300 font-bold">Projetos Ativos</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-3">
            Portfólio monitorado em tempo real com Canvas v5
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 glass-panel-hover">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Orçamento Global</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-emerald-400">
              R$ {totalPortfolioBudget.toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-3">
            Executado: R$ {Math.round(totalRealizedBudget).toLocaleString('pt-BR')} (
            {Math.round((totalRealizedBudget / (totalPortfolioBudget || 1)) * 100)}%)
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 glass-panel-hover">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Progresso Médio</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-purple-300">{averageProgress}%</span>
            <span className="text-xs text-emerald-400 font-bold">Avanço Físico</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${averageProgress}%` }} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 glass-panel-hover">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total de Horas TI</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{totalHoursLogged}h</span>
            <span className="text-xs text-amber-400 font-medium">Timesheet Geral</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-3 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Auditoria LGPD Habilitada</span>
          </div>
        </div>
      </div>

      {/* Projects Search & Cards Grid */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-400" />
              Lista de Projetos ({filteredProjects.length})
            </h3>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700 w-max">
              {(['Todos', 'Aguardando', 'Iniciado'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-md transition ${
                    statusFilter === status 
                      ? 'bg-indigo-600 text-white' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="number"
                placeholder="Verba Max (R$)"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 w-full sm:w-36"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por ID ou Nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Grid of Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const projProgress = Math.round(
              project.canvasData.planoAcao.reduce((a, c) => a + c.progress, 0) / (project.canvasData.planoAcao.length || 1)
            );

            const projSpent = project.canvasData.planoAcao.reduce((a, c) => a + (c.investment * (c.progress / 100)), 0);
            const totalTasks = project.tasks.length;
            const completedTasks = project.tasks.filter((t) => t.status === 'completed').length;
            const propositoText = project.canvasData.proposito[0]?.description || project.description;

            return (
              <div
                key={project.id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 flex flex-col justify-between space-y-4 group relative"
              >
                <div>
                  {/* Card Top Badges & Project ID & Delete */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 text-[10px] font-extrabold font-mono rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {project.code}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {project.durationMonths} Meses
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                        (project.status || 'Aguardando') === 'Iniciado'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}>
                        {project.status || 'Aguardando'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-extrabold text-emerald-400">
                        R$ {project.budget.toLocaleString('pt-BR')}
                      </span>

                      <button
                        onClick={() => setProjectToDelete(project)}
                        className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/80 text-rose-400 hover:text-rose-200 border border-rose-500/30 transition cursor-pointer"
                        title="Excluir Projeto"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Project Title */}
                  <h4 className="text-sm font-extrabold text-white group-hover:text-indigo-300 transition leading-snug">
                    {project.name}
                  </h4>

                  {/* Purpose / Description */}
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {propositoText}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                      <span>Progresso Físico</span>
                      <span className="text-indigo-400 font-bold">{projProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{ width: `${projProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats summary */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                    <div>
                      <span className="text-slate-400 block">Executado:</span>
                      <span className="font-extrabold text-emerald-400">
                        R$ {Math.round(projSpent).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Tarefas:</span>
                      <span className="font-extrabold text-slate-200">
                        {completedTasks} / {totalTasks}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    {updateProject && (
                      <button
                        onClick={() => {
                          const newStatus = (project.status || 'Aguardando') === 'Aguardando' ? 'Iniciado' : 'Aguardando';
                          updateProject({ ...project, status: newStatus });
                        }}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer border ${
                          (project.status || 'Aguardando') === 'Aguardando'
                            ? 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border-emerald-500/30'
                            : 'bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border-amber-500/30'
                        }`}
                      >
                        {(project.status || 'Aguardando') === 'Aguardando' ? (
                          <>
                            <span>🚀 Iniciar Projeto</span>
                          </>
                        ) : (
                          <>
                            <span>Voltar p/ Aguardando</span>
                          </>
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setActiveProjectId(project.id);
                        setActiveTab('canvas');
                      }}
                      className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer border border-indigo-500/30"
                    >
                      <span>Abrir Canvas PMBOK</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal for Project Deletion */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-rose-500/40 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="p-2 rounded-xl bg-rose-950 border border-rose-500/40">
                <AlertTriangle className="h-6 w-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Excluir Projeto</h3>
                <p className="text-xs text-rose-300">Ação irreversível</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Tem certeza que deseja excluir o projeto <strong className="text-white font-bold font-mono">[{projectToDelete.code}] {projectToDelete.name}</strong>?
              Esta ação removerá todos os dados do PMBOK Canvas, tarefas e histórico associados.
            </p>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg shadow-rose-600/30 cursor-pointer flex items-center space-x-1.5"
              >
                <Trash2 className="h-4 w-4" />
                <span>Confirmar Exclusão</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
