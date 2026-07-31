/**
 * 60s Alpha Decision Engine - High Frequency Trading Terminal
 * @license Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { CryptoSymbol, DecisionSignal, OrderBookData, Candle, TradeTick, LiquidationEvent, WhaleTrade, BacktestRecord } from './types';
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
  const pendingSignalsRef = useRef<BacktestRecord[]>([]);

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

  // Sub-second Engine Evaluation Pipeline Loop
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

      // Sound alerts on strong new signal
      const now = Date.now();
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
  }, [candles, orderBook, price, trades, liquidations, whales, currentSymbol.symbol]);

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
      if (data.analysis) {
        setGeminiAnalysis(data.analysis);
      } else if (data.fallback) {
        setGeminiAnalysis(`⚠️ ${data.fallback}`);
      } else {
        setGeminiAnalysis('AI Analizi oluşturulurken hata meydana geldi.');
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50/50 to-pink-100/60 text-slate-800 font-sans selection:bg-pink-300 selection:text-purple-950 custom-scrollbar pb-24">
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
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-3 sm:p-5 space-y-4">
        {/* Desktop View Switcher (Desktop only) */}
        <div className="hidden md:flex items-center justify-between gap-2 p-1.5 bg-white/80 border border-pink-200/80 rounded-2xl shadow-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setActiveTab('signal'); setIsFullDashboard(false); }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                activeTab === 'signal' && !isFullDashboard
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-purple-800 hover:bg-pink-50'
              }`}
            >
              📊 Sinyal
            </button>
            <button
              onClick={() => { setActiveTab('engines'); setIsFullDashboard(false); }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                activeTab === 'engines' && !isFullDashboard
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-purple-800 hover:bg-pink-50'
              }`}
            >
              ⚡ 10 Motor
            </button>
            <button
              onClick={() => { setActiveTab('charts'); setIsFullDashboard(false); }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                activeTab === 'charts' && !isFullDashboard
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-purple-800 hover:bg-pink-50'
              }`}
            >
              📈 Grafik
            </button>
            <button
              onClick={() => { setActiveTab('whales'); setIsFullDashboard(false); }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                activeTab === 'whales' && !isFullDashboard
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-purple-800 hover:bg-pink-50'
              }`}
            >
              🐋 Balina
            </button>
            <button
              onClick={() => { setActiveTab('journal'); setIsFullDashboard(false); }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                activeTab === 'journal' && !isFullDashboard
                  ? 'bg-pink-500 text-white shadow-xs'
                  : 'text-purple-800 hover:bg-pink-50'
              }`}
            >
              📓 Günlük & Test
            </button>
          </div>

          <button
            onClick={() => setIsFullDashboard(!isFullDashboard)}
            className={`px-3 py-1 text-xs font-black rounded-xl border transition-all ${
              isFullDashboard
                ? 'bg-purple-950 text-white border-purple-900 shadow-xs'
                : 'bg-pink-50 text-purple-900 border-pink-200 hover:bg-pink-100'
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

            <CvdPriceChart
              candles={candles}
              currentSymbol={currentSymbol}
            />

            {signal && <EnginesGrid engineScores={signal.engineScores} />}

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
          /* Tabbed Native Mobile Layout */
          <>
            {activeTab === 'signal' && (
              <div className="space-y-4 animate-in fade-in duration-200">
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

            {activeTab === 'engines' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {signal && <EnginesGrid engineScores={signal.engineScores} />}
              </div>
            )}

            {activeTab === 'charts' && (
              <div className="space-y-4 animate-in fade-in duration-200">
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
              <div className="space-y-4 animate-in fade-in duration-200">
                <WhaleLiquidationFeed
                  whales={whales}
                  liquidations={liquidations}
                  currentSymbol={currentSymbol}
                />
              </div>
            )}

            {activeTab === 'journal' && (
              <div className="space-y-4 animate-in fade-in duration-200">
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
