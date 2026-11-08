// Shared helpers for the data pipeline: cached downloads, GitHub release lookup, paths.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const CACHE = join(ROOT, "scripts", ".cache");
export const OUT = join(ROOT, "public", "data");
mkdirSync(CACHE, { recursive: true });
mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Download a URL once and cache it under scripts/.cache. `valid(buf)` guards against HTML error pages. */
export async function download(url, name, { valid = () => true, retries = 3 } = {}) {
  const file = join(CACHE, name);
  if (existsSync(file)) {
    const cached = readFileSync(file);
    if (valid(cached)) return cached;
  }
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const headers = { "User-Agent": "nihongo-reviewer-build" };
      if (url.includes("api.github.com")) {
        headers["Accept"] = "application/octet-stream";
      }
      const res = await fetch(url, { headers, redirect: "follow" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (!valid(buf)) throw new Error("unexpected content (not the expected file type)");
      writeFileSync(file, buf);
      return buf;
    } catch (e) {
      lastErr = e;
      if (attempt < retries) await sleep(1500 * attempt);
    }
  }
  throw new Error(`Could not download ${url}: ${lastErr.message}`);
}

export const isZip = (b) => b.length > 4 && b[0] === 0x50 && b[1] === 0x4b;
export const isJson = (b) => b.length > 1 && (b[0] === 0x7b || b[0] === 0x5b);
export const isBz2 = (b) => b.length > 3 && b[0] === 0x42 && b[1] === 0x5a && b[2] === 0x68;

/** Find a release asset URL in scriptin/jmdict-simplified (or override with an env var). */
export async function jmdictAssetUrl(pattern, envVar) {
  if (process.env[envVar]) return process.env[envVar];
  const res = await fetch("https://api.github.com/repos/scriptin/jmdict-simplified/releases/latest", {
    headers: { "User-Agent": "nihongo-reviewer-build" },
  });
  if (!res.ok) throw new Error(`GitHub API: HTTP ${res.status} (set ${envVar} to a direct URL to override)`);
  const rel = await res.json();
  const asset = rel.assets.find((a) => pattern.test(a.name));
  if (!asset) throw new Error(`No release asset matches ${pattern}`);
  return asset.url;
}

export function writeJson(name, data) {
  const text = JSON.stringify(data);
  writeFileSync(join(OUT, name), text);
  console.log(`  wrote public/data/${name}  (${(text.length / 1024).toFixed(0)} KB)`);
}

export function readCachedJson(name) {
  return JSON.parse(readFileSync(join(CACHE, name), "utf8"));
}

export const hasKanji = (s) => /[\u4e00-\u9fff々]/.test(s);

