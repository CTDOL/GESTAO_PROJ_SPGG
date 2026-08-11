import React, { useState } from 'react';
import { TimesheetEntry, DeliveryItem } from '../types';
import { Clock, Plus, Calendar, User, FileText, CheckCircle2, TrendingUp } from 'lucide-react';

interface TimesheetViewProps {
  timesheet: TimesheetEntry[];
  setTimesheet: React.Dispatch<React.SetStateAction<TimesheetEntry[]>>;
  deliveries: DeliveryItem[];
}

export const TimesheetView: React.FC<TimesheetViewProps> = ({ timesheet, setTimesheet, deliveries }) => {
  const [date, setDate] = useState('2026-08-04');
  const [member, setMember] = useState('Lucas Mendes');
  const [role, setRole] = useState('Dev Frontend');
  const [deliveryId, setDeliveryId] = useState('del-3');
  const [hours, setHours] = useState<number>(8);
  const [description, setDescription] = useState('');

  const teamMembers = [
    { name: 'Marcos Silva', role: 'Líder Técnico' },
    { name: 'Lucas Mendes', role: 'Dev Frontend' },
    { name: 'Rodrigo Xavier', role: 'Dev Backend' },
    { name: 'Juliana Lima', role: 'Designer UX/UI' },
    { name: 'Ana Costa', role: 'Analista de QA' },
  ];

  const handleAddTimesheet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || hours <= 0) return;

    const deliveryName = deliveries.find(d => d.id === deliveryId)?.name || 'Entrega Geral';

    const newEntry: TimesheetEntry = {
      id: `ts-${Date.now()}`,
      date,
      member,
      role,
      deliveryId,
      deliveryName,
      hours,
      description
    };

    setTimesheet(prev => [newEntry, ...prev]);
    setDescription('');
    setHours(8);
  };

  const totalHoursLogged = timesheet.reduce((acc, curr) => acc + curr.hours, 0);

  // Group hours by member
  const memberHours = teamMembers.map(m => {
    const total = timesheet.filter(t => t.member === m.name).reduce((acc, curr) => acc + curr.hours, 0);
    return { ...m, hours: total };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
              Apontamento de Horas
            </span>
            <span className="text-xs text-slate-400">Controle de Capacidade da Equipe</span>
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">Módulo Timesheet & Gestão de Recursos</h1>
          <p className="text-xs text-slate-400">
            Registro diário das atividades executadas com dedicação exclusiva do time de TI ao ProjTrack.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Apontado</div>
            <div className="text-lg font-extrabold text-amber-400">{totalHoursLogged}h Registradas</div>
          </div>
        </div>
      </div>

      {/* Grid Layout: Entry Form + Member Hours Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Entry Form (1 col) */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Clock className="h-4 w-4 text-amber-400" />
            Novo Apontamento de Horas
          </h3>

          <form onSubmit={handleAddTimesheet} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Data</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Integrante da Equipe</label>
              <select
                value={member}
                onChange={e => {
                  const m = teamMembers.find(item => item.name === e.target.value);
                  setMember(e.target.value);
                  if (m) setRole(m.role);
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {teamMembers.map(m => (
                  <option key={m.name} value={m.name}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Entrega Vinculada</label>
              <select
                value={deliveryId}
                onChange={e => setDeliveryId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {deliveries.map(d => (
                  <option key={d.id} value={d.id}>{d.month}: {d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Horas Trabalhadas</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="12"
                value={hours}
                onChange={e => setHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição do Trabalho Realizado</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Ex: Desenvolvimento das telas de Kanban e integração de relatórios..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-amber-600/20 cursor-pointer"
            >
              Registrar Apontamento
            </button>
          </form>
        </div>

        {/* Hours Log Table & Capacity (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Member Capacity Breakdown */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-400" />
              Alocação & Horas por Integrante da TI
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {memberHours.map(m => (
                <div key={m.name} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-[11px] font-bold text-slate-100 truncate">{m.name}</div>
                  <div className="text-[10px] text-slate-400">{m.role}</div>
                  <div className="text-sm font-extrabold text-amber-400 pt-1">{m.hours}h acumuladas</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Logged Entries */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-amber-400" />
              Histórico de Apontamentos Recentes
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Data</th>
                    <th className="py-2.5 px-3">Integrante</th>
                    <th className="py-2.5 px-3">Entrega</th>
                    <th className="py-2.5 px-3">Horas</th>
                    <th className="py-2.5 px-3">Descrição</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {timesheet.map(entry => (
                    <tr key={entry.id} className="hover:bg-slate-900/40 transition">
                      <td className="py-3 px-3 font-semibold text-slate-300">{entry.date}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-100">{entry.member}</div>
                        <div className="text-[10px] text-slate-400">{entry.role}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-300 max-w-xs truncate">{entry.deliveryName}</td>
                      <td className="py-3 px-3 font-extrabold text-amber-400">{entry.hours}h</td>
                      <td className="py-3 px-3 text-slate-400">{entry.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
