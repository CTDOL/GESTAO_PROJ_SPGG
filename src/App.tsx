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
import { 
  initialPMBOKData, 
  initialTasks, 
  initialTimesheet, 
  initialFiles, 
  initialDiscussions 
} from './data/initialData';
import { Project, PMBOKCanvasData, Task, DeliveryItem, TimesheetEntry, ProjectFile, DiscussionMessage } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('portfolio');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial Project: ProjTrack (PROJ-001)
  const defaultProject: Project = {
    id: 'projtrack-main',
    code: 'PROJ-001',
    name: initialPMBOKData.nomeProjeto,
    description: 'Sistema Integrado de Controle de Projetos (PMBOK Canvas v5)',
    budget: 120000,
    durationMonths: 6,
    canvasData: {
      ...initialPMBOKData,
      codigoProjeto: 'PROJ-001',
    },
    tasks: initialTasks,
    timesheet: initialTimesheet,
    files: initialFiles,
    discussions: initialDiscussions,
  };

  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');

  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  const generateTestProjects = () => Array.from({ length: 4 }).map((_, i) => ({
    ...defaultProject,
    id: `test-proj-${i + 1}`,
    code: `PROJ-00${i + 1}`,
    name: `${defaultProject.name} - Fase ${i + 1}`,
    budget: defaultProject.budget + i * 10000,
    canvasData: {
      ...defaultProject.canvasData,
      codigoProjeto: `PROJ-00${i + 1}`,
      nomeProjeto: `${defaultProject.name} - Fase ${i + 1}`,
    }
  }));

  const loadLocalFallback = () => {
    const saved = localStorage.getItem('projtrack_db');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 4) {
          setProjects(parsed);
          setActiveProjectId(parsed[0].id);
          return true;
        }
      } catch (e) {
        console.error('Erro ao ler localStorage', e);
      }
    }
    return false;
  };

  useEffect(() => {
    fetch('/api.php')
      .then((res) => {
        if (!res.ok) throw new Error('API unreachable');
        return res.json();
      })
      .then((data: Project[]) => {
        if (data && data.length >= 4) {
          setProjects(data);
          setActiveProjectId(data[0].id);
        } else {
          const testProjects = generateTestProjects();
          setProjects(testProjects);
          setActiveProjectId(testProjects[0].id);
        }
        setIsDataLoaded(true);
      })
      .catch((err) => {
        console.warn('API error, loading local fallback ou test projects:', err);
        const hasLocal = loadLocalFallback();
        if (!hasLocal) {
          const testProjects = generateTestProjects();
          setProjects(testProjects);
          setActiveProjectId(testProjects[0].id);
        }
        setIsDataLoaded(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isLoading || !isDataLoaded) return;
    
    fetch('/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projects),
    }).catch((err) => console.error('Failed to sync to VPS:', err));
  }, [projects, isLoading, isDataLoaded]);


  useEffect(() => {
    if (isLoading) return;
    const saveTimer = setTimeout(() => {
      const payload = JSON.stringify(projects);
      
      // Salva localmente por segurança
      localStorage.setItem('projtrack_db', payload);

      // Sincroniza com a API na VPS
      fetch('/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      }).catch(err => console.log('Salvo apenas no localStorage (API offline):', err));
      
    }, 1000); // Debounce de 1 segundo

    return () => clearTimeout(saveTimer);
  }, [projects, isLoading]);

  // Active Project Data
  const activeProject = projects.find((p) => p.id === activeProjectId) || (projects.length > 0 ? projects[0] : null);

  // Helper to update active project state
  const updateActiveProject = (updater: (prevProject: Project) => Project) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) => (p.id === activeProjectId ? updater(p) : p))
    );
  };

  const handleAddProject = (newProject: Project) => {
    setProjects((prev) => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    setActiveTab('canvas');
  };

  const handleEditProject = (updatedProject: Project) => {
    setProjects((prev) => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prevProjects) => {
      const updatedProjects = prevProjects.filter((p) => p.id !== projectId);
      
      // If we deleted the active project, switch to the first available project
      if (activeProjectId === projectId) {
        if (updatedProjects.length > 0) {
          setActiveProjectId(updatedProjects[0].id);
        } else {
          setActiveProjectId('');
        }
      }
      return updatedProjects;
    });
  };

  const setCanvasData = (action: React.SetStateAction<PMBOKCanvasData>) => {
    updateActiveProject((prev) => ({
      ...prev,
      canvasData: typeof action === 'function' ? action(prev.canvasData) : action,
    }));
  };

  const setTasks = (action: React.SetStateAction<Task[]>) => {
    updateActiveProject((prev) => ({
      ...prev,
      tasks: typeof action === 'function' ? action(prev.tasks) : action,
    }));
  };

  const setDeliveries = (action: React.SetStateAction<DeliveryItem[]>) => {
    updateActiveProject((prev) => {
      const nextDeliveries = typeof action === 'function' ? action(prev.canvasData.planoAcao) : action;
      return {
        ...prev,
        canvasData: {
          ...prev.canvasData,
          planoAcao: nextDeliveries,
        },
      };
    });
  };

  const setTimesheet = (action: React.SetStateAction<TimesheetEntry[]>) => {
    updateActiveProject((prev) => ({
      ...prev,
      timesheet: typeof action === 'function' ? action(prev.timesheet) : action,
    }));
  };

  const setFiles = (action: React.SetStateAction<ProjectFile[]>) => {
    updateActiveProject((prev) => ({
      ...prev,
      files: typeof action === 'function' ? action(prev.files) : action,
    }));
  };

  const setDiscussions = (action: React.SetStateAction<DiscussionMessage[]>) => {
    updateActiveProject((prev) => ({
      ...prev,
      discussions: typeof action === 'function' ? action(prev.discussions) : action,
    }));
  };


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

        {/* Modal needs to be rendered here so they can actually create the project */}
        {isNewProjectModalOpen && (
          <NewProjectModal
            isOpen={isNewProjectModalOpen}
            onClose={() => setIsNewProjectModalOpen(false)}
            onAddProject={handleAddProject}
            existingProjectsCount={0}
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
          projects={projects}
          activeProjectId={activeProject.id}
          onSelectProject={setActiveProjectId}
          onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
          onOpenEditProjectModal={() => setIsEditModalOpen(true)}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 print:pt-0 print:px-0">
        {activeTab === 'portfolio' && (
          <PortfolioDashboardView
            projects={projects}
            onSelectProject={setActiveProjectId}
            onDeleteProject={handleDeleteProject}
            onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
            setActiveTab={setActiveTab}
          />
        )}
        {/* Render rest of the tabs... */}

        {activeTab === 'canvas' && (
          <PMBOKCanvasView
            canvasData={activeProject.canvasData}
            setCanvasData={setCanvasData}
            onDeleteProject={() => handleDeleteProject(activeProject.id)}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            canvasData={activeProject.canvasData}
            tasks={activeProject.tasks}
            timesheet={activeProject.timesheet}
          />
        )}

        {activeTab === 'kanban' && (
          <KanbanView
            tasks={activeProject.tasks}
            setTasks={setTasks}
            deliveries={activeProject.canvasData.planoAcao}
          />
        )}

        {activeTab === 'gantt' && (
          <GanttView
            deliveries={activeProject.canvasData.planoAcao}
            setDeliveries={setDeliveries}
            budget={activeProject.budget}
            durationMonths={activeProject.durationMonths}
          />
        )}

        {activeTab === 'timesheet' && (
          <TimesheetView
            timesheet={activeProject.timesheet}
            setTimesheet={setTimesheet}
            deliveries={activeProject.canvasData.planoAcao}
          />
        )}

        {activeTab === 'files' && (
          <FilesCommView
            files={activeProject.files}
            setFiles={setFiles}
            discussions={activeProject.discussions}
            setDiscussions={setDiscussions}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            canvasData={activeProject.canvasData}
            tasks={activeProject.tasks}
            timesheet={activeProject.timesheet}
          />
        )}
      </main>

      {isNewProjectModalOpen && (
        <NewProjectModal
          isOpen={isNewProjectModalOpen}
          onClose={() => setIsNewProjectModalOpen(false)}
          onAddProject={handleAddProject}
          existingProjectsCount={projects.length}
        />
      )}

      {isEditModalOpen && (
        <NewProjectModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onAddProject={handleAddProject}
          onEditProject={handleEditProject}
          projectToEdit={activeProject}
          existingProjectsCount={projects.length}
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
