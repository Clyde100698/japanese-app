"use client";

// Web Audio API pure tone synthesizer for game-like feedback.
// Zero external assets or network dependencies. Works completely offline.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

const STORAGE_MUTED = "nihongo.sound.muted";

export function isMuted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_MUTED) === "true";
}

export function setMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_MUTED, String(muted));
}

export function toggleMuted(): boolean {
  const next = !isMuted();
  setMuted(next);
  return next;
}

export function triggerHaptic(type: "light" | "medium" | "success" | "warning" = "light"): void {
  if (typeof window === "undefined" || !("vibrate" in navigator)) return;
  try {
    switch (type) {
      case "light":
        navigator.vibrate(10);
        break;
      case "medium":
        navigator.vibrate(25);
        break;
      case "success":
        navigator.vibrate([15, 40, 25]);
        break;
      case "warning":
        navigator.vibrate([30, 60, 30]);
        break;
    }
  } catch {
    // Unsupported or blocked
  }
}

/** Play a snappy wooden / bubble pop for taps */
export function playTapSound(): void {
  if (isMuted()) return;
  triggerHaptic("light");
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;

  osc.type = "sine";
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.07);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.07);
}

/** Play a cheerful major triad chime for correct answers (C5 -> E5 -> G5 -> C6) */
export function playCorrectSound(): void {
  if (isMuted()) return;
  triggerHaptic("success");
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + idx * 0.07;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.32);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.32);
  });
}

/** Play a gentle, encouraging boing for wrong answers (friendly, not punishing) */
export function playWrongSound(): void {
  if (isMuted()) return;
  triggerHaptic("warning");
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(260, now);
  osc.frequency.exponentialRampToValueAtTime(160, now + 0.22);

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.25);
}

/** Play an ecstatic fanfare for lesson completion / level up */
export function playCelebrateSound(): void {
  if (isMuted()) return;
  triggerHaptic("success");
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // C5, E5, G5, C6, G5, C6 sustained
  const sequence = [
    { freq: 523.25, t: 0.0, d: 0.12 },
    { freq: 659.25, t: 0.1, d: 0.12 },
    { freq: 783.99, t: 0.2, d: 0.12 },
    { freq: 1046.5, t: 0.3, d: 0.18 },
    { freq: 783.99, t: 0.45, d: 0.12 },
    { freq: 1046.5, t: 0.55, d: 0.45 },
  ];

  sequence.forEach(({ freq, t, d }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + t;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.25, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, start + d);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + d);
  });
}

/** Play a cute tiny chirp/squeak when tapping the mascot */
export function playMascotSqueak(): void {
  if (isMuted()) return;
  triggerHaptic("light");
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(580, now);
  osc.frequency.exponentialRampToValueAtTime(920, now + 0.08);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.12);
}

