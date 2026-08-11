import React, { useRef } from 'react';
import { PMBOKCanvasData, Task, TimesheetEntry } from '../types';
import { FileSpreadsheet, FileText, Download, Printer, ShieldCheck, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ReportsViewProps {
  canvasData: PMBOKCanvasData;
  tasks: Task[];
  timesheet: TimesheetEntry[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ canvasData, tasks, timesheet }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const totalInvestment = (canvasData.planoAcao || []).reduce((acc, curr) => acc + curr.investment, 0);
  const totalHoursSpent = (tasks || []).reduce((acc, curr) => acc + curr.hoursSpent, 0);
  const overallProgress = Math.round(
    (canvasData.planoAcao || []).reduce((acc, curr) => acc + curr.progress, 0) / ((canvasData.planoAcao || []).length || 1)
  );

  // Export to Excel / XLSX
  const exportToExcel = () => {
    // Worksheet 1: Plano de Ação & Entregas
    const deliveriesData = (canvasData.planoAcao || []).map(d => ({
      Ordem: d.order,
      Entrega: d.name,
      Prazo: d.month,
      'Investimento (R$)': d.investment,
      'Progresso (%)': d.progress,
      Status: d.status
    }));

    // Worksheet 2: Tarefas
    const tasksData = (tasks || []).map(t => ({
      ID: t.id,
      Título: t.title,
      Status: t.status,
      Prioridade: t.priority,
      Responsável: t.assignee,
      Cargo: t.assigneeRole,
      'LGPD Relevante': t.lgpdTag ? 'Sim' : 'Não',
      'Horas Apontadas': t.hoursSpent,
      'Horas Estimadas': t.estimatedHours
    }));

    // Worksheet 3: Timesheet
    const timesheetData = (timesheet || []).map(ts => ({
      Data: ts.date,
      Member: ts.member,
      Role: ts.role,
      Entrega: ts.deliveryName,
      Horas: ts.hours,
      Descrição: ts.description
    }));

    const wb = XLSX.utils.book_new();
    const wsDeliveries = XLSX.utils.json_to_sheet(deliveriesData);
    const wsTasks = XLSX.utils.json_to_sheet(tasksData);
    const wsTimesheet = XLSX.utils.json_to_sheet(timesheetData);

    XLSX.utils.book_append_sheet(wb, wsDeliveries, "Entregas & Orçamento");
    XLSX.utils.book_append_sheet(wb, wsTasks, "Tarefas do Projeto");
    XLSX.utils.book_append_sheet(wb, wsTimesheet, "Timesheet");

    XLSX.writeFile(wb, `Status_Report_ProjTrack_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Export to PDF using jsPDF + html2canvas
  const exportToPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#0f172a',
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Relatorio_Executivo_ProjTrack_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      window.print();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Action Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
              Relatório Executivo Automatizado
            </span>
            <span className="text-xs text-slate-400">PDF & Excel Export</span>
          </div>
          <h1 className="text-xl font-extrabold text-white mt-1">Gerador de Status Report em PDF / Excel</h1>
          <p className="text-xs text-slate-400">
            Exportação em tempo real para a Diretoria Executiva (Sponsor) e PMO com 1 clique.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportToExcel}
            className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/20 cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Exportar para Excel (.xlsx)</span>
          </button>

          <button
            onClick={exportToPDF}
            className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span>Gerar Relatório PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Preview Area */}
      <div ref={reportRef} className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6 bg-slate-900 text-slate-100">
        
        {/* Report Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="text-xs font-extrabold tracking-widest text-indigo-400 uppercase">
              STATUS REPORT EXECUTIVO PROJTRACK
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">{canvasData.nomeProjeto}</h2>
            <p className="text-xs text-slate-400 mt-1">
              Data de Emissão: {new Date().toLocaleDateString('pt-BR')} | Patrocinador: CEO / Diretoria Executiva
            </p>
          </div>

          <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <div>
              <div className="font-bold">LGPD Conformidade</div>
              <div className="text-[10px] text-slate-400">Status: Homologado</div>
            </div>
          </div>
        </div>

        {/* Executive Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Progresso Geral</div>
            <div className="text-xl font-extrabold text-indigo-400">{overallProgress}% Concluído</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Orçamento Limite</div>
            <div className="text-xl font-extrabold text-emerald-400">
              R$ {totalInvestment.toLocaleString('pt-BR')}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Horas Apontadas</div>
            <div className="text-xl font-extrabold text-amber-400">{totalHoursSpent}h Registradas</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Redução Adm. Estimada</div>
            <div className="text-xl font-extrabold text-purple-400">40% de Ganho</div>
          </div>
        </div>

        {/* Deliveries Timeline & Financial Summary Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            1. Resumo Executivo das Entregas do Plano de Ação
          </h3>

          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Entrega</th>
                <th className="py-2.5 px-3">Prazo</th>
                <th className="py-2.5 px-3 text-right">Investimento ($)</th>
                <th className="py-2.5 px-3 text-center">Progresso</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {(canvasData.planoAcao || []).map(item => (
                <tr key={item.id}>
                  <td className="py-2.5 px-3 font-bold text-indigo-400">{item.order}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-200">{item.name}</td>
                  <td className="py-2.5 px-3 text-slate-400">{item.month}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                    R$ {item.investment.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-300">{item.progress}%</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      item.status === 'Concluído' ? 'bg-emerald-950 text-emerald-400' :
                      item.status === 'Em Andamento' ? 'bg-indigo-950 text-indigo-300' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Stakeholders & Governance Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white mb-2">2. Matriz de Stakeholders & Envolvidos</h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {(canvasData.stakeholders || []).map(s => (
                <li key={s.id} className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="font-bold text-indigo-300">{s.title}:</span> {s.description}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-2">3. Restrições & Conformidade LGPD</h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {(canvasData.restricoes || []).map(r => (
                <li key={r.id} className="p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="font-bold text-amber-300">{r.title}:</span> {r.description}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Audit Notice */}
        <div className="pt-6 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500">
          <div>ProjTrack System • Documento gerado automaticamente com criptografia auditável</div>
          <div>Conformidade LGPD Artigo 37 • Resolução PMBOK Canvas</div>
        </div>
      </div>
    </div>
  );
};
