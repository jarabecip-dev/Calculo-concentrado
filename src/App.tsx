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
import { STANDARD_FACTORS } from './data/factors';
import { 
  Calculator as CalcIcon, 
  Table, 
  Layers, 
  History, 
  HelpCircle,
  FileSpreadsheet,
  CheckCircle,
  FlaskConical
} from 'lucide-react';

export default function App() {
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

  const handleAddToBatch = (item: { cc: number; factor: number; bottles: number; totalLiters: number }) => {
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
    setSelectedCC(record.cc);
    // Scroll to top calculator
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
              currentCC={selectedCC}
              onSelectCC={setSelectedCC}
            />

            {/* Quick explanation guide card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-2">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>¿Cómo funciona el cálculo de jarabe?</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Cada tamaño de botella en centímetros cúbicos (CC) tiene asignado un factor técnico de dosificación que representa la cantidad exacta de litros de jarabe terminado necesarios por unidad producida.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1 font-mono text-slate-700">
                <div className="font-bold text-slate-900 font-sans">Fórmula aplicada:</div>
                <div className="text-amber-800 font-bold">
                  Litros Totales de Jarabe = Cantidad de Botellas × Factor
                </div>
                <div className="text-slate-500 text-[11px] font-sans pt-1">
                  Ejemplo: 5.000 botellas de CC 1000 = 5.000 × 0,154871 = 774,355 Litros de jarabe.
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
            <span>— Control de dosificación y embotellado</span>
          </div>
          <div className="text-slate-400 text-center sm:text-right">
            Factores estándar: CC 1000 a CC 3000
          </div>
        </div>
      </footer>
    </div>
  );
}
