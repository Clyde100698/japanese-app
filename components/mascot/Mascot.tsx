"use client";
import { useId, useState } from "react";
import { playMascotSqueak } from "@/lib/sound";

export type MascotState =
  | "idle"
  | "happy"
  | "cheering"
  | "sad"
  | "thinking"
  | "listening"
  | "speaking"
  | "sleeping";

export interface MascotSpeech {
  ja?: string;
  romaji?: string;
  en: string;
}

export interface MascotProps {
  /** The expressive state of Kuri the Shiba */
  state?: MascotState;
  /** Size preset or pixel number */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | number;
  /** Optional speech bubble message */
  speech?: string | MascotSpeech;
  /** Bubble placement relative to mascot */
  bubblePlacement?: "top" | "bottom" | "left" | "right";
  /** Tap to bounce and play sound */
  interactive?: boolean;
  /** Optional custom class */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

const SIZE_MAP = {
  sm: 48,
  md: 80,
  lg: 120,
  xl: 160,
  "2xl": 220,
};

export default function Mascot({
  state = "idle",
  size = "lg",
  speech,
  bubblePlacement = "top",
  interactive = true,
  className = "",
  onClick,
}: MascotProps) {
  const [isTapped, setIsTapped] = useState(false);
  const uid = useId().replace(/:/g, "-");

  const px = typeof size === "number" ? size : SIZE_MAP[size] || 120;

  const handleMascotTap = () => {
    if (interactive) {
      playMascotSqueak();
      setIsTapped(true);
      setTimeout(() => setIsTapped(false), 600);
    }
    onClick?.();
  };

  // State-specific animation class
  const animClass =
    state === "cheering" || state === "happy" || isTapped
      ? "animate-mascot-bounce"
      : state === "sleeping"
      ? ""
      : "animate-mascot-breathe";

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: px, height: px }}
    >
      {/* Speech Bubble */}
      {speech && (
        <div
          className={`absolute z-20 pointer-events-none transition-all duration-300 ${
            bubblePlacement === "top"
              ? "bottom-[92%] left-1/2 -translate-x-1/2 mb-2"
              : bubblePlacement === "bottom"
              ? "top-[95%] left-1/2 -translate-x-1/2 mt-2"
              : bubblePlacement === "left"
              ? "right-[95%] top-1/2 -translate-y-1/2 mr-2"
              : "left-[95%] top-1/2 -translate-y-1/2 ml-2"
          }`}
        >
          <div className="relative rounded-2xl bg-white dark:bg-slate-800 px-3.5 py-2 shadow-lg ring-1 ring-slate-200/80 dark:ring-slate-700 min-w-[120px] max-w-[220px] text-center">
            {typeof speech === "string" ? (
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{speech}</p>
            ) : (
              <div>
                {speech.ja && (
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400" lang="ja">
                    {speech.ja}
                  </p>
                )}
                {speech.romaji && (
                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                    {speech.romaji}
                  </p>
                )}
                <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                  {speech.en}
                </p>
              </div>
            )}
            {/* Bubble Tail */}
            <div
              className={`absolute h-2.5 w-2.5 rotate-45 bg-white dark:bg-slate-800 ring-1 ring-slate-200/80 dark:ring-slate-700 ${
                bubblePlacement === "top"
                  ? "-bottom-1.5 left-1/2 -translate-x-1/2 border-t-0 border-l-0"
                  : bubblePlacement === "bottom"
                  ? "-top-1.5 left-1/2 -translate-x-1/2 border-b-0 border-r-0"
                  : bubblePlacement === "left"
                  ? "-right-1.5 top-1/2 -translate-y-1/2 border-b-0 border-l-0"
                  : "-left-1.5 top-1/2 -translate-y-1/2 border-t-0 border-r-0"
              }`}
            />
          </div>
        </div>
      )}

      {/* SVG Character */}
      <svg
        viewBox="0 0 120 120"
        width={px}
        height={px}
        className={`w-full h-full cursor-pointer transition-transform duration-200 ${animClass}`}
        onClick={handleMascotTap}
        role="img"
        aria-label={`Kuri the Shiba Inu mascot - ${state} state`}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id={`kuri-fur-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          <linearGradient id={`kuri-cream-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FEF3C7" />
          </linearGradient>

          <radialGradient id={`kuri-blush-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F472B6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
          </radialGradient>

          <linearGradient id={`kuri-ear-inner-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FBCFE8" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>

          <linearGradient id={`kuri-bandana-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>

          <radialGradient id={`kuri-bell-${uid}`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#CA8A04" />
          </radialGradient>

          {/* Soft Shadow Filter */}
          <filter id={`kuri-shadow-${uid}`} x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Ground Ambient Shadow */}
        <ellipse cx="60" cy="112" rx="34" ry="5.5" fill="#000000" fillOpacity="0.12" />

        {/* Curled Tail (Behind Body) */}
        <path
          d="M84 75 C96 68, 102 54, 96 46 C90 38, 80 44, 82 50 C84 56, 88 58, 86 64"
          fill="none"
          stroke={`url(#kuri-fur-${uid})`}
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M93 47 C91 43, 85 45, 84 48"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Left Ear */}
        <g
          className={
            state === "happy" || state === "cheering"
              ? "animate-mascot-ear-left"
              : state === "listening"
              ? "origin-[35px_45px] -rotate-6"
              : state === "sad" || state === "sleeping"
              ? "origin-[35px_45px] rotate-12"
              : ""
          }
        >
          {/* Ear Outer */}
          <path
            d="M24 50 C22 28, 38 18, 44 38 Z"
            fill={`url(#kuri-fur-${uid})`}
            stroke="#B45309"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Ear Inner Pink */}
          <path
            d="M28 47 C27 34, 37 28, 41 40 Z"
            fill={`url(#kuri-ear-inner-${uid})`}
          />
        </g>

        {/* Right Ear */}
        <g
          className={
            state === "happy" || state === "cheering"
              ? "animate-mascot-ear-right"
              : state === "listening"
              ? "origin-[85px_45px] rotate-6"
              : state === "sad" || state === "sleeping"
              ? "origin-[85px_45px] -rotate-12"
              : ""
          }
        >
          {/* Ear Outer */}
          <path
            d="M96 50 C98 28, 82 18, 76 38 Z"
            fill={`url(#kuri-fur-${uid})`}
            stroke="#B45309"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Ear Inner Pink */}
          <path
            d="M92 47 C93 34, 83 28, 79 40 Z"
            fill={`url(#kuri-ear-inner-${uid})`}
          />
        </g>

        {/* Main Chubby Body & Head (Egg shape) */}
        <g filter={`url(#kuri-shadow-${uid})`}>
          <ellipse
            cx="60"
            cy="68"
            rx="40"
            ry="38"
            fill={`url(#kuri-fur-${uid})`}
            stroke="#B45309"
            strokeWidth="1.5"
          />

          {/* White / Cream Muzzle & Chest Patch */}
          <path
            d="M32 74 C30 96, 90 96, 88 74 C86 58, 70 54, 60 54 C50 54, 34 58, 32 74 Z"
            fill={`url(#kuri-cream-${uid})`}
          />
        </g>

        {/* White Forehead Markings (Classic Shiba Urajiro eyebrows) */}
        <ellipse cx="44" cy="50" rx="3.5" ry="4.5" fill="#FFFFFF" fillOpacity="0.9" />
        <ellipse cx="76" cy="50" rx="3.5" ry="4.5" fill="#FFFFFF" fillOpacity="0.9" />

        {/* Rosy Cheeks */}
        <circle cx="34" cy="74" r="7.5" fill={`url(#kuri-blush-${uid})`} />
        <circle cx="86" cy="74" r="7.5" fill={`url(#kuri-blush-${uid})`} />

        {/* Little Nose */}
        <path
          d="M56.5 67 C56.5 65.5, 63.5 65.5, 63.5 67 C63.5 70, 56.5 70, 56.5 67 Z"
          fill="#1E293B"
        />
        <ellipse cx="58.5" cy="66.5" rx="1.2" ry="0.6" fill="#FFFFFF" fillOpacity="0.6" />

        {/* --- EYES PER STATE --- */}
        {state === "sleeping" ? (
          // Sleeping curved eyes
          <g stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none">
            <path d="M40 65 Q45 69 50 65" />
            <path d="M70 65 Q75 69 80 65" />
          </g>
        ) : state === "happy" || state === "cheering" ? (
          // Cheerful smiling crescent eyes ^^
          <g stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" fill="none">
            <path d="M40 66 Q45 59 50 66" />
            <path d="M70 66 Q75 59 80 66" />
          </g>
        ) : state === "sad" ? (
          // Sad / encouraging droopy eyes with glistening shine
          <g>
            <circle cx="45" cy="64" r="6.5" fill="#1E293B" />
            <circle cx="75" cy="64" r="6.5" fill="#1E293B" />
            <circle cx="43" cy="62" r="2.8" fill="#FFFFFF" />
            <circle cx="73" cy="62" r="2.8" fill="#FFFFFF" />
            <circle cx="47" cy="66" r="1.5" fill="#60A5FA" fillOpacity="0.8" />
            <circle cx="77" cy="66" r="1.5" fill="#60A5FA" fillOpacity="0.8" />
            {/* Tear drop on right cheek */}
            <path
              d="M87 75 C87 78, 84 80, 84 82 C84 80, 81 78, 81 75 C81 73, 87 73, 87 75 Z"
              fill="#60A5FA"
              fillOpacity="0.85"
            />
          </g>
        ) : state === "thinking" ? (
          // Looking up and to the right
          <g>
            <circle cx="46" cy="61" r="6.5" fill="#1E293B" />
            <circle cx="76" cy="61" r="6.5" fill="#1E293B" />
            <circle cx="48" cy="59" r="2.6" fill="#FFFFFF" />
            <circle cx="78" cy="59" r="2.6" fill="#FFFFFF" />
            <circle cx="45" cy="63" r="1.2" fill="#FFFFFF" />
            <circle cx="75" cy="63" r="1.2" fill="#FFFFFF" />
          </g>
        ) : (
          // Standard big anime glossy eyes with natural blink
          <g className="animate-mascot-blink">
            {/* Left Eye */}
            <circle cx="45" cy="63" r="6.8" fill="#0F172A" />
            <circle cx="43" cy="61" r="2.8" fill="#FFFFFF" />
            <circle cx="47" cy="65" r="1.3" fill="#FFFFFF" />
            {/* Right Eye */}
            <circle cx="75" cy="63" r="6.8" fill="#0F172A" />
            <circle cx="73" cy="61" r="2.8" fill="#FFFFFF" />
            <circle cx="77" cy="65" r="1.3" fill="#FFFFFF" />
          </g>
        )}

        {/* --- MOUTH PER STATE --- */}
        {state === "speaking" ? (
          // Animated speaking mouth
          <g className="animate-mascot-talk" style={{ transformOrigin: "60px 73px" }}>
            <ellipse cx="60" cy="74" rx="4.5" ry="5.5" fill="#7F1D1D" />
            <path d="M57 75 Q60 77 63 75 Q60 79 57 75" fill="#F472B6" />
          </g>
        ) : state === "happy" || state === "cheering" ? (
          // Open cheerful mouth with pink tongue
          <g>
            <path
              d="M54 71 Q60 71 66 71 C66 76 54 76 54 71 Z"
              fill="#7F1D1D"
              stroke="#1E293B"
              strokeWidth="1.2"
            />
            <path d="M57 73 Q60 76 63 73" fill="#F472B6" />
          </g>
        ) : state === "sad" ? (
          // Small pout
          <path
            d="M56 74 Q60 71 64 74"
            fill="none"
            stroke="#1E293B"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ) : state === "thinking" ? (
          // Curious small 'o'
          <circle cx="60" cy="73" r="2.2" fill="#7F1D1D" />
        ) : state === "sleeping" ? (
          // Tiny peaceful smile
          <path
            d="M57 71 Q60 73 63 71"
            fill="none"
            stroke="#1E293B"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        ) : (
          // Default cute 'w' cat-puppy smile
          <path
            d="M54 71 Q57 74 60 71 Q63 74 66 71"
            fill="none"
            stroke="#1E293B"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        )}

        {/* Red Bandana Scarf */}
        <path
          d="M40 88 C40 88, 50 94, 60 94 C70 94, 80 88, 80 88 C80 93, 70 102, 60 102 C50 102, 40 93, 40 88 Z"
          fill={`url(#kuri-bandana-${uid})`}
        />
        {/* Scarf fold lines */}
        <path
          d="M42 89 Q60 95 78 89"
          fill="none"
          stroke="#B91C1C"
          strokeWidth="1.5"
        />

        {/* Golden Jingle Bell */}
        <circle cx="60" cy="98" r="4.8" fill={`url(#kuri-bell-${uid})`} stroke="#A16207" strokeWidth="0.8" />
        <circle cx="60" cy="99" r="1.1" fill="#78350F" />
        <line x1="57" y1="97" x2="63" y2="97" stroke="#78350F" strokeWidth="0.8" />

        {/* Paws */}
        {state === "cheering" ? (
          // Paws raised high in victory!
          <g>
            <ellipse cx="32" cy="50" rx="6.5" ry="6" fill="#FFFFFF" stroke="#B45309" strokeWidth="1.2" />
            <ellipse cx="88" cy="50" rx="6.5" ry="6" fill="#FFFFFF" stroke="#B45309" strokeWidth="1.2" />
          </g>
        ) : state === "thinking" ? (
          // Right paw touching chin
          <g>
            <ellipse cx="44" cy="96" rx="6.5" ry="5.5" fill="#FFFFFF" stroke="#B45309" strokeWidth="1.2" />
            <ellipse cx="68" cy="78" rx="6" ry="6" fill="#FFFFFF" stroke="#B45309" strokeWidth="1.2" />
          </g>
        ) : (
          // Resting cute front paws
          <g>
            <ellipse cx="44" cy="98" rx="7" ry="5.5" fill="#FFFFFF" stroke="#B45309" strokeWidth="1.2" />
            <ellipse cx="76" cy="98" rx="7" ry="5.5" fill="#FFFFFF" stroke="#B45309" strokeWidth="1.2" />
          </g>
        )}

        {/* --- ATMOSPHERE PARTICLES PER STATE --- */}
        {state === "cheering" && (
          // Star sparkles radiating
          <g>
            {/* Top Left Star */}
            <path
              d="M18 30 Q22 30 22 26 Q22 30 26 30 Q22 30 22 34 Q22 30 18 30 Z"
              fill="#F59E0B"
              className="animate-mascot-sparkle-1"
            />
            {/* Top Right Star */}
            <path
              d="M96 24 Q101 24 101 19 Q101 24 106 24 Q101 24 101 29 Q101 24 96 24 Z"
              fill="#F59E0B"
              className="animate-mascot-sparkle-2"
            />
            {/* Tiny Pink Sparkle */}
            <circle cx="104" cy="46" r="2.2" fill="#EC4899" className="animate-pulse" />
            <circle cx="14" cy="48" r="2" fill="#EC4899" className="animate-pulse" />
          </g>
        )}

        {state === "sleeping" && (
          // Floating animated Zzz
          <g fill="#A855F7" fontWeight="bold" fontFamily="sans-serif">
            <text x="82" y="44" fontSize="11" className="animate-mascot-zzz-1">
              z
            </text>
            <text x="91" y="34" fontSize="13" className="animate-mascot-zzz-2">
              z
            </text>
            <text x="101" y="22" fontSize="16" className="animate-mascot-zzz-3">
              Z
            </text>
          </g>
        )}

        {state === "thinking" && (
          // Floating thought bubble with question mark
          <g>
            <circle cx="86" cy="38" r="2.5" fill="#93C5FD" opacity="0.8" />
            <circle cx="93" cy="31" r="4" fill="#93C5FD" opacity="0.9" />
            <circle cx="103" cy="22" r="8" fill="#3B82F6" />
            <text
              x="103"
              y="26"
              fontSize="11"
              fontWeight="bold"
              fill="#FFFFFF"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              ?
            </text>
          </g>
        )}

        {state === "listening" && (
          // Sound wave ripples around ears
          <g stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8">
            <path d="M16 38 C14 44 14 52 16 58" />
            <path d="M10 34 C7 43 7 57 10 66" />
            <path d="M104 38 C106 44 106 52 104 58" />
            <path d="M110 34 C113 43 113 57 110 66" />
          </g>
        )}
      </svg>
    </div>
  );
}

