/**
 * VPIN Engine (Volume-Synchronized Probability of Toxicity - parasay.html)
 * Computes order flow toxicity over $N$ volume-bucketed trades.
 * 100% Real Quantitative Formula — Zero Simulation.
 */

export interface VPINBucket {
  buyVolumeUsd: number;
  sellVolumeUsd: number;
  totalVolumeUsd: number;
}

export class VPINEngine {
  private static buckets: VPINBucket[] = [];
  private static currentBucket: VPINBucket = { buyVolumeUsd: 0, sellVolumeUsd: 0, totalVolumeUsd: 0 };
  private static bucketSizeUsd: number = 500000; // $500k volume bucket
  private static windowSize: number = 50;

  public static addTrade(price: number, qty: number, isBuy: boolean) {
    const usd = price * qty;
    if (isBuy) {
      this.currentBucket.buyVolumeUsd += usd;
    } else {
      this.currentBucket.sellVolumeUsd += usd;
    }
    this.currentBucket.totalVolumeUsd += usd;

    if (this.currentBucket.totalVolumeUsd >= this.bucketSizeUsd) {
      this.buckets.push({ ...this.currentBucket });
      if (this.buckets.length > this.windowSize) {
        this.buckets.shift();
      }
      this.currentBucket = { buyVolumeUsd: 0, sellVolumeUsd: 0, totalVolumeUsd: 0 };
    }
  }

  public static calculateVPINScore(): number {
    if (this.buckets.length < 5) return 20; // Default baseline

    const recentBuckets = this.buckets.slice(-this.windowSize);
    let totalImbalance = 0;
    let totalVolume = 0;

    for (const b of recentBuckets) {
      totalImbalance += Math.abs(b.buyVolumeUsd - b.sellVolumeUsd);
      totalVolume += b.totalVolumeUsd;
    }

    if (totalVolume === 0) return 20;
    const vpinRatio = totalImbalance / totalVolume; // 0.0 to 1.0
    return Math.min(100, Math.max(0, Math.round(vpinRatio * 100)));
  }

  public static isExtremeToxic(): boolean {
    return this.calculateVPINScore() >= 55;
  }
}
