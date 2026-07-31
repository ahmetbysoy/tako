import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { OrderBookData, CryptoSymbol } from '../types';

interface OrderBookVisualizerProps {
  orderBook: OrderBookData;
  currentSymbol: CryptoSymbol;
  price: number;
}

export const OrderBookVisualizer: React.FC<OrderBookVisualizerProps> = ({
  orderBook,
  currentSymbol,
}) => {
  const { bids, asks, bidRatio, askRatio, bidWalls, askWalls, spoofScore } = orderBook;

  const maxNotional = Math.max(
    ...bids.map((b) => b.qty * b.price),
    ...asks.map((a) => a.qty * a.price),
    100
  );

  return (
    <div className="bg-white/90 border border-pink-200/80 rounded-3xl p-4 shadow-sm shadow-pink-100/50">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-100 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-pink-600" />
          <h3 className="text-xs font-black text-purple-950 uppercase tracking-tight">
            Order Book Derinliği & Duvar Analizi (L2 Depth)
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs font-black">
          <span className="text-emerald-700">Alış (Bid): %{bidRatio.toFixed(1)}</span>
          <span className="text-purple-300">|</span>
          <span className="text-rose-700">Satış (Ask): %{askRatio.toFixed(1)}</span>
        </div>
      </div>

      {/* Depth Balance Bar */}
      <div className="w-full h-3 bg-pink-50 rounded-full overflow-hidden flex border border-pink-200 mb-4 p-0.5">
        <div
          className="bg-emerald-400 h-full rounded-l-full transition-all duration-300"
          style={{ width: `${bidRatio}%` }}
        />
        <div
          className="bg-rose-400 h-full rounded-r-full transition-all duration-300"
          style={{ width: `${askRatio}%` }}
        />
      </div>

      {/* Two Column Depth Visualizer */}
      <div className="grid grid-cols-2 gap-3">
        {/* Bids Column (BUY Orders) */}
        <div className="space-y-1">
          <div className="text-[10px] font-black uppercase text-emerald-700 border-b border-emerald-100 pb-1 flex justify-between">
            <span>Alış (Bids)</span>
            <span>Miktar</span>
          </div>

          {bids.slice(0, 6).map((b, i) => {
            const notional = b.qty * b.price;
            const barPct = (notional / maxNotional) * 100;
            const isWall = bidWalls.some((w) => w.price === b.price);

            return (
              <div
                key={i}
                className={`relative flex items-center justify-between text-xs font-mono py-1 px-1.5 rounded-lg ${
                  isWall
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-black'
                    : 'text-emerald-800 hover:bg-emerald-50/50'
                }`}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 bg-emerald-200/40 rounded-lg pointer-events-none"
                  style={{ width: `${barPct}%` }}
                />
                <span className="relative z-10 font-bold">
                  ${b.price.toFixed(currentSymbol.decimals)} {isWall && '🛡️ DUVAR'}
                </span>
                <span className="relative z-10 text-slate-700">{b.qty.toFixed(2)}</span>
              </div>
            );
          })}
        </div>

        {/* Asks Column (SELL Orders) */}
        <div className="space-y-1">
          <div className="text-[10px] font-black uppercase text-rose-700 border-b border-rose-100 pb-1 flex justify-between">
            <span>Fiyat</span>
            <span>Satış (Asks)</span>
          </div>

          {asks.slice(0, 6).map((a, i) => {
            const notional = a.qty * a.price;
            const barPct = (notional / maxNotional) * 100;
            const isWall = askWalls.some((w) => w.price === a.price);

            return (
              <div
                key={i}
                className={`relative flex items-center justify-between text-xs font-mono py-1 px-1.5 rounded-lg ${
                  isWall
                    ? 'bg-rose-100 text-rose-900 border border-rose-300 font-black'
                    : 'text-rose-800 hover:bg-rose-50/50'
                }`}
              >
                <div
                  className="absolute right-0 top-0 bottom-0 bg-rose-200/40 rounded-lg pointer-events-none"
                  style={{ width: `${barPct}%` }}
                />
                <span className="relative z-10 font-bold">
                  ${a.price.toFixed(currentSymbol.decimals)} {isWall && '🧱 DUVAR'}
                </span>
                <span className="relative z-10 text-slate-700">{a.qty.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spoof & Liquidity Void Alert Footer */}
      <div className="mt-3 pt-2.5 border-t border-pink-100 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-purple-900">
        <div className="flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Spoofing: <strong>%{spoofScore}</strong></span>
        </div>

        <div className="text-[11px]">
          {bidWalls.length > 0 && (
            <span className="text-emerald-700 mr-2">
              Destek: ${bidWalls[0].price.toFixed(currentSymbol.decimals)}
            </span>
          )}
          {askWalls.length > 0 && (
            <span className="text-rose-700">
              Direnç: ${askWalls[0].price.toFixed(currentSymbol.decimals)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
