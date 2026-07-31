/**
 * Market Regime Classifier (parasay.html)
 * Classifies current market state into TRENDING, RANGING, or VOLATILE using 10m price standard deviation and liquidation frequency.
 * 100% Real Quantitative Formula — Zero Simulation.
 */

import { Candle, LiquidationEvent, MarketRegimeType } from '../../types';

export interface MarketRegimeReport {
  regime: MarketRegimeType;
  trendingScore: number;
  rangingScore: number;
  volatileScore: number;
}

export class MarketRegimeClassifier {
  public static classify(candles: Candle[], liquidations: LiquidationEvent[]): MarketRegimeReport {
    if (candles.length < 10) {
      return { regime: 'SCANNING', trendingScore: 0, rangingScore: 0, volatileScore: 0 };
    }

    const closes = candles.slice(-20).map((c) => c.close);
    const firstPx = closes[0];
    const lastPx = closes[closes.length - 1];
    const maxPx = Math.max(...closes);
    const minPx = Math.min(...closes);
    const avgPx = closes.reduce((s, p) => s + p, 0) / closes.length;

    const directionalChangePct = Math.abs(lastPx - firstPx) / avgPx * 100;
    const rangePct = (maxPx - minPx) / avgPx * 100;

    let sumSq = 0;
    for (let i = 1; i < closes.length; i++) {
      sumSq += Math.pow((closes[i] - closes[i - 1]) / closes[i - 1] * 100, 2);
    }
    const volatilityStdDev = Math.sqrt(sumSq / closes.length);

    const now = Date.now();
    const recentLiqsCount = liquidations.filter((l) => now - l.time <= 600000).length; // last 10m liqs

    const trendingScore = Math.min(100, Math.round(directionalChangePct * 25 + (recentLiqsCount > 5 ? 10 : 0)));
    const rangingScore = Math.min(100, Math.round((1 - directionalChangePct / 2) * 50 + (rangePct < 1 ? 30 : 0)));
    const volatileScore = Math.min(100, Math.round(volatilityStdDev * 35 + recentLiqsCount * 4));

    let regime: MarketRegimeType = 'RANGING';
    if (trendingScore >= rangingScore && trendingScore >= volatileScore) regime = 'TRENDING';
    else if (volatileScore >= trendingScore && volatileScore >= rangingScore) regime = 'VOLATILE';

    return {
      regime,
      trendingScore,
      rangingScore,
      volatileScore,
    };
  }
}
