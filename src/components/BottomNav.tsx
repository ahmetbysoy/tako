import React from 'react';
import { Target, Cpu, LineChart, Wallet, BookOpen, Sparkles } from 'lucide-react';

export type AppTab = 'signal' | 'engines' | 'charts' | 'whales' | 'journal';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  signalDirection?: 'LONG' | 'SHORT' | 'NEUTRAL';
  onTriggerAi?: () => void;
  isAiLoading?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  signalDirection,
  onTriggerAi,
  isAiLoading,
}) => {
  const tabs: { id: AppTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'signal',
      label: 'Sinyal',
      icon: <Target className="w-5 h-5" />,
      badge: signalDirection,
    },
    {
      id: 'engines',
      label: '10 Motor',
      icon: <Cpu className="w-5 h-5" />,
    },
    {
      id: 'charts',
      label: 'Grafik',
      icon: <LineChart className="w-5 h-5" />,
    },
    {
      id: 'whales',
      label: 'Balina',
      icon: <Wallet className="w-5 h-5" />,
    },
    {
      id: 'journal',
      label: 'Günlük',
      icon: <BookOpen className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 p-2 sm:p-3 bg-slate-900/95 backdrop-blur-xl border-t border-pink-500/20 shadow-2xl shadow-pink-950/40">
      <div className="max-w-md mx-auto flex items-center justify-around gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 min-w-[56px] min-h-[44px] rounded-xl text-xs font-semibold transition-all duration-200 select-none ${
                isActive
                  ? 'text-pink-300 bg-pink-500/15 border border-pink-500/40 shadow-lg shadow-pink-500/10 scale-105'
                  : 'text-slate-400 hover:text-pink-300 hover:bg-slate-800/60'
              }`}
            >
              {/* Active Indicator Dot */}
              {isActive && (
                <span className="absolute -top-1 w-2 h-2 bg-pink-400 rounded-full shadow-sm shadow-pink-400 animate-pulse" />
              )}
              
              <div className="relative">
                {tab.icon}
                {tab.badge && tab.badge !== 'NEUTRAL' && (
                  <span
                    className={`absolute -top-1 -right-2 w-2 h-2 rounded-full border border-slate-900 ${
                      tab.badge === 'LONG' ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1">{tab.label}</span>
            </button>
          );
        })}

        {/* AI Quick Button on Floating Dock */}
        {onTriggerAi && (
          <button
            onClick={onTriggerAi}
            disabled={isAiLoading}
            className="flex flex-col items-center justify-center py-1.5 px-3 min-w-[52px] min-h-[44px] rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-br from-pink-300 via-rose-300 to-pink-400 hover:from-pink-200 hover:to-rose-300 shadow-md shadow-pink-500/20 transition-all active:scale-95 disabled:opacity-50"
            title="Gemini AI Otonom Analiz"
          >
            <Sparkles className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : 'animate-bounce'}`} />
            <span className="text-[9px] tracking-tight mt-0.5 font-extrabold">AI</span>
          </button>
        )}
      </div>
    </nav>
  );
};
