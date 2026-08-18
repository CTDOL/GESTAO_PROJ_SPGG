import React, { useState, useEffect } from 'react';
import { Download, X, Sparkles, Smartphone, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState<boolean>(true);

  useEffect(() => {
    // Check if already in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      setShowBanner(false);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
      console.log('[PWA] ProjTrack foi instalado com sucesso no dispositivo!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('Para instalar o ProjTrack PWA no celular/desktop:\n\n• No Chrome/Edge: Clique no ícone de instalar na barra de navegação.\n• No iOS Safari: Clique em Compartilhar > Adicionar à Tela de Início.');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in max-w-sm w-full p-4 glass-panel bg-slate-900/95 rounded-2xl border border-indigo-500/40 shadow-2xl space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h4 className="text-xs font-black text-white">Instalar App ProjTrack</h4>
              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              Acesse offline e use o ProjTrack como um app nativo no celular ou desktop!
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowBanner(false)}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          title="Fechar aviso"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center space-x-2 pt-1">
        <button
          onClick={handleInstallClick}
          className="flex-1 py-2 px-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-extrabold transition shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Instalar Aplicativo PWA</span>
        </button>

        <button
          onClick={() => setShowBanner(false)}
          className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
        >
          Agora Não
        </button>
      </div>
    </div>
  );
};
