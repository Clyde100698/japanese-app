export function ttsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function japaneseVoice(): SpeechSynthesisVoice | undefined {
  if (!ttsSupported()) return undefined;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === "ja-JP") ??
    voices.find((v) => v.lang.toLowerCase().startsWith("ja"))
  );
}

/** True once the browser has loaded a Japanese voice (may take a moment on Chrome). */
export function hasJapaneseVoice(): boolean {
  return !!japaneseVoice();
}

/** Subscribe to voice list changes; returns an unsubscribe function. */
export function onVoicesChanged(cb: () => void): () => void {
  if (!ttsSupported()) return () => {};
  window.speechSynthesis.addEventListener("voiceschanged", cb);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", cb);
}

/** Speak Japanese text. rate: 0.5 (slow) to 1.2 (fast). Returns false if unsupported. */
export function speak(text: string, rate = 0.9): boolean {
  if (!ttsSupported()) return false;
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  u.rate = rate;
  const v = japaneseVoice();
  if (v) u.voice = v;
  synth.speak(u);
  return true;
}

