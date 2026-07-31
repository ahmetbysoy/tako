import React, { useState } from 'react';
import {
  Zap,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Target,
  TrendingUp,
  TrendingDown,
  Clock,
  Crosshair
} from 'lucide-react';
import { DecisionSignal, CryptoSymbol } from '../types';

interface MainDecisionCardProps {
  signal: DecisionSignal | null;
  currentSymbol: CryptoSymbol;
  price: number;
  change24h: number;
}

export const MainDecisionCard: React.FC<MainDecisionCardProps> = ({
  signal,
  currentSymbol,
  price,
  change24h,
}) => {
  const [showReasonsModal, setShowReasonsModal] = useState(false);
  const [isReasonsExpanded, setIsReasonsExpanded] = useState(true);

  if (!signal) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 animate-pulse">
        Karar motoru veri akışını bekliyor...
      </div>
    );
  }

  const isLong = signal.direction === 'LONG';
  const isShort = signal.direction === 'SHORT';
  const isNeutral = signal.direction === 'NEUTRAL';

  const probValue = isLong
    ? signal.longProbability
    : isShort
    ? signal.shortProbability
    : signal.neutralProbability;

  const formattedPrice = price.toLocaleString(undefined, {
    minimumFractionDigits: currentSymbol.decimals,
    maximumFractionDigits: currentSymbol.decimals,
  });

  return (
    <div className="relative overflow-hidden bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
      {/* Background Subtle Gradient Glow */}
      <div
        className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${
          isLong
            ? 'bg-emerald-500'
            : isShort
            ? 'bg-rose-500'
            : 'bg-amber-500'
        }`}
      />

      {/* Top Header Row: Symbol & Current Live Price */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-black text-slate-100 tracking-tight">
            {currentSymbol.base} <span className="text-slate-500 text-lg">/ USDT</span>
          </div>
          <div
            className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
              change24h >= 0
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-950/80 text-rose-400 border-rose-500/30'
            }`}
          >
            24h {change24h >= 0 ? '+' : ''}
            {change24h.toFixed(2)}%
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Canlı Fiyat
          </div>
          <div className="text-2xl font-black text-slate-100 font-mono tracking-tight">
            ${formattedPrice}
          </div>
        </div>
      </div>

      {/* Main Signal Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Signal Direction Badge & Probability Meter (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-950/80 rounded-2xl border border-slate-800/80 shadow-inner text-center relative">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            60s Sinyal Yönü & Olasılık
          </div>

          {/* Big Glowing Direction Banner */}
          <div
            className={`w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-3 font-black text-3xl tracking-wider shadow-2xl border transition-all ${
              isLong
                ? 'bg-emerald-950/90 text-emerald-400 border-emerald-500/50 shadow-emerald-500/20'
                : isShort
                ? 'bg-rose-950/90 text-rose-400 border-rose-500/50 shadow-rose-500/20'
                : 'bg-slate-800 text-amber-300 border-slate-700'
            }`}
          >
            {isLong && <TrendingUp className="w-8 h-8 stroke-[3]" />}
            {isShort && <TrendingDown className="w-8 h-8 stroke-[3]" />}
            {isNeutral && <Zap className="w-8 h-8 text-amber-400" />}
            <span>{signal.direction}</span>
            <span className="text-2xl opacity-90">{probValue}%</span>
          </div>

          {/* Probability Progress Bar */}
          <div className="w-full mt-4 bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isLong
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : isShort
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500'
                  : 'bg-amber-400'
              }`}
              style={{ width: `${probValue}%` }}
            />
          </div>

          {/* Confidence & Risk Level Row */}
          <div className="w-full grid grid-cols-2 gap-3 mt-4 text-xs font-semibold">
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Güven Skoru</span>
              <span className="text-emerald-400 font-extrabold text-sm">{signal.confidence} / 10</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Risk Seviyesi</span>
              <span
                className={`font-extrabold text-sm ${
                  signal.riskLevel === 'LOW'
                    ? 'text-emerald-400'
                    : signal.riskLevel === 'MEDIUM'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {signal.riskLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Scalp Target Execution Box (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-300">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Scalp Hedef ve İşlem Parametreleri</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 font-mono">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Beklenen Süre: {signal.recommendedHoldingTime}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Entry Price */}
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                  <Crosshair className="w-3 h-3 text-slate-400" />
                  Giriş (Entry)
                </div>
                <div className="text-sm font-black font-mono text-slate-100">
                  ${signal.entryPrice.toLocaleString(undefined, { minimumFractionDigits: currentSymbol.decimals })}
                </div>
              </div>

              {/* Take Profit (TP) */}
              <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30">
                <div className="text-[10px] font-bold text-emerald-400 uppercase mb-1 flex items-center justify-between">
                  <span>Kar Al (TP)</span>
                  <span>+{signal.tpPercent}%</span>
                </div>
                <div className="text-sm font-black font-mono text-emerald-300">
                  ${signal.tpPrice.toLocaleString(undefined, { minimumFractionDigits: currentSymbol.decimals })}
                </div>
              </div>

              {/* Stop Loss (SL) */}
              <div className="bg-rose-950/40 p-3 rounded-xl border border-rose-500/30">
                <div className="text-[10px] font-bold text-rose-400 uppercase mb-1 flex items-center justify-between">
                  <span>Zarar Durdur (SL)</span>
                  <span>-{signal.slPercent}%</span>
                </div>
                <div className="text-sm font-black font-mono text-rose-300">
                  ${signal.slPrice.toLocaleString(undefined, { minimumFractionDigits: currentSymbol.decimals })}
                </div>
              </div>
            </div>

            {/* Fake Breakout Warning (if present) */}
            {signal.isFakeBreakout && (
              <div className="mt-4 bg-amber-950/80 border border-amber-500/50 rounded-xl p-3 flex items-start gap-3 text-amber-200 text-xs">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold uppercase tracking-wide block text-amber-300">
                    ⚠️ Fake Breakout / Boğa-Ayı Tuzağı Uyarısı
                  </span>
                  <span>{signal.fakeBreakoutReason}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* "SEBEP GÖSTER" (REASON BREAKDOWN) ACCORDION & MODAL TRIGGER */}
      <div className="mt-6 border-t border-slate-800 pt-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setIsReasonsExpanded(!isReasonsExpanded)}
            className="flex items-center gap-2 text-sm font-extrabold text-slate-200 hover:text-emerald-400 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Sebep Göster ("Neden bu karar verildi?")</span>
            <span className="px-2 py-0.5 text-[10px] bg-slate-800 rounded-full text-slate-300">
              {signal.reasons.length} Faktör
            </span>
            {isReasonsExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <button
            onClick={() => setShowReasonsModal(true)}
            className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Detaylı Rapor Modal</span>
          </button>
        </div>

        {/* Inline Reasons Breakdown List */}
        {isReasonsExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 animate-in fade-in duration-200">
            {signal.reasons.map((r, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                  r.type === 'BULLISH'
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                    : r.type === 'BEARISH'
                    ? 'bg-rose-950/40 border-rose-500/30 text-rose-200'
                    : 'bg-amber-950/40 border-amber-500/30 text-amber-200'
                }`}
              >
                {r.type === 'BULLISH' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : r.type === 'BEARISH' ? (
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between font-bold text-slate-100">
                    <span>{r.title}</span>
                    <span className="text-[10px] opacity-75 font-mono">
                      [{r.engine}]
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] opacity-90">{r.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Reasons Modal */}
      {showReasonsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setShowReasonsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 text-lg font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
              <Zap className="w-6 h-6 text-emerald-400" />
              <h3 className="text-xl font-black text-slate-100">
                Karar Motoru Gerekçe Raporu ("Neden?")
              </h3>
            </div>

            <div className="space-y-3">
              {signal.reasons.map((r, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl border text-sm flex items-start gap-3 ${
                    r.type === 'BULLISH'
                      ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-100'
                      : r.type === 'BEARISH'
                      ? 'bg-rose-950/50 border-rose-500/40 text-rose-100'
                      : 'bg-amber-950/50 border-amber-500/40 text-amber-100'
                  }`}
                >
                  <div className="font-mono text-xs font-bold px-2 py-1 bg-slate-900 rounded border border-slate-800 shrink-0">
                    {r.impactScore > 0 ? `+${r.impactScore}` : r.impactScore} Puan
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{r.title}</h4>
                    <p className="text-xs opacity-90 mt-1">{r.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-800 pt-4 flex justify-end">
              <button
                onClick={() => setShowReasonsModal(false)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
