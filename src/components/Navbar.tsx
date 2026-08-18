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
  FolderKanban,
  Settings
} from 'lucide-react';
import { Project } from '../types';
import { useProjectStore } from '../store/ProjectContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewProjectModal: () => void;
  onOpenEditProjectModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewProjectModal,
  onOpenEditProjectModal,
}) => {
  const { projects, activeProjectId, activeProject, setActiveProjectId } = useProjectStore();
  
  if (!activeProject) return null; // Fallback se ainda não carregou


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

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProjects = projects
    .filter(p => 
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 100); // Limita a 100 para não travar o DOM com 5000 divs

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

              {/* Custom Searchable Dropdown */}
              <div className="relative flex items-center mt-0.5 space-x-2">
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-slate-950/80 border border-slate-800 text-xs font-bold text-indigo-300 rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer max-w-xs w-64 text-left truncate font-mono flex justify-between items-center"
                  >
                    <span className="truncate">[{activeProject.code}] {activeProject.name}</span>
                    <svg className="w-3 h-3 ml-2 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                      <div className="p-2 border-b border-slate-700">
                        <input
                          type="text"
                          placeholder="Pesquisar por ID ou Nome..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          autoFocus
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div className="max-h-64 overflow-y-auto p-1 custom-scrollbar">
                        {filteredProjects.length === 0 ? (
                          <div className="p-2 text-xs text-slate-500 text-center">Nenhum projeto encontrado.</div>
                        ) : (
                          filteredProjects.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => {
                                setActiveProjectId(p.id);
                                setIsDropdownOpen(false);
                                setSearchTerm('');
                              }}
                              className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-mono truncate transition-colors cursor-pointer ${
                                p.id === activeProjectId 
                                  ? 'bg-indigo-600 text-white' 
                                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              [{p.code}] {p.name}
                            </button>
                          ))
                        )}
                        {projects.length > 100 && filteredProjects.length === 100 && (
                          <div className="p-1 text-[10px] text-slate-500 text-center">Refine a busca para ver mais...</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Botão de Editar Projeto Atual */}
                {onOpenEditProjectModal && (
                  <button
                    onClick={onOpenEditProjectModal}
                    title="Editar Projeto Atual"
                    className="p-1.5 bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                )}
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
