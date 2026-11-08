"use client";
import { useCallback, useEffect, useState } from "react";
import { loadSettingsRecord, onDbChange, saveSettingsRecord } from "./db";

export interface Settings {
  speechRate: number; // 0.5 - 1.2
  showRomaji: boolean;
  showFurigana: boolean;
  newCardsPerDay: number;
  dailyGoal: number; // reviews per day
  autoSpeak: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  speechRate: 0.8,
  showRomaji: true,
  showFurigana: true,
  newCardsPerDay: 10,
  dailyGoal: 20,
  autoSpeak: true,
};

/** Settings live in IndexedDB (synced to Supabase). Defaults render first, then stored values load. */
export function useSettings(): [Settings, (patch: Partial<Settings>) => void] {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    let alive = true;
    const load = () =>
      loadSettingsRecord()
        .then((r) => alive && r && setSettings({ ...DEFAULT_SETTINGS, ...(r.data as Partial<Settings>) }))
        .catch(() => {});
    load();
    const off = onDbChange(load);
    return () => {
      alive = false;
      off();
    };
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettingsRecord(next as unknown as Record<string, unknown>).catch(() => {});
      return next;
    });
  }, []);

  return [settings, update];
}
