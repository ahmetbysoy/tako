import React from 'react';
import { Sparkles, Bot } from 'lucide-react';

interface GeminiModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisText: string | null;
  isLoading: boolean;
  symbol: string;
}

export const GeminiModal: React.FC<GeminiModalProps> = ({
  isOpen,
  onClose,
  analysisText,
  isLoading,
  symbol,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 font-bold"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="p-2.5 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-100">
              Gemini Institutional AI Derin Rapor ({symbol})
            </h3>
            <p className="text-xs text-purple-300 font-medium">
              10 Motorlu snapshot verileri üzerinden yapay zeka kurum değerlendirmesi
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Bot className="w-10 h-10 text-purple-400 animate-bounce" />
            <span className="text-sm font-bold text-slate-200">
              Gemini AI motoru 10 telemetri katmanını inceliyor...
            </span>
          </div>
        ) : analysisText ? (
          <div className="prose prose-invert max-w-none text-xs text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800 font-sans space-y-2 whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
            {analysisText}
          </div>
        ) : (
          <div className="py-8 text-center text-rose-400 text-xs font-semibold">
            AI Analizi alınamadı. Gemini API anahtarı veya ağ bağlantısını kontrol edin.
          </div>
        )}

        <div className="mt-6 border-t border-slate-800 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-purple-500/20"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
