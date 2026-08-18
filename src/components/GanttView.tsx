import React from 'react';
import { DeliveryItem } from '../types';
import { useProjectStore } from '../store/ProjectContext';
import { Calendar, DollarSign, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const GanttView: React.FC = () => {
  const { activeProject, setDeliveries } = useProjectStore();
  
  if (!activeProject) return null;
  
  const deliveries = activeProject.canvasData.planoAcao;
  const budget = activeProject.budget;
  const durationMonths = activeProject.durationMonths;
  

  const handleProgressChange = (id: string, newProgress: number) => {
    setDeliveries(prev => prev.map(del => {
      if (del.id === id) {
        const completed = newProgress === 100;
        const status = completed ? 'Concluído' : newProgress > 0 ? 'Em Andamento' : 'Planejado';
        return { ...del, progress: newProgress, completed, status };
      }
      return del;
    }));
  };

  const getStartAndSpan = (monthNumber: number) => {
    // Se o projeto for maior, podemos ajustar o span. Por padrão, cada entrega ocupa 1 mês.
    // Para manter a fluidez de projetos que duram 6 meses mas têm 5 entregas, podemos manter 
    // um span dinâmico simples:
    return { colStart: monthNumber, span: 1 };
  };

  // Dinâmico: Array de meses baseado na duração do projeto (no mínimo 1 mês)
  const totalMonths = Math.max(1, durationMonths);
  const months = Array.from({ length: totalMonths }, (_, i) => `Mês ${i + 1}`);

  // Dinâmico: Descobre o "Mês Atual" baseado na primeira entrega que está "Em Andamento"
  const currentDelivery = deliveries.find(d => d.status === 'Em Andamento') || deliveries.find(d => d.status === 'Planejado') || deliveries[deliveries.length - 1];
  const currentMonthNumber = currentDelivery ? currentDelivery.monthNumber : 1;
  const currentMonthIndex = currentMonthNumber - 1;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-xs font-bold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
              Cronograma Oficial
            </span>
            <span className="text-xs text-slate-400">Ciclo de {durationMonths} Meses - Orçamento R$ {budget.toLocaleString('pt-BR')}</span>
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">Visão de Portfólio: Gantt & Milestones</h1>
          <p className="text-xs text-slate-400">
            Acompanhamento das entregas chave do projeto com percentual físico e desembolso orçamentário.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Entrega Atual ({currentDelivery?.status})</div>
            <div className="text-sm font-extrabold text-indigo-400">Mês {currentMonthNumber} ({currentDelivery?.name.substring(0, 20)}...)</div>
          </div>
        </div>
      </div>

      {/* Gantt Interactive Chart Container */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 overflow-x-auto">
        
        {/* Months Header Grid */}
        <div 
          className="hidden md:grid gap-2 text-center text-xs font-bold text-slate-300 pb-3 border-b border-slate-800 min-w-[600px]"
          style={{ gridTemplateColumns: `repeat(${totalMonths}, minmax(0, 1fr))` }}
        >
          {months.map((m, idx) => (
            <div key={m} className={`py-2 rounded-lg ${idx === currentMonthIndex ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/40' : 'bg-slate-900/60'}`}>
              <div>{m}</div>
              <div className="text-[10px] font-medium text-slate-400">
                {idx === currentMonthIndex ? '(Mês Atual)' : ''}
              </div>
            </div>
          ))}
        </div>

        {/* Deliveries Timeline Rows */}
        <div className="space-y-4 min-w-[600px]">
          {deliveries.map((del) => {
            const { colStart, span } = getStartAndSpan(del.monthNumber);

            return (
              <div key={del.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/30 transition">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="h-6 w-6 rounded-md bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                      {del.order}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{del.name}</h4>
                      <div className="text-[11px] text-slate-400">
                        Alocação: <span className="font-semibold text-emerald-400">R$ {del.investment.toLocaleString('pt-BR')}</span> | Prazo: {del.month}
                      </div>
                    </div>
                  </div>

                  {/* Status & Progress Slider */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={del.progress}
                        onChange={(e) => handleProgressChange(del.id, Number(e.target.value))}
                        className="w-24 accent-indigo-500 cursor-pointer"
                      />
                      <span className="text-xs font-extrabold text-indigo-300 w-10 text-right">{del.progress}%</span>
                    </div>

                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                      del.status === 'Concluído' ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' :
                      del.status === 'Em Andamento' ? 'bg-indigo-950 text-indigo-300 border-indigo-500/30' :
                      'bg-slate-900 text-slate-400 border-slate-700'
                    }`}>
                      {del.status}
                    </span>
                  </div>
                </div>

                {/* Visual Bar representation in Gantt */}
                <div className="grid grid-cols-6 gap-2 items-center bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                  {/* Células vazias antes da barra */}
                  {Array.from({ length: colStart - 1 }).map((_, i) => (
                    <div key={`before-${i}`} className="w-full h-1 bg-slate-800/40 rounded" />
                  ))}

                  {/* Barra Única do Gantt com Span */}
                  <div
                    className="h-6 flex items-center justify-center bg-slate-800 rounded-md overflow-hidden p-0.5 relative group"
                    style={{ gridColumn: `span ${span} / span ${span}` }}
                  >
                    <div
                      className={`absolute left-0 top-0.5 bottom-0.5 rounded transition-all duration-300 ${
                        del.progress === 100
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-500'
                          : 'bg-gradient-to-r from-indigo-600 to-violet-500'
                      }`}
                      style={{ width: `${del.progress}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow">
                      {del.progress}%
                    </div>
                  </div>

                  {/* Células vazias depois da barra */}
                  {Array.from({ length: 6 - (colStart - 1 + span) }).map((_, i) => (
                    <div key={`after-${i}`} className="w-full h-1 bg-slate-800/40 rounded" />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Deliverable Milestones Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {deliveries.map((del) => (
          <div key={del.id} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {del.month}
              </span>
              <span className="text-xs font-extrabold text-emerald-400">
                R$ {del.investment.toLocaleString('pt-BR')}
              </span>
            </div>
            <h5 className="text-xs font-bold text-slate-100 line-clamp-2">{del.name}</h5>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span>Progresso</span>
              <span className="font-bold text-indigo-300">{del.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
