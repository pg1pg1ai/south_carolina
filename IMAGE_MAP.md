# Image Map — reference for AI agents

**Purpose:** you (an AI agent) were asked to replace/update a photo somewhere on this
site. This file tells you exactly which disk path and which line of code to touch,
without you having to grep the whole codebase first.

**This file is never imported by any component.** It lives at the repo root next to
`CLAUDE.md`, outside `src/`, so it can never end up in the Vite build output or the
browser bundle. Keep it that way — do not move its content into a `.ts`/`.tsx` file
or import it from one.

**Keep this file up to date.** Every time you add, move, or repoint an image, update
the matching row below in the same commit. A stale map is worse than no map.

---

## How to replace an image — standard procedure

1. **Find the target** in the "Live page map" section below. Match by the visible
   text (title/badge/name) the user gave you, or by the block name. That gives you
   the disk path and the exact `file:line` (or field name) to edit.
2. **Check the incoming source file.** User-supplied photos are usually PNG, often
   huge (phone/camera exports — 8–40 MB, 3000–5500 px wide). Never reference a raw
   PNG/JPG in code directly.
   ```
   node -e "require('sharp')('/path/to/source.png').metadata().then(m=>console.log(m.width,m.height))"
   ```
3. **Resize + convert to webp** with `sharp`, sized for where it's actually displayed
   (a full-bleed hero photo doesn't need the same resolution as a 150px-tall card
   strip — oversizing just bloats the repo and slows the page):

   | Usage | Resize width | Quality |
   |---|---|---|
   | Full-bleed hero / main panel photo (fills most of viewport width) | 1600–1800px | 82 |
   | Grid card / thumbnail (roughly 300–500px wide on screen) | 900px | 80 |
   | Thin strip inside a small card (e.g. 16:9 strip under 150px tall) | 700–900px | 80 |

   ```
   node -e "require('sharp')('/path/to/source.png').resize({width:900,withoutEnlargement:true}).webp({quality:80}).toFile('public/images/<folder>/<name>.webp')"
   ```
4. **Naming convention:** kebab-case, descriptive, matching the card's title
   (`family-reunions.webp`). If the array has a fixed display order where position
   matters (e.g. `EXPERIENCE_CARDS`), prefix with the 1-based 2-digit index matching
   that position (`05-the-open-field.webp` = 5th card, "The Open Field").
5. **Keep the source PNG alongside the webp**, same folder, as a sibling — every
   existing image folder in this repo follows that convention (it's the fallback
   source if a re-convert is ever needed; the `prebuild` script
   `scripts/convert-to-webp.mjs` also auto-converts any png/jpg missing a webp
   sibling, as a safety net — don't rely on it for quality control, convert
   manually per step 3 instead).
6. **Update the code** — change the `image:` / `strip:` / `src:` field found in step 1
   to the new path (root-relative, starting with `/images/...`, since everything
   under `public/` is served from `/`).
7. **Verify:** `npx tsc -b` from `horizons-sandhills/` must exit clean. There is no
   test suite — this is the only automated check.
8. **Do not `git commit` or `git push` unless the user explicitly asks.** Making the
   edit and confirming `tsc -b` passes is enough; report back and wait.

---

## Live page map

This mirrors `src/pages/SandhillsLanding.tsx` top-to-bottom (the `/` route). If a
block isn't listed here, check the "Dead / not currently rendered" section before
assuming it's live — several components exist in `src/components/blocks/` that are
commented out and never reach the page.

### Header — logo
- **Component:** `src/components/blocks/StickyHeader.tsx`
- `/logo.svg` — desktop nav logo (`StickyHeader.tsx:115`), mobile menu logo (`StickyHeader.tsx:150`)
- Same file also used in `HeroImmersive.tsx:199` (traveling wordmark) and `Footer.tsx:96`

### Hero — full-bleed opening photo
- **Component:** `src/components/blocks/HeroImmersive.tsx`
- Desktop background: `/images/sandhills/desktop.webp` — `HeroImmersive.tsx:219,221`
- Mobile background: `/images/sandhills/mobile.webp` — `HeroImmersive.tsx:218`
- Press logos (4, exported as `PRESS`, reused by PressFeature below):
  | Publication | Path | Line |
  |---|---|---|
  | The New York Times | `/images/press/nyt.png` | `HeroImmersive.tsx:13` |
  | Southern Living | `/images/press/southern-living.png` | `HeroImmersive.tsx:19` |
  | Garden & Gun | `/images/press/garden-gun.png` | `HeroImmersive.tsx:25` |
  | National Geographic | `/images/press/nat-geo.png` | `HeroImmersive.tsx:31` |

### "Forest Villa" listing hero (top of VillaCascade, Act 1)
- **Component:** `src/components/blocks/VillaCascade.tsx`, constant `HERO_IMAGES` (lines 14–18)
- 5-photo slideshow, no individual titles — just the villa exterior at different times of day
- Paths: `/images/villa/hero/1.webp` … `5.webp`
- ⚠️ Same files are ALSO referenced from `src/components/data/sandhills.ts` at
  `stays[0].rooms[0]` (the "Exterior" room, used on the `/stays/:slug` page) —
  if you replace one of these, decide whether the other usage should match too.

### "Thoughtfully Stocked. Effortlessly Comfortable." (Comfort cards)
- **Component:** `src/components/blocks/VillaCascade.tsx`, constant `COMFORT_CARDS` (lines 21–52)
- Also shown enlarged in the comfort lightbox (same component, same array)
- Also part of the flat photo gallery pool (`GALLERY_PHOTOS`, see below)

| # | Card title | Path | Line |
|---|---|---|---|
| 1 | King Bed + Sofa Bed | `/images/comfort/king-bed.webp` | 23 |
| 2 | A Kitchen That's Actually Ready | `/images/comfort/kitchen.webp` | 28 |
| 3 | Everything-You-Need Bathroom | `/images/comfort/bathroom.webp` | 33 |
| 4 | Marshall Soundtrack | `/images/comfort/marshall.webp` | 38 |
| 5 | Deck, Grill & Firepit | `/images/comfort/deck-firepit.webp` | 43 |
| 6 | E-Bikes at Your Door | `/images/bikes.webp` (root `images/`, not `comfort/`) | 48 |

### "Life Outside the Villa" (Experience panel + mini-cards)
- **Component:** `src/components/blocks/VillaCascade.tsx`, constant `EXPERIENCE_CARDS` (lines 58–219)
- Used in: the big hero panel, the desktop scrolling mini-strip, and the mobile
  swipeable strip — all three read the same `image` field per card, so one edit
  updates all three places.
- File naming here follows the index-prefix convention (see step 4 above) — not
  every card has been renamed to match yet (see "not-yet-renamed" note).

| # | Card title (badge shown on-card) | Path | Line |
|---|---|---|---|
| 1 | The Sauna Ritual | `/images/experience/01-sauna.webp` | 60 |
| 2 | The Lake | `/qaYcANUQR-PNzw3QPCqKA_uEzp7Ijh.webp` (root, temp name — not yet renamed) | 80 |
| 3 | Trails & Rides | `/images/sandhills/twelve_miles.webp` | 100 |
| 4 | Ready for the Water | `/images/experience/04-ready-for-the-water.webp` | 120 |
| 5 | The Open Field | `/images/experience/05-the-open-field.webp` | 140 |
| 6 | Pool Days | `/images/experience/06-pool-days.webp` | 160 |
| 7 | Honey From the Land | `/images/experience/honey-from-the-land.webp` (not yet renamed) | 180 |
| 8 | By the Outdoor Fireplace | `/images/experience/08-by-the-outdoor-fireplace.webp` | 200 |

- ⚠️ Card 3's photo (`twelve_miles.webp`) is ALSO referenced twice in
  `sandhills.ts` (`activities[2]` and `activities[4]`) — but those `activities[]`
  cards are currently dead code (see below), so only this one matters for what's
  actually visible.

### "Your private event deserves more than a restaurant table." (B2B / Perfect For)
- **Component:** `src/components/blocks/VillaCascade.tsx`, constant `B2B_SCENARIOS` (lines 283–288)
- Each card: a 16:9 photo strip + title + one-line benefit below it

| Card title | Path | Line |
|---|---|---|
| Corporate Retreats | `/images/b2b/corporate-retreats.webp` | 283 |
| Family Reunions | `/images/b2b/family-reunions.webp` | 284 |
| Wellness Retreats | `/images/b2b/wellness-retreats.webp` | 285 |
| Birthday Weekends | `/images/b2b/birthday-weekends.webp` | 286 |
| Bachelor & Bachelorette | `/images/b2b/bachelor-bachelorette.webp` | 287 |
| Private Celebrations | `/images/b2b/private-celebrations.webp` | 288 |

### "Just Beyond the Trees" (nearby POI cards)
- **Data:** `src/components/data/sandhills.ts`, `nearby` array (lines 252–303)
- **Rendered by:** `src/components/blocks/VillaCascade.tsx` (reads `sandhillsData.nearby` directly — NOT via the standalone `NearbyGrid.tsx` component, which is dead code, see below)
- Also shown in the click-through detail popup (same array, same `image` field)

| Card name (title shown) | Path | Line |
|---|---|---|
| Cheraw State Park | `/images/nearby/Cheraw_State_Park.webp` | 256 |
| Scenic Sandhills | `/images/nearby/Carolina_Sandhills_National_Wildlife.webp` | 269 |
| Small Town Charm | `/images/nearby/Camden.webp` | 282 |
| Local Flavor | `/images/nearby/Local_Flavor.webp` | 295 |

### Gallery popup (flat photo grid)
- **Component:** `src/components/blocks/PhotoGalleryModal.tsx`
- **Fed by:** `GALLERY_PHOTOS` constant in `VillaCascade.tsx`, computed as
  `[...HERO_IMAGES, ...COMFORT_CARDS.map(c => c.image)]` — 11 photos, no files of
  its own. To change what appears here, edit `HERO_IMAGES` or `COMFORT_CARDS`
  above; this modal has no separate image list to maintain.

### Land history strip / press feature band
- **Component:** `src/components/blocks/PressFeature.tsx`
- Background photo: `/images/sandhills/land.webp` — `PressFeature.tsx:26`
- Press logos: imports the same `PRESS` array from `HeroImmersive.tsx` (not a
  separate copy) — edit `HeroImmersive.tsx` to change both places at once.
- ⚠️ `land.webp` is also used by: `sandhills.ts chapters[0].image`,
  `HeroImmersive.tsx:190`, and `StructuredData.tsx:51` (SEO JSON-LD, not visible
  but worth keeping consistent).

### Getting Here (drive-time / map section)
- **Component:** `src/components/blocks/GettingHere.tsx`
- No photos — this is a map/drive-time component only.

### Final CTA ("Waiting" full-bleed closing panel)
- **Component:** `src/components/blocks/FinalCtaImmersive.tsx`, fed by `sandhills.ts finalCta.image`
- Path: `/images/sandhills/final_image.png` (webp sibling also exists) — `sandhills.ts:316`

### Footer
- **Component:** `src/components/blocks/Footer.tsx`
- Logo only: `/logo.svg` — `Footer.tsx:96`

---

## Other live route: `/stays/:slug`

- **Page:** `src/pages/StayDetail.tsx`
- **Data:** `sandhills.ts`, `stays` array (2 entries)
- `stays[0]` = **Forest Villa** — `image` (line 59) + `gallery[0..4]` (61–65) +
  `rooms[0..4]` (68–72: Exterior, Interior, Terrace, Sauna, Grounds & Experiences).
  All files exist on disk. Several of these paths duplicate `HERO_IMAGES` and
  `EXPERIENCE_CARDS` above (same underlying villa photos, reused).
- `stays[1]` = **The House** — `image` (line 88, exists) but `gallery[1..4]`
  (90–94) and most of `rooms[]` (97–101) point at `gallery-01.webp` …
  `gallery-12.webp`, none of which exist on disk (see "Known broken references").
  If asked to fix The House's gallery, you need brand-new photos — there is
  nothing to just re-point.

## Other live route: `/guide` (Guest Guide)

- **Page:** `src/pages/GuestGuide.tsx` · **Data:** `src/components/data/guide.ts`
  (all guide image paths live in `guideData`, not in components)

| Use | Path | Where set |
|---|---|---|
| Hero background (lake, barrel sauna, dock at golden hour) | `/images/guide/hero-sandhills-lake.webp` (1700px, q82; png sibling alongside) | `guideData.hero.photo` |
| Arrival section aerial property map | `/images/guide/property-map.webp` (2230×1026, q82, 459 KB) | `MAP_SRC` in `src/components/guide/PropertyMapPanel.tsx` |
| Amenities featured card (sauna interior) | `/images/guide/sauna.webp` (1600×893, q85) | `guideData.amenities.featured.photo` |
| Cabin Access slideshow, 5 slides | `/images/guide/slide-1.webp` … `slide-5.webp` (1600×893, q85) | `guideData.access.slides[].src` |

- The property map is **generated**, not hand-drawn. Its source was `map.pdf`, a
  Google MyMaps export whose label layer sat separately from the satellite
  raster. `scripts/build-guide-assets.mjs` converts the extracted, retouched
  aerial; the extraction and retouch commands are recorded in
  `docs/superpowers/plans/2026-08-12-guide-page-client-revisions.md` Task 1.
  Every marker on it is drawn by us from `guideData.mapPins` — the image itself
  carries no property labels, only Google's own place names (McLean Pond,
  Mt Prong Creek, Woodmen Rd). **Replacing this image invalidates the pin
  coordinates**, which are percentages of its 2230×1026 box.
- The guide's sauna photo is now its **own** file. It was previously
  `/images/villa/04_Sauna/1.webp`, shared with the Forest Villa's Sauna room
  gallery; the two no longer move together.
- Slides are placeholders pending real cabin-access photos. Swapping them is a
  data edit in `guideData.access.slides` — captions live there too.
- `public/map.svg` is an earlier, now-**unreferenced** vector version of the same
  map (recolored to our tokens); safe to delete or keep as a source.

---

## Dead / not currently rendered

These components exist in the codebase and read real image data, but are commented
out in `src/pages/SandhillsLanding.tsx` (or never imported anywhere). If a user asks
you to change one of these, **say so before editing** — the change won't be visible
on the live site until someone re-enables the section.

| Component | Reads | Status |
|---|---|---|
| `DayScenes.tsx` | `sandhills.ts dayScenes[]` | commented out; images also missing on disk |
| `DiningEditorial.tsx` | `sandhills.ts dining` | commented out; image also missing on disk |
| `MapBlock.tsx` | `sandhills.ts directions[]` | commented out |
| `GalleryMasonry.tsx` | `sandhills.ts gallery[]` | commented out; images exist |
| `ProofSocial.tsx` | `sandhills.ts reviews`, `pressQuote` | commented out; has its own hardcoded `garden-gun.png` + `booking_logo.webp` |
| `NearbyGrid.tsx` | `sandhills.ts nearby[]` | commented out — but the SAME `nearby` data is independently rendered live by `VillaCascade.tsx` (see "Just Beyond the Trees" above); don't confuse the two |
| `FaqAccordion.tsx` | `sandhills.ts faq[]` | commented out; no images |
| `IncludedList.tsx` | `sandhills.ts included[].icon` | commented out; field unused even when it was live (component hardcodes inline SVGs instead) |
| `ActivitiesGrid.tsx` | `sandhills.ts activities[]` | commented out; images exist (some shared with live cards, see ⚠️ notes above) |
| `PressStrip.tsx` | own hardcoded array | orphaned — imported nowhere; duplicate of `HeroImmersive.tsx`'s `PRESS` |
| `InfluencerProof.tsx` | own hardcoded `POSTS` array | orphaned — imported nowhere; mostly duplicates `activities[]` photos, plus one unique unused file `Forest_bathing_walk.webp` |
| `src/components/data/sandhills-villa-acts.ts` | own `villaActs`/`villaCascadeCTA` | data file, imported nowhere |

---

## Known broken references (path in code, file missing on disk)

If you're asked to "fix the photo" for any of these, there is no existing file to
resize/convert — you need a new source photo from the user first.

- `sandhills.ts hero.env` → `/images/sandhills/1.png`
- `sandhills.ts hero.subject` → `/images/sandhills/2.png`
- `sandhills.ts stays[1].gallery[1..4]` and most of `stays[1].rooms[]` → `/images/sandhills/gallery-01.webp` through `gallery-12.webp` (The House — see above)
- `sandhills.ts dayScenes[0..2].image` → `day-morning.webp`, `day-afternoon.webp`, `day-evening.webp`
- `sandhills.ts dining.image` → `/images/sandhills/table.webp`
- `sandhills.ts sustainability.image` → `/images/sandhills/sustainability.webp`
- `sandhills.ts included[].icon` (×12) → entire `/images/Icons/` folder missing (moot — field unused, see Dead section)

All of the above are inside currently-dead sections except `stays[1]` (The House
detail page, which IS a live route).

---

## Orphaned files on disk (exist, referenced by nothing in `src/`)

Not urgent to clean up, but don't be surprised finding these — they're not "the
right file that's just misnamed," they're simply unused:
`qGBP68_WYGc6iPdsayAE4_EqosgDho.{jpg,webp}`, `tQujJzxhwVManasll_NAR_ggQ1SVvm.{jpg,webp}`,
`Sandhills logo.svg`, `Sandhills_.{png,webp}`, `postmark.{jpg,webp}`,
`public/images/press/conde-nast.*`, `public/images/nearby/Great_PeeDee_River.*`
(superseded by `Local_Flavor.webp` — same card, old photo).
