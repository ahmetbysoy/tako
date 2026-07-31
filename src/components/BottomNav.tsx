import React from 'react';
import { Target, Cpu, LineChart, Wallet, BookOpen, Sparkles, LayoutGrid, Play } from 'lucide-react';
import { ThemeMode } from '../types';

export type AppTab = 'signal' | 'radar' | 'paper' | 'engines' | 'charts' | 'whales' | 'journal';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  signalDirection?: 'LONG' | 'SHORT' | 'NEUTRAL';
  onTriggerAi?: () => void;
  isAiLoading?: boolean;
  theme: ThemeMode;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  signalDirection,
  onTriggerAi,
  isAiLoading,
  theme,
}) => {
  const isDark = theme === 'dark';

  const tabs: { id: AppTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'signal',
      label: 'Sinyal',
      icon: <Target className="w-4 h-4 shrink-0" />,
      badge: signalDirection,
    },
    {
      id: 'radar',
      label: 'Radar',
      icon: <LayoutGrid className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'paper',
      label: 'Paper',
      icon: <Play className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'engines',
      label: '10 Motor',
      icon: <Cpu className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'charts',
      label: 'Grafik',
      icon: <LineChart className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'whales',
      label: 'Balina',
      icon: <Wallet className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'journal',
      label: 'Günlük',
      icon: <BookOpen className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <nav className={`fixed bottom-0 inset-x-0 z-40 p-1.5 sm:p-2 backdrop-blur-xl border-t shadow-xl transition-all max-w-full overflow-hidden ${
      isDark ? 'bg-slate-950/95 border-slate-800 shadow-slate-950/80 text-slate-100' : 'bg-white/95 border-pink-200 shadow-pink-200/50 text-slate-800'
    }`}>
      <div className="max-w-xl mx-auto flex items-center justify-between gap-1 overflow-x-auto no-scrollbar scroll-smooth px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-1.5 min-w-[42px] sm:min-w-[48px] min-h-[40px] rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black transition-all duration-200 select-none shrink-0 ${
                isActive
                  ? (isDark ? 'text-pink-400 bg-slate-800 border border-slate-700 shadow-sm scale-105' : 'text-pink-700 bg-pink-100 border border-pink-300 shadow-sm scale-105')
                  : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-pink-600')
              }`}
            >
              {/* Active Indicator Dot */}
              {isActive && (
                <span className="absolute -top-1 w-1.5 h-1.5 bg-pink-500 rounded-full shadow-sm animate-ping" />
              )}
              
              <div className="relative">
                {tab.icon}
                {tab.badge && tab.badge !== 'NEUTRAL' && (
                  <span
                    className={`absolute -top-1 -right-1.5 w-2 h-2 rounded-full border ${
                      tab.badge === 'LONG' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                )}
              </div>
              <span className="tracking-tight mt-0.5 whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}

        {/* AI Quick Floating Button */}
        {onTriggerAi && (
          <button
            onClick={onTriggerAi}
            disabled={isAiLoading}
            className="flex flex-col items-center justify-center py-1 px-1.5 min-w-[40px] sm:min-w-[44px] min-h-[40px] rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 shadow-md transition-all active:scale-95 disabled:opacity-50 shrink-0"
            title="Gemini AI Otonom Analiz"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : 'animate-bounce'}`} />
            <span className="tracking-tight mt-0.5">AI</span>
          </button>
        )}
      </div>
    </nav>
  );
};
