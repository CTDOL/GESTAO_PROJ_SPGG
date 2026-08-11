import React from 'react';
import { 
  FolderPlus, 
  Sparkles, 
  ShieldCheck, 
  Target, 
  TrendingUp, 
  Kanban, 
  CalendarRange, 
  Clock, 
  FolderGit2, 
  FileSpreadsheet,
  FolderKanban
} from 'lucide-react';
import { Project } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onOpenNewProjectModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  projects,
  activeProjectId,
  onSelectProject,
  onOpenNewProjectModal,
}) => {
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const tabs = [
    { id: 'portfolio', label: 'Portfólio de Projetos', icon: FolderKanban },
    { id: 'canvas', label: 'PMBOK Canvas', icon: Target },
    { id: 'dashboard', label: 'Dashboard Executivo', icon: TrendingUp },
    { id: 'kanban', label: 'Quadro Kanban', icon: Kanban },
    { id: 'gantt', label: 'Cronograma Gantt', icon: CalendarRange },
    { id: 'timesheet', label: 'Timesheet', icon: Clock },
    { id: 'files', label: 'Arquivos & Chat', icon: FolderGit2 },
    { id: 'reports', label: 'Relatórios PDF/Excel', icon: FileSpreadsheet },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Project Selector with ID */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">ProjTrack</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  Portfólio ({projects.length})
                </span>
              </div>

              {/* Selector for Registered Projects with ID */}
              <div className="relative flex items-center mt-0.5">
                <select
                  value={activeProjectId}
                  onChange={(e) => onSelectProject(e.target.value)}
                  className="bg-slate-950/80 border border-slate-800 text-xs font-bold text-indigo-300 rounded-lg px-2 py-0.5 pr-6 focus:outline-none focus:border-indigo-500 cursor-pointer max-w-xs truncate font-mono"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.code}] {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action: New Project Button & Financial Info */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenNewProjectModal}
              className="flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/25 cursor-pointer"
            >
              <FolderPlus className="h-4 w-4" />
              <span>+ Novo Projeto</span>
            </button>

            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Conformidade LGPD</span>
            </div>

            <div className="hidden lg:block text-right">
              <div className="text-xs font-semibold text-slate-200">
                Orçamento: R$ {activeProject.budget.toLocaleString('pt-BR')}
              </div>
              <div className="text-[11px] text-slate-400">
                Prazo: {activeProject.durationMonths} Meses
              </div>
            </div>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto no-scrollbar pb-1 pt-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
