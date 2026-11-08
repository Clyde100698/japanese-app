"use client";
import { useEffect, useState } from "react";

const cache = new Map<string, Promise<unknown>>();

/** Fetch a static JSON bundle (cached in memory, and by the service worker for offline use). */
export function loadJson<T>(url: string): Promise<T> {
  let p = cache.get(url);
  if (!p) {
    p = fetch(url).then((r) => {
      if (!r.ok) throw new Error(`${url}: ${r.status}`);
      return r.json();
    });
    p.catch(() => cache.delete(url));
    cache.set(url, p);
  }
  return p as Promise<T>;
}

export function useJson<T>(url: string): { data: T | null; error: boolean } {
  const [state, setState] = useState<{ data: T | null; error: boolean }>({ data: null, error: false });
  useEffect(() => {
    let alive = true;
    loadJson<T>(url)
      .then((data) => alive && setState({ data, error: false }))
      .catch(() => alive && setState({ data: null, error: true }));
    return () => {
      alive = false;
    };
  }, [url]);
  return state;
}

