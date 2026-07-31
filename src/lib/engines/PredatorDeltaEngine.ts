/**
 * Predator Delta Engine (Predatör Pro v6 - fonda.html)
 * Detects whale liquidation exhaustion bursts and generates contrarian predator squeeze signals.
 * 100% Real Quantitative Formula — Zero Simulation.
 */

import { LiquidationEvent } from '../../types';

export interface PredatorReport {
  predatorSignal: 'CONTRARIAN_LONG' | 'CONTRARIAN_SHORT' | 'NEUTRAL';
  exhaustionScore: number; // 0 - 100
  whaleLiquidationsUsd: number;
}

export class PredatorDeltaEngine {
  public static analyze(liquidations: LiquidationEvent[]): PredatorReport {
    const now = Date.now();
    const last3mLiqs = liquidations.filter((l) => now - l.time <= 180000);

    let longLiqUsd = 0;
    let shortLiqUsd = 0;

    last3mLiqs.forEach((l) => {
      if (l.side === 'SELL') longLiqUsd += l.notional; // Forced sells
      else shortLiqUsd += l.notional; // Forced buys
    });

    const totalLiqUsd = longLiqUsd + shortLiqUsd;
    if (totalLiqUsd < 100000) {
      return { predatorSignal: 'NEUTRAL', exhaustionScore: 0, whaleLiquidationsUsd: totalLiqUsd };
    }

    const longRatio = longLiqUsd / totalLiqUsd;
    const shortRatio = shortLiqUsd / totalLiqUsd;

    let predatorSignal: 'CONTRARIAN_LONG' | 'CONTRARIAN_SHORT' | 'NEUTRAL' = 'NEUTRAL';
    let exhaustionScore = 0;

    // Peak Long Liquidation Dump -> Contrarian LONG Reversal
    if (longRatio >= 0.70 && longLiqUsd >= 250000) {
      predatorSignal = 'CONTRARIAN_LONG';
      exhaustionScore = Math.min(100, Math.round(longRatio * 100));
    }
    // Peak Short Squeeze Spike -> Contrarian SHORT Reversal
    else if (shortRatio >= 0.70 && shortLiqUsd >= 250000) {
      predatorSignal = 'CONTRARIAN_SHORT';
      exhaustionScore = Math.min(100, Math.round(shortRatio * 100));
    }

    return {
      predatorSignal,
      exhaustionScore,
      whaleLiquidationsUsd: totalLiqUsd,
    };
  }
}
