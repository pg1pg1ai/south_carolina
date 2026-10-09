# Segment Landing Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship 13 audience-targeted landing pages (`/family`, `/birthday`, `/romantic`, …) as unlinked subpages on the existing site, each four screens long, every CTA opening one shared request-form pop-up.

**Architecture:** One `SegmentLanding` template reads one `Segment` data object per page; four presentational screen components; one portalled `RequestFormModal` posting to the existing `/api/send-inquiry`. Routes are generated from the data registry. Oversized source photos are resized once by a build script into per-key and per-slug derivatives; app code references only those.

**Tech Stack:** React 19, TypeScript ~6, Vite 8, React Router 7, Framer Motion 12, Tailwind 3.4, sharp (build-time only).

**Spec:** [`docs/superpowers/specs/2026-10-10-segment-landing-pages-design.md`](../specs/2026-10-10-segment-landing-pages-design.md)

**One deliberate deviation from the spec:** the spec defines an
`AMENITY_PHOTOS: Record<AmenityKey, string>` registry in `segments.ts`. Because
card derivatives are named by amenity key, the path is fully derivable
(`/images/segments/cards/<key>.webp`), so the registry would be a lookup table
that only ever restates its own keys. This plan replaces it with a one-line
`cardPhoto(key)` helper and keeps the source-photo mapping in the build script,
where the spec already says source paths belong. Same behaviour, one less thing
to keep in sync.
**Client copy deck:** [`docs/segment-landing-pages/client-brief.md`](../../segment-landing-pages/client-brief.md)

## Global Constraints

Every task's requirements implicitly include these. Values are verbatim from the spec.

- **No chrome.** These pages render no `StickyHeader` and no `Footer`. Four screens and the modal, nothing else.
- **Copy is stored in sentence case.** `Button`'s base class already applies `uppercase`, so buttons still display as "PLAN YOUR GETAWAY". Storing the brief's ALL CAPS would double-uppercase buttons and produce headlines matching nothing else on the site.
- **Two copy corrections** from the brief: the wellness video heading is "Wellness retreats at Horizons Sandhills" (brief reads "WELNESS"), and the romantic lake card reads "18-acre private lake" (brief reads "18-acres").
- **Form fields:** Name, Phone, Email — all three required.
- **`SITE_ORIGIN = 'https://sandhills.gohorizons.com'`** — the live origin. The existing `https://horizonssandhills.com` URLs in `public/sitemap.xml` and `src/components/StructuredData.tsx` are stale and must route through this constant.
- **Lead payload:** `sendInquiry('landing-request', { page: segment.leadLabel, name, phone, email })`.
- **All reveal animation goes through `RevealOnScroll`**, which already short-circuits on `useReducedMotion()`. Do not hand-roll `motion` reveals in these components.
- **No photo may appear twice on the same page** (hero vs. its own six cards).
- **Derivative budgets:** cards ~800px wide, under 100 KB each; heroes ~1600px wide, under 200 KB each.
- **Do not install a test framework** and do not add new structured data. Verification is `tsc -b`, `npm run lint`, a plain-node data check, and browser passes.
- **Mobile:** every screen must hold up at 400px wide with no horizontal scroll.
- **Exact slugs:** `romantic`, `family`, `girls-weekend`, `bachelorette`, `birthday`, `celebrations`, `wellness-retreat`, `corporate-retreat`, `group`, `solo`, `remote-work`, `road-trip`, `pet-friendly`.

## Review Focus

Five failure modes the spec implies that no ordinary happy-path check would catch, most likely first. Each has a test pinned to the task that owns the code.

1. **A photo path pointing at a file that does not exist** — a silent broken image on a live paid-traffic page. Thirteen heroes and twelve card derivatives are referenced by convention, so a rename anywhere breaks a page with no compile error. *Test: Task 2, file-existence assertion in `scripts/check-segments.mjs`.*
2. **A duplicate slug in the registry** — React Router matches the first and one whole segment becomes silently unreachable, with its ad spend landing on the wrong page. *Test: Task 2, uniqueness assertion.*
3. **The same photo used as both hero and one of that page's cards** — reads as a bug to a visitor; the spec warns the margin is thin because `sports` and `privateGrounds` share a source. *Test: Task 2, per-page collision assertion.*
4. **`document.title` leaking across routes** — an SPA that sets the title without restoring it on unmount leaves the main site showing "Bachelorette Weekend — Horizons Sandhills". *Test: Task 7, Step 6 browser navigation check.*
5. **A failed submission showing the success state** — if Resend or the network fails and the modal still says "Thank you!", the lead is lost silently and the visitor never retries. *Test: Task 5, Step 6 offline submission check.*

A sixth, cheap to cover: a YouTube ID transcribed with a stray `?si=` suffix or trailing space renders a broken thumbnail. *Test: Task 2, ID-format assertion.*

---

## Task 1: Image derivatives

Source photos are far too heavy to serve: `sandhills/land.webp` is 1.4 MB, `Villa.webp` 956 KB, `Forest_bathing_walk.webp` 676 KB. Six of those on one screen is a 3–4 MB page on paid traffic. This task generates every derivative the later tasks reference by convention.

**Files:**
- Create: `scripts/build-segment-images.mjs`
- Create (generated): `public/images/segments/cards/*.webp` (12 files), `public/images/segments/heroes/*.webp` (13 files), `scripts/segment-images.manifest.json`
- Modify: `package.json` (add a `build:segment-images` script)
- Modify: `IMAGE_MAP.md`

**Interfaces:**
- Consumes: nothing.
- Produces: `/images/segments/cards/<AmenityKey>.webp` for the 12 keys `villa, lake, sauna, firepit, ebikes, acres, sports, teamActivities, trails, forestTrails, photoReady, privateGrounds`; and `/images/segments/heroes/<slug>.webp` for the 13 slugs. Later tasks derive these paths from the key and slug — the filenames are the contract.

- [ ] **Step 1: Write the generator script**

Create `scripts/build-segment-images.mjs`. The source mapping lives here and nowhere else — app code never names a source photo, which is also what makes the one source filename containing a space harmless.

```js
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
  'family':            'b2b/family-reunions.webp',
  'girls-weekend':     'experience/pool-days.webp',
  'bachelorette':      'b2b/bachelor-bachelorette.webp',
  'birthday':          'b2b/birthday-weekends.webp',
  'celebrations':      'b2b/private-celebrations.webp',
  'wellness-retreat':  'b2b/wellness-retreats.webp',
  'corporate-retreat': 'b2b/corporate-retreats.webp',
  'group':             'villa/hero/3.webp',
  'solo':              'sandhills/Forest_bathing_walk.webp',
  'remote-work':       'villa/03_Terrace/2.webp',
  'road-trip':         'sandhills/twelve_miles.webp',
  'pet-friendly':      'sandhills/Forest_bathing_walk.webp',
};

async function build(kind, sources, width, quality) {
  const outDir = path.join(IMAGES, 'segments', kind);
  await mkdir(outDir, { recursive: true });
  for (const [name, source] of Object.entries(sources)) {
    const out = path.join(outDir, `${name}.webp`);
    await sharp(path.join(IMAGES, source))
      .resize({ width, withoutEnlargement: true })
      .webp({ quality })
      .toFile(out);
    const { size } = await stat(out);
    console.log(`${kind}/${name}.webp  ${(size / 1024).toFixed(0)} KB  <- ${source}`);
  }
}

await build('cards', CARD_SOURCES, 800, 72);
await build('heroes', HERO_SOURCES, 1600, 74);

// The manifest lets check-segments.mjs detect a hero reusing one of its own
// page's card photos — derivative filenames are always distinct, so the only
// way to catch that is to compare the sources they came from.
await writeFile(
  'scripts/segment-images.manifest.json',
  JSON.stringify({ cards: CARD_SOURCES, heroes: HERO_SOURCES }, null, 2) + '\n',
);
console.log('wrote scripts/segment-images.manifest.json');
```

- [ ] **Step 2: Add the npm script**

In `package.json`, inside `"scripts"`:

```json
"build:segment-images": "node scripts/build-segment-images.mjs"
```

- [ ] **Step 3: Run it and verify every file lands under budget**

Run: `npm run build:segment-images`
Expected: 25 lines of output — 12 cards then 13 heroes. Every `cards/*` line under 100 KB, every `heroes/*` line under 200 KB. If any exceeds budget, lower that call's `quality` (not the width) and rerun.

- [ ] **Step 4: Confirm the counts on disk**

Run: `ls public/images/segments/cards | wc -l && ls public/images/segments/heroes | wc -l && cat scripts/segment-images.manifest.json | head -5`
Expected: `12`, then `13`, then the opening of the manifest.

- [ ] **Step 5: Document the new assets**

Add a section to `IMAGE_MAP.md` recording: the two new derivative directories, that app code references derivatives and never sources, that `scripts/build-segment-images.mjs` holds the source mapping, and that the seven placeholder heroes (`romantic`, `girls-weekend`, `group`, `solo`, `remote-work`, `road-trip`, `pet-friendly`) are awaiting real client photography — swapping one means editing `HERO_SOURCES` and rerunning the script.

- [ ] **Step 6: Commit**

```bash
git add scripts/build-segment-images.mjs scripts/segment-images.manifest.json package.json IMAGE_MAP.md public/images/segments
git commit -m "Add resized image derivatives for the segment landing pages"
```

---

## Task 2: Data types, integrity check, and two segments

Proves the data shape against two real pages before eleven more are transcribed, and builds the check that catches the transcription errors the type system cannot see.

**Files:**
- Create: `src/components/data/segments.ts`
- Create: `scripts/check-segments.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: the derivative filenames from Task 1.
- Produces: `export type AmenityKey`, `export interface AmenityCard`, `export interface Segment`, `export const segments: Segment[]`, and `export function cardPhoto(key: AmenityKey): string`. Tasks 3, 6 and 7 all import from here.

- [ ] **Step 1: Write the types and the two segments**

Create `src/components/data/segments.ts`:

```ts
/** Audience-targeted landing pages. Copy transcribed from
 *  docs/segment-landing-pages/client-brief.md — sentence case on purpose:
 *  Button applies `uppercase` itself, and the site's headlines are sentence case. */

export type AmenityKey =
  | 'villa' | 'lake' | 'sauna' | 'firepit' | 'ebikes' | 'acres'
  | 'sports' | 'teamActivities' | 'trails' | 'forestTrails'
  | 'photoReady' | 'privateGrounds';

export interface AmenityCard {
  key: AmenityKey;
  /** Per-page wording: 'Private forest villa' on solo, '…villas' on bachelorette. */
  title: string;
  line: string;
}

/** Six and three are the brief's format, enforced as tuples so `tsc -b` fails
 *  on a page that gained or lost a card or a video during transcription. */
type SixCards = [AmenityCard, AmenityCard, AmenityCard, AmenityCard, AmenityCard, AmenityCard];
type ThreeShorts = [string, string, string];

export interface Segment {
  slug: string;
  /** Names the page in the lead email, e.g. 'Family Getaway'. */
  leadLabel: string;
  seo: { title: string; description: string };
  hero: { kicker: string; headline: string; sub: string; cta: string; photo: string };
  amenities: { heading: string; cards: SixCards };
  video: { heading: string; shorts: ThreeShorts };
  finalCta: { headline: string; cta: string };
}

/** Card derivatives are named by key, so the path needs no registry. */
export const cardPhoto = (key: AmenityKey) => `/images/segments/cards/${key}.webp`;

const heroPhoto = (slug: string) => `/images/segments/heroes/${slug}.webp`;

export const segments: Segment[] = [
  {
    slug: 'romantic',
    leadLabel: 'Romantic Getaway',
    seo: {
      title: 'Romantic Getaway — Horizons Sandhills',
      description: 'A few days away. A little more time together.',
    },
    hero: {
      kicker: 'Romantic getaway at Horizons Sandhills',
      headline: 'Just the two of you',
      sub: 'A few days away. A little more time together.',
      cta: 'Plan your getaway',
      photo: heroPhoto('romantic'),
    },
    amenities: {
      heading: 'Settle in. Spend some time together.',
      cards: [
        { key: 'villa',   title: 'Private forest villa', line: 'Five-star comfort in the middle of the forest.' },
        { key: 'lake',    title: 'Private lake',         line: 'Swim, kayak or paddle across 18-acre private lake.' },
        { key: 'sauna',   title: 'Wood-fired sauna',     line: 'A private sauna experience surrounded by forest.' },
        { key: 'firepit', title: 'Your own firepit',     line: 'Long evenings by the fire, entirely on your schedule.' },
        { key: 'ebikes',  title: 'E-bikes & trails',     line: 'Explore the property together on two wheels.' },
        { key: 'acres',   title: '126 acres of nature',  line: 'Quiet, privacy, and plenty of space around you.' },
      ],
    },
    video: {
      heading: 'Picture your weekend here',
      shorts: ['atYpnzyry9o', '56iFsaKc6tE', 'VWzVORxlizg'],
    },
    finalCta: {
      headline: 'Make your next date last all weekend',
      cta: 'Plan your getaway',
    },
  },
  {
    slug: 'family',
    leadLabel: 'Family Getaway',
    seo: {
      title: 'Family Getaway — Horizons Sandhills',
      description: 'Plenty to keep the kids busy. Plenty of comfort for the adults, too.',
    },
    hero: {
      kicker: 'Family getaway at Horizons Sandhills',
      headline: 'A family weekend everyone actually loves',
      sub: 'Plenty to keep the kids busy. Plenty of comfort for the adults, too.',
      cta: 'Plan your getaway',
      photo: heroPhoto('family'),
    },
    amenities: {
      heading: 'Built for days the whole family can get into',
      cards: [
        { key: 'villa',   title: 'Private forest villa', line: 'Five-star comfort with space for the whole family.' },
        { key: 'lake',    title: 'Private lake',         line: 'Swim, kayak, and paddleboard all in one place.' },
        { key: 'sports',  title: 'Sports & games',       line: 'Volleyball, soccer, and plenty of space to play outside.' },
        { key: 'ebikes',  title: 'E-bikes & trails',     line: 'Easy rides and trails to explore together.' },
        { key: 'firepit', title: 'Your own firepit',     line: 'Evenings by the fire after a full day outside.' },
        { key: 'acres',   title: '126 acres of nature',  line: 'Space to roam, play, and spend the day outdoors.' },
      ],
    },
    video: {
      heading: 'Family days at Horizons',
      shorts: ['OkXZLmQq4lQ', 'ezPuRvMS4E4', 'LUbdzfgbH6Q'],
    },
    finalCta: {
      headline: 'Give your family more than another weekend at home',
      cta: 'Plan your getaway',
    },
  },
];
```

- [ ] **Step 2: Write the integrity check**

Create `scripts/check-segments.mjs`. This is the plan's test harness for the data — plain node, no new dependency, per the spec's no-test-framework constraint. It catches the four classes the type system cannot: a photo path with no file behind it, a duplicate slug, a hero reusing one of its own page's card photos (via Task 1's manifest, since derivative filenames are always distinct), and a YouTube id with a leftover `?si=` suffix. Card and video *counts* are already enforced by the tuple types, so it does not re-check them.

```js
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
```

**Known fragility:** the block regex keys off the four-space indentation of
`slug: '…'` inside the `segments` array. (The interface's own `slug: string;` is
skipped because it has no quote.) This script was verified against the two
segments above — it passes clean, and reports the right segment name for a
collision, a duplicate slug, a malformed video id and a missing file. If you
reformat `segments.ts`, rerun it and confirm it still counts 13 segments rather
than silently matching fewer.

- [ ] **Step 3: Add the npm script**

```json
"check:segments": "node scripts/check-segments.mjs"
```

- [ ] **Step 4: Run the check and watch it fail for the right reason**

Run: `npm run check:segments`
Expected: FAIL listing the eleven not-yet-written segments — `missing segment: girls-weekend`, `missing segment: bachelorette`, and so on. It must NOT report missing images or malformed IDs: Task 1's derivatives exist and the two transcribed segments are correct. If it reports a missing image, Task 1's filenames and this convention disagree — fix before continuing.

- [ ] **Step 5: Typecheck**

Run: `npx tsc -b`
Expected: clean. If it reports a tuple-length error, one of the two segments has the wrong number of cards or videos.

- [ ] **Step 6: Commit**

```bash
git add src/components/data/segments.ts scripts/check-segments.mjs package.json
git commit -m "Add segment data types, integrity check, and the first two segments"
```

---

## Task 3: The remaining eleven segments

**Files:**
- Modify: `src/components/data/segments.ts`

**Interfaces:**
- Consumes: `Segment`, `heroPhoto` from Task 2.
- Produces: `segments` with all 13 entries, in the order of the slug list.

- [ ] **Step 1: Transcribe the eleven remaining segments**

Append to the `segments` array, in this order: `girls-weekend`, `bachelorette`, `birthday`, `celebrations`, `wellness-retreat`, `corporate-retreat`, `group`, `solo`, `remote-work`, `road-trip`, `pet-friendly`.

Copy comes from `docs/segment-landing-pages/client-brief.md`, which holds all 13 pages verbatim in this same order after the first two. Follow the `romantic` object in Task 2 as the shape, field for field, and these mechanical rules:

| Target field | Source in the brief |
|---|---|
| `hero.kicker` | Screen 1, first line (e.g. "GIRLS' WEEKEND AT HORIZONS SANDHILLS") |
| `hero.headline` | Screen 1, second line |
| `hero.sub` | Screen 1, third line |
| `hero.cta` | Screen 1 `(Button)` label |
| `amenities.heading` | Screen 2 heading |
| `amenities.cards[n].title` | Screen 2, each card's first line |
| `amenities.cards[n].line` | Screen 2, each card's second line |
| `video.heading` | Screen 3 heading |
| `video.shorts` | Screen 3 URLs, ID only — strip `?si=…` |
| `finalCta.headline` | Screen 4 heading |
| `finalCta.cta` | Screen 4 button label |
| `seo.title` | `<leadLabel> — Horizons Sandhills` |
| `seo.description` | same text as `hero.sub` |
| `hero.photo` | `heroPhoto('<slug>')` |

Lead labels, in order: `Girls' Weekend`, `Bachelorette Weekend`, `Birthday Getaway`, `Celebration Getaway`, `Wellness Retreat`, `Corporate Retreat`, `Group Getaway`, `Solo Getaway`, `Remote Work Getaway`, `Road Trip Stay`, `Pet-Friendly Getaway`.

Amenity keys per page, in the brief's card order — the spec's inventory table is authoritative:

| Slug | Keys in order |
|---|---|
| `girls-weekend` | villa, lake, sauna, firepit, ebikes, acres |
| `bachelorette` | villa, lake, sauna, firepit, photoReady, acres |
| `birthday` | villa, lake, sauna, firepit, ebikes, acres |
| `celebrations` | villa, lake, sauna, firepit, ebikes, acres |
| `wellness-retreat` | villa, lake, sauna, trails, firepit, acres |
| `corporate-retreat` | villa, lake, teamActivities, firepit, trails, acres |
| `group` | villa, lake, sports, ebikes, firepit, acres |
| `solo` | villa, lake, sauna, ebikes, firepit, acres |
| `remote-work` | villa, lake, sauna, ebikes, firepit, acres |
| `road-trip` | villa, lake, sauna, ebikes, firepit, acres |
| `pet-friendly` | villa, acres, forestTrails, lake, firepit, privateGrounds |

Three things that are easy to get wrong:

- **Sentence case.** The brief is ALL CAPS; convert. "THE TRIP THAT FINALLY MADE IT OUT OF THE CHAT" becomes "The trip that finally made it out of the chat".
- **`hero.cta` and `finalCta.cta` differ on two pages.** `bachelorette` is "Plan the bachelorette" then "Plan the weekend". `pet-friendly` is "Plan your getaway" then "Plan your stay". Everywhere else the two match.
- **The two corrections** from Global Constraints: `wellness-retreat`'s video heading is "Wellness retreats at Horizons Sandhills" (the brief misspells it "WELNESS"); `romantic` is already handled.

- [ ] **Step 2: Run the integrity check**

Run: `npm run check:segments`
Expected: `check:segments passed — 13 segments`. Any failure names the exact segment and problem; fix and rerun until clean.

- [ ] **Step 3: Typecheck**

Run: `npx tsc -b`
Expected: clean. A tuple error means a page has the wrong card or video count.

- [ ] **Step 4: Commit**

```bash
git add src/components/data/segments.ts
git commit -m "Add the remaining eleven segment landing page datasets"
```

---

## Task 4: Extract ShortThumb, build VideoStrip

`YouTubeShortsWidget.tsx` already contains a `ShortThumb` with exactly the right facade behaviour — a plain `<img>` thumbnail, with YouTube's embed script loading only on click. Three eager iframes would wreck LCP on an ad page. Lift it rather than copy it.

**Files:**
- Create: `src/components/primitives/ShortThumb.tsx`
- Modify: `src/components/blocks/YouTubeShortsWidget.tsx:17-48` (remove the local copy, import the shared one)
- Create: `src/components/segments/VideoStrip.tsx`

**Interfaces:**
- Consumes: `Segment['video']` from Task 2.
- Produces: `export default function ShortThumb({ id }: { id: string })`; `export default function VideoStrip({ video }: { video: Segment['video'] })`.

- [ ] **Step 1: Create the shared ShortThumb**

Create `src/components/primitives/ShortThumb.tsx` holding the component currently at `YouTubeShortsWidget.tsx:17-48`, verbatim including its explanatory comment:

```tsx
import { useState } from 'react';
import { Play } from 'lucide-react';

// Facade pattern: a plain <img> thumbnail is all that loads up front. YouTube's
// embed script only reaches the page once a visitor actually clicks play.
export default function ShortThumb({ id }: { id: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-night">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1`}
          title="Horizons Sandhills — YouTube Short"
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button onClick={() => setPlaying(true)} className="group absolute inset-0 h-full w-full" aria-label="Play video">
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(10,8,5,0.55), transparent 45%)' }}
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-linen/90 text-ink shadow-lg transition-transform group-hover:scale-110">
              <Play size={22} strokeWidth={1.6} fill="currentColor" style={{ marginLeft: 2 }} />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Point the existing widget at it**

In `YouTubeShortsWidget.tsx`: delete the local `ShortThumb` function and its now-duplicated `useState`/`Play` imports, and add `import ShortThumb from '../primitives/ShortThumb';`. Leave everything else — the `SHORTS` array, the section, the channel button — untouched.

- [ ] **Step 3: Create VideoStrip**

Create `src/components/segments/VideoStrip.tsx`:

```tsx
import type { Segment } from '../data/segments';
import RevealOnScroll from '../primitives/RevealOnScroll';
import ShortThumb from '../primitives/ShortThumb';

export default function VideoStrip({ video }: { video: Segment['video'] }) {
  return (
    <section data-zone="light" className="bg-bone px-6 py-20 md:px-12 md:py-28 lg:px-16">
      <div className="max-w-content mx-auto">
        <RevealOnScroll className="mb-10 md:mb-14">
          <h2 className="display-h2 text-ink text-[clamp(26px,3.6vw,44px)]">{video.heading}</h2>
        </RevealOnScroll>
        <RevealOnScroll variant="stagger-parent" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {video.shorts.map((id) => (
            <RevealOnScroll variant="stagger-child" key={id}>
              <ShortThumb id={id} />
            </RevealOnScroll>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Verify the existing widget still renders**

Run: `npm run dev`, open `http://localhost:5173/` and scroll to the Featured Videos section.
Expected: four thumbnails as before, and clicking one swaps in the player. This confirms the extraction did not change existing behaviour.

- [ ] **Step 5: Typecheck and lint**

Run: `npx tsc -b && npm run lint`
Expected: both clean.

- [ ] **Step 6: Commit**

```bash
git add src/components/primitives/ShortThumb.tsx src/components/blocks/YouTubeShortsWidget.tsx src/components/segments/VideoStrip.tsx
git commit -m "Extract ShortThumb into a primitive and add the segment VideoStrip"
```

---

## Task 5: The request form modal

**Files:**
- Create: `src/components/blocks/RequestFormModal.tsx`
- Modify: `api/send-inquiry.ts` (the `FORM_LABELS` map near the top)

**Interfaces:**
- Consumes: `sendInquiry` from `src/lib/sendInquiry.ts`; `CONTACT_WHATSAPP_HREF` from `src/lib/contact.ts`; `WhatsAppIcon` from `src/components/icons/WhatsAppIcon.tsx`.
- Produces: `export const openRequestForm: () => void` and `export default function RequestFormModal({ leadLabel }: { leadLabel: string })`. Tasks 6 and 7 both use these.

- [ ] **Step 1: Register the form type on the API side**

In `api/send-inquiry.ts`, add one entry to `FORM_LABELS`:

```ts
'landing-request': 'Landing Page Request',
```

Without it the email subject falls back to the generic "Website Inquiry" and the client cannot tell these leads from any other form. Change nothing else in that file — recipients and Resend config stay as they are.

- [ ] **Step 2: Build the modal**

Create `src/components/blocks/RequestFormModal.tsx`. Structurally this follows `PrivateEventModal.tsx` — same portal, same `AnimatePresence`, same `Field`, same Escape and backdrop-click close, same sending/failed states — with the brief's copy, three fields, and the brand `signal` accent rather than that component's private-hire blue.

```tsx
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { sendInquiry } from '../../lib/sendInquiry';
import { CONTACT_WHATSAPP_HREF } from '../../lib/contact';
import WhatsAppIcon from '../icons/WhatsAppIcon';

/** Fire from any CTA on a segment landing page to open the request form. */
export const openRequestForm = () => window.dispatchEvent(new CustomEvent('open-request-form'));

const ACCENT = '#B05329'; // brand signal

function Field({ label, type, ph, val, set, err }: { label: string; type?: string; ph: string; val: string; set: (v: string) => void; err?: boolean }) {
  return (
    <div className="mb-4">
      <label className="block font-eyebrow font-light text-ink2 mb-1" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{label}</label>
      <input
        type={type ?? 'text'}
        value={val}
        onChange={(e) => set(e.target.value)}
        placeholder={ph}
        className={`w-full bg-boneWarm text-ink font-eyebrow font-light text-sm px-3 py-2.5 outline-none border transition-colors ${err ? 'border-signal' : 'border-divider focus:border-signal'}`}
        style={{ borderRadius: 0 }}
      />
    </div>
  );
}

export default function RequestFormModal({ leadLabel }: { leadLabel: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);

  useEffect(() => {
    const onOpen = () => { setDone(false); setOpen(true); };
    window.addEventListener('open-request-form', onOpen);
    return () => window.removeEventListener('open-request-form', onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const submit = async () => {
    if (!name || !phone || !email) { setErr(true); setTimeout(() => setErr(false), 1200); return; }
    setSending(true);
    setSendFailed(false);
    const ok = await sendInquiry('landing-request', { page: leadLabel, name, phone, email });
    setSending(false);
    if (ok) { setDone(true); } else { setSendFailed(true); setTimeout(() => setSendFailed(false), 2500); }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[400] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
          style={{ background: 'rgba(20,18,14,0.72)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <motion.div
            className="relative w-full bg-bone"
            style={{ maxWidth: 440, borderRadius: 4 }}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-ink2 hover:text-ink transition-colors" style={{ fontSize: 22, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Close">×</button>
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center px-10 py-14">
                  <p className="font-display italic mb-2" style={{ fontSize: '1.5rem', color: ACCENT }}>Thank you!</p>
                  <p className="font-eyebrow font-light text-ink2" style={{ fontSize: 12, letterSpacing: '0.1em' }}>
                    We've received your request. Our team will be in touch soon to help you plan your getaway.
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-8 py-10">
                  <p className="font-display italic text-ink mb-1" style={{ fontSize: '1.4rem', lineHeight: 1.25 }}>Let's plan your stay!</p>
                  <p className="font-eyebrow font-light text-ink2 mb-4" style={{ fontSize: 12, letterSpacing: '0.1em' }}>
                    Share your contact details, and we'll help you plan your stay.
                  </p>
                  <p className="font-eyebrow font-light text-ink2 mb-7 flex items-center gap-2" style={{ fontSize: 12, letterSpacing: '0.1em' }}>
                    <a href={CONTACT_WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-ink hover:opacity-70 transition-opacity">
                      <WhatsAppIcon size={15} /> Contact us now
                    </a>
                    <span>or fill out the form below.</span>
                  </p>
                  <Field label="Name"  ph="First and last"       val={name}  set={setName}  err={err && !name} />
                  <Field label="Phone" type="tel"   ph="+1 (___) ___-____" val={phone} set={setPhone} err={err && !phone} />
                  <Field label="Email" type="email" ph="you@example.com"   val={email} set={setEmail} err={err && !email} />
                  <button onClick={submit} disabled={sending} className="w-full font-eyebrow font-light text-white hover:brightness-110 transition-all py-3 mt-1 disabled:opacity-60 disabled:cursor-default" style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', borderRadius: 0, border: 'none', cursor: sending ? 'default' : 'pointer', background: sendFailed ? '#9A4722' : ACCENT }}>
                    {sending ? 'Sending…' : sendFailed ? "Couldn't send — try again" : 'Send request'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
```

- [ ] **Step 3: Typecheck and lint**

Run: `npx tsc -b && npm run lint`
Expected: both clean.

**Steps 5 and 6 are browser checks that need a rendered page.** Nothing mounts this modal until Task 6, and no route reaches it until Task 7. Leave both unticked here; Task 7 Step 4 sends you back to run them. Do not skip them — Step 6 covers Review Focus item 5.

- [ ] **Step 5: Verify required-field validation** *(run at Task 7 Step 4)*

On any segment page, open the form, click **Send request** with all fields empty.
Expected: all three field borders flash the signal colour and nothing is submitted. Fill only Name and retry — Phone and Email flash.

- [ ] **Step 6: Verify a failed send does NOT show the success state** *(run at Task 7 Step 4)*

This is Review Focus item 5. In DevTools, set the Network panel to **Offline**, fill the form validly, and submit.
Expected: the button reads "Couldn't send — try again" and the form **stays on screen with the values intact**. The "Thank you!" panel must not appear. Go back online and submit again; expect the thank-you panel, and confirm the Resend email arrives with subject "Landing Page Request — Horizons Sandhills" and a `page` row naming the segment.

- [ ] **Step 7: Commit**

```bash
git add src/components/blocks/RequestFormModal.tsx api/send-inquiry.ts
git commit -m "Add the shared request form modal for the segment landing pages"
```

---

## Task 6: The four screens and the page template

**Files:**
- Create: `src/components/segments/SegmentHero.tsx`
- Create: `src/components/segments/AmenityCards.tsx`
- Create: `src/components/segments/SegmentCta.tsx`
- Create: `src/pages/SegmentLanding.tsx`
- Create: `src/lib/site.ts`

**Interfaces:**
- Consumes: `Segment`, `cardPhoto` (Task 2/3); `VideoStrip` (Task 4); `RequestFormModal`, `openRequestForm` (Task 5); `Button`, `Eyebrow`, `RevealOnScroll` primitives.
- Produces: `export default function SegmentLanding({ segment }: { segment: Segment })`. Task 7 routes to it.

- [ ] **Step 1: Screen 1 — the hero**

Create `src/components/segments/SegmentHero.tsx`. One viewport tall with a full-bleed photo and dark overlay — deliberately not the landing page's 260dvh scroll-driven treatment, which does not belong on a conversion page.

```tsx
import type { Segment } from '../data/segments';
import Button from '../primitives/Button';
import Eyebrow from '../primitives/Eyebrow';
import { openRequestForm } from '../blocks/RequestFormModal';

export default function SegmentHero({ hero }: { hero: Segment['hero'] }) {
  return (
    <section data-zone="dark" className="relative flex min-h-[88svh] items-end overflow-hidden">
      <img
        src={hero.photo}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(10,8,5,0.82), rgba(10,8,5,0.35) 55%, rgba(10,8,5,0.45))' }}
      />
      <div className="relative max-w-content mx-auto w-full px-6 pb-16 md:px-12 md:pb-24 lg:px-16">
        <Eyebrow className="text-linen/70">{hero.kicker}</Eyebrow>
        <h1
          className="mt-5 max-w-[18ch] font-display font-light text-linen text-[clamp(34px,6vw,76px)]"
          style={{ letterSpacing: '-0.025em', lineHeight: 1.04, fontVariationSettings: '"SOFT" 40, "opsz" 72' }}
        >
          {hero.headline}
        </h1>
        <p className="mt-5 max-w-text text-linen/80 text-[15px] md:text-lg">{hero.sub}</p>
        <Button onClick={openRequestForm} variant="primary" className="mt-9">{hero.cta}</Button>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Screen 2 — the amenity cards**

Create `src/components/segments/AmenityCards.tsx`. A 3×2 grid at desktop, 2-up at tablet, 1-up on phones.

```tsx
import type { Segment } from '../data/segments';
import { cardPhoto } from '../data/segments';
import RevealOnScroll from '../primitives/RevealOnScroll';

export default function AmenityCards({ amenities }: { amenities: Segment['amenities'] }) {
  return (
    <section data-zone="light" className="bg-boneWarm px-6 py-20 md:px-12 md:py-28 lg:px-16">
      <div className="max-w-content mx-auto">
        <RevealOnScroll className="mb-10 max-w-3xl md:mb-14">
          <h2 className="display-h2 text-ink text-[clamp(26px,3.6vw,44px)]">{amenities.heading}</h2>
        </RevealOnScroll>
        <RevealOnScroll variant="stagger-parent" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.cards.map((card) => (
            <RevealOnScroll variant="stagger-child" key={card.key}>
              <article className="h-full overflow-hidden rounded-2xl bg-bone">
                <img
                  src={cardPhoto(card.key)}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="px-6 py-6">
                  <p className="eyebrow text-signal">{card.title}</p>
                  <p className="mt-3 text-ink2 text-[15px]">{card.line}</p>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Screen 4 — the final CTA**

Create `src/components/segments/SegmentCta.tsx`:

```tsx
import type { Segment } from '../data/segments';
import Button from '../primitives/Button';
import RevealOnScroll from '../primitives/RevealOnScroll';
import { openRequestForm } from '../blocks/RequestFormModal';

export default function SegmentCta({ finalCta }: { finalCta: Segment['finalCta'] }) {
  return (
    <section data-zone="dark" className="bg-nightWarm px-6 py-24 md:px-12 md:py-32 lg:px-16">
      <div className="max-w-content mx-auto text-center">
        <RevealOnScroll>
          <h2
            className="mx-auto max-w-[24ch] font-display font-light text-linen text-[clamp(28px,4.4vw,56px)]"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.08, fontVariationSettings: '"SOFT" 40, "opsz" 60' }}
          >
            {finalCta.headline}
          </h2>
          <Button onClick={openRequestForm} variant="primary" className="mt-10">{finalCta.cta}</Button>
        </RevealOnScroll>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: The template**

Create `src/pages/SegmentLanding.tsx`. No `StickyHeader`, no `Footer` — per Global Constraints. The metadata effect follows `BlogIndex.tsx`'s restore-on-unmount pattern, which is what keeps titles from leaking between routes in an SPA.

```tsx
import { useEffect } from 'react';
import type { Segment } from '../components/data/segments';
import SegmentHero from '../components/segments/SegmentHero';
import AmenityCards from '../components/segments/AmenityCards';
import VideoStrip from '../components/segments/VideoStrip';
import SegmentCta from '../components/segments/SegmentCta';
import RequestFormModal from '../components/blocks/RequestFormModal';
import { SITE_ORIGIN } from '../lib/site';

export default function SegmentLanding({ segment }: { segment: Segment }) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = segment.seo.title;

    const descTag = document.querySelector('meta[name="description"]');
    const prevDesc = descTag?.getAttribute('content') ?? null;
    descTag?.setAttribute('content', segment.seo.description);

    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = `${SITE_ORIGIN}/${segment.slug}`;
    document.head.appendChild(canonical);

    window.scrollTo(0, 0);
    return () => {
      document.title = prevTitle;
      if (prevDesc !== null) descTag?.setAttribute('content', prevDesc);
      canonical.remove();
    };
  }, [segment]);

  return (
    <div className="min-h-screen bg-bone">
      <SegmentHero hero={segment.hero} />
      <AmenityCards amenities={segment.amenities} />
      <VideoStrip video={segment.video} />
      <SegmentCta finalCta={segment.finalCta} />
      <RequestFormModal leadLabel={segment.leadLabel} />
    </div>
  );
}
```

- [ ] **Step 5: Create the site constant this imports**

Create `src/lib/site.ts`:

```ts
/** The live origin. Canonical URLs and the sitemap must agree with it —
 *  a sitemap listing another domain's URLs is treated as cross-domain and ignored. */
export const SITE_ORIGIN = 'https://sandhills.gohorizons.com';
```

- [ ] **Step 6: Typecheck and lint**

Run: `npx tsc -b && npm run lint`
Expected: both clean. Nothing renders yet — Task 7 adds the routes.

- [ ] **Step 7: Commit**

```bash
git add src/components/segments src/pages/SegmentLanding.tsx src/lib/site.ts
git commit -m "Add the four segment screens and the landing page template"
```

---

## Task 7: Routes, sitemap, origin correction, docs

**Files:**
- Modify: `src/App.tsx`
- Modify: `public/sitemap.xml`
- Modify: `public/robots.txt`
- Modify: `src/components/StructuredData.tsx`
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: `segments` (Task 3), `SegmentLanding` (Task 6), `SITE_ORIGIN` (Task 6).
- Produces: 13 live routes.

- [ ] **Step 1: Generate the routes**

In `src/App.tsx`, add the imports and the generated routes inside `<Routes>`, after the existing entries:

```tsx
import { segments } from './components/data/segments';
import SegmentLanding from './pages/SegmentLanding';
```

```tsx
{segments.map((s) => (
  <Route key={s.slug} path={`/${s.slug}`} element={<SegmentLanding segment={s} />} />
))}
```

Generated explicitly from the registry, never as a `/:slug` catch-all — a catch-all would swallow every typo and unknown path on the site.

- [ ] **Step 2: Walk all 13 routes**

Run: `npm run dev`, then visit each of `/romantic`, `/family`, `/girls-weekend`, `/bachelorette`, `/birthday`, `/celebrations`, `/wellness-retreat`, `/corporate-retreat`, `/group`, `/solo`, `/remote-work`, `/road-trip`, `/pet-friendly`.
Expected on every page: a hero photo that loads, six amenity cards each with a photo, three video thumbnails, and two buttons that both open the form. No broken images, no console errors, and **no photo appearing twice on the same page**.

- [ ] **Step 3: Check 400px width**

In DevTools device toolbar at 400px wide, revisit three pages — `/family`, `/corporate-retreat`, `/pet-friendly`.
Expected: cards stack to one column, no horizontal scrollbar anywhere, the hero headline does not overflow, and both CTAs are tappable.

- [ ] **Step 4: Now run Task 5's deferred checks**

Return to Task 5 Steps 5 and 6 and run them against `/family`: empty-submit validation, then the offline submission that must not show "Thank you!". Tick those boxes there.

- [ ] **Step 5: Correct the stale origin**

`public/sitemap.xml` and `src/components/StructuredData.tsx` both hardcode `https://horizonssandhills.com`, which is not the live origin. Replace every occurrence with `https://sandhills.gohorizons.com` — in `StructuredData.tsx` import `SITE_ORIGIN` from `../lib/site` and build the URLs from it rather than retyping the literal.

Then add the 13 new entries to `sitemap.xml`, each as:

```xml
  <url>
    <loc>https://sandhills.gohorizons.com/family</loc>
    <lastmod>2026-10-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
```

Also update the `Sitemap:` line in `public/robots.txt` to the correct origin. With no internal links anywhere on these pages, the sitemap is Google's only discovery path to them.

- [ ] **Step 6: Verify titles do not leak between routes**

This is Review Focus item 4. Visit `/bachelorette`, confirm the browser tab reads "Bachelorette Weekend — Horizons Sandhills", then navigate to `/` via the address bar's back behaviour (in-app navigation, not a reload).
Expected: the tab returns to "Horizons Sandhills — A Hundred and Twenty-Six Acres of Quiet", the `meta[name="description"]` is back to the site default, and no stray `<link rel="canonical">` remains in `<head>` (check the Elements panel).

- [ ] **Step 7: Update the project documentation**

In `CLAUDE.md`:
- Add the 13 routes to the React Router list in the Stack section (currently claims five routes).
- Add a "Segment Landing Pages" section: the slug list, that `src/components/data/segments.ts` is the data layer, that pages render no header or footer by design, that every CTA opens `RequestFormModal` rather than `openBooking()`, and that `npm run check:segments` validates the data.
- Correct the origin: the file documents `https://horizonssandhills.com` as hardcoded in `StructuredData.tsx`; it is now `SITE_ORIGIN` in `src/lib/site.ts` set to `https://sandhills.gohorizons.com`.
- Fix the stale claim that the Footer booking CTA block was "removed site-wide" — `Footer.tsx:77-92` still renders it.

- [ ] **Step 8: Full verification**

Run: `npm run check:segments && npm run build && npm run lint`
Expected: the check passes with 13 segments, the build completes, lint is clean.

- [ ] **Step 9: Commit**

```bash
git add src/App.tsx public/sitemap.xml public/robots.txt src/components/StructuredData.tsx CLAUDE.md
git commit -m "Route the 13 segment landing pages and correct the site origin"
```
