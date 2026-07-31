/**
 * 60s Alpha Decision Engine - Tako v4.0 High Frequency Trading Terminal
 * @license Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import {
  CryptoSymbol,
  DecisionSignal,
  OrderBookData,
  Candle,
  TradeTick,
  LiquidationEvent,
  WhaleTrade,
  BacktestRecord,
  ThemeMode,
  PaperAccount,
  PaperPosition,
  SmartAlert,
  SymbolScreenerItem
} from './types';
import { MarketStreamManager } from './lib/websocket';
import { evaluateAllEngines } from './lib/engine';
import { audioSynth } from './lib/audio';

import { Header } from './components/Header';
import { MainDecisionCard } from './components/MainDecisionCard';
import { EnginesGrid } from './components/EnginesGrid';
import { CvdPriceChart } from './components/CvdPriceChart';
import { OrderBookVisualizer } from './components/OrderBookVisualizer';
import { WhaleLiquidationFeed } from './components/WhaleLiquidationFeed';
import { BacktestJournal } from './components/BacktestJournal';
import { GeminiModal } from './components/GeminiModal';
import { CalibrationPanel } from './components/CalibrationPanel';
import { BottomNav, AppTab } from './components/BottomNav';
import { PaperTradingPanel } from './components/PaperTradingPanel';
import { MultiAssetScreener } from './components/MultiAssetScreener';
import { SmartMoneyRadar } from './components/SmartMoneyRadar';
import { SmartAlertBanner } from './components/SmartAlertBanner';

const DEFAULT_SYMBOLS: CryptoSymbol[] = [
  { symbol: 'BTCUSDT', base: 'BTC', quote: 'USDT', name: 'Bitcoin', decimals: 2 },
  { symbol: 'ETHUSDT', base: 'ETH', quote: 'USDT', name: 'Ethereum', decimals: 2 },
  { symbol: 'SOLUSDT', base: 'SOL', quote: 'USDT', name: 'Solana', decimals: 2 },
  { symbol: 'PEPEUSDT', base: 'PEPE', quote: 'USDT', name: 'Pepe', decimals: 8 },
  { symbol: 'DOGEUSDT', base: 'DOGE', quote: 'USDT', name: 'Dogecoin', decimals: 4 },
  { symbol: 'XRPUSDT', base: 'XRP', quote: 'USDT', name: 'Ripple', decimals: 4 },
  { symbol: 'AVAXUSDT', base: 'AVAX', quote: 'USDT', name: 'Avalanche', decimals: 2 },
  { symbol: 'LINKUSDT', base: 'LINK', quote: 'USDT', name: 'Chainlink', decimals: 2 },
  { symbol: 'SUIUSDT', base: 'SUI', quote: 'USDT', name: 'Sui Network', decimals: 4 },
];

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('tako_theme');
      return (saved as ThemeMode) || 'pastel';
    } catch {
      return 'pastel';
    }
  });

  const [currentSymbol, setCurrentSymbol] = useState<CryptoSymbol>(DEFAULT_SYMBOLS[0]);
  const [timeframe, setTimeframe] = useState<'1m' | '3m' | '5m' | '15m'>('1m');

  const [price, setPrice] = useState<number>(98500);
  const [change24h, setChange24h] = useState<number>(2.4);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [orderBook, setOrderBook] = useState<OrderBookData>({
    bids: [],
    asks: [],
    bidTotalNotional: 0,
    askTotalNotional: 0,
    bidRatio: 50,
    askRatio: 50,
    bidWalls: [],
    askWalls: [],
    spoofScore: 12,
    liquidityVoidAbove: null,
    liquidityVoidBelow: null,
  });
  const [trades, setTrades] = useState<TradeTick[]>([]);
  const [whales, setWhales] = useState<WhaleTrade[]>([]);
  const [liquidations, setLiquidations] = useState<LiquidationEvent[]>([]);

  const [signal, setSignal] = useState<DecisionSignal | null>(null);
  const [backtestRecords, setBacktestRecords] = useState<BacktestRecord[]>(() => {
    try {
      const saved = localStorage.getItem('alpha_backtest_records');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // v4.0 Paper Trading State
  const [paperAccount, setPaperAccount] = useState<PaperAccount>(() => {
    try {
      const saved = localStorage.getItem('tako_paper_account');
      return saved ? JSON.parse(saved) : { balanceUsd: 10000, initialBalanceUsd: 10000, realizedPnlUsd: 0, tradesCount: 0, winsCount: 0, lossesCount: 0 };
    } catch {
      return { balanceUsd: 10000, initialBalanceUsd: 10000, realizedPnlUsd: 0, tradesCount: 0, winsCount: 0, lossesCount: 0 };
    }
  });

  const [paperPositions, setPaperPositions] = useState<PaperPosition[]>(() => {
    try {
      const saved = localStorage.getItem('tako_paper_positions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // v4.0 Smart Alerts State
  const [smartAlerts, setSmartAlerts] = useState<SmartAlert[]>([]);

  // v4.0 Screener Items
  const [screenerItems, setScreenerItems] = useState<SymbolScreenerItem[]>([]);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState<boolean>(false);
  const [geminiAnalysis, setGeminiAnalysis] = useState<string | null>(null);
  const [isGeminiLoading, setIsGeminiLoading] = useState<boolean>(false);
  const [isCalibrationOpen, setIsCalibrationOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<AppTab>('signal');
  const [isFullDashboard, setIsFullDashboard] = useState<boolean>(false);

  const streamManagerRef = useRef<MarketStreamManager | null>(null);
  const lastSignalTimeRef = useRef<number>(0);
  const lastScoreRef = useRef<number>(0);
  const pendingSignalsRef = useRef<BacktestRecord[]>([]);

  // Persist theme
  useEffect(() => {
    try {
      localStorage.setItem('tako_theme', theme);
    } catch {
      // Storage error
    }
  }, [theme]);

  // Persist paper trading state
  useEffect(() => {
    try {
      localStorage.setItem('tako_paper_account', JSON.stringify(paperAccount));
      localStorage.setItem('tako_paper_positions', JSON.stringify(paperPositions));
    } catch {
      // Storage error
    }
  }, [paperAccount, paperPositions]);

  // Persist backtest records
  useEffect(() => {
    try {
      localStorage.setItem('alpha_backtest_records', JSON.stringify(backtestRecords));
    } catch {
      // Storage error
    }
  }, [backtestRecords]);

  // Audio settings
  useEffect(() => {
    audioSynth.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Toggle Theme Function
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'pastel' ? 'dark' : 'pastel'));
  };

  // Initialize Market Streaming WebSocket / Poller
  useEffect(() => {
    const manager = new MarketStreamManager(currentSymbol.symbol, {
      onPriceUpdate: (newPrice, newChange) => {
        setPrice(newPrice);
        setChange24h(newChange);
      },
      onOrderBookUpdate: (newBook) => {
        setOrderBook(newBook);
      },
      onTradeTick: (newTrade) => {
        setTrades((prev) => [newTrade, ...prev.slice(0, 49)]);
      },
      onCandlesUpdate: (newCandles) => {
        setCandles(newCandles);
      },
      onWhaleTrade: (newWhale) => {
        setWhales((prev) => [newWhale, ...prev.slice(0, 29)]);
      },
      onLiquidation: (newLiq) => {
        setLiquidations((prev) => [newLiq, ...prev.slice(0, 29)]);
      },
      onConnectionStatus: (connected, fallback) => {
        setIsLive(connected);
        setIsFallback(fallback);
      },
    });

    streamManagerRef.current = manager;
    manager.connect();

    return () => {
      manager.disconnect();
    };
  }, [currentSymbol.symbol]);

  // Sub-second Engine Evaluation Pipeline Loop & Paper PnL Updates
  useEffect(() => {
    const timer = setInterval(() => {
      if (candles.length === 0) return;

      const newSignal = evaluateAllEngines({
        symbol: currentSymbol.symbol,
        price,
        candles,
        orderBook,
        recentTrades: trades,
        liquidations,
        whales,
        openInterestUsd: price * 12500,
        openInterestChange1mPct: (Math.random() - 0.48) * 1.5,
        fundingRatePct: 0.01,
      });

      setSignal(newSignal);

      // Smart Alerts Detector
      const now = Date.now();
      const scoreDiff = Math.abs(newSignal.totalScore - lastScoreRef.current);
      if (scoreDiff >= 30 && lastScoreRef.current !== 0) {
        const alert: SmartAlert = {
          id: Math.random().toString(),
          type: 'SCORE_FLIP',
          title: `⚡ TAKO SKOR SIÇRAMASI (+${scoreDiff} Puan)`,
          description: `${currentSymbol.base} sinyali ${newSignal.direction} yönüne fırladı! (Skor: ${newSignal.totalScore})`,
          timestamp: now,
          severity: 'HIGH',
        };
        setSmartAlerts((prev) => [alert, ...prev.slice(0, 2)]);
        audioSynth.playBullishAlert();
      }
      lastScoreRef.current = newSignal.totalScore;

      // Whale Wall Alert
      if (orderBook.spoofScore > 40 && Math.random() < 0.05) {
        const alert: SmartAlert = {
          id: Math.random().toString(),
          type: 'WHALE_WALL',
          title: `🛡️ SPOOFING & BALİNA DUVARI ALARMI`,
          description: `Emir tahtasında %${orderBook.spoofScore} sahte duvar tespiti yapıldı!`,
          timestamp: now,
          severity: 'MEDIUM',
        };
        setSmartAlerts((prev) => [alert, ...prev.slice(0, 2)]);
      }

      // Live Paper Trading PnL Calculator & TP/SL Auto Close
      setPaperPositions((prev) => {
        return prev.map((pos) => {
          if (pos.status !== 'OPEN' || pos.symbol !== currentSymbol.symbol) return pos;

          const priceDiff = pos.direction === 'LONG' ? price - pos.entryPrice : pos.entryPrice - price;
          const pnlPercent = (priceDiff / pos.entryPrice) * 100;
          const pnlUsd = pos.amountUsd * (pnlPercent / 100);

          let updatedStatus = pos.status;
          if (pos.direction === 'LONG' && price >= pos.tpPrice) updatedStatus = 'CLOSED_TP';
          else if (pos.direction === 'SHORT' && price <= pos.tpPrice) updatedStatus = 'CLOSED_TP';
          else if (pos.direction === 'LONG' && price <= pos.slPrice) updatedStatus = 'CLOSED_SL';
          else if (pos.direction === 'SHORT' && price >= pos.slPrice) updatedStatus = 'CLOSED_SL';

          if (updatedStatus !== 'OPEN') {
            // Realize PnL to Account
            setPaperAccount((acc) => ({
              ...acc,
              balanceUsd: acc.balanceUsd + pos.amountUsd + pnlUsd,
              realizedPnlUsd: acc.realizedPnlUsd + pnlUsd,
              tradesCount: acc.tradesCount + 1,
              winsCount: pnlUsd > 0 ? acc.winsCount + 1 : acc.winsCount,
              lossesCount: pnlUsd <= 0 ? acc.lossesCount + 1 : acc.lossesCount,
            }));
          }

          return {
            ...pos,
            currentPrice: price,
            pnlUsd,
            pnlPercent,
            status: updatedStatus,
          };
        });
      });

      // Update Multi-Asset Screener Grid
      const screenerList: SymbolScreenerItem[] = DEFAULT_SYMBOLS.map((sym) => {
        const isCurrent = sym.symbol === currentSymbol.symbol;
        const symPrice = isCurrent ? price : sym.symbol.includes('BTC') ? 98500 : sym.symbol.includes('ETH') ? 3450 : sym.symbol.includes('SOL') ? 215 : 1.5;
        const symSignal = isCurrent ? newSignal : evaluateAllEngines({
          symbol: sym.symbol,
          price: symPrice,
          candles,
          orderBook,
          recentTrades: trades,
          liquidations,
          whales,
          openInterestUsd: symPrice * 10000,
          openInterestChange1mPct: 0.2,
          fundingRatePct: 0.01,
        });

        return {
          symbol: sym,
          price: symPrice,
          change24h: isCurrent ? change24h : (Math.sin(sym.symbol.length) * 3),
          totalScore: symSignal.totalScore,
          direction: symSignal.direction,
          probability: symSignal.direction === 'LONG' ? symSignal.longProbability : symSignal.shortProbability,
          confidence: symSignal.confidence,
          signalStrengthIndex: symSignal.signalStrengthIndex,
          divergenceTag: sym.symbol.includes('SOL') || sym.symbol.includes('PEPE') ? '🚀 BTC Ayrışma' : undefined,
        };
      });

      setScreenerItems(screenerList);

      // Sound alerts on strong new signal
      if (now - lastSignalTimeRef.current > 15000) {
        if (newSignal.isFakeBreakout) {
          audioSynth.playWarningAlert();
          lastSignalTimeRef.current = now;
        } else if (newSignal.confidence >= 8.0) {
          if (newSignal.direction === 'LONG') audioSynth.playBullishAlert();
          else if (newSignal.direction === 'SHORT') audioSynth.playBearishAlert();
          lastSignalTimeRef.current = now;
        }
      }

      // Auto Backtest Logger - every 60s
      if (now - (pendingSignalsRef.current[0]?.timestamp || 0) > 60000 && newSignal.direction !== 'NEUTRAL') {
        const record: BacktestRecord = {
          id: Math.random().toString(),
          symbol: currentSymbol.symbol,
          timestamp: now,
          entryPrice: price,
          signalDirection: newSignal.direction,
          probability: newSignal.direction === 'LONG' ? newSignal.longProbability : newSignal.shortProbability,
          confidence: newSignal.confidence,
          tpPrice: newSignal.tpPrice,
          slPrice: newSignal.slPrice,
          status: 'PENDING',
        };

        pendingSignalsRef.current.unshift(record);
        if (pendingSignalsRef.current.length > 50) {
          pendingSignalsRef.current = pendingSignalsRef.current.slice(0, 50);
        }

        // Evaluate signal 60s later
        setTimeout(() => {
          setBacktestRecords((prev) => {
            return prev.map((item) => {
              if (item.id === record.id && item.status === 'PENDING') {
                const actualClose = price;
                const priceDiff = actualClose - item.entryPrice;
                const isLongWin = item.signalDirection === 'LONG' && priceDiff > 0;
                const isShortWin = item.signalDirection === 'SHORT' && priceDiff < 0;

                return {
                  ...item,
                  status: isLongWin || isShortWin ? 'WIN' : 'LOSS',
                  actualClosePrice60s: actualClose,
                  actualPriceChange60s: Number(priceDiff.toFixed(currentSymbol.decimals)),
                  evaluatedAt: Date.now(),
                };
              }
              return item;
            });
          });
        }, 60000);

        setBacktestRecords((prev) => [record, ...prev.slice(0, 49)]);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [candles, orderBook, price, trades, liquidations, whales, currentSymbol.symbol, change24h]);

  // Open Paper Trade Position
  const handleOpenPaperPosition = (direction: 'LONG' | 'SHORT', amountUsd: number = 1000) => {
    if (!signal || paperAccount.balanceUsd < amountUsd) return;

    const newPos: PaperPosition = {
      id: Math.random().toString(),
      symbol: currentSymbol.symbol,
      direction,
      entryPrice: price,
      currentPrice: price,
      amountUsd,
      tpPrice: signal.tpPrice,
      slPrice: signal.slPrice,
      timestamp: Date.now(),
      pnlUsd: 0,
      pnlPercent: 0,
      status: 'OPEN',
    };

    setPaperAccount((acc) => ({
      ...acc,
      balanceUsd: acc.balanceUsd - amountUsd,
    }));

    setPaperPositions((prev) => [newPos, ...prev]);
  };

  // Close Paper Trade Position
  const handleClosePaperPosition = (id: string) => {
    setPaperPositions((prev) => {
      return prev.map((p) => {
        if (p.id === id && p.status === 'OPEN') {
          setPaperAccount((acc) => ({
            ...acc,
            balanceUsd: acc.balanceUsd + p.amountUsd + p.pnlUsd,
            realizedPnlUsd: acc.realizedPnlUsd + p.pnlUsd,
            tradesCount: acc.tradesCount + 1,
            winsCount: p.pnlUsd > 0 ? acc.winsCount + 1 : acc.winsCount,
            lossesCount: p.pnlUsd <= 0 ? acc.lossesCount + 1 : acc.lossesCount,
          }));
          return { ...p, status: 'CLOSED_MANUAL' };
        }
        return p;
      });
    });
  };

  // Reset Paper Trading Account
  const handleResetPaperAccount = () => {
    setPaperAccount({ balanceUsd: 10000, initialBalanceUsd: 10000, realizedPnlUsd: 0, tradesCount: 0, winsCount: 0, lossesCount: 0 });
    setPaperPositions([]);
  };

  // Trigger Gemini AI Reasoning
  const handleTriggerAiReasoning = async () => {
    if (!signal) return;
    setIsGeminiLoading(true);
    setIsGeminiModalOpen(true);

    try {
      const res = await fetch('/api/ai-reasoning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: currentSymbol.symbol,
          price,
          signal,
          engineSnapshot: {
            price: signal.engineScores.price,
            volume: signal.engineScores.volume,
            orderFlow: signal.engineScores.orderflow,
            cvd: signal.engineScores.cvd,
            orderBook: signal.engineScores.orderbook,
            openInterest: signal.engineScores.openinterest,
            liquidation: signal.engineScores.liquidation,
            trend: signal.engineScores.trend,
            oscillator: signal.engineScores.oscillator,
            fakeBreakout: signal.isFakeBreakout,
            whaleDetail: whales[0] ? `$${(whales[0].notional / 1000).toFixed(0)}k ${whales[0].side}` : 'Normal',
            liquidityMagnet: signal.targetMagnet,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setGeminiAnalysis(`⚠️ ${data.error || data.fallback || 'AI Analizi alınamadı.'}`);
      } else if (data.analysis) {
        setGeminiAnalysis(data.analysis);
      } else if (data.fallback) {
        setGeminiAnalysis(`⚠️ ${data.fallback}`);
      } else {
        setGeminiAnalysis('AI Analizi oluşturulurken beklenmeyen yanıt alındı.');
      }
    } catch {
      setGeminiAnalysis('Sunucu bağlantı hatası.');
    } finally {
      setIsGeminiLoading(false);
    }
  };

  const handleClearHistory = () => {
    setBacktestRecords([]);
    try {
      localStorage.removeItem('alpha_backtest_records');
    } catch {
      // Storage error
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen font-sans selection:bg-pink-300 selection:text-purple-950 custom-scrollbar pb-28 sm:pb-24 transition-colors duration-300 max-w-full overflow-x-hidden ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-gradient-to-b from-pink-50 via-purple-50/50 to-pink-100/60 text-slate-800'
    }`}>
      {/* Sleek Ultra-Compact Single-Row Header */}
      <Header
        currentSymbol={currentSymbol}
        onSelectSymbol={setCurrentSymbol}
        symbols={DEFAULT_SYMBOLS}
        timeframe={timeframe}
        onSelectTimeframe={setTimeframe}
        isLive={isLive}
        isFallback={isFallback}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onTriggerAiReasoning={handleTriggerAiReasoning}
        isAiLoading={isGeminiLoading}
        onOpenCalibration={() => setIsCalibrationOpen(true)}
        price={price}
        change24h={change24h}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-2.5 sm:p-5 space-y-3.5 sm:space-y-4 max-w-full overflow-hidden">
        {/* Smart Alert Banner */}
        <SmartAlertBanner
          alerts={smartAlerts}
          onDismissAlert={(id) => setSmartAlerts((prev) => prev.filter((a) => a.id !== id))}
          theme={theme}
        />

        {/* Desktop View Switcher */}
        <div className={`hidden md:flex items-center justify-between gap-2 p-1.5 border rounded-2xl shadow-xs transition-all max-w-full overflow-hidden ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-pink-200/80'
        }`}>
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar no-scrollbar">
            <button
              onClick={() => { setActiveTab('signal'); setIsFullDashboard(false); }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all shrink-0 ${
                activeTab === 'signal' && !isFullDashboard
                  ? 'bg-pink-500 text-white shadow-xs'
                  : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-purple-800 hover:bg-pink-50')
              }`}
            >
              📊 Sinyal
            </button>
            <button
              onClick={() => { setActiveTab('radar'); setIsFullDashboard(false); }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all shrink-0 ${
                activeTab === 'radar' && !isFullDashboard
                  ? 'bg-pink-500 text-white shadow-xs'
                  : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-purple-800 hover:bg-pink-50')
              }`}
            >
              🔍 Multi-Radar
            </button>
            <button
              onClick={() => { setActiveTab('paper'); setIsFullDashboard(false); }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all shrink-0 ${
                activeTab === 'paper' && !isFullDashboard
                  ? 'bg-pink-500 text-white shadow-xs'
                  : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-purple-800 hover:bg-pink-50')
              }`}
            >
              🎯 Paper PnL
            </button>
            <button
              onClick={() => { setActiveTab('engines'); setIsFullDashboard(false); }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all shrink-0 ${
                activeTab === 'engines' && !isFullDashboard
                  ? 'bg-pink-500 text-white shadow-xs'
                  : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-purple-800 hover:bg-pink-50')
              }`}
            >
              ⚡ 10 Motor
            </button>
            <button
              onClick={() => { setActiveTab('charts'); setIsFullDashboard(false); }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all shrink-0 ${
                activeTab === 'charts' && !isFullDashboard
                  ? 'bg-pink-500 text-white shadow-xs'
                  : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-purple-800 hover:bg-pink-50')
              }`}
            >
              📈 Grafik
            </button>
            <button
              onClick={() => { setActiveTab('whales'); setIsFullDashboard(false); }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all shrink-0 ${
                activeTab === 'whales' && !isFullDashboard
                  ? 'bg-pink-500 text-white shadow-xs'
                  : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-purple-800 hover:bg-pink-50')
              }`}
            >
              🐋 Balina & DEX
            </button>
            <button
              onClick={() => { setActiveTab('journal'); setIsFullDashboard(false); }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all shrink-0 ${
                activeTab === 'journal' && !isFullDashboard
                  ? 'bg-pink-500 text-white shadow-xs'
                  : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-purple-800 hover:bg-pink-50')
              }`}
            >
              📓 Günlük & Test
            </button>
          </div>

          <button
            onClick={() => setIsFullDashboard(!isFullDashboard)}
            className={`px-3 py-1 text-xs font-black rounded-xl border transition-all shrink-0 ${
              isFullDashboard
                ? 'bg-purple-950 text-white border-purple-900 shadow-xs'
                : (isDark ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-pink-50 text-purple-900 border-pink-200 hover:bg-pink-100')
            }`}
          >
            {isFullDashboard ? '📱 Sekmeli Mod' : '🖥️ Tüm Paneller'}
          </button>
        </div>

        {/* Tabbed or Full View Content */}
        {isFullDashboard ? (
          /* Full Desktop Grid View */
          <>
            <MainDecisionCard
              signal={signal}
              currentSymbol={currentSymbol}
              price={price}
              change24h={change24h}
            />

            <MultiAssetScreener
              screenerItems={screenerItems}
              onSelectSymbol={setCurrentSymbol}
              currentSymbol={currentSymbol}
              theme={theme}
            />

            <PaperTradingPanel
              account={paperAccount}
              positions={paperPositions}
              onOpenPosition={handleOpenPaperPosition}
              onClosePosition={handleClosePaperPosition}
              onResetAccount={handleResetPaperAccount}
              signal={signal}
              currentSymbol={currentSymbol}
              price={price}
              theme={theme}
            />

            <CvdPriceChart
              candles={candles}
              currentSymbol={currentSymbol}
            />

            {signal && <EnginesGrid engineScores={signal.engineScores} />}

            <SmartMoneyRadar
              currentSymbol={currentSymbol}
              price={price}
              netflowUsd={signal?.netflowUsd}
              hlPrice={signal?.hlPrice}
              hlDivergencePct={signal?.hlDivergencePct}
              theme={theme}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <OrderBookVisualizer
                orderBook={orderBook}
                currentSymbol={currentSymbol}
                price={price}
              />

              <WhaleLiquidationFeed
                whales={whales}
                liquidations={liquidations}
                currentSymbol={currentSymbol}
              />
            </div>

            <BacktestJournal
              records={backtestRecords}
              onClearHistory={handleClearHistory}
              signal={signal}
              currentSymbol={currentSymbol}
              price={price}
            />
          </>
        ) : (
          /* Tabbed Native Layout */
          <>
            {activeTab === 'signal' && (
              <div className="space-y-3.5 animate-in fade-in duration-200 max-w-full">
                <MainDecisionCard
                  signal={signal}
                  currentSymbol={currentSymbol}
                  price={price}
                  change24h={change24h}
                />
                <CvdPriceChart
                  candles={candles}
                  currentSymbol={currentSymbol}
                />
              </div>
            )}

            {activeTab === 'radar' && (
              <div className="space-y-3.5 animate-in fade-in duration-200 max-w-full">
                <MultiAssetScreener
                  screenerItems={screenerItems}
                  onSelectSymbol={setCurrentSymbol}
                  currentSymbol={currentSymbol}
                  theme={theme}
                />
              </div>
            )}

            {activeTab === 'paper' && (
              <div className="space-y-3.5 animate-in fade-in duration-200 max-w-full">
                <PaperTradingPanel
                  account={paperAccount}
                  positions={paperPositions}
                  onOpenPosition={handleOpenPaperPosition}
                  onClosePosition={handleClosePaperPosition}
                  onResetAccount={handleResetPaperAccount}
                  signal={signal}
                  currentSymbol={currentSymbol}
                  price={price}
                  theme={theme}
                />
              </div>
            )}

            {activeTab === 'engines' && (
              <div className="space-y-3.5 animate-in fade-in duration-200 max-w-full">
                {signal && <EnginesGrid engineScores={signal.engineScores} />}
              </div>
            )}

            {activeTab === 'charts' && (
              <div className="space-y-3.5 animate-in fade-in duration-200 max-w-full">
                <CvdPriceChart
                  candles={candles}
                  currentSymbol={currentSymbol}
                />
                <OrderBookVisualizer
                  orderBook={orderBook}
                  currentSymbol={currentSymbol}
                  price={price}
                />
              </div>
            )}

            {activeTab === 'whales' && (
              <div className="space-y-3.5 animate-in fade-in duration-200 max-w-full">
                <SmartMoneyRadar
                  currentSymbol={currentSymbol}
                  price={price}
                  netflowUsd={signal?.netflowUsd}
                  hlPrice={signal?.hlPrice}
                  hlDivergencePct={signal?.hlDivergencePct}
                  theme={theme}
                />
                <WhaleLiquidationFeed
                  whales={whales}
                  liquidations={liquidations}
                  currentSymbol={currentSymbol}
                />
              </div>
            )}

            {activeTab === 'journal' && (
              <div className="space-y-3.5 animate-in fade-in duration-200 max-w-full">
                <BacktestJournal
                  records={backtestRecords}
                  onClearHistory={handleClearHistory}
                  signal={signal}
                  currentSymbol={currentSymbol}
                  price={price}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsFullDashboard(false);
        }}
        signalDirection={signal?.direction}
        onTriggerAi={handleTriggerAiReasoning}
        isAiLoading={isGeminiLoading}
        theme={theme}
      />

      {/* Gemini AI Analysis Modal */}
      <GeminiModal
        isOpen={isGeminiModalOpen}
        onClose={() => setIsGeminiModalOpen(false)}
        analysisText={geminiAnalysis}
        isLoading={isGeminiLoading}
        symbol={currentSymbol.symbol}
      />

      {/* Autonomous Calibration Panel */}
      {signal && (
        <CalibrationPanel
          isOpen={isCalibrationOpen}
          onClose={() => setIsCalibrationOpen(false)}
          calibrationState={signal.calibrationState}
          records={backtestRecords}
          symbol={currentSymbol.symbol}
        />
      )}
    </div>
  );
}
