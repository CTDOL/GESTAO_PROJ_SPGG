import React, { useState, useEffect } from 'react';
import { Task, StatusType, PriorityType, DeliveryItem } from '../types';
import { X, ShieldCheck } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>, isEditing: boolean) => void;
  editingTask: Task | null;
  deliveries: DeliveryItem[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTask,
  deliveries,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<StatusType>('backlog');
  const [priority, setPriority] = useState<PriorityType>('media');
  const [assignee, setAssignee] = useState('Lucas Mendes');
  const [assigneeRole, setAssigneeRole] = useState('Dev Frontend');
  const [deliveryId, setDeliveryId] = useState('');
  const [lgpdTag, setLgpdTag] = useState(false);
  const [dueDate, setDueDate] = useState('2026-06-30');
  const [estimatedHours, setEstimatedHours] = useState(20);

  const teamMembers = [
    { name: 'Marcos Silva', role: 'Líder Técnico' },
    { name: 'Lucas Mendes', role: 'Dev Frontend' },
    { name: 'Rodrigo Xavier', role: 'Dev Backend' },
    { name: 'Juliana Lima', role: 'Designer UX/UI' },
    { name: 'Ana Costa', role: 'Analista de QA' },
  ];

  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        setTitle(editingTask.title);
        setDescription(editingTask.description);
        setStatus(editingTask.status);
        setPriority(editingTask.priority);
        setAssignee(editingTask.assignee);
        setAssigneeRole(editingTask.assigneeRole);
        setDeliveryId(editingTask.deliveryId);
        setLgpdTag(!!editingTask.lgpdTag);
        setDueDate(editingTask.dueDate);
        setEstimatedHours(editingTask.estimatedHours);
      } else {
        setTitle('');
        setDescription('');
        setStatus('backlog');
        setPriority('media');
        setAssignee('Lucas Mendes');
        setAssigneeRole('Dev Frontend');
        setDeliveryId(deliveries[0]?.id || '');
        setLgpdTag(false);
        setDueDate('2026-06-30');
        setEstimatedHours(20);
      }
    }
  }, [isOpen, editingTask, deliveries]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title,
      description,
      status,
      priority,
      assignee,
      assigneeRole,
      deliveryId,
      lgpdTag,
      dueDate,
      estimatedHours
    }, !!editingTask);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-700 shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white">
            {editingTask ? 'Editar Tarefa' : 'Nova Tarefa no ProjTrack'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Título da Tarefa</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Desenvolver componente de relatórios"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detalhamento técnico da tarefa..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as StatusType)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">Em Andamento</option>
                <option value="review">Em Revisão</option>
                <option value="completed">Concluída</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Prioridade</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as PriorityType)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
              >
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Responsável</label>
              <select
                value={assignee}
                onChange={e => {
                  const member = teamMembers.find(m => m.name === e.target.value);
                  setAssignee(e.target.value);
                  if (member) setAssigneeRole(member.role);
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
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
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
              >
                {deliveries.map(d => (
                  <option key={d.id} value={d.id}>{d.month}: {d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Horas Estimadas</label>
              <input
                type="number"
                value={estimatedHours}
                onChange={e => setEstimatedHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Data Limite</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="lgpdCheck"
              checked={lgpdTag}
              onChange={e => setLgpdTag(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="lgpdCheck" className="text-xs text-slate-300 flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Requisito relevante para Conformidade LGPD
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition"
            >
              {editingTask ? 'Salvar Alterações' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
