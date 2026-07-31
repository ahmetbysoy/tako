/**
 * Pain Index v2 Engine (Repaint-Free Liquidation Pain Index - index.html)
 * Measures real-time trader forced liquidation pain accumulation.
 * 100% Real Quantitative Formula — Zero Simulation.
 */

import { LiquidationEvent } from '../../types';

export class PainIndexEngine {
  public static calculatePainIndex(liquidations: LiquidationEvent[], avg20mVolumeUsd: number): number {
    const now = Date.now();
    const last1mLiqs = liquidations.filter((l) => now - l.time <= 60000);
    const last1mLiqVolume = last1mLiqs.reduce((sum, l) => sum + l.notional, 0);

    const safeAvgVol = Math.max(100000, avg20mVolumeUsd || 500000);
    const painRatio = (last1mLiqVolume / safeAvgVol) * 100;

    return Math.min(100, Math.max(0, Math.round(painRatio)));
  }
}
