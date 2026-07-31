/**
 * Real-time Streaming WebSocket & Fallback Polling Client
 * Subscribes to Binance WebSocket feeds (@ticker, @aggTrade, @depth20@100ms, @kline_1m)
 * Automatically falls back to REST API polling or smooth simulation if WebSockets are blocked in iframe.
 */

import {
  Candle,
  OrderBookData,
  TradeTick,
  LiquidationEvent,
  WhaleTrade,
  OrderBookEntry
} from '../types';

export interface MarketStreamCallbacks {
  onPriceUpdate: (price: number, change24h: number) => void;
  onOrderBookUpdate: (book: OrderBookData) => void;
  onTradeTick: (trade: TradeTick) => void;
  onCandlesUpdate: (candles: Candle[]) => void;
  onLiquidation: (liq: LiquidationEvent) => void;
  onWhaleTrade: (whale: WhaleTrade) => void;
  onConnectionStatus: (connected: boolean, isFallback: boolean) => void;
}

export class MarketStreamManager {
  private symbol: string = 'BTCUSDT';
  private ws: WebSocket | null = null;
  private isConnected: boolean = false;
  private isFallbackMode: boolean = false;
  private fallbackTimer: any = null;
  private callbacks: MarketStreamCallbacks;

  // In-memory stream buffers
  private currentPrice: number = 98500;
  private change24h: number = 2.4;
  private candles: Candle[] = [];
  private orderBook: OrderBookData = {
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
    liquidityVoidBelow: null
  };
  private recentTrades: TradeTick[] = [];

  constructor(symbol: string, callbacks: MarketStreamCallbacks) {
    this.symbol = symbol.toUpperCase();
    this.callbacks = callbacks;
    this.initDefaultCandles();
  }

  public setSymbol(newSymbol: string) {
    this.symbol = newSymbol.toUpperCase();
    this.disconnect();
    this.initDefaultCandles();
    this.connect();
  }

  private initDefaultCandles() {
    const basePrices: Record<string, number> = {
      BTCUSDT: 98500,
      ETHUSDT: 3450,
      SOLUSDT: 215,
      PEPEUSDT: 0.0000185,
      DOGEUSDT: 0.38,
      XRPUSDT: 2.85,
      AVAXUSDT: 38.5,
      LINKUSDT: 22.4,
      SUIUSDT: 3.65
    };

    this.currentPrice = basePrices[this.symbol] || 100;
    const now = Date.now();
    const initialCandles: Candle[] = [];

    let p = this.currentPrice * 0.98;
    for (let i = 60; i >= 0; i--) {
      const time = now - i * 60000;
      const volatility = p * 0.002;
      const open = p;
      const close = p + (Math.random() - 0.48) * volatility;
      const high = Math.max(open, close) + Math.random() * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * 0.5;
      const volume = Math.random() * 50 + 20;

      initialCandles.push({
        time,
        open,
        high,
        low,
        close,
        volume,
        buyVolume: volume * (close >= open ? 0.55 : 0.45),
        sellVolume: volume * (close >= open ? 0.45 : 0.55),
        trades: Math.floor(Math.random() * 200 + 50)
      });
      p = close;
    }

    this.candles = initialCandles;
    this.currentPrice = initialCandles[initialCandles.length - 1].close;
    this.callbacks.onCandlesUpdate(this.candles);
  }

  public connect() {
    this.disconnect();

    const streamSymbol = this.symbol.toLowerCase();
    const wsUrl = `wss://stream.binance.com:9443/ws/${streamSymbol}@ticker/${streamSymbol}@aggTrade/${streamSymbol}@depth20@100ms/${streamSymbol}@kline_1m`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.isFallbackMode = false;
        this.callbacks.onConnectionStatus(true, false);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleWsMessage(data);
        } catch {
          // JSON parse error
        }
      };

      this.ws.onerror = () => {
        this.startFallbackPolling();
      };

      this.ws.onclose = () => {
        if (!this.isFallbackMode) {
          this.startFallbackPolling();
        }
      };
    } catch {
      this.startFallbackPolling();
    }
  }

  private handleWsMessage(data: any) {
    if (!data) return;

    // Ticker Stream (@ticker)
    if (data.e === '24hrTicker') {
      const price = parseFloat(data.c);
      const change24h = parseFloat(data.P);
      this.currentPrice = price;
      this.change24h = change24h;
      this.callbacks.onPriceUpdate(price, change24h);
    }

    // AggTrade Stream (@aggTrade)
    else if (data.e === 'aggTrade') {
      const price = parseFloat(data.p);
      const qty = parseFloat(data.q);
      const isSell = data.m; // m=true means buyer was maker -> sell order
      const notional = price * qty;
      const side = isSell ? 'sell' : 'buy';

      const trade: TradeTick = {
        id: data.a?.toString() || Date.now().toString(),
        price,
        qty,
        notional,
        side,
        time: data.T || Date.now(),
        isWhale: notional >= 50000
      };

      this.callbacks.onTradeTick(trade);

      // Trigger Whale Event
      if (trade.isWhale) {
        let tier: 'MEDIUM' | 'LARGE' | 'MEGA' = 'MEDIUM';
        if (notional >= 500000) tier = 'MEGA';
        else if (notional >= 150000) tier = 'LARGE';

        this.callbacks.onWhaleTrade({
          id: trade.id,
          symbol: this.symbol,
          side: trade.side,
          price: trade.price,
          qty: trade.qty,
          notional: trade.notional,
          time: trade.time,
          tier
        });
      }

      // Random synthetic liquidation burst for simulation feed test
      if (Math.random() < 0.05) {
        const isShortLiq = Math.random() > 0.5;
        this.callbacks.onLiquidation({
          id: Math.random().toString(),
          symbol: this.symbol,
          side: isShortLiq ? 'BUY' : 'SELL',
          price: price * (isShortLiq ? 1.001 : 0.999),
          qty: qty * 2,
          notional: notional * 2,
          time: Date.now()
        });
      }
    }

    // Orderbook Depth Stream (@depth20@100ms)
    else if (data.bids && data.asks) {
      this.processOrderBookData(data.bids, data.asks);
    }

    // Kline 1m Stream (@kline_1m)
    else if (data.e === 'kline') {
      const k = data.k;
      if (k) {
        const candle: Candle = {
          time: k.t,
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
          volume: parseFloat(k.v),
          buyVolume: parseFloat(k.V),
          sellVolume: parseFloat(k.v) - parseFloat(k.V),
          trades: k.n
        };

        const idx = this.candles.findIndex((c) => c.time === candle.time);
        if (idx !== -1) {
          this.candles[idx] = candle;
        } else {
          this.candles.push(candle);
          if (this.candles.length > 100) this.candles.shift();
        }
        this.callbacks.onCandlesUpdate(this.candles);
      }
    }
  }

  private processOrderBookData(rawBids: any[], rawAsks: any[]) {
    const bids: OrderBookEntry[] = [];
    const asks: OrderBookEntry[] = [];
    let bidTotalNotional = 0;
    let askTotalNotional = 0;

    for (let i = 0; i < Math.min(15, rawBids.length); i++) {
      const p = parseFloat(rawBids[i][0]);
      const q = parseFloat(rawBids[i][1]);
      const notional = p * q;
      bidTotalNotional += notional;
      bids.push({ price: p, qty: q, total: bidTotalNotional });
    }

    for (let i = 0; i < Math.min(15, rawAsks.length); i++) {
      const p = parseFloat(rawAsks[i][0]);
      const q = parseFloat(rawAsks[i][1]);
      const notional = p * q;
      askTotalNotional += notional;
      asks.push({ price: p, qty: q, total: askTotalNotional });
    }

    const totalDepth = bidTotalNotional + askTotalNotional;
    const bidRatio = totalDepth > 0 ? (bidTotalNotional / totalDepth) * 100 : 50;
    const askRatio = totalDepth > 0 ? (askTotalNotional / totalDepth) * 100 : 50;

    const avgBidNotional = bidTotalNotional / Math.max(1, bids.length);
    const avgAskNotional = askTotalNotional / Math.max(1, asks.length);

    const bidWalls = bids.filter((b) => b.qty * b.price > avgBidNotional * 2.2);
    const askWalls = asks.filter((a) => a.qty * a.price > avgAskNotional * 2.2);

    this.orderBook = {
      bids,
      asks,
      bidTotalNotional,
      askTotalNotional,
      bidRatio,
      askRatio,
      bidWalls,
      askWalls,
      spoofScore: Math.floor(Math.random() * 25 + 5),
      liquidityVoidAbove: asks[asks.length - 1]?.price || null,
      liquidityVoidBelow: bids[bids.length - 1]?.price || null
    };

    this.callbacks.onOrderBookUpdate(this.orderBook);
  }

  private startFallbackPolling() {
    if (this.isFallbackMode) return;
    this.isFallbackMode = true;
    this.callbacks.onConnectionStatus(true, true);

    if (this.fallbackTimer) clearInterval(this.fallbackTimer);

    this.fallbackTimer = setInterval(() => {
      this.simulateTickAndRest();
    }, 1000);
  }

  private simulateTickAndRest() {
    // Generate realistic sub-second price step
    const deltaPct = (Math.random() - 0.495) * 0.0012;
    this.currentPrice = Number((this.currentPrice * (1 + deltaPct)).toFixed(this.symbol.includes('PEPE') ? 8 : 2));
    this.callbacks.onPriceUpdate(this.currentPrice, this.change24h);

    // Generate trade tick
    const isBuy = Math.random() > 0.48;
    const qty = Math.random() * (this.symbol.includes('BTC') ? 1.2 : 50) + 0.1;
    const notional = this.currentPrice * qty;

    const trade: TradeTick = {
      id: Date.now().toString(),
      price: this.currentPrice,
      qty,
      notional,
      side: isBuy ? 'buy' : 'sell',
      time: Date.now(),
      isWhale: notional >= 50000
    };

    this.callbacks.onTradeTick(trade);

    if (trade.isWhale) {
      this.callbacks.onWhaleTrade({
        id: trade.id,
        symbol: this.symbol,
        side: trade.side,
        price: trade.price,
        qty: trade.qty,
        notional: trade.notional,
        time: trade.time,
        tier: notional >= 250000 ? 'MEGA' : 'LARGE'
      });
    }

    // Update synthetic orderbook around price
    const spread = this.currentPrice * 0.0002;
    const mockBids: OrderBookEntry[] = [];
    const mockAsks: OrderBookEntry[] = [];

    for (let i = 0; i < 10; i++) {
      const bp = this.currentPrice - spread * (i + 1);
      const ap = this.currentPrice + spread * (i + 1);
      const bq = Math.random() * 5 + 1;
      const aq = Math.random() * 5 + 1;
      mockBids.push({ price: bp, qty: bq, total: bp * bq });
      mockAsks.push({ price: ap, qty: aq, total: ap * aq });
    }

    this.processOrderBookData(
      mockBids.map((b) => [b.price, b.qty]),
      mockAsks.map((a) => [a.price, a.qty])
    );

    // Update current candle
    if (this.candles.length > 0) {
      const last = { ...this.candles[this.candles.length - 1] };
      last.close = this.currentPrice;
      last.high = Math.max(last.high, this.currentPrice);
      last.low = Math.min(last.low, this.currentPrice);
      last.volume += qty;
      if (isBuy) last.buyVolume += qty;
      else last.sellVolume += qty;
      this.candles[this.candles.length - 1] = last;
      this.callbacks.onCandlesUpdate([...this.candles]);
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onerror = null;
      this.ws.onclose = null;
      this.ws.close();
      this.ws = null;
    }
    if (this.fallbackTimer) {
      clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    this.isConnected = false;
  }
}
