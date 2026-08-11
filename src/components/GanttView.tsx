import React from 'react';
import { DeliveryItem } from '../types';
import { Calendar, DollarSign, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface GanttViewProps {
  deliveries: DeliveryItem[];
  setDeliveries: React.Dispatch<React.SetStateAction<DeliveryItem[]>>;
  budget: number;
  durationMonths: number;
}

export const GanttView: React.FC<GanttViewProps> = ({ deliveries, setDeliveries, budget, durationMonths }) => {
  const months = ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6'];

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
    // Map month number to grid columns
    switch (monthNumber) {
      case 1: return { colStart: 1, span: 1 };
      case 2: return { colStart: 2, span: 1 };
      case 3: return { colStart: 2, span: 2 };
      case 4: return { colStart: 3, span: 2 };
      case 5: return { colStart: 4, span: 2 };
      case 6: return { colStart: 5, span: 2 };
      default: return { colStart: 1, span: 1 };
    }
  };

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
            Acompanhamento das 5 entregas chave do projeto com percentual físico e desembolso orçamentário.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Entrega Atual</div>
            <div className="text-sm font-extrabold text-indigo-400">Mês 4 (Desenvolvimento Módulos)</div>
          </div>
        </div>
      </div>

      {/* Gantt Interactive Chart Container */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        
        {/* Months Header Grid */}
        <div className="hidden md:grid grid-cols-6 gap-2 text-center text-xs font-bold text-slate-300 pb-3 border-b border-slate-800">
          {months.map((m, idx) => (
            <div key={m} className={`py-2 rounded-lg ${idx === 3 ? 'bg-indigo-950/60 text-indigo-300 border border-indigo-500/40' : 'bg-slate-900/60'}`}>
              <div>{m}</div>
              <div className="text-[10px] font-medium text-slate-400">
                {idx === 3 ? '(Mês Atual)' : ''}
              </div>
            </div>
          ))}
        </div>

        {/* Deliveries Timeline Rows */}
        <div className="space-y-4">
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
                  {months.map((_, index) => {
                    const monthIndex = index + 1;
                    const isActiveMonth = monthIndex >= colStart && monthIndex < colStart + span;

                    return (
                      <div key={index} className="h-6 flex items-center justify-center">
                        {isActiveMonth ? (
                          <div className="w-full h-full bg-slate-800 rounded-md overflow-hidden p-0.5 relative group">
                            <div
                              className={`h-full rounded transition-all duration-300 ${
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
                        ) : (
                          <div className="w-full h-1 bg-slate-800/40 rounded" />
                        )}
                      </div>
                    );
                  })}
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
