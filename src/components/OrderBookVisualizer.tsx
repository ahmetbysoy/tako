import React from 'react';
import { ShieldCheck, ShieldAlert, AlertCircle } from 'lucide-react';
import { OrderBookData, CryptoSymbol } from '../types';

interface OrderBookVisualizerProps {
  orderBook: OrderBookData;
  currentSymbol: CryptoSymbol;
  price: number;
}

export const OrderBookVisualizer: React.FC<OrderBookVisualizerProps> = ({
  orderBook,
  currentSymbol,
  price,
}) => {
  const { bids, asks, bidRatio, askRatio, bidWalls, askWalls, spoofScore } = orderBook;

  const maxNotional = Math.max(
    ...bids.map((b) => b.qty * b.price),
    ...asks.map((a) => a.qty * a.price),
    100
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          <h3 className="text-sm font-black text-slate-100 uppercase tracking-tight">
            Order Book Derinliği & Duvar Analizi (L2 Depth)
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="text-emerald-400">Bid: %{bidRatio.toFixed(1)}</span>
          <span className="text-slate-500">vs</span>
          <span className="text-rose-400">Ask: %{askRatio.toFixed(1)}</span>
        </div>
      </div>

      {/* Depth Balance Bar */}
      <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800 mb-5">
        <div
          className="bg-emerald-500 h-full transition-all duration-300"
          style={{ width: `${bidRatio}%` }}
        />
        <div
          className="bg-rose-500 h-full transition-all duration-300"
          style={{ width: `${askRatio}%` }}
        />
      </div>

      {/* Two Column Depth Visualizer */}
      <div className="grid grid-cols-2 gap-4">
        {/* Bids Column (BUY Orders) */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-extrabold uppercase text-emerald-400 border-b border-emerald-900/40 pb-1 flex justify-between">
            <span>Alış (Bids)</span>
            <span>Miktar</span>
          </div>

          {bids.slice(0, 7).map((b, i) => {
            const notional = b.qty * b.price;
            const barPct = (notional / maxNotional) * 100;
            const isWall = bidWalls.some((w) => w.price === b.price);

            return (
              <div
                key={i}
                className={`relative flex items-center justify-between text-xs font-mono py-1 px-2 rounded ${
                  isWall
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 font-black'
                    : 'text-emerald-400 hover:bg-slate-800/60'
                }`}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 bg-emerald-500/10 rounded pointer-events-none"
                  style={{ width: `${barPct}%` }}
                />
                <span className="relative z-10 font-bold">
                  ${b.price.toFixed(currentSymbol.decimals)} {isWall && '🛡️ DUVAR'}
                </span>
                <span className="relative z-10 text-slate-300">{b.qty.toFixed(2)}</span>
              </div>
            );
          })}
        </div>

        {/* Asks Column (SELL Orders) */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-extrabold uppercase text-rose-400 border-b border-rose-900/40 pb-1 flex justify-between">
            <span>Fiyat</span>
            <span>Satış (Asks)</span>
          </div>

          {asks.slice(0, 7).map((a, i) => {
            const notional = a.qty * a.price;
            const barPct = (notional / maxNotional) * 100;
            const isWall = askWalls.some((w) => w.price === a.price);

            return (
              <div
                key={i}
                className={`relative flex items-center justify-between text-xs font-mono py-1 px-2 rounded ${
                  isWall
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50 font-black'
                    : 'text-rose-400 hover:bg-slate-800/60'
                }`}
              >
                <div
                  className="absolute right-0 top-0 bottom-0 bg-rose-500/10 rounded pointer-events-none"
                  style={{ width: `${barPct}%` }}
                />
                <span className="relative z-10 font-bold">
                  ${a.price.toFixed(currentSymbol.decimals)} {isWall && '🧱 DUVAR'}
                </span>
                <span className="relative z-10 text-slate-300">{a.qty.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spoof & Liquidity Void Alert Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Spoofing Skoru: <strong className="text-amber-300">%{spoofScore}</strong></span>
        </div>

        <div className="text-slate-400 text-[11px]">
          {bidWalls.length > 0 && (
            <span className="text-emerald-400 font-bold mr-3">
              En Yakın Alış Desteği: ${bidWalls[0].price.toFixed(currentSymbol.decimals)}
            </span>
          )}
          {askWalls.length > 0 && (
            <span className="text-rose-400 font-bold">
              En Yakın Satış Direnci: ${askWalls[0].price.toFixed(currentSymbol.decimals)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
