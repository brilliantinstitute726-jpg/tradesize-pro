export interface Instrument {
  id: string;
  name: string; // e.g., "ETHUSDT"
  lotSize: number; // e.g., 0.01 for ETH, 1 for BTC, etc. (Units per 1 Lot)
}

export interface MarketData {
  open: number;
  high: number;
  low: number;
  close: number;
}

export enum TradeDirection {
  LONG = 'LONG',
  SHORT = 'SHORT',
}

export interface CalculationResult {
  direction: TradeDirection;
  pointsCaptured: number;
  requiredLots: number;
  valuePerLot: number;
}

export interface AIStrategy {
  entryPrice: number;
  stopLossPrice: number;
  targetPrice: number;
  probability: number;
}

export interface AIAnalysisResponse {
  bias: string; // "BULLISH", "BEARISH", "NEUTRAL"
  reasoning: string;
  longStrategy: AIStrategy;
  shortStrategy: AIStrategy;
}
