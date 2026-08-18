import React, { useState } from 'react';
import { Task, StatusType, PriorityType } from '../types';
import { useProjectStore } from '../store/ProjectContext';
import { 
  Plus, 
  Search, 
  Filter, 
  ShieldCheck, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  MoreVertical,
  X
} from 'lucide-react';
import { TaskModal } from './TaskModal';

export const KanbanView: React.FC = () => {
  const { activeProject, setTasks } = useProjectStore();
  
  if (!activeProject) return null;
  
  const { tasks, canvasData } = activeProject;
  const deliveries = canvasData.planoAcao;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const teamMembers = [
    { name: 'Marcos Silva', role: 'Líder Técnico' },
    { name: 'Lucas Mendes', role: 'Dev Frontend' },
    { name: 'Rodrigo Xavier', role: 'Dev Backend' },
    { name: 'Juliana Lima', role: 'Designer UX/UI' },
    { name: 'Ana Costa', role: 'Analista de QA' },
  ];

  const columns: { id: StatusType; title: string; color: string; countColor: string }[] = [
    { id: 'backlog', title: 'Backlog de Tarefas', color: 'border-slate-700', countColor: 'bg-slate-800 text-slate-300' },
    { id: 'in_progress', title: 'Em Andamento', color: 'border-indigo-500/40', countColor: 'bg-indigo-500/20 text-indigo-300' },
    { id: 'review', title: 'Em Revisão / Testes QA', color: 'border-amber-500/40', countColor: 'bg-amber-500/20 text-amber-300' },
    { id: 'completed', title: 'Concluídas', color: 'border-emerald-500/40', countColor: 'bg-emerald-500/20 text-emerald-300' },
  ];

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>, isEditing: boolean) => {
    if (isEditing && editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? {
        ...t,
        ...taskData
      } as Task : t));
    } else {
      const newTask: Task = {
        id: `tsk-${Date.now()}`,
        title: taskData.title || '',
        description: taskData.description || '',
        status: taskData.status || 'backlog',
        priority: taskData.priority || 'media',
        assignee: taskData.assignee || '',
        assigneeRole: taskData.assigneeRole || '',
        deliveryId: taskData.deliveryId || '',
        lgpdTag: taskData.lgpdTag || false,
        dueDate: taskData.dueDate || '',
        hoursSpent: 0,
        estimatedHours: taskData.estimatedHours || 0
      };
      setTasks(prev => [...prev, newTask]);
    }
    setIsModalOpen(false);
  };

  const handleStatusChange = (taskId: string, newStatus: StatusType) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || t.priority === selectedPriority;
    const matchesAssignee = selectedAssignee === 'all' || t.assignee === selectedAssignee;
    return matchesSearch && matchesPriority && matchesAssignee;
  });

  const [dragOverColId, setDragOverColId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColId !== colId) {
      setDragOverColId(colId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    setDragOverColId(null);
  };

  const handleDrop = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    setDragOverColId(null);
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      handleStatusChange(taskId, colId as StatusType);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bar with Filters and Actions */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white">Quadro Kanban de Tarefas</h1>
          <p className="text-xs text-slate-400">Gestão ágil da execução por integrante do time e entregas do projeto.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 w-48 sm:w-60"
            />
          </div>

          {/* Filter Priority */}
          <select
            value={selectedPriority}
            onChange={e => setSelectedPriority(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">Todas as Prioridades</option>
            <option value="alta">Alta Prioridade</option>
            <option value="media">Média Prioridade</option>
            <option value="baixa">Baixa Prioridade</option>
          </select>

          {/* Filter Assignee */}
          <select
            value={selectedAssignee}
            onChange={e => setSelectedAssignee(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">Toda a Equipe</option>
            {teamMembers.map(m => (
              <option key={m.name} value={m.name}>{m.name}</option>
            ))}
          </select>

          {/* Add Task Button */}
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      {/* Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          const isDragOver = dragOverColId === col.id;

          return (
            <div
              key={col.id}
              className={`glass-panel p-4 rounded-2xl border ${col.color} flex flex-col h-[680px] transition-colors duration-200 ${
                isDragOver ? 'bg-slate-800/80 ring-2 ring-indigo-500/50' : 'bg-slate-900/60'
              }`}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">{col.title}</h3>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${col.countColor}`}>
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colTasks.map(task => {
                  const deliveryName = deliveries.find(d => d.id === task.deliveryId)?.name || 'Entrega Geral';

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-indigo-500/40 bg-slate-950/80 transition cursor-grab active:cursor-grabbing group"
                      onClick={() => handleOpenEditModal(task)}
                    >
                      {/* Delivery badge & priority */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-400 truncate max-w-[130px]">
                          {deliveryName}
                        </span>

                        <span
                          className={`text-[10px] px-2 py-0.5 font-extrabold rounded-full ${
                            task.priority === 'alta'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : task.priority === 'media'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {task.priority.toUpperCase()}
                        </span>
                      </div>

                      {/* Task Title */}
                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition leading-snug pointer-events-none">
                        {task.title}
                      </h4>

                      {/* Task Description */}
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-snug pointer-events-none">
                        {task.description}
                      </p>

                      {/* Tags & LGPD Flag */}
                      <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-slate-900 pointer-events-none">
                        {task.lgpdTag && (
                          <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                            <ShieldCheck className="h-3 w-3" />
                            <span>LGPD</span>
                          </span>
                        )}
                        <div className="flex items-center space-x-1 text-[11px] text-slate-400 ml-auto">
                          <Clock className="h-3 w-3 text-slate-500" />
                          <span>{task.hoursSpent}h / {task.estimatedHours}h</span>
                        </div>
                      </div>

                      {/* Footer: Assignee & Column Mover */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800">
                        <div className="flex items-center space-x-1.5 pointer-events-none">
                          <div className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                            {task.assignee.charAt(0)}
                          </div>
                          <span className="text-[10px] text-slate-300 font-medium">{task.assignee}</span>
                        </div>

                        {/* Quick status mover dropdown */}
                        <select
                          value={task.status}
                          onClick={e => e.stopPropagation()}
                          onChange={e => {
                             e.stopPropagation();
                             handleStatusChange(task.id, e.target.value as StatusType);
                          }}
                          className="text-[10px] bg-slate-900 border border-slate-700 text-slate-300 rounded px-1 py-0.5 focus:outline-none"
                        >
                          <option value="backlog">Backlog</option>
                          <option value="in_progress">Em Andamento</option>
                          <option value="review">Em Revisão</option>
                          <option value="completed">Concluída</option>
                        </select>
                      </div>

                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
                    <p className="text-xs text-slate-500">Nenhuma tarefa nesta coluna</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        editingTask={editingTask}
        deliveries={deliveries}
      />
    </div>
  );
};
