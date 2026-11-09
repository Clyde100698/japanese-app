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
  | "sleepy"
  | "shocked"
  | "proud"
  | "laughing"
  | "gadget";

export interface MascotSpeech {
  ja?: string;
  romaji?: string;
  en: string;
}

export interface MascotProps {
  /** The expressive state of Aoi the Blue Spirit */
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
      : state === "laughing"
      ? "animate-mascot-laugh"
      : state === "shocked"
      ? "animate-mascot-shock"
      : state === "proud"
      ? "animate-mascot-proud"
      : state === "sleepy"
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
          <div className="relative rounded-2xl bg-white dark:bg-slate-800 px-3.5 py-2 shadow-lg ring-1 ring-slate-200/80 dark:ring-slate-700 min-w-[130px] max-w-[240px] text-center">
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

      {/* SVG Character: Aoi the Blue Creature */}
      <svg
        viewBox="0 0 120 120"
        width={px}
        height={px}
        className={`w-full h-full cursor-pointer transition-transform duration-200 ${animClass}`}
        onClick={handleMascotTap}
        role="img"
        aria-label={`Aoi the blue mascot - ${state} state`}
      >
        <defs>
          {/* Main Blue Body Gradients */}
          <radialGradient id={`aoi-body-${uid}`} cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </radialGradient>

          {/* Soft Muzzle/Cheek Cream-Blue */}
          <linearGradient id={`aoi-face-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EFF6FF" />
          </linearGradient>

          {/* Inner Ear Periwinkle / Cyan */}
          <linearGradient id={`aoi-ear-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BAE6FD" />
            <stop offset="100%" stopColor="#93C5FD" />
          </linearGradient>

          {/* Head Leaf Green */}
          <linearGradient id={`aoi-leaf-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Leather Satchel Brown */}
          <linearGradient id={`aoi-satchel-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Satchel Brass Buckle */}
          <linearGradient id={`aoi-buckle-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Cheek Blush */}
          <radialGradient id={`aoi-blush-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F472B6" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
          </radialGradient>

          {/* Gadget Radiance Gradient */}
          <radialGradient id={`aoi-beam-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE047" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>

          {/* Soft Drop Shadow */}
          <filter id={`aoi-shadow-${uid}`} x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="3.5" stdDeviation="3.5" floodColor="#0F172A" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Ambient Ground Shadow */}
        <ellipse cx="60" cy="112" rx="35" ry="6" fill="#0F172A" fillOpacity="0.12" />

        {/* GADGET REVEAL: Radiating Sunburst in Background */}
        {state === "gadget" && (
          <g className="animate-beam-spin" style={{ transformOrigin: "60px 50px" }}>
            <circle cx="60" cy="50" r="48" fill={`url(#aoi-beam-${uid})`} />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="60"
                y1="50"
                x2={60 + 44 * Math.cos((deg * Math.PI) / 180)}
                y2={50 + 44 * Math.sin((deg * Math.PI) / 180)}
                stroke="#FDE047"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.8"
              />
            ))}
          </g>
        )}

        {/* Plump Round Tail Behind Body */}
        <path
          d="M86 78 C98 74, 104 62, 98 54 C92 46, 82 52, 84 60"
          fill={`url(#aoi-body-${uid})`}
          stroke="#1E40AF"
          strokeWidth="1.5"
        />
        <circle cx="94" cy="56" r="4.5" fill="#BFDBFE" />

        {/* Left Pillowy Ear */}
        <g
          className={
            state === "happy" || state === "cheering" || state === "laughing"
              ? "animate-mascot-ear-left"
              : state === "listening"
              ? "origin-[34px_42px] -rotate-8"
              : state === "sad" || state === "sleepy"
              ? "origin-[34px_42px] rotate-14"
              : ""
          }
        >
          {/* Ear Outer */}
          <ellipse
            cx="32"
            cy="40"
            rx="12"
            ry="16"
            transform="rotate(-25 32 40)"
            fill={`url(#aoi-body-${uid})`}
            stroke="#1D4ED8"
            strokeWidth="1.5"
          />
          {/* Ear Inner Soft Powder Blue */}
          <ellipse
            cx="33"
            cy="40"
            rx="6.5"
            ry="10"
            transform="rotate(-25 33 40)"
            fill={`url(#aoi-ear-${uid})`}
          />
        </g>

        {/* Right Pillowy Ear */}
        <g
          className={
            state === "happy" || state === "cheering" || state === "laughing"
              ? "animate-mascot-ear-right"
              : state === "listening"
              ? "origin-[86px_42px] rotate-8"
              : state === "sad" || state === "sleepy"
              ? "origin-[86px_42px] -rotate-14"
              : ""
          }
        >
          {/* Ear Outer */}
          <ellipse
            cx="88"
            cy="40"
            rx="12"
            ry="16"
            transform="rotate(25 88 40)"
            fill={`url(#aoi-body-${uid})`}
            stroke="#1D4ED8"
            strokeWidth="1.5"
          />
          {/* Ear Inner Soft Powder Blue */}
          <ellipse
            cx="87"
            cy="40"
            rx="6.5"
            ry="10"
            transform="rotate(25 87 40)"
            fill={`url(#aoi-ear-${uid})`}
          />
        </g>

        {/* Main Chubby Body (Plump Pear/Dumpling Silhouette) */}
        <g filter={`url(#aoi-shadow-${uid})`}>
          <ellipse
            cx="60"
            cy="68"
            rx="42"
            ry="40"
            fill={`url(#aoi-body-${uid})`}
            stroke="#1D4ED8"
            strokeWidth="1.8"
          />

          {/* Lower Cheeks / Muzzle Patch (Clean rounded cream-blue highlight) */}
          <path
            d="M36 72 C34 94, 86 94, 84 72 C82 60, 68 58, 60 58 C52 58, 38 60, 36 72 Z"
            fill={`url(#aoi-face-${uid})`}
          />
        </g>

        {/* Distinctive Accessory 1: Sprouting Green Leaf on Head */}
        <g className="animate-leaf-sway">
          {/* Leaf stem */}
          <path d="M60 28 Q60 22 63 18" stroke="#047857" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Leaf body */}
          <path
            d="M63 18 C58 10, 74 6, 76 16 C76 22, 68 22, 63 18 Z"
            fill={`url(#aoi-leaf-${uid})`}
            stroke="#047857"
            strokeWidth="1"
          />
          {/* Leaf vein */}
          <path d="M64 18 Q69 14 74 12" stroke="#A7F3D0" strokeWidth="1" fill="none" opacity="0.8" />
        </g>

        {/* Distinctive Accessory 2: Crossbody Adventurer's Leather Satchel */}
        <g>
          {/* Diagonal Leather Strap across chest */}
          <path
            d="M34 52 Q60 76 86 92"
            stroke="#78350F"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M35 53 Q60 77 85 91"
            stroke="#B45309"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Leather Messenger Bag on hip */}
          <g transform="translate(74, 80) rotate(12)">
            <rect
              x="0"
              y="0"
              width="20"
              height="16"
              rx="4"
              fill={`url(#aoi-satchel-${uid})`}
              stroke="#451A03"
              strokeWidth="1.2"
            />
            {/* Flap */}
            <path
              d="M0 6 Q10 11 20 6"
              stroke="#451A03"
              strokeWidth="1.2"
              fill="none"
            />
            {/* Golden Brass Clasp */}
            <rect x="8.5" y="5" width="3" height="4" rx="1" fill={`url(#aoi-buckle-${uid})`} />
          </g>
        </g>

        {/* Soft Pink Airbrush Cheeks */}
        <circle cx="35" cy="74" r="7.5" fill={`url(#aoi-blush-${uid})`} />
        <circle cx="85" cy="74" r="7.5" fill={`url(#aoi-blush-${uid})`} />

        {/* Tiny Delicate Nose */}
        <ellipse cx="60" cy="67.5" rx="2" ry="1.4" fill="#0F172A" />

        {/* ========================================================================= */}
        {/* EYES PER STATE */}
        {/* ========================================================================= */}
        {state === "sleepy" ? (
          // Sleepy peaceful downward curve
          <g stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none">
            <path d="M41 64 Q46 68 51 64" />
            <path d="M69 64 Q74 68 79 64" />
          </g>
        ) : state === "happy" ? (
          // Cheerful smiling crescent eyes ^^
          <g stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" fill="none">
            <path d="M40 66 Q46 58 52 66" />
            <path d="M68 66 Q74 58 80 66" />
          </g>
        ) : state === "cheering" ? (
          // Star pupils for victory!
          <g>
            <circle cx="46" cy="63" r="7" fill="#0F172A" />
            <circle cx="74" cy="63" r="7" fill="#0F172A" />
            {/* Left Star pupil */}
            <path d="M46 59 Q46 63 49 63 Q46 63 46 67 Q46 63 43 63 Q46 63 46 59 Z" fill="#FDE047" />
            {/* Right Star pupil */}
            <path d="M74 59 Q74 63 77 63 Q74 63 74 67 Q74 63 71 63 Q74 63 74 59 Z" fill="#FDE047" />
          </g>
        ) : state === "sad" ? (
          // Big sad puppy waterdrop eyes
          <g>
            <circle cx="45" cy="64" r="6.8" fill="#0F172A" />
            <circle cx="75" cy="64" r="6.8" fill="#0F172A" />
            <circle cx="43" cy="62" r="2.8" fill="#FFFFFF" />
            <circle cx="73" cy="62" r="2.8" fill="#FFFFFF" />
            <circle cx="47" cy="66" r="1.5" fill="#93C5FD" />
            <circle cx="77" cy="66" r="1.5" fill="#93C5FD" />
            {/* Tear drop on right cheek */}
            <path
              d="M86 76 C86 79, 83 81, 83 83 C83 81, 80 79, 80 76 C80 74, 86 74, 86 76 Z"
              fill="#60A5FA"
            />
          </g>
        ) : state === "thinking" ? (
          // Looking up and to the right
          <g>
            <circle cx="46" cy="61" r="6.8" fill="#0F172A" />
            <circle cx="76" cy="61" r="6.8" fill="#0F172A" />
            <circle cx="48" cy="59" r="2.6" fill="#FFFFFF" />
            <circle cx="78" cy="59" r="2.6" fill="#FFFFFF" />
            <circle cx="45" cy="63" r="1.3" fill="#FFFFFF" />
            <circle cx="75" cy="63" r="1.3" fill="#FFFFFF" />
          </g>
        ) : state === "shocked" ? (
          // Anime shock: wide white eyes with small dot pupils
          <g>
            <circle cx="45" cy="62" r="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <circle cx="75" cy="62" r="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <circle cx="45" cy="62" r="2.5" fill="#0F172A" />
            <circle cx="75" cy="62" r="2.5" fill="#0F172A" />
          </g>
        ) : state === "proud" ? (
          // Smug / Proud closed eyes ^v^
          <g stroke="#0F172A" strokeWidth="2.6" strokeLinecap="round" fill="none">
            <path d="M40 64 L46 60 L52 64" />
            <path d="M68 64 L74 60 L80 64" />
          </g>
        ) : state === "laughing" ? (
          // Laughing with tears: squeezed shut eyes ><
          <g stroke="#0F172A" strokeWidth="2.8" strokeLinecap="round" fill="none">
            <path d="M40 60 L48 64 L40 68" />
            <path d="M80 60 L72 64 L80 68" />
          </g>
        ) : (
          // Standard / Idle / Listening / Gadget: big anime glossy eyes with natural blink
          <g className="animate-mascot-blink">
            <circle cx="45" cy="63" r="7" fill="#0F172A" />
            <circle cx="43" cy="61" r="2.8" fill="#FFFFFF" />
            <circle cx="47" cy="65" r="1.4" fill="#FFFFFF" />
            <circle cx="75" cy="63" r="7" fill="#0F172A" />
            <circle cx="73" cy="61" r="2.8" fill="#FFFFFF" />
            <circle cx="77" cy="65" r="1.4" fill="#FFFFFF" />
          </g>
        )}

        {/* ========================================================================= */}
        {/* MOUTH PER STATE */}
        {/* ========================================================================= */}
        {state === "speaking" ? (
          // Animated speaking mouth synchronized with TTS
          <g className="animate-mascot-talk" style={{ transformOrigin: "60px 73px" }}>
            <ellipse cx="60" cy="74" rx="4.5" ry="5.5" fill="#7F1D1D" />
            <path d="M57 75 Q60 77 63 75 Q60 79 57 75" fill="#F472B6" />
          </g>
        ) : state === "happy" || state === "cheering" || state === "gadget" ? (
          // Open cheerful smile showing tongue
          <g>
            <path
              d="M55 71 Q60 71 65 71 C65 76 55 76 55 71 Z"
              fill="#7F1D1D"
              stroke="#0F172A"
              strokeWidth="1.2"
            />
            <path d="M57 73 Q60 76 63 73" fill="#F472B6" />
          </g>
        ) : state === "laughing" ? (
          // Wide open laughing mouth
          <g>
            <path
              d="M52 70 Q60 69 68 70 C68 78 52 78 52 70 Z"
              fill="#7F1D1D"
              stroke="#0F172A"
              strokeWidth="1.5"
            />
            <ellipse cx="60" cy="75" rx="5" ry="2.5" fill="#F472B6" />
          </g>
        ) : state === "shocked" ? (
          // Small vertical oval mouth
          <ellipse cx="60" cy="75" rx="3.5" ry="6" fill="#7F1D1D" stroke="#0F172A" strokeWidth="1.5" />
        ) : state === "proud" ? (
          // Small confident upward smirk
          <path d="M57 71 Q63 74 65 70" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
        ) : state === "sad" ? (
          // Soft little wavy pout
          <path d="M56 74 Q60 71 64 74" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
        ) : state === "thinking" ? (
          // Small inquisitive 'o'
          <circle cx="60" cy="73" r="2.2" fill="#7F1D1D" />
        ) : state === "sleepy" ? (
          // Peaceful tiny smile
          <path d="M57 71 Q60 73 63 71" fill="none" stroke="#0F172A" strokeWidth="1.8" strokeLinecap="round" />
        ) : (
          // Default tiny cute 'w' cat-spirit mouth
          <path
            d="M55 71 Q57.5 73.5 60 71 Q62.5 73.5 65 71"
            fill="none"
            stroke="#0F172A"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        )}

        {/* Paws */}
        {state === "cheering" ? (
          // Paws raised high in victory!
          <g>
            <ellipse cx="30" cy="48" rx="6" ry="6" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1.2" />
            <ellipse cx="90" cy="48" rx="6" ry="6" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1.2" />
          </g>
        ) : state === "gadget" ? (
          // Right paw holding the magical golden study item!
          <g className="animate-gadget-reveal">
            <ellipse cx="44" cy="94" rx="6" ry="5.5" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1.2" />
            {/* Raised paw holding item */}
            <ellipse cx="78" cy="62" rx="6" ry="6" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1.2" />
            {/* Golden Study Scroll Gadget */}
            <g transform="translate(76, 44) rotate(-15)">
              <rect x="0" y="0" width="8" height="24" rx="3" fill="#FDE047" stroke="#D97706" strokeWidth="1.2" />
              <line x1="2" y1="5" x2="6" y2="5" stroke="#D97706" strokeWidth="1" />
              <line x1="2" y1="10" x2="6" y2="10" stroke="#D97706" strokeWidth="1" />
              <circle cx="4" cy="18" r="1.5" fill="#EF4444" />
            </g>
          </g>
        ) : state === "thinking" ? (
          // Right paw on chin
          <g>
            <ellipse cx="44" cy="94" rx="6.5" ry="5.5" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1.2" />
            <ellipse cx="68" cy="76" rx="5.5" ry="5.5" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1.2" />
          </g>
        ) : state === "proud" ? (
          // Paws placed proudly on hips
          <g>
            <ellipse cx="30" cy="72" rx="6" ry="5.5" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1.2" />
            <ellipse cx="88" cy="72" rx="6" ry="5.5" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1.2" />
          </g>
        ) : (
          // Resting front paws
          <g>
            <ellipse cx="44" cy="96" rx="6.5" ry="5.5" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1.2" />
            <ellipse cx="76" cy="96" rx="6.5" ry="5.5" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="1.2" />
          </g>
        )}

        {/* ========================================================================= */}
        {/* ATMOSPHERE PARTICLES & ACCESSORIES PER STATE */}
        {/* ========================================================================= */}

        {/* 1. Cheering / Gadget Stars */}
        {(state === "cheering" || state === "gadget") && (
          <g>
            <path
              d="M18 30 Q22 30 22 26 Q22 30 26 30 Q22 30 22 34 Q22 30 18 30 Z"
              fill="#F59E0B"
              className="animate-mascot-sparkle-1"
            />
            <path
              d="M96 24 Q101 24 101 19 Q101 24 106 24 Q101 24 101 29 Q101 24 96 24 Z"
              fill="#F59E0B"
              className="animate-mascot-sparkle-2"
            />
            <circle cx="104" cy="46" r="2.5" fill="#EC4899" className="animate-pulse" />
            <circle cx="14" cy="48" r="2.2" fill="#EC4899" className="animate-pulse" />
          </g>
        )}

        {/* 2. Sleepy Zzz */}
        {state === "sleepy" && (
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

        {/* 3. Thinking Bubble */}
        {state === "thinking" && (
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

        {/* 4. Listening Waves */}
        {state === "listening" && (
          <g stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8">
            <path d="M16 38 C14 44 14 52 16 58" />
            <path d="M10 34 C7 43 7 57 10 66" />
            <path d="M104 38 C106 44 106 52 104 58" />
            <path d="M110 34 C113 43 113 57 110 66" />
          </g>
        )}

        {/* 5. Shocked Manga Lines */}
        {state === "shocked" && (
          <g stroke="#3B82F6" strokeWidth="2" strokeLinecap="round">
            <line x1="48" y1="26" x2="48" y2="34" />
            <line x1="56" y1="24" x2="56" y2="34" />
            <line x1="64" y1="24" x2="64" y2="34" />
            <line x1="72" y1="26" x2="72" y2="34" />
          </g>
        )}

        {/* 6. Proud Sparkle Glint */}
        {state === "proud" && (
          <g>
            <path
              d="M94 56 Q98 56 98 52 Q98 56 102 56 Q98 56 98 60 Q98 56 94 56 Z"
              fill="#F59E0B"
              className="animate-mascot-sparkle-1"
            />
            <path
              d="M20 54 Q24 54 24 50 Q24 54 28 54 Q24 54 24 58 Q24 54 20 54 Z"
              fill="#F59E0B"
              className="animate-mascot-sparkle-2"
            />
          </g>
        )}

        {/* 7. Laughing-with-Tears Squirts */}
        {state === "laughing" && (
          <g fill="#60A5FA">
            <path
              d="M36 62 Q26 56 20 62 Q26 66 36 64 Z"
              className="animate-tear-left"
            />
            <path
              d="M84 62 Q94 56 100 62 Q94 66 84 64 Z"
              className="animate-tear-right"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
