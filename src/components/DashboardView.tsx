import React from 'react';
import { PMBOKCanvasData, Task, TimesheetEntry } from '../types';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Users, 
  PieChart,
  Target,
  FileCheck
} from 'lucide-react';

interface DashboardViewProps {
  canvasData: PMBOKCanvasData;
  tasks: Task[];
  timesheet: TimesheetEntry[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ canvasData, tasks, timesheet }) => {
  const totalInvestment = canvasData.planoAcao.reduce((acc, curr) => acc + curr.investment, 0);
  
  // Realized investment calculation based on completed or in-progress deliveries
  const realizedInvestment = canvasData.planoAcao.reduce((acc, curr) => {
    return acc + (curr.investment * (curr.progress / 100));
  }, 0);

  const completedDeliveries = canvasData.planoAcao.filter(d => d.progress === 100).length;
  const overallProgress = Math.round(
    canvasData.planoAcao.reduce((acc, curr) => acc + curr.progress, 0) / canvasData.planoAcao.length
  );

  const totalHoursSpent = tasks.reduce((acc, curr) => acc + curr.hoursSpent, 0);
  const totalHoursEstimated = tasks.reduce((acc, curr) => acc + curr.estimatedHours, 0);

  const taskStats = {
    backlog: tasks.filter(t => t.status === 'backlog').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    review: tasks.filter(t => t.status === 'review').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Projeto Em Execução
              </span>
              <span className="text-xs text-slate-400">Mês 4 de 6</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">Dashboard Executivo de Portfólio</h1>
            <p className="text-xs text-slate-300 mt-1">
              Painel consolidado do ProjTrack para acompanhamento de KPIs de prazo, orçamento, avanço físico e governança LGPD.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <div>
                <div className="font-bold text-slate-200">LGPD OK</div>
                <div className="text-[10px] text-slate-400">Auditoria Ativa</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Progresso Geral */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 glass-panel-hover">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Avanço Físico</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{overallProgress}%</span>
            <span className="text-xs text-emerald-400 font-bold">+15% este mês</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${overallProgress}%` }} />
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {completedDeliveries} de {canvasData.planoAcao.length} entregas finalizadas
          </div>
        </div>

        {/* KPI 2: Orçamento Alocado / Realizado */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 glass-panel-hover">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Orçamento Consumido</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-emerald-400">
              R$ {realizedInvestment.toLocaleString('pt-BR')}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${(realizedInvestment / totalInvestment) * 100}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Teto: R$ {totalInvestment.toLocaleString('pt-BR')} (Respeitado)
          </div>
        </div>

        {/* KPI 3: Horas da Equipe */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 glass-panel-hover">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Apontamento de Horas</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{totalHoursSpent}h</span>
            <span className="text-xs text-slate-400">/ {totalHoursEstimated}h estimadas</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${(totalHoursSpent / totalHoursEstimated) * 100}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            5 integrantes da TI com dedicação exclusiva
          </div>
        </div>

        {/* KPI 4: Meta de Benefício */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 glass-panel-hover">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Benefício Esperado</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-purple-300">-40%</span>
            <span className="text-xs text-slate-300">Tempo Admin</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            Eliminação de planilhas locais e automação de relatórios executivos.
          </p>
        </div>

      </div>

      {/* Middle Section: Deliveries Progress & Tasks Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Deliveries Status list (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-indigo-400" />
              Status das Entregas do Plano de Ação
            </h3>
            <span className="text-xs text-slate-400 font-medium">Investimento Total: R$ 120.000</span>
          </div>

          <div className="space-y-3">
            {canvasData.planoAcao.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/30 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="h-7 w-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                      {item.order}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{item.name}</h4>
                      <div className="text-[11px] text-slate-400">Prazo: {item.month}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-xs font-extrabold text-emerald-400">
                      R$ {item.investment.toLocaleString('pt-BR')}
                    </span>
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                      item.status === 'Concluído' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30' :
                      item.status === 'Em Andamento' ? 'bg-indigo-950 text-indigo-300 border-indigo-500/30' :
                      'bg-slate-900 text-slate-400 border-slate-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Breakdown & Risk Card (1 col) */}
        <div className="space-y-6">
          {/* Task Status Overview */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <PieChart className="h-4 w-4 text-purple-400" />
              Distribuição de Tarefas Operacionais
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-300">Concluídas</span>
                <span className="text-xs font-extrabold text-emerald-400">{taskStats.completed}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-300">Em Andamento</span>
                <span className="text-xs font-extrabold text-indigo-400">{taskStats.in_progress}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-300">Em Revisão</span>
                <span className="text-xs font-extrabold text-amber-400">{taskStats.review}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-300">Backlog / Futuras</span>
                <span className="text-xs font-extrabold text-slate-400">{taskStats.backlog}</span>
              </div>
            </div>
          </div>

          {/* Key Project Risks */}
          <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 bg-amber-950/10">
            <h3 className="text-sm font-bold text-amber-300 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Principais Riscos Monitorados
            </h3>

            <div className="space-y-2 text-xs">
              {canvasData.riscos.map(risco => (
                <div key={risco.id} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
                  <div className="font-bold text-slate-200">{risco.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{risco.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
