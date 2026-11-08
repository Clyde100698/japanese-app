"use client";
// Offline-first sync: pull remote changes (merge latest-wins), then push local dirty rows.
// Every failure is swallowed into a status: the app never depends on Supabase being reachable.
import { getDirty, getMeta, markClean, mergeRemote, setMeta, type StoreName } from "./db";
import { getSupabase } from "./supabase";

export type SyncStatus =
  | { state: "idle" | "syncing" | "ok" | "offline" | "signed-out" | "not-configured"; at?: number }
  | { state: "error"; message: string; at?: number };

let status: SyncStatus = { state: "idle" };
const subs = new Set<(s: SyncStatus) => void>();
function set(s: SyncStatus) {
  status = { ...s, at: Date.now() } as SyncStatus;
  subs.forEach((f) => f(status));
}
export const getSyncStatus = () => status;
export function onSyncStatus(cb: (s: SyncStatus) => void) {
  subs.add(cb);
  return () => subs.delete(cb);
}

const iso = (ms: number) => new Date(ms).toISOString();
const ms = (s: string) => new Date(s).getTime();
const PAGE = 1000;
const CHUNK = 400;

interface TableSpec {
  store: StoreName;
  table: string;
  key: (r: any) => string; // eslint-disable-line @typescript-eslint/no-explicit-any
  conflict: string;
  toRow: (r: any, uid: string) => Record<string, unknown>; // eslint-disable-line @typescript-eslint/no-explicit-any
  fromRow: (r: any) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const TABLES: TableSpec[] = [
  {
    store: "cards",
    table: "card_states",
    key: (r) => r.id,
    conflict: "user_id,card_id",
    toRow: (r, uid) => ({
      user_id: uid, card_id: r.id, ease: r.ease, interval_days: r.interval, reps: r.reps,
      lapses: r.lapses, due_at: iso(r.due), phase: r.phase, updated_at: iso(r.updatedAt),
    }),
    fromRow: (r) => ({
      id: r.card_id, ease: Number(r.ease), interval: r.interval_days, reps: r.reps, lapses: r.lapses,
      due: ms(r.due_at), phase: r.phase, updatedAt: ms(r.updated_at),
    }),
  },
  {
    store: "logs",
    table: "review_logs",
    key: (r) => r.id,
    conflict: "id",
    toRow: (r, uid) => ({
      id: r.id, user_id: uid, card_id: r.cardId, grade: r.grade, reviewed_at: iso(r.reviewedAt),
      prev_interval: r.prevInterval, new_interval: r.newInterval, ease_after: r.easeAfter,
      updated_at: iso(r.updatedAt),
    }),
    fromRow: (r) => ({
      id: r.id, cardId: r.card_id, grade: r.grade, reviewedAt: ms(r.reviewed_at),
      prevInterval: r.prev_interval, newInterval: r.new_interval, easeAfter: Number(r.ease_after),
      updatedAt: ms(r.updated_at),
    }),
  },
  {
    store: "daily",
    table: "daily_stats",
    key: (r) => r.day,
    conflict: "user_id,day",
    toRow: (r, uid) => ({
      user_id: uid, day: r.day, reviews: r.reviews, new_cards: r.newCards, correct: r.correct,
      xp: r.xp, updated_at: iso(r.updatedAt),
    }),
    fromRow: (r) => ({
      day: r.day, reviews: r.reviews, newCards: r.new_cards, correct: r.correct, xp: r.xp,
      updatedAt: ms(r.updated_at),
    }),
  },
  {
    store: "settings",
    table: "settings",
    key: () => "main",
    conflict: "user_id",
    toRow: (r, uid) => ({ user_id: uid, data: r.data, updated_at: iso(r.updatedAt) }),
    fromRow: (r) => ({ key: "main", data: r.data, updatedAt: ms(r.updated_at) }),
  },
];

let running: Promise<SyncStatus> | null = null;

export function syncNow(): Promise<SyncStatus> {
  running ??= run().finally(() => (running = null));
  return running;
}

async function run(): Promise<SyncStatus> {
  const sb = getSupabase();
  if (!sb) { set({ state: "not-configured" }); return status; }
  if (typeof navigator !== "undefined" && !navigator.onLine) { set({ state: "offline" }); return status; }
  try {
    const { data } = await sb.auth.getSession();
    const uid = data.session?.user.id;
    if (!uid) { set({ state: "signed-out" }); return status; }
    set({ state: "syncing" });

    for (const t of TABLES) {
      // 1. pull rows changed since the last pull
      const cursorKey = `pull:${uid}:${t.table}`;
      let cursor = (await getMeta<number>(cursorKey)) ?? 0;
      for (;;) {
        const { data: rows, error } = await sb
          .from(t.table).select("*").eq("user_id", uid)
          .gt("updated_at", iso(cursor)).order("updated_at").limit(PAGE);
        if (error) throw error;
        if (!rows?.length) break;
        for (const row of rows) {
          const rec = t.fromRow(row);
          await mergeRemote(t.store, t.key(rec), rec);
          cursor = Math.max(cursor, rec.updatedAt);
        }
        await setMeta(cursorKey, cursor);
        if (rows.length < PAGE) break;
      }
      // 2. push local dirty rows (the server trigger drops stale updates)
      const dirty = await getDirty(t.store);
      for (let i = 0; i < dirty.length; i += CHUNK) {
        const chunk = dirty.slice(i, i + CHUNK);
        const { error } = await sb.from(t.table).upsert(chunk.map((r: any) => t.toRow(r, uid)), { onConflict: t.conflict });
        if (error) throw error;
        await markClean(t.store, chunk.map((r: any) => ({ key: t.key(r), updatedAt: r.updatedAt })));
      }
    }
    set({ state: "ok" });
  } catch (e) {
    const message = e instanceof Error ? e.message : (e as { message?: string })?.message ?? "Sync failed";
    set({ state: "error", message }); // paused project / network error: stay local, retry later
  }
  return status;
}

