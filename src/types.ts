/**
 * Tako v7.0 Tactical HFT Command Center - Type Definitions
 * 100% Type-Safe Contracts for Pre-Breakout HFT Pipeline
 */

export type SignalDirection = 'LONG' | 'SHORT' | 'NEUTRAL';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
export type ExchangeSource = 'BINANCE' | 'OKX' | 'BYBIT' | 'MEXC' | 'SIMULATED';
export type ThemeMode = 'pastel' | 'dark';
export type MarketRegimeType = 'TRENDING' | 'RANGING' | 'VOLATILE' | 'SCANNING';

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
  notional: number;
  side: 'buy' | 'sell';
  time: number;
  isWhale: boolean;
}

export interface Candle {
  time: number;
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
  side: 'BUY' | 'SELL';
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
  tier: 'MEDIUM' | 'LARGE' | 'MEGA';
}

export interface EngineScore {
  id: string;
  name: string;
  nameTr: string;
  score: number; // -20 to +20 contribution points
  weight: number;
  status: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  detail: string;
  metrics: Record<string, string | number>;
  sourceTag?: string;
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
  rollingAccuracy20: number;
  rollingBrier20: number;
  calibrationAdjustment: number;
  regimeShiftDetected: boolean;
  regimeShiftNote?: string;
  totalPredictionsCount: number;
}

export interface DecisionSignal {
  direction: SignalDirection;
  longProbability: number;
  shortProbability: number;
  neutralProbability: number;
  confidence: number; // 0.0 - 10.0
  riskLevel: RiskLevel;
  totalScore: number; // -100 to +100
  
  signalStrengthIndex: number;
  kellyFraction: number;
  brierScore: number;
  calibrationAdjustment: number;
  regimeShiftDetected: boolean;
  calibrationState?: CalibrationState;
  
  // Advanced Quantitative Engine Metrics (v7.0)
  vpinScore: number;          // Volume-Synchronized Probability of Toxicity (0 - 100)
  ofiScore: number;           // Order Flow Imbalance (-100 to +100)
  mplScore: number;           // Microstructure Pressure Level (-100 to +100)
  painIndex: number;          // Repaint-Free Liquidation Pain Index (0 - 100)
  marketRegime: MarketRegimeType;
  
  hlPrice?: number;
  hlDivergencePct?: number;
  netflowUsd?: number;
  macroSentiment?: string;
  macroModifier?: number;
  
  // Execution Plan Targets
  entryPrice: number;
  tpPrice: number;            // TP1
  tp2Price: number;           // TP2
  tp3Price: number;           // TP3
  slPrice: number;            // SL
  tpPercent: number;
  slPercent: number;
  recommendedHoldingTime: string;
  recommendedLeverage: string;
  invalidationRule: string;
  
  isFakeBreakout: boolean;
  fakeBreakoutReason?: string;
  liquidityMagnetAbove: number;
  liquidityMagnetBelow: number;
  targetMagnet: number;
  
  reasons: ReasonFactor[];
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
  status: 'PENDING' | 'WIN' | 'LOSS' | 'NEUTRAL';
  actualClosePrice60s?: number;
  actualPriceChange60s?: number;
  evaluatedAt?: number;
}

export interface PaperPosition {
  id: string;
  symbol: string;
  direction: SignalDirection;
  entryPrice: number;
  currentPrice: number;
  amountUsd: number;
  tpPrice: number;
  slPrice: number;
  timestamp: number;
  pnlUsd: number;
  pnlPercent: number;
  status: 'OPEN' | 'CLOSED_TP' | 'CLOSED_SL' | 'CLOSED_MANUAL';
}

export interface PaperAccount {
  balanceUsd: number;
  initialBalanceUsd: number;
  realizedPnlUsd: number;
  tradesCount: number;
  winsCount: number;
  lossesCount: number;
}

export interface SmartAlert {
  id: string;
  type: 'SCORE_FLIP' | 'WHALE_WALL' | 'SQUEEZE_CASCADE' | 'VPIN_TOXIC';
  title: string;
  description: string;
  timestamp: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface SymbolScreenerItem {
  symbol: CryptoSymbol;
  price: number;
  change24h: number;
  totalScore: number;
  direction: SignalDirection;
  probability: number;
  confidence: number;
  signalStrengthIndex: number;
  vpinScore: number;
  divergenceTag?: string;
}

export interface TerminalSettings {
  soundEnabled: boolean;
  timeframe: '1m' | '3m' | '5m' | '15m';
  autoTradeAlerts: boolean;
  minConfidenceThreshold: number;
  whaleThresholdUsd: number;
  simulationMode: boolean;
  theme: ThemeMode;
}
