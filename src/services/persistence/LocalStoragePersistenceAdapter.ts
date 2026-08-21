import { Project } from '../../types';
import { LocalPersistenceAdapter } from './PersistenceAdapter';

const STORAGE_KEY = 'projtrack_db';

export class LocalStoragePersistenceAdapter implements LocalPersistenceAdapter {
  loadLocal(): Project[] | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Erro ao ler localStorage', e);
    }
    return null;
  }

  saveLocal(projects: Project[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Erro ao salvar no localStorage', e);
    }
  }
}
