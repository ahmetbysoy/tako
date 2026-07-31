import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine
} from 'recharts';
import { Candle, CryptoSymbol, DecisionSignal, ThemeMode } from '../types';

interface CvdPriceChartProps {
  candles: Candle[];
  currentSymbol: CryptoSymbol;
  signal?: DecisionSignal | null;
  theme?: ThemeMode;
}

export const CvdPriceChart: React.FC<CvdPriceChartProps> = ({
  candles,
  currentSymbol,
  signal,
  theme = 'pastel',
}) => {
  const isDark = theme === 'dark';

  if (!candles || candles.length === 0) {
    return (
      <div className={`h-64 rounded-3xl border flex items-center justify-center text-xs font-bold ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white/80 border-pink-200 text-purple-600'
      }`}>
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

  const rawPrices = chartData.map((d) => d.close);
  if (signal) {
    if (signal.tpPrice) rawPrices.push(signal.tpPrice);
    if (signal.slPrice) rawPrices.push(signal.slPrice);
    if (signal.targetMagnet) rawPrices.push(signal.targetMagnet);
  }

  const minPrice = Math.min(...rawPrices);
  const maxPrice = Math.max(...rawPrices);
  const priceMargin = (maxPrice - minPrice) * 0.15 || 10;

  return (
    <div className={`rounded-3xl p-3.5 sm:p-4 shadow-sm border transition-all max-w-full overflow-hidden ${
      isDark
        ? 'bg-slate-900/90 border-slate-800 text-slate-100 shadow-slate-950/50'
        : 'bg-white/90 border-pink-200/80 text-slate-800 shadow-pink-100/50'
    }`}>
      {/* Header & Chart Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b pb-2.5 border-inherit">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg">📈</span>
          <h3 className={`text-xs font-black uppercase tracking-tight truncate ${isDark ? 'text-slate-100' : 'text-purple-950'}`}>
            Akıllı Fiyat Grafiği & AI Seviyeleri (TP / SL / Mıknatıs)
          </h3>
        </div>

        {/* AI Level Legend Badges */}
        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black flex-wrap">
          {signal && (
            <>
              <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                🟢 TP: ${signal.tpPrice.toLocaleString(undefined, { minimumFractionDigits: currentSymbol.decimals })}
              </span>
              <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                🔴 SL: ${signal.slPrice.toLocaleString(undefined, { minimumFractionDigits: currentSymbol.decimals })}
              </span>
              <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 hidden xs:inline-flex">
                🧲 Mıknatıs: ${signal.targetMagnet.toLocaleString(undefined, { minimumFractionDigits: currentSymbol.decimals })}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Dual Pane Layout */}
      <div className="space-y-3 max-w-full">
        {/* Pane 1: Live Price Chart with AI Reference Lines */}
        <div className="h-52 w-full min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="time" stroke={isDark ? '#64748b' : '#a21caf'} fontSize={10} tickLine={false} />
              <YAxis
                domain={[minPrice - priceMargin, maxPrice + priceMargin]}
                stroke={isDark ? '#64748b' : '#a21caf'}
                fontSize={10}
                orientation="right"
                tickFormatter={(v) => v.toFixed(currentSymbol.decimals)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#090d16' : '#ffffff',
                  borderColor: isDark ? '#334155' : '#fbcfe8',
                  borderRadius: '16px',
                  fontSize: '11px',
                  color: isDark ? '#f8fafc' : '#1e1b4b',
                  boxShadow: '0 10px 15px -3px rgba(244, 114, 182, 0.2)'
                }}
                formatter={(val: any, name: any) => [
                  typeof val === 'number' ? val.toFixed(currentSymbol.decimals) : val,
                  name === 'close' ? 'Fiyat' : name
                ]}
              />

              {/* Live Price Line */}
              <Line
                type="monotone"
                dataKey="close"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#059669' }}
              />

              {/* AI Reference Lines on Chart */}
              {signal && (
                <>
                  {/* Take Profit (TP) Level */}
                  <ReferenceLine
                    y={signal.tpPrice}
                    stroke="#10b981"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    label={{
                      value: `🟢 TP: $${signal.tpPrice}`,
                      fill: '#059669',
                      fontSize: 10,
                      position: 'insideTopRight',
                    }}
                  />

                  {/* Entry Price Level */}
                  <ReferenceLine
                    y={signal.entryPrice}
                    stroke="#a855f7"
                    strokeWidth={1.5}
                    strokeDasharray="2 2"
                    label={{
                      value: `🎯 Giriş: $${signal.entryPrice}`,
                      fill: '#9333ea',
                      fontSize: 10,
                      position: 'insideTopLeft',
                    }}
                  />

                  {/* Stop Loss (SL) Level */}
                  <ReferenceLine
                    y={signal.slPrice}
                    stroke="#f43f5e"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    label={{
                      value: `🔴 SL: $${signal.slPrice}`,
                      fill: '#e11d48',
                      fontSize: 10,
                      position: 'insideBottomRight',
                    }}
                  />

                  {/* Liquidation Magnet Target */}
                  {signal.targetMagnet && (
                    <ReferenceLine
                      y={signal.targetMagnet}
                      stroke="#f59e0b"
                      strokeWidth={1}
                      strokeDasharray="6 6"
                      label={{
                        value: `🧲 Mıknatıs: $${signal.targetMagnet}`,
                        fill: '#d97706',
                        fontSize: 9,
                        position: 'insideBottomLeft',
                      }}
                    />
                  )}
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Pane 2: CVD Line & Volume Delta Bar Chart */}
        <div className="h-24 w-full min-h-[90px] border-t pt-2 border-inherit">
          <div className="text-[10px] font-bold uppercase tracking-wider mb-1 text-purple-700 dark:text-slate-400">
            Kumülatif Hacim Deltası (CVD)
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="time" hide />
              <YAxis orientation="right" stroke={isDark ? '#64748b' : '#a21caf'} fontSize={9} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#090d16' : '#ffffff',
                  borderColor: isDark ? '#334155' : '#fbcfe8',
                  borderRadius: '16px',
                  fontSize: '11px',
                  color: isDark ? '#f8fafc' : '#1e1b4b'
                }}
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
