"use client";
import { useEffect } from "react";
import { onDbChange } from "@/lib/db";
import { syncNow } from "@/lib/sync";

/** Triggers background sync on start, reconnect, tab focus, local changes (debounced) and every 5 min. */
export default function SyncProvider() {
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    const soon = (delay = 4000) => {
      clearTimeout(t);
      t = setTimeout(() => void syncNow(), delay);
    };
    soon(1500);
    const onVis = () => document.visibilityState === "visible" && soon(500);
    window.addEventListener("online", () => soon(500));
    document.addEventListener("visibilitychange", onVis);
    const off = onDbChange(() => soon(8000));
    const iv = setInterval(() => soon(0), 5 * 60_000);
    return () => {
      clearTimeout(t);
      clearInterval(iv);
      off();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);
  return null;
}

