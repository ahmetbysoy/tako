# 🐙 Tako v4.0 (Autonomous Alpha Trading Terminal) - Tüm Modüller & Sade Mod

Bu doküman, **ahmetbysoy/tako** projesinde geliştirdiğimiz, sadeleştirdiğimiz ve GitHub repona push ettiğimiz tüm **kullanıcı odaklı sadeleştirme ve v4.0 devrimsel modüllerini** içerir.

---

## 🎯 1. Kullanıcı Odaklı Felsefe: "İnsan Makine Değildir, Zaman Değerlidir" (Yeni Sade Mod)

- **Problem:** Ekranda 50 farklı karmaşık rakam, CVD, OI, Spoof Score, Brier Skoru vb. verilerin hepsinin aynı anda gösterilmesi kullanıcıda **karar yorgunluğuna (Decision Fatigue)** yol açıyordu.
- **Çözüm:** **`⚡ Sade Mod (Minimalist Focus Mode)`** varsayılan görünüm yapıldı!
  - 10 karmaşık matematiksel analiz motoru **arkada (under the hood)** tam kapasite çalışmaya devam eder.
  - Ekranda kullanıcıya sadece **2 ODAK NOKTASI** sunulur:
    1. **Neresindeyiz?** 📈 Sade Canlı Grafik (Fiyat ve Hedef Çizgileri)
    2. **Nereye Gidiyoruz?** 🐙 Net Yön Sinyali (🚀 LONG %84 | Giriş: $98.500 | TP: $98.850 | Stop: $98.300 | Tako Maskot 1 Cümlelik Özeti)
  - Pro analiz araçları (10 Motor Detayları, Tahta, Balina Akışı, Multi-Radar, Paper PnL) istenildiği an **`⚙️ Pro Mod`** butonuna basılarak açılabilir.

---

## 🚀 2. Tako v4.0 Tamamlanan Tüm Devrimsel Modüller

### 1. 🎯 Sanal İşlem Engine & Paper Trading (Paper PnL)
- **Bileşen:** `src/components/PaperTradingPanel.tsx`
- $10.000 Sanal Bakiye ile risk almadan canlı işlem yapma.
- 1-Tıkla **"Sanal Long ($1.000)"** ve **"Sanal Short ($1.000)"** pozisyonu açma.
- Canlı PnL hesabı, TP/SL otonom kapanışlar, Win Rate % istatistikleri.

### 2. ⚡ Akıllı Alarm & Bildirim Banner'ı (Smart Alarms)
- **Bileşen:** `src/components/SmartAlertBanner.tsx`
- Score Flip (Yön Sıçraması), Spoofing (Sahte Duvar) ve Likidasyon Dalgalarında anlık sesli ve görsel açılır uyarı banner'ı.

### 3. 🔍 Çoklu Sembol Taraması & Radar (Multi-Asset Screener)
- **Bileşen:** `src/components/MultiAssetScreener.tsx`
- BTC, ETH, SOL, PEPE, DOGE, XRP, AVAX, LINK, SUI paritelerinin Tako Skorlarını, Yön Kararlarını ve Sinyal Güçlerini matris grid halinde izleme.
- **BTC Ayrışma (Divergence) Yakalayıcı** ile ayrışan altcoinleri öne çıkarma.

### 4. 🧠 Gemini Copilot "Trade Senaryo Oluşturucu"
- **Bileşen:** `server.ts` & `GeminiModal.tsx`
- Gemini AI motoru Türkçe 3 net senaryo üretir:
  1. 🟢 **Boğa Senaryosu (Bullish Case)**
  2. 🔴 **Ayı Senaryosu (Bearish Case)**
  3. 🟨 **Range / Scalp Stratejisi**

### 5. 🐋 Smart Money & DEX Akış Radarı
- **Bileşen:** `src/components/SmartMoneyRadar.tsx`
- 24h Borsa Cüzdan Netflow Visualizer & Hyperliquid Leaderboard Whales Live Tracker.

### 6. 🎨 Tek Tıkla Tema Değiştirici (Dark / Pastel Mode Switcher)
- Header'daki 🌙 / ☀️ butonuna basarak **Soft Pembe/Mor Pastel Moda** ile **Pro Cyberpunk Dark Moda** arasında anında geçiş.

---

## 📄 Proje Dizin Yapısı
```
tako/
├── src/
│   ├── components/
│   │   ├── Header.tsx (Sade Mod & Tema Switcher)
│   │   ├── MainDecisionCard.tsx (Tako Maskot Yorumu & Senkronize Hedefler)
│   │   ├── PaperTradingPanel.tsx (Sanal İşlem & Paper PnL)
│   │   ├── MultiAssetScreener.tsx (Çoklu Sembol Radarı)
│   │   ├── SmartMoneyRadar.tsx (Netflow & Hyperliquid Whales)
│   │   ├── SmartAlertBanner.tsx (Akıllı Alarmlar)
│   │   ├── EnginesGrid.tsx (10 Dokunaç Motoru)
│   │   ├── CvdPriceChart.tsx (Dual-Pane CVD)
│   │   ├── OrderBookVisualizer.tsx (L2 Depth & Duvarlar)
│   │   ├── WhaleLiquidationFeed.tsx (Balina & Likidasyon)
│   │   ├── BacktestJournal.tsx (Sinyal Geçmişi & Win-Streak)
│   │   ├── GeminiModal.tsx (Trade Senaryoları)
│   │   └── BottomNav.tsx (Yüzen Kaydırılabilir Alt Dok)
│   ├── lib/
│   │   ├── engine.ts (10-Motor Matematik Pipeline)
│   │   ├── websocket.ts (Binance WS Stream)
│   │   └── audio.ts (Web Audio Sinyal Sesleri)
│   ├── App.tsx (Sade Mod & Pro Mod Controller)
│   └── types.ts (TypeScript Arayüzleri)
├── server.ts (Express & Gemini API Proxy)
└── README.md
```
