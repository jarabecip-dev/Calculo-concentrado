export interface FactorItem {
  id: string;
  cc: number;
  factor: number;
  label: string;
  category?: string;
}

export interface CalculationRecord {
  id: string;
  timestamp: number;
  cc: number;
  factor: number;
  bottles: number;
  totalLiters: number;
  note?: string;
}

export interface BatchItem {
  id: string;
  cc: number;
  factor: number;
  bottles: number;
  totalLiters: number;
}
