import React, { useState } from 'react';
import { FLAVORS, ALL_FACTORS, getFactorsByFlavor, formatFactor, formatNumber } from '../data/factors';
import { Table, ArrowRight, CheckCircle2, Filter } from 'lucide-react';

interface FactorReferenceTableProps {
  currentFlavorId: string;
  currentCC: number;
  onSelectFlavorAndCC: (flavorId: string, cc: number) => void;
}

export const FactorReferenceTable: React.FC<FactorReferenceTableProps> = ({
  currentFlavorId,
  currentCC,
  onSelectFlavorAndCC,
}) => {
  const [filterFlavor, setFilterFlavor] = useState<string>(currentFlavorId || 'ALL');

  const displayedFactors = filterFlavor === 'ALL'
    ? ALL_FACTORS
    : getFactorsByFlavor(filterFlavor);

  return (
    <div id="factor-table-card" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold tracking-tight">
            Tabla Maestra de Factores por Sabor
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          {displayedFactors.length} de {ALL_FACTORS.length} formatos
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-3">
        {/* Filter buttons by flavor */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-medium text-[11px] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            Filtrar:
          </span>
          <button
            type="button"
            onClick={() => setFilterFlavor('ALL')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              filterFlavor === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Todos ({ALL_FACTORS.length})
          </button>
          {FLAVORS.map((f) => {
            const isSelected = filterFlavor === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterFlavor(f.id)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {f.name}
              </button>
            );
          })}
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-3.5 py-2.5">Sabor / Línea</th>
                <th className="px-3.5 py-2.5">Tamaño (CC)</th>
                <th className="px-3.5 py-2.5">Factor de Jarabe</th>
                <th className="px-3.5 py-2.5 text-right">Ej. 1.000 Botellas</th>
                <th className="px-3.5 py-2.5 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedFactors.map((item) => {
                const isSelected = currentFlavorId === item.flavorId && currentCC === item.cc;
                const sampleLiters = 1000 * item.factor;
                return (
                  <tr
                    key={item.id}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 font-semibold text-slate-950'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                    onClick={() => onSelectFlavorAndCC(item.flavorId, item.cc)}
                  >
                    <td className="px-3.5 py-2.5 font-bold text-slate-900">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 text-[11px]">
                        {item.flavorName}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 font-bold text-slate-900 flex items-center gap-1.5">
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 inline flex-shrink-0" />
                      )}
                      CC {item.cc}
                    </td>
                    <td className="px-3.5 py-2.5 font-mono font-bold text-amber-700">
                      {formatFactor(item.factor)}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-mono text-slate-800">
                      {formatNumber(sampleLiters, 2)} L
                    </td>
                    <td className="px-3.5 py-2.5 text-center">
                      <button
                        id={`btn-table-select-cc-${item.id}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectFlavorAndCC(item.flavorId, item.cc);
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer ${
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
