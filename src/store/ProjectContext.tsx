import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { Project, PMBOKCanvasData, Task, DeliveryItem, TimesheetEntry, ProjectFile, DiscussionMessage, TeamMember } from '../types';
import { usePersistedProjects } from '../hooks/usePersistedProjects';
import { ApiPersistenceAdapter } from '../services/persistence/ApiPersistenceAdapter';
import { LocalStoragePersistenceAdapter } from '../services/persistence/LocalStoragePersistenceAdapter';
import { initialPMBOKData, initialTasks, initialTimesheet, initialFiles, initialDiscussions } from '../data/initialData';

interface ProjectContextType {
  projects: Project[];
  activeProjectId: string;
  activeProject: Project | null;
  isLoading: boolean;
  setActiveProjectId: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  setCanvasData: (action: React.SetStateAction<PMBOKCanvasData>) => void;
  setTasks: (action: React.SetStateAction<Task[]>) => void;
  setDeliveries: (action: React.SetStateAction<DeliveryItem[]>) => void;
  setTimesheet: (action: React.SetStateAction<TimesheetEntry[]>) => void;
  setFiles: (action: React.SetStateAction<ProjectFile[]>) => void;
  setDiscussions: (action: React.SetStateAction<DiscussionMessage[]>) => void;
  setTeamMembers: (action: React.SetStateAction<TeamMember[]>) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjectStore = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectStore must be used within a ProjectProvider');
  }
  return context;
};

// Projeto default (fallback caso não venha da API/Local)
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
  status: 'Iniciado',
};

const generateTestProjects = () => Array.from({ length: 50 }).map((_, i) => {
  const isOdd = i % 2 !== 0;
  return {
    ...defaultProject,
    id: `test-proj-${i + 1}-${Date.now()}`,
    code: `PROJ-00${i + 1}`,
    name: `${defaultProject.name} - Fase ${i + 1} (Load Test)`,
    budget: defaultProject.budget + i * 15000,
    durationMonths: (i % 12) + 1,
    canvasData: {
      ...defaultProject.canvasData,
      codigoProjeto: `PROJ-00${i + 1}`,
      nomeProjeto: `${defaultProject.name} - Fase ${i + 1} (Load Test)`,
    },
    status: (isOdd ? 'Aguardando' : 'Iniciado') as 'Aguardando' | 'Iniciado',
  };
});

// Adapters são singletons de módulo: precisam de identidade estável entre
// renders para não disparar os efeitos de load/save do hook repetidamente.
const remoteAdapter = new ApiPersistenceAdapter();
const localAdapter = new LocalStoragePersistenceAdapter();

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { projects, setProjects, isLoading } = usePersistedProjects(remoteAdapter, localAdapter);
  const [activeProjectId, setActiveProjectId] = React.useState<string>('');

  // Define o projeto ativo assim que a carga inicial termina
  useEffect(() => {
    if (!isLoading && !activeProjectId && projects.length > 0) {
      setActiveProjectId(projects[0].id);
    }
  }, [isLoading, projects, activeProjectId]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || (projects.length > 0 ? projects[0] : null);

  const updateActiveProject = (updater: (prevProject: Project) => Project) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) => (p.id === activeProjectId ? updater(p) : p))
    );
  };

  const addProject = (newProject: Project) => {
    setProjects((prev) => [...prev, newProject]);
    setActiveProjectId(newProject.id);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects((prev) => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const deleteProject = (projectId: string) => {
    setProjects((prevProjects) => {
      const updatedProjects = prevProjects.filter((p) => p.id !== projectId);
      if (activeProjectId === projectId) {
        setActiveProjectId(updatedProjects.length > 0 ? updatedProjects[0].id : '');
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

  const setTeamMembers = (action: React.SetStateAction<TeamMember[]>) => {
    updateActiveProject((prev) => ({
      ...prev,
      teamMembers: typeof action === 'function' ? action(prev.teamMembers || []) : action,
    }));
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      activeProjectId,
      activeProject,
      isLoading,
      setActiveProjectId,
      addProject,
      updateProject,
      deleteProject,
      setCanvasData,
      setTasks,
      setDeliveries,
      setTimesheet,
      setFiles,
      setDiscussions,
      setTeamMembers
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
