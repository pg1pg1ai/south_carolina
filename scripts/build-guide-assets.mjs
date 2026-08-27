/**
 * One-off: converts the guide's oversized source images to sized webp.
 * Run: node scripts/build-guide-assets.mjs
 *
 * The property map source is the label-free aerial extracted out of map.pdf
 * and retouched — see docs/superpowers/plans/2026-08-12-guide-page-client-revisions.md
 * Task 1. Source PNGs are deleted after this runs.
 */
import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const GUIDE = join(__dirname, '..', 'public', 'images', 'guide');

const jobs = [
  { from: '/tmp/property-map-clean.png', to: join(GUIDE, 'property-map.webp'), width: 2230, quality: 82 },
  { from: join(GUIDE, 'sauna.png'), to: join(GUIDE, 'sauna.webp'), width: 1600, quality: 85 },
  ...[1, 2, 3, 4, 5].map((i) => ({
    from: join(GUIDE, `slide-${i}.PNG`),
    to: join(GUIDE, `slide-${i}.webp`),
    width: 1600,
    quality: 85,
  })),
];

for (const { from, to, width, quality } of jobs) {
  const info = await sharp(from).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(to);
  console.log(`  ✓ ${to.split('/').pop()} — ${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB`);
}
