import React, { useState } from 'react';
import {
  Zap,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  Search,
  Check
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
}

export const Header: React.FC<HeaderProps> = ({
  currentSymbol,
  onSelectSymbol,
  symbols,
  timeframe,
  onSelectTimeframe,
  isLive,
  isFallback,
  soundEnabled,
  onToggleSound,
  onTriggerAiReasoning,
  isAiLoading,
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

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/40">
            <Zap className="w-6 h-6 fill-slate-950 stroke-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400 bg-clip-text text-transparent">
                60s ALPHA ENGINE
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                Karar Motoru v3.2
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Sub-second High-Frequency Trading & 10-Engine Terminal
            </p>
          </div>
        </div>

        {/* Symbol Dropdown & Timeframe Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Symbol Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 text-slate-100 px-3.5 py-1.5 rounded-xl font-bold text-sm transition-all shadow-inner"
            >
              <span className="text-emerald-400 font-extrabold">{currentSymbol.base}</span>
              <span className="text-slate-500 text-xs">/ {currentSymbol.quote}</span>
              <span className="text-slate-400 text-xs">▼</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <form onSubmit={handleCustomSubmit} className="mb-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Symbol ara veya yaz (örn: PEPE)"
                      value={customSearch}
                      onChange={(e) => setCustomSearch(e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </form>

                <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {filteredSymbols.map((s) => (
                    <button
                      key={s.symbol}
                      onClick={() => {
                        onSelectSymbol(s);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg font-medium transition-colors ${
                        currentSymbol.symbol === s.symbol
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">{s.base}</span>
                        <span className="text-slate-500 text-[10px]">{s.name}</span>
                      </div>
                      {currentSymbol.symbol === s.symbol && (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timeframe Buttons */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(['1m', '3m', '5m', '15m'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => onSelectTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  timeframe === tf
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf} {tf === '1m' && '⚡ (60s)'}
              </button>
            ))}
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium">
            <Radio className={`w-3.5 h-3.5 ${isLive ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
            <span className={isLive ? 'text-emerald-300' : 'text-amber-300'}>
              {isFallback ? 'REST Polling' : 'Live WS'}
            </span>
          </div>

          {/* Audio Alert Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Sesli Uyarı Açık' : 'Sesli Uyarı Kapalı'}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* AI Gemini Deep Reasoning Button */}
          <button
            onClick={onTriggerAiReasoning}
            disabled={isAiLoading}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 border border-purple-400/30 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? 'AI Analiz Ediyor...' : 'AI Derin Analiz'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
