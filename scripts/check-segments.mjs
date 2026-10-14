// Data integrity check for the segment landing pages.
// Catches the four classes `tsc` cannot see: a photo path with no file behind
// it, a duplicate slug, a hero reusing one of its own page's card photos, and a
// YouTube id with a leftover `?si=` suffix.
// Run: npm run check:segments
import { existsSync, readFileSync } from 'node:fs';

const SRC = 'src/components/data/segments.ts';
const MANIFEST = 'scripts/segment-images.manifest.json';

const EXPECTED_SLUGS = [
  'romantic', 'family', 'girls-weekend', 'bachelorette', 'birthday',
  'celebrations', 'wellness-retreat', 'corporate-retreat', 'group',
  'solo', 'remote-work', 'road-trip', 'pet-friendly',
];

const src = readFileSync(SRC, 'utf8');
const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
const errors = [];

// Each segment object, as slug plus the text that follows it up to the next one.
const found = [...src.matchAll(/slug: '([^']+)'([\s\S]*?)(?=\n    slug: '|\n\];)/g)]
  .map(([, slug, body]) => ({
    slug,
    keys: [...body.matchAll(/key: '([A-Za-z]+)'/g)].map((m) => m[1]),
    shorts: (body.match(/shorts: \[([^\]]+)\]/)?.[1] ?? '')
      .split(',').map((v) => v.trim().replace(/^'|'$/g, '')).filter(Boolean),
  }));

// 1. exactly the expected slugs, each once
const seen = found.map((f) => f.slug);
for (const slug of EXPECTED_SLUGS) {
  const n = seen.filter((x) => x === slug).length;
  if (n === 0) errors.push(`missing segment: ${slug}`);
  if (n > 1) errors.push(`duplicate slug: ${slug} (appears ${n} times)`);
}
for (const slug of seen) {
  if (!EXPECTED_SLUGS.includes(slug)) errors.push(`unexpected slug: ${slug}`);
}

for (const { slug, keys, shorts } of found) {
  // 2. the hero derivative exists
  const hero = `public/images/segments/heroes/${slug}.webp`;
  if (!existsSync(hero)) errors.push(`${slug}: missing hero image ${hero}`);

  for (const key of keys) {
    // 3. every card derivative exists
    const card = `public/images/segments/cards/${key}.webp`;
    if (!existsSync(card)) errors.push(`${slug}: missing card image ${card}`);

    // 4. the hero is not the same photo as one of this page's own cards
    if (manifest.heroes[slug] && manifest.heroes[slug] === manifest.cards[key]) {
      errors.push(
        `${slug}: hero and the '${key}' card are both ${manifest.heroes[slug]} ` +
        `— the same photo must not appear twice on one page`,
      );
    }
  }

  // 5. video ids are ids, not pasted URLs
  for (const id of shorts) {
    if (!/^[A-Za-z0-9_-]{11}$/.test(id)) errors.push(`${slug}: malformed video id ${JSON.stringify(id)}`);
  }
}

if (errors.length) {
  console.error(`check:segments FAILED (${errors.length})`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`check:segments passed — ${found.length} segments`);
