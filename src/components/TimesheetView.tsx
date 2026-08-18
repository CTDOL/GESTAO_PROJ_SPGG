import React, { useState } from 'react';
import { TimesheetEntry } from '../types';
import { useProjectStore } from '../store/ProjectContext';
import { useTimesheetMetrics } from '../hooks/useTimesheetMetrics';
import { Clock, Plus, Calendar, User, FileText, CheckCircle2, TrendingUp } from 'lucide-react';

export const TimesheetView: React.FC = () => {
  const { activeProject, setTimesheet, setTeamMembers } = useProjectStore();
  
  if (!activeProject) return null;
  
  const timesheet = activeProject.timesheet;
  const deliveries = activeProject.canvasData.planoAcao;
  const [date, setDate] = useState('2026-08-04');
  const [member, setMember] = useState('');
  const [role, setRole] = useState('');
  const [deliveryId, setDeliveryId] = useState('');
  const [hours, setHours] = useState<number>(8);
  const [description, setDescription] = useState('');
  
  // Estados para adicionar novo membro
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  const defaultTeamMembers = [
    { id: '1', name: 'Marcos Silva', role: 'Líder Técnico', isActive: true },
    { id: '2', name: 'Lucas Mendes', role: 'Dev Frontend', isActive: true },
    { id: '3', name: 'Rodrigo Xavier', role: 'Dev Backend', isActive: true },
    { id: '4', name: 'Juliana Lima', role: 'Designer UX/UI', isActive: true },
    { id: '5', name: 'Ana Costa', role: 'Analista de QA', isActive: true },
  ];

  const teamMembers = activeProject.teamMembers && activeProject.teamMembers.length > 0 
    ? activeProject.teamMembers 
    : defaultTeamMembers;

  const activeMembersList = teamMembers.filter(m => m.isActive !== false);

  // Set default form values safely
  React.useEffect(() => {
    if (activeMembersList.length > 0 && !activeMembersList.find(m => m.name === member)) {
      setMember(activeMembersList[0].name);
      setRole(activeMembersList[0].role);
    }
    if (deliveries.length > 0 && !deliveryId) {
      setDeliveryId(deliveries[0].id);
    }
  }, [activeMembersList, deliveries, member, deliveryId]);

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

    setTimesheet((prev: TimesheetEntry[]) => [newEntry, ...prev]);
    setDescription('');
    setHours(8);
  };

  const handleAddNewMember = () => {
    if (!newMemberName.trim() || !newMemberRole.trim()) return;
    const novo = { id: `mem-${Date.now()}`, name: newMemberName, role: newMemberRole, isActive: true };
    if (setTeamMembers) {
      setTeamMembers(prev => {
        const currentList = prev.length > 0 ? prev : defaultTeamMembers;
        return [...currentList, novo];
      });
    }
    setMember(novo.name);
    setRole(novo.role);
    setIsAddingMember(false);
    setNewMemberName('');
    setNewMemberRole('');
  };

  const handleToggleMemberActive = (memberId: string) => {
    if (setTeamMembers) {
      setTeamMembers(prev => {
        const currentList = prev.length > 0 ? prev : defaultTeamMembers;
        return currentList.map(m => m.id === memberId ? { ...m, isActive: m.isActive === false ? true : false } : m);
      });
    }
  };

  const { totalHoursLogged, memberHours } = useTimesheetMetrics(timesheet, teamMembers);

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
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-300">Integrante da Equipe</label>
                <button 
                  type="button" 
                  onClick={() => setIsAddingMember(!isAddingMember)} 
                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300"
                >
                  {isAddingMember ? 'Cancelar' : '+ Novo Membro'}
                </button>
              </div>
              
              {isAddingMember ? (
                <div className="space-y-2 p-3 bg-slate-900 border border-indigo-500/30 rounded-xl">
                  <input
                    type="text"
                    placeholder="Nome do integrante"
                    value={newMemberName}
                    onChange={e => setNewMemberName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Cargo (ex: Analista de BI)"
                    value={newMemberRole}
                    onChange={e => setNewMemberRole(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewMember}
                    className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition"
                  >
                    Adicionar ao Projeto
                  </button>
                </div>
              ) : (
                <select
                  value={member}
                  onChange={e => {
                    const m = teamMembers.find(item => item.name === e.target.value);
                    setMember(e.target.value);
                    if (m) setRole(m.role);
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {activeMembersList.map(m => (
                    <option key={m.name} value={m.name}>{m.name} ({m.role})</option>
                  ))}
                </select>
              )}
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
                <div key={m.name} className={`p-3 rounded-xl bg-slate-900 border ${m.isActive === false ? 'border-slate-800/50 opacity-60' : 'border-slate-800'} space-y-1 relative group`}>
                  <button 
                    onClick={() => handleToggleMemberActive(m.id)}
                    className="absolute top-2 right-2 p-1.5 bg-slate-950/80 rounded border border-slate-700/50 text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                    title={m.isActive === false ? "Reativar Membro" : "Desativar Membro"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {m.isActive === false 
                        ? <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM15 9l-6 6M9 9l6 6"/> 
                        : <path d="M18 6L6 18M6 6l12 12"/>
                      }
                    </svg>
                  </button>
                  <div className={`text-[11px] font-bold truncate pr-4 ${m.isActive === false ? 'text-slate-400 line-through' : 'text-slate-100'}`}>{m.name}</div>
                  <div className="text-[10px] text-slate-400">{m.role}</div>
                  <div className={`text-sm font-extrabold pt-1 ${m.isActive === false ? 'text-slate-500' : 'text-amber-400'}`}>{m.hours}h acumuladas</div>
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
                    <th className="py-2.5 px-3 text-right">Ações</th>
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
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setTimesheet((prev: TimesheetEntry[]) => prev.filter(t => t.id !== entry.id))}
                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                          title="Excluir apontamento"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </button>
                      </td>
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
