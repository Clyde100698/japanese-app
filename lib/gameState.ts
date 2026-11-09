"use client";
import { getMeta, setMeta } from "./db";
import { type MascotState } from "@/components/mascot/Mascot";

export interface GameUnit {
  id: string;
  unitNumber: number;
  title: string;
  titleJa: string;
  description: string;
  themeColor: "blue" | "indigo" | "emerald" | "amber" | "pink";
  nodes: LessonNode[];
}

export interface LessonNode {
  id: string;
  title: string;
  titleJa: string;
  type: "kana" | "vocab" | "grammar" | "quiz" | "checkpoint";
  totalQuestions: number;
  stars: 0 | 1 | 2 | 3;
  unlocked: boolean;
  deckId?: string;
  xpReward: number;
  gemReward: number;
}

export interface GameProfile {
  hearts: number;
  maxHearts: number;
  lastHeartRegen: number; // timestamp ms
  gems: number;
  completedNodeIds: Record<string, 0 | 1 | 2 | 3>; // nodeId -> stars
  currentNodeId: string;
  weeklyGoalTarget: number; // e.g. 5 days or 150 XP
  weeklyGoalCurrent: number;
}

const META_GAME_PROFILE = "game_profile";
const HEART_REGEN_INTERVAL_MS = 30 * 60 * 1000; // 1 heart every 30 mins

export const GAME_UNITS: GameUnit[] = [
  {
    id: "unit-1",
    unitNumber: 1,
    title: "Greetings Town",
    titleJa: "あいさつの街",
    description: "Learn the first vowels (あいうえお) and essential daily greetings.",
    themeColor: "blue",
    nodes: [
      { id: "u1-n1", title: "Vowels: あいうえお", titleJa: "母音", type: "kana", totalQuestions: 5, stars: 0, unlocked: true, deckId: "hiragana", xpReward: 30, gemReward: 15 },
      { id: "u1-n2", title: "K-Sounds: かきくけこ", titleJa: "か行", type: "kana", totalQuestions: 5, stars: 0, unlocked: false, deckId: "hiragana", xpReward: 30, gemReward: 15 },
      { id: "u1-n3", title: "First Greetings", titleJa: "あいさつ", type: "vocab", totalQuestions: 8, stars: 0, unlocked: false, deckId: "phrases", xpReward: 40, gemReward: 20 },
      { id: "u1-n4", title: "S-Sounds: さしすせそ", titleJa: "さ行", type: "kana", totalQuestions: 5, stars: 0, unlocked: false, deckId: "hiragana", xpReward: 30, gemReward: 15 },
      { id: "u1-n5", title: "Town Checkpoint Trophy", titleJa: "チェックポイント", type: "checkpoint", totalQuestions: 10, stars: 0, unlocked: false, xpReward: 60, gemReward: 35 },
    ],
  },
  {
    id: "unit-2",
    unitNumber: 2,
    title: "Food Street",
    titleJa: "食べ物ストリート",
    description: "Order ramen, sushi, and tea like a local while mastering T, N & H sounds.",
    themeColor: "amber",
    nodes: [
      { id: "u2-n1", title: "T-Sounds: たちつてと", titleJa: "た行", type: "kana", totalQuestions: 5, stars: 0, unlocked: false, deckId: "hiragana", xpReward: 30, gemReward: 15 },
      { id: "u2-n2", title: "N-Sounds: なにぬねの", titleJa: "な行", type: "kana", totalQuestions: 5, stars: 0, unlocked: false, deckId: "hiragana", xpReward: 30, gemReward: 15 },
      { id: "u2-n3", title: "Ramen & Cafe Orders", titleJa: "レストラン", type: "vocab", totalQuestions: 8, stars: 0, unlocked: false, deckId: "vocab-n5", xpReward: 40, gemReward: 20 },
      { id: "u2-n4", title: "H-Sounds: はひふへほ", titleJa: "は行", type: "kana", totalQuestions: 5, stars: 0, unlocked: false, deckId: "hiragana", xpReward: 30, gemReward: 15 },
      { id: "u2-n5", title: "Food Street Master", titleJa: "合格テスト", type: "checkpoint", totalQuestions: 10, stars: 0, unlocked: false, xpReward: 65, gemReward: 40 },
    ],
  },
  {
    id: "unit-3",
    unitNumber: 3,
    title: "Train Station",
    titleJa: "駅と移動",
    level: "N5",
    description: "Ask for directions, buy Shinkansen tickets, and complete Hiragana.",
    themeColor: "indigo",
    nodes: [
      { id: "u3-n1", title: "M & Y Sounds: まみむめも・やゆよ", titleJa: "ま・や行", type: "kana", totalQuestions: 8, stars: 0, unlocked: false, deckId: "hiragana", xpReward: 35, gemReward: 20 },
      { id: "u3-n2", title: "R & W Sounds: らりるれろ・わをん", titleJa: "ら・わ行", type: "kana", totalQuestions: 6, stars: 0, unlocked: false, deckId: "hiragana", xpReward: 35, gemReward: 20 },
      { id: "u3-n3", title: "Station Directions", titleJa: "道案内", type: "vocab", totalQuestions: 8, stars: 0, unlocked: false, deckId: "phrases", xpReward: 45, gemReward: 25 },
      { id: "u3-n4", title: "Station Master Trophy", titleJa: "駅長トロフィー", type: "checkpoint", totalQuestions: 10, stars: 0, unlocked: false, xpReward: 70, gemReward: 45 },
    ],
  } as GameUnit,
  {
    id: "unit-4",
    unitNumber: 4,
    title: "Daily Life & Kanji",
    titleJa: "日常生活と漢字",
    description: "Begin learning essential N5 Kanji and particles (は, が, を, に).",
    themeColor: "emerald",
    nodes: [
      { id: "u4-n1", title: "First Numbers: 一二三四五", titleJa: "数字の漢字", type: "vocab", totalQuestions: 6, stars: 0, unlocked: false, deckId: "kanji-n5", xpReward: 40, gemReward: 20 },
      { id: "u4-n2", title: "Particles: は, が, を", titleJa: "基本の助詞", type: "grammar", totalQuestions: 6, stars: 0, unlocked: false, deckId: "particles", xpReward: 40, gemReward: 20 },
      { id: "u4-n3", title: "Nature Kanji: 日月火水木金土", titleJa: "曜日の漢字", type: "vocab", totalQuestions: 7, stars: 0, unlocked: false, deckId: "kanji-n5", xpReward: 45, gemReward: 25 },
      { id: "u4-n4", title: "Daily Life Trophy", titleJa: "日常マスター", type: "checkpoint", totalQuestions: 10, stars: 0, unlocked: false, xpReward: 75, gemReward: 50 },
    ],
  },
];

export async function getGameProfile(): Promise<GameProfile> {
  const defaultProfile: GameProfile = {
    hearts: 5,
    maxHearts: 5,
    lastHeartRegen: Date.now(),
    gems: 120,
    completedNodeIds: {},
    currentNodeId: "u1-n1",
    weeklyGoalTarget: 5,
    weeklyGoalCurrent: 1,
  };

  const stored = await getMeta<GameProfile>(META_GAME_PROFILE);
  if (!stored) {
    await setMeta(META_GAME_PROFILE, defaultProfile);
    return defaultProfile;
  }

  // Calculate heart regeneration
  let hearts = stored.hearts;
  const now = Date.now();
  if (hearts < stored.maxHearts) {
    const elapsed = now - stored.lastHeartRegen;
    const regenCount = Math.floor(elapsed / HEART_REGEN_INTERVAL_MS);
    if (regenCount > 0) {
      hearts = Math.min(stored.maxHearts, hearts + regenCount);
      const updated = {
        ...stored,
        hearts,
        lastHeartRegen: now,
      };
      await setMeta(META_GAME_PROFILE, updated);
      return updated;
    }
  }

  return stored;
}

export async function saveGameProfile(profile: GameProfile): Promise<void> {
  await setMeta(META_GAME_PROFILE, profile);
}

export async function deductHeart(): Promise<number> {
  const profile = await getGameProfile();
  if (profile.hearts <= 0) return 0;
  const nextHearts = profile.hearts - 1;
  await saveGameProfile({
    ...profile,
    hearts: nextHearts,
    lastHeartRegen: profile.hearts === profile.maxHearts ? Date.now() : profile.lastHeartRegen,
  });
  return nextHearts;
}

export async function refillHearts(): Promise<number> {
  const profile = await getGameProfile();
  await saveGameProfile({
    ...profile,
    hearts: profile.maxHearts,
    lastHeartRegen: Date.now(),
  });
  return profile.maxHearts;
}

export async function completeGameNode(
  nodeId: string,
  stars: 1 | 2 | 3,
  xpEarned: number,
  gemsEarned: number,
): Promise<{ nextNodeId: string | null; newProfile: GameProfile }> {
  const profile = await getGameProfile();
  const existingStars = profile.completedNodeIds[nodeId] || 0;
  const finalStars = Math.max(existingStars, stars) as 1 | 2 | 3;

  // Find next node in sequence
  let allNodes: LessonNode[] = [];
  for (const u of GAME_UNITS) allNodes = allNodes.concat(u.nodes);
  const currentIdx = allNodes.findIndex((n) => n.id === nodeId);
  const nextNode = currentIdx >= 0 && currentIdx < allNodes.length - 1 ? allNodes[currentIdx + 1] : null;

  const newProfile: GameProfile = {
    ...profile,
    gems: profile.gems + gemsEarned,
    completedNodeIds: {
      ...profile.completedNodeIds,
      [nodeId]: finalStars,
    },
    currentNodeId: nextNode ? nextNode.id : profile.currentNodeId,
    weeklyGoalCurrent: Math.min(profile.weeklyGoalTarget, profile.weeklyGoalCurrent + 1),
  };

  await saveGameProfile(newProfile);
  return { nextNodeId: nextNode ? nextNode.id : null, newProfile };
}

/** Determine Mascot Aoi's expression based on study status */
export function getMascotMood(hasStudiedToday: boolean, currentStreak = 0): MascotState {
  if (!hasStudiedToday) return "sleepy";
  if (currentStreak >= 5) return "proud";
  return "happy";
}

