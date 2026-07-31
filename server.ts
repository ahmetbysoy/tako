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

  // API Routes
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
      const prompt = `You are a High-Frequency Trading (HFT) Institutional Analyst evaluating a 60-second crypto scalp signal for ${symbol}.
Current Price: $${price}
Signal Direction: ${signal.direction} (${signal.probability}% probability)
Confidence: ${signal.confidence}/10
Risk Level: ${signal.risk}

10-Engine Breakdown Snapshot:
- Price Engine: Score ${engineSnapshot.price.score} (${engineSnapshot.price.detail})
- Volume Engine: Score ${engineSnapshot.volume.score} (${engineSnapshot.volume.detail})
- Order Flow Engine: Score ${engineSnapshot.orderFlow.score} (${engineSnapshot.orderFlow.detail})
- CVD Engine: Score ${engineSnapshot.cvd.score} (${engineSnapshot.cvd.detail})
- Order Book Engine: Score ${engineSnapshot.orderBook.score} (${engineSnapshot.orderBook.detail})
- Open Interest Engine: Score ${engineSnapshot.openInterest.score} (${engineSnapshot.openInterest.detail})
- Liquidation Engine: Score ${engineSnapshot.liquidation.score} (${engineSnapshot.liquidation.detail})
- Trend Engine: Score ${engineSnapshot.trend.score} (${engineSnapshot.trend.detail})
- Oscillator Engine: Score ${engineSnapshot.oscillator.score} (${engineSnapshot.oscillator.detail})
- Fake Breakout Warning: ${engineSnapshot.fakeBreakout ? 'YES - FAKE BREAKOUT DETECTED' : 'No'}
- Whale Activity: ${engineSnapshot.whaleDetail}
- Liquidity Magnet Target: $${engineSnapshot.liquidityMagnet}

Provide a concise 3-bullet point institutional summary explaining:
1. Primary market driver supporting or refuting this 60s scalp setup.
2. Key risk factors (e.g. spoofing, liquidation cascades, RSI divergence).
3. Scalp execution advice for 1-3 minute holding time.
Keep language direct, professional, and formatted in clean Markdown.`;

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

  // Binance Proxy Fallback for CORS-safe REST data
  app.get("/api/market/ticker", async (req, res) => {
    try {
      const symbol = (req.query.symbol as string) || "BTCUSDT";
      const fetchRes = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
      if (!fetchRes.ok) throw new Error("Binance ticker fetch failed");
      const data = await fetchRes.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/market/klines", async (req, res) => {
    try {
      const symbol = (req.query.symbol as string) || "BTCUSDT";
      const interval = (req.query.interval as string) || "1m";
      const limit = (req.query.limit as string) || "60";
      const fetchRes = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
      if (!fetchRes.ok) throw new Error("Binance klines fetch failed");
      const data = await fetchRes.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/market/depth", async (req, res) => {
    try {
      const symbol = (req.query.symbol as string) || "BTCUSDT";
      const limit = (req.query.limit as string) || "20";
      const fetchRes = await fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${limit}`);
      if (!fetchRes.ok) throw new Error("Binance depth fetch failed");
      const data = await fetchRes.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/market/trades", async (req, res) => {
    try {
      const symbol = (req.query.symbol as string) || "BTCUSDT";
      const limit = (req.query.limit as string) || "50";
      const fetchRes = await fetch(`https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=${limit}`);
      if (!fetchRes.ok) throw new Error("Binance trades fetch failed");
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
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[60s Alpha Engine] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
