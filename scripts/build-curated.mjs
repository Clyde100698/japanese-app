// Builds public/data/particles.json, phrases.json, grammar.json, and scenarios.json from hand-curated sources.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PARTICLES } from "./data/particles-source.mjs";
import { PHRASES } from "./data/phrases-source.mjs";
import { GRAMMAR } from "./data/grammar-source.mjs";
import { SCENARIOS } from "./data/scenarios-source.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "data");
mkdirSync(outDir, { recursive: true });

writeFileSync(join(outDir, "particles.json"), JSON.stringify(PARTICLES, null, 2));
console.log(`particles.json: ${PARTICLES.length} entries`);

writeFileSync(join(outDir, "phrases.json"), JSON.stringify(PHRASES, null, 2));
console.log(`phrases.json: ${PHRASES.length} entries`);

writeFileSync(join(outDir, "grammar.json"), JSON.stringify(GRAMMAR, null, 2));
console.log(`grammar.json: ${GRAMMAR.length} patterns across N5-N1`);

writeFileSync(join(outDir, "scenarios.json"), JSON.stringify(SCENARIOS, null, 2));
console.log(`scenarios.json: ${SCENARIOS.length} scenarios across N5-N1`);
