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
      <div className="h-64 bg-white/80 border border-pink-200 rounded-3xl flex items-center justify-center text-purple-600 text-xs font-bold">
        Grafik yükleniyor...
      </div>
    );
  }

  // Compute CVD running values for chart display
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
    <div className="bg-white/90 border border-pink-200/80 rounded-3xl p-4 shadow-sm shadow-pink-100/50">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-pink-100 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-lg">📈</span>
          <h3 className="text-xs font-black text-purple-950 uppercase tracking-tight">
            Fiyat & CVD (Cumulative Volume Delta) Canlı Grafik
          </h3>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-bold">
          <span className="flex items-center gap-1 text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Fiyat
          </span>
          <span className="flex items-center gap-1 text-purple-700">
            <span className="w-2 h-2 rounded-full bg-purple-500" /> CVD Çizgisi
          </span>
        </div>
      </div>

      {/* Dual Pane Layout */}
      <div className="space-y-3">
        {/* Pane 1: Live Price Chart */}
        <div className="h-48 w-full min-h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="time" stroke="#a21caf" fontSize={10} tickLine={false} />
              <YAxis
                domain={[minPrice - priceMargin, maxPrice + priceMargin]}
                stroke="#a21caf"
                fontSize={10}
                orientation="right"
                tickFormatter={(v) => v.toFixed(currentSymbol.decimals)}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#fbcfe8', borderRadius: '16px', fontSize: '11px', color: '#1e1b4b', boxShadow: '0 10px 15px -3px rgba(244, 114, 182, 0.2)' }}
                formatter={(val: any, name: any) => [
                  typeof val === 'number' ? val.toFixed(currentSymbol.decimals) : val,
                  name === 'close' ? 'Fiyat' : name
                ]}
              />
              <Line
                type="monotone"
                dataKey="close"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#059669' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Pane 2: CVD Line & Volume Delta Bar Chart */}
        <div className="h-28 w-full min-h-[100px] border-t border-pink-100 pt-2">
          <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-1">
            Kumülatif Hacim Deltası (CVD)
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="time" hide />
              <YAxis orientation="right" stroke="#a21caf" fontSize={9} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#fbcfe8', borderRadius: '16px', fontSize: '11px', color: '#1e1b4b' }}
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
                    opacity={0.7}
                  />
                ))}
              </Bar>
              <Line
                type="monotone"
                dataKey="cvd"
                stroke="#a855f7"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
