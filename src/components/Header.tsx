import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Search,
  Check,
  Target,
  Sun,
  Moon,
  Zap,
  SlidersHorizontal
} from 'lucide-react';
import { CryptoSymbol, ThemeMode } from '../types';

interface HeaderProps {
  currentSymbol: CryptoSymbol;
  onSelectSymbol: (symbol: CryptoSymbol) => void;
  symbols: CryptoSymbol[];
  timeframe: string;
  onSelectTimeframe: (tf: '1m' | '3m' | '5m' | '15m') => void;
  isLive: boolean;
  isFallback: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTriggerAiReasoning: () => void;
  isAiLoading: boolean;
  onOpenCalibration?: () => void;
  price: number;
  change24h: number;
  theme: ThemeMode;
  onToggleTheme: () => void;
  simpleMode: boolean;
  onToggleSimpleMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSymbol,
  onSelectSymbol,
  symbols,
  timeframe,
  onSelectTimeframe,
  soundEnabled,
  onToggleSound,
  onTriggerAiReasoning,
  isAiLoading,
  onOpenCalibration,
  price,
  change24h,
  theme,
  onToggleTheme,
  simpleMode,
  onToggleSimpleMode,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [customSearch, setCustomSearch] = useState('');

  const isDark = theme === 'dark';

  const filteredSymbols = symbols.filter(
    (s) =>
      s.symbol.toLowerCase().includes(customSearch.toLowerCase()) ||
      s.name.toLowerCase().includes(customSearch.toLowerCase())
  );

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSearch.trim()) {
      const formatted = customSearch.trim().toUpperCase();
      const sym = formatted.endsWith('USDT') ? formatted : `${formatted}USDT`;
      const base = sym.replace('USDT', '');
      onSelectSymbol({
        symbol: sym,
        base,
        quote: 'USDT',
        name: base,
        decimals: 2
      });
      setIsDropdownOpen(false);
      setCustomSearch('');
    }
  };

  const formattedPrice = price.toLocaleString(undefined, {
    minimumFractionDigits: currentSymbol.decimals,
    maximumFractionDigits: currentSymbol.decimals,
  });

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-2.5 sm:px-4 py-2 transition-all shadow-sm max-w-full overflow-hidden ${
      isDark
        ? 'bg-slate-950/90 border-slate-800 text-slate-100 shadow-slate-950/50'
        : 'bg-white/90 border-pink-200/80 text-slate-800 shadow-pink-100/50'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Brand & Symbol Switcher (Left Side) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Cute Tako Logo */}
          <div className="flex items-center gap-1 font-black text-sm sm:text-base tracking-tight select-none">
            <span className="text-xl sm:text-2xl animate-bounce hover:scale-125 transition-transform cursor-pointer" title="Tako 🐙">
              🐙
            </span>
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent font-black text-base sm:text-lg">
              TAKO
            </span>
          </div>

          {/* Symbol Selector Dropdown Pill */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl font-black text-xs transition-all border ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-slate-100 hover:bg-slate-800'
                  : 'bg-pink-50 hover:bg-pink-100/80 border-pink-200/80 text-purple-900'
              }`}
            >
              <span className="text-pink-500 font-extrabold">{currentSymbol.base}</span>
              <span className="opacity-60 text-[10px] hidden sm:inline">/ USDT</span>
              <span className="text-pink-400 text-[10px]">▼</span>
            </button>

            {isDropdownOpen && (
              <div className={`absolute left-0 mt-1.5 w-56 sm:w-60 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 border ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-pink-200 text-slate-800'
              }`}>
                <form onSubmit={handleCustomSubmit} className="mb-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-pink-400" />
                    <input
                      type="text"
                      placeholder="Coin ara (örn: PEPE, SOL)"
                      value={customSearch}
                      onChange={(e) => setCustomSearch(e.target.value)}
                      className={`w-full text-xs pl-8 pr-2 py-1.5 rounded-xl border font-medium focus:outline-none ${
                        isDark ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-pink-500' : 'bg-pink-50/50 border-pink-200 text-purple-950 focus:border-pink-500'
                      }`}
                    />
                  </div>
                </form>

                <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1 custom-scrollbar">
                  {filteredSymbols.map((s) => (
                    <button
                      key={s.symbol}
                      onClick={() => {
                        onSelectSymbol(s);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-xl font-bold transition-all ${
                        currentSymbol.symbol === s.symbol
                          ? 'bg-pink-500 text-white shadow-xs'
                          : (isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-purple-50 text-slate-700')
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{s.base}</span>
                        <span className="opacity-60 text-[10px] font-normal">{s.name}</span>
                      </div>
                      {currentSymbol.symbol === s.symbol && (
                        <Check className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Compact Live Price Badge */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] sm:text-xs font-mono font-black border ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-purple-50 border-purple-200/80 text-purple-900'
          }`}>
            <span>${formattedPrice}</span>
            <span className={`text-[9px] sm:text-[10px] px-1 rounded ${change24h >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
              {change24h >= 0 ? '+' : ''}{change24h.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Action Controls (Right Side) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Simple Mode / Pro Mode Switcher Toggle Pill */}
          <button
            onClick={onToggleSimpleMode}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-black transition-all border ${
              simpleMode
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-pink-400 shadow-xs'
                : (isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-purple-50 border-purple-200 text-purple-900')
            }`}
            title={simpleMode ? 'Sade Mod Aktif (Sadece Grafik & Karar)' : 'Detaylı Pro Moda Geç'}
          >
            {simpleMode ? <Zap className="w-3.5 h-3.5 text-amber-300" /> : <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" />}
            <span>{simpleMode ? '⚡ Sade Mod' : '⚙️ Pro Mod'}</span>
          </button>

          {/* Timeframe Selector Pills */}
          <div className={`hidden xs:flex items-center p-0.5 rounded-xl border text-xs ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-pink-50/80 border-pink-200/60'
          }`}>
            {(['1m', '3m', '5m'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => onSelectTimeframe(tf)}
                className={`px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-lg transition-all ${
                  timeframe === tf
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm'
                    : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-purple-700 hover:text-pink-600')
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Theme Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`p-1.5 rounded-xl border font-bold text-xs transition-all ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                : 'bg-pink-100 border-pink-300 text-purple-900 hover:bg-pink-200'
            }`}
            title={isDark ? 'Pastel Pembe/Mor Moduna Geç' : 'Pro Koyu Moda Geç'}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-700" />}
          </button>

          {/* Audio Alert Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Sesli Uyarı Açık' : 'Sesli Uyarı Kapalı'}
            className={`p-1.5 rounded-xl border transition-all ${
              soundEnabled
                ? (isDark ? 'bg-emerald-950 border-emerald-800 text-emerald-400' : 'bg-pink-100 border-pink-300 text-pink-700')
                : (isDark ? 'bg-slate-900 border-slate-800 text-slate-600' : 'bg-slate-100 border-slate-200 text-slate-400')
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* AI Gemini Deep Reasoning Button */}
          <button
            onClick={onTriggerAiReasoning}
            disabled={isAiLoading}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-pink-200 transition-all active:scale-95 disabled:opacity-50 shrink-0"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isAiLoading ? 'Analiz...' : 'AI Analiz'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
