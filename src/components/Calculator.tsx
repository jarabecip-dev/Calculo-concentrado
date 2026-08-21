import React, { useState, useId } from 'react';
import { 
  STANDARD_FACTORS, 
  formatNumber, 
  formatFactor 
} from '../data/factors';
import { FactorItem, CalculationRecord } from '../types';
import { 
  Check, 
  Copy, 
  RotateCcw, 
  BookmarkPlus, 
  Layers, 
  TrendingUp, 
  Info,
  Beaker,
  Sparkles,
  Sliders
} from 'lucide-react';

interface CalculatorProps {
  onSaveRecord: (record: Omit<CalculationRecord, 'id' | 'timestamp'>) => void;
  onAddToBatch: (item: { cc: number; factor: number; bottles: number; totalLiters: number }) => void;
  selectedCC?: number;
  onSelectCC?: (cc: number) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  onSaveRecord,
  onAddToBatch,
  selectedCC: externalCC,
  onSelectCC: externalOnSelectCC,
}) => {
  const [internalCC, setInternalCC] = useState<number>(1000);
  const currentCC = externalCC !== undefined ? externalCC : internalCC;

  const setCurrentCC = (cc: number) => {
    if (externalOnSelectCC) {
      externalOnSelectCC(cc);
    }
    setInternalCC(cc);
  };

  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customCCInput, setCustomCCInput] = useState<string>('');
  const [customFactorInput, setCustomFactorInput] = useState<string>('');

  const [bottlesInput, setBottlesInput] = useState<string>('1000');
  const [copied, setCopied] = useState<boolean>(false);
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);
  const [batchFeedback, setBatchFeedback] = useState<boolean>(false);

  // Determine current factor
  const standardMatch = STANDARD_FACTORS.find((f) => f.cc === currentCC);
  
  let activeFactor = 0;
  let activeCC = currentCC;

  if (isCustomMode) {
    activeCC = parseFloat(customCCInput) || 0;
    activeFactor = parseFloat(customFactorInput.replace(',', '.')) || 0;
  } else if (standardMatch) {
    activeFactor = standardMatch.factor;
  }

  const parsedBottles = parseFloat(bottlesInput.replace(/\./g, '').replace(',', '.')) || 0;
  const totalLiters = parsedBottles > 0 && activeFactor > 0 ? parsedBottles * activeFactor : 0;
  const totalM3 = totalLiters / 1000;
  const totalGallons = totalLiters * 0.264172;

  const handleSelectStandardCC = (item: FactorItem) => {
    setIsCustomMode(false);
    setCurrentCC(item.cc);
  };

  const handleAddBottles = (amount: number) => {
    const current = parseFloat(bottlesInput.replace(/\./g, '')) || 0;
    const nextVal = current + amount;
    setBottlesInput(nextVal.toString());
  };

  const handleReset = () => {
    setBottlesInput('');
    setCopied(false);
  };

  const handleCopyResult = () => {
    if (totalLiters <= 0) return;
    const textToCopy = `Cálculo de Jarabe:\n- Tamaño: CC ${activeCC}\n- Factor: ${activeFactor}\n- Cantidad: ${formatNumber(parsedBottles, 0)} botellas\n- Total Jarabe: ${formatNumber(totalLiters, 4)} Litros (${formatNumber(totalLiters, 2)} L)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (totalLiters <= 0 || parsedBottles <= 0 || activeFactor <= 0) return;
    onSaveRecord({
      cc: activeCC,
      factor: activeFactor,
      bottles: parsedBottles,
      totalLiters: totalLiters,
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleAddBatch = () => {
    if (totalLiters <= 0 || parsedBottles <= 0 || activeFactor <= 0) return;
    onAddToBatch({
      cc: activeCC,
      factor: activeFactor,
      bottles: parsedBottles,
      totalLiters: totalLiters,
    });
    setBatchFeedback(true);
    setTimeout(() => setBatchFeedback(false), 2000);
  };

  return (
    <div id="calculator-section" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-4 border-b border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Beaker className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-wide">
                Calculadora Rápida de Jarabe
              </h2>
              <p className="text-xs text-slate-300">
                Seleccione el formato en CC e ingrese la cantidad de botellas a procesar
              </p>
            </div>
          </div>

          <button
            id="toggle-custom-mode-btn"
            onClick={() => setIsCustomMode(!isCustomMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isCustomMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            {isCustomMode ? 'Modo Estándar' : 'Factor Personalizado'}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Step 1: CC and Factor Selection */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="block text-sm font-bold text-slate-800 tracking-tight">
              1. Seleccionar Tamaño (CC) y Factor correspondiente
            </label>
            <span className="text-xs text-slate-600">
              {isCustomMode ? 'Personalizado' : '9 Tamaños estándar disponibles'}
            </span>
          </div>

          {!isCustomMode ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2.5">
              {STANDARD_FACTORS.map((item) => {
                const isSelected = currentCC === item.cc;
                return (
                  <button
                    key={item.id}
                    id={`btn-select-cc-${item.cc}`}
                    type="button"
                    onClick={() => handleSelectStandardCC(item)}
                    className={`relative text-left p-3 rounded-xl border transition-all duration-150 ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-slate-900 ring-2 ring-amber-400/40 shadow-sm'
                        : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm tracking-tight text-slate-900">
                        CC {item.cc}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-baseline gap-1 text-xs">
                      <span className="text-slate-600 font-medium">Factor:</span>
                      <span className="font-mono font-bold text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded text-[11px]">
                        {formatFactor(item.factor)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Custom Factor Mode Form */
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tamaño Personalizado (CC):
                </label>
                <input
                  id="input-custom-cc"
                  type="number"
                  placeholder="Ej: 1800"
                  value={customCCInput}
                  onChange={(e) => setCustomCCInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Factor de Jarabe (ej: 0.255000):
                </label>
                <input
                  id="input-custom-factor"
                  type="text"
                  placeholder="Ej: 0.285400"
                  value={customFactorInput}
                  onChange={(e) => setCustomFactorInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Bottle Quantity Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label 
              htmlFor="input-bottle-quantity"
              className="block text-sm font-bold text-slate-800 tracking-tight"
            >
              2. Cantidad de Botellas a Calcular
            </label>
            {bottlesInput && (
              <button
                id="btn-clear-bottles"
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-600 hover:text-red-700 flex items-center gap-1 font-medium transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Limpiar
              </button>
            )}
          </div>

          <div className="relative">
            <input
              id="input-bottle-quantity"
              type="number"
              min="0"
              step="1"
              placeholder="Ingrese número de botellas (ej. 5000)"
              value={bottlesInput}
              onChange={(e) => setBottlesInput(e.target.value)}
              className="w-full pl-4 pr-24 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-600 font-semibold text-xs bg-slate-200/80 px-2.5 py-1 rounded-md">
              Botellas
            </div>
          </div>

          {/* Quick Increment Chips */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-slate-600 mr-1">Sumar rápido:</span>
            {[100, 500, 1000, 2500, 5000, 10000, 25000, 50000].map((amt) => (
              <button
                key={amt}
                id={`btn-add-bottles-${amt}`}
                type="button"
                onClick={() => handleAddBottles(amt)}
                className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 rounded-lg border border-slate-200/80 transition-colors"
              >
                +{formatNumber(amt, 0)}
              </button>
            ))}
          </div>
        </div>

        {/* Calculation Result Display Card */}
        <div 
          id="calculation-result-box"
          className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-50/60 via-slate-50/80 to-amber-50/30 p-5 sm:p-6 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/70 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-2.5 py-1 rounded-full">
                Resultado del Cálculo
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
                  {formatNumber(totalLiters, 4)}
                </span>
                <span className="text-lg font-bold text-amber-700">Litros de Jarabe</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Equivalente a: <strong className="text-slate-700 font-mono">{formatNumber(totalLiters, 2)} L</strong> redondeado (2 dec)
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-copy-result"
                type="button"
                onClick={handleCopyResult}
                disabled={totalLiters <= 0}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                {copied ? '¡Copiado!' : 'Copiar'}
              </button>

              <button
                id="btn-save-record"
                type="button"
                onClick={handleSave}
                disabled={totalLiters <= 0}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {savedFeedback ? <Check className="w-4 h-4 text-emerald-600" /> : <BookmarkPlus className="w-4 h-4 text-amber-600" />}
                {savedFeedback ? '¡Guardado!' : 'Guardar en Historial'}
              </button>

              <button
                id="btn-add-to-batch"
                type="button"
                onClick={handleAddBatch}
                disabled={totalLiters <= 0}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {batchFeedback ? <Check className="w-4 h-4 text-slate-950" /> : <Layers className="w-4 h-4 text-slate-950" />}
                {batchFeedback ? '¡Agregado a Lote!' : '+ Acumular a Lote'}
              </button>
            </div>
          </div>

          {/* Detailed breakdown formula */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/80 border border-slate-200/80">
              <span className="text-slate-600 font-medium block">Formato seleccionado:</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                CC {activeCC || '—'}
              </span>
              <span className="text-[11px] text-slate-600">
                Factor: <strong className="font-mono text-amber-700">{activeFactor ? formatFactor(activeFactor) : '0,000000'}</strong>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/80 border border-slate-200/80">
              <span className="text-slate-600 font-medium block">Cantidad a embotellar:</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block font-mono">
                {formatNumber(parsedBottles, 0)} <span className="font-sans font-normal text-xs text-slate-600">botellas</span>
              </span>
              <span className="text-[11px] text-slate-600">
                Operación: {formatNumber(parsedBottles, 0)} × {activeFactor}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/80 border border-slate-200/80">
              <span className="text-slate-600 font-medium block">Otras unidades de volumen:</span>
              <div className="mt-0.5 flex flex-col font-mono text-[11px] text-slate-700">
                <span>• {formatNumber(totalM3, 4)} m³ (metros cúbicos)</span>
                <span>• {formatNumber(totalGallons, 2)} Galones aprox.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
