// Renders PWA icons from an inline SVG using sharp (bundled with Next.js).
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "public", "icons");
mkdirSync(out, { recursive: true });

// Maskable icons need content inside the central 80% safe zone.
const svg = (scale) => `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#e11d48"/>
  <g transform="translate(256 256) scale(${scale}) translate(-256 -256)">
    <circle cx="256" cy="256" r="170" fill="#fff"/>
    <text x="256" y="320" font-size="230" text-anchor="middle" fill="#e11d48"
      font-family="Yu Gothic, Meiryo, Noto Sans JP, sans-serif" font-weight="700">あ</text>
  </g>
</svg>`;

const jobs = [
  ["icon-512.png", 512, 1],
  ["icon-192.png", 192, 1],
  ["apple-touch-icon.png", 180, 1],
  ["icon-maskable-512.png", 512, 0.8],
];
for (const [name, size, scale] of jobs) {
  await sharp(Buffer.from(svg(scale))).resize(size, size).png().toFile(join(out, name));
}
console.log("icons written to public/icons");

