"use client";
import { useEffect, useState } from "react";
import { Heart, Flame, Gem, Volume2, VolumeX } from "lucide-react";
import { isMuted, toggleMuted } from "@/lib/sound";

interface Props {
  hearts?: number;
  maxHearts?: number;
  streak?: number;
  gems?: number;
  xp?: number;
  className?: string;
}

export default function GameHeader({
  hearts = 5,
  maxHearts = 5,
  streak = 5,
  gems = 180,
  xp = 450,
  className = "",
}: Props) {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(isMuted());
  }, []);

  const handleSoundToggle = () => {
    const next = toggleMuted();
    setMuted(next);
  };

  return (
    <div
      className={`flex items-center justify-between rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3.5 py-2 ring-1 ring-slate-200/80 dark:ring-slate-700/80 shadow-sm ${className}`}
    >
      {/* Hearts / Tries */}
      <div className="flex items-center gap-1.5" title={`${hearts}/${maxHearts} Hearts`}>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500">
          <Heart className="h-4 w-4 fill-rose-500 animate-pulse" />
        </div>
        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{hearts}</span>
      </div>

      {/* Streak Flame */}
      <div className="flex items-center gap-1.5" title={`${streak} Days Streak`}>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-500">
          <Flame className="h-4 w-4 fill-amber-500" />
        </div>
        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{streak}</span>
      </div>

      {/* Gems / Coins */}
      <div className="flex items-center gap-1.5" title={`${gems} Gems`}>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-500">
          <Gem className="h-4 w-4 fill-blue-500" />
        </div>
        <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">{gems}</span>
      </div>

      {/* Audio Mute/Unmute */}
      <button
        onClick={handleSoundToggle}
        className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition"
        aria-label={muted ? "Unmute sounds" : "Mute sounds"}
        title={muted ? "Sound muted" : "Sound active"}
      >
        {muted ? <VolumeX className="h-4 w-4 text-rose-500" /> : <Volume2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
      </button>
    </div>
  );
}

