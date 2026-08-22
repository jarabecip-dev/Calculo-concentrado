import React, { useState, useEffect } from 'react';
import { 
  FLAVORS, 
  getFactorsByFlavor, 
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
  Beaker,
  Sliders,
  AlertCircle,
  FastForward,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface CalculatorProps {
  onSaveRecord: (record: Omit<CalculationRecord, 'id' | 'timestamp'>) => void;
  onAddToBatch: (item: { 
    flavorId: string;
    flavorName: string;
    cc: number; 
    factor: number; 
    bottles: number; 
    totalLiters: number; 
    initialCounter?: number; 
    finalCounter?: number; 
  }) => void;
  selectedFlavorId: string;
  onSelectFlavorId: (flavorId: string) => void;
  selectedCC: number;
  onSelectCC: (cc: number) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({
  onSaveRecord,
  onAddToBatch,
  selectedFlavorId,
  onSelectFlavorId,
  selectedCC,
  onSelectCC,
}) => {
  // Custom Factor mode
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customFlavorName, setCustomFlavorName] = useState<string>('Personalizado');
  const [customCCInput, setCustomCCInput] = useState<string>('');
  const [customFactorInput, setCustomFactorInput] = useState<string>('');

  // Mode: 'counters' (Contador Inicial & Final) or 'direct' (Cantidad directa)
  const [inputMode, setInputMode] = useState<'counters' | 'direct'>('counters');

  // Counter inputs
  const [initialCounterInput, setInitialCounterInput] = useState<string>('');
  const [finalCounterInput, setFinalCounterInput] = useState<string>('');

  // Direct bottle input
  const [directBottlesInput, setDirectBottlesInput] = useState<string>('');

  const [copied, setCopied] = useState<boolean>(false);
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);
  const [batchFeedback, setBatchFeedback] = useState<boolean>(false);

  // Available factors for currently selected flavor
  const availableFactors = getFactorsByFlavor(selectedFlavorId);

  // Find active factor item
  const standardMatch = availableFactors.find((f) => f.cc === selectedCC);

  // If currently selected CC is not in the new flavor's available factors, default to the first one
  useEffect(() => {
    if (!isCustomMode && availableFactors.length > 0) {
      const match = availableFactors.find((f) => f.cc === selectedCC);
      if (!match) {
        onSelectCC(availableFactors[0].cc);
      }
    }
  }, [selectedFlavorId, availableFactors, selectedCC, onSelectCC, isCustomMode]);

  const currentFlavorObj = FLAVORS.find((f) => f.id === selectedFlavorId) || FLAVORS[0];

  let activeFactor = 0;
  let activeCC = selectedCC;
  let activeFlavorName = currentFlavorObj.name;
  let activeFlavorId = selectedFlavorId;

  if (isCustomMode) {
    activeFlavorName = customFlavorName.trim() || 'Personalizado';
    activeFlavorId = 'CUSTOM';
    activeCC = parseFloat(customCCInput) || 0;
    activeFactor = parseFloat(customFactorInput.replace(',', '.')) || 0;
  } else if (standardMatch) {
    activeFactor = standardMatch.factor;
    activeCC = standardMatch.cc;
    activeFlavorName = standardMatch.flavorName;
  } else if (availableFactors.length > 0) {
    activeFactor = availableFactors[0].factor;
    activeCC = availableFactors[0].cc;
    activeFlavorName = availableFactors[0].flavorName;
  }

  // Parse counters
  const parsedInitial = initialCounterInput !== '' ? parseFloat(initialCounterInput.replace(/\./g, '').replace(',', '.')) : NaN;
  const parsedFinal = finalCounterInput !== '' ? parseFloat(finalCounterInput.replace(/\./g, '').replace(',', '.')) : NaN;

  let calculatedBottles = 0;
  let isNegativeDiff = false;
  const hasCountersFilled = !isNaN(parsedInitial) && !isNaN(parsedFinal);

  if (inputMode === 'counters') {
    if (hasCountersFilled) {
      const diff = parsedFinal - parsedInitial;
      if (diff < 0) {
        isNegativeDiff = true;
        calculatedBottles = 0;
      } else {
        calculatedBottles = diff;
      }
    } else {
      calculatedBottles = 0;
    }
  } else {
    calculatedBottles = parseFloat(directBottlesInput.replace(/\./g, '').replace(',', '.')) || 0;
  }

  const totalLiters = calculatedBottles > 0 && activeFactor > 0 ? calculatedBottles * activeFactor : 0;
  const totalM3 = totalLiters / 1000;
  const totalGallons = totalLiters * 0.264172;

  const handleSelectStandardCC = (item: FactorItem) => {
    setIsCustomMode(false);
    onSelectCC(item.cc);
  };

  const handleFlavorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFlavorId = e.target.value;
    setIsCustomMode(false);
    onSelectFlavorId(newFlavorId);
    const newItems = getFactorsByFlavor(newFlavorId);
    if (newItems.length > 0) {
      // Check if current CC exists in new flavor
      const existing = newItems.find((f) => f.cc === selectedCC);
      if (existing) {
        onSelectCC(existing.cc);
      } else {
        onSelectCC(newItems[0].cc);
      }
    }
  };

  const handleResetCounters = () => {
    setInitialCounterInput('');
    setFinalCounterInput('');
    setDirectBottlesInput('');
    setCopied(false);
  };

  const handleShiftCounters = () => {
    if (!isNaN(parsedFinal) && parsedFinal >= 0) {
      setInitialCounterInput(parsedFinal.toString());
      setFinalCounterInput('');
    }
  };

  const handleCopyResult = () => {
    if (totalLiters <= 0) return;
    const textToCopy = `Cálculo de Jarabe:
- Sabor / Línea: ${activeFlavorName}
- Tamaño: CC ${activeCC}
- Factor: ${activeFactor}
${inputMode === 'counters' ? `- Contador Inicial: ${formatNumber(parsedInitial, 0)}\n- Contador Final: ${formatNumber(parsedFinal, 0)}\n` : ''}- Diferencia/Cantidad: ${formatNumber(calculatedBottles, 0)} botellas
- Total Jarabe: ${formatNumber(totalLiters, 4)} Litros (${formatNumber(totalLiters, 2)} L)`;
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (totalLiters <= 0 || calculatedBottles <= 0 || activeFactor <= 0) return;
    onSaveRecord({
      flavorId: activeFlavorId,
      flavorName: activeFlavorName,
      cc: activeCC,
      factor: activeFactor,
      bottles: calculatedBottles,
      totalLiters: totalLiters,
      initialCounter: inputMode === 'counters' && !isNaN(parsedInitial) ? parsedInitial : undefined,
      finalCounter: inputMode === 'counters' && !isNaN(parsedFinal) ? parsedFinal : undefined,
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleAddBatch = () => {
    if (totalLiters <= 0 || calculatedBottles <= 0 || activeFactor <= 0) return;
    onAddToBatch({
      flavorId: activeFlavorId,
      flavorName: activeFlavorName,
      cc: activeCC,
      factor: activeFactor,
      bottles: calculatedBottles,
      totalLiters: totalLiters,
      initialCounter: inputMode === 'counters' && !isNaN(parsedInitial) ? parsedInitial : undefined,
      finalCounter: inputMode === 'counters' && !isNaN(parsedFinal) ? parsedFinal : undefined,
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
                Calculadora de Jarabe por Sabor y Contadores
              </h2>
              <p className="text-xs text-slate-300">
                Seleccione el sabor, el tamaño CC e ingrese los contadores de botellas
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
            {isCustomMode ? 'Modo Sabores Estándar' : 'Factor Personalizado'}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Step 1: Sabor Dropdown & CC Formats Selection */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <label 
                htmlFor="select-flavor-dropdown"
                className="block text-sm font-bold text-slate-800 tracking-tight"
              >
                1. Seleccionar Sabor / Línea de Producto
              </label>
              <p className="text-xs text-slate-500">
                El desplegable actualiza automáticamente la lista de formatos y factores
              </p>
            </div>

            {!isCustomMode && (
              <div className="relative min-w-[220px]">
                <select
                  id="select-flavor-dropdown"
                  value={selectedFlavorId}
                  onChange={handleFlavorChange}
                  className="w-full appearance-none bg-amber-500/10 hover:bg-amber-500/15 border-2 border-amber-500/60 rounded-xl px-4 py-2.5 pr-10 text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer transition-colors shadow-xs"
                >
                  {FLAVORS.map((f) => (
                    <option key={f.id} value={f.id} className="bg-white text-slate-900 font-semibold py-1">
                      {f.name} ({getFactorsByFlavor(f.id).length} formatos)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-amber-700 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}
          </div>

          {/* CC Format buttons */}
          {!isCustomMode ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Formatos disponibles para <span className="text-amber-700 underline font-black">{currentFlavorObj.name}</span>:
                </span>
                <span className="text-[11px] text-slate-500">
                  {availableFactors.length} tamaños
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {availableFactors.map((item) => {
                  const isSelected = selectedCC === item.cc;
                  return (
                    <button
                      key={item.id}
                      id={`btn-select-cc-${item.id}`}
                      type="button"
                      onClick={() => handleSelectStandardCC(item)}
                      className={`relative text-left p-3 rounded-xl border transition-all duration-150 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 text-slate-900 ring-2 ring-amber-400/40 shadow-sm'
                          : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm tracking-tight text-slate-900">
                          {item.flavorName} {item.cc}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-baseline gap-1 text-xs">
                        <span className="text-slate-500 text-[11px]">Factor:</span>
                        <span className="font-mono font-bold text-amber-800 bg-amber-100/70 px-1 py-0.5 rounded text-[11px]">
                          {formatFactor(item.factor)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Custom Factor Mode Form */
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre Sabor / Línea:
                </label>
                <input
                  id="input-custom-flavor-name"
                  type="text"
                  placeholder="Ej: CC ESPECIAL"
                  value={customFlavorName}
                  onChange={(e) => setCustomFlavorName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
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

        {/* Step 2: Bottle Counters (Inicial, Final y Diferencia) */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <label className="block text-sm font-bold text-slate-800 tracking-tight">
                2. Cantidad de Botellas (Contador Inicial y Final)
              </label>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle input mode */}
              <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs">
                <button
                  id="btn-mode-counters"
                  type="button"
                  onClick={() => setInputMode('counters')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    inputMode === 'counters'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Contadores (Inicial / Final)
                </button>
                <button
                  id="btn-mode-direct"
                  type="button"
                  onClick={() => setInputMode('direct')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    inputMode === 'direct'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cantidad Directa
                </button>
              </div>

              {(initialCounterInput || finalCounterInput || directBottlesInput) && (
                <button
                  id="btn-clear-counters"
                  type="button"
                  onClick={handleResetCounters}
                  className="text-xs text-slate-600 hover:text-red-700 flex items-center gap-1 font-medium transition-colors ml-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {inputMode === 'counters' ? (
            /* 2 Input Boxes + 1 Difference Box Layout */
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch">
                {/* Cuadro 1: Contador Inicial */}
                <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus-within:border-amber-500 focus-within:bg-white transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <label 
                      htmlFor="input-initial-counter"
                      className="text-xs font-bold uppercase tracking-wider text-slate-700"
                    >
                      Contador Inicial
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">Inicio</span>
                  </div>
                  <div className="relative">
                    <input
                      id="input-initial-counter"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Ej: 10000"
                      value={initialCounterInput}
                      onChange={(e) => setInitialCounterInput(e.target.value)}
                      className="w-full py-2 bg-transparent text-xl font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Lectura de inicio de turno o lote</p>
                </div>

                {/* Cuadro 2: Contador Final */}
                <div className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus-within:border-amber-500 focus-within:bg-white transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <label 
                      htmlFor="input-final-counter"
                      className="text-xs font-bold uppercase tracking-wider text-slate-700"
                    >
                      Contador Final
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">Término</span>
                  </div>
                  <div className="relative">
                    <input
                      id="input-final-counter"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Ej: 15000"
                      value={finalCounterInput}
                      onChange={(e) => setFinalCounterInput(e.target.value)}
                      className="w-full py-2 bg-transparent text-xl font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Lectura al finalizar el envasado</p>
                </div>

                {/* Cuadro 3: Diferencia (Botellas a Calcular) */}
                <div 
                  id="difference-result-box"
                  className={`p-4 rounded-xl border-2 flex flex-col justify-between transition-all ${
                    isNegativeDiff
                      ? 'bg-rose-50 border-rose-300'
                      : calculatedBottles > 0
                      ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-400/30'
                      : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Diferencia (Botellas)
                    </span>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded">
                      Final - Inicial
                    </span>
                  </div>

                  <div className="my-1">
                    {isNegativeDiff ? (
                      <div className="flex items-center gap-1.5 text-rose-700 text-xs font-semibold">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>El contador final debe ser mayor o igual al inicial</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                          {hasCountersFilled ? formatNumber(calculatedBottles, 0) : '0'}
                        </span>
                        <span className="text-xs font-bold text-slate-600">botellas netas</span>
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span>
                      {hasCountersFilled && !isNegativeDiff
                        ? `${formatNumber(parsedFinal, 0)} - ${formatNumber(parsedInitial, 0)}`
                        : 'Ingrese ambos contadores'}
                    </span>
                    {!isNaN(parsedFinal) && parsedFinal > 0 && (
                      <button
                        type="button"
                        onClick={handleShiftCounters}
                        title="Pasar contador final como nuevo inicial para el siguiente lote"
                        className="text-[10px] font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-0.5 underline cursor-pointer"
                      >
                        <FastForward className="w-2.5 h-2.5" />
                        Fijar como nuevo inicio
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Direct Bottle Input Mode */
            <div className="relative">
              <input
                id="input-direct-bottle-quantity"
                type="number"
                min="0"
                step="1"
                placeholder="Ingrese número de botellas a calcular (ej. 5000)"
                value={directBottlesInput}
                onChange={(e) => setDirectBottlesInput(e.target.value)}
                className="w-full pl-4 pr-24 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-lg font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-600 font-semibold text-xs bg-slate-200/80 px-2.5 py-1 rounded-md">
                Botellas
              </div>
            </div>
          )}
        </div>

        {/* Calculation Result Display Card */}
        <div 
          id="calculation-result-box"
          className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-50/60 via-slate-50/80 to-amber-50/30 p-5 sm:p-6 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/70 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-full">
                  Resultado de Jarabe
                </span>
                <span className="text-xs font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-amber-300">
                  {activeFlavorName} • CC {activeCC}
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
                  {formatNumber(totalLiters, 4)}
                </span>
                <span className="text-lg font-bold text-amber-700">Litros de Jarabe</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Equivalente a: <strong className="text-slate-700 font-mono">{formatNumber(totalLiters, 2)} L</strong> redondeado (2 decimales)
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-copy-result"
                type="button"
                onClick={handleCopyResult}
                disabled={totalLiters <= 0}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                {copied ? '¡Copiado!' : 'Copiar'}
              </button>

              <button
                id="btn-save-record"
                type="button"
                onClick={handleSave}
                disabled={totalLiters <= 0}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {savedFeedback ? <Check className="w-4 h-4 text-emerald-600" /> : <BookmarkPlus className="w-4 h-4 text-amber-600" />}
                {savedFeedback ? '¡Guardado!' : 'Guardar en Historial'}
              </button>

              <button
                id="btn-add-to-batch"
                type="button"
                onClick={handleAddBatch}
                disabled={totalLiters <= 0}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {batchFeedback ? <Check className="w-4 h-4 text-slate-950" /> : <Layers className="w-4 h-4 text-slate-950" />}
                {batchFeedback ? '¡Agregado a Lote!' : '+ Acumular a Lote'}
              </button>
            </div>
          </div>

          {/* Detailed breakdown formula */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/80 border border-slate-200/80">
              <span className="text-slate-600 font-medium block">Sabor y Formato:</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                {activeFlavorName} {activeCC ? `(CC ${activeCC})` : ''}
              </span>
              <span className="text-[11px] text-slate-600">
                Factor: <strong className="font-mono text-amber-700">{activeFactor ? formatFactor(activeFactor) : '0,000000'}</strong>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/80 border border-slate-200/80">
              <span className="text-slate-600 font-medium block">Cantidad a embotellar:</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block font-mono">
                {formatNumber(calculatedBottles, 0)} <span className="font-sans font-normal text-xs text-slate-600">botellas</span>
              </span>
              <span className="text-[11px] text-slate-600">
                Operación: {formatNumber(calculatedBottles, 0)} × {activeFactor}
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
