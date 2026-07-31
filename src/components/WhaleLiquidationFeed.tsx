import React, { useState } from 'react';
import { Flame, ShieldAlert, Award } from 'lucide-react';
import { WhaleTrade, LiquidationEvent, CryptoSymbol } from '../types';

interface WhaleLiquidationFeedProps {
  whales: WhaleTrade[];
  liquidations: LiquidationEvent[];
  currentSymbol: CryptoSymbol;
}

export const WhaleLiquidationFeed: React.FC<WhaleLiquidationFeedProps> = ({
  whales,
  liquidations,
  currentSymbol,
}) => {
  const [activeTab, setActiveTab] = useState<'WHALES' | 'LIQUIDATIONS'>('WHALES');

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-80">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('WHALES')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'WHALES'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Whale Engine Feed ({whales.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('LIQUIDATIONS')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'LIQUIDATIONS'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Liquidation Feed ({liquidations.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Whale Trades Feed */}
      {activeTab === 'WHALES' && (
        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1 text-xs font-mono">
          {whales.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs italic">
              Son 60s büyük balina emri bulunmadı...
            </div>
          ) : (
            whales.map((w) => {
              const dateStr = new Date(w.time).toLocaleTimeString();
              const isBuy = w.side === 'buy';

              return (
                <div
                  key={w.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    isBuy
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold px-1.5 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-800">
                      {w.tier === 'MEGA' ? '🐋 MEGA BALİNA' : '🐬 BÜYÜK ALICI'}
                    </span>
                    <span className="font-bold text-slate-100">
                      ${w.price.toFixed(currentSymbol.decimals)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold">
                      ${(w.notional / 1000).toFixed(1)}k
                    </span>
                    <span className="text-[10px] text-slate-500">{dateStr}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Liquidations Feed */}
      {activeTab === 'LIQUIDATIONS' && (
        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1 text-xs font-mono">
          {liquidations.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs italic">
              Aktif likidasyon dalgası yok...
            </div>
          ) : (
            liquidations.map((l) => {
              const dateStr = new Date(l.time).toLocaleTimeString();
              const isShortLiq = l.side === 'BUY'; // Short position wiped out -> force buy

              return (
                <div
                  key={l.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    isShortLiq
                      ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span className="font-bold">
                      {isShortLiq ? '💥 SHORT LİKİDASYON (SQUEEZE)' : '💥 LONG LİKİDASYON (DUMP)'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-100">
                      ${(l.notional / 1000).toFixed(1)}k @ ${l.price.toFixed(currentSymbol.decimals)}
                    </span>
                    <span className="text-[10px] text-slate-500">{dateStr}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
