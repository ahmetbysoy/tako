import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // API Health Endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Gemini AI Deep Reasoning API Proxy
  app.post("/api/ai-reasoning", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.status(400).json({
          error: "GEMINI_API_KEY is not configured in .env",
          fallback: "Gemini API key missing. AI engine using local mathematical 10-engine rules."
        });
      }

      const { symbol, engineSnapshot, price, signal } = req.body;

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a High-Frequency Trading (HFT) Institutional Analyst & Copilot evaluating a 60-second crypto scalp signal for ${symbol}.
Current Price: $${price}
Signal Direction: ${signal.direction} (${signal.probability}% probability)
Confidence: ${signal.confidence}/10
Risk Level: ${signal.risk}

10-Engine Breakdown Snapshot:
- Price Engine: Score ${engineSnapshot.price?.score || 0} (${engineSnapshot.price?.detail || ''})
- Volume Engine: Score ${engineSnapshot.volume?.score || 0} (${engineSnapshot.volume?.detail || ''})
- Order Flow Engine: Score ${engineSnapshot.orderFlow?.score || 0} (${engineSnapshot.orderFlow?.detail || ''})
- CVD Engine: Score ${engineSnapshot.cvd?.score || 0} (${engineSnapshot.cvd?.detail || ''})
- Order Book Engine: Score ${engineSnapshot.orderBook?.score || 0} (${engineSnapshot.orderBook?.detail || ''})
- Open Interest Engine: Score ${engineSnapshot.openInterest?.score || 0} (${engineSnapshot.openInterest?.detail || ''})
- Liquidation Engine: Score ${engineSnapshot.liquidation?.score || 0} (${engineSnapshot.liquidation?.detail || ''})
- Trend Engine: Score ${engineSnapshot.trend?.score || 0} (${engineSnapshot.trend?.detail || ''})
- Oscillator Engine: Score ${engineSnapshot.oscillator?.score || 0} (${engineSnapshot.oscillator?.detail || ''})
- Fake Breakout Warning: ${engineSnapshot.fakeBreakout ? 'YES - FAKE BREAKOUT DETECTED' : 'No'}
- Whale Activity: ${engineSnapshot.whaleDetail}
- Liquidity Magnet Target: $${engineSnapshot.liquidityMagnet}

Generate 3 distinct, professional Trade Scenarios in Turkish (Türkçe) formatted in clean Markdown:

### 🟢 1. Boğa Senaryosu (Bullish Case)
- Key breakout trigger level above $${price}.
- Target profit zone and volume requirement.

### 🔴 2. Ayı Senaryosu (Bearish Case)
- Key breakdown support level below $${price}.
- Liquidation cascade trigger price.

### 🟨 3. Range / Scalp Execution Stratejisi
- Holding time (1-3 min), strict stop-loss advice, and Tako engine confirmation rule.
Keep language direct, concise, and institutional.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.json({
        analysis: response.text,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Error calling Gemini API:", error);
      res.status(500).json({ error: error.message || "Failed to generate AI analysis" });
    }
  });

  // REAL LIVE MARKET PROXY ENDPOINTS (OKX Public API - 100% Geo-Safe Live Feeds)
  app.get("/api/market/ticker", async (req, res) => {
    try {
      const rawSymbol = (req.query.symbol as string) || "BTCUSDT";
      const base = rawSymbol.replace("USDT", "");
      const instId = `${base}-USDT`;
      const fetchRes = await fetch(`https://www.okx.com/api/v5/market/ticker?instId=${instId}`);
      if (!fetchRes.ok) throw new Error("Ticker fetch failed");
      const data = await fetchRes.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/market/klines", async (req, res) => {
    try {
      const rawSymbol = (req.query.symbol as string) || "BTCUSDT";
      const base = rawSymbol.replace("USDT", "");
      const instId = `${base}-USDT`;
      const interval = (req.query.interval as string) || "1m";
      const limit = (req.query.limit as string) || "60";
      
      const okxBar = interval === "1m" ? "1m" : interval === "3m" ? "3m" : interval === "5m" ? "5m" : "15m";
      const fetchRes = await fetch(`https://www.okx.com/api/v5/market/candles?instId=${instId}&bar=${okxBar}&limit=${limit}`);
      if (!fetchRes.ok) throw new Error("Klines fetch failed");
      const data = await fetchRes.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/market/depth", async (req, res) => {
    try {
      const rawSymbol = (req.query.symbol as string) || "BTCUSDT";
      const base = rawSymbol.replace("USDT", "");
      const instId = `${base}-USDT`;
      const limit = (req.query.limit as string) || "50";
      const fetchRes = await fetch(`https://www.okx.com/api/v5/market/books?instId=${instId}&sz=${limit}`);
      if (!fetchRes.ok) throw new Error("Depth fetch failed");
      const data = await fetchRes.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/market/trades", async (req, res) => {
    try {
      const rawSymbol = (req.query.symbol as string) || "BTCUSDT";
      const base = rawSymbol.replace("USDT", "");
      const instId = `${base}-USDT`;
      const limit = (req.query.limit as string) || "100";
      const fetchRes = await fetch(`https://www.okx.com/api/v5/market/trades?instId=${instId}&limit=${limit}`);
      if (!fetchRes.ok) throw new Error("Trades fetch failed");
      const data = await fetchRes.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/market/funding", async (req, res) => {
    try {
      const rawSymbol = (req.query.symbol as string) || "BTCUSDT";
      const base = rawSymbol.replace("USDT", "");
      const instId = `${base}-USDT-SWAP`;
      const fetchRes = await fetch(`https://www.okx.com/api/v5/public/funding-rate?instId=${instId}`);
      if (!fetchRes.ok) throw new Error("Funding fetch failed");
      const data = await fetchRes.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/market/open-interest", async (req, res) => {
    try {
      const rawSymbol = (req.query.symbol as string) || "BTCUSDT";
      const base = rawSymbol.replace("USDT", "");
      const instId = `${base}-USDT-SWAP`;
      const fetchRes = await fetch(`https://www.okx.com/api/v5/public/open-interest?instType=SWAP&instId=${instId}`);
      if (!fetchRes.ok) throw new Error("Open Interest fetch failed");
      const data = await fetchRes.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Tako v5.0 Pre-Breakout Engine] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
