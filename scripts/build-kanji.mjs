// KANJIDIC2 (via jmdict-simplified) + Tanos kanji list -> public/data/kanji-n5..n1.json (+ joyo.json)
// KANJIDIC2 (c) EDRDG, CC BY-SA 4.0
import { unzipSync } from "fflate";
import { download, isZip, jmdictAssetUrl, writeJson } from "./lib/common.mjs";
import { getTanosKanji } from "./lib/tanos.mjs";
import { buildKanji } from "./lib/transform.mjs";

console.log("KANJIDIC2: locating latest kanjidic2-en release...");
const url = await jmdictAssetUrl(/^kanjidic2-en-[\d.]+\+\d+\.json\.zip$/, "KANJIDIC_URL");
const zip = await download(url, "kanjidic2-en.json.zip", { valid: isZip });
const files = unzipSync(new Uint8Array(zip));
const name = Object.keys(files).find((n) => n.endsWith(".json"));
const kd = JSON.parse(Buffer.from(files[name]).toString("utf8"));
console.log(`  KANJIDIC2: ${kd.characters.length} characters`);

const { kanji, joyo } = buildKanji(kd.characters, await getTanosKanji());
for (const [level, list] of Object.entries(kanji)) writeJson(`kanji-${level.toLowerCase()}.json`, list);
writeJson("joyo.json", joyo);
console.log(`  ${joyo.length} jōyō kanji`);

