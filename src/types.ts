export interface FlavorCategory {
  id: string;
  name: string;
  shortCode: string;
  colorBadge?: string;
}

export interface FactorItem {
  id: string;
  flavorId: string;
  flavorName: string;
  cc: number;
  factor: number;
  label: string;
}

export interface CalculationRecord {
  id: string;
  timestamp: number;
  flavorId: string;
  flavorName: string;
  cc: number;
  factor: number;
  bottles: number;
  totalLiters: number;
  initialCounter?: number;
  finalCounter?: number;
  note?: string;
}

export interface BatchItem {
  id: string;
  flavorId: string;
  flavorName: string;
  cc: number;
  factor: number;
  bottles: number;
  totalLiters: number;
  initialCounter?: number;
  finalCounter?: number;
}
