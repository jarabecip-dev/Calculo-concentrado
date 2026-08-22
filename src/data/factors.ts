import { FactorItem, FlavorCategory } from '../types';

export const FLAVORS: FlavorCategory[] = [
  { id: 'CC_MA', shortCode: 'CC MA', name: 'CC MA' },
  { id: 'CC_SO', shortCode: 'CC SO', name: 'CC SO' },
  { id: 'CCL', shortCode: 'CCL', name: 'CCL' },
  { id: 'CCZ', shortCode: 'CCZ', name: 'CCZ' },
  { id: 'SPZ', shortCode: 'SPZ', name: 'SPZ' },
  { id: 'SP_FX', shortCode: 'SP FX', name: 'SP FX' },
  { id: 'FN_FX', shortCode: 'FN FX', name: 'FN FX' },
];

export const ALL_FACTORS: FactorItem[] = [
  // CC MA
  { id: 'cc-ma-1000', flavorId: 'CC_MA', flavorName: 'CC MA', cc: 1000, factor: 0.154871, label: 'CC MA 1000 (1.0 L)' },
  { id: 'cc-ma-1250', flavorId: 'CC_MA', flavorName: 'CC MA', cc: 1250, factor: 0.193359, label: 'CC MA 1250 (1.25 L)' },
  { id: 'cc-ma-1500', flavorId: 'CC_MA', flavorName: 'CC MA', cc: 1500, factor: 0.232031, label: 'CC MA 1500 (1.5 L)' },
  { id: 'cc-ma-1750', flavorId: 'CC_MA', flavorName: 'CC MA', cc: 1750, factor: 0.270703, label: 'CC MA 1750 (1.75 L)' },
  { id: 'cc-ma-2000', flavorId: 'CC_MA', flavorName: 'CC MA', cc: 2000, factor: 0.309485, label: 'CC MA 2000 (2.0 L)' },
  { id: 'cc-ma-2250', flavorId: 'CC_MA', flavorName: 'CC MA', cc: 2250, factor: 0.348047, label: 'CC MA 2250 (2.25 L)' },
  { id: 'cc-ma-2350', flavorId: 'CC_MA', flavorName: 'CC MA', cc: 2350, factor: 0.378985, label: 'CC MA 2350 (2.35 L)' },
  { id: 'cc-ma-2500', flavorId: 'CC_MA', flavorName: 'CC MA', cc: 2500, factor: 0.386719, label: 'CC MA 2500 (2.5 L)' },
  { id: 'cc-ma-3000', flavorId: 'CC_MA', flavorName: 'CC MA', cc: 3000, factor: 0.464063, label: 'CC MA 3000 (3.0 L)' },

  // CC SO
  { id: 'cc-so-237', flavorId: 'CC_SO', flavorName: 'CC SO', cc: 237, factor: 0.038672, label: 'CC SO 237 (237 ml)' },
  { id: 'cc-so-350', flavorId: 'CC_SO', flavorName: 'CC SO', cc: 350, factor: 0.054205, label: 'CC SO 350 (350 ml)' },
  { id: 'cc-so-400', flavorId: 'CC_SO', flavorName: 'CC SO', cc: 400, factor: 0.061875, label: 'CC SO 400 (400 ml)' },
  { id: 'cc-so-410', flavorId: 'CC_SO', flavorName: 'CC SO', cc: 410, factor: 0.063422, label: 'CC SO 410 (410 ml)' },
  { id: 'cc-so-500', flavorId: 'CC_SO', flavorName: 'CC SO', cc: 500, factor: 0.077344, label: 'CC SO 500 (500 ml)' },
  { id: 'cc-so-600', flavorId: 'CC_SO', flavorName: 'CC SO', cc: 600, factor: 0.092813, label: 'CC SO 600 (600 ml)' },

  // CCL
  { id: 'ccl-350', flavorId: 'CCL', flavorName: 'CCL', cc: 350, factor: 0.054224, label: 'CCL 350 (350 ml)' },
  { id: 'ccl-500', flavorId: 'CCL', flavorName: 'CCL', cc: 500, factor: 0.077344, label: 'CCL 500 (500 ml)' },
  { id: 'ccl-600', flavorId: 'CCL', flavorName: 'CCL', cc: 600, factor: 0.092813, label: 'CCL 600 (600 ml)' },
  { id: 'ccl-1250', flavorId: 'CCL', flavorName: 'CCL', cc: 1250, factor: 0.193359, label: 'CCL 1250 (1.25 L)' },
  { id: 'ccl-1750', flavorId: 'CCL', flavorName: 'CCL', cc: 1750, factor: 0.270703, label: 'CCL 1750 (1.75 L)' },
  { id: 'ccl-2250', flavorId: 'CCL', flavorName: 'CCL', cc: 2250, factor: 0.348047, label: 'CCL 2250 (2.25 L)' },

  // CCZ
  { id: 'ccz-237', flavorId: 'CCZ', flavorName: 'CCZ', cc: 237, factor: 0.038672, label: 'CCZ 237 (237 ml)' },
  { id: 'ccz-350', flavorId: 'CCZ', flavorName: 'CCZ', cc: 350, factor: 0.054199, label: 'CCZ 350 (350 ml)' },
  { id: 'ccz-500', flavorId: 'CCZ', flavorName: 'CCZ', cc: 500, factor: 0.077344, label: 'CCZ 500 (500 ml)' },
  { id: 'ccz-600', flavorId: 'CCZ', flavorName: 'CCZ', cc: 600, factor: 0.092813, label: 'CCZ 600 (600 ml)' },
  { id: 'ccz-1000', flavorId: 'CCZ', flavorName: 'CCZ', cc: 1000, factor: 0.154853, label: 'CCZ 1000 (1.0 L)' },
  { id: 'ccz-1250', flavorId: 'CCZ', flavorName: 'CCZ', cc: 1250, factor: 0.193359, label: 'CCZ 1250 (1.25 L)' },
  { id: 'ccz-1750', flavorId: 'CCZ', flavorName: 'CCZ', cc: 1750, factor: 0.270703, label: 'CCZ 1750 (1.75 L)' },
  { id: 'ccz-2000', flavorId: 'CCZ', flavorName: 'CCZ', cc: 2000, factor: 0.309485, label: 'CCZ 2000 (2.0 L)' },
  { id: 'ccz-2250', flavorId: 'CCZ', flavorName: 'CCZ', cc: 2250, factor: 0.348047, label: 'CCZ 2250 (2.25 L)' },
  { id: 'ccz-2350', flavorId: 'CCZ', flavorName: 'CCZ', cc: 2350, factor: 0.378984, label: 'CCZ 2350 (2.35 L)' },
  { id: 'ccz-2500', flavorId: 'CCZ', flavorName: 'CCZ', cc: 2500, factor: 0.386719, label: 'CCZ 2500 (2.5 L)' },

  // SPZ
  { id: 'spz-237', flavorId: 'SPZ', flavorName: 'SPZ', cc: 237, factor: 0.038672, label: 'SPZ 237 (237 ml)' },
  { id: 'spz-350', flavorId: 'SPZ', flavorName: 'SPZ', cc: 350, factor: 0.054199, label: 'SPZ 350 (350 ml)' },
  { id: 'spz-500', flavorId: 'SPZ', flavorName: 'SPZ', cc: 500, factor: 0.077344, label: 'SPZ 500 (500 ml)' },
  { id: 'spz-600', flavorId: 'SPZ', flavorName: 'SPZ', cc: 600, factor: 0.092813, label: 'SPZ 600 (600 ml)' },
  { id: 'spz-1250', flavorId: 'SPZ', flavorName: 'SPZ', cc: 1250, factor: 0.193359, label: 'SPZ 1250 (1.25 L)' },
  { id: 'spz-1500', flavorId: 'SPZ', flavorName: 'SPZ', cc: 1500, factor: 0.232031, label: 'SPZ 1500 (1.5 L)' },
  { id: 'spz-1750', flavorId: 'SPZ', flavorName: 'SPZ', cc: 1750, factor: 0.270703, label: 'SPZ 1750 (1.75 L)' },
  { id: 'spz-2000', flavorId: 'SPZ', flavorName: 'SPZ', cc: 2000, factor: 0.309485, label: 'SPZ 2000 (2.0 L)' },
  { id: 'spz-2250', flavorId: 'SPZ', flavorName: 'SPZ', cc: 2250, factor: 0.348047, label: 'SPZ 2250 (2.25 L)' },

  // SP FX
  { id: 'sp-fx-237', flavorId: 'SP_FX', flavorName: 'SP FX', cc: 237, factor: 0.038672, label: 'SP FX 237 (237 ml)' },
  { id: 'sp-fx-350', flavorId: 'SP_FX', flavorName: 'SP FX', cc: 350, factor: 0.054199, label: 'SP FX 350 (350 ml)' },
  { id: 'sp-fx-500', flavorId: 'SP_FX', flavorName: 'SP FX', cc: 500, factor: 0.077344, label: 'SP FX 500 (500 ml)' },
  { id: 'sp-fx-600', flavorId: 'SP_FX', flavorName: 'SP FX', cc: 600, factor: 0.092813, label: 'SP FX 600 (600 ml)' },
  { id: 'sp-fx-1000', flavorId: 'SP_FX', flavorName: 'SP FX', cc: 1000, factor: 0.154853, label: 'SP FX 1000 (1.0 L)' },
  { id: 'sp-fx-1250', flavorId: 'SP_FX', flavorName: 'SP FX', cc: 1250, factor: 0.193359, label: 'SP FX 1250 (1.25 L)' },
  { id: 'sp-fx-1750', flavorId: 'SP_FX', flavorName: 'SP FX', cc: 1750, factor: 0.270703, label: 'SP FX 1750 (1.75 L)' },
  { id: 'sp-fx-2000', flavorId: 'SP_FX', flavorName: 'SP FX', cc: 2000, factor: 0.309485, label: 'SP FX 2000 (2.0 L)' },
  { id: 'sp-fx-2250', flavorId: 'SP_FX', flavorName: 'SP FX', cc: 2250, factor: 0.348047, label: 'SP FX 2250 (2.25 L)' },

  // FN FX
  { id: 'fn-fx-237', flavorId: 'FN_FX', flavorName: 'FN FX', cc: 237, factor: 0.045941, label: 'FN FX 237 (237 ml)' },
  { id: 'fn-fx-350', flavorId: 'FN_FX', flavorName: 'FN FX', cc: 350, factor: 0.064388, label: 'FN FX 350 (350 ml)' },
  { id: 'fn-fx-500', flavorId: 'FN_FX', flavorName: 'FN FX', cc: 500, factor: 0.091882, label: 'FN FX 500 (500 ml)' },
  { id: 'fn-fx-600', flavorId: 'FN_FX', flavorName: 'FN FX', cc: 600, factor: 0.110258, label: 'FN FX 600 (600 ml)' },
  { id: 'fn-fx-1000', flavorId: 'FN_FX', flavorName: 'FN FX', cc: 1000, factor: 0.183967, label: 'FN FX 1000 (1.0 L)' },
  { id: 'fn-fx-1250', flavorId: 'FN_FX', flavorName: 'FN FX', cc: 1250, factor: 0.229705, label: 'FN FX 1250 (1.25 L)' },
  { id: 'fn-fx-1750', flavorId: 'FN_FX', flavorName: 'FN FX', cc: 1750, factor: 0.321587, label: 'FN FX 1750 (1.75 L)' },
  { id: 'fn-fx-2000', flavorId: 'FN_FX', flavorName: 'FN FX', cc: 2000, factor: 0.367663, label: 'FN FX 2000 (2.0 L)' },
  { id: 'fn-fx-2250', flavorId: 'FN_FX', flavorName: 'FN FX', cc: 2250, factor: 0.413469, label: 'FN FX 2250 (2.25 L)' },
  { id: 'fn-fx-2500', flavorId: 'FN_FX', flavorName: 'FN FX', cc: 2500, factor: 0.459410, label: 'FN FX 2500 (2.5 L)' },
];

export function getFactorsByFlavor(flavorId: string): FactorItem[] {
  return ALL_FACTORS.filter((f) => f.flavorId === flavorId);
}

export function findFactor(flavorId: string, cc: number): FactorItem | undefined {
  return ALL_FACTORS.find((f) => f.flavorId === flavorId && f.cc === cc);
}

export function formatNumber(val: number, decimals: number = 2): string {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

export function formatFactor(val: number): string {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 6,
    maximumFractionDigits: 6,
  }).format(val);
}
