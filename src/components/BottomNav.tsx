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
      icon: <Target className="w-4 h-4 sm:w-5 sm:h-5" />,
      badge: signalDirection,
    },
    {
      id: 'engines',
      label: '10 Motor',
      icon: <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: 'charts',
      label: 'Grafik',
      icon: <LineChart className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: 'whales',
      label: 'Balina',
      icon: <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: 'journal',
      label: 'Günlük',
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 p-2 bg-white/90 backdrop-blur-xl border-t border-pink-200 shadow-xl shadow-pink-200/50">
      <div className="max-w-md mx-auto flex items-center justify-around gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 min-w-[50px] min-h-[42px] rounded-2xl text-xs font-black transition-all duration-200 select-none ${
                isActive
                  ? 'text-pink-700 bg-pink-100 border border-pink-300 shadow-sm scale-105'
                  : 'text-slate-500 hover:text-pink-600 hover:bg-pink-50/50'
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
                    className={`absolute -top-1 -right-1.5 w-2 h-2 rounded-full border border-white ${
                      tab.badge === 'LONG' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        {/* AI Quick Floating Button */}
        {onTriggerAi && (
          <button
            onClick={onTriggerAi}
            disabled={isAiLoading}
            className="flex flex-col items-center justify-center py-1 px-2.5 min-w-[48px] min-h-[42px] rounded-2xl text-xs font-black text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 shadow-md shadow-pink-200 transition-all active:scale-95 disabled:opacity-50"
            title="Gemini AI Otonom Analiz"
          >
            <Sparkles className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : 'animate-bounce'}`} />
            <span className="text-[9px] tracking-tight mt-0.5">AI</span>
          </button>
        )}
      </div>
    </nav>
  );
};
