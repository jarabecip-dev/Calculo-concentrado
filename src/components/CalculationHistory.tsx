import React from 'react';
import { CalculationRecord } from '../types';
import { formatNumber, formatFactor } from '../data/factors';
import { History, Trash2, Download, Clock } from 'lucide-react';

interface CalculationHistoryProps {
  records: CalculationRecord[];
  onClearHistory: () => void;
  onDeleteRecord: (id: string) => void;
  onReuseRecord: (record: CalculationRecord) => void;
}

export const CalculationHistory: React.FC<CalculationHistoryProps> = ({
  records,
  onClearHistory,
  onDeleteRecord,
  onReuseRecord,
}) => {
  const exportToCSV = () => {
    if (records.length === 0) return;
    const headers = ['Fecha', 'Hora', 'Tamaño (CC)', 'Factor Jarabe', 'Botellas', 'Total Litros Jarabe'];
    const rows = records.map((r) => {
      const d = new Date(r.timestamp);
      return [
        d.toLocaleDateString('es-CL'),
        d.toLocaleTimeString('es-CL'),
        r.cc,
        r.factor,
        r.bottles,
        r.totalLiters.toFixed(4),
      ].join(';');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(';'), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `calculos_jarabe_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="history-section-card" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold tracking-tight">
            Historial de Cálculos Guardados
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {records.length > 0 && (
            <>
              <button
                id="btn-export-csv"
                type="button"
                onClick={exportToCSV}
                title="Exportar a archivo CSV (Excel)"
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-medium bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Exportar CSV
              </button>
              <button
                id="btn-clear-history"
                type="button"
                onClick={onClearHistory}
                className="text-xs text-rose-300 hover:text-rose-100 flex items-center gap-1 font-medium px-2 py-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Borrar
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {records.length === 0 ? (
          <div className="text-center py-6 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500">
            <Clock className="w-7 h-7 mx-auto text-slate-300 mb-1.5" />
            <p className="text-xs font-semibold text-slate-600">No hay registros en el historial</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Presione "Guardar en Historial" al calcular para archivar registros con fecha y hora.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-3 py-2">Fecha/Hora</th>
                  <th className="px-3 py-2">Formato</th>
                  <th className="px-3 py-2">Factor</th>
                  <th className="px-3 py-2 text-right">Botellas</th>
                  <th className="px-3 py-2 text-right">Total Jarabe</th>
                  <th className="px-2 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r) => {
                  const dateStr = new Date(r.timestamp).toLocaleTimeString('es-CL', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  return (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 text-slate-500 font-mono text-[11px]">
                        {dateStr}
                      </td>
                      <td className="px-3 py-2 font-bold text-slate-900">
                        CC {r.cc}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-600">
                        {formatFactor(r.factor)}
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-semibold text-slate-800">
                        {formatNumber(r.bottles, 0)}
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-amber-700">
                        {formatNumber(r.totalLiters, 4)} L
                      </td>
                      <td className="px-2 py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            id={`btn-reuse-record-${r.id}`}
                            type="button"
                            onClick={() => onReuseRecord(r)}
                            title="Recargar en calculadora"
                            className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 rounded transition-colors"
                          >
                            Usar
                          </button>
                          <button
                            id={`btn-delete-record-${r.id}`}
                            type="button"
                            onClick={() => onDeleteRecord(r.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
