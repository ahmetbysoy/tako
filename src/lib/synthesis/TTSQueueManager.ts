/**
 * TTS Queue Manager (V2 yeni.html)
 * SpeechSynthesisUtterance priority queue manager ensuring audio alerts never overlap or cut off.
 * 100% Real Browser Speech Engine.
 */

export class TTSQueueManager {
  private static speechQueue: string[] = [];
  private static isSpeaking: boolean = false;

  public static queueVoice(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    this.speechQueue.push(text);
    if (!this.isSpeaking) {
      this.playNextVoice();
    }
  }

  private static playNextVoice() {
    if (this.speechQueue.length === 0) {
      this.isSpeaking = false;
      return;
    }

    this.isSpeaking = true;
    const text = this.speechQueue.shift()!;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 1.0;

    utterance.onend = () => {
      this.playNextVoice();
    };

    utterance.onerror = () => {
      this.playNextVoice();
    };

    window.speechSynthesis.speak(utterance);
  }

  public static stop() {
    this.speechQueue = [];
    this.isSpeaking = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
