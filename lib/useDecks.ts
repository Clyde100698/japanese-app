"use client";
import { useEffect, useState } from "react";
import { DECKS, loadDeck, type DeckCard, type DeckInfo } from "./decks";
import { loadJson } from "./useJson";

export interface AvailableDeck { info: DeckInfo; cards: DeckCard[] }

/** Decks whose content is present, with their cards (loaded lazily, cached by the service worker). */
export function useAvailableDecks(): AvailableDeck[] | null {
  const [decks, setDecks] = useState<AvailableDeck[] | null>(null);
  useEffect(() => {
    let alive = true;
    Promise.all(
      DECKS.map(async (info) => {
        try {
          const cards = await loadDeck(info.id);
          return cards.length ? { info, cards } : null;
        } catch {
          return null;
        }
      }),
    ).then((r) => alive && setDecks(r.filter((x): x is AvailableDeck => !!x)));
    return () => { alive = false; };
  }, []);
  return decks;
}

export interface SentenceItem { ja: string; en: string; tokens?: string[] }

/** Sentences for tap-to-build: phrases, grammar examples and Tatoeba pairs (if built). */
export async function loadSentences(): Promise<SentenceItem[]> {
  const out: SentenceItem[] = [];
  const tryLoad = async <T,>(url: string): Promise<T[]> => { try { return await loadJson<T[]>(url); } catch { return []; } };
  for (const p of await tryLoad<{ ja: string; en: string; tokens?: string[] }>("/data/phrases.json")) out.push({ ja: p.ja, en: p.en, tokens: p.tokens });
  for (const g of await tryLoad<{ examples: { ja: string; en: string }[] }>("/data/grammar.json")) for (const e of g.examples) out.push({ ja: e.ja, en: e.en });
  for (const s of await tryLoad<{ ja: string; en: string }>("/data/sentences.json")) out.push({ ja: s.ja, en: s.en });
  return out.filter((s) => [...s.ja].length >= 4 && [...s.ja].length <= 24);
}

