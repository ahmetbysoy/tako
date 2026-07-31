import React, { useState } from 'react';
import { History, CheckCircle2, XCircle, Trash2, Zap, Trophy } from 'lucide-react';
import { BacktestRecord, DecisionSignal, CryptoSymbol } from '../types';

interface BacktestJournalProps {
  records: BacktestRecord[];
  onClearHistory: () => void;
  signal?: DecisionSignal | null;
  currentSymbol?: CryptoSymbol;
  price?: number;
}

export const BacktestJournal: React.FC<BacktestJournalProps> = ({
  records,
  onClearHistory,
  signal,
  currentSymbol,
  price,
}) => {
  const [streakCount, setStreakCount] = useState<number>(0);
  const [simMessage, setSimMessage] = useState<string | null>(null);

  const total = records.length;
  const wins = records.filter((r) => r.status === 'WIN').length;
  const losses = records.filter((r) => r.status === 'LOSS').length;
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : '0.0';

  // Interactive 1-Tap Virtual Trade Simulator
  const handleVirtualTrade = (dir: 'LONG' | 'SHORT') => {
    if (!signal || !price || !currentSymbol) return;

    const isWin = Math.random() < (signal.longProbability / 100);
    if (isWin) {
      setStreakCount((prev) => prev + 1);
      setSimMessage(`🎉 Tebrikler! Virtual ${dir} işlemi %0.35 kar ile kapandı! (+1 Galibiyet Serisi)`);
    } else {
      setStreakCount(0);
      setSimMessage(`💔 Ah! Market ters yöne kırıldı. Stop Loss çalıştı (-%0.20).`);
    }

    setTimeout(() => {
      setSimMessage(null);
    }, 4000);
  };

  return (
    <div className="bg-white/90 border border-pink-200/80 rounded-3xl p-4 shadow-sm shadow-pink-100/50 space-y-3">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-100 pb-2.5">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-pink-600" />
          <h3 className="text-xs font-black text-purple-950 uppercase tracking-tight">
            60s Sinyal Geçmişi & Backtest Günlüğü
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <div className="bg-pink-50 px-2.5 py-1 rounded-xl border border-pink-200 text-purple-900">
            Kayıt: <span className="text-pink-600 font-extrabold">{total}</span>
          </div>
          <div className="bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 text-emerald-800">
            Win Rate: <span className="font-black">%{winRate}</span> ({wins}W / {losses}L)
          </div>
          {total > 0 && (
            <button
              onClick={onClearHistory}
              className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
              title="Geçmişi Temizle"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Gamified 1-Tap Test Scalp Simulator Box */}
      <div className="p-3 bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 rounded-2xl border border-pink-200 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />
          <div>
            <span className="text-xs font-black text-purple-950 block">🎮 Tako Sanal Scalp Simülatörü</span>
            <span className="text-[10px] text-purple-700 font-semibold">Sanal işlem açıp sinyal isabetini anında test et!</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-black text-purple-900 bg-white px-2 py-1 rounded-xl border border-pink-200">
            🔥 Seri: <span className="text-pink-600 font-extrabold">{streakCount} W</span>
          </div>
          <button
            onClick={() => handleVirtualTrade('LONG')}
            className="px-2.5 py-1 text-xs font-black bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-xs active:scale-95 transition-all"
          >
            🚀 Long Test
          </button>
          <button
            onClick={() => handleVirtualTrade('SHORT')}
            className="px-2.5 py-1 text-xs font-black bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-xs active:scale-95 transition-all"
          >
            🔻 Short Test
          </button>
        </div>
      </div>

      {simMessage && (
        <div className="p-2 rounded-xl text-xs font-bold bg-purple-100 border border-purple-300 text-purple-900 animate-in fade-in duration-200">
          {simMessage}
        </div>
      )}

      {/* Sinyal Geçmişi Listesi */}
      <div className="max-h-52 overflow-y-auto space-y-1.5 custom-scrollbar pr-1 text-xs font-mono">
        {records.length === 0 ? (
          <div className="text-center text-purple-400 text-xs py-6 italic font-sans font-bold">
            Henüz sinyal geçmişi yok. Karar motoru her 60s otomatik kaydeder. 🐙
          </div>
        ) : (
          records.map((r) => {
            const timeStr = new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const isWin = r.status === 'WIN';
            const isLoss = r.status === 'LOSS';

            return (
              <div
                key={r.id}
                className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                  isWin
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : isLoss
                    ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                    : 'bg-purple-50/50 border-purple-200 text-purple-950'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[10px]">{timeStr}</span>
                  <span className="font-extrabold text-slate-900">{r.symbol}</span>
                  <span
                    className={`font-black px-1.5 py-0.5 rounded text-[10px] ${
                      r.signalDirection === 'LONG'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : r.signalDirection === 'SHORT'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {r.signalDirection} %{r.probability}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span>Giriş: ${r.entryPrice}</span>
                  <span className="flex items-center gap-1 font-bold">
                    {isWin && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {isLoss && <XCircle className="w-4 h-4 text-rose-600" />}
                    {r.status === 'PENDING' && (
                      <span className="text-amber-600 text-[10px] font-extrabold animate-pulse">
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
