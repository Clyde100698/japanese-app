"use client";
import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";

const BOX = 109; // KanjiVG coordinate box
const STROKE_MS = 700;
const GAP_MS = 250;

function startPoint(d: string): [number, number] | null {
  const m = /M\s*(-?[\d.]+)[ ,]\s*(-?[\d.]+)/.exec(d);
  return m ? [Number(m[1]), Number(m[2])] : null;
}

interface Props {
  /** One or more kana characters, e.g. "あ" or "きゃ". */
  text: string;
  strokes: Record<string, string[]>;
  className?: string;
}

/** Animated stroke order. Strokes are drawn one after another; tap Replay to watch again. */
export default function StrokeOrder({ text, strokes, className }: Props) {
  const [run, setRun] = useState(0);
  const chars = useMemo(() => [...text].filter((c) => strokes[c]), [text, strokes]);

  const paths = useMemo(() => {
    let n = 0;
    return chars.flatMap((c, ci) =>
      strokes[c].map((d) => ({ d, ci, n: n++, start: startPoint(d) })),
    );
  }, [chars, strokes]);

  if (!paths.length) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Stroke order isn&apos;t available for this character.</p>;
  }

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${BOX * chars.length} ${BOX}`}
        role="img"
        aria-label={`Stroke order for ${text}`}
        className="mx-auto w-full max-w-xs rounded-2xl bg-white dark:bg-slate-800 p-2 shadow-inner ring-1 ring-slate-200 dark:ring-slate-700"
      >
        {chars.map((_, ci) => (
          <g key={`guide-${ci}`} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth={1}>
            <line x1={BOX * ci + BOX / 2} y1={4} x2={BOX * ci + BOX / 2} y2={BOX - 4} strokeDasharray="3 3" />
            <line x1={BOX * ci + 4} y1={BOX / 2} x2={BOX * ci + BOX - 4} y2={BOX / 2} strokeDasharray="3 3" />
          </g>
        ))}
        {/* faint ghost of the finished character */}
        {paths.map((p) => (
          <path
            key={`ghost-${p.n}`}
            d={p.d}
            transform={`translate(${BOX * p.ci} 0)`}
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-700"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {/* animated strokes; the key restarts the CSS animation on replay */}
        <g key={run}>
          {paths.map((p) => {
            const delay = p.n * (STROKE_MS + GAP_MS);
            return (
              <g key={p.n} transform={`translate(${BOX * p.ci} 0)`}>
                <path
                  d={p.d}
                  pathLength={1}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-draw"
                  style={{ animationDelay: `${delay}ms`, animationDuration: `${STROKE_MS}ms` }}
                />
                {p.start && (
                  <text
                    x={p.start[0] - 6}
                    y={p.start[1] - 3}
                    fontSize={9}
                    fontWeight={700}
                    fill="#3b82f6"
                    className="stroke-label select-none"
                    style={{ animationDelay: `${delay}ms` }}
                  >
                    {p.n + 1 - paths.findIndex((q) => q.ci === p.ci)}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
      <div className="mt-3 flex items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400">
        <span>{paths.length} strokes</span>
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-4 font-medium text-slate-700 dark:text-slate-200 active:bg-slate-200 dark:active:bg-slate-700 transition"
        >
          <RotateCcw className="h-4 w-4" />
          Replay
        </button>
      </div>
    </div>
  );
}
