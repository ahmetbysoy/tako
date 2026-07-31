import React from 'react';
import { Wallet, Globe, ArrowUpRight, ArrowDownRight, Award } from 'lucide-react';
import { CryptoSymbol, ThemeMode } from '../types';

interface SmartMoneyRadarProps {
  currentSymbol: CryptoSymbol;
  price: number;
  netflowUsd?: number;
  hlPrice?: number;
  hlDivergencePct?: number;
  theme: ThemeMode;
}

const MOCK_HYPERLIQUID_WHALES = [
  { id: '1', rank: 1, name: 'HyperWhale #1 (0x8f...3a)', sizeUsd: 3250000, side: 'LONG', pnlUsd: 142000, entryPrice: 97850 },
  { id: '2', rank: 2, name: 'DeepFlow #2 (0x3c...8b)', sizeUsd: 1850000, side: 'LONG', pnlUsd: 88500, entryPrice: 98100 },
  { id: '3', rank: 3, name: 'PerpAlpha #3 (0x1e...9f)', sizeUsd: 1200000, side: 'SHORT', pnlUsd: -12400, entryPrice: 98650 },
  { id: '4', rank: 4, name: 'DEX Squeeze #4 (0x7a...2d)', sizeUsd: 950000, side: 'LONG', pnlUsd: 34100, entryPrice: 98250 },
];

export const SmartMoneyRadar: React.FC<SmartMoneyRadarProps> = ({
  currentSymbol,
  price,
  netflowUsd = 4500000,
  hlPrice,
  hlDivergencePct = 0.12,
  theme,
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`rounded-3xl p-4 sm:p-5 shadow-lg border transition-all ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-slate-950/50'
          : 'bg-white/90 border-pink-200/80 text-slate-800 shadow-pink-100/50'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 mb-4 border-inherit">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isDark ? 'bg-indigo-950/80 text-indigo-400 border border-indigo-800/50' : 'bg-pink-100 text-pink-700 border border-pink-200'}`}>
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-sm font-black uppercase tracking-tight ${isDark ? 'text-slate-100' : 'text-purple-950'}`}>
              🐋 Smart Money & DEX Akış Radarı
            </h3>
            <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-purple-700'}`}>
              Borsa Sıcak Cüzdan Netflow Verileri & Hyperliquid Leaderboard Whales
            </p>
          </div>
        </div>
      </div>

      {/* Top Indicators Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Wallet Netflow Card */}
        <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-pink-50/50 border-pink-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-purple-950'}`}>
              <Wallet className="w-4 h-4 text-pink-500" />
              24h Borsa Cüzdan Akışı (Netflow)
            </span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              netflowUsd > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {netflowUsd > 0 ? 'ÇIKIŞ (BİRİKİM 🚀)' : 'GİRİŞ (SATIŞ BASKISI 🔻)'}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-xl font-black font-mono ${netflowUsd > 0 ? (isDark ? 'text-emerald-400' : 'text-emerald-700') : (isDark ? 'text-rose-400' : 'text-rose-700')}`}>
              {netflowUsd > 0 ? '+' : ''}${(netflowUsd / 1e6).toFixed(2)}M USD
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Pozitif değer borsalardan soğuk cüzdanlara çekilen bakiyeyi gösterir.
          </p>
        </div>

        {/* Hyperliquid DEX Divergence Card */}
        <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-pink-50/50 border-pink-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-purple-950'}`}>
              <Globe className="w-4 h-4 text-cyan-500" />
              Hyperliquid DEX Prim / İskonto
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
              DEX Mark Price
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-xl font-black font-mono ${isDark ? 'text-cyan-300' : 'text-purple-950'}`}>
              ${hlPrice || (price * 1.0012).toFixed(currentSymbol.decimals)}
            </span>
            <span className={`text-xs font-bold ${hlDivergencePct >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ({hlDivergencePct >= 0 ? '+' : ''}{hlDivergencePct}%)
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            DEX mark fiyatının CEX spot medyandan farkını ifade eder.
          </p>
        </div>
      </div>

      {/* Hyperliquid Top Leaderboard Whales Tracker */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-purple-950'}`}>
            <Award className="w-4 h-4 text-amber-500" />
            Hyperliquid Leaderboard Whales Live Tracker
          </h4>
        </div>

        <div className="space-y-2">
          {MOCK_HYPERLIQUID_WHALES.map((w) => (
            <div
              key={w.id}
              className={`p-2.5 rounded-2xl border flex items-center justify-between text-xs font-mono transition-all ${
                w.side === 'LONG'
                  ? (isDark ? 'bg-emerald-950/40 border-emerald-500/30' : 'bg-emerald-50/80 border-emerald-200')
                  : (isDark ? 'bg-rose-950/40 border-rose-500/30' : 'bg-rose-50/80 border-rose-200')
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-amber-600">#{w.rank}</span>
                <span className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{w.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                  w.side === 'LONG' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {w.side}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span>Büyüklük: ${(w.sizeUsd / 1e6).toFixed(2)}M</span>
                <span className={`font-black flex items-center ${w.pnlUsd >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {w.pnlUsd >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  ${(w.pnlUsd / 1000).toFixed(1)}k
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
