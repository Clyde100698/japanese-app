"use client";
// IndexedDB (via idb). All progress is written here first; sync.ts pushes dirty rows to Supabase.
import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Grade, SrsCard } from "./sm2";

export interface ReviewLog {
  id: string;
  cardId: string;
  grade: Grade;
  reviewedAt: number;
  prevInterval: number;
  newInterval: number;
  easeAfter: number;
  updatedAt: number;
}

export interface DailyStat {
  day: string; // local YYYY-MM-DD
  reviews: number;
  newCards: number;
  correct: number;
  xp: number;
  updatedAt: number;
}

export interface SettingsRecord {
  key: "main";
  data: Record<string, unknown>;
  updatedAt: number;
}

export type Dirty<T> = T & { dirty: 0 | 1 };
export type StoreName = "cards" | "logs" | "daily" | "settings";

interface Schema extends DBSchema {
  cards: { key: string; value: Dirty<SrsCard>; indexes: { dirty: number } };
  logs: { key: string; value: Dirty<ReviewLog>; indexes: { dirty: number; reviewedAt: number } };
  daily: { key: string; value: Dirty<DailyStat>; indexes: { dirty: number } };
  settings: { key: string; value: Dirty<SettingsRecord>; indexes: { dirty: number } };
  meta: { key: string; value: { key: string; value: unknown } };
}

let dbp: Promise<IDBPDatabase<Schema>> | null = null;
function db() {
  dbp ??= openDB<Schema>("nihongo", 1, {
    upgrade(d) {
      d.createObjectStore("cards", { keyPath: "id" }).createIndex("dirty", "dirty");
      const logs = d.createObjectStore("logs", { keyPath: "id" });
      logs.createIndex("dirty", "dirty");
      logs.createIndex("reviewedAt", "reviewedAt");
      d.createObjectStore("daily", { keyPath: "day" }).createIndex("dirty", "dirty");
      d.createObjectStore("settings", { keyPath: "key" }).createIndex("dirty", "dirty");
      d.createObjectStore("meta", { keyPath: "key" });
    },
  });
  return dbp;
}

export function dayKey(ms: number): string {
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const XP: Record<Grade, number> = { again: 1, hard: 3, good: 5, easy: 6 };
type Listener = () => void;
const listeners = new Set<Listener>();
export function onDbChange(cb: Listener): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
const notify = () => listeners.forEach((l) => l());

export async function getAllCards(): Promise<Map<string, SrsCard>> {
  const all = await (await db()).getAll("cards");
  return new Map(all.map(({ dirty: _d, ...c }) => [c.id, c]));
}

export async function getCard(id: string): Promise<SrsCard | undefined> {
  const r = await (await db()).get("cards", id);
  if (!r) return undefined;
  const { dirty: _d, ...rest } = r;
  return rest;
}

export async function setCard(card: SrsCard): Promise<void> {
  await (await db()).put("cards", { ...card, dirty: 1 });
  notify();
}

export async function getDaily(day: string): Promise<DailyStat | undefined> {
  const r = await (await db()).get("daily", day);
  if (!r) return undefined;
  const { dirty: _d, ...rest } = r;
  return rest;
}

export async function getAllDaily(): Promise<DailyStat[]> {
  return (await (await db()).getAll("daily")).map(({ dirty: _d, ...r }) => r);
}

export async function getAllLogs(): Promise<ReviewLog[]> {
  return (await (await db()).getAll("logs")).map(({ dirty: _d, ...r }) => r);
}

/** Atomically save the updated card, a review log and the daily counters. */
export async function recordReview(prev: SrsCard | undefined, next: SrsCard, grade: Grade, now: number) {
  const d = await db();
  const tx = d.transaction(["cards", "logs", "daily"], "readwrite");
  await tx.objectStore("cards").put({ ...next, dirty: 1 });
  await tx.objectStore("logs").put({
    id: crypto.randomUUID(),
    cardId: next.id,
    grade,
    reviewedAt: now,
    prevInterval: prev?.interval ?? 0,
    newInterval: next.interval,
    easeAfter: next.ease,
    updatedAt: now,
    dirty: 1,
  });
  const day = dayKey(now);
  const cur = await tx.objectStore("daily").get(day);
  await tx.objectStore("daily").put({
    day,
    reviews: (cur?.reviews ?? 0) + 1,
    newCards: (cur?.newCards ?? 0) + (prev ? 0 : 1),
    correct: (cur?.correct ?? 0) + (grade === "again" ? 0 : 1),
    xp: (cur?.xp ?? 0) + XP[grade],
    updatedAt: now,
    dirty: 1,
  });
  await tx.done;
  notify();
}

/** A quiz miss on an already-learned card: update SRS state and log it, without touching daily counters. */
export async function applyQuizMiss(prev: SrsCard, next: SrsCard, now: number) {
  const d = await db();
  const tx = d.transaction(["cards", "logs"], "readwrite");
  await tx.objectStore("cards").put({ ...next, dirty: 1 });
  await tx.objectStore("logs").put({
    id: crypto.randomUUID(), cardId: next.id, grade: "again", reviewedAt: now,
    prevInterval: prev.interval, newInterval: next.interval, easeAfter: next.ease, updatedAt: now, dirty: 1,
  });
  await tx.done;
  notify();
}

/** Award XP (and count a practice item) for quizzes, which don't change SRS state. */
export async function addPractice(correct: number, total: number, xp: number, now = Date.now()) {
  const d = await db();
  const day = dayKey(now);
  const cur = await d.get("daily", day);
  await d.put("daily", {
    day,
    reviews: (cur?.reviews ?? 0) + total,
    newCards: cur?.newCards ?? 0,
    correct: (cur?.correct ?? 0) + correct,
    xp: (cur?.xp ?? 0) + xp,
    updatedAt: now,
    dirty: 1,
  });
  notify();
}

export async function loadSettingsRecord(): Promise<SettingsRecord | undefined> {
  const r = await (await db()).get("settings", "main");
  if (!r) return undefined;
  const { dirty: _d, ...rest } = r;
  return rest;
}

export async function saveSettingsRecord(data: Record<string, unknown>, now = Date.now()) {
  await (await db()).put("settings", { key: "main", data, updatedAt: now, dirty: 1 });
  notify();
}

export async function getMeta<T>(key: string): Promise<T | undefined> {
  return (await (await db()).get("meta", key))?.value as T | undefined;
}
export async function setMeta(key: string, value: unknown) {
  await (await db()).put("meta", { key, value });
}

// ---- sync helpers -------------------------------------------------------

export async function getDirty<S extends StoreName>(store: S) {
  return ((await db()) as any).getAllFromIndex(store, "dirty", 1);
}

/** Mark rows clean, but only if they were not modified again after being pushed. */
export async function markClean(store: StoreName, pushed: { key: string; updatedAt: number }[]) {
  const d = await db();
  const tx = d.transaction(store, "readwrite");
  for (const { key, updatedAt } of pushed) {
    const row = await tx.store.get(key);
    if (row && row.updatedAt === updatedAt) await tx.store.put({ ...row, dirty: 0 } as never);
  }
  await tx.done;
}

/** Merge a remote row if it is newer (LWW). Returns true if it replaced local. */
export async function mergeRemote(store: StoreName, key: string, remote: { updatedAt: number } & object) {
  const d = await db();
  const tx = d.transaction(store, "readwrite");
  const local = await tx.store.get(key);
  const wins = !local || remote.updatedAt > local.updatedAt;
  if (wins) await tx.store.put({ ...remote, dirty: 0 } as never);
  await tx.done;
  if (wins) notify();
  return wins;
}

// ---- export / import ----------------------------------------------------

export interface Backup {
  version: 1;
  exportedAt: number;
  cards: SrsCard[];
  logs: ReviewLog[];
  daily: DailyStat[];
  settings: Record<string, unknown> | null;
}

export async function exportBackup(): Promise<Backup> {
  return {
    version: 1,
    exportedAt: Date.now(),
    cards: [...(await getAllCards()).values()],
    logs: await getAllLogs(),
    daily: await getAllDaily(),
    settings: (await loadSettingsRecord())?.data ?? null,
  };
}

/** Import with the same latest-wins rule; imported rows are marked dirty so they sync up. */
export async function importBackup(b: Backup): Promise<number> {
  if (b?.version !== 1) throw new Error("Unrecognised backup file");
  const d = await db();
  let n = 0;
  const tx = d.transaction(["cards", "logs", "daily", "settings"], "readwrite");
  for (const c of b.cards ?? []) {
    const l = await tx.objectStore("cards").get(c.id);
    if (!l || c.updatedAt > l.updatedAt) { await tx.objectStore("cards").put({ ...c, dirty: 1 }); n++; }
  }
  for (const r of b.logs ?? []) {
    if (!(await tx.objectStore("logs").get(r.id))) { await tx.objectStore("logs").put({ ...r, dirty: 1 }); n++; }
  }
  for (const r of b.daily ?? []) {
    const l = await tx.objectStore("daily").get(r.day);
    if (!l || r.updatedAt > l.updatedAt) { await tx.objectStore("daily").put({ ...r, dirty: 1 }); n++; }
  }
  if (b.settings) {
    const l = await tx.objectStore("settings").get("main");
    if (!l || b.exportedAt > l.updatedAt) await tx.objectStore("settings").put({ key: "main", data: b.settings, updatedAt: b.exportedAt, dirty: 1 });
  }
  await tx.done;
  notify();
  return n;
}
