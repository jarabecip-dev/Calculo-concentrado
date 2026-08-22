import React from 'react';
import { BatchItem } from '../types';
import { formatNumber, formatFactor } from '../data/factors';
import { Layers, Trash2, Droplets } from 'lucide-react';

interface BatchAccumulatorProps {
  batchItems: BatchItem[];
  onRemoveItem: (id: string) => void;
  onClearBatch: () => void;
}

export const BatchAccumulator: React.FC<BatchAccumulatorProps> = ({
  batchItems,
  onRemoveItem,
  onClearBatch,
}) => {
  const totalBatchLiters = batchItems.reduce((acc, item) => acc + item.totalLiters, 0);
  const totalBatchBottles = batchItems.reduce((acc, item) => acc + item.bottles, 0);

  return (
    <div id="batch-accumulator-card" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold tracking-tight">
            Lote Acumulado de Producción
          </h3>
        </div>
        {batchItems.length > 0 && (
          <button
            id="btn-clear-batch"
            type="button"
            onClick={onClearBatch}
            className="text-xs text-rose-300 hover:text-rose-100 flex items-center gap-1 font-medium transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Vaciar Lote
          </button>
        )}
      </div>

      <div className="p-4 sm:p-5">
        {batchItems.length === 0 ? (
          <div className="text-center py-6 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500">
            <Droplets className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-600">No hay partidas agregadas al lote</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Utilice el botón "+ Acumular a Lote" en la calculadora para sumar varios sabores o tamaños a una misma orden.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-3 py-2">Sabor & Tamaño</th>
                    <th className="px-3 py-2">Factor</th>
                    <th className="px-3 py-2 text-right">Botellas / Contadores</th>
                    <th className="px-3 py-2 text-right">Total Jarabe (L)</th>
                    <th className="px-2 py-2 text-center w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {batchItems.map((item) => {
                    const hasCounters = item.initialCounter !== undefined && item.finalCounter !== undefined;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2.5 font-bold text-slate-900">
                          <span className="text-[11px] font-semibold text-slate-600 mr-1">
                            {item.flavorName || 'CC MA'}
                          </span>
                          <span>CC {item.cc}</span>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-slate-600">
                          {formatFactor(item.factor)}
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <div className="font-mono font-semibold text-slate-800">
                            {formatNumber(item.bottles, 0)}
                          </div>
                          {hasCounters && (
                            <div className="text-[10px] text-slate-500 font-mono">
                              {formatNumber(item.initialCounter!, 0)} → {formatNumber(item.finalCounter!, 0)}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono font-bold text-amber-700">
                          {formatNumber(item.totalLiters, 4)} L
                        </td>
                        <td className="px-2 py-2.5 text-center">
                          <button
                            id={`btn-remove-batch-${item.id}`}
                            type="button"
                            onClick={() => onRemoveItem(item.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                            title="Eliminar partida"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total batch summary highlight */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-amber-900 block">
                  Total Lote ({batchItems.length} partidas / {formatNumber(totalBatchBottles, 0)} botellas)
                </span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {formatNumber(totalBatchLiters, 4)} <span className="text-sm font-bold text-amber-800">Litros de Jarabe</span>
                </span>
              </div>
              <div className="text-right text-xs text-slate-600 font-mono">
                <div>{formatNumber(totalBatchLiters / 1000, 3)} m³</div>
                <div>{formatNumber(totalBatchLiters * 0.264172, 2)} Galones</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
