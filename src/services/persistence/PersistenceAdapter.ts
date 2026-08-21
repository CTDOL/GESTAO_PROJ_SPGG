import { Project } from '../../types';

export interface RemotePersistenceAdapter {
  loadRemote(): Promise<Project[] | null>;
  saveRemote(projects: Project[]): Promise<{ conflict: boolean }>;
}

export interface LocalPersistenceAdapter {
  loadLocal(): Project[] | null;
  saveLocal(projects: Project[]): void;
}
