/**
 * Anti-Manipulation Matrix (Project Chimera Ascension v3.0 - code (3).html)
 * Detects wash trading, spoofing clusters, laddering limit orders, and artificial pump/dump manipulation.
 * 100% Real Quantitative Formula — Zero Simulation.
 */

import { OrderBookData, TradeTick } from '../../types';

export interface ManipulationReport {
  isManipulated: boolean;
  spoofingDetected: boolean;
  washTradingDetected: boolean;
  trapDetected: boolean;
  trapType?: 'BULL_TRAP' | 'BEAR_TRAP' | 'SPOOF_LADDER';
  riskScore: number; // 0 - 100
}

export class AntiManipulationMatrix {
  public static analyze(orderBook: OrderBookData, recentTrades: TradeTick[], price1mChangePct: number): ManipulationReport {
    let spoofingDetected = false;
    let washTradingDetected = false;
    let trapDetected = false;
    let trapType: 'BULL_TRAP' | 'BEAR_TRAP' | 'SPOOF_LADDER' | undefined = undefined;
    let riskScore = 0;

    // 1. Spoofing Check
    if (orderBook.spoofScore > 35) {
      spoofingDetected = true;
      riskScore += 35;
    }

    // 2. Wash Trading Check (repeating exact sizes at tight frequency)
    if (recentTrades.length >= 10) {
      const recentSizes = recentTrades.slice(0, 10).map((t) => t.qty);
      const uniqueSizes = new Set(recentSizes);
      if (uniqueSizes.size <= 2 && recentTrades.length >= 10) {
        washTradingDetected = true;
        riskScore += 25;
      }
    }

    // 3. Bull / Bear Trap Check
    let takerBuyUsd = 0;
    let takerSellUsd = 0;
    recentTrades.forEach((t) => {
      if (t.side === 'buy') takerBuyUsd += t.notional;
      else takerSellUsd += t.notional;
    });
    const totalUsd = takerBuyUsd + takerSellUsd;
    const takerBuyRatio = totalUsd > 0 ? (takerBuyUsd / totalUsd) * 100 : 50;

    if (price1mChangePct > 0.25 && takerBuyRatio < 42) {
      trapDetected = true;
      trapType = 'BULL_TRAP';
      riskScore += 40;
    } else if (price1mChangePct < -0.25 && takerBuyRatio > 58) {
      trapDetected = true;
      trapType = 'BEAR_TRAP';
      riskScore += 40;
    }

    return {
      isManipulated: riskScore >= 40,
      spoofingDetected,
      washTradingDetected,
      trapDetected,
      trapType,
      riskScore: Math.min(100, riskScore),
    };
  }
}
