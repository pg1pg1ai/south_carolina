# Segment Landing Pages — Design

**Date:** 2026-10-10
**Status:** approved design, pending implementation plan
**Brief:** [`docs/segment-landing-pages/client-brief.md`](../../segment-landing-pages/client-brief.md) (verbatim client copy deck)

---

## 1. Purpose

Thirteen audience-targeted landing pages for Horizons Sandhills, each selling the
same property to one segment (couples, families, bachelorette parties, corporate
teams, and so on). They exist to convert paid traffic into contact details: every
button on every page opens one request form, and none of them touch the booking
engine.

**Success looks like:** an ad click lands on a segment-specific page, the visitor
reads four screens, and submits name/phone/email into an email that tells the
client which of the thirteen segments produced the lead.

---

## 2. Decisions

These were settled with the client before design. They are the constraints, not
suggestions.

| Decision | Choice | Consequence |
|---|---|---|
| Repo | Same repo, same Vite app | 13 new routes in `src/App.tsx`; no new project, no separate deploy |
| Host | `sandhills.gohorizons.com/<slug>` | Real paths on the existing domain — no duplicate-content risk |
| Traffic | Paid ads now, organic later | Built indexable from the start: per-page title/description, sitemap entries |
| Page chrome | **None** | No `StickyHeader`, no `Footer`. Four screens and the form, nothing else |
| Amenities | Photo cards, 3x2 grid | Matches `VillaCascade`'s `EXPERIENCE_CARDS` language |
| Slugs | Short form | `/family`, `/birthday`, `/romantic` — the convention the client specified |
| Nav | Unlinked | Not in the main nav, unlike `/blog` |

### Why no chrome matters later

With no header and no footer these are orphan pages: nothing on the site links to
them, so Google's only discovery path is `sitemap.xml`. The client chose this
deliberately (fewest escape routes off a conversion page). When the organic phase
starts, revisit: either link them in from the blog or the main site, or accept
that they rank only on direct submission.

---

## 3. Scope

**In scope:** 13 routes, one page template, four screen components, one shared
request-form modal, one data module, card-sized image derivatives, per-page SEO
metadata, sitemap entries, `IMAGE_MAP.md` updates.

**Out of scope:** new schema markup (the main site's Resort schema is enough, and
ad pages do not need their own); A/B testing machinery; a CMS or admin UI for the
copy; any change to the booking flow, Cloudbeds, or the farm-basket pop-up; the
seven missing segment hero photographs (placeholders ship, client supplies real
ones later).

---

## 4. Architecture

One template reading one data object per segment. The brief's format is rigid —
four screens, exactly six amenity cards, exactly three videos, no exceptions
across all thirteen — so there is no per-page logic worth hosting in per-page
components. A copy change is a one-line data edit; a fourteenth segment is a new
object.

Rejected: thirteen thin page components (13 near-empty files for flexibility we
do not need yet), and thirteen standalone components (the exact duplication
`CLAUDE.md` already warns about where farm-basket copy lives in two places).

If one segment later needs something genuinely bespoke, it graduates to its own
component at that point.

### Data model

```ts
// src/components/data/segments.ts
export type AmenityKey =
  | 'villa' | 'lake' | 'sauna' | 'firepit' | 'ebikes' | 'acres'
  | 'sports' | 'teamActivities' | 'trails' | 'forestTrails'
  | 'photoReady' | 'privateGrounds';

export interface AmenityCard {
  key: AmenityKey;   // resolves the photo via AMENITY_PHOTOS
  title: string;     // per-page wording: 'Private forest villa' vs '…villas'
  line: string;      // per-page one-liner
}

export interface Segment {
  slug: string;        // 'family'
  leadLabel: string;   // 'Family Getaway' — names the page in the lead email
  seo: { title: string; description: string };
  hero: {
    kicker: string;    // 'Family getaway at Horizons Sandhills'
    headline: string;
    sub: string;
    cta: string;
    photo: string;
  };
  amenities: {
    heading: string;
    cards: [AmenityCard, AmenityCard, AmenityCard,
            AmenityCard, AmenityCard, AmenityCard];   // exactly 6 — enforced
  };
  video: {
    heading: string;
    shorts: [string, string, string];                 // exactly 3 — enforced
  };
  finalCta: { headline: string; cta: string };
}

export const AMENITY_PHOTOS: Record<AmenityKey, string> = { /* … */ };
export const segments: Segment[] = [ /* 13 */ ];
```

Three details drawn from the brief that shape this model:

1. **`hero.cta` and `finalCta.cta` are separate fields.** Most pages repeat one
   label, but bachelorette runs "Plan the bachelorette" then "Plan the weekend",
   and pet-friendly runs "Plan your getaway" then "Plan your stay". One shared
   label would silently lose that.
2. **`title` is per-card, not per-key.** The same amenity is worded differently
   per page — "126 acres of nature" vs. "126 private acres" on wellness and
   corporate. Only the *photo* is shared across pages, via `AMENITY_PHOTOS`.
   The 13 pages fill 78 card slots from just these 12 keys.
3. **Shorts are stored as bare video IDs.** The brief's URLs carry `?si=`
   tracking params and mix `youtube.com/shorts/` with `www.youtube.com/shorts/`.
   Several IDs intentionally recur across segments.

### Metadata defaults

The brief supplies no page titles or meta descriptions. Default
`seo.title` to `<leadLabel> — Horizons Sandhills` and `seo.description` to
`hero.sub`. Both stay explicit fields in the data rather than being computed in
the template, so either can be hand-tuned per page for ads or search without
touching component code.

### Tuple types as the structural test

`cards` is a 6-tuple and `shorts` a 3-tuple deliberately. Transcribing thirteen
pages of copy by hand, the likeliest defect is a page with five amenities or four
videos — and `tsc -b` fails the build on it. This is the structural invariant
check; see Verification.

### Amenity photo registry

`AMENITY_PHOTOS` maps each key to its **source** photo. Code never references
these paths directly — it references the derivative at
`/images/segments/cards/<key>.webp` (see Assets). That indirection is also what
makes the one source filename containing spaces harmless.

| Key | Source photo |
|---|---|
| `villa` | `sandhills/Villa.webp` |
| `lake` | `sandhills/canoes.webp` |
| `sauna` | `sandhills/sauna.webp` |
| `firepit` | `sandhills/fire_pit.webp` |
| `ebikes` | `bikes.webp` |
| `acres` | `sandhills/land.webp` |
| `sports` | `experience/05-the-open-field.webp` |
| `teamActivities` | `experience/bring you a-game.webp` (rename to kebab-case when convenient) |
| `trails` | `sandhills/Forest_bathing_walk.webp` |
| `forestTrails` | `sandhills/twelve_miles.webp` |
| `photoReady` | `villa/hero/1.webp` |
| `privateGrounds` | `experience/05-the-open-field.webp` |

**Constraint: no photo may appear twice on the same page.** A hero that repeats
one of its own six cards reads as an error. This was checked across all 13 pages
and forced two hero reassignments (`/group`, `/pet-friendly`). Re-check it
whenever a hero or an amenity source changes — `sports` and `privateGrounds`
share a source and `acres` feeds both the pet-friendly card set and several
heroes, so the margin is thin.

### Files

```
src/pages/SegmentLanding.tsx               # the 4-screen template
src/components/segments/SegmentHero.tsx    # screen 1
src/components/segments/AmenityCards.tsx   # screen 2 — 3x2 photo grid
src/components/segments/VideoStrip.tsx     # screen 3 — 3 shorts
src/components/segments/SegmentCta.tsx     # screen 4
src/components/blocks/RequestFormModal.tsx # the shared form pop-up
src/components/data/segments.ts            # 13 Segment objects + AMENITY_PHOTOS
src/components/primitives/ShortThumb.tsx   # extracted from YouTubeShortsWidget
```

One data module, matching the repo convention (`sandhills.ts`, `guide.ts`,
`blog.ts` are each a single file).

### Reuse

- **`ShortThumb`** already exists inside `YouTubeShortsWidget.tsx` with exactly
  the right facade behaviour: a plain `<img>` thumbnail, with YouTube's embed
  loading only on click. Three eager iframes would wreck LCP on an ad page. Lift
  it into `primitives/ShortThumb.tsx` and import it from both the existing widget
  and the new `VideoStrip` — do not copy it.
- **`RevealOnScroll`** short-circuits on `useReducedMotion()` already, so using
  it for all section reveals satisfies the project's reduced-motion rule for free.
- **`Button`**, **`Eyebrow`**, **`sendInquiry`**, **`CONTACT_WHATSAPP_HREF`**,
  **`WhatsAppIcon`** all used as-is.
- **`Img`** is *not* needed — it exists to swap `.png`/`.jpg` for `.webp`, and
  every asset here is already `.webp`. Plain `<img>`.

### Routing

Explicit routes generated from the registry, in `src/App.tsx`:

```tsx
{segments.map((s) => (
  <Route key={s.slug} path={`/${s.slug}`} element={<SegmentLanding segment={s} />} />
))}
```

A `/:slug` catch-all would swallow every typo and unknown path on the site.
Generating from the registry keeps `segments.ts` the single source of truth while
leaving unmatched URLs to fall through as they do now. All 13 slugs were checked
against the existing routes (`/`, `/guide`, `/blog`, `/stays/:slug`,
`/preview/*`) — no collisions.

---

## 5. Segment inventory

Verbatim copy lives in the brief. This table is the structural map.

| # | Slug | Lead label | Hero photo | Amenity keys (in order) | Shorts |
|---|---|---|---|---|---|
| 1 | `/romantic` | Romantic Getaway | `villa/hero/2.webp` * | villa, lake, sauna, firepit, ebikes, acres | atYpnzyry9o, 56iFsaKc6tE, VWzVORxlizg |
| 2 | `/family` | Family Getaway | `b2b/family-reunions.webp` | villa, lake, sports, ebikes, firepit, acres | OkXZLmQq4lQ, ezPuRvMS4E4, LUbdzfgbH6Q |
| 3 | `/girls-weekend` | Girls' Weekend | `experience/pool-days.webp` * | villa, lake, sauna, firepit, ebikes, acres | nxsh-EK2n8Y, oYPDdrlIlas, 1QG9txDjufw |
| 4 | `/bachelorette` | Bachelorette Weekend | `b2b/bachelor-bachelorette.webp` | villa, lake, sauna, firepit, photoReady, acres | nxsh-EK2n8Y, oYPDdrlIlas, CBvF-nFf7PE |
| 5 | `/birthday` | Birthday Getaway | `b2b/birthday-weekends.webp` | villa, lake, sauna, firepit, ebikes, acres | QmYK8gLA3IU, IGZnO8Y21zU, TPL7NC1MhI0 |
| 6 | `/celebrations` | Celebration Getaway | `b2b/private-celebrations.webp` | villa, lake, sauna, firepit, ebikes, acres | QmYK8gLA3IU, IGZnO8Y21zU, CBvF-nFf7PE |
| 7 | `/wellness-retreat` | Wellness Retreat | `b2b/wellness-retreats.webp` | villa, lake, sauna, trails, firepit, acres | CBvF-nFf7PE, 7oEtvlNe5K4, BV1gqM_Aci8 |
| 8 | `/corporate-retreat` | Corporate Retreat | `b2b/corporate-retreats.webp` | villa, lake, teamActivities, firepit, trails, acres | CBvF-nFf7PE, d_X7zP-uHFc, IGZnO8Y21zU |
| 9 | `/group` | Group Getaway | `villa/hero/3.webp` * | villa, lake, sports, ebikes, firepit, acres | jd28Bxx-kCc, d_X7zP-uHFc, CWRL03sH5ok |
| 10 | `/solo` | Solo Getaway | `sandhills/Forest_bathing_walk.webp` * | villa, lake, sauna, ebikes, firepit, acres | 0RtcdzerN2o, z1XeqOJ-pas, OxlfvYWUMuM |
| 11 | `/remote-work` | Remote Work Getaway | `villa/03_Terrace/2.webp` * | villa, lake, sauna, ebikes, firepit, acres | 7oEtvlNe5K4, z1XeqOJ-pas, JFfvJg10dUQ |
| 12 | `/road-trip` | Road Trip Stay | `sandhills/twelve_miles.webp` * | villa, lake, sauna, ebikes, firepit, acres | 1QG9txDjufw, JFfvJg10dUQ, BV1gqM_Aci8 |
| 13 | `/pet-friendly` | Pet-Friendly Getaway | `sandhills/Forest_bathing_walk.webp` * | villa, acres, forestTrails, lake, firepit, privateGrounds | jXEQIPN2Xjk, AEN0eCcK4uU, 1QG9txDjufw |

`*` = placeholder from the general library; no segment-specific photograph exists.
See Assets.

---

## 6. Screen composition

So the template is unambiguous about which copy field becomes which element:

- **Screen 1:** `hero.kicker` as `Eyebrow`; `hero.headline` as the page's single
  `h1` in the display font; `hero.sub` as body text; `hero.cta` as
  `Button variant="primary"` firing `openRequestForm()`. Full-bleed hero photo
  with a dark overlay, one viewport tall — not the landing page's 260dvh
  scroll-driven treatment.
- **Screen 2:** `amenities.heading` as `h2`; the six cards as a 3x2 grid
  (stacking to 2-up then 1-up at narrow widths), each with photo, `title`, `line`.
- **Screen 3:** `video.heading` as `h2`; three 9:16 `ShortThumb`s.
- **Screen 4:** `finalCta.headline` as `h2`; `finalCta.cta` as a second
  `Button variant="primary"` firing the same `openRequestForm()`.

---

## 7. The request form

`RequestFormModal.tsx`, cloned structurally from `PrivateEventModal.tsx`: same
`createPortal` to `document.body`, same `AnimatePresence`, same `Field`
sub-component, same Escape-to-close and backdrop-click-to-close, same
`sendInquiry` call with its sending/failed states.

Differences from `PrivateEventModal`:

- **Fields:** Name, Phone, Email. All three required, matching how
  `PrivateEventModal` validates. *(Assumption — the brief lists three fields with
  no optionality. Requiring both phone and email does cost some leads; relaxable
  to email-or-phone on request.)*
- **Copy:** verbatim from the brief, including the WhatsApp line ("Contact us now
  … or fill out the form below") wired to the existing `CONTACT_WHATSAPP_HREF`
  and `WhatsAppIcon`, and the post-submit "Thank you!" state.
- **Accent:** brand `signal` `#B05329`. `PrivateEventModal` hardcodes a blue
  `#2E6AB5` for private hire; that does not belong here.
- **Opening:** `openRequestForm()` dispatching a window `CustomEvent`, the same
  pattern as `openPrivateEvent()`. The template renders the modal once per page
  and passes `leadLabel` as a prop, so no payload travels with the event.

### Lead routing

```ts
sendInquiry('landing-request', { page: segment.leadLabel, name, phone, email })
```

This requires **one line added to `FORM_LABELS` in `api/send-inquiry.ts`**:

```ts
'landing-request': 'Landing Page Request',
```

Without it the subject falls back to the generic "Website Inquiry". The `page`
field then renders as a row in the Resend email, so the client can see that a
lead came from Bachelorette rather than Corporate. That per-page attribution is
the whole reason for a distinct form type.

No other change to `api/send-inquiry.ts`; recipients and Resend config are
untouched.

---

## 8. Copy conventions

The brief is written in ALL CAPS throughout. That is the brief's own formatting,
not literal copy: **store everything in sentence case.** `Button`'s base class
already applies `uppercase`, so buttons still render as "PLAN YOUR GETAWAY", and
headlines then match every other page on the site (compare "126 acres. All of it
yours." in `VillaCascade`). Storing caps would double-uppercase the buttons and
produce headlines that match nothing else.

Two fixes applied while transcribing:

- Wellness screen 3 heading reads "WELNESS" in the brief — corrected to
  "Wellness".
- Romantic screen 2 reads "across 18-acres private lake" — corrected to
  "18-acre".

---

## 9. Assets

### Heroes

Six of thirteen are already covered by `public/images/b2b/`, using the kebab-case
variants. The `Title Case.webp` duplicates in that folder are not referenced —
spaces in asset paths are a liability.

The remaining seven use placeholders from the general library (marked `*` in the
inventory). **This is the one open dependency on the client.** Seven segment
heroes reusing generic property shots is the weakest part of the result: a
pet-friendly ad landing on a photo with no dog in it converts worse than one that
shows the promise. Each swap is a one-line data edit, so it does not block
implementation.

### Amenity cards — resize required

The full-size originals are far too heavy to use directly:

| Photo | Size |
|---|---|
| `sandhills/land.webp` | 1.4 MB |
| `sandhills/Villa.webp` | 956 KB |
| `sandhills/Forest_bathing_walk.webp` | 676 KB |
| `sandhills/fire_pit.webp` | 444 KB |

Six of those per page is a 3–4 MB screen 2 — unacceptable on paid traffic.
Generate card-sized derivatives into `public/images/segments/cards/<key>.webp` at
~800px wide, targeting under 100 KB each, using the resize procedure in
`IMAGE_MAP.md`. `sharp` and `vite-plugin-image-optimizer` are already installed
and `scripts/convert-to-webp.mjs` already runs on prebuild. Result: roughly
500 KB for screen 2, shared across all 13 pages and cached after the first visit.

`IMAGE_MAP.md` must be updated with the segment entries and the
`AmenityKey` → photo mapping, per the project rules.

### Hero derivatives

The `b2b/` heroes are lean (56–152 KB) but four of the seven placeholders are
not — `sandhills/land.webp` is 1.4 MB and `Forest_bathing_walk.webp` 676 KB.
A multi-megabyte hero on a paid-traffic page defeats the point of marking it
`fetchpriority="high"`. Generate hero derivatives into
`public/images/segments/heroes/<slug>.webp` at ~1600px wide, targeting under
200 KB, by the same procedure as the cards. Code references the derivative, never
the source.

### Loading

- Hero `<img>`: `fetchpriority="high"`, eager.
- Amenity cards: `loading="lazy"`.
- Shorts: thumbnails only until clicked, via `ShortThumb`.

**Known wrinkle:** `index.html` statically preloads the *main site's* hero
(`/images/sandhills/desktop.webp` and `mobile.webp`) on every route, so each
segment page spends a high-priority fetch on an image it never displays. Changing
it would affect the main site's LCP, so leave it and measure with Lighthouse
rather than pre-emptively touching it.

---

## 10. SEO

- Per-page `document.title` and meta description via the
  `useEffect`-with-restore-on-unmount pattern `BlogIndex.tsx` already uses.
  Required in an SPA, or titles leak between routes.
- 13 `sitemap.xml` entries. With no internal links anywhere, this is Google's
  only discovery path to these pages.
- `robots.txt` already allows everything; no change.
- No new structured data.

### Open: which origin is canonical

`sitemap.xml` and `StructuredData.tsx` hardcode `https://horizonssandhills.com`,
while the client describes the live host as `sandhills.gohorizons.com`.

Introduce a single `SITE_ORIGIN` constant and route the new canonicals through
it, so correcting the host later is one edit instead of a hunt. **Leave its value
at the current `horizonssandhills.com` and flag it** — do not guess which domain
is canonical. Needs a direct answer from the client.

---

## 11. Verification

There is no test framework installed in this repo, so this is not TDD. The
structural invariants are enforced by the type system instead: the 6-tuple and
3-tuple in `Segment` make `tsc -b` fail if any page has the wrong number of
amenity cards or videos.

1. `npm run build` — typecheck plus production build.
2. `npm run lint`.
3. Manual pass over all 13 routes at desktop width and 400px.
4. One real form submission, confirming the Resend email arrives labelled with
   the correct page.

Deliberately not adding `vitest` for this: the tuple types already cover the
shape, and a runner installed for one smoke test is scope creep. Worth
reconsidering as a separate decision if the site grows tests generally.

---

## 12. Follow-ups

- Client to supply segment photography for the seven placeholder heroes.
- Client to confirm the canonical origin (`horizonssandhills.com` vs.
  `sandhills.gohorizons.com`).
- Decide whether to relax the form to email-or-phone rather than both.
- Revisit internal linking when the organic phase begins — these are orphan pages
  by design.
- `CLAUDE.md` claims the Footer booking CTA block was "removed site-wide" on
  2026-08-12, but `Footer.tsx:77-92` still renders it. Stale note, correct it.
