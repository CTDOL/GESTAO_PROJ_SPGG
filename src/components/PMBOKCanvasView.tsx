import React, { useState } from 'react';
import { PMBOKCanvasData, CanvasItem } from '../types';
import { 
  Target, 
  MessageSquare, 
  Star, 
  FileText, 
  CheckSquare, 
  XSquare, 
  Users, 
  ShieldAlert, 
  AlertTriangle, 
  ListChecks, 
  Calendar, 
  Coins, 
  Plus, 
  Trash2,
  Lock,
  Sparkles,
  Tag
} from 'lucide-react';

interface CanvasItemWithCat extends CanvasItem {
  category?: string;
}

interface PMBOKCanvasViewProps {
  canvasData: PMBOKCanvasData;
  setCanvasData: React.Dispatch<React.SetStateAction<PMBOKCanvasData>>;
  onDeleteProject?: () => void;
}

export const PMBOKCanvasView: React.FC<PMBOKCanvasViewProps> = ({
  canvasData,
  setCanvasData,
  onDeleteProject,
}) => {
  const [activeModalBlock, setActiveModalBlock] = useState<keyof PMBOKCanvasData | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemTag, setNewItemTag] = useState('');

  const handleAddItem = (blockKey: keyof PMBOKCanvasData) => {
    if (!newItemTitle.trim()) return;

    const newItem: CanvasItem = {
      id: `${blockKey}-${Date.now()}`,
      title: newItemTitle,
      description: newItemDesc,
      tag: newItemTag || 'Novo'
    };

    setCanvasData((prev) => ({
      ...prev,
      [blockKey]: Array.isArray(prev[blockKey])
        ? [...(prev[blockKey] as CanvasItem[]), newItem]
        : prev[blockKey]
    }));

    setNewItemTitle('');
    setNewItemDesc('');
    setNewItemTag('');
    setActiveModalBlock(null);
  };

  const removeItem = (blockKey: keyof PMBOKCanvasData, id: string) => {
    setCanvasData((prev) => ({
      ...prev,
      [blockKey]: (prev[blockKey] as CanvasItem[]).filter((item) => item.id !== id)
    }));
  };

  const totalInvestment = canvasData.planoAcao.reduce((acc, curr) => acc + curr.investment, 0);

  // Combination of Premissas & Restrições for v5 Canvas block
  const premissasERestricoes: CanvasItemWithCat[] = [
    ...(canvasData.premissas || []).map(i => ({ ...i, category: 'Premissa' })),
    ...(canvasData.restricoes || []).map(i => ({ ...i, category: 'Restrição' }))
  ];

  // Stakeholders combined list (Sponsor, Client, Team, Resistant)
  const stakeholdersList: CanvasItemWithCat[] = [
    ...(canvasData.stakeholders || []),
    ...(canvasData.resistentes || []).map(r => ({ ...r, tag: 'Resistente' }))
  ];

  // Helper render function for Canvas v5 Block Card
  const renderBlockCard = (
    title: string,
    subtitle: string,
    blockKey: keyof PMBOKCanvasData,
    icon: React.ElementType,
    badgeColor: string,
    itemsList?: CanvasItemWithCat[],
    extraClass: string = ''
  ) => {
    const Icon = icon;
    const items: CanvasItemWithCat[] = itemsList || ((canvasData[blockKey] as CanvasItem[]) || []);

    return (
      <div className={`glass-panel rounded-xl p-3.5 flex flex-col justify-between border border-slate-800 hover:border-indigo-500/40 transition-all ${extraClass}`}>
        <div>
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800/80 pb-2 mb-2">
            <div className="flex items-start space-x-2">
              <div className={`p-1.5 rounded-lg ${badgeColor} text-white mt-0.5 shadow-sm`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-100 leading-tight">
                  {title}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                  {subtitle}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveModalBlock(blockKey)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition cursor-pointer"
              title={`Adicionar item em ${title}`}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Cards / Items list */}
          <div className="space-y-2 overflow-y-auto max-h-80 pr-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-bold text-slate-100 leading-tight">{item.title}</span>
                  {(item.tag || item.category) && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold border ${
                      item.tag === 'Resistente' || item.category === 'Restrição'
                        ? 'bg-rose-950/80 text-rose-300 border-rose-500/30'
                        : item.tag === 'Estratégico'
                        ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {item.tag || item.category}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.description}</p>
                )}

                <button
                  onClick={() => removeItem(blockKey, item.id)}
                  className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 p-1 text-rose-400 hover:text-rose-300 transition cursor-pointer"
                  title="Remover item"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
            {items.length === 0 && (
              <p className="text-[10px] text-slate-500 italic py-2 text-center">Nenhum item preenchido.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Canvas v5 Poster Frame Container */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-slate-950 space-y-4 shadow-2xl">
        
        {/* Top Poster Header Bar: NOME DO PROJETO & ID & PROPÓSITO & DELETE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-xl items-center">
          
          {/* Nome do Projeto & ID (Left) */}
          <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-slate-800 pb-3 md:pb-0 md:pr-4 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
                  ID & NOME DO PROJETO
                </span>
                {canvasData.codigoProjeto && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-extrabold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                    {canvasData.codigoProjeto}
                  </span>
                )}
              </div>
              <h1 className="text-xl font-extrabold text-white mt-0.5 tracking-tight truncate">
                {canvasData.nomeProjeto}
              </h1>
            </div>

            {onDeleteProject && (
              <button
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="p-2 rounded-xl bg-rose-950/50 hover:bg-rose-900 text-rose-400 hover:text-rose-200 border border-rose-500/30 transition cursor-pointer flex items-center space-x-1 text-xs font-bold"
                title="Excluir este projeto"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Excluir</span>
              </button>
            )}
          </div>

          {/* Propósito (Right) */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">
                PROPÓSITO (Objetivo Estratégico)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                Canvas de Projeto v5
              </span>
            </div>
            <p className="text-xs text-slate-200 mt-1 font-medium leading-snug">
              {canvasData.proposito[0]?.description || 'Aumentar a taxa de sucesso nas entregas da empresa com controle de ponta a ponta.'}
            </p>
          </div>

        </div>

        {/* Canvas v5 5-Column Grid Poster Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-stretch">
          
          {/* COLUNA 1 (Left): OBJETIVO, JUSTIFICATIVA, BENEFÍCIOS */}
          <div className="space-y-3 flex flex-col justify-between">
            {renderBlockCard(
              'OBJETIVO',
              '(Verbo infinitivo + Produto)',
              'objetivo',
              Target,
              'bg-indigo-600',
              undefined,
              'flex-1'
            )}
            {renderBlockCard(
              'JUSTIFICATIVA',
              '(Listar problemas)',
              'justificativa',
              MessageSquare,
              'bg-amber-600',
              undefined,
              'flex-1'
            )}
            {renderBlockCard(
              'BENEFÍCIOS',
              '(Quais serão os ganhos?)',
              'beneficios',
              Star,
              'bg-purple-600',
              undefined,
              'flex-1'
            )}
          </div>

          {/* COLUNA 2 (Center-Left): CARACTERÍSTICAS DO PRODUTO, ESCOPO, NÃO ESCOPO */}
          <div className="space-y-3 flex flex-col justify-between">
            {renderBlockCard(
              'CARACTERÍSTICAS DO PRODUTO/SERVIÇO',
              '(Descrever com o máximo de características)',
              'produto',
              FileText,
              'bg-blue-600',
              undefined,
              'flex-1'
            )}
            {renderBlockCard(
              'ESCOPO',
              '(O que será feito?)',
              'escopo',
              CheckSquare,
              'bg-emerald-600',
              undefined,
              'flex-1'
            )}
            {renderBlockCard(
              'NÃO ESCOPO',
              '(O que NÃO será feito?)',
              'naoEscopo',
              XSquare,
              'bg-slate-700',
              undefined,
              'flex-1'
            )}
          </div>

          {/* COLUNA 3 (Center): STAKEHOLDERS */}
          <div className="flex flex-col h-full">
            {renderBlockCard(
              'STAKEHOLDERS',
              '(Patrocinador, Cliente, Equipe e Resistentes)',
              'stakeholders',
              Users,
              'bg-violet-600',
              stakeholdersList,
              'h-full'
            )}
          </div>

          {/* COLUNA 4 (Center-Right): PREMISSAS & RESTRIÇÕES */}
          <div className="flex flex-col h-full">
            {renderBlockCard(
              'PREMISSAS & RESTRIÇÕES',
              '(O que TEM QUE ser considerado?)',
              'restricoes',
              Lock,
              'bg-amber-600',
              premissasERestricoes,
              'h-full'
            )}
          </div>

          {/* COLUNA 5 (Right): RISCOS */}
          <div className="flex flex-col h-full">
            {renderBlockCard(
              'RISCOS',
              '(O que pode impactar?)',
              'riscos',
              AlertTriangle,
              'bg-rose-600',
              undefined,
              'h-full'
            )}
          </div>

        </div>

        {/* Lower Section (Bottom Right): PLANO DE AÇÃO v5 (ENTREGAS, DATAS, INVESTIMENTO) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded bg-pink-600 text-white">
                <ListChecks className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-100">
                PLANO DE AÇÃO: ENTREGAS, DATAS E INVESTIMENTO
              </h3>
            </div>
            <span className="text-xs font-extrabold text-emerald-400">
              Total Orçado: R$ {totalInvestment.toLocaleString('pt-BR')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* ENTREGAS Column */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200 border-b border-slate-800 pb-1.5">
                <ListChecks className="h-4 w-4 text-pink-400" />
                <span>ENTREGAS (no particípio passado)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {canvasData.planoAcao.map((item) => (
                  <li key={item.id} className="flex items-center justify-between p-1.5 bg-slate-900 rounded border border-slate-800/80">
                    <span className="font-semibold text-slate-100">{item.order}. {item.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DATAS Column */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200 border-b border-slate-800 pb-1.5">
                <Calendar className="h-4 w-4 text-indigo-400" />
                <span>DATAS (Para cada entrega)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {canvasData.planoAcao.map((item) => (
                  <li key={item.id} className="flex items-center justify-between p-1.5 bg-slate-900 rounded border border-slate-800/80">
                    <span className="font-bold text-indigo-300">{item.month}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">{item.status}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* INVESTIMENTO Column */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200 border-b border-slate-800 pb-1.5">
                <Coins className="h-4 w-4 text-emerald-400" />
                <span>INVESTIMENTO (Para cada entrega)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {canvasData.planoAcao.map((item) => (
                  <li key={item.id} className="flex items-center justify-between p-1.5 bg-slate-900 rounded border border-slate-800/80">
                    <span className="font-extrabold text-emerald-400">R$ {item.investment.toLocaleString('pt-BR')}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{item.progress}% concluído</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Official Canvas v5 Footer Copyright Attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/80 px-1">
          <div>
            Obra disponibilizada com Licença Creative Commons Atribuição 4.0 Internacional (CC BY 4.0)
          </div>
          <div className="font-bold text-slate-400">
            Canvas de Projeto v5 | Prof. Wankes Leandro & Prof. Helber Vieira
          </div>
        </div>

      </div>

      {/* Modal para adicionar item em bloco do Canvas */}
      {activeModalBlock && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-700 shadow-2xl animate-fade-in space-y-4">
            <h3 className="text-base font-bold text-white">
              Adicionar item a {activeModalBlock.toUpperCase()}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título / Nome</label>
                <input
                  type="text"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  placeholder="Ex: Nova entrega ou restrição"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição</label>
                <textarea
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="Detalhamento do item..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tag / Categoria</label>
                <input
                  type="text"
                  value={newItemTag}
                  onChange={(e) => setNewItemTag(e.target.value)}
                  placeholder="Ex: LGPD, TI, Crítico"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setActiveModalBlock(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleAddItem(activeModalBlock)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition cursor-pointer"
              >
                Salvar Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Project Confirmation Modal */}
      {isDeleteConfirmOpen && onDeleteProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-rose-500/40 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="p-2 rounded-xl bg-rose-950 border border-rose-500/40">
                <AlertTriangle className="h-6 w-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Excluir Projeto</h3>
                <p className="text-xs text-rose-300">Confirmação de Exclusão</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Tem certeza que deseja excluir o projeto <strong className="text-white font-bold font-mono">[{canvasData.codigoProjeto}] {canvasData.nomeProjeto}</strong>?
            </p>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  onDeleteProject();
                }}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-500 text-white transition shadow-lg shadow-rose-600/30 cursor-pointer flex items-center space-x-1.5"
              >
                <Trash2 className="h-4 w-4" />
                <span>Excluir Projeto</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
