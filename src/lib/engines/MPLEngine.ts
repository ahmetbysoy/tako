/**
 * MPL Engine (Multi-Factor Microstructure Pressure Level - scalp_lab_mpl.html)
 * Weighted multi-component microstructure ticker pressure calculation with EMA5 & EMA13 smoothing.
 * 100% Real Quantitative Formula — Zero Simulation.
 */

export interface MPLComponents {
  flowScore: number;       // Order flow taker delta
  bookScore: number;       // L2 book bid/ask ratio
  divergenceScore: number; // Price vs delta divergence
  liqScore: number;        // Liquidation cascade direction
  volScore: number;        // Volume surge vs SMA20
}

export class MPLEngine {
  private static mplHistory: number[] = [];

  public static calculateMPL(components: MPLComponents): number {
    const W_FLOW = 0.30;
    const W_BOOK = 0.25;
    const W_DEV = 0.20;
    const W_LIQ = 0.15;
    const W_VOL = 0.10;

    const rawMPL = (
      components.flowScore * W_FLOW +
      components.bookScore * W_BOOK +
      components.divergenceScore * W_DEV +
      components.liqScore * W_LIQ +
      components.volScore * W_VOL
    );

    const boundedMPL = Math.min(100, Math.max(-100, Math.round(rawMPL)));
    this.mplHistory.push(boundedMPL);
    if (this.mplHistory.length > 200) {
      this.mplHistory.shift();
    }

    return boundedMPL;
  }

  public static calculateEMA(period: number): number {
    if (this.mplHistory.length === 0) return 0;
    const k = 2 / (period + 1);
    let ema = this.mplHistory[0];
    for (let i = 1; i < this.mplHistory.length; i++) {
      ema = this.mplHistory[i] * k + ema * (1 - k);
    }
    return Number(ema.toFixed(2));
  }
}
