import { useEffect, useState } from 'react';
import { Project } from '../types';
import { RemotePersistenceAdapter, LocalPersistenceAdapter } from '../services/persistence/PersistenceAdapter';

export function usePersistedProjects(
  remote: RemotePersistenceAdapter,
  local: LocalPersistenceAdapter
) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Carga inicial: API remota -> localStorage -> vazio
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);

      const remoteData = await remote.loadRemote();
      if (remoteData) {
        setProjects(remoteData);
      } else {
        const localData = local.loadLocal();
        setProjects(localData ?? []);
      }

      setIsDataLoaded(true);
      setIsLoading(false);
    };

    initializeData();
  }, [remote, local]);

  // Conflito de concorrência (409): avisa e recarrega para não perder/sobrescrever dados
  useEffect(() => {
    const handleConflict = () => {
      alert(
        'Alerta: Os dados foram modificados por outro usuário em outra sessão.\n' +
          'A tela será recarregada para garantir que você não perca ou sobrescreva informações importantes.'
      );
      window.location.reload();
    };

    window.addEventListener('sync-conflict', handleConflict);
    return () => window.removeEventListener('sync-conflict', handleConflict);
  }, []);

  // Sincronização (save) com debounce
  useEffect(() => {
    if (isLoading || !isDataLoaded) return;

    const saveTimer = setTimeout(async () => {
      local.saveLocal(projects);
      const { conflict } = await remote.saveRemote(projects);
      if (conflict) {
        window.dispatchEvent(new Event('sync-conflict'));
      }
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [projects, isLoading, isDataLoaded, remote, local]);

  return { projects, setProjects, isLoading };
}
