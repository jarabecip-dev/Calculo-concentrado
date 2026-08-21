import React from 'react';
import { FlaskConical, Calculator, Sparkles, Printer } from 'lucide-react';

interface NavbarProps {
  onPrint: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onPrint }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              Calculadora de Jarabe
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">
                Planta & Embotellado
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Cálculo de litros de jarabe por factor de tamaño (CC) y botellas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
            <span className="font-semibold text-amber-400">Fórmula:</span>
            <span>Litros = Botellas × Factor</span>
          </div>

          <button
            id="btn-print-report"
            onClick={onPrint}
            title="Imprimir reporte"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-300" />
            <span className="hidden md:inline">Imprimir</span>
          </button>
        </div>
      </div>
    </header>
  );
};
