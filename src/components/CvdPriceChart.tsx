import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { Candle, CryptoSymbol } from '../types';

interface CvdPriceChartProps {
  candles: Candle[];
  currentSymbol: CryptoSymbol;
}

export const CvdPriceChart: React.FC<CvdPriceChartProps> = ({ candles, currentSymbol }) => {
  if (!candles || candles.length === 0) {
    return (
      <div className="h-72 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 text-xs">
        Grafik yükleniyor...
      </div>
    );
  }

  // Compute CVD running values & EMAs for chart display
  let runningCvd = 0;
  const chartData = candles.slice(-40).map((c) => {
    const delta = c.buyVolume - c.sellVolume;
    runningCvd += delta;
    const dateStr = new Date(c.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return {
      time: dateStr,
      timestamp: c.time,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
      volume: c.volume,
      delta,
      cvd: runningCvd,
      isUp: c.close >= c.open,
    };
  });

  const minPrice = Math.min(...chartData.map((d) => d.low));
  const maxPrice = Math.max(...chartData.map((d) => d.high));
  const priceMargin = (maxPrice - minPrice) * 0.15 || 10;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <h3 className="text-sm font-black text-slate-100 uppercase tracking-tight">
            Fiyat & CVD (Cumulative Volume Delta) Canlı Grafik
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Fiyat Kapanış
          </span>
          <span className="flex items-center gap-1.5 text-purple-400">
            <span className="w-2 h-2 rounded-full bg-purple-400" /> CVD Çizgisi
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-400" /> Hacim Deltası
          </span>
        </div>
      </div>

      {/* Dual Pane Layout */}
      <div className="space-y-4">
        {/* Pane 1: Live Price Chart */}
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis
                domain={[minPrice - priceMargin, maxPrice + priceMargin]}
                stroke="#64748b"
                fontSize={10}
                orientation="right"
                tickFormatter={(v) => v.toFixed(currentSymbol.decimals)}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px' }}
                formatter={(val: any, name: any) => [
                  typeof val === 'number' ? val.toFixed(currentSymbol.decimals) : val,
                  name === 'close' ? 'Fiyat' : name
                ]}
              />
              <Line
                type="monotone"
                dataKey="close"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, fill: '#34d399' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Pane 2: CVD Line & Volume Delta Bar Chart */}
        <div className="h-32 w-full border-t border-slate-800/80 pt-2">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Kumülatif Hacim Deltası (CVD & Taker Imbalance)
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="time" hide />
              <YAxis orientation="right" stroke="#64748b" fontSize={9} />
              <Tooltip
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#1e293b', borderRadius: '12px', fontSize: '11px' }}
                formatter={(val: any, name: any) => [
                  typeof val === 'number' ? val.toFixed(1) : val,
                  name === 'cvd' ? 'CVD Kumülatif' : name === 'delta' ? 'Mum Deltası' : name
                ]}
              />
              <Bar dataKey="delta">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.delta >= 0 ? '#10b981' : '#f43f5e'}
                    opacity={0.6}
                  />
                ))}
              </Bar>
              <Line
                type="monotone"
                dataKey="cvd"
                stroke="#c084fc"
                strokeWidth={2.5}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
