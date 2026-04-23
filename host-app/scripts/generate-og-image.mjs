import sharp from "sharp";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "public", "og-image.png");
mkdirSync(join(__dirname, "..", "public"), { recursive: true });

// Pill layout — 5 items, 16px gap, centred on 1200px canvas
const pills = [
  { label: "Health Score", w: 164 },
  { label: "Retirement",   w: 138 },
  { label: "Protection",   w: 138 },
  { label: "Estate",       w: 104 },
  { label: "Investment",   w: 140 },
];
const GAP   = 16;
const totalW = pills.reduce((s, p) => s + p.w, 0) + GAP * (pills.length - 1);
let px = (1200 - totalW) / 2;
const pillSVG = pills
  .map((p) => {
    const cx = px + p.w / 2;
    const svg = `
  <rect x="${px}" y="508" width="${p.w}" height="44" rx="22"
        fill="white" fill-opacity="0.1"
        stroke="white" stroke-opacity="0.2" stroke-width="1"/>
  <text x="${cx}" y="530" text-anchor="middle" dominant-baseline="middle"
        font-family="sans-serif" font-weight="500" font-size="17" fill="#e2e8f0">${p.label}</text>`;
    px += p.w + GAP;
    return svg;
  })
  .join("");

const svg = Buffer.from(`
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#0f172a"/>
      <stop offset="60%"  stop-color="#1e3a5f"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="white" fill-opacity="0.05"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#dots)"/>

  <!-- Badge glow -->
  <rect x="547" y="135" width="106" height="106" rx="30"
        fill="#1d4ed8" fill-opacity="0.35"/>
  <!-- Badge -->
  <rect x="552" y="140" width="96" height="96" rx="24" fill="#2563eb"/>
  <text x="600" y="188" text-anchor="middle" dominant-baseline="middle"
        font-family="sans-serif" font-weight="800" font-size="46" fill="white">88</text>

  <!-- Brand name -->
  <text x="600" y="308" text-anchor="middle" dominant-baseline="middle"
        font-family="sans-serif" font-weight="800" font-size="62" fill="white">88Wealth Management</text>

  <!-- Sub-brand -->
  <text x="600" y="363" text-anchor="middle" dominant-baseline="middle"
        font-family="sans-serif" font-weight="500" font-size="20" fill="#93c5fd"
        letter-spacing="3">MANDATED FSP  ·  FAIRBAIRN CONSULT  ·  FSP 9328</text>

  <!-- Tagline -->
  <text x="600" y="413" text-anchor="middle" dominant-baseline="middle"
        font-family="sans-serif" font-size="20" fill="#cbd5e1">
    Financial Health Score · Retirement · Protection · Estate &amp; Investment planning
  </text>
  <text x="600" y="444" text-anchor="middle" dominant-baseline="middle"
        font-family="sans-serif" font-size="19" fill="#94a3b8">All in one place.</text>

  <!-- Pill badges -->
  ${pillSVG}
</svg>
`);

await sharp(svg).png().toFile(outPath);
console.log("✓  OG image → public/og-image.png");
