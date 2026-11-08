// JMdict (via jmdict-simplified) + Tanos JLPT lists -> public/data/words-n5..n1.json
// Source: https://github.com/scriptin/jmdict-simplified  (JMdict (c) EDRDG, CC BY-SA 4.0)
import { unzipSync } from "fflate";
import { download, isZip, jmdictAssetUrl, writeJson } from "./lib/common.mjs";
import { getTanosVocab } from "./lib/tanos.mjs";
import { buildWords } from "./lib/transform.mjs";

console.log("JMdict: locating latest jmdict-eng release...");
const url = await jmdictAssetUrl(/^jmdict-eng-[\d.]+\+\d+\.json\.zip$/, "JMDICT_URL");
const zip = await download(url, "jmdict-eng.json.zip", { valid: isZip });
const files = unzipSync(new Uint8Array(zip));
const name = Object.keys(files).find((n) => n.endsWith(".json"));
const jmdict = JSON.parse(Buffer.from(files[name]).toString("utf8"));
console.log(`  JMdict ${jmdict.version ?? ""}: ${jmdict.words.length} entries`);

const { words, unmatched } = buildWords(jmdict.words, await getTanosVocab());
let total = 0;
for (const [level, list] of Object.entries(words)) {
  writeJson(`words-${level.toLowerCase()}.json`, list);
  total += list.length;
}
console.log(`  ${total} words matched; ${unmatched.length} list entries had no JMdict match`);
if (unmatched.length) writeJson("words-unmatched.json", unmatched.slice(0, 300));

