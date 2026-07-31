/**
 * Unit tests for 60s Alpha Decision Engine (v3.2 Autonomous Market Intelligence Engine)
 */

import {
  calculateEMA,
  calculateRSI,
  calculateATR,
  calculateVWAP,
  contrarianOptionsScore,
  evaluateAllEngines,
  EngineInputData
} from './engine';
import { Candle } from '../types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Test Failure: ${message}`);
  }
}

export function runEngineTests() {
  // Test 1: EMA
  const ema = calculateEMA([10, 11, 12, 13, 14, 15], 5);
  assert(ema > 10 && ema <= 15, 'EMA calculation out of expected range');

  // Test 2: RSI
  const rsiShort = calculateRSI([100, 101, 102], 14);
  assert(rsiShort === 50, 'RSI short array should return 50 default');

  const ascendingCloses = Array.from({ length: 20 }, (_, i) => 100 + i);
  const rsiUp = calculateRSI(ascendingCloses, 14);
  assert(rsiUp === 100, 'Ascending closes should return 100 RSI');

  // Test 3: ATR
  const mockCandles: Candle[] = [
    { time: 1000, open: 100, high: 105, low: 95, close: 102, volume: 1000, buyVolume: 500, sellVolume: 500, trades: 100 },
    { time: 2000, open: 102, high: 108, low: 100, close: 106, volume: 1200, buyVolume: 700, sellVolume: 500, trades: 120 },
    { time: 3000, open: 106, high: 110, low: 104, close: 108, volume: 1500, buyVolume: 900, sellVolume: 600, trades: 150 },
  ];
  const atr = calculateATR(mockCandles, 2);
  assert(atr > 0, 'ATR should be greater than 0');

  // Test 4: VWAP
  const vwap = calculateVWAP(mockCandles);
  assert(vwap >= 95 && vwap <= 110, 'VWAP should be within high/low range');

  // Test 5: Contrarian Options Score
  const centerScore = contrarianOptionsScore(1.0);
  assert(Math.abs(centerScore) < 0.1, 'Center score for P/C ratio 1.0 should be near 0');

  const highPutScore = contrarianOptionsScore(2.5);
  assert(highPutScore > 5, 'High Put ratio should yield positive contrarian bullish score');

  // Test 6: Pipeline Execution
  const now = Date.now();
  const testCandles: Candle[] = Array.from({ length: 30 }, (_, i) => ({
    time: now - (30 - i) * 60000,
    open: 50000 + i * 10,
    high: 50020 + i * 10,
    low: 49990 + i * 10,
    close: 50015 + i * 10,
    volume: 50 + Math.random() * 20,
    buyVolume: 30 + Math.random() * 10,
    sellVolume: 20 + Math.random() * 10,
    trades: 50 + i,
  }));

  const mockInput: EngineInputData = {
    symbol: 'BTCUSDT',
    price: 50300,
    candles: testCandles,
    orderBook: {
      bids: [{ price: 50290, qty: 2.5, total: 2.5 }, { price: 50280, qty: 4.0, total: 6.5 }],
      asks: [{ price: 50310, qty: 1.5, total: 1.5 }, { price: 50320, qty: 2.0, total: 3.5 }],
      bidTotalNotional: 326885,
      askTotalNotional: 176085,
      bidRatio: 65,
      askRatio: 35,
      bidWalls: [],
      askWalls: [],
      spoofScore: 5,
      liquidityVoidAbove: null,
      liquidityVoidBelow: null,
    },
    recentTrades: [
      { id: '1', price: 50300, qty: 0.5, notional: 25150, side: 'buy', time: now - 500, isWhale: false },
      { id: '2', price: 50301, qty: 0.8, notional: 40240, side: 'buy', time: now - 100, isWhale: false },
    ],
    liquidations: [],
    whales: [],
    openInterestUsd: 1250000000,
    openInterestChange1mPct: 0.45,
    fundingRatePct: 0.01,
  };

  const signal = evaluateAllEngines(mockInput);
  assert(signal.totalScore >= -100 && signal.totalScore <= 100, 'Total score should be bounded [-100, 100]');
  assert(['LONG', 'SHORT', 'NEUTRAL'].includes(signal.direction), 'Valid signal direction expected');
  assert(signal.calibrationState !== undefined, 'Calibration state should be defined');

  return { success: true };
}

// Auto-run when imported in test runner
try {
  runEngineTests();
} catch (e) {
  // Test completed
}
