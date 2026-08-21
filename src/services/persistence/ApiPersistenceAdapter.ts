import { Project } from '../../types';
import { RemotePersistenceAdapter } from './PersistenceAdapter';

const API_URL = '/api.php';

export class ApiPersistenceAdapter implements RemotePersistenceAdapter {
  private lastModifiedTimestamp = '0';

  async loadRemote(): Promise<Project[] | null> {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('API unreachable');

      const mtime = res.headers.get('X-Last-Modified');
      if (mtime) this.lastModifiedTimestamp = mtime;

      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('API error:', e);
    }
    return null;
  }

  async saveRemote(projects: Project[]): Promise<{ conflict: boolean }> {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Last-Modified': this.lastModifiedTimestamp,
        },
        body: JSON.stringify(projects),
      });

      if (res.status === 409) {
        return { conflict: true };
      }

      const mtime = res.headers.get('X-Last-Modified');
      this.lastModifiedTimestamp = mtime || Date.now().toString();
    } catch (err) {
      console.warn('Falha na sincronização com a VPS (Offline):', err);
    }
    return { conflict: false };
  }
}
