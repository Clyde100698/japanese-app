// Runs every data builder. Steps that need the network report failures but do not stop the others,
// so a blocked host never leaves you with nothing. Re-run `npm run build:data` to retry (downloads are cached).
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const STEPS = [
  { file: "build-kana.mjs", label: "Kana (hand-curated)" },
  { file: "build-curated.mjs", label: "Particles, Phrases & Grammar (hand-curated)" },
  { file: "build-kana-strokes.mjs", label: "KanjiVG: kana strokes" },
  { file: "build-vocab.mjs", label: "JMdict + JLPT vocab" },
  { file: "build-kanji.mjs", label: "KANJIDIC2 + JLPT kanji" },
  { file: "build-kanji-strokes.mjs", label: "KanjiVG: kanji strokes", needs: "build-kanji.mjs" },
  { file: "build-sentences.mjs", label: "Tatoeba sentences" },
];

const status = {};
for (const step of STEPS) {
  console.log(`\n=== ${step.label} (${step.file})`);
  if (step.needs && status[step.needs] !== "ok") {
    console.log(`  skipped: ${step.needs} did not succeed`);
    status[step.file] = "skipped";
    continue;
  }
  const r = spawnSync(process.execPath, [join(here, step.file)], { stdio: "inherit" });
  status[step.file] = r.status === 0 ? "ok" : "FAILED";
}

console.log("\n=== Summary");
for (const s of STEPS) console.log(`  ${status[s.file].padEnd(8)} ${s.label}`);
writeFileSync(join(here, "..", "public", "data", "build-info.json"), JSON.stringify({ builtAt: new Date().toISOString(), status }));
if (Object.values(status).some((v) => v !== "ok")) {
  console.log("\nSome steps did not complete. See messages above; the app still runs with the data that was built.");
  process.exit(1);
}
