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
    <div className="fixed inset-0 z-50 bg-purple-950/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-pink-200 rounded-3xl max-w-xl w-full p-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 font-bold"
        >
          ✕
        </button>

        <div className="flex items-center gap-2.5 border-b border-pink-100 pb-3 mb-3">
          <div className="p-2 rounded-xl bg-pink-100 border border-pink-200 text-pink-700">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-black text-purple-950">
              Gemini AI Derin Analiz Raporu ({symbol})
            </h3>
            <p className="text-xs text-purple-600 font-medium">
              10 Ahtapot motoru verileri üzerinden yapay zeka analizi
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-10 flex flex-col items-center justify-center gap-2 text-purple-700">
            <Bot className="w-9 h-9 text-pink-500 animate-bounce" />
            <span className="text-xs font-black text-purple-950">
              Gemini AI motoru 10 telemetri katmanını inceliyor...
            </span>
          </div>
        ) : analysisText ? (
          <div className="prose prose-pink max-w-none text-xs text-slate-800 leading-relaxed bg-pink-50/50 p-4 rounded-2xl border border-pink-200 font-sans space-y-2 whitespace-pre-wrap max-h-[55vh] overflow-y-auto custom-scrollbar">
            {analysisText}
          </div>
        ) : (
          <div className="py-6 text-center text-rose-600 text-xs font-bold">
            AI Analizi alınamadı. Gemini API anahtarını kontrol edin.
          </div>
        )}

        <div className="mt-4 border-t border-pink-100 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-black text-xs rounded-xl transition-all shadow-md shadow-pink-200"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
