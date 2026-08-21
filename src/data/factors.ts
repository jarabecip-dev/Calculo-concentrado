import { FactorItem } from '../types';

export const STANDARD_FACTORS: FactorItem[] = [
  { id: 'cc-1000', cc: 1000, factor: 0.154871, label: 'CC 1000 (1.0 L)' },
  { id: 'cc-1250', cc: 1250, factor: 0.193359, label: 'CC 1250 (1.25 L)' },
  { id: 'cc-1500', cc: 1500, factor: 0.232031, label: 'CC 1500 (1.5 L)' },
  { id: 'cc-1750', cc: 1750, factor: 0.270703, label: 'CC 1750 (1.75 L)' },
  { id: 'cc-2000', cc: 2000, factor: 0.309485, label: 'CC 2000 (2.0 L)' },
  { id: 'cc-2250', cc: 2250, factor: 0.348047, label: 'CC 2250 (2.25 L)' },
  { id: 'cc-2350', cc: 2350, factor: 0.378985, label: 'CC 2350 (2.35 L)' },
  { id: 'cc-2500', cc: 2500, factor: 0.386719, label: 'CC 2500 (2.5 L)' },
  { id: 'cc-3000', cc: 3000, factor: 0.464063, label: 'CC 3000 (3.0 L)' },
];

export function findFactorByCC(cc: number): number | undefined {
  const item = STANDARD_FACTORS.find((f) => f.cc === cc);
  return item ? item.factor : undefined;
}

export function formatNumber(val: number, decimals: number = 2): string {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

export function formatFactor(val: number): string {
  // Show up to 6 decimals, without trailing zeroes unless necessary
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 6,
    maximumFractionDigits: 6,
  }).format(val);
}
