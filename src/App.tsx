/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Calculator } from './components/Calculator';
import { FactorReferenceTable } from './components/FactorReferenceTable';
import { BatchAccumulator } from './components/BatchAccumulator';
import { CalculationHistory } from './components/CalculationHistory';
import { CalculationRecord, BatchItem } from './types';
import { FLAVORS, ALL_FACTORS } from './data/factors';
import { 
  HelpCircle,
  FlaskConical
} from 'lucide-react';

export default function App() {
  const [selectedFlavorId, setSelectedFlavorId] = useState<string>('CC_MA');
  const [selectedCC, setSelectedCC] = useState<number>(1000);
  
  // Persistence for calculations history
  const [history, setHistory] = useState<CalculationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('jarabe_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistence for production batch
  const [batchItems, setBatchItems] = useState<BatchItem[]>(() => {
    try {
      const saved = localStorage.getItem('jarabe_batch');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('jarabe_history', JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('jarabe_batch', JSON.stringify(batchItems));
    } catch (e) {
      console.error(e);
    }
  }, [batchItems]);

  const handleSaveRecord = (record: Omit<CalculationRecord, 'id' | 'timestamp'>) => {
    const newRecord: CalculationRecord = {
      ...record,
      id: 'rec-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      timestamp: Date.now(),
    };
    setHistory((prev) => [newRecord, ...prev].slice(0, 50));
  };

  const handleAddToBatch = (item: { 
    flavorId: string;
    flavorName: string;
    cc: number; 
    factor: number; 
    bottles: number; 
    totalLiters: number;
    initialCounter?: number;
    finalCounter?: number;
  }) => {
    const newItem: BatchItem = {
      ...item,
      id: 'batch-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    };
    setBatchItems((prev) => [...prev, newItem]);
  };

  const handleRemoveBatchItem = (id: string) => {
    setBatchItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearBatch = () => {
    if (window.confirm('¿Desea vaciar todos los elementos del lote acumulado?')) {
      setBatchItems([]);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('¿Desea borrar el historial de cálculos?')) {
      setHistory([]);
    }
  };

  const handleDeleteHistoryRecord = (id: string) => {
    setHistory((prev) => prev.filter((r) => r.id !== id));
  };

  const handleReuseRecord = (record: CalculationRecord) => {
    if (record.flavorId) {
      setSelectedFlavorId(record.flavorId);
    }
    setSelectedCC(record.cc);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFlavorAndCC = (flavorId: string, cc: number) => {
    setSelectedFlavorId(flavorId);
    setSelectedCC(cc);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      <Navbar onPrint={handlePrint} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* Main interactive calculator */}
        <section aria-label="Calculadora principal">
          <Calculator
            selectedFlavorId={selectedFlavorId}
            onSelectFlavorId={setSelectedFlavorId}
            selectedCC={selectedCC}
            onSelectCC={setSelectedCC}
            onSaveRecord={handleSaveRecord}
            onAddToBatch={handleAddToBatch}
          />
        </section>

        {/* Secondary section: Reference Table and Batch / History */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Main column: Factor Reference Table */}
          <section className="lg:col-span-6 space-y-6">
            <FactorReferenceTable
              currentFlavorId={selectedFlavorId}
              currentCC={selectedCC}
              onSelectFlavorAndCC={handleSelectFlavorAndCC}
            />

            {/* Quick explanation guide card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-2">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>¿Cómo funciona el cálculo de jarabe por sabor?</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Cada sabor o línea (CC MA, CC SO, CCL, CCZ, SPZ, SP FX, FN FX, FNZ, SWT, SWPZ, CRN, CRLL, CRP, CRT) y tamaño en centímetros cúbicos (CC) tiene asignado un factor técnico de dosificación para calcular con exactitud los litros de jarabe terminado necesarios.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1 font-mono text-slate-700">
                <div className="font-bold text-slate-900 font-sans">Fórmula con contadores:</div>
                <div className="text-slate-600 font-sans text-[11px]">
                  1. Botellas Netas = Contador Final - Contador Inicial
                </div>
                <div className="text-amber-800 font-bold">
                  2. Litros Jarabe = Botellas Netas × Factor del Sabor y Formato
                </div>
                <div className="text-slate-500 text-[11px] font-sans pt-1">
                  Ejemplo: 5.000 botellas de FNZ 500 = 5.000 × 0,09921825 = 496,0913 Litros.
                </div>
              </div>
            </div>
          </section>

          {/* Right column: Batch Accumulator & History */}
          <section className="lg:col-span-6 space-y-6">
            <BatchAccumulator
              batchItems={batchItems}
              onRemoveItem={handleRemoveBatchItem}
              onClearBatch={handleClearBatch}
            />

            <CalculationHistory
              records={history}
              onClearHistory={handleClearHistory}
              onDeleteRecord={handleDeleteHistoryRecord}
              onReuseRecord={handleReuseRecord}
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-200">Calculadora de Jarabe</span>
            <span>— Control de dosificación, sabores y contadores</span>
          </div>
          <div className="text-slate-400 text-center sm:text-right">
            14 líneas: CC MA, CC SO, CCL, CCZ, SPZ, SP FX, FN FX, FNZ, SWT, SWPZ, CRN, CRLL, CRP, CRT
          </div>
        </div>
      </footer>
    </div>
  );
}
