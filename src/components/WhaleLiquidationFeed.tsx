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
    <div className="bg-white/90 border border-pink-200/80 rounded-3xl p-3.5 sm:p-4 shadow-sm shadow-pink-100/50 flex flex-col h-72 max-w-full overflow-hidden">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-pink-100 pb-2 mb-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('WHALES')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
              activeTab === 'WHALES'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm'
                : 'text-purple-700 hover:bg-pink-50'
            }`}
          >
            <Award className="w-3.5 h-3.5 shrink-0" />
            <span>Balinalar ({whales.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('LIQUIDATIONS')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
              activeTab === 'LIQUIDATIONS'
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm'
                : 'text-purple-700 hover:bg-pink-50'
            }`}
          >
            <Flame className="w-3.5 h-3.5 shrink-0" />
            <span>Likidasyon ({liquidations.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Whale Trades Feed */}
      {activeTab === 'WHALES' && (
        <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1 text-xs font-mono">
          {whales.length === 0 ? (
            <div className="h-full flex items-center justify-center text-purple-400 text-xs italic font-sans font-bold">
              Son 60s büyük balina emri bekleniyor... 🐬
            </div>
          ) : (
            whales.map((w) => {
              const dateStr = new Date(w.time).toLocaleTimeString();
              const isBuy = w.side === 'buy';

              return (
                <div
                  key={w.id}
                  className={`p-2 rounded-xl border flex items-center justify-between gap-1 transition-all ${
                    isBuy
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50/80 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-extrabold px-1 py-0.2 rounded text-[9px] bg-white border border-pink-200 shrink-0">
                      {w.tier === 'MEGA' ? '🐋 MEGA' : '🐬 BÜYÜK'}
                    </span>
                    <span className="font-bold text-slate-900 truncate">
                      ${w.price.toFixed(currentSymbol.decimals)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-extrabold text-[11px]">
                      ${(w.notional / 1000).toFixed(1)}k
                    </span>
                    <span className="text-[9px] text-slate-400">{dateStr}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Liquidations Feed */}
      {activeTab === 'LIQUIDATIONS' && (
        <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1 text-xs font-mono">
          {liquidations.length === 0 ? (
            <div className="h-full flex items-center justify-center text-purple-400 text-xs italic font-sans font-bold">
              Aktif likidasyon dalgası yok... 🔥
            </div>
          ) : (
            liquidations.map((l) => {
              const dateStr = new Date(l.time).toLocaleTimeString();
              const isShortLiq = l.side === 'BUY'; // Short position wiped out -> force buy

              return (
                <div
                  key={l.id}
                  className={`p-2 rounded-xl border flex items-center justify-between gap-1 ${
                    isShortLiq
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50/80 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-1 min-w-0">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span className="font-bold truncate text-[11px]">
                      {isShortLiq ? '💥 SHORT SQUEEZE' : '💥 LONG DUMP'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-black text-slate-900 text-[11px]">
                      ${(l.notional / 1000).toFixed(1)}k
                    </span>
                    <span className="text-[9px] text-slate-400">{dateStr}</span>
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
