// Generates the resized derivatives the segment landing pages reference.
// Sources stay untouched; app code only ever references the output paths.
import sharp from 'sharp';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const IMAGES = 'public/images';

// AmenityKey -> source photo. Card derivatives are named by key, so the page
// code can derive its path without a registry in the bundle.
const CARD_SOURCES = {
  villa:          'sandhills/Villa.webp',
  lake:           'sandhills/canoes.webp',
  sauna:          'sandhills/sauna.webp',
  firepit:        'sandhills/fire_pit.webp',
  ebikes:         'bikes.webp',
  acres:          'sandhills/land.webp',
  sports:         'experience/05-the-open-field.webp',
  teamActivities: 'experience/bring you a-game.webp',
  trails:         'sandhills/Forest_bathing_walk.webp',
  forestTrails:   'sandhills/twelve_miles.webp',
  photoReady:     'villa/hero/1.webp',
  privateGrounds: 'experience/05-the-open-field.webp',
};

// slug -> source photo. Six come from b2b/; the other seven are placeholders
// from the general library, to be swapped when the client supplies real
// segment photography. Each was checked against that page's own card photos —
// no page may show the same image twice.
const HERO_SOURCES = {
  'romantic':          'villa/hero/2.webp',
  'family':            'b2b/Family Reunions.webp',
  'girls-weekend':     'experience/pool-days.webp',
  'bachelorette':      'b2b/Bachelor.webp',
  'birthday':          'b2b/Birthday Weekends.webp',
  'celebrations':      'b2b/Private Celebrations.webp',
  'wellness-retreat':  'b2b/Wellness Retreats.webp',
  'corporate-retreat': 'b2b/Corporate Retreats.webp',
  'group':             'villa/hero/3.webp',
  'solo':              'sandhills/Forest_bathing_walk.webp',
  'remote-work':       'villa/03_Terrace/2.webp',
  'road-trip':         'sandhills/twelve_miles.webp',
  'pet-friendly':      'sandhills/worthit.webp',
};

// Guard: Detect duplicate sources that would produce identical outputs.
// sports and privateGrounds intentionally share a source (known exception).
function validateNoDuplicateSources() {
  const KNOWN_SHARED = new Set([
    'experience/05-the-open-field.webp', // sports + privateGrounds
  ]);

  const cardValues = Object.entries(CARD_SOURCES);
  for (let i = 0; i < cardValues.length; i++) {
    for (let j = i + 1; j < cardValues.length; j++) {
      const [key1, src1] = cardValues[i];
      const [key2, src2] = cardValues[j];
      if (src1 === src2 && !KNOWN_SHARED.has(src1)) {
        throw new Error(
          `CARD_SOURCES: "${key1}" and "${key2}" both map to "${src1}". ` +
          `Derivative filenames are always distinct, so duplicate sources mean ` +
          `identical files on disk and wasted storage. If this is intentional, ` +
          `add it to KNOWN_SHARED.`
        );
      }
    }
  }

  const heroValues = Object.entries(HERO_SOURCES);
  for (let i = 0; i < heroValues.length; i++) {
    for (let j = i + 1; j < heroValues.length; j++) {
      const [key1, src1] = heroValues[i];
      const [key2, src2] = heroValues[j];
      if (src1 === src2) {
        throw new Error(
          `HERO_SOURCES: "${key1}" and "${key2}" both map to "${src1}". ` +
          `Each landing page must have a unique hero image.`
        );
      }
    }
  }
}

async function build(kind, sources, width, budget) {
  const outDir = path.join(IMAGES, 'segments', kind);
  await mkdir(outDir, { recursive: true });

  let anyFailed = false;

  for (const [name, source] of Object.entries(sources)) {
    const out = path.join(outDir, `${name}.webp`);
    let finalQuality = 85;
    let size;

    // Binary search for the highest quality that stays under budget.
    for (let q = 85; q >= 10; q -= 5) {
      await sharp(path.join(IMAGES, source))
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: q })
        .toFile(out);
      const stat_result = await stat(out);
      size = stat_result.size;
      if (size < budget) {
        finalQuality = q;
        break;
      }
    }

    // If still over budget at q=10, try finer steps near the boundary.
    if (size >= budget) {
      for (let q = 9; q >= 1; q--) {
        await sharp(path.join(IMAGES, source))
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: q })
          .toFile(out);
        const stat_result = await stat(out);
        size = stat_result.size;
        if (size < budget) {
          finalQuality = q;
          break;
        }
      }
    }

    const passed = size < budget ? '✓' : '✗ OVER';
    console.log(
      `${kind}/${name}.webp  ${size} bytes  (q${finalQuality})  ${passed}  <- ${source}`
    );

    if (size >= budget) {
      anyFailed = true;
    }
  }

  if (anyFailed) {
    process.exit(1);
  }
}

validateNoDuplicateSources();

await build('cards', CARD_SOURCES, 800, 100000);
await build('heroes', HERO_SOURCES, 1600, 200000);

// The manifest lets check-segments.mjs detect a hero reusing one of its own
// page's card photos — derivative filenames are always distinct, so the only
// way to catch that is to compare the sources they came from.
await writeFile(
  'scripts/segment-images.manifest.json',
  JSON.stringify({ cards: CARD_SOURCES, heroes: HERO_SOURCES }, null, 2) + '\n',
);
console.log('wrote scripts/segment-images.manifest.json');
