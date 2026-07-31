/**
 * 60s Alpha Decision Engine - TypeScript Type Definitions
 */

export type SignalDirection = 'LONG' | 'SHORT' | 'NEUTRAL';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
export type ExchangeSource = 'BINANCE' | 'OKX' | 'BYBIT' | 'SIMULATED';

export interface CryptoSymbol {
  symbol: string;      // e.g. "BTCUSDT"
  base: string;        // e.g. "BTC"
  quote: string;       // e.g. "USDT"
  name: string;        // e.g. "Bitcoin"
  decimals: number;    // e.g. 2 for BTC, 4 for SOL, 8 for PEPE
}

export interface OrderBookEntry {
  price: number;
  qty: number;
  total: number;
}

export interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  bidTotalNotional: number;
  askTotalNotional: number;
  bidRatio: number; // 0 - 100
  askRatio: number; // 0 - 100
  bidWalls: OrderBookEntry[];
  askWalls: OrderBookEntry[];
  spoofScore: number; // 0 - 100
  liquidityVoidAbove: number | null;
  liquidityVoidBelow: number | null;
}

export interface TradeTick {
  id: string;
  price: number;
  qty: number;
  notional: number; // price * qty
  side: 'buy' | 'sell';
  time: number;
  isWhale: boolean;
}

export interface Candle {
  time: number; // timestamp in ms
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  buyVolume: number;
  sellVolume: number;
  trades: number;
}

export interface LiquidationEvent {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL'; // BUY = short liquidated (force buy), SELL = long liquidated (force sell)
  price: number;
  qty: number;
  notional: number;
  time: number;
}

export interface WhaleTrade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  qty: number;
  notional: number;
  time: number;
  tier: 'MEDIUM' | 'LARGE' | 'MEGA'; // 50k+, 250k+, 1M+
}

// 10 Engine Scores & Details
export interface EngineScore {
  id: string;
  name: string;
  nameTr: string;
  score: number; // -20 to +20 contribution points
  weight: number; // e.g. 0.12
  status: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  detail: string;
  metrics: Record<string, string | number>;
  sourceTag?: string; // e.g. "Binance WS [21:04:12 UTC]"
  timestamp?: string;
}

export interface ReasonFactor {
  type: 'BULLISH' | 'BEARISH' | 'WARNING';
  engine: string;
  icon: string;
  title: string;
  description: string;
  impactScore: number;
}

export interface CalibrationState {
  rollingAccuracy20: number; // e.g. 0.65 (65%)
  rollingBrier20: number;    // e.g. 0.18
  calibrationAdjustment: number; // -15 to +15
  regimeShiftDetected: boolean;
  regimeShiftNote?: string;
  totalPredictionsCount: number;
}

export interface DecisionSignal {
  direction: SignalDirection;
  longProbability: number;  // 0 - 100%
  shortProbability: number; // 0 - 100%
  neutralProbability: number; // 0 - 100%
  confidence: number;       // 0 - 10.0
  riskLevel: RiskLevel;
  totalScore: number;       // -100 to +100
  
  // v3.2 Engine Metric Additions
  signalStrengthIndex: number; // 0 - 100 Sinyal Gücü Endeksi
  kellyFraction: number;       // e.g. 0.052 (5.2% account risk recommendation)
  brierScore: number;          // Rolling Brier score (0 = perfect)
  calibrationAdjustment: number; // + / - adjustment
  regimeShiftDetected: boolean;
  
  // DEX & Macro Engine Additions
  hlPrice?: number;
  hlDivergencePct?: number;    // Hyperliquid DEX vs CEX median divergence
  netflowUsd?: number;         // Whale Netflow 24h (outflow = positive)
  macroSentiment?: string;     // e.g. "Extreme Fear (22)"
  macroModifier?: number;      // e.g. +15
  
  // Scalp Execution targets
  entryPrice: number;
  tpPrice: number;          // Take Profit (+0.25% - 0.5%)
  slPrice: number;          // Stop Loss (-0.15% - 0.3%)
  tpPercent: number;
  slPercent: number;
  recommendedHoldingTime: string; // e.g. "1 - 3 min"
  
  // Special Engine Detectors
  isFakeBreakout: boolean;
  fakeBreakoutReason?: string;
  liquidityMagnetAbove: number;
  liquidityMagnetBelow: number;
  targetMagnet: number;
  
  // Breakdown Reasons ("Neden?")
  reasons: ReasonFactor[];
  
  // Engine Snapshots
  engineScores: Record<string, EngineScore>;
  timestamp: number;
}

export interface BacktestRecord {
  id: string;
  symbol: string;
  timestamp: number;
  entryPrice: number;
  signalDirection: SignalDirection;
  probability: number;
  confidence: number;
  tpPrice: number;
  slPrice: number;
  
  // v3.2 Calibration Metrics
  brierContribution?: number; // (p_up - actual_up)^2
  actualDirection?: 'UP' | 'DOWN' | 'FLAT';
  
  // Evaluation after 60s / 3m
  status: 'PENDING' | 'WIN' | 'LOSS' | 'NEUTRAL';
  actualClosePrice60s?: number;
  actualPriceChange60s?: number;
  evaluatedAt?: number;
}

export interface TerminalSettings {
  soundEnabled: boolean;
  timeframe: '1m' | '3m' | '5m' | '15m';
  autoTradeAlerts: boolean;
  minConfidenceThreshold: number; // e.g. 7.5
  whaleThresholdUsd: number;      // e.g. 50000
  simulationMode: boolean;
}
