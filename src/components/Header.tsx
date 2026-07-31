import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Search,
  Check,
  Target
} from 'lucide-react';
import { CryptoSymbol } from '../types';

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
}

export const Header: React.FC<HeaderProps> = ({
  currentSymbol,
  onSelectSymbol,
  symbols,
  timeframe,
  onSelectTimeframe,
  isLive,
  soundEnabled,
  onToggleSound,
  onTriggerAiReasoning,
  isAiLoading,
  onOpenCalibration,
  price,
  change24h,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [customSearch, setCustomSearch] = useState('');

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
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-200/80 px-3 py-2 text-slate-800 shadow-sm shadow-pink-100/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand & Symbol Switcher (Left Side) */}
        <div className="flex items-center gap-2">
          {/* Cute Tako Logo */}
          <div className="flex items-center gap-1.5 font-black text-base text-purple-900 tracking-tight select-none">
            <span className="text-2xl animate-bounce hover:scale-125 transition-transform cursor-pointer" title="Tako 🐙">
              🐙
            </span>
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent font-extrabold text-lg">
              TAKO
            </span>
          </div>

          {/* Symbol Selector Dropdown Pill */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 bg-pink-50 hover:bg-pink-100/80 border border-pink-200/80 text-purple-900 px-2.5 py-1 rounded-xl font-black text-xs sm:text-sm transition-all shadow-inner"
            >
              <span className="text-pink-600 font-extrabold">{currentSymbol.base}</span>
              <span className="text-purple-400 text-[11px]">/ USDT</span>
              <span className="text-pink-400 text-[10px]">▼</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-60 bg-white border border-pink-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <form onSubmit={handleCustomSubmit} className="mb-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-pink-400" />
                    <input
                      type="text"
                      placeholder="Coin ara (örn: PEPE, SOL)"
                      value={customSearch}
                      onChange={(e) => setCustomSearch(e.target.value)}
                      className="w-full bg-pink-50/50 text-purple-950 text-xs pl-8 pr-2 py-1.5 rounded-xl border border-pink-200 focus:outline-none focus:border-pink-500 font-medium"
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
                          ? 'bg-pink-100 text-pink-700 border border-pink-300'
                          : 'hover:bg-purple-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{s.base}</span>
                        <span className="text-slate-400 text-[10px] font-normal">{s.name}</span>
                      </div>
                      {currentSymbol.symbol === s.symbol && (
                        <Check className="w-3.5 h-3.5 text-pink-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Compact Live Price Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-200/80 rounded-xl text-xs font-mono font-black text-purple-900">
            <span>${formattedPrice}</span>
            <span className={`text-[10px] px-1 rounded ${change24h >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              {change24h >= 0 ? '+' : ''}{change24h.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Action Controls (Right Side - 1 Compact Row) */}
        <div className="flex items-center gap-1.5">
          {/* Timeframe Selector Pills */}
          <div className="flex items-center bg-pink-50/80 p-0.5 rounded-xl border border-pink-200/60 text-xs">
            {(['1m', '3m', '5m'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => onSelectTimeframe(tf)}
                className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-all ${
                  timeframe === tf
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm'
                    : 'text-purple-700 hover:text-pink-600'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Model Calibration Modal Button */}
          {onOpenCalibration && (
            <button
              onClick={onOpenCalibration}
              className="p-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold text-xs transition-all shadow-sm"
              title="Model Kalibrasyon"
            >
              <Target className="w-4 h-4 text-purple-600" />
            </button>
          )}

          {/* Audio Alert Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Sesli Uyarı Açık' : 'Sesli Uyarı Kapalı'}
            className={`p-1.5 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-pink-100 border-pink-300 text-pink-700'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* AI Gemini Deep Reasoning Button */}
          <button
            onClick={onTriggerAiReasoning}
            disabled={isAiLoading}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-pink-200 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isAiLoading ? 'Analiz...' : 'AI Analiz'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
