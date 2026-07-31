import React, { useState } from 'react';
import {
  Activity,
  BarChart2,
  TrendingUp,
  Zap,
  ShieldCheck,
  Flame,
  Gauge,
  Sliders,
  Sparkles,
  Info,
  Compass,
  Globe
} from 'lucide-react';
import { EngineScore } from '../types';

interface EnginesGridProps {
  engineScores: Record<string, EngineScore>;
}

const ENGINE_ICONS: Record<string, React.ReactNode> = {
  price: <TrendingUp className="w-5 h-5 text-emerald-400" />,
  volume: <BarChart2 className="w-5 h-5 text-cyan-400" />,
  orderflow: <Zap className="w-5 h-5 text-amber-400" />,
  cvd: <Activity className="w-5 h-5 text-purple-400" />,
  orderbook: <ShieldCheck className="w-5 h-5 text-teal-400" />,
  openinterest: <Flame className="w-5 h-5 text-rose-400" />,
  liquidation: <Gauge className="w-5 h-5 text-orange-400" />,
  trend: <Sliders className="w-5 h-5 text-indigo-400" />,
  oscillator: <Sparkles className="w-5 h-5 text-blue-400" />,
  options: <Compass className="w-5 h-5 text-pink-400" />,
  hyperliquid: <Globe className="w-5 h-5 text-cyan-300" />,
};

export const EnginesGrid: React.FC<EnginesGridProps> = ({ engineScores }) => {
  const [activeTelemetry, setActiveTelemetry] = useState<EngineScore | null>(null);

  const engineList: EngineScore[] = Object.values(engineScores);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <h2 className="text-base font-black tracking-tight text-slate-100 uppercase">
            10 Analiz Motoru Canlı Telemetri
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Her motor anlık -20 ile +20 puan arası katma değer üretir
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {engineList.map((engine) => {
          const isBullish = engine.status === 'BULLISH';
          const isBearish = engine.status === 'BEARISH';

          // Progress bar percentage (-20 to +20 mapped to 0% to 100%)
          const barPct = Math.min(100, Math.max(0, ((engine.score + 20) / 40) * 100));

          return (
            <div
              key={engine.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all duration-200 shadow-lg relative group"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    {ENGINE_ICONS[engine.id] || <Activity className="w-5 h-5 text-emerald-400" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-100">
                      {engine.nameTr}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {engine.name}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black font-mono border ${
                      engine.score > 0
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                        : engine.score < 0
                        ? 'bg-rose-950/80 text-rose-300 border-rose-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {engine.score > 0 ? `+${engine.score}` : engine.score} Puan
                  </span>
                </div>
              </div>

              {/* Progress Meter Bar */}
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 my-2">
                <div
                  className={`h-full transition-all duration-300 ${
                    isBullish
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-400'
                      : isBearish
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500'
                      : 'bg-slate-600'
                  }`}
                  style={{ width: `${barPct}%` }}
                />
              </div>

              {/* Detail Text */}
              <p className="text-xs text-slate-300 font-medium truncate mb-3">
                {engine.detail}
              </p>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                {Object.entries(engine.metrics).map(([k, v]) => (
                  <div key={k} className="bg-slate-950/60 px-2 py-1 rounded border border-slate-800/60">
                    <span className="text-slate-500 block text-[9px] uppercase">{k}</span>
                    <span className="font-bold text-slate-200">{v}</span>
                  </div>
                ))}
              </div>

              {/* Data Provenance Verification Tag */}
              {engine.sourceTag && (
                <div className="mt-2 text-[9px] font-mono flex items-center justify-between border-t border-slate-800/40 pt-1.5">
                  <span className="truncate text-slate-500">Kaynak: {engine.sourceTag}</span>
                  <span className={`shrink-0 font-bold px-1.5 py-0.2 rounded text-[8px] ${
                    engine.sourceTag.includes('Simul') || engine.sourceTag.includes('Deriv')
                      ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                      : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                  }`}>
                    {engine.sourceTag.includes('Simul') || engine.sourceTag.includes('Deriv') ? 'DERIVED' : 'LIVE WS'}
                  </span>
                </div>
              )}

              {/* Telemetry Info Button */}
              <button
                onClick={() => setActiveTelemetry(engine)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-emerald-400 transition-opacity"
                title="Formül ve Detay"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Telemetry Popover Modal */}
      {activeTelemetry && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveTelemetry(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 font-bold"
            >
              ✕
            </button>
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-4">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                {ENGINE_ICONS[activeTelemetry.id]}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-100">
                  {activeTelemetry.nameTr}
                </h3>
                <span className="text-xs text-slate-400">
                  Formül & Telemetri Mantığı
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {activeTelemetry.detail}
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-emerald-400 font-bold">Ağırlık: %{(activeTelemetry.weight * 100).toFixed(0)}</div>
              <div className="text-slate-300">Anlık Puan: {activeTelemetry.score} / ±20</div>
            </div>

            <button
              onClick={() => setActiveTelemetry(null)}
              className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
