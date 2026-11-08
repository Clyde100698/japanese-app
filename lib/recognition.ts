"use client";
// Feature-detected SpeechRecognition wrapper. Chrome/Android/Safari expose it (often prefixed);
// Firefox does not. Callers must check recognitionSupported() and offer a fallback.

interface RecResult { isFinal: boolean; length: number; [i: number]: { transcript: string } }
interface RecEvent { results: ArrayLike<RecResult> }
interface Rec {
  lang: string; interimResults: boolean; maxAlternatives: number; continuous: boolean;
  onresult: ((e: RecEvent) => void) | null; onerror: ((e: { error: string }) => void) | null; onend: (() => void) | null;
  start(): void; stop(): void; abort(): void;
}
type RecCtor = new () => Rec;

function ctor(): RecCtor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { SpeechRecognition?: RecCtor; webkitSpeechRecognition?: RecCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export const recognitionSupported = () => !!ctor();

export type ListenError = "unsupported" | "not-allowed" | "no-speech" | "network" | "aborted" | "unknown";

export interface Listener { stop(): void }

/** Start one-shot recognition. Resolves via callbacks; never throws. */
export function listenOnce(handlers: {
  onResult: (alternatives: string[]) => void;
  onError: (e: ListenError) => void;
  onEnd: () => void;
}): Listener {
  const C = ctor();
  if (!C) {
    handlers.onError("unsupported");
    handlers.onEnd();
    return { stop() {} };
  }
  const rec = new C();
  rec.lang = "ja-JP";
  rec.interimResults = false;
  rec.continuous = false;
  rec.maxAlternatives = 5;
  rec.onresult = (e) => {
    const r = e.results[e.results.length - 1];
    handlers.onResult(Array.from({ length: r.length }, (_, i) => r[i].transcript));
  };
  rec.onerror = (e) => {
    const map: Record<string, ListenError> = { "not-allowed": "not-allowed", "service-not-allowed": "not-allowed", "no-speech": "no-speech", network: "network", aborted: "aborted" };
    handlers.onError(map[e.error] ?? "unknown");
  };
  rec.onend = handlers.onEnd;
  try { rec.start(); } catch { handlers.onError("unknown"); handlers.onEnd(); }
  return { stop: () => { try { rec.stop(); } catch { /* already stopped */ } } };
}

