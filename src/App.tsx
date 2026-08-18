import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PortfolioDashboardView } from './components/PortfolioDashboardView';
import { PMBOKCanvasView } from './components/PMBOKCanvasView';
import { DashboardView } from './components/DashboardView';
import { KanbanView } from './components/KanbanView';
import { GanttView } from './components/GanttView';
import { TimesheetView } from './components/TimesheetView';
import { FilesCommView } from './components/FilesCommView';
import { ReportsView } from './components/ReportsView';
import { NewProjectModal } from './components/NewProjectModal';
import { useProjectStore } from './store/ProjectContext';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('portfolio');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const { 
    projects, 
    activeProjectId, 
    activeProject, 
    isLoading,
    setActiveProjectId,
    deleteProject
  } = useProjectStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const path = window.location.pathname;
    
    if (params.get('action') === 'novo' || path === '/novo' || path === '/cadastro') {
      setIsNewProjectModalOpen(true);
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="animate-pulse text-xl text-indigo-400">Carregando dados da VPS...</div>
      </div>
    );
  }

  // EMPTY STATE: Se não houver projetos, exibe apenas a tela de boas-vindas
  if (projects.length === 0 || !activeProject) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-8 shadow-2xl border border-slate-800">
            <svg className="w-12 h-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Bem-vindo ao ProjTrack</h2>
          <p className="text-slate-400 max-w-lg mb-10 text-sm leading-relaxed">
            Seu ambiente de trabalho está limpo e pronto. Crie o seu primeiro projeto para começar a planejar o Canvas v5, gerenciar o Kanban e acompanhar o Orçamento.
          </p>
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl font-bold transition shadow-xl shadow-indigo-500/25 flex items-center space-x-3 cursor-pointer hover:scale-105 active:scale-95"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-lg">Cadastrar Novo Projeto</span>
          </button>
        </div>

        {isNewProjectModalOpen && (
          <NewProjectModal
            isOpen={isNewProjectModalOpen}
            onClose={() => setIsNewProjectModalOpen(false)}
          />
        )}
      </div>
    );
  }

  // NORMAL STATE: Renderiza a aplicação completa
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white print:bg-white print:text-black">
      {/* Top Navbar with Project Selector */}
      <div className="print:hidden">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
          onOpenEditProjectModal={() => setIsEditModalOpen(true)}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 print:pt-0 print:px-0">
        {activeTab === 'portfolio' && (
          <PortfolioDashboardView
            onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'canvas' && <PMBOKCanvasView />}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'kanban' && <KanbanView />}
        {activeTab === 'gantt' && <GanttView />}
        {activeTab === 'timesheet' && <TimesheetView />}
        {activeTab === 'files' && <FilesCommView />}
        {activeTab === 'reports' && <ReportsView />}
      </main>

      {isNewProjectModalOpen && (
        <NewProjectModal
          isOpen={isNewProjectModalOpen}
          onClose={() => setIsNewProjectModalOpen(false)}
        />
      )}

      {isEditModalOpen && (
        <NewProjectModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          projectToEdit={activeProject}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-800/80 py-4 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-400">ProjTrack PWA</span> • Gestão de Portfólio & Controle de Projetos (Canvas v5)
          </div>
          <div>
            Projeto Ativo: <span className="text-indigo-400 font-semibold font-mono">[{activeProject.code}]</span> {activeProject.name}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
