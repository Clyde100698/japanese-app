"use client";
import { getMeta, setMeta, setCard, getCard } from "./db";
import { createCard } from "./sm2";
import type { DeckCard } from "./decks";

export interface DialogueReaction {
  speaker: string;
  speakerJa: string;
  ja: string;
  reading: string;
  romaji: string;
  en: string;
}

export interface DialogueOption {
  id: string;
  ja: string;
  reading: string;
  romaji: string;
  en: string;
  politeness: "casual" | "polite" | "keigo";
  isCorrect?: boolean;
  explanation: string;
  reaction?: DialogueReaction;
}

export interface DialogueLine {
  id: string;
  speaker: "other" | "learner";
  speakerName: string;
  speakerNameJa: string;
  ja: string;
  reading: string;
  romaji: string;
  en: string;
  politeness: "casual" | "polite" | "keigo";
  options?: DialogueOption[];
}

export interface KeyPhrase {
  id: string;
  front: string;
  reading: string;
  romaji: string;
  answer: string;
  notes?: string;
}

export interface Scenario {
  id: string;
  title: string;
  titleJa: string;
  level: "N5" | "N4" | "N3" | "N2" | "N1";
  category: "Dining" | "Shopping" | "Travel" | "Health" | "Services" | "Workplace" | "Social" | "Daily Life";
  description: string;
  keyPhrases: KeyPhrase[];
  lines: DialogueLine[];
}

export interface ScenarioProgress {
  completedIds: string[];
  watchCount: number;
  roleplayCount: number;
  fillCount: number;
  shadowCount: number;
  addedPhrases: string[];
}

let cachedScenarios: Scenario[] | null = null;

export async function loadScenarios(): Promise<Scenario[]> {
  if (cachedScenarios) return cachedScenarios;
  try {
    const res = await fetch("/data/scenarios.json");
    if (!res.ok) throw new Error("Failed to fetch scenarios");
    cachedScenarios = (await res.json()) as Scenario[];
    return cachedScenarios;
  } catch (err) {
    console.error("loadScenarios error:", err);
    return [];
  }
}

export async function getScenarioById(id: string): Promise<Scenario | null> {
  const all = await loadScenarios();
  return all.find((s) => s.id === id) || null;
}

const META_SCENARIO_PROGRESS = "scenario_progress";

export async function getScenarioProgress(): Promise<ScenarioProgress> {
  const val = await getMeta<ScenarioProgress>(META_SCENARIO_PROGRESS);
  return (
    val || {
      completedIds: [],
      watchCount: 0,
      roleplayCount: 0,
      fillCount: 0,
      shadowCount: 0,
      addedPhrases: [],
    }
  );
}

export async function recordScenarioCompletion(
  scenarioId: string,
  mode: "watch" | "roleplay" | "fill" | "shadow",
): Promise<ScenarioProgress> {
  const current = await getScenarioProgress();
  const completedIds = Array.from(new Set([...current.completedIds, scenarioId]));
  const updated: ScenarioProgress = {
    ...current,
    completedIds,
    watchCount: current.watchCount + (mode === "watch" ? 1 : 0),
    roleplayCount: current.roleplayCount + (mode === "roleplay" ? 1 : 0),
    fillCount: current.fillCount + (mode === "fill" ? 1 : 0),
    shadowCount: current.shadowCount + (mode === "shadow" ? 1 : 0),
  };
  await setMeta(META_SCENARIO_PROGRESS, updated);
  return updated;
}

/** Add scenario key phrases to the user's SM-2 spaced repetition review queue */
export async function addKeyPhrasesToSrs(phrases: KeyPhrase[]): Promise<number> {
  const progress = await getScenarioProgress();
  let addedCount = 0;
  const newAdded = new Set(progress.addedPhrases);

  for (const p of phrases) {
    const existing = await getCard(p.id);
    if (!existing) {
      const initial = createCard(p.id);
      await setCard(initial);
      addedCount++;
    }
    newAdded.add(p.id);
  }

  await setMeta(META_SCENARIO_PROGRESS, {
    ...progress,
    addedPhrases: Array.from(newAdded),
  });

  return addedCount;
}

export interface ConversationBadge {
  id: string;
  name: string;
  desc: string;
  unlocked: boolean;
  progress: { current: number; total: number };
}

export function computeConversationBadges(
  scenarios: Scenario[],
  progress: ScenarioProgress,
): ConversationBadge[] {
  const completedSet = new Set(progress.completedIds);
  const byLevel = (lvl: string) => scenarios.filter((s) => s.level === lvl);
  const completedLevel = (lvl: string) => byLevel(lvl).filter((s) => completedSet.has(s.id)).length;

  return [
    {
      id: "first_convo",
      name: "First Words",
      desc: "Complete your first dialogue scenario",
      unlocked: completedSet.size >= 1,
      progress: { current: Math.min(1, completedSet.size), total: 1 },
    },
    {
      id: "n5_diplomat",
      name: "N5 Traveler",
      desc: "Complete all 10 Beginner (N5) dialogue scenarios",
      unlocked: completedLevel("N5") >= byLevel("N5").length && byLevel("N5").length > 0,
      progress: { current: completedLevel("N5"), total: byLevel("N5").length || 10 },
    },
    {
      id: "n4_adventurer",
      name: "N4 Local",
      desc: "Complete all 10 Elementary (N4) dialogue scenarios",
      unlocked: completedLevel("N4") >= byLevel("N4").length && byLevel("N4").length > 0,
      progress: { current: completedLevel("N4"), total: byLevel("N4").length || 10 },
    },
    {
      id: "n3_conversationalist",
      name: "N3 Conversationalist",
      desc: "Complete all 8 Intermediate (N3) dialogue scenarios",
      unlocked: completedLevel("N3") >= byLevel("N3").length && byLevel("N3").length > 0,
      progress: { current: completedLevel("N3"), total: byLevel("N3").length || 8 },
    },
    {
      id: "n2_professional",
      name: "N2 Professional",
      desc: "Complete all 7 Business & Formal (N2) scenarios",
      unlocked: completedLevel("N2") >= byLevel("N2").length && byLevel("N2").length > 0,
      progress: { current: completedLevel("N2"), total: byLevel("N2").length || 7 },
    },
    {
      id: "n1_master",
      name: "N1 Diplomat",
      desc: "Complete all 6 Advanced Keigo & Boardroom (N1) scenarios",
      unlocked: completedLevel("N1") >= byLevel("N1").length && byLevel("N1").length > 0,
      progress: { current: completedLevel("N1"), total: byLevel("N1").length || 6 },
    },
    {
      id: "roleplay_star",
      name: "Voice Actor",
      desc: "Complete 5 Role-play dialogue sessions",
      unlocked: progress.roleplayCount >= 5,
      progress: { current: Math.min(5, progress.roleplayCount), total: 5 },
    },
    {
      id: "shadow_champion",
      name: "Shadowing Sensei",
      desc: "Complete 5 Shadowing fluency sessions",
      unlocked: progress.shadowCount >= 5,
      progress: { current: Math.min(5, progress.shadowCount), total: 5 },
    },
  ];
}

