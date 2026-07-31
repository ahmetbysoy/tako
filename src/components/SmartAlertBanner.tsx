import React from 'react';
import { AlertTriangle, Bell, Zap, X } from 'lucide-react';
import { SmartAlert, ThemeMode } from '../types';

interface SmartAlertBannerProps {
  alerts: SmartAlert[];
  onDismissAlert: (id: string) => void;
  theme: ThemeMode;
}

export const SmartAlertBanner: React.FC<SmartAlertBannerProps> = ({
  alerts,
  onDismissAlert,
  theme,
}) => {
  if (!alerts || alerts.length === 0) return null;

  const isDark = theme === 'dark';

  return (
    <div className="space-y-2 mb-3 animate-in fade-in slide-in-from-top duration-300">
      {alerts.map((a) => (
        <div
          key={a.id}
          className={`p-3 rounded-2xl border flex items-center justify-between gap-3 shadow-md ${
            a.type === 'SQUEEZE_CASCADE'
              ? (isDark ? 'bg-rose-950/90 border-rose-500/50 text-rose-200' : 'bg-rose-100 border-rose-300 text-rose-900')
              : a.type === 'SCORE_FLIP'
              ? (isDark ? 'bg-purple-950/90 border-purple-500/50 text-purple-200' : 'bg-purple-100 border-purple-300 text-purple-900')
              : (isDark ? 'bg-amber-950/90 border-amber-500/50 text-amber-200' : 'bg-amber-100 border-amber-300 text-amber-900')
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-white/80 shrink-0">
              {a.type === 'SCORE_FLIP' ? (
                <Zap className="w-4 h-4 text-purple-600 animate-bounce" />
              ) : a.type === 'WHALE_WALL' ? (
                <Bell className="w-4 h-4 text-amber-600 animate-pulse" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 animate-ping" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 font-black text-xs">
                <span>{a.title}</span>
                <span className="text-[10px] opacity-75 font-mono">
                  [{new Date(a.timestamp).toLocaleTimeString()}]
                </span>
              </div>
              <p className="text-[11px] font-semibold opacity-90 mt-0.5">{a.description}</p>
            </div>
          </div>

          <button
            onClick={() => onDismissAlert(a.id)}
            className="p-1 rounded-lg bg-black/10 hover:bg-black/20 transition-all text-current shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
