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
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
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

  const [projects, setProjects] = useState<Project[]>([defaultProject]);
  const [activeProjectId, setActiveProjectId] = useState<string>(defaultProject.id);

  useEffect(() => {
    fetch('/api.php')
      .then((res) => {
        if (!res.ok) throw new Error('API não disponível');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
          setActiveProjectId(data[0].id);
        } else {
          loadLocalFallback();
        }
      })
      .catch((err) => {
        console.log('Backend indisponível (normal em dev local), usando localStorage:', err);
        loadLocalFallback();
      })
      .finally(() => setIsLoading(false));
  }, []);

  const loadLocalFallback = () => {
    const saved = localStorage.getItem('projtrack_db');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed);
          setActiveProjectId(parsed[0].id);
        }
      } catch (e) {
        console.error('Erro ao ler localStorage', e);
      }
    }
  };

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
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

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

  const handleDeleteProject = (projectId: string) => {
    setProjects((prevProjects) => {
      const updatedProjects = prevProjects.filter((p) => p.id !== projectId);
      
      // If we deleted the active project, switch to the first available project
      if (activeProjectId === projectId) {
        if (updatedProjects.length > 0) {
          setActiveProjectId(updatedProjects[0].id);
        } else {
          // If no projects remain, create a clean default template project
          const templateCode = `PROJ-00${projects.length + 1}`;
          const templateProject: Project = {
            id: `proj-template-${Date.now()}`,
            code: templateCode,
            name: 'Novo Projeto Exemplo',
            description: 'Projeto limpo recém-criado',
            budget: 100000,
            durationMonths: 6,
            canvasData: {
              ...initialPMBOKData,
              nomeProjeto: 'Novo Projeto Exemplo',
              codigoProjeto: templateCode,
            },
            tasks: [],
            timesheet: [],
            files: [],
            discussions: [],
          };
          setActiveProjectId(templateProject.id);
          return [templateProject];
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar with Project Selector */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
        onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'portfolio' && (
          <PortfolioDashboardView
            projects={projects}
            onSelectProject={setActiveProjectId}
            onDeleteProject={handleDeleteProject}
            onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
            setActiveTab={setActiveTab}
          />
        )}

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

      {/* New Project Registration Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onAddProject={handleAddProject}
        existingProjectsCount={projects.length}
      />

      {/* PWA Prompt Banner */}
      <PWAInstallPrompt />

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
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
