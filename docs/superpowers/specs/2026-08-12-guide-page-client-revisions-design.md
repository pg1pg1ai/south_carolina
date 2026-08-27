# Guest Guide — Client Revisions (Round 2)

Design for the client's change list against the shipped `/guide` page. Supersedes
nothing in `2026-08-05-guest-guide-page-design.md`; it amends it.

Reference screenshots from the client's Lovable prototype are in `docs/lovable/`
(`section-1`, `-2a`, `-2b`, `-4`, `-6`). **Delete that directory once
implementation is complete** — it is review material, not a project asset.

---

## Section numbering

Removing Safety and Checkout renumbers the page to match Lovable exactly:

| New | Section | Was |
|-----|---------|-----|
| 01 | Start Here | 01 |
| 02 | Arrival | 02 |
| 03 | Cabin Access | 03 |
| 04 | Amenities | 04 |
| 05 | House Rules | 06 |
| 06 | Local Guide | 08 |
| 07 | Things To Do | 09 |
| 08 | Medical | 10 |
| 09 | Help | 11 |

This resolves the change list's "sections 06, 07, and 08" — the client was
reading Lovable numbering, where those are Local Guide, Things To Do, and
Medical. All three carry miles/minutes data; all three get the pill treatment.

---

## 1 · Hero

**Directions button.** `ghost-light` has five consumers on the landing page, so
the variant itself is untouched. Local override on the guide hero only: border
`linen/60` → solid `linen`, plus a `linen/15` fill and light backdrop blur so it
reads as a button against the photo rather than an outline.

**Request Late Checkout.** The hero's Checkout card gains a pill below its note,
matching the Support card's Call/Text pills, linking to
`smsHref(g.checkout.lateSms)`. With §07 gone this becomes the only late-checkout
affordance on the page.

**Emergency quick action.** Currently targets `#safety`, which ceases to exist.
Retarget to `#medical`, which retains the 911 button and the hospital list.

---

## 2 · §01 Start Here

Per `docs/lovable/section-1.png`.

**Accent bars.** New `guide/GuideCard.tsx` wraps the card shell and takes
`accent: 'green' | 'orange'`. The bar is 3px, **80% of card height, vertically
centred** on the left edge — not full-bleed. Colours run diagonally:

| Card | Accent |
|------|--------|
| Property Address | orange `signal` |
| Wi-Fi | green `longleaf` |
| Guest Support | green `longleaf` |
| Offline Access | orange `signal` |

**Wi-Fi card.** Keeps the existing stacked rows. A **horizontal rule** separates
Network from Password — partial width, fading out before the card edge, per the
screenshot. (An earlier vertical-divider proposal was rejected by the client.)

**Copy buttons.** `CopyButton` gains `accent?: 'orange'`: `signal/40` border,
`signal` icon, `signal/10` hover. Applied to the two Wi-Fi buttons only, so the
orange stays meaningful; "Copy Address" stays neutral.

---

## 3 · §02 Arrival

Full parity with `section-2a.png` / `section-2b.png`.

### Source asset decomposition

`map.pdf` (1440×810, one page) is not a flat screenshot. It decomposes into:

- **one embedded raster**, 2230×1026, an aerial with **no property labels on it**
- **83 text lines** with exact page coordinates
- **171 vector rects**, colour-keyed:
  `#FFFFFF` ×24 → stays · `#FF66C4` ×13 → amenities · `#059C59` ×4 → parking

The labels the client worried about are a separate layer, not baked into the
photo. So we **discard the label layer entirely and draw every pin ourselves**.
Pins cannot cover map text because there is no map text left to cover — this is
the root fix for "position the pin-point elements so they do not cover important
text", rather than dodging labels.

The raster occupies page rect `x:[0,1440] y:[66.6,728.85]`, giving the transform
for any page coordinate:

```
fx = x / 1440
fy = (y - 66.6) / 662.25
```

**Retouching.** Three Google artifacts survive in the raster and are painted out:
a red map pin, the "423 Woodmen Rd / Recently viewed" tooltip with its blue
marker, and a small green marker near the front desk. Google's native place
labels — "McLean Pond", "Mt Prong Creek", "Woodmen Rd" — are **kept**: they aid
orientation and sit clear of the buildings.

Output: the retouched aerial is written to
`public/images/guide/property-map.webp`, overwriting the illustrated schematic
that currently holds that filename. The schematic's `property-map.png` companion
is deleted; no code references it.

### Pin data

`guide.ts` gains `mapPins: MapPin[]`, where
`MapPin = { id, label, category, x, y }` with `x`/`y` as percentages of the
image box.

Categories match Lovable's chips: `stays · amenities · parking · service ·
nature`. The vector layer supplies only three of these directly, so the other two
are derived:

| Category | Source |
|----------|--------|
| `stays` | white rects — forest villas 1–6, guest houses 1–2 |
| `parking` | green rects — parking A–D |
| `amenities` | pink rects, minus those reassigned to `service` |
| `service` | pink rects that are back-of-house: laundry room, storage ×2, water shed ×2, pool shed, front desk, manager's house |
| `nature` | text-only labels with no rect: lake, dock, McLean Pond, Mt Prong Creek, main sign |

The `amenities` / `service` split is a judgement call made during curation, not
something the source encodes. Guest-facing leisure (sauna, gazebo, pool, beach
courts, apiary, stage pavilion) stays `amenities`; anything a guest would only
visit for a chore becomes `service`.

Generation is **script-assisted, then hand-curated**. Pairing each vector rect to
its nearest label gets roughly 70% of rows right; three classes of error need a
manual pass:

1. The 16 white RV-hookup slots are individually rect'd and must collapse to a
   single `RV hookups` pin.
2. Several forest-villa labels bind to the wrong rect (nearest-neighbour picks
   the adjacent villa).
3. Multi-line labels arrive as fragments (`people)`, `volleyball`, `sculpture`).

Geometry is exact; only naming and grouping need judgement. The curated array is
committed as data, so later tweaks are a data edit.

### Layout

- **Left column:** the 5 existing numbered steps (copy unchanged) → `OPEN IN MAPS`
  outlined pill with a pin icon → the two parking notes, each with an orange left
  accent bar.
- **Right column:** 2×2 grid of parking cards, each led by a **round letter badge**
  (A/B/C/D) in a tinted circle.
- **Full width below:** the property map panel.

### `PropertyMapPanel`

Three new components: `PropertyMapPanel.tsx`, `MapPin.tsx`, `JumpToSpot.tsx`.
`PropertyMap.tsx` is rewritten to compose them.

- Header: `PROPERTY MAP` label + five filter chips, each with a category colour
  dot. Chips toggle pin visibility.
- Viewport: aerial with category-coloured circular pins; hover reveals the label.
- Controls: `+` / `−` / fullscreen, top right. Scroll to zoom, drag to pan, with
  the `SCROLL TO ZOOM · DRAG TO PAN` hint bottom-left.
- `JUMP TO A SPOT`: a wrapped list of ~36 pills below the map; selecting one pans
  and zooms to that pin and flags it active.

Zoom/pan state lives in `PropertyMapPanel` as a single `{scale, tx, ty}` object;
pins are positioned in a transformed layer so they track the image without
per-pin math. Pin *hit targets* stay at least 44px regardless of scale.

Reduced motion: `useReducedMotion()` disables pan/zoom easing; jump-to-spot
becomes an instant transform.

### Known copy mismatch

The map shows six forest villas and two guest houses; guide copy describes one of
each. Flagged for the client — **not** resolved here, since it is a content
decision rather than a design one.

---

## 4 · §03 Cabin Access

`VideoEmbed.tsx` is deleted (§03 was its only consumer) and replaced by
`AccessSlideshow.tsx`: prev/next controls, dot indicators, arrow-key navigation,
one caption per slide, `no-print` as the video was.

Slides come from a new `g.access.slides[]` array, so swapping photos is a data
edit. `g.access.video` is removed.

Assets: `slide-1.PNG` … `slide-5.PNG` (2752×1536, ~42 MB total) → converted to
`slide-1.webp` … `slide-5.webp` at ~1600px, PNGs deleted. Note the uppercase
`.PNG` extension, which would break on Vercel's case-sensitive filesystem; the
conversion removes that hazard.

---

## 5 · §04 Amenities

Per `docs/lovable/section-4.png`.

- `sauna.png` (2752×1536, 8.8 MB) → `sauna.webp` at ~1600px; PNG deleted so it
  does not ship. `g.amenities.featured.photo` repoints.
- Icons on the **five small cards only**, top-left, thin stroke: `Umbrella` ·
  `Utensils` · `Flame` · `Armchair` · `PlugZap`.
- The Warmup / Capacity / Best time stats row gets **no** icons.

---

## 6 · §06 · 07 · 08 distance pills

Per `docs/lovable/section-6.png`. New `guide/DistanceChip.tsx`: a rounded-full
pill, green-tinted fill, green border, uppercase text reading
`12.6 MI · 17–20 MIN`. Text only — no icons inside.

Used in both `PlaceRow` and the featured "Horizons Pick" block, so Local Guide,
Things To Do, and Medical all render identically.

---

## 7 · Removals

**§05 Safety** and **§07 Checkout** are deleted outright. Consequences:

- `guide/CheckoutChecklist.tsx` deleted.
- `guide.ts` loses `safety` entirely and most of `checkout`; `lateSms` and
  `lateNote` survive for the hero button.
- `GuideSectionNav` drops both entries (leaving nine, matching Lovable).
- The FAQ answer "tap Request Late Checkout in the Checkout section" is rewritten
  to point at the hero card.
- All `GuideSection` `index` props renumber per the table above.

**Footer — global.** `Footer.tsx` loses the entire top CTA block: the "Ready when
you are" eyebrow, "Pick your dates — the pines will handle the rest.", the Book
Your Stay button, and its divider. The client named only the middle two, but the
eyebrow alone above nothing reads broken. This removes the footer booking CTA
from the landing page as well — confirmed as intended.

---

## Files

| File | Change |
|---|---|
| `guide/GuideCard.tsx` | new — card shell + centred 80% accent bar |
| `guide/DistanceChip.tsx` | new — green miles/minutes pill |
| `guide/AccessSlideshow.tsx` | new — replaces the video |
| `guide/PropertyMapPanel.tsx` | new — filters, zoom/pan, viewport |
| `guide/MapPin.tsx` | new — single categorised pin |
| `guide/JumpToSpot.tsx` | new — jump-to-spot pill list |
| `guide/PropertyMap.tsx` | rewritten to compose the above |
| `guide/CopyButton.tsx` | gains `accent?: 'orange'` |
| `guide/PlaceList.tsx` | uses `DistanceChip` |
| `guide/VideoEmbed.tsx` | deleted |
| `guide/CheckoutChecklist.tsx` | deleted |
| `blocks/Footer.tsx` | CTA block removed |
| `data/guide.ts` | `mapPins`, `access.slides`; drops `safety`, `access.video`, most of `checkout` |
| `pages/GuestGuide.tsx` | sections removed, renumbered, hero button |
| `public/images/guide/` | `property-map.webp` rebuilt; `sauna.webp`, `slide-*.webp` added; source PNGs deleted |
| `IMAGE_MAP.md` | updated for every image change |
| `docs/lovable/` | deleted on completion |

---

## Verification

- `npm run build` and `npm run lint` clean.
- Every nav anchor resolves to a section that exists.
- No `public/` PNG over ~500 KB ships.
- Pins land on their features at 1×, and stay on them through zoom and pan.
- Reduced-motion path renders the map static and usable.
- Print path: map and slideshow hidden, place lists still print.
