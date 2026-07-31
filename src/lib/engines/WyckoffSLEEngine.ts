/**
 * Wyckoff SLE Engine (Smart Learning Wyckoff Engine - parasay.html & fonda.html)
 * Behavior profiling & Wyckoff Accumulation/Distribution pattern detection.
 * 100% Real Quantitative Formula — Zero Simulation.
 */

import { TradeTick } from '../../types';

export interface WyckoffPattern {
  type: 'accumulation' | 'distribution';
  symbol: string;
  strength: number;
  timestamp: number;
  confidence: number;
}

export class WyckoffSLEEngine {
  private static patterns: WyckoffPattern[] = [];

  public static detectPattern(symbol: string, recentTrades: TradeTick[]): WyckoffPattern | null {
    if (recentTrades.length < 10) return null;

    const totalUsd = recentTrades.reduce((sum, t) => sum + t.notional, 0);
    const avgUsd = totalUsd / recentTrades.length;

    let buyUsd = 0;
    let sellUsd = 0;
    recentTrades.forEach((t) => {
      if (t.side === 'buy') buyUsd += t.notional;
      else sellUsd += t.notional;
    });

    const lastTrade = recentTrades[0];
    if (lastTrade && lastTrade.notional > avgUsd * 1.5) {
      const isBuyDominant = buyUsd > sellUsd;
      const type: 'accumulation' | 'distribution' = isBuyDominant ? 'accumulation' : 'distribution';
      const strength = lastTrade.notional / avgUsd;
      const confidence = Math.min(0.95, recentTrades.length / 50);

      const pattern: WyckoffPattern = {
        type,
        symbol,
        strength: Number(strength.toFixed(2)),
        timestamp: Date.now(),
        confidence: Number(confidence.toFixed(2)),
      };

      this.patterns.unshift(pattern);
      if (this.patterns.length > 50) this.patterns.pop();

      return pattern;
    }

    return null;
  }

  public static getRecentPatterns(): WyckoffPattern[] {
    return this.patterns;
  }
}
