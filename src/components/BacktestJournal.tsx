import React from 'react';
import { History, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { BacktestRecord } from '../types';

interface BacktestJournalProps {
  records: BacktestRecord[];
  onClearHistory: () => void;
}

export const BacktestJournal: React.FC<BacktestJournalProps> = ({
  records,
  onClearHistory,
}) => {
  const total = records.length;
  const wins = records.filter((r) => r.status === 'WIN').length;
  const losses = records.filter((r) => r.status === 'LOSS').length;
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-black text-slate-100 uppercase tracking-tight">
            60s Sinyal Geçmişi & Backtest Günlüğü
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 text-slate-300">
            Toplam: <span className="text-slate-100">{total}</span>
          </div>
          <div className="bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-500/30 text-emerald-300">
            Win Rate: <span className="font-extrabold">{winRate}%</span> ({wins}W / {losses}L)
          </div>
          {total > 0 && (
            <button
              onClick={onClearHistory}
              className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
              title="Geçmişi Temizle"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="max-h-56 overflow-y-auto space-y-2 custom-scrollbar pr-1 text-xs font-mono">
        {records.length === 0 ? (
          <div className="text-center text-slate-500 text-xs py-8 italic">
            Henüz sinyal geçmişi yok. Karar motoru otomatik olarak 60s sinyallerini test edecektir.
          </div>
        ) : (
          records.map((r) => {
            const timeStr = new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const isWin = r.status === 'WIN';
            const isLoss = r.status === 'LOSS';

            return (
              <div
                key={r.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                  isWin
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                    : isLoss
                    ? 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-[10px]">{timeStr}</span>
                  <span className="font-bold text-slate-100">{r.symbol}</span>
                  <span
                    className={`font-black px-2 py-0.5 rounded text-[10px] ${
                      r.signalDirection === 'LONG'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        : r.signalDirection === 'SHORT'
                        ? 'bg-rose-950 text-rose-400 border border-rose-500/40'
                        : 'bg-slate-800 text-amber-300'
                    }`}
                  >
                    {r.signalDirection} %{r.probability}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span>Giriş: ${r.entryPrice}</span>
                  {r.actualClosePrice60s && (
                    <span>Sonuç (60s): ${r.actualClosePrice60s}</span>
                  )}
                  <span className="flex items-center gap-1 font-bold">
                    {isWin && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {isLoss && <XCircle className="w-4 h-4 text-rose-400" />}
                    {r.status === 'PENDING' && (
                      <span className="text-amber-400 text-[10px] animate-pulse">
                        Bekliyor (60s)...
                      </span>
                    )}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
