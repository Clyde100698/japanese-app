"use client";
import React from "react";
import { type KanaMnemonic } from "@/components/mascot/KanaMnemonicCard";

/**
 * Illustrated vector mnemonic representations for kana.
 * Each kana morphs into an original cute visual picture sounding like its romaji.
 */
export const KANA_MNEMONICS: Record<string, KanaMnemonic> = {
  // ================= HIRAGANA VOWELS =================
  あ: {
    kana: "あ",
    romaji: "a",
    item: "Apple",
    itemJa: "りんご",
    concept: "A round red apple with a green leaf stem, taken with a big bite: 'Aah!'",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <circle cx="30" cy="34" r="18" fill="#EF4444" />
        <path d="M30 16 Q32 10 38 12" stroke="#10B981" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="38" cy="12" rx="4" ry="2.5" fill="#10B981" transform="rotate(-20 38 12)" />
        <circle cx="43" cy="29" r="6" fill="#F8FAFC" />
        <path d="M22 28 C26 36 34 38 38 46" stroke="#2563EB" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  い: {
    kana: "い",
    romaji: "i",
    item: "Two Eels",
    itemJa: "うなぎ",
    concept: "Two cheerful blue eels swimming upright side by side: 'Eee!'",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <path d="M20 16 C16 28 18 42 22 46" stroke="#2563EB" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <circle cx="19" cy="18" r="2" fill="#1E40AF" />
        <path d="M38 20 C38 32 36 40 38 44" stroke="#3B82F6" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="38" cy="22" r="1.8" fill="#1D4ED8" />
        <circle cx="28" cy="24" r="2" fill="#93C5FD" opacity="0.6" />
        <circle cx="31" cy="34" r="1.5" fill="#93C5FD" opacity="0.6" />
      </svg>
    ),
  },
  う: {
    kana: "う",
    romaji: "u",
    item: "Ooh! Heavy Weight",
    itemJa: "うわっ！",
    concept: "A weightlifter bent over under a barbell, groaning 'Ooh!'",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <line x1="16" y1="18" x2="44" y2="18" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
        <circle cx="16" cy="18" r="4.5" fill="#D97706" />
        <circle cx="44" cy="18" r="4.5" fill="#D97706" />
        <path d="M30 20 C24 30 24 44 38 46" stroke="#2563EB" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="30" cy="24" r="2.5" fill="#2563EB" />
      </svg>
    ),
  },
  え: {
    kana: "え",
    romaji: "e",
    item: "Exercising Runner",
    itemJa: "運動",
    concept: "An energetic runner with arms pumped forward, exercising along the road!",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <circle cx="34" cy="14" r="5" fill="#EC4899" />
        <path d="M22 28 L32 26 L42 34" stroke="#F43F5E" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M30 26 L26 44 L38 48" stroke="#2563EB" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="20" cy="48" r="2" fill="#F43F5E" />
      </svg>
    ),
  },
  お: {
    kana: "お",
    romaji: "o",
    item: "On the Green",
    itemJa: "ゴルフ",
    concept: "A golf player mid-swing putting the golf ball right On (o) the green!",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <circle cx="44" cy="24" r="4" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
        <path d="M20 22 L38 22" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
        <path d="M28 14 L28 46 Q34 46 38 40 Q40 32 30 32" stroke="#059669" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },

  // ================= HIRAGANA K-ROW =================
  か: {
    kana: "か",
    romaji: "ka",
    item: "Karate Chop",
    itemJa: "空手",
    concept: "A karate master delivering a strong chop with a flying sweat droplet!",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <path d="M20 20 L36 20 C36 34 32 46 22 46" stroke="#2563EB" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M28 14 L24 44" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
        <circle cx="43" cy="26" r="3" fill="#F59E0B" />
      </svg>
    ),
  },
  き: {
    kana: "き",
    romaji: "ki",
    item: "Key with Teeth",
    itemJa: "鍵 (カギ)",
    concept: "A golden key with two horizontal bars and a round handle!",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <circle cx="30" cy="14" r="5" stroke="#F59E0B" strokeWidth="3" fill="none" />
        <line x1="20" y1="26" x2="40" y2="26" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="22" y1="34" x2="38" y2="34" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M30 19 L30 46 C34 46 38 42 36 38" stroke="#D97706" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  く: {
    kana: "く",
    romaji: "ku",
    item: "Cuckoo's Beak",
    itemJa: "カッコウ",
    concept: "A cute little cuckoo bird opening its wide beak singing 'Ku-ku!'",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <path d="M38 16 L22 30 L38 44" stroke="#2563EB" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="28" cy="24" r="3" fill="#F59E0B" />
        <circle cx="29" cy="23" r="1" fill="#FFFFFF" />
      </svg>
    ),
  },
  け: {
    kana: "け",
    romaji: "ke",
    item: "Keg with Tap",
    itemJa: "樽 (タル)",
    concept: "A wooden keg with a brass spout on the right pouring cider!",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <path d="M20 16 L20 44" stroke="#8B5CF6" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M28 24 L42 24" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M38 18 C38 32 36 42 42 46" stroke="#8B5CF6" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  こ: {
    kana: "こ",
    romaji: "ko",
    item: "Two Koi Fish",
    itemJa: "鯉 (コイ)",
    concept: "Two colorful koi fish swimming together in a clear pond!",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <path d="M20 22 C28 18 36 18 42 22" stroke="#EF4444" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <circle cx="22" cy="21" r="2" fill="#FFFFFF" />
        <path d="M18 38 C26 42 34 42 42 38" stroke="#F59E0B" strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <circle cx="40" cy="39" r="2" fill="#FFFFFF" />
      </svg>
    ),
  },

  // ================= HIRAGANA S-ROW =================
  さ: {
    kana: "さ",
    romaji: "sa",
    item: "Samurai Sash",
    itemJa: "帯 (オビ)",
    concept: "A brave samurai with an elegant sash tied neatly around the waist!",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <line x1="20" y1="24" x2="40" y2="24" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
        <path d="M32 16 L28 36 C34 36 38 40 36 46" stroke="#2563EB" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="38" cy="20" r="3" fill="#EC4899" />
      </svg>
    ),
  },
  し: {
    kana: "し",
    romaji: "shi",
    item: "She Caught a Fish",
    itemJa: "釣り針",
    concept: "A shiny metal fishing hook: 'She' hooked a prize salmon!",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <path d="M26 16 L26 36 C26 46 36 46 42 36" stroke="#06B6D4" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="43" cy="28" r="4" fill="#3B82F6" />
        <circle cx="45" cy="27" r="1.5" fill="#FFFFFF" />
      </svg>
    ),
  },
  す: {
    kana: "す",
    romaji: "su",
    item: "Soup Spoon Spiral",
    itemJa: "スープ",
    concept: "A swirling noodle lifted gently with a soup spoon: 'Su-per!'",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <line x1="18" y1="22" x2="42" y2="22" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
        <path d="M30 16 L30 30 C30 36 24 36 24 30 C24 24 32 24 32 34 L32 46" stroke="#EF4444" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  せ: {
    kana: "せ",
    romaji: "se",
    item: "Saying Something",
    itemJa: "話す",
    concept: "A friendly face with open lips saying 'Se-cret!'",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <line x1="18" y1="24" x2="42" y2="24" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
        <path d="M34 16 L34 44" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M24 20 L24 36 L40 36" stroke="#059669" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  そ: {
    kana: "そ",
    romaji: "so",
    item: "Sewing Thread",
    itemJa: "裁縫",
    concept: "A vibrant thread zigzagging down as you sew a cozy winter sweater!",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <path d="M20 20 L38 20 L22 34 L38 34 C38 44 26 46 22 42" stroke="#EC4899" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="18" r="2.5" fill="#8B5CF6" />
      </svg>
    ),
  },

  // ================= HIRAGANA T-ROW =================
  た: {
    kana: "た",
    romaji: "ta",
    item: "Ta-co & Chopsticks",
    itemJa: "タコ",
    concept: "Looks like the English letters 't' and 'a' sitting side by side!",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <path d="M18 24 L32 24" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M24 18 L20 44" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M34 26 C38 24 42 24 44 26" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M32 38 C36 40 40 40 44 38" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  ち: {
    kana: "ち",
    romaji: "chi",
    item: "Cheerleader",
    itemJa: "チア",
    concept: "A smiling cheerleader doing a jump, shaping like the number 5: 'Cheese!'",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <line x1="20" y1="22" x2="38" y2="22" stroke="#EC4899" strokeWidth="4" strokeLinecap="round" />
        <path d="M28 16 L24 30 C34 26 40 32 36 42 C32 46 24 46 20 40" stroke="#F43F5E" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="42" cy="18" r="3" fill="#F59E0B" />
      </svg>
    ),
  },
  つ: {
    kana: "つ",
    romaji: "tsu",
    item: "Tsunami Wave",
    itemJa: "津波 (ツナミ)",
    concept: "A big, powerful ocean wave curling right over into the shore: 'Tsu-nami!'",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <path d="M20 28 C26 22 42 22 42 34 C42 44 28 46 20 40" stroke="#0284C7" strokeWidth="5.5" fill="none" strokeLinecap="round" />
        <circle cx="38" cy="24" r="2" fill="#E0F2FE" />
        <circle cx="32" cy="20" r="1.5" fill="#E0F2FE" />
      </svg>
    ),
  },
  て: {
    kana: "て",
    romaji: "te",
    item: "Hand (Te)",
    itemJa: "手 (テ)",
    concept: "An open palm reaching out to help a friend ('te' literally means hand!)",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <path d="M20 22 L38 22 C34 32 34 44 42 44" stroke="#10B981" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="38" cy="22" r="2.5" fill="#059669" />
      </svg>
    ),
  },
  と: {
    kana: "と",
    romaji: "to",
    item: "Toe with a Thorn",
    itemJa: "足の指",
    concept: "A big round toe with a tiny thorn prick: 'Ouch, my To-e!'",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <path d="M24 18 L24 44" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
        <path d="M24 30 C32 28 38 34 36 42" stroke="#EF4444" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="36" cy="42" r="2" fill="#DC2626" />
      </svg>
    ),
  },

  // ================= HIRAGANA N-ROW =================
  な: {
    kana: "な",
    romaji: "na",
    item: "Nun Praying",
    itemJa: "お祈り",
    concept: "A kind nun kneeling peacefully at an altar in prayer: 'Na-maste!'",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <line x1="18" y1="24" x2="30" y2="24" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M24 18 L22 42" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="36" cy="22" r="2" fill="#F59E0B" />
        <path d="M38 28 L38 42 C38 46 34 46 34 42" stroke="#3B82F6" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  に: {
    kana: "に",
    romaji: "ni",
    item: "Needle & Thread",
    itemJa: "針と糸",
    concept: "A needle standing upright with two stitches beside it (Ni sounds like knee!)",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <path d="M22 18 L22 44" stroke="#8B5CF6" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="32" y1="26" x2="42" y2="26" stroke="#EC4899" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="32" y1="36" x2="42" y2="36" stroke="#EC4899" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    ),
  },
  ぬ: {
    kana: "ぬ",
    romaji: "nu",
    item: "Noodles on Chopsticks",
    itemJa: "ヌードル",
    concept: "Delicious ramen noodles twirled tightly with chopsticks: 'Nu-tritious!'",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <path d="M22 20 L36 44" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M30 18 C20 32 24 44 34 44 C42 44 42 34 34 32 C30 32 32 40 38 42" stroke="#D97706" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  ね: {
    kana: "ね",
    romaji: "ne",
    item: "Neko (Cat)",
    itemJa: "猫 (ネコ)",
    concept: "A playful kitten (neko) with a cute curled loop at the tip of its tail!",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <path d="M20 18 L20 44" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
        <path d="M20 28 L32 20 L24 40 C28 32 38 32 38 38 C38 44 32 44 34 38" stroke="#3B82F6" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="34" cy="38" r="2" fill="#EC4899" />
      </svg>
    ),
  },
  の: {
    kana: "の",
    romaji: "no",
    item: "NO Sign",
    itemJa: "禁止マーク",
    concept: "A clean single swirling loop, just like a universal 'NO' circle sign!",
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <path d="M34 20 L24 40 C18 36 20 24 30 24 C40 24 42 36 32 44" stroke="#EF4444" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
};

/**
 * Get or dynamically synthesize a mnemonic representation for any kana character.
 */
export function getKanaMnemonic(kana: string, romaji = "", defaultMnemonic = ""): KanaMnemonic {
  if (KANA_MNEMONICS[kana]) {
    return KANA_MNEMONICS[kana];
  }

  // Graceful fallback for remaining kana with cute styled card art
  return {
    kana,
    romaji: romaji || kana,
    item: `${kana.toUpperCase()} Character`,
    itemJa: "ひらがな・カタカナ",
    concept: defaultMnemonic || `Sound: "${romaji}". Practice writing and listening!`,
    svgArt: (
      <svg viewBox="0 0 60 60" className="h-16 w-16">
        <circle cx="30" cy="30" r="24" fill="#DBEAFE" />
        <text
          x="30"
          y="38"
          textAnchor="middle"
          fontSize="24"
          fontWeight="bold"
          fill="#1D4ED8"
          fontFamily="Noto Sans JP, sans-serif"
        >
          {kana}
        </text>
        <circle cx="44" cy="18" r="3" fill="#F59E0B" />
      </svg>
    ),
  };
}
