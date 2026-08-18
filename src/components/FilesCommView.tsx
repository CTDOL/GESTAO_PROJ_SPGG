import React, { useState } from 'react';
import { ProjectFile, DiscussionMessage } from '../types';
import { useProjectStore } from '../store/ProjectContext';
import { 
  FolderGit2, 
  Download, 
  Upload, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  FileText, 
  Paperclip,
  User,
  Clock
} from 'lucide-react';

export const FilesCommView: React.FC = () => {
  const { activeProject, setFiles, setDiscussions } = useProjectStore();
  
  if (!activeProject) return null;
  
  const files = activeProject.files;
  const discussions = activeProject.discussions;
  const [newMsgText, setNewMsgText] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('Marcos Silva');
  const [newFileName, setNewFileName] = useState('');
  const [newFileCategory, setNewFileCategory] = useState<'Requisitos' | 'Design UX/UI' | 'Arquitetura & LGPD' | 'Manuais & Treinamento'>('Requisitos');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const teamMembers = [
    { name: 'Marcos Silva', role: 'Líder Técnico', color: 'bg-indigo-600' },
    { name: 'Lucas Mendes', role: 'Dev Frontend', color: 'bg-blue-600' },
    { name: 'Rodrigo Xavier', role: 'Dev Backend', color: 'bg-purple-600' },
    { name: 'Juliana Lima', role: 'Designer UX/UI', color: 'bg-pink-600' },
    { name: 'Ana Costa', role: 'Analista de QA', color: 'bg-amber-600' },
    { name: 'Diretoria Executiva / CEO', role: 'Patrocinador', color: 'bg-emerald-600' },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;

    const authorObj = teamMembers.find(m => m.name === selectedAuthor) || teamMembers[0];

    const newMsg: DiscussionMessage = {
      id: `disc-${Date.now()}`,
      author: authorObj.name,
      role: authorObj.role,
      text: newMsgText,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      avatarColor: authorObj.color
    };

    setDiscussions(prev => [...prev, newMsg]);
    setNewMsgText('');
  };

  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const newFile: ProjectFile = {
      id: `file-${Date.now()}`,
      name: newFileName.endsWith('.pdf') || newFileName.endsWith('.zip') ? newFileName : `${newFileName}.pdf`,
      category: newFileCategory,
      size: '2.5 MB',
      uploadedAt: new Date().toISOString().slice(0, 10),
      uploadedBy: selectedAuthor
    };

    setFiles(prev => [newFile, ...prev]);
    setNewFileName('');
    setIsUploadOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
              Central de Colaboração
            </span>
            <span className="text-xs text-slate-400">Histórico de Discussões & Repositório Oficial</span>
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">Arquivos do Projeto & Canal de Comunicação</h1>
          <p className="text-xs text-slate-400">
            Eliminação de e-mails dispersos e planilhas paralelas. Registro centralizado e seguro.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/20 cursor-pointer self-start md:self-auto"
        >
          <Upload className="h-4 w-4" />
          <span>Upload de Arquivo</span>
        </button>
      </div>

      {/* Grid Layout: Files Repository + Discussion Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Document Repository (Left) */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-indigo-400" />
              Repositório de Documentos do ProjTrack
            </h3>
            <span className="text-xs text-slate-400 font-medium">{files.length} Arquivos</span>
          </div>

          <div className="space-y-3">
            {files.map(file => (
              <div
                key={file.id}
                className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{file.name}</h4>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold">
                        {file.category}
                      </span>
                      <span>• {file.size}</span>
                      <span>• {file.uploadedAt}</span>
                    </div>
                  </div>
                </div>

                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    alert(`Simulação de download do arquivo: ${file.name}`);
                  }}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition"
                  title="Baixar arquivo"
                >
                  <Download className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Discussion & Updates Feed (Right) */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col h-[560px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              Canal de Comunicação do Projeto
            </h3>
            <span className="text-[11px] text-slate-400">Stakeholders & Time de TI</span>
          </div>

          {/* Discussion Feed Scrollable */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
            {discussions.map(msg => (
              <div key={msg.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`h-6 w-6 rounded-full ${msg.avatarColor} text-white font-bold text-[10px] flex items-center justify-center`}>
                      {msg.author.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-slate-100">{msg.author}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {msg.role}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* New Message Input Form */}
          <form onSubmit={handleSendMessage} className="space-y-2 pt-3 border-t border-slate-800">
            <div className="flex items-center space-x-2">
              <select
                value={selectedAuthor}
                onChange={e => setSelectedAuthor(e.target.value)}
                className="px-2 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
              >
                {teamMembers.map(m => (
                  <option key={m.name} value={m.name}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newMsgText}
                onChange={e => setNewMsgText(e.target.value)}
                placeholder="Escreva uma mensagem ou atualização sobre o projeto..."
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Upload File Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-700 shadow-2xl animate-fade-in space-y-4">
            <h3 className="text-base font-bold text-white">Upload de Documento do ProjTrack</h3>

            <form onSubmit={handleUploadFile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Arquivo</label>
                <input
                  type="text"
                  required
                  value={newFileName}
                  onChange={e => setNewFileName(e.target.value)}
                  placeholder="Ex: Especificacao_Tecnica_V2.pdf"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Categoria</label>
                <select
                  value={newFileCategory}
                  onChange={e => setNewFileCategory(e.target.value as ProjectFile['category'])}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                >
                  <option value="Requisitos">Requisitos</option>
                  <option value="Design UX/UI">Design UX/UI</option>
                  <option value="Arquitetura & LGPD">Arquitetura & LGPD</option>
                  <option value="Manuais & Treinamento">Manuais & Treinamento</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition"
                >
                  Confirmar Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
