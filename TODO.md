# 🐙 Tako v5.0 Master Release (Autonomous Real-Time Pre-Breakout HFT Engine)

Bu doküman, **ahmetbysoy/tako** projesinde tamamen **%100 Canlı Gerçek Piyasa Verileriyle (OKX & Binance WS / REST)** çalışan, **SIFIR Simülasyon, SIFIR Mock Veri ve SIFIR Yer Tutucu** ilkesiyle sıfırdan yapılandırılan **Tako v5.0 Otonom Karar Motoru** mimarisini açıklar.

---

## 🚀 Tako v5.0 Mimari İlkeler & Kurallar (Strict Rules Applied)

1. **🚫 Simülasyon, Random (`Math.random()`), Sinüs (`Math.sin()`) BÖĞRÜNDEN SİLİNDİ:**
   - Kod tabanındaki tüm sentetik veri üreteçleri temizlendi.
   - Tüm skorlar, mumlar, emir tahtası derinliği, CVD eğimleri ve açık pozisyon değişimleri **milisaniyelik canlı piyasa verileriyle** hesaplanır.

2. **📡 %100 Canlı Piyasa Veri Toplayıcı (Live OKX & Binance Feed):**
   - OKX WebSocket Stream (`wss://ws.okx.com:8443/ws/v5/public`) & Server REST Proxy (`/api/market/...`) üzerinden canlı tickers, books, trades, klines, funding rate ve open interest verileri çekilir.

3. **🎯 Hareket Başlamadan Önce Erken Yakalama (Pre-Breakout Lead Signal Engine):**
   - CVD Eğim İvmelenmesi, Agresif Taker Buy/Sell Deltası, Emir Tahtası Duvar Tüketimi (Wall Consumption) ve Açık Pozisyon Genişlemesi (OI Expansion) birleştirilerek kırılım öncesi sinyal üretilir.

4. **🛡️ Sahte Kırılma & Manipülasyon Filtresi (Fake Breakout Filter):**
   - Bull Trap, Bear Trap, Liquidity Sweep ve Stop Hunt tuzakları otomatik tespit edilip filtrelenir.

5. **📋 Eyleme Dönüştürülebilir Tam İşlem Planı (Complete Trade Plan):**
   - **Giriş (Entry):** Canlı Fiyat $P_{entry}$
   - **Kar Al (TP1, TP2, TP3):** $+0.35\%$, $+0.75\%$, $+1.40\%$ kademeli hedefler.
   - **Stop Loss (SL):** $-0.25\%$ sıkı risk yönetimi.
   - **İptal Şartı:** Stop seviyesi ihlali veya CVD eğiminin negatife dönmesi.
   - **Kaldıraç & Risk:** 10x - 20x Scalp / R:R 1.40.

6. **🔊 Sesli AI Karar Okuyucu & Grafik İçi AI Çizgileri:**
   - Canlı grafiğin üzerinde TP1, TP2, SL ve Mıknatıs çizgileri görsel olarak çizilir.
   - Tako Maskot kutusundaki `🔊` butonuna basıldığında karar Türkçe sesli olarak okunur.

---

## 📂 Proje Modüler Yapısı

```
tako/
├── server.ts (OKX & Binance Canlı Piyasa Proxy & Gemini 2.5 Flash API)
├── src/
│   ├── lib/
│   │   ├── websocket.ts (Canlı WS Stream & REST Data Collector - SIFIR Mock)
│   │   ├── engine.ts (100-Puanlık Pre-Breakout Matematik Pipeline - SIFIR Mock)
│   │   └── audio.ts (Web Audio Sinyal Sesleri)
│   ├── components/
│   │   ├── Header.tsx (Sade Mod & Tema Switcher)
│   │   ├── MainDecisionCard.tsx (Tako Maskot & 🔊 Sesli Okuyucu)
│   │   ├── CvdPriceChart.tsx (Visual AI Overlays: TP/SL/Entry/Magnet)
│   │   ├── PaperTradingPanel.tsx (Sanal İşlem & Paper PnL)
│   │   ├── MultiAssetScreener.tsx (Çoklu Sembol Radarı)
│   │   ├── SmartMoneyRadar.tsx (Netflow & Hyperliquid Whales)
│   │   ├── SmartAlertBanner.tsx (Akıllı Alarmlar)
│   │   ├── EnginesGrid.tsx (10 Dokunaç Motoru)
│   │   ├── OrderBookVisualizer.tsx (L2 Depth & Duvarlar)
│   │   ├── WhaleLiquidationFeed.tsx (Balina & Likidasyon)
│   │   ├── BacktestJournal.tsx (Sinyal Geçmişi & Win-Streak)
│   │   ├── GeminiModal.tsx (Trade Senaryoları)
│   │   └── BottomNav.tsx (Yüzen Kaydırılabilir Alt Dok)
│   ├── App.tsx (Master Terminal Controller)
│   └── types.ts (TypeScript Arayüzleri)
└── README.md
```
