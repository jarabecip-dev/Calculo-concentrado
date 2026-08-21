import React from 'react';
import { STANDARD_FACTORS, formatFactor, formatNumber } from '../data/factors';
import { FactorItem } from '../types';
import { Table, ArrowRight, CheckCircle2 } from 'lucide-react';

interface FactorReferenceTableProps {
  currentCC: number;
  onSelectCC: (cc: number) => void;
}

export const FactorReferenceTable: React.FC<FactorReferenceTableProps> = ({
  currentCC,
  onSelectCC,
}) => {
  return (
    <div id="factor-table-card" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold tracking-tight">
            Tabla Maestra de Factores de Jarabe
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          9 Formatos
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-xs text-slate-600 mb-3">
          Haga clic en cualquier formato para cargarlo inmediatamente en la calculadora principal:
        </p>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-3.5 py-2.5">Tamaño (CC)</th>
                <th className="px-3.5 py-2.5">Volumen Litros</th>
                <th className="px-3.5 py-2.5">Factor de Jarabe</th>
                <th className="px-3.5 py-2.5 text-right">Ej. 1.000 Botellas</th>
                <th className="px-3.5 py-2.5 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {STANDARD_FACTORS.map((item) => {
                const isSelected = currentCC === item.cc;
                const sampleLiters = 1000 * item.factor;
                return (
                  <tr
                    key={item.id}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 font-semibold text-slate-950'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                    onClick={() => onSelectCC(item.cc)}
                  >
                    <td className="px-3.5 py-2.5 font-bold text-slate-900 flex items-center gap-1.5">
                      {isSelected ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 inline flex-shrink-0" />
                      ) : null}
                      CC {item.cc}
                    </td>
                    <td className="px-3.5 py-2.5 text-slate-600">
                      {(item.cc / 1000).toFixed(2)} L
                    </td>
                    <td className="px-3.5 py-2.5 font-mono font-bold text-amber-700">
                      {formatFactor(item.factor)}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono text-slate-800">
                      {formatNumber(sampleLiters, 2)} L
                    </td>
                    <td className="px-3.5 py-2.5 text-center">
                      <button
                        id={`btn-table-select-cc-${item.cc}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCC(item.cc);
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors inline-flex items-center gap-1 ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSelected ? 'Activo' : 'Cargar'}
                        {!isSelected && <ArrowRight className="w-3 h-3 text-slate-400" />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
