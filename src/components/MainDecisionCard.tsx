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
  Crosshair,
  Volume2
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
}) => {
  const [isReasonsExpanded, setIsReasonsExpanded] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!signal) {
    return (
      <div className="bg-white/90 border border-pink-200 rounded-3xl p-5 text-center text-purple-600 animate-pulse shadow-sm max-w-full overflow-hidden">
        🐙 Tako deniz derinliklerinden veri akışını tarıyor...
      </div>
    );
  }

  const isLong = signal.direction === 'LONG';
  const isShort = signal.direction === 'SHORT';

  const probValue = isLong
    ? signal.longProbability
    : isShort
    ? signal.shortProbability
    : signal.neutralProbability;

  const entryPriceFormatted = signal.entryPrice.toLocaleString(undefined, {
    minimumFractionDigits: currentSymbol.decimals,
    maximumFractionDigits: currentSymbol.decimals,
  });

  // Tako Mascot Mood Generator
  const getTakoMood = () => {
    if (signal.isFakeBreakout) {
      return {
        emoji: '🐙⚠️',
        quote: 'Tuzak Var! Fiyat hareketi hacim ve deltayla uyuşmuyor, sahte kırılma!',
        bg: 'bg-amber-50 border-amber-200 text-amber-900',
      };
    }
    if (isLong) {
      return {
        emoji: '🐙🚀',
        quote: `Ahtapot dokunaçları güçlü alım baskısı seziyor! %${probValue} Long Olasılığı`,
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      };
    }
    if (isShort) {
      return {
        emoji: '🐙🌊',
        quote: `Ahtapot satış dalgası algıladı! %${probValue} Short Olasılığı`,
        bg: 'bg-rose-50 border-rose-200 text-rose-900',
      };
    }
    return {
      emoji: '🐙☕',
      quote: 'Piyasa kararsız, Tako pusuda bekliyor... Yüksek olasılıklı kırılım bekleniyor.',
      bg: 'bg-purple-50 border-purple-200 text-purple-900',
    };
  };

  const takoMood = getTakoMood();

  // Web Speech API Voice Reader for AI Verdict
  const speakVerdict = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = `${currentSymbol.base} sinyali. ${takoMood.quote}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'tr-TR';
      utterance.rate = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="relative overflow-hidden bg-white/85 border border-pink-200/80 rounded-3xl p-3.5 sm:p-5 shadow-lg shadow-pink-100/60 backdrop-blur-xl transition-all max-w-full">
      {/* Soft Pastel Ambient Glow Background */}
      <div
        className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none ${
          isLong
            ? 'bg-emerald-300'
            : isShort
            ? 'bg-rose-300'
            : 'bg-purple-300'
        }`}
      />

      {/* Tako Mascot Commentary Card with Audio Voice Reader Button */}
      <div className={`p-2.5 sm:p-3 rounded-2xl border ${takoMood.bg} mb-3.5 flex items-center justify-between gap-2.5 shadow-xs transition-all max-w-full overflow-hidden`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-xl sm:text-2xl shrink-0">{takoMood.emoji}</span>
          <div className="text-xs font-bold leading-tight min-w-0">
            <span className="block text-[9px] sm:text-[10px] uppercase font-black opacity-60 tracking-wider">Tako Maskot Yorumu</span>
            <span className="truncate block">{takoMood.quote}</span>
          </div>
        </div>

        {/* Speech Reader Button */}
        <button
          onClick={speakVerdict}
          className={`p-1.5 sm:p-2 rounded-xl border text-xs font-black shrink-0 transition-all active:scale-95 ${
            isSpeaking ? 'bg-pink-500 text-white animate-pulse' : 'bg-white hover:bg-pink-50 border-pink-200 text-purple-900 shadow-xs'
          }`}
          title="Tako Yorumunu Sesli Oku"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Signal Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-center">
        {/* Signal Direction Badge & Probability Meter */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-3.5 sm:p-5 bg-pink-50/40 rounded-2xl border border-pink-200/60 text-center relative max-w-full">
          <div className="text-[10px] font-black uppercase tracking-widest text-purple-600 mb-1.5">
            60s Sinyal & Olasılık
          </div>

          {/* Big Glowing Direction Banner */}
          <div
            className={`w-full py-2.5 sm:py-3.5 px-3 sm:px-5 rounded-2xl flex items-center justify-center gap-2 sm:gap-3 font-black text-xl sm:text-2xl tracking-wide shadow-md border transition-all ${
              isLong
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-emerald-100'
                : isShort
                ? 'bg-rose-100 text-rose-800 border-rose-300 shadow-rose-100'
                : 'bg-purple-100 text-purple-800 border-purple-200'
            }`}
          >
            {isLong && <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3] text-emerald-600 shrink-0" />}
            {isShort && <TrendingDown className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3] text-rose-600 shrink-0" />}
            {signal.direction === 'NEUTRAL' && <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 shrink-0" />}
            <span>{signal.direction}</span>
            <span className="text-lg sm:text-xl font-extrabold opacity-90">%{probValue}</span>
          </div>

          {/* Probability Progress Bar */}
          <div className="w-full mt-2.5 bg-white h-2.5 rounded-full overflow-hidden border border-pink-200 p-0.5 shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isLong
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                  : isShort
                  ? 'bg-gradient-to-r from-rose-400 to-pink-500'
                  : 'bg-purple-400'
              }`}
              style={{ width: `${probValue}%` }}
            />
          </div>

          {/* Confidence & Kelly Row */}
          <div className="w-full grid grid-cols-2 gap-2 mt-2.5 text-xs font-semibold">
            <div className="bg-white p-2 sm:p-2.5 rounded-xl border border-pink-200/80 text-left shadow-2xs min-w-0">
              <span className="text-slate-500 block text-[9px] sm:text-[10px] font-bold uppercase truncate">Güven Skoru</span>
              <span className="text-emerald-700 font-black text-xs sm:text-sm">{signal.confidence} / 10</span>
            </div>
            <div className="bg-white p-2 sm:p-2.5 rounded-xl border border-pink-200/80 text-left shadow-2xs min-w-0">
              <span className="text-slate-500 block text-[9px] sm:text-[10px] font-bold uppercase truncate">Kelly Risk</span>
              <span className="text-purple-700 font-black text-xs sm:text-sm">%{signal.kellyFraction ?? 5.0} Sermaye</span>
            </div>
          </div>
        </div>

        {/* Scalp Target Execution Box */}
        <div className="lg:col-span-7 space-y-2.5 max-w-full overflow-hidden">
          <div className="bg-white/90 border border-pink-200/80 rounded-2xl p-3 sm:p-4 shadow-2xs max-w-full">
            <div className="flex items-center justify-between border-b border-pink-100 pb-2 mb-2.5 flex-wrap gap-1">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-purple-900">
                <Target className="w-4 h-4 text-pink-600 shrink-0" />
                <span>Scalp Hedef Fiyatları</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                <Clock className="w-3 h-3 text-purple-500 shrink-0" />
                <span>Süre: {signal.recommendedHoldingTime}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
              {/* Entry Price */}
              <div className="bg-pink-50/50 p-2 sm:p-2.5 rounded-xl border border-pink-200/60 min-w-0">
                <div className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase mb-0.5 flex items-center gap-0.5 sm:gap-1 truncate">
                  <Crosshair className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>Giriş</span>
                </div>
                <div className="text-[11px] sm:text-sm font-black font-mono text-purple-950 truncate">
                  ${entryPriceFormatted}
                </div>
              </div>

              {/* Take Profit (TP) */}
              <div className="bg-emerald-50/80 p-2 sm:p-2.5 rounded-xl border border-emerald-200 min-w-0">
                <div className="text-[9px] sm:text-[10px] font-bold text-emerald-700 uppercase mb-0.5 flex items-center justify-between gap-0.5 truncate">
                  <span>Kar Al</span>
                  <span className="text-[8px] sm:text-[9px]">+{signal.tpPercent}%</span>
                </div>
                <div className="text-[11px] sm:text-sm font-black font-mono text-emerald-800 truncate">
                  ${signal.tpPrice.toLocaleString(undefined, { minimumFractionDigits: currentSymbol.decimals })}
                </div>
              </div>

              {/* Stop Loss (SL) */}
              <div className="bg-rose-50/80 p-2 sm:p-2.5 rounded-xl border border-rose-200 min-w-0">
                <div className="text-[9px] sm:text-[10px] font-bold text-rose-700 uppercase mb-0.5 flex items-center justify-between gap-0.5 truncate">
                  <span>Stop</span>
                  <span className="text-[8px] sm:text-[9px]">-{signal.slPercent}%</span>
                </div>
                <div className="text-[11px] sm:text-sm font-black font-mono text-rose-800 truncate">
                  ${signal.slPrice.toLocaleString(undefined, { minimumFractionDigits: currentSymbol.decimals })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "SEBEP GÖSTER" ACCORDION */}
      <div className="mt-3 sm:mt-4 border-t border-pink-100 pt-2.5 max-w-full">
        <button
          onClick={() => setIsReasonsExpanded(!isReasonsExpanded)}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-pink-50/60 hover:bg-pink-100/60 text-xs font-black text-purple-900 transition-colors"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <HelpCircle className="w-4 h-4 text-pink-600 shrink-0" />
            <span className="truncate">Sinyal Faktörleri ("Neden?")</span>
            <span className="px-1.5 py-0.5 text-[10px] bg-white rounded-full text-pink-700 border border-pink-200 shrink-0">
              {signal.reasons.length}
            </span>
          </div>

          {isReasonsExpanded ? (
            <ChevronUp className="w-4 h-4 text-purple-500 shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-purple-500 shrink-0" />
          )}
        </button>

        {/* Inline Reasons Breakdown List */}
        {isReasonsExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 animate-in fade-in duration-200">
            {signal.reasons.map((r, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 transition-all ${
                  r.type === 'BULLISH'
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : r.type === 'BEARISH'
                    ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                    : 'bg-amber-50/70 border-amber-200 text-amber-900'
                }`}
              >
                {r.type === 'BULLISH' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : r.type === 'BEARISH' ? (
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between font-bold text-slate-900 gap-1">
                    <span className="break-words">{r.title}</span>
                    <span className="text-[9px] opacity-70 font-mono shrink-0">
                      [{r.engine}]
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] sm:text-[11px] opacity-80 leading-tight">{r.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
