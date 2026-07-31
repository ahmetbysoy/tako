/**
 * OFI Engine (Order Flow Imbalance - parasay.html)
 * Computes net taker buy vs sell imbalance over rolling 300 trades.
 * 100% Real Quantitative Formula — Zero Simulation.
 */

export interface OFITrade {
  usd: number;
  isBuy: boolean;
  timestamp: number;
}

export class OFIEngine {
  private static tradesWindow: OFITrade[] = [];
  private static windowSize: number = 300;

  public static addTrade(price: number, qty: number, isBuy: boolean) {
    this.tradesWindow.push({
      usd: price * qty,
      isBuy,
      timestamp: Date.now(),
    });

    if (this.tradesWindow.length > this.windowSize) {
      this.tradesWindow.shift();
    }
  }

  public static calculateOFIScore(): number {
    if (this.tradesWindow.length === 0) return 0;

    let buyUsd = 0;
    let sellUsd = 0;

    for (const t of this.tradesWindow) {
      if (t.isBuy) buyUsd += t.usd;
      else sellUsd += t.usd;
    }

    const totalUsd = buyUsd + sellUsd;
    if (totalUsd === 0) return 0;

    const ofiRatio = (buyUsd - sellUsd) / totalUsd; // -1.0 to +1.0
    return Math.min(100, Math.max(-100, Math.round(ofiRatio * 100)));
  }

  public static reset() {
    this.tradesWindow = [];
  }
}
