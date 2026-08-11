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
  Lock, 
  AlertTriangle, 
  ListChecks, 
  Calendar, 
  Coins, 
  Plus, 
  Trash2
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
  const [printMode, setPrintMode] = useState<'single' | 'poster'>('single');

  const handlePrint = (mode: 'single' | 'poster') => {
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
      // Reseta para single depois que fechar a janela de print (opcional)
      setTimeout(() => setPrintMode('single'), 1000);
    }, 100);
  };

  const handleAddItem = (blockKey: keyof PMBOKCanvasData) => {
    if (!newItemTitle.trim()) return;

    const newItem: CanvasItem = {
      id: `${blockKey}-${Date.now()}`,
      title: newItemTitle,
      description: newItemDesc,
      tag: newItemTag || ''
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

  // Combine categories
  const premissasERestricoes: CanvasItemWithCat[] = [
    ...(canvasData.premissas || []).map(i => ({ ...i, category: 'Premissa' })),
    ...(canvasData.restricoes || []).map(i => ({ ...i, category: 'Restrição' }))
  ];

  const stakeholdersList: CanvasItemWithCat[] = [
    ...(canvasData.stakeholders || []),
    ...(canvasData.resistentes || []).map(r => ({ ...r, tag: 'Resistente' }))
  ];

  // --- Helper to Render a Standard Block in the Grid ---
  const renderBlockCard = (
    title: string,
    blockKey: keyof PMBOKCanvasData,
    icon: React.ElementType,
    itemsList?: CanvasItemWithCat[],
    flexClass: string = 'flex-1'
  ) => {
    const Icon = icon;
    const items: CanvasItemWithCat[] = itemsList || ((canvasData[blockKey] as CanvasItem[]) || []);

    return (
      <div className={`bg-slate-900 print:bg-white print:text-black flex flex-col p-2 relative group ${flexClass}`}>
        {/* Header do Bloco */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5">
            <Icon className="h-4 w-4 text-slate-400 print:text-black" />
            <h3 className="text-xs font-bold uppercase tracking-tight text-slate-200 print:text-black">
              {title}
            </h3>
          </div>
          {/* Botão de adicionar fica invisível na impressão */}
          <button
            onClick={() => setActiveModalBlock(blockKey)}
            className="print:hidden opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition cursor-pointer"
            title={`Adicionar item`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Lista de Itens (Sem scroll, cresce para caber na impressão) */}
        <div className="space-y-1.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative p-1.5 rounded bg-slate-950/50 print:bg-transparent print:border print:border-gray-200 border border-transparent hover:border-slate-700 print:hover:border-gray-200 transition group/item"
            >
              <div className="flex flex-col">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold text-slate-100 print:text-black leading-tight">
                    • {item.title}
                  </span>
                  {(item.tag || item.category) && (
                    <span className="print:hidden text-[9px] px-1 py-0.5 rounded font-bold bg-slate-800 text-slate-400 ml-2">
                      {item.tag || item.category}
                    </span>
                  )}
                  {/* Tag formatada para impressão */}
                  {(item.tag || item.category) && (
                    <span className="hidden print:inline text-[9px] font-bold text-gray-500 ml-2">
                      [{item.tag || item.category}]
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-[10px] text-slate-400 print:text-gray-700 mt-0.5 pl-2 leading-tight">
                    {item.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeItem(blockKey, item.id)}
                className="print:hidden absolute top-1 right-1 opacity-0 group-hover/item:opacity-100 p-0.5 text-rose-400 hover:text-rose-300 transition cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-[10px] text-slate-600 print:text-gray-300 italic pt-1">vazio</p>
          )}
        </div>
      </div>
    );
  };

  // --- Helpers to Render Plano de Ação blocks in Cols 3,4,5 ---
  const renderEntregas = () => (
    <div className="bg-slate-900 print:bg-white flex flex-col p-2 relative group flex-1">
      <div className="flex items-center justify-between mb-2 border-b border-slate-800 print:border-gray-300 pb-1">
        <div className="flex items-center space-x-1.5">
          <ListChecks className="h-4 w-4 text-pink-400 print:text-black" />
          <h3 className="text-xs font-bold uppercase tracking-tight text-slate-200 print:text-black">ENTREGAS</h3>
        </div>
      </div>
      <div className="space-y-1.5">
        {canvasData.planoAcao.map((item) => (
          <div key={item.id} className="text-[11px] font-bold text-slate-100 print:text-black p-1">
            {item.order}. {item.name}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDatas = () => (
    <div className="bg-slate-900 print:bg-white flex flex-col p-2 relative group flex-1">
      <div className="flex items-center justify-between mb-2 border-b border-slate-800 print:border-gray-300 pb-1">
        <div className="flex items-center space-x-1.5">
          <Calendar className="h-4 w-4 text-indigo-400 print:text-black" />
          <h3 className="text-xs font-bold uppercase tracking-tight text-slate-200 print:text-black">DATAS</h3>
        </div>
      </div>
      <div className="space-y-1.5">
        {canvasData.planoAcao.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-[11px] p-1">
            <span className="font-bold text-indigo-300 print:text-black">{item.month}</span>
            <span className="text-[9px] text-slate-400 print:text-gray-500">[{item.status}]</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInvestimento = () => (
    <div className="bg-slate-900 print:bg-white flex flex-col p-2 relative group flex-1">
      <div className="flex items-center justify-between mb-2 border-b border-slate-800 print:border-gray-300 pb-1">
        <div className="flex items-center space-x-1.5">
          <Coins className="h-4 w-4 text-emerald-400 print:text-black" />
          <h3 className="text-xs font-bold uppercase tracking-tight text-slate-200 print:text-black">INVESTIMENTO</h3>
        </div>
      </div>
      <div className="space-y-1.5">
        {canvasData.planoAcao.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-[11px] p-1">
            <span className="font-bold text-emerald-400 print:text-black">R$ {item.investment.toLocaleString('pt-BR')}</span>
            <span className="text-[9px] text-slate-400 print:text-gray-500">{item.progress}%</span>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-2 border-t border-slate-800 print:border-gray-300 flex justify-between items-center">
        <span className="text-[10px] font-bold text-slate-300 print:text-black">TOTAL:</span>
        <span className="text-xs font-black text-emerald-400 print:text-black">R$ {totalInvestment.toLocaleString('pt-BR')}</span>
      </div>
    </div>
  );

  const renderMainGrid = (isPoster: boolean = false) => (
      {/* GRID MESTRE DO CANVAS */}
      <div className={`bg-slate-700 print:bg-black p-px flex flex-col gap-px shadow-2xl print:shadow-none print:w-[297mm] print:overflow-hidden rounded-lg print:rounded-none mx-auto ${isPoster ? 'print:h-[210mm]' : 'print:h-[195mm]'}`}>
        
        {/* CABEÇALHO DO PROJETO */}
        <div className="bg-slate-900 print:bg-gray-100 flex p-3 justify-between items-center">
          <div className="flex-1">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 print:text-black">NOME DO PROJETO</span>
            <h1 className="text-lg font-black text-white print:text-black leading-none mt-1">
              [{canvasData.codigoProjeto}] {canvasData.nomeProjeto}
            </h1>
          </div>
          
          <div className="flex-1 text-right">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 print:text-black">PROPÓSITO (Objetivo Estratégico)</span>
            <p className="text-xs text-slate-200 print:text-black font-medium leading-tight mt-1">
              {canvasData.proposito[0]?.description || 'Propósito não definido'}
            </p>
          </div>

          {onDeleteProject && !isPoster && (
            <div className="ml-4 print:hidden">
              <button onClick={() => setIsDeleteConfirmOpen(true)} className="p-2 rounded bg-rose-950/50 text-rose-400 hover:bg-rose-900 hover:text-white transition">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* CORPO DO CANVAS (5 Colunas) */}
        <div className="grid grid-cols-5 gap-px flex-1">
          {/* COLUNA 1 */}
          <div className="flex flex-col gap-px">
            {renderBlockCard('OBJETIVO', 'objetivo', Target)}
            {renderBlockCard('JUSTIFICATIVA', 'justificativa', MessageSquare)}
            {renderBlockCard('BENEFÍCIOS', 'beneficios', Star)}
          </div>
          {/* COLUNA 2 */}
          <div className="flex flex-col gap-px">
            {renderBlockCard('CARACTERÍSTICAS', 'produto', FileText)}
            {renderBlockCard('ESCOPO', 'escopo', CheckSquare)}
            {renderBlockCard('NÃO ESCOPO', 'naoEscopo', XSquare)}
          </div>
          {/* COLUNA 3 */}
          <div className="flex flex-col gap-px">
            {renderBlockCard('STAKEHOLDERS', 'stakeholders', Users)}
            {renderEntregas()}
          </div>
          {/* COLUNA 4 */}
          <div className="flex flex-col gap-px">
            {renderBlockCard('PREMISSAS & RESTRIÇÕES', 'restricoes', Lock)}
            {renderDatas()}
          </div>
          {/* COLUNA 5 */}
          <div className="flex flex-col gap-px">
            {renderBlockCard('RISCOS', 'riscos', AlertTriangle)}
            {renderInvestimento()}
          </div>
        </div>

        {/* RODAPÉ DO CANVAS */}
        <div className="bg-slate-900 print:bg-white text-[9px] text-slate-500 print:text-black p-1 flex justify-between font-medium">
          <span>Obra disponibilizada com Licença Creative Commons Atribuição 4.0 Internacional</span>
          <span className="font-bold">Canvas de Projeto v5 | Prof. Wankes Leandro & Prof. Helber Vieira</span>
        </div>

      </div>
  );

  return (
    <div className="pb-12 print:p-0 print:m-0">
      
      {/* Botões de impressão (Invisíveis na impressão) */}
      <div className="print:hidden mb-4 flex justify-end gap-3">
        <button 
          onClick={() => handlePrint('single')}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer border border-slate-700"
        >
          🖨️ Imprimir (A4 Único)
        </button>
        <button 
          onClick={() => handlePrint('poster')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-lg transition flex items-center gap-2 cursor-pointer"
        >
          🧩 Imprimir Pôster (4x A4)
        </button>
      </div>

      {/* Renderização condicional para a Tela e Modo Single */}
      <div className={printMode === 'poster' ? 'print:hidden' : ''}>
        {renderMainGrid(false)}
      </div>

      {/* Renderização condicional para o Modo Poster (Só aparece na impressão e se mode=poster) */}
      {printMode === 'poster' && (
        <div className="hidden print:block">
          {/* Página 1: Topo-Esquerdo */}
          <div className="w-[297mm] h-[210mm] overflow-hidden relative" style={{ pageBreakAfter: 'always' }}>
            <div style={{ transform: 'scale(2)', transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
              {renderMainGrid(true)}
            </div>
          </div>
          {/* Página 2: Topo-Direito */}
          <div className="w-[297mm] h-[210mm] overflow-hidden relative" style={{ pageBreakAfter: 'always' }}>
            <div style={{ transform: 'scale(2)', transformOrigin: 'top left', position: 'absolute', top: 0, left: '-297mm' }}>
              {renderMainGrid(true)}
            </div>
          </div>
          {/* Página 3: Base-Esquerda */}
          <div className="w-[297mm] h-[210mm] overflow-hidden relative" style={{ pageBreakAfter: 'always' }}>
            <div style={{ transform: 'scale(2)', transformOrigin: 'top left', position: 'absolute', top: '-210mm', left: 0 }}>
              {renderMainGrid(true)}
            </div>
          </div>
          {/* Página 4: Base-Direita */}
          <div className="w-[297mm] h-[210mm] overflow-hidden relative" style={{ pageBreakAfter: 'avoid' }}>
            <div style={{ transform: 'scale(2)', transformOrigin: 'top left', position: 'absolute', top: '-210mm', left: '-297mm' }}>
              {renderMainGrid(true)}
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADICIONAR ITEM */}
      {activeModalBlock && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
          <div className="bg-slate-900 rounded-xl w-full max-w-md p-5 border border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Adicionar Item</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                placeholder="Título"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-xs text-white"
              />
              <textarea
                value={newItemDesc}
                onChange={(e) => setNewItemDesc(e.target.value)}
                placeholder="Descrição (opcional)"
                rows={3}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-xs text-white"
              />
              <input
                type="text"
                value={newItemTag}
                onChange={(e) => setNewItemTag(e.target.value)}
                placeholder="Tag (opcional)"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded text-xs text-white"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setActiveModalBlock(null)} className="px-4 py-2 rounded text-xs text-slate-300 hover:bg-slate-800">Cancelar</button>
              <button onClick={() => handleAddItem(activeModalBlock)} className="px-4 py-2 rounded text-xs bg-indigo-600 text-white hover:bg-indigo-500">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EXCLUIR PROJETO */}
      {isDeleteConfirmOpen && onDeleteProject && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 print:hidden">
          <div className="bg-slate-900 rounded-xl w-full max-w-md p-5 border border-rose-500/40 shadow-2xl space-y-4 text-center">
            <AlertTriangle className="h-8 w-8 text-rose-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Excluir Projeto?</h3>
            <p className="text-xs text-slate-300">Tem certeza que deseja excluir o projeto definitivamente?</p>
            <div className="flex justify-center gap-3 pt-2">
              <button onClick={() => setIsDeleteConfirmOpen(false)} className="px-4 py-2 rounded text-xs text-slate-300 hover:bg-slate-800">Cancelar</button>
              <button onClick={() => { setIsDeleteConfirmOpen(false); onDeleteProject(); }} className="px-4 py-2 rounded text-xs bg-rose-600 hover:bg-rose-500 text-white">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
