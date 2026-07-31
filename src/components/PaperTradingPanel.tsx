import React from 'react';
import { Wallet, TrendingUp, TrendingDown, RefreshCw, X, Play } from 'lucide-react';
import { PaperAccount, PaperPosition, DecisionSignal, CryptoSymbol, ThemeMode } from '../types';

interface PaperTradingPanelProps {
  account: PaperAccount;
  positions: PaperPosition[];
  onOpenPosition: (dir: 'LONG' | 'SHORT', amountUsd: number) => void;
  onClosePosition: (id: string) => void;
  onResetAccount: () => void;
  signal: DecisionSignal | null;
  currentSymbol: CryptoSymbol;
  price: number;
  theme: ThemeMode;
}

export const PaperTradingPanel: React.FC<PaperTradingPanelProps> = ({
  account,
  positions,
  onOpenPosition,
  onClosePosition,
  onResetAccount,
  signal,
  currentSymbol,
  price,
  theme,
}) => {
  const isDark = theme === 'dark';

  const activePositions = positions.filter((p) => p.status === 'OPEN');
  const unrealizedPnlTotal = activePositions.reduce((sum, p) => sum + p.pnlUsd, 0);
  const totalEquity = account.balanceUsd + unrealizedPnlTotal;
  const winRatePct = account.tradesCount > 0 ? ((account.winsCount / account.tradesCount) * 100).toFixed(1) : '0.0';

  return (
    <div
      className={`rounded-3xl p-3.5 sm:p-5 shadow-lg border transition-all max-w-full overflow-hidden ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-slate-950/50'
          : 'bg-white/90 border-pink-200/80 text-slate-800 shadow-pink-100/50'
      }`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 mb-3.5 border-inherit">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl shrink-0 ${isDark ? 'bg-amber-950/80 text-amber-400 border border-amber-800/50' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className={`text-xs sm:text-sm font-black uppercase tracking-tight ${isDark ? 'text-slate-100' : 'text-purple-950'}`}>
              🎯 Paper Trading & Sanal PnL Motoru
            </h3>
            <p className={`text-[10px] sm:text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-purple-700'}`}>
              10.000$ Sanal Bakiye ile Tako Sinyallerini Canlı Test Et
            </p>
          </div>
        </div>

        <button
          onClick={onResetAccount}
          className={`p-1.5 rounded-xl border text-xs font-bold transition-all ${
            isDark ? 'bg-slate-800 text-slate-400 border-slate-700 hover:text-rose-400' : 'bg-pink-50 text-purple-700 border-pink-200 hover:text-rose-600'
          }`}
          title="Sanal Bakiyeyi Sıfırla ($10,000)"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Account Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3.5">
        {/* Total Equity */}
        <div className={`p-2.5 sm:p-3 rounded-2xl border min-w-0 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-pink-50/50 border-pink-200'}`}>
          <span className={`block text-[9px] sm:text-[10px] font-bold uppercase truncate ${isDark ? 'text-slate-400' : 'text-purple-700'}`}>Sanal Özkaynak</span>
          <span className={`text-sm sm:text-lg font-black font-mono truncate block ${totalEquity >= account.initialBalanceUsd ? (isDark ? 'text-emerald-400' : 'text-emerald-700') : (isDark ? 'text-rose-400' : 'text-rose-700')}`}>
            ${totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        {/* Realized PnL */}
        <div className={`p-2.5 sm:p-3 rounded-2xl border min-w-0 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-pink-50/50 border-pink-200'}`}>
          <span className={`block text-[9px] sm:text-[10px] font-bold uppercase truncate ${isDark ? 'text-slate-400' : 'text-purple-700'}`}>Realize PnL</span>
          <span className={`text-sm sm:text-lg font-black font-mono truncate block ${account.realizedPnlUsd >= 0 ? (isDark ? 'text-emerald-400' : 'text-emerald-700') : (isDark ? 'text-rose-400' : 'text-rose-700')}`}>
            {account.realizedPnlUsd >= 0 ? '+' : ''}${account.realizedPnlUsd.toFixed(2)}
          </span>
        </div>

        {/* Active Unrealized PnL */}
        <div className={`p-2.5 sm:p-3 rounded-2xl border min-w-0 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-pink-50/50 border-pink-200'}`}>
          <span className={`block text-[9px] sm:text-[10px] font-bold uppercase truncate ${isDark ? 'text-slate-400' : 'text-purple-700'}`}>Açık PnL</span>
          <span className={`text-sm sm:text-lg font-black font-mono truncate block ${unrealizedPnlTotal >= 0 ? (isDark ? 'text-emerald-400' : 'text-emerald-700') : (isDark ? 'text-rose-400' : 'text-rose-700')}`}>
            {unrealizedPnlTotal >= 0 ? '+' : ''}${unrealizedPnlTotal.toFixed(2)}
          </span>
        </div>

        {/* Win Rate */}
        <div className={`p-2.5 sm:p-3 rounded-2xl border min-w-0 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-pink-50/50 border-pink-200'}`}>
          <span className={`block text-[9px] sm:text-[10px] font-bold uppercase truncate ${isDark ? 'text-slate-400' : 'text-purple-700'}`}>Win Rate</span>
          <span className={`text-sm sm:text-lg font-black truncate block ${isDark ? 'text-cyan-400' : 'text-purple-900'}`}>
            %{winRatePct} <span className="text-[10px] opacity-70 font-normal">({account.winsCount}W)</span>
          </span>
        </div>
      </div>

      {/* 1-Tap Open Paper Trade Action Box */}
      <div className={`p-3 rounded-2xl border mb-3.5 flex flex-wrap items-center justify-between gap-2 ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-purple-50/60 border-pink-200'}`}>
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 text-pink-500 animate-pulse shrink-0" />
          <div className="text-xs font-bold min-w-0">
            <span className="block font-black text-purple-950 dark:text-slate-100 truncate">
              {currentSymbol.base}/USDT @ ${price.toLocaleString(undefined, { minimumFractionDigits: currentSymbol.decimals })}
            </span>
            <span className="text-[10px] opacity-70 truncate block">Tako: {signal?.direction} (%{signal?.longProbability || 50})</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onOpenPosition('LONG', 1000)}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-black bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-xs transition-all active:scale-95 shrink-0"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Long ($1k)</span>
          </button>

          <button
            onClick={() => onOpenPosition('SHORT', 1000)}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-black bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-xs transition-all active:scale-95 shrink-0"
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Short ($1k)</span>
          </button>
        </div>
      </div>

      {/* Active Positions Table */}
      <div className="space-y-2 max-w-full">
        <h4 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-purple-950'}`}>
          Açık Sanal Pozisyonlar ({activePositions.length})
        </h4>

        {activePositions.length === 0 ? (
          <div className={`text-center py-5 text-xs italic font-bold rounded-2xl border border-dashed ${isDark ? 'text-slate-500 border-slate-800' : 'text-purple-400 border-pink-200'}`}>
            Henüz açık sanal pozisyon yok. $1.000 sanal işlem açabilirsin! 🐙
          </div>
        ) : (
          <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {activePositions.map((pos) => {
              const isProfit = pos.pnlUsd >= 0;

              return (
                <div
                  key={pos.id}
                  className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2 text-xs font-mono transition-all ${
                    pos.direction === 'LONG'
                      ? (isDark ? 'bg-emerald-950/40 border-emerald-500/30' : 'bg-emerald-50/80 border-emerald-200')
                      : (isDark ? 'bg-rose-950/40 border-rose-500/30' : 'bg-rose-50/80 border-rose-200')
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold min-w-0">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black shrink-0 ${
                      pos.direction === 'LONG' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}>
                      {pos.direction}
                    </span>
                    <span className={`truncate ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{pos.symbol}</span>
                    <span className="text-slate-400 text-[9px] font-normal truncate hidden xs:inline">${pos.entryPrice}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`font-black text-[11px] sm:text-xs ${isProfit ? (isDark ? 'text-emerald-400' : 'text-emerald-700') : (isDark ? 'text-rose-400' : 'text-rose-700')}`}>
                      {isProfit ? '+' : ''}${pos.pnlUsd.toFixed(2)} ({pos.pnlPercent >= 0 ? '+' : ''}{pos.pnlPercent.toFixed(1)}%)
                    </span>

                    <button
                      onClick={() => onClosePosition(pos.id)}
                      className={`p-1 rounded-lg border hover:scale-105 transition-all shrink-0 ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-rose-400' : 'bg-white border-pink-200 text-slate-600 hover:text-rose-600'
                      }`}
                      title="Pozisyonu Kapat"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
