import React from 'react';
import { LayoutGrid, TrendingUp, TrendingDown, Zap, Compass } from 'lucide-react';
import { SymbolScreenerItem, CryptoSymbol, ThemeMode } from '../types';

interface MultiAssetScreenerProps {
  screenerItems: SymbolScreenerItem[];
  onSelectSymbol: (symbol: CryptoSymbol) => void;
  currentSymbol: CryptoSymbol;
  theme: ThemeMode;
}

export const MultiAssetScreener: React.FC<MultiAssetScreenerProps> = ({
  screenerItems,
  onSelectSymbol,
  currentSymbol,
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
          <div className={`p-2 rounded-xl ${isDark ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/50' : 'bg-purple-100 text-purple-700 border border-pink-200'}`}>
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-sm font-black uppercase tracking-tight ${isDark ? 'text-slate-100' : 'text-purple-950'}`}>
              🔍 Çoklu Sembol Taraması & Radar (Multi-Asset Screener)
            </h3>
            <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-purple-700'}`}>
              Popüler Paritelerin Tako Skorları, Sinyal Güçleri ve BTC Ayrışmaları
            </p>
          </div>
        </div>

        <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${isDark ? 'bg-slate-800 text-cyan-400 border-slate-700' : 'bg-pink-100 text-pink-700 border-pink-200'}`}>
          {screenerItems.length} Parite Canlı
        </span>
      </div>

      {/* Grid Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {screenerItems.map((item) => {
          const isSelected = item.symbol.symbol === currentSymbol.symbol;
          const isLong = item.direction === 'LONG';
          const isShort = item.direction === 'SHORT';

          return (
            <div
              key={item.symbol.symbol}
              onClick={() => onSelectSymbol(item.symbol)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? (isDark ? 'bg-slate-800/90 border-pink-500 shadow-md ring-1 ring-pink-500/50' : 'bg-pink-100/80 border-pink-400 shadow-md ring-1 ring-pink-400')
                  : (isDark ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700' : 'bg-pink-50/40 border-pink-200/80 hover:bg-pink-50')
              }`}
            >
              {/* Divergence Tag Banner if present */}
              {item.divergenceTag && (
                <div className="mb-2 flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                  <Compass className="w-3 h-3 text-amber-600" />
                  <span>{item.divergenceTag}</span>
                </div>
              )}

              {/* Symbol & Price Row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`font-black text-sm ${isDark ? 'text-slate-100' : 'text-purple-950'}`}>
                    {item.symbol.base}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    item.change24h >= 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(2)}%
                  </span>
                </div>

                <span className={`font-mono text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  ${item.price.toLocaleString(undefined, { minimumFractionDigits: item.symbol.decimals })}
                </span>
              </div>

              {/* Signal Badge & Score */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-inherit">
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-black border flex items-center gap-1 ${
                    isLong
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : isShort
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : 'bg-purple-100 text-purple-800 border-purple-200'
                  }`}>
                    {isLong && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
                    {isShort && <TrendingDown className="w-3.5 h-3.5 text-rose-600" />}
                    {item.direction} %{item.probability}
                  </span>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-black font-mono ${
                    item.totalScore > 0 ? 'text-emerald-600' : item.totalScore < 0 ? 'text-rose-600' : 'text-purple-600'
                  }`}>
                    Skor: {item.totalScore > 0 ? `+${item.totalScore}` : item.totalScore}
                  </span>
                </div>
              </div>

              {/* Signal Strength Progress Bar */}
              <div className="w-full mt-2 bg-pink-100/50 h-1.5 rounded-full overflow-hidden border border-pink-200/60 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
                  style={{ width: `${item.signalStrengthIndex}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
