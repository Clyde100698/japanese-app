// Builds public/data/particles.json, phrases.json, and grammar.json from hand-curated sources.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PARTICLES } from "./data/particles-source.mjs";
import { PHRASES } from "./data/phrases-source.mjs";
import { GRAMMAR } from "./data/grammar-source.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "data");
mkdirSync(outDir, { recursive: true });

writeFileSync(join(outDir, "particles.json"), JSON.stringify(PARTICLES, null, 2));
console.log(`particles.json: ${PARTICLES.length} entries`);

writeFileSync(join(outDir, "phrases.json"), JSON.stringify(PHRASES, null, 2));
console.log(`phrases.json: ${PHRASES.length} entries`);

writeFileSync(join(outDir, "grammar.json"), JSON.stringify(GRAMMAR, null, 2));
console.log(`grammar.json: ${GRAMMAR.length} patterns across N5-N1`);
