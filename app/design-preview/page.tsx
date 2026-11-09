"use client";
import { useState } from "react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Heart,
  Flame,
  Gem,
  Award,
  Volume2,
  Lock,
  Star,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Palette,
  Layers,
  ArrowRight,
  Smile,
  Mic,
  Eye,
} from "lucide-react";
import Mascot, { type MascotState } from "@/components/mascot/Mascot";
import Button3D from "@/components/game/Button3D";
import GameHeader from "@/components/game/GameHeader";
import BackgroundPatterns from "@/components/mascot/BackgroundPatterns";
import KanaMnemonicCard, { type KanaMnemonic } from "@/components/mascot/KanaMnemonicCard";
import {
  playTapSound,
  playCorrectSound,
  playWrongSound,
  playCelebrateSound,
  playMascotSqueak,
  triggerHaptic,
} from "@/lib/sound";
import { speak } from "@/lib/speech";

export default function DesignPreviewPage() {
  // Playground state
  const [activeMascotState, setActiveMascotState] = useState<MascotState>("idle");
  const [mascotSize, setMascotSize] = useState<"sm" | "md" | "lg" | "xl">("lg");
  const [customSpeechJa, setCustomSpeechJa] = useState("がんばって！");
  const [customSpeechEn, setCustomSpeechEn] = useState("You can do it!");
  const [bgPattern, setBgPattern] = useState<"seigaiha" | "sakura" | "clouds">("seigaiha");

  // Sample Quiz state
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizVerdict, setQuizVerdict] = useState<"ok" | "bad" | null>(null);

  // Confetti trigger
  const triggerConfetti = () => {
    playCelebrateSound();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3B82F6", "#F59E0B", "#EC4899", "#10B981", "#6366F1"],
    });
  };

  // Sample illustrated mnemonics for vowels あ, い, う, え, お
  const SAMPLE_MNEMONICS: KanaMnemonic[] = [
    {
      kana: "あ",
      romaji: "a",
      item: "Apple",
      itemJa: "りんご",
      concept: "Look at あ: it looks like a round red apple hanging from a branch!",
      svgArt: (
        <svg viewBox="0 0 60 60" className="h-16 w-16">
          <circle cx="30" cy="34" r="18" fill="#EF4444" />
          <path d="M30 16 C30 10, 36 8, 38 6" stroke="#78350F" strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="40" cy="14" rx="6" ry="3" fill="#10B981" transform="rotate(-20 40 14)" />
          <circle cx="24" cy="28" r="3" fill="#FFFFFF" opacity="0.6" />
        </svg>
      ),
    },
    {
      kana: "い",
      romaji: "i",
      item: "Two Eels",
      itemJa: "うなぎ",
      concept: "Two vertical strokes swimming side by side like two friendly eels!",
      svgArt: (
        <svg viewBox="0 0 60 60" className="h-16 w-16">
          <path d="M20 16 C18 28, 20 42, 23 48" stroke="#3B82F6" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M40 22 C42 32, 41 40, 39 46" stroke="#60A5FA" strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="21" cy="20" r="1.5" fill="#FFFFFF" />
          <circle cx="41" cy="26" r="1.5" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      kana: "う",
      romaji: "u",
      item: "Lifting Upward",
      itemJa: "持ち上げる",
      concept: "A weightlifter bent over under a barbell, pushing Upwards (u)!",
      svgArt: (
        <svg viewBox="0 0 60 60" className="h-16 w-16">
          <line x1="16" y1="18" x2="44" y2="18" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
          <circle cx="16" cy="18" r="4" fill="#D97706" />
          <circle cx="44" cy="18" r="4" fill="#D97706" />
          <path d="M30 20 C24 30, 24 44, 38 46" stroke="#2563EB" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      kana: "え",
      romaji: "e",
      item: "Exercising",
      itemJa: "運動",
      concept: "An energetic runner with arms bent, exercising along the path!",
      svgArt: (
        <svg viewBox="0 0 60 60" className="h-16 w-16">
          <circle cx="34" cy="14" r="5" fill="#EC4899" />
          <path d="M22 28 L32 26 L42 34" stroke="#F43F5E" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M30 26 L26 44 L38 48" stroke="#2563EB" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      kana: "お",
      romaji: "o",
      item: "On the green",
      itemJa: "ゴルフ",
      concept: "A golf player hitting a ball right On (o) the green!",
      svgArt: (
        <svg viewBox="0 0 60 60" className="h-16 w-16">
          <circle cx="44" cy="24" r="4" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
          <path d="M20 22 L38 22" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
          <path d="M28 14 L28 46 Q34 46 38 40 Q40 32 30 32" stroke="#059669" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen pb-24 space-y-12 overflow-hidden">
      {/* Subtle Japanese Pattern Overlay */}
      <BackgroundPatterns variant={bgPattern} opacity={0.05} />

      {/* Hero Header */}
      <div className="relative z-10 text-center max-w-2xl mx-auto pt-4 space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-1 ring-blue-300 dark:ring-blue-800">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          Redesign Proposal &amp; Interactive Preview
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Cute, Alive &amp; Game-Like
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto">
          Explore the new original blue mascot **Aoi (あおい)** with a head leaf &amp; adventurer satchel, chunky 3D
          pressed buttons, Web Audio chimes, and three interactive sample screens.
        </p>

        {/* Quick Nav Anchors */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {[
            { id: "mascot", label: "💙 Mascot States (12)" },
            { id: "palette", label: "🎨 Color Palette" },
            { id: "buttons", label: "🕹️ 3D Buttons" },
            { id: "screen-path", label: "🗺️ Lesson Path" },
            { id: "screen-quiz", label: "❓ Juicy Quiz" },
            { id: "screen-complete", label: "🏆 Complete Screen" },
            { id: "kana", label: "🈸 Illustrated Kana" },
          ].map((nav) => (
            <a
              key={nav.id}
              href={`#${nav.id}`}
              className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm transition"
            >
              {nav.label}
            </a>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: MASCOT PLAYGROUND */}
      {/* ========================================================================= */}
      <section id="mascot" className="relative z-10 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Smile className="h-5 w-5 text-blue-600" />
              Meet &quot;Aoi&quot; (あおい) the Blue Spirit Mascot
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              100% original, round, chubby blue creature with a head leaf, crossbody messenger satchel, and 12 animated expressions.
            </p>
          </div>
        </div>

        {/* Live Interactive Stage */}
        <div className="rounded-3xl bg-gradient-to-b from-blue-50/70 via-white to-indigo-50/40 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-8 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 flex flex-col items-center justify-center relative min-h-[300px]">
          <Mascot
            state={activeMascotState}
            size={mascotSize}
            speech={{ ja: customSpeechJa, en: customSpeechEn }}
            bubblePlacement="top"
            interactive={true}
          />
          <p className="text-[11px] font-semibold text-slate-400 mt-6 animate-pulse">
            👆 Tap Aoi to hear a cute squeak &amp; watch a springy bounce!
          </p>
        </div>

        {/* State Selector Buttons (All 12 States) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Expression to Animate (12 States)
            </span>
            <button
              onClick={() => {
                setActiveMascotState("gadget");
                setCustomSpeechJa("今日の道具はこれ！");
                setCustomSpeechEn("Here's today's lesson gadget!");
                playCelebrateSound();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 ring-1 ring-amber-300 dark:ring-amber-800 hover:scale-105 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              ✨ Play Gadget Reveal
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(
              [
                { state: "idle", label: "Idle (Blink/Breathe)", ja: "いっしょに学ぼう！", en: "Let's learn together!" },
                { state: "happy", label: "Happy (Bouncy)", ja: "いいね！", en: "Great work!" },
                { state: "cheering", label: "Cheering (Stars)", ja: "やったー！", en: "You did it!" },
                { state: "sad", label: "Encouraging (Sad)", ja: "がんばって！", en: "Don't give up!" },
                { state: "thinking", label: "Thinking (Bubble)", ja: "うーん、どれかな？", en: "Hmm, let's see..." },
                { state: "listening", label: "Listening (Waves)", ja: "聞いてるよ！", en: "I'm listening!" },
                { state: "speaking", label: "Speaking (Mouth)", ja: "よく聞いてね", en: "Listen closely!" },
                { state: "sleepy", label: "Sleepy (Zzz)", ja: "今日もお勉強する？", en: "Study a bit today?" },
                { state: "shocked", label: "Shocked (Anime)", ja: "びっくり！", en: "Whoa, that was tricky!" },
                { state: "proud", label: "Proud (Smug Smirk)", ja: "さすが！", en: "Nailed it! So smart!" },
                { state: "laughing", label: "Laughing (Tears)", ja: "あはは、楽しい！", en: "Haha, having so much fun!" },
                { state: "gadget", label: "Gadget Reveal (Beams)", ja: "今日の道具はこれ！", en: "Here's today's lesson gadget!" },
              ] as const
            ).map((item) => {
              const active = activeMascotState === item.state;
              return (
                <button
                  key={item.state}
                  onClick={() => {
                    setActiveMascotState(item.state);
                    setCustomSpeechJa(item.ja);
                    setCustomSpeechEn(item.en);
                    if (item.state === "gadget") playCelebrateSound();
                    else playTapSound();
                  }}
                  className={`min-h-12 rounded-2xl p-2.5 text-left transition ring-1 ${
                    active
                      ? "bg-blue-600 text-white ring-blue-700 shadow-md font-bold scale-[1.02]"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 ring-slate-200 dark:ring-slate-700 hover:ring-blue-400 font-medium"
                  }`}
                >
                  <p className="text-xs">{item.label}</p>
                  <p className={`text-[10px] mt-0.5 ${active ? "text-blue-100" : "text-slate-400"}`} lang="ja">
                    {item.ja}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Simultaneous 12-State Showcase Grid */}
        <div className="rounded-3xl bg-white dark:bg-slate-800 p-6 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            All 12 Expressive Expressions at a Glance
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {(
              [
                { s: "idle", name: "1. Idle", desc: "Blink & breathe" },
                { s: "happy", name: "2. Happy", desc: "Crescents ^^" },
                { s: "cheering", name: "3. Cheering", desc: "Star pupils" },
                { s: "sad", name: "4. Encourage", desc: "Tear shine" },
                { s: "thinking", name: "5. Thinking", desc: "Eyes up & bubble" },
                { s: "listening", name: "6. Listening", desc: "Sound ripples" },
                { s: "speaking", name: "7. Speaking", desc: "TTS mouth sync" },
                { s: "sleepy", name: "8. Sleepy", desc: "Floating Zzz" },
                { s: "shocked", name: "9. Shocked", desc: "Manga shock" },
                { s: "proud", name: "10. Proud", desc: "Smug smirk ^v^" },
                { s: "laughing", name: "11. Laughing", desc: "Tear squirts ><" },
                { s: "gadget", name: "12. Gadget", desc: "Scroll & beams" },
              ] as const
            ).map((card) => (
              <div
                key={card.s}
                className="flex flex-col items-center text-center p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 ring-1 ring-slate-200/60 dark:ring-slate-800"
              >
                <Mascot state={card.s} size={56} interactive={false} />
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 mt-1.5">
                  {card.name}
                </span>
                <span className="text-[9px] text-slate-400 leading-tight">{card.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: COLOR PALETTE & PATTERNS */}
      {/* ========================================================================= */}
      <section id="palette" className="relative z-10 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Palette className="h-5 w-5 text-blue-600" />
              Color Palette &amp; Japanese Patterns
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Blue primary with sunny yellow and sakura pink accents, plus subtle Japanese SVG patterns.
            </p>
          </div>

          {/* Pattern Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            {(["seigaiha", "sakura", "clouds"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setBgPattern(p)}
                className={`px-2.5 py-1 rounded-lg capitalize transition ${
                  bgPattern === p
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Primary Blue */}
          <div className="rounded-2xl bg-blue-600 p-4 text-white shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Primary Brand
            </span>
            <div className="text-lg font-extrabold">#2563EB</div>
            <p className="text-xs text-blue-100">Main action blue, headers, navigation</p>
          </div>

          {/* Sunny Yellow */}
          <div className="rounded-2xl bg-amber-500 p-4 text-white shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Sunny Warm
            </span>
            <div className="text-lg font-extrabold">#F59E0B</div>
            <p className="text-xs text-amber-100">Stars, coins, streak fire, XP level</p>
          </div>

          {/* Sakura Pink */}
          <div className="rounded-2xl bg-pink-500 p-4 text-white shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-200">
              Sakura Pink
            </span>
            <div className="text-lg font-extrabold">#EC4899</div>
            <p className="text-xs text-pink-100">Confetti, hearts, celebration moments</p>
          </div>

          {/* Emerald Success */}
          <div className="rounded-2xl bg-emerald-600 p-4 text-white shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Game Emerald
            </span>
            <div className="text-lg font-extrabold">#10B981</div>
            <p className="text-xs text-emerald-100">Correct answers, masteries, complete</p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: 3D BUTTONS & SOUND JUICE */}
      {/* ========================================================================= */}
      <section id="buttons" className="relative z-10 max-w-3xl mx-auto space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-500" />
            Juicy 3D Pressed Buttons &amp; Sound Chimes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tactile buttons with offset bottom borders, springy depress motion, haptic feedback, and pure Web Audio tones.
          </p>
        </div>

        {/* Button Showcase Grid */}
        <div className="rounded-3xl bg-white dark:bg-slate-800 p-6 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button3D variant="primary" iconRight={<ArrowRight className="h-4 w-4" />}>
              Primary 3D Blue
            </Button3D>

            <Button3D variant="accent" iconLeft={<Flame className="h-4 w-4" />}>
              Sunny Gold 3D
            </Button3D>

            <Button3D variant="sakura" iconLeft={<Heart className="h-4 w-4" />}>
              Sakura Pink 3D
            </Button3D>

            <Button3D variant="success" iconRight={<CheckCircle2 className="h-4 w-4" />}>
              Success Green 3D
            </Button3D>

            <Button3D variant="neutral">Neutral White 3D</Button3D>

            <Button3D variant="primary" size="sm">
              Small Size Pill
            </Button3D>
          </div>

          {/* Sound Synthesizer Test Bench */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Web Audio Synthesizer (Instant Offline Chimes)
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={playTapSound}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-bold hover:bg-slate-200 transition"
              >
                🔊 Tap Pop (440Hz)
              </button>
              <button
                onClick={playCorrectSound}
                className="px-3 py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-200 transition"
              >
                ✨ Correct Chime (C5-C6)
              </button>
              <button
                onClick={playWrongSound}
                className="px-3 py-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-200 transition"
              >
                🔔 Gentle Boing (Friendly)
              </button>
              <button
                onClick={playCelebrateSound}
                className="px-3 py-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-200 transition"
              >
                🎺 Fanfare (Victory)
              </button>
              <button
                onClick={playMascotSqueak}
                className="px-3 py-2 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-xs font-bold hover:bg-pink-200 transition"
              >
                🐶 Mascot Squeak
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: SAMPLE SCREEN 1 — THE WINDING LESSON PATH */}
      {/* ========================================================================= */}
      <section id="screen-path" className="relative z-10 max-w-md mx-auto space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Sample Screen 1
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Winding Lesson Path (World Map)
          </h2>
          <p className="text-xs text-slate-500">
            Nodes with stars, themed unit banners, and Aoi walking along the path!
          </p>
        </div>

        {/* Mobile Device Frame */}
        <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-xl space-y-4 relative overflow-hidden">
          {/* Top Game HUD */}
          <GameHeader hearts={5} streak={5} gems={240} xp={380} />

          {/* Themed Unit Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                Unit 1 · Hiragana Basics
              </span>
              <span className="text-xs font-bold">2 / 5 Done</span>
            </div>
            <h3 className="text-base font-extrabold">Greetings Town (あいさつの街)</h3>
            <p className="text-xs text-blue-100">Master vowels, greeting phrases, and first words.</p>
          </div>

          {/* Winding Path Nodes */}
          <div className="relative py-4 flex flex-col items-center space-y-6">
            {/* Dotted connecting line */}
            <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-1 border-r-2 border-dashed border-blue-300 dark:border-blue-800 z-0" />

            {/* Node 1: Completed with 3 Stars */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex gap-0.5 mb-1 text-amber-400">
                <Star className="h-3 w-3 fill-amber-400" />
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                <Star className="h-3 w-3 fill-amber-400" />
              </div>
              <button
                onClick={playCorrectSound}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white font-extrabold text-xl shadow-md ring-4 ring-emerald-100 dark:ring-emerald-950 btn-3d"
                style={{ borderBottom: "4px solid #059669" }}
              >
                ✓
              </button>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                Lesson 1 (あいうえお)
              </span>
            </div>

            {/* Node 2: Completed with 2 Stars */}
            <div className="relative z-10 flex flex-col items-center translate-x-10">
              <div className="flex gap-0.5 mb-1 text-amber-400">
                <Star className="h-3 w-3 fill-amber-400" />
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                <Star className="h-3 w-3 text-slate-300" />
              </div>
              <button
                onClick={playCorrectSound}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white font-extrabold text-xl shadow-md ring-4 ring-emerald-100 dark:ring-emerald-950 btn-3d"
                style={{ borderBottom: "4px solid #059669" }}
              >
                ✓
              </button>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1">
                Lesson 2 (かきくけこ)
              </span>
            </div>

            {/* Node 3: Current Active Pulsing Node with Mascot beside it! */}
            <div className="relative z-10 flex items-center gap-3 -translate-x-4">
              <div className="flex flex-col items-center">
                <div className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 rounded-full mb-1">
                  START
                </div>
                <button
                  onClick={playTapSound}
                  className="flex h-18 w-18 items-center justify-center rounded-full bg-blue-600 text-white font-extrabold text-2xl shadow-lg ring-4 ring-blue-300 dark:ring-blue-700 animate-pulse-glow btn-3d-blue"
                >
                  <Star className="h-7 w-7 fill-white" />
                </button>
                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                  Lesson 3 (さしすせそ)
                </span>
              </div>

              {/* Mascot standing at active node */}
              <Mascot
                state="happy"
                size={80}
                speech="Ready for Lesson 3?"
                bubblePlacement="right"
                interactive={true}
              />
            </div>

            {/* Node 4: Locked Node */}
            <div className="relative z-10 flex flex-col items-center translate-x-8 opacity-60">
              <button
                disabled
                className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-400 shadow-inner"
              >
                <Lock className="h-5 w-5" />
              </button>
              <span className="text-xs font-medium text-slate-400 mt-1">Lesson 4 (たちつてと)</span>
            </div>

            {/* Node 5: Reward Chest */}
            <div className="relative z-10 flex flex-col items-center opacity-60">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/40 text-amber-500 shadow-inner">
                <Award className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-slate-400 mt-1">Unit 1 Trophy</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: SAMPLE SCREEN 2 — JUICY QUIZ QUESTION */}
      {/* ========================================================================= */}
      <section id="screen-quiz" className="relative z-10 max-w-md mx-auto space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Sample Screen 2
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Juicy Game-Like Quiz
          </h2>
          <p className="text-xs text-slate-500">
            Chunky 3D options, hearts HUD, real-time mascot cheering/encouragement, and sound chime.
          </p>
        </div>

        {/* Mobile Device Frame */}
        <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-4 ring-1 ring-slate-200 dark:ring-slate-800 shadow-xl space-y-4">
          {/* Quiz Top Bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setQuizAnswer(null);
                setQuizVerdict(null);
              }}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
            <div className="h-3 flex-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[70%] transition-all" />
            </div>
            <div className="flex items-center gap-1 text-xs font-extrabold text-rose-500">
              <Heart className="h-4 w-4 fill-rose-500" />
              <span>4</span>
            </div>
          </div>

          {/* Question Box & Mascot Assistant */}
          <div className="flex items-start justify-between gap-3 pt-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Translate to English
              </span>
              <div className="flex items-center gap-2 mt-1">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100" lang="ja">
                  ありがとうございます
                </h3>
                <button
                  onClick={() => speak("ありがとうございます", 0.9)}
                  className="p-1 text-blue-600 hover:scale-110 transition"
                  aria-label="Listen"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">arigatou gozaimasu</p>
            </div>

            {/* Reactive Mascot in Quiz Corner */}
            <Mascot
              state={quizVerdict === "ok" ? "cheering" : quizVerdict === "bad" ? "sad" : "thinking"}
              size={72}
              speech={
                quizVerdict === "ok"
                  ? "すごい！ Correct!"
                  : quizVerdict === "bad"
                  ? "Almost! Try again"
                  : "Tap your answer!"
              }
              bubblePlacement="bottom"
              interactive={true}
            />
          </div>

          {/* 4 Chunky 3D Option Cards */}
          <div className="space-y-2.5 pt-2">
            {[
              { id: 1, text: "Thank you very much", isCorrect: true },
              { id: 2, text: "Excuse me / I'm sorry", isCorrect: false },
              { id: 3, text: "Good morning", isCorrect: false },
              { id: 4, text: "Nice to meet you", isCorrect: false },
            ].map((opt) => {
              const isSelected = quizAnswer === opt.id;
              let btnClass = "btn-3d-neutral";
              if (isSelected) {
                btnClass = opt.isCorrect ? "btn-3d-emerald" : "bg-rose-500 text-white border-b-4 border-rose-700 shadow-md";
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setQuizAnswer(opt.id);
                    setQuizVerdict(opt.isCorrect ? "ok" : "bad");
                    if (opt.isCorrect) {
                      playCorrectSound();
                    } else {
                      playWrongSound();
                    }
                  }}
                  className={`btn-3d w-full p-4 rounded-2xl text-left font-bold text-sm transition flex items-center justify-between ${btnClass}`}
                >
                  <span>{opt.text}</span>
                  {isSelected && opt.isCorrect && <CheckCircle2 className="h-5 w-5 text-white" />}
                </button>
              );
            })}
          </div>

          {/* Dynamic Bottom Feedback Bar */}
          {quizVerdict && (
            <div
              className={`rounded-2xl p-4 flex items-center justify-between transition animate-fade-in ${
                quizVerdict === "ok"
                  ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200"
                  : "bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200"
              }`}
            >
              <div>
                <p className="font-extrabold text-sm">
                  {quizVerdict === "ok" ? "🎉 Perfect! +10 XP" : "💡 Meaning: Thank you very much"}
                </p>
                <p className="text-xs opacity-80 mt-0.5">
                  {quizVerdict === "ok" ? "Polite and respectful thank you." : "Keep going, you're learning!"}
                </p>
              </div>
              <Button3D
                variant={quizVerdict === "ok" ? "success" : "neutral"}
                size="sm"
                onClick={() => {
                  setQuizAnswer(null);
                  setQuizVerdict(null);
                }}
              >
                Continue
              </Button3D>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: SAMPLE SCREEN 3 — LESSON COMPLETE CELEBRATION */}
      {/* ========================================================================= */}
      <section id="screen-complete" className="relative z-10 max-w-md mx-auto space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Sample Screen 3
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Lesson Complete &amp; Rewards
          </h2>
          <p className="text-xs text-slate-500">
            Confetti burst, 3-star rating, XP count-up, and celebratory mascot.
          </p>
        </div>

        {/* Mobile Device Frame */}
        <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 p-6 ring-1 ring-slate-200 dark:ring-slate-800 shadow-xl text-center space-y-5">
          <span className="inline-block text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
            Lesson 3 Complete!
          </span>

          {/* Celebratory Mascot */}
          <div className="flex justify-center">
            <Mascot
              state="cheering"
              size={130}
              speech={{ ja: "よくできました！", en: "Outstanding job!" }}
              bubblePlacement="top"
              interactive={true}
            />
          </div>

          {/* 3 Golden Stars */}
          <div className="flex justify-center items-center gap-2 text-amber-400 pt-2">
            <Star className="h-8 w-8 fill-amber-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <Star className="h-10 w-10 fill-amber-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <Star className="h-8 w-8 fill-amber-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="rounded-2xl bg-white dark:bg-slate-800 p-3 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">XP Earned</span>
              <p className="text-lg font-extrabold text-amber-500 mt-0.5">+50 XP</p>
            </div>
            <div className="rounded-2xl bg-white dark:bg-slate-800 p-3 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">Accuracy</span>
              <p className="text-lg font-extrabold text-emerald-500 mt-0.5">100%</p>
            </div>
            <div className="rounded-2xl bg-white dark:bg-slate-800 p-3 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm">
              <span className="text-[10px] font-bold uppercase text-slate-400">Streak</span>
              <p className="text-lg font-extrabold text-orange-500 mt-0.5">5 Days</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Button3D variant="accent" fullWidth size="lg" onClick={triggerConfetti}>
              🎉 Trigger Confetti Burst!
            </Button3D>
            <Button3D variant="primary" fullWidth size="md">
              Continue to Lesson 4
            </Button3D>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: KANA AS CHARACTERS (ILLUSTRATED MNEMONICS) */}
      {/* ========================================================================= */}
      <section id="kana" className="relative z-10 max-w-3xl mx-auto space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Kana as Characters (Illustrated Mnemonics)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Each kana glyph morphs into an original cute visual picture sounding like its romaji. Tap to hear audio and bounce!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {SAMPLE_MNEMONICS.map((m) => (
            <KanaMnemonicCard key={m.kana} mnemonic={m} />
          ))}
        </div>
      </section>

      {/* Floating Confetti Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button3D
          variant="sakura"
          size="md"
          iconLeft={<Sparkles className="h-4 w-4" />}
          onClick={triggerConfetti}
          className="shadow-xl"
        >
          Confetti!
        </Button3D>
      </div>
    </div>
  );
}

