import { Project } from '../types';

const STORAGE_KEY = 'projtrack_db';
const API_URL = '/api/database';

let lastModifiedTimestamp = '0';

export const storageService = {
  /**
   * Lê os projetos do LocalStorage.
   */
  loadFromLocal: (): Project[] | null => {
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
  },

  /**
   * Salva os projetos no LocalStorage.
   */
  saveToLocal: (projects: Project[]): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Erro ao salvar no localStorage', e);
    }
  },

  /**
   * Carrega os projetos da API remota.
   */
  loadFromApi: async (): Promise<Project[] | null> => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('API unreachable');
      
      const mtime = res.headers.get('X-Last-Modified');
      if (mtime) lastModifiedTimestamp = mtime;

      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('API error:', e);
    }
    return null;
  },

  /**
   * Sincroniza os projetos com a API remota.
   */
  syncToApi: async (projects: Project[]): Promise<void> => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Last-Modified': lastModifiedTimestamp
        },
        body: JSON.stringify(projects),
      });

      if (res.status === 409) {
        // Dispara um evento para a UI (ProjectContext) alertar e recarregar
        window.dispatchEvent(new Event('sync-conflict'));
        return;
      }

      const mtime = res.headers.get('X-Last-Modified');
      if (mtime) {
        lastModifiedTimestamp = mtime;
      } else {
        lastModifiedTimestamp = Date.now().toString(); // Fallback se a API não retornar no dev
      }
    } catch (err) {
      console.warn('Falha na sincronização com a VPS (Offline):', err);
    }
  },
};

