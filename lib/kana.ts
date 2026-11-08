export type Script = "hiragana" | "katakana";
export type KanaGroup = "basic" | "dakuten" | "handakuten" | "combo" | "special";
export type ChartTab = "basic" | "voiced" | "combo" | "special";

export interface KanaItem {
  id: string;
  script: Script;
  kana: string;
  romaji: string;
  group: KanaGroup;
  row: string;
  mnemonic: string;
  confusable?: string[];
  needs_review?: boolean;
}

export interface KanaData {
  items: KanaItem[];
  longVowelNotes: string[];
}

export const CHART_TABS: { id: ChartTab; label: string }[] = [
  { id: "basic", label: "Basic" },
  { id: "voiced", label: "Voiced" },
  { id: "combo", label: "Combos" },
  { id: "special", label: "Special" },
];

export function inTab(item: KanaItem, tab: ChartTab): boolean {
  if (tab === "voiced") return item.group === "dakuten" || item.group === "handakuten";
  return item.group === tab;
}

/** Number of grid columns for a chart tab (a-i-u-e-o, or a-u-o for combos). */
export function columnsFor(tab: ChartTab): number {
  return tab === "combo" ? 3 : tab === "special" ? 1 : 5;
}

function columnOf(item: KanaItem, tab: ChartTab): number {
  if (tab === "special") return 0;
  const last = item.romaji.slice(-1);
  if (tab === "combo") return Math.max(0, "auo".indexOf(last));
  const idx = "aiueo".indexOf(last);
  return idx < 0 ? 0 : idx; // "n" -> column 0
}

/** Lay items out in rows, keeping gaps (null) for sounds that do not exist (yi, ye, wu...). */
export function layoutChart(items: KanaItem[], tab: ChartTab): (KanaItem | null)[][] {
  const cols = columnsFor(tab);
  const rows = new Map<string, (KanaItem | null)[]>();
  for (const item of items) {
    if (!inTab(item, tab)) continue;
    const key = tab === "special" ? item.id : item.row;
    if (!rows.has(key)) rows.set(key, Array<KanaItem | null>(cols).fill(null));
    rows.get(key)![columnOf(item, tab)] = item;
  }
  return [...rows.values()];
}

