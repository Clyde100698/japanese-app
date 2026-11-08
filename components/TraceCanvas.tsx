"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, RotateCcw, Undo2, Check } from "lucide-react";

const SIZE = 300;
const PEN = 16;

function glyphCanvas(char: string, width = 0) {
  const c = document.createElement("canvas");
  c.width = c.height = SIZE;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.font = `${SIZE * 0.78}px "Yu Gothic", "Hiragino Sans", "Noto Sans JP", sans-serif`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "#000";
  g.fillText(char, SIZE / 2, SIZE / 2 + SIZE * 0.04);
  if (width) { g.lineWidth = width; g.lineJoin = "round"; g.strokeText(char, SIZE / 2, SIZE / 2 + SIZE * 0.04); }
  return g.getImageData(0, 0, SIZE, SIZE).data;
}

/** Finger tracing over a faint guide. Scores coverage of the glyph and stray ink outside it. */
export default function TraceCanvas({ char }: { char: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<{ x: number; y: number }[][]>([]);
  const [score, setScore] = useState<{ cover: number; stray: number } | null>(null);
  const drawing = useRef(false);

  const render = useCallback(() => {
    const c = ref.current;
    if (!c) return;
    const g = c.getContext("2d")!;
    g.clearRect(0, 0, SIZE, SIZE);
    g.font = `${SIZE * 0.78}px "Yu Gothic", "Hiragino Sans", "Noto Sans JP", sans-serif`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillStyle = "#cbd5e1";
    g.fillText(char, SIZE / 2, SIZE / 2 + SIZE * 0.04);
    g.strokeStyle = "#2563eb";
    g.lineWidth = PEN;
    g.lineCap = g.lineJoin = "round";
    for (const s of strokes.current) {
      g.beginPath();
      s.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
      if (s.length === 1) g.lineTo(s[0].x + 0.1, s[0].y);
      g.stroke();
    }
  }, [char]);

  useEffect(() => { strokes.current = []; setScore(null); render(); }, [char, render]);

  const pos = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * SIZE, y: ((e.clientY - r.top) / r.height) * SIZE };
  };

  const evaluate = () => {
    const guide = glyphCanvas(char);
    const wide = glyphCanvas(char, 36);
    const u = document.createElement("canvas");
    u.width = u.height = SIZE;
    const g = u.getContext("2d", { willReadFrequently: true })!;
    g.strokeStyle = "#000"; g.lineWidth = PEN + 14; g.lineCap = g.lineJoin = "round";
    for (const s of strokes.current) {
      g.beginPath();
      s.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
      if (s.length === 1) g.lineTo(s[0].x + 0.1, s[0].y);
      g.stroke();
    }
    const ink = g.getImageData(0, 0, SIZE, SIZE).data;
    let glyph = 0, covered = 0, inkPx = 0, stray = 0;
    for (let i = 3; i < ink.length; i += 4) {
      const gl = guide[i] > 100, ik = ink[i] > 100, band = wide[i] > 100;
      if (gl) { glyph++; if (ik) covered++; }
      if (ik) { inkPx++; if (!band) stray++; }
    }
    setScore({ cover: glyph ? covered / glyph : 0, stray: inkPx ? stray / inkPx : 0 });
  };

  return (
    <div>
      <canvas
        ref={ref}
        width={SIZE}
        height={SIZE}
        className="mx-auto aspect-square w-full max-w-xs touch-none rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm"
        aria-label={`Trace ${char} with your finger`}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); drawing.current = true; strokes.current.push([pos(e)]); setScore(null); render(); }}
        onPointerMove={(e) => { if (!drawing.current) return; strokes.current.at(-1)!.push(pos(e)); render(); }}
        onPointerUp={() => { drawing.current = false; }}
        onPointerCancel={() => { drawing.current = false; }}
      />
      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          onClick={() => { strokes.current = []; setScore(null); render(); }}
          className="inline-flex min-h-11 items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-3.5 text-sm font-medium text-slate-700 dark:text-slate-200 active:bg-slate-200 dark:active:bg-slate-700 transition"
        >
          <RotateCcw className="h-4 w-4" />
          Clear
        </button>
        <button
          onClick={() => { strokes.current.pop(); setScore(null); render(); }}
          className="inline-flex min-h-11 items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-3.5 text-sm font-medium text-slate-700 dark:text-slate-200 active:bg-slate-200 dark:active:bg-slate-700 transition"
        >
          <Undo2 className="h-4 w-4" />
          Undo
        </button>
        <button
          onClick={evaluate}
          disabled={!strokes.current.length && !score}
          className="inline-flex min-h-11 items-center gap-1 rounded-full bg-blue-600 dark:bg-blue-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-40 transition"
        >
          <Check className="h-4 w-4" />
          Check
        </button>
      </div>
      {score && (
        <div className="mt-3 flex items-center justify-center gap-1.5 text-center text-sm font-medium text-slate-700 dark:text-slate-300" role="status">
          {score.cover > 0.6 && score.stray < 0.35 ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Great tracing!</span>
            </>
          ) : score.cover <= 0.6 ? (
            <span>Cover more of the character outline</span>
          ) : (
            <span>Try to stay closer to the stroke outline</span>
          )}
          <span className="text-slate-500 dark:text-slate-400">({Math.round(score.cover * 100)}% coverage)</span>
        </div>
      )}
    </div>
  );
}
