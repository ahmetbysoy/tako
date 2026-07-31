# 🚀 Tako - 60s Alpha Decision Engine (v3.2 Autonomous Market Intelligence Engine)

> **High-Frequency Alpha Decision Engine for Crypto Scalping & Market Intelligence**

Tako (60s Alpha Decision Engine) is an autonomous, ultra-low-latency market intelligence engine built with React, TypeScript, Tailwind CSS, and Web Audio synthesis. It synthesizes **10 specialized quantitative sub-engines** into unified real-time long/short decision signals with strict risk metrics, continuous calibration, and Gemini AI reasoning.

---

## 🌟 Key Capabilities & Features

1. **10 Quantitative Sub-Engines**:
   - **Price Action Engine**: Trend alignment, EMA 9/21 cross, candle patterns.
   - **Volume Delta Engine**: Relative volume spikes, buyer/seller flow ratio.
   - **Order Flow (Taker Imbalance)**: Aggressive market buy/sell order imbalance.
   - **CVD (Cumulative Volume Delta)**: Divergence detection between price trend and cumulative delta.
   - **OrderBook Depth & Spoof Detection**: Depth imbalance at ±1% and ±2% levels with spoofing detection.
   - **Open Interest Engine**: Aggressive positioning & open interest change trends.
   - **Liquidation Magnet Engine**: Forced liquidation cascade thresholds & magnet targets.
   - **Trend Momentum**: Multi-timeframe RSI, Stochastic, and EMA momentum.
   - **Contrarian Options Engine**: Log-ratio continuous sigmoid for Put/Call sentiment (Deribit & Binance Options).
   - **Hyperliquid & On-Chain Netflow**: Perp DEX liquidity divergence and exchange wallet netflows.

2. **Calibration Engine (Brier Index & Regime Drift)**:
   - Evaluates past 60-second backtest signal records.
   - Computes rolling Brier Score ($0.000$ = perfect calibration) and dynamic confidence offsets.
   - Automatically detects market regime drift.

3. **Gemini AI Intelligence Integration**:
   - Integrated server-side Gemini 2.5 Flash API proxy for real-time natural language trade reasoning.
   - Evaluates fake breakouts, liquidity magnets, and orderbook spoofing.

4. **Web Audio Synthesizer**:
   - Zero-dependency Web Audio API synthesizer generating distinct sound alerts for High-Confidence Bullish, Bearish, and Fake Breakout signals.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS, Recharts, Lucide Icons, Motion.
- **Backend / Proxy**: Express, Node.js (`server.ts`), `@google/genai` SDK.
- **Build System**: Vite 6, `esbuild` for CJS production bundling.

---

## 🚀 Quick Start & Development

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and add your Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Development Server
```bash
npm run dev
```

### 4. Production Build & Start
```bash
npm run build
npm start
```

---

## 📊 10 Sub-Engine Score Weighting Matrix

| Sub-Engine | Weight | Focus Area |
| :--- | :---: | :--- |
| **Order Book Depth** | 15% | Bid/Ask imbalance at ±1% & ±2% depth |
| **Trade Flow (Taker)** | 15% | Market order buyer/seller aggressiveness |
| **Open Interest** | 12% | Contract position expansion/contraction |
| **Liquidation Engine** | 12% | Liquidation cascade risk & magnet price targets |
| **CVD Divergence** | 10% | Cumulative volume delta vs. price divergence |
| **Price Action** | 10% | Multi-timeframe trend & EMA alignment |
| **Contrarian Options** | 10% | Continuous Put/Call ratio sentiment |
| **Whale Netflow** | 10% | CEX/DEX wallet netflows & Hyperliquid bias |
| **Volume Ratio** | 6% | Relative volume surge vs. 20-period SMA |

---

## 📄 License
MIT License. Crafted with craftsmanship for high-frequency trading intelligence.
