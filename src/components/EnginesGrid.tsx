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
  price: <TrendingUp className="w-4 h-4 text-pink-600" />,
  volume: <BarChart2 className="w-4 h-4 text-purple-600" />,
  orderflow: <Zap className="w-4 h-4 text-amber-600" />,
  cvd: <Activity className="w-4 h-4 text-indigo-600" />,
  orderbook: <ShieldCheck className="w-4 h-4 text-teal-600" />,
  openinterest: <Flame className="w-4 h-4 text-rose-600" />,
  liquidation: <Gauge className="w-4 h-4 text-orange-600" />,
  trend: <Sliders className="w-4 h-4 text-blue-600" />,
  oscillator: <Sparkles className="w-4 h-4 text-purple-600" />,
  options: <Compass className="w-4 h-4 text-pink-600" />,
  hyperliquid: <Globe className="w-4 h-4 text-cyan-600" />,
};

export const EnginesGrid: React.FC<EnginesGridProps> = ({ engineScores }) => {
  const [activeTelemetry, setActiveTelemetry] = useState<EngineScore | null>(null);

  const engineList: EngineScore[] = Object.values(engineScores);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐙</span>
          <h2 className="text-sm font-black tracking-tight text-purple-950 uppercase">
            10 Ahtapot Dokunaç Motoru (Telemetri)
          </h2>
        </div>
        <span className="text-xs text-purple-700 font-bold bg-pink-100 px-2.5 py-0.5 rounded-full border border-pink-200">
          -20 ila +20 Puan
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {engineList.map((engine) => {
          const isBullish = engine.status === 'BULLISH';
          const isBearish = engine.status === 'BEARISH';

          // Progress bar percentage (-20 to +20 mapped to 0% to 100%)
          const barPct = Math.min(100, Math.max(0, ((engine.score + 20) / 40) * 100));

          return (
            <div
              key={engine.id}
              className="bg-white/90 border border-pink-200/80 hover:border-pink-300 rounded-2xl p-3.5 transition-all duration-200 shadow-xs relative group"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-pink-50 border border-pink-200">
                    {ENGINE_ICONS[engine.id] || <Activity className="w-4 h-4 text-pink-600" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900">
                      {engine.nameTr}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {engine.name}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-black font-mono border ${
                      engine.score > 0
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : engine.score < 0
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}
                  >
                    {engine.score > 0 ? `+${engine.score}` : engine.score} Puan
                  </span>
                </div>
              </div>

              {/* Progress Meter Bar */}
              <div className="w-full bg-pink-50/80 h-2.5 rounded-full overflow-hidden border border-pink-200/80 my-2 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isBullish
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                      : isBearish
                      ? 'bg-gradient-to-r from-rose-400 to-pink-500'
                      : 'bg-purple-300'
                  }`}
                  style={{ width: `${barPct}%` }}
                />
              </div>

              {/* Detail Text */}
              <p className="text-[11px] text-slate-600 font-medium truncate mb-2">
                {engine.detail}
              </p>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-pink-100 text-[10px]">
                {Object.entries(engine.metrics).map(([k, v]) => (
                  <div key={k} className="bg-pink-50/40 px-2 py-1 rounded-lg border border-pink-100">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">{k}</span>
                    <span className="font-extrabold text-purple-950">{v}</span>
                  </div>
                ))}
              </div>

              {/* Telemetry Info Button */}
              <button
                onClick={() => setActiveTelemetry(engine)}
                className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 text-purple-400 hover:text-pink-600 transition-opacity"
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
        <div className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-pink-200 rounded-3xl max-w-md w-full p-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setActiveTelemetry(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 font-bold"
            >
              ✕
            </button>
            <div className="flex items-center gap-2.5 border-b border-pink-100 pb-3 mb-3">
              <div className="p-2 rounded-xl bg-pink-50 border border-pink-200">
                {ENGINE_ICONS[activeTelemetry.id]}
              </div>
              <div>
                <h3 className="text-base font-black text-purple-950">
                  {activeTelemetry.nameTr}
                </h3>
                <span className="text-xs text-purple-600 font-medium">
                  Ahtapot Motor Mantığı
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed mb-4">
              {activeTelemetry.detail}
            </p>

            <div className="bg-pink-50/80 p-3 rounded-2xl border border-pink-200 text-xs font-mono space-y-1">
              <div className="text-pink-700 font-bold">Ağırlık: %{(activeTelemetry.weight * 100).toFixed(0)}</div>
              <div className="text-purple-900 font-bold">Anlık Puan: {activeTelemetry.score} / ±20</div>
            </div>

            <button
              onClick={() => setActiveTelemetry(null)}
              className="w-full mt-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-black text-xs rounded-xl shadow-md"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
