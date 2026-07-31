/**
 * Order Flow Cluster Engine (10-Tick ACC / ABS Volume Clusters - parasay.html)
 * Aggregates buy vs sell volume at 10-tick price levels to classify ACC (Accumulation) or ABS (Absorption).
 * 100% Real Quantitative Formula — Zero Simulation.
 */

import { TradeTick } from '../../types';

export interface VolumeCluster {
  priceLevel: number;
  buyVolumeUsd: number;
  sellVolumeUsd: number;
  totalVolumeUsd: number;
  type: 'ACC' | 'ABS' | 'NEUTRAL';
}

export class OrderFlowClusterEngine {
  private static clusterMap: Map<string, VolumeCluster> = new Map();

  public static addTrade(price: number, qty: number, isBuy: boolean) {
    const tickSize = price > 1000 ? 10 : price > 100 ? 1 : 0.01;
    const level = Math.round(price / tickSize) * tickSize;
    const key = level.toFixed(4);
    const usd = price * qty;

    if (!this.clusterMap.has(key)) {
      this.clusterMap.set(key, { priceLevel: level, buyVolumeUsd: 0, sellVolumeUsd: 0, totalVolumeUsd: 0, type: 'NEUTRAL' });
    }

    const cluster = this.clusterMap.get(key)!;
    if (isBuy) cluster.buyVolumeUsd += usd;
    else cluster.sellVolumeUsd += usd;
    cluster.totalVolumeUsd += usd;

    const buyRatio = cluster.buyVolumeUsd / (cluster.totalVolumeUsd || 1);
    if (buyRatio >= 0.62) cluster.type = 'ACC'; // Accumulation / Aggressive Buy
    else if (buyRatio <= 0.38) cluster.type = 'ABS'; // Absorption / Aggressive Sell
    else cluster.type = 'NEUTRAL';

    if (this.clusterMap.size > 200) {
      const keys = Array.from(this.clusterMap.keys());
      this.clusterMap.delete(keys[0]);
    }
  }

  public static getTopClusters(currentPrice: number, count: number = 10): VolumeCluster[] {
    const clusters = Array.from(this.clusterMap.values());
    return clusters
      .sort((a, b) => b.totalVolumeUsd - a.totalVolumeUsd)
      .slice(0, count);
  }
}
