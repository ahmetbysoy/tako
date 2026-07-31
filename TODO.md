# 🐙 TAKO TACTICAL HFT COMMAND CENTER v7.0 - SIFIRDAN KODLAMA BÜYÜK YOL HARİTASI VE MİMARİ TODO PROMPT

> **MİSYON:** Yüklenen tüm 20+ sistem dosyasından (`parasay.html`, `code (3).html - Chimera Ascension`, `scalp_lab_mpl.html`, `index.html - Pain Index v2`, `fonda.html - Predatör Pro`, `watchdog_bum_v3.html`, `4c4.html`, `V2 yeni.html` vb.) çıkarılan dünyadaki en gelişmiş kantitatif HFT algoritmalarını, anti-manipülasyon matrisini, VPIN/OFI toksiklik motorunu ve Yapay Zeka Süpervizörünü harmanlayarak **Tako Tactical Command Center v7.0** sistemini sıfırdan inşa etmek.

---

## 🏛️ 1. MİMARİ & DİZİN YAPISI (MODÜLER KOD MİMARİSİ)

Projeyi sıfırdan temiz, modüler ve yüksek performanslı TypeScript/React mimarisiyle yeniden yapılandıracağız:

```
tako/
├── server.ts (Multi-Exchange Proxy, OKX/Binance/MEXC/TradingView Feeds, Gemini API)
├── src/
│   ├── lib/
│   │   ├── collectors/
│   │   │   ├── MultiExchangeManager.ts (OKX, Binance, Bybit, MEXC WS & REST)
│   │   │   └── TradingViewScreener.ts (TradingView Scanner API - Volume Surge & RSI)
│   │   ├── engines/
│   │   │   ├── VPINEngine.ts (Volume-Synchronized Probability of Toxicity)
│   │   │   ├── OFIEngine.ts (Order Flow Imbalance)
│   │   │   ├── MPLEngine.ts (Multi-Factor Microstructure Pressure Level)
│   │   │   ├── PainIndexEngine.ts (Repaint-Free Likidasyon Ağrı Endeksi)
│   │   │   ├── WyckoffSLEEngine.ts (Smart Learning Wyckoff Accumulation/Distribution)
│   │   │   ├── AntiManipulationMatrix.ts (Wash Trade, Spoofing, Iceberg & Trap Filter)
│   │   │   ├── MarketRegimeClassifier.ts (Trending, Ranging, Volatile Classification)
│   │   │   ├── NeuralPatternEngine.ts (Cascade, Reversal, Spike & Kelly Sizer)
│   │   │   ├── OrderFlowClusterEngine.ts (10-Tick ACC / ABS Volume Clusters)
│   │   │   ├── LPLLiquidityEngine.ts (Liquidity Pressure Levels Support/Resistance)
│   │   │   └── PredatorDeltaEngine.ts (Whale Liquidation Contrarian Squeeze)
│   │   ├── synthesis/
│   │   │   ├── SignalSynthesisEngine.ts (100-Puanlık Master Ağırlıklı Sinyal Motoru)
│   │   │   ├── RiskExecutionManager.ts (Entry, SL, TP1, TP2, TP3, Risk/Reward)
│   │   │   └── TTSQueueManager.ts (Öncelikli Türkçe Sesli Komut Kuyruğu)
│   │   └── audio/
│   │       └── AudioSynth.ts (Multi-Frequency Web Audio Alert Synthesizer)
│   ├── components/
│   │   ├── Header.tsx (Thumb Zone Header & Mode Switcher)
│   │   ├── MainDecisionCard.tsx (The Pulse Command HUD & 🔊 Sesli Okuyucu)
│   │   ├── CvdPriceChart.tsx (Lightweight Chart & Visual AI Level Overlays)
│   │   ├── PaperTradingPanel.tsx (Sanal İşlem $10k & Paper PnL)
│   │   ├── MultiAssetScreener.tsx (Çoklu Sembol Taraması & TradingView Radar)
│   │   ├── SmartMoneyRadar.tsx (24h Netflow & Hyperliquid Leaderboard Whales)
│   │   ├── SmartAlertBanner.tsx (Score Flip, Spoofing & Cascade Alarmları)
│   │   ├── EnginesGrid.tsx (10 Ahtapot Dokunaç Telemetrisi)
│   │   ├── OrderBookVisualizer.tsx (L2 Depth, Duvarlar & Absorption)
│   │   ├── WhaleLiquidationFeed.tsx (Balina & Likidasyon Akışı)
│   │   ├── BacktestJournal.tsx (Sinyal Geçmişi & Win-Streak)
│   │   ├── GeminiModal.tsx (3 İşlem Senaryosu)
│   │   └── BottomNav.tsx (Apple iOS Safe Area & 48px Touch Targets)
│   ├── App.tsx (Master Terminal Controller - 250ms Throttled)
│   └── types.ts (Tüm Tip Tanımlamaları)
```

---

## 🧮 2. TÜM DOSYALARDAN AKTARILACAK GELİŞMİŞ HFT ALGORİTMALARI VE SINIFLAR

### [ ] 2.1. `VPINEngine` (Volume-Synchronized Probability of Toxicity - `parasay.html`)
- **Sınıf/Sözdizimi:** `VPINEngine.ts`
- **Formül:** $B_{usd} = \$500.000$ hacim kovalarında sipariş toksikliği:
  $$\text{VPIN} = \frac{1}{N} \sum_{k=1}^N \frac{|V_k^B - V_k^S|}{V_k}$$
- **Aksiyon:** $\text{VPIN} \ge 0.55 \implies \text{EXTREME TOXIC}$ uyarısı ile sahte kırılımları eleme.

### [ ] 2.2. `MPLEngine` (Multi-Factor Microstructure Pressure Level - `scalp_lab_mpl.html`)
- **Sınıf/Sözdizimi:** `MPLEngine.ts`
- **Ağırlıklı Formül:**
  $$\text{MPL} = W_{flow} \cdot \text{FlowScore} + W_{book} \cdot \text{BookScore} + W_{dev} \cdot \text{DivergenceScore} + W_{liq} \cdot \text{LiqScore} + W_{vol} \cdot \text{VolScore}$$
  Ağırlıklar: $W_{flow} = 0.30$, $W_{book} = 0.25$, $W_{dev} = 0.20$, $W_{liq} = 0.15$, $W_{vol} = 0.10$.
- **Momentum Onayı:** Ham MPL değerine EMA5 ve EMA13 uygulayarak mikro momentum dönüşlerini yakalama.

### [ ] 2.3. `PainIndexEngine` (Repaint-Free Likidasyon Ağrı Endeksi - `index.html`)
- **Sınıf/Sözdizimi:** `PainIndexEngine.ts`
- **Formül:** Piyasadaki trader ağrı birikimi:
  $$\text{PainIndex} = \frac{\text{LiquidationVolume}_{1m}}{\text{AverageVolume}_{20m}} \times 100$$
- **Aksiyon:** Repaint-free onay ile geçmiş sinyal kaymalarını engelleme.

### [ ] 2.4. `AntiManipulationMatrix` (Sahte Kırılma, Spoofing & Trap Filtresi - `code (3).html`)
- **Sınıf/Sözdizimi:** `AntiManipulationMatrix.ts`
- **Tespitler:** Wash trading, emir merdivenleme (laddering), spoofing (sahte duvar ekleme/silme) ve pump/dump manipülasyonlarını tespit edip sinyalleri filtreleme.

### [ ] 2.5. `WyckoffSLEEngine` (Smart Learning Wyckoff Engine - `parasay.html` & `fonda.html`)
- **Sınıf/Sözdizimi:** `WyckoffSLEEngine.ts`
- **Fonksiyon:** $V_{trade} > 1.5 \times V_{avg}$ durumunda **Accumulation (Toplama)** veya **Distribution (Dağıtım)** pattern'i tespiti.

### [ ] 2.6. `PredatorDeltaEngine` (Kontraryen Balina Sıkışması - `fonda.html`)
- **Sınıf/Sözdizimi:** `PredatorDeltaEngine.ts`
- **Fonksiyon:** Balina likidasyon dalgaları doyum noktasına ulaştığında piyasada yön değişimini tahmin eden kontraryen predatör sinyali üretme.

### [ ] 2.7. `TradingViewScreener` (Piyasa Hacim İvme Taraması - `watchdog_bum_v3.html`)
- **Sınıf/Sözdizimi:** `TradingViewScreener.ts`
- **Fonksiyon:** TradingView API (`https://scanner.tradingview.com/crypto/scan`) üzerinden borsalar genelinde sıçrayan coinleri tarama.

### [ ] 2.8. `OFIEngine` (Order Flow Imbalance - `parasay.html`)
- **Sınıf/Sözdizimi:** `OFIEngine.ts`
- **Formül:** $\text{OFI} = \frac{\text{BuyUSD} - \text{SellUSD}}{\text{TotalUSD}}$ (Son 300 trade).

### [ ] 2.9. `MarketRegimeClassifier` (Piyasa Rejimi Tespiti - `parasay.html`)
- **Sınıf/Sözdizimi:** `MarketRegimeClassifier.ts`
- **Kategoriler:** `TRENDING`, `RANGING`, `VOLATILE`.

### [ ] 2.10. `NeuralPatternEngine` & Kelly Criterion (`parasay.html`)
- **Sınıf/Sözdizimi:** `NeuralPatternEngine.ts`
- **Patternler:** `CASCADE`, `REVERSAL`, `SPIKE` + Kelly kaldıraç boyutu: $f^* = \frac{p \cdot b - q}{b}$.

### [ ] 2.11. `OrderFlowClusterEngine` (10-Tick ACC / ABS - `parasay.html`)
- **Sınıf/Sözdizimi:** `OrderFlowClusterEngine.ts`
- **Kümeler:** **ACC (Agresif Toplama)** ve **ABS (Duvar Emilimi)**.

### [ ] 2.12. `LPLLiquidityEngine` (Destek/Direnç Seviyeleri - `parasay.html`)
- **Sınıf/Sözdizimi:** `LPLLiquidityEngine.ts`
- **Fonksiyon:** Likidasyon ve tahta duvarlarının çakıştığı fiyat bantlarını canlı grafik üzerine çizme.

### [ ] 2.13. `TTSQueueManager` (Öncelikli Ses Kuyruğu - `V2 yeni.html`)
- **Sınıf/Sözdizimi:** `TTSQueueManager.ts`
- **Fonksiyon:** `queueVoice`, `playNextVoice` ile ses çakışmalarını engelleyen Türkçe ses kuyruğu yönetimi.

---

## 🎛️ 3. MÜKEMMEL SAVAŞ MERKEZİ (THE PULSE COMMAND HUD)

- [ ] **3.1. Net Yön & Olasılık Vektörü**
  - **🟢 YUKARI (LONG) %88** | **🔴 AŞAĞI (SHORT)** | **🟨 KARARSIZ**
  - Sinyal Güç Endeksi (SSI: 0-100) & Kelly Sermaye Tahsis Önerisi (`%5.2`).
- [ ] **3.2. Eyleme Dönüştürülebilir Tam İşlem Planı**
  - **Giriş Fiyatı:** Live $P_{entry}$
  - **TP1:** $+0.35\%$ | **TP2:** $+0.75\%$ | **TP3:** $+1.40\%$
  - **Stop Loss:** $-0.25\%$ Sıkı Koruma
  - **İptal / Geçersizlik Şartı:** Stop kırılması veya CVD eğiminin tersine dönmesi.
- [ ] **3.3. 🎮 1-Tık Sanal İşlem (Paper Trading HUD)**
  - $10.000 sanal bakiye ile anında `🚀 LONG ($1.000)` / `🔻 SHORT ($1.000)` pozisyon açma ve canlı PnL takibi.

---

## 📱 4. MOBİL ERGONOMİ & PERFORMANS (STRICT)

- [ ] **Thumb Zone First Layout:** Tüm eylem butonları ekranın alt 1/3'lük başparmak alanında yer alacaktır.
- [ ] **Apple iOS Safe Area (`pb-safe`):** Butonlar minimum 48px dokunma yüksekliğine sahip olacaktır.
- [ ] **250ms State Throttling:** Canlı güncellemeler 4 FPS ile sınırlandırılıp mobil CPU ve pil tüketimi %60 azaltılacaktır.
- [ ] **Sıfır Simülasyon / Sıfır Mock:** Tüm veriler %100 canlı OKX ve Binance uç noktalarından çekilecektir.

---

## ❓ SIFIRDAN KODLAMA ONAY İSTEĞİ

Yukarıdaki tüm 20+ dosyadan derlenmiş, modüler, sıfırdan sıfıra inşa edilecek **Tako Tactical Command Center v7.0** mimarisi ve TODO spesifikasyonu onayına sunulmuştur.

Onay verdiğinde projeyi sıfırdan tamamen bu modüler yapıda kodlayıp GitHub repona push edeceğim!
