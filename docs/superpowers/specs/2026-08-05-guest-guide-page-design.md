# Guest Guide Page (/guide) — Design

**Date:** 2026-08-05
**Status:** Approved by user (conversation), pending spec review

## Summary

Add a guest-stay guide page at `/guide` to the Horizons Sandhills site. Content and
section structure come from the client's Lovable prototype
("Horizons Sandhills — Guest Guide") and the `Guide HSH.docx` content document
(authoritative for all facts: Wi-Fi, contacts, parking, local places). Visual design
follows this project's existing editorial design system (bone/ink/signal tokens,
Fraunces display, `.eyebrow` labels) — **not** the Lovable styling.

Sources reconciled:
- **Lovable page** → structure, section order, card layouts, interactive behaviors, microcopy.
- **Guide HSH.docx** → real content: Wi-Fi credentials, support contact, parking A–D,
  late-checkout fee, ~40 local places with addresses/distances/drive times.
- Where they conflict (phone number, Wi-Fi, placeholder names), **docx wins**.

## Decisions already made with user

1. **Local Guide / Things To Do scope: "Curated + expandable"** — one featured
   "Horizons Pick" per category (Lovable pattern), with a "Show all" expander
   revealing every docx entry for that category. Nothing from the docx is dropped.
2. **Interactivity: full set** — copy buttons, sticky section nav with scrollspy,
   checkout checklist with progress, category chips, FAQ accordion, print-to-PDF,
   YouTube access video, action buttons wired to `sms:`/`tel:` (Daniil).
3. **Chrome: reuse `StickyHeader`** via a new `variant="page"` prop (not a bespoke
   top bar). Landing behavior unchanged.
4. `Guide HSH.docx` must be **deleted from the repo before committing** implementation
   work (it is a working input, not a project asset).
5. `noindex` meta on /guide: offered, not requested — **out of scope** (can be added later).

## Architecture

### Routing
- `App.tsx`: add `<Route path="/guide" element={<GuestGuide />} />`.

### Files
| File | Change |
|---|---|
| `src/pages/GuestGuide.tsx` | New. Page orchestration: hero, section nav, sections, footer, `<BookingModal />`. |
| `src/components/data/guide.ts` | New. All guide copy/content as `guideData` (mirrors `sandhills.ts` pattern). |
| `src/components/guide/*.tsx` | New section components (see breakdown). |
| `src/App.tsx` | Add route. |
| `src/components/blocks/StickyHeader.tsx` | Add `variant` prop + `Guide` nav link. |
| `src/pages/SandhillsLanding.tsx` | On-mount effect: if `location.hash === '#gallery'`, dispatch `open-gallery`. |
| `src/index.css` | `@media print` rules (`.no-print`, page-break hygiene). |
| `IMAGE_MAP.md` | Document new usage locations of reused images. |

### StickyHeader `variant="page"`
- `variant?: 'landing' | 'page'`, default `'landing'`. Landing renders exactly as today.
- Page variant:
  - Nav links, small logo, Book button visible immediately (static values instead of
    scroll-driven motion values; no fade-in trigger).
  - Hero-only elements not rendered: large traveling logo, sun-glow circle,
    "View gallery" pill, top gradient scrim.
  - Nav links absolute: `/#stays`, `/#land`, `/#gallery` (plain navigation, no
    event dispatch), `/guide`, `/#reserve`. Logo links to `/`.
  - Book button: unchanged (`openBooking()`); works because GuestGuide mounts
    `<BookingModal />`.
  - `data-zone` color-flip mechanism unchanged; guide hero sets `data-zone="dark"`,
    content wrapper sets `data-zone="light"`.
- Nav order (both variants): Stays · The Land · Gallery · **Guide** · Reserve.
  On landing, existing hash/event links unchanged. Mobile menu inherits the new link.

### Gallery-from-guide flow
`/#gallery` → `SandhillsLanding` mounts → effect sees `#gallery` → dispatches
`open-gallery` (listener lives in `VillaCascade`, mounted before parent effect runs)
→ clears the hash via `history.replaceState`.

## Page structure (top → bottom)

All sections: numbered eyebrow header (`01 … 11` + section name), `display-h2`
heading in ink, sub-line in ink2, alternating `bg-bone` / `bg-boneWarm` bands,
`RevealOnScroll` entrances, `scroll-mt` for anchor offset under sticky chrome.

### Hero (`data-zone="dark"`)
- Full-bleed property photo: `/images/experience/01-sauna.webp` (1700×949, hero
  resolution; same subject as the Lovable hero — sauna at the lake), dark scrim.
  Path lives in `guide.ts` so it's easily swappable.
- Eyebrow "Your stay at", `h1` "Horizons Sandhills", sub: "Everything you need for
  your stay, gathered in one place."
- CTAs: **Start Here** (scroll `#start`), **Get Directions** (Google Maps link).
- Info cards: Check-in 2:00 PM ("Check-in instructions will be sent to you.") ·
  Checkout 12:00 PM ("Late checkout available on request.") · Guest Support —
  Daniil, +1 (347) 729-3265, available around the clock, Call / Text buttons.
- Quick actions row: Directions · Call · Text · Wi-Fi (→`#start`) · Map
  (→`#arrival` map) · Emergency (→`#safety`).

### Sticky section nav (below StickyHeader, `.no-print`)
Chips: Start Here · Arrival · Cabin · Amenities · Safety · Rules · Checkout ·
Local Guide · Things To Do · Medical · Help. Scrollspy (IntersectionObserver)
highlights active chip; horizontal scroll on mobile.

### 01 Start Here (`#start`)
- Address card: 423 Woodmen Rd, Patrick, SC 29584 · GPS 34.5663,-80.1024 · nearest
  town Patrick, SC · Get Directions · **Copy Address**.
- Wi-Fi card: Network **Horizons Sandhills Guest** · Password **@HorizonsSandhills**
  · copy button per field.
- Support card: Daniil · 24/7 · +1 (347) 729-3265 · Call / Text.
- Offline card: "Save this guide" — save as PDF before you travel; cell service is
  spotty near the property. **Download Guide** → `window.print()`.

### 02 Arrival (`#arrival`)
- 5 numbered steps (Lovable copy: GPS before leaving / watch for marked entrance /
  gate code from arrival message / continue to assigned parking / no driving on
  unmarked paths). "Open in Maps" link.
- **Property map**: schematic rebuilt in project design language (positioned
  divs/SVG, dune/pineDeep/signal tones): LAKE, CABIN A, CABIN B, GUEST HOUSE,
  SAUNA, FIREPIT, ENTRANCE, N compass, parking A–D markers.
- Parking legend (docx): A — Forest Villa parking, EV chargers · B — Forest Villa
  additional · C — Guest House · D — overflow along the designated side of the road.
  Notes: Level 2 chargers at Parking A, unplug when charged; keep vehicles in
  designated areas only (no lawns, pathways, blocking gates/fire routes).

### 03 Cabin Access (`#access`)
- 5 steps with `h3`s (Lovable copy: front gate / find your cabin / keypad or key /
  settle in / lock behind you).
- Video card: YouTube `byRKmNIeT2c` — click-to-load embed (thumbnail +
  play button; iframe injected on click). "Watch in 90 seconds — How to Access
  Your Cabin".
- "Trouble with the code?" note: wait 30 s, retry, then Call Guest Support.

### 04 Amenities (`#amenities`)
- Featured card: **Cedar Barrel Sauna** — photo from `/images/villa/04_Sauna/`,
  copy per Lovable, stats: Warmup 15 min · Capacity 15 · Best time dusk.
  ⚠ Capacity value transferred from Lovable; flagged for client verification.
- Small cards: Patio Umbrella (crank, deck) · Grill (propane, back patio) ·
  Firepit (wood-burning, clearing) · Outdoor Furniture (lounge chairs, dining set,
  hammocks) · EV Charger (Level 2, Parking A).

### 05 Safety (`#safety`)
- Emergency card: call 911 first, then notify Guest Support — `tel:911` +
  support tel.
- Cards: Fire safety (extinguisher near kitchen; never leave firepit unattended) ·
  Wildlife awareness (food indoors, doors closed at night; deer and wild turkey
  common) · Severe weather (tornado warning → interior ground-floor bathroom) ·
  Water and children (lake and dock unsupervised).
- Quick facts list: address/GPS in Start Here · first-aid kit under kitchen sink ·
  assembly point at front gate · power outage → breaker panel first · locked out →
  call Guest Support · nearest hospital in Medical.

### 06 House Rules (`#house-rules`)
9 numbered rules (Lovable copy, docx-consistent): Quiet Hours 10 PM–8 AM · Smoking
& Vaping not permitted · Visitors limited to booked occupancy · Pets — confirm with
Guest Support · Parties & Events — prior written approval · Parking — assigned area
only · Firepit — fully extinguish · Trash & Recycling — bag and drop at marked bins ·
Nature — do not disturb wildlife or vegetation.
(Lovable's dead "View Full Terms" link omitted.)

### 07 Checkout (`#checkout`)
- Checkout 12:00 PM. "No need to strip beds or clean."
- 7-item checklist (lights/sauna/appliances off · lock windows and doors · return
  keys · bag trash to bins · used towels in bathroom · check belongings · send
  departure message). Checkbox state + progress `n / 7`, persisted in
  `localStorage`.
- **Request Late Checkout** → `sms:` Daniil with prefilled body; card notes late
  checkout depends on availability, fee 10% of nightly rate (docx).
- **I've Checked Out** → `sms:` Daniil with prefilled confirmation.

### 08 Local Guide (`#food`)
Category chips → one featured "Horizons Pick" card + "Show all (n)" expander with
the remaining docx entries. Every entry: name, one-line description, address,
distance, drive time, **Directions** link to the destination address (not the
property — the Lovable reference had this wrong).

| Chip | Featured pick | Full list (docx) |
|---|---|---|
| Groceries | Piggly Wiggly (closest full-service) | Markette/Patrick General Store, Dollar General, Piggly Wiggly, Walmart Supercenter Cheraw |
| Farm Markets | McLeod Farms Roadside Market | Jacob's Fresh Market, Cheraw Farmers' Market, O'Neal Farms, McLeod Farms, Red River Bottom Dairy |
| Gas | The Markette (closest, 5.7 mi) | Markette, Teals Mill Mini Mart, Exxon Chesterfield, Shell Chesterfield |
| Coffee & Breakfast | Cheraw Coffee Co. | Cheraw Coffee Co., The Caffeinated Cow |
| Restaurants | Bistro on 2nd Street | Carolina Restaurant & Steak House, Bistro on 2nd Street, Monarcas, Fiesta Tapatia, Little China, Tokyo |
| Pizza & Fast Food | Hunt Brothers Pizza (in Patrick) | Hunt Brothers, Paisanos, Wendy's, Taco Bell, Burger King, McDonald's |

### 09 Things To Do (`#things-to-do`)
Same curated + expandable pattern.

| Category | Featured pick | Full list (docx) |
|---|---|---|
| Nature & Trails | Cheraw State Park | Sandhills Refuge Viewing Tower, Cheraw SP, Lawton Park, Kalmia Gardens |
| History & Museums | Dizzy Gillespie Homesite Park | McBee Library & RR Museum, McLeod Farms Antique Museum, H. Cooper Black Rec Area, Cheraw Lyceum, Dizzy Gillespie Park, Hartsville Museum, Coker Farms, Jacob Kelley House, John L. Hart Marker, West Broad St Historic District |
| Family & Entertainment | Neptune Island Waterpark | Hemi Speedway, Theatre on the Green, The Center Theater, The Play Zone, Pageland Dragway, Hartsville Skating Arena, Narrow Way Nature Center, The Ball Theatre, Neptune Island, Darlington Raceway |
| Golf | Cheraw State Park Golf | Green River Country Club, Cheraw SP Golf Clubhouse |
| Vineyards | Cash Winery and Vineyard | Cash Winery, Vineyard at The Old Place, Laurel Haven Estate |
| Hunting | Hunter Run Farm (3.6 mi) | Hunter Run Farm, Moree's Sportsman's Preserve |

Area blurbs from docx (McBee / Cheraw / Hartsville) may appear as short intro lines
inside the History expander.

### 10 Medical (`#medical`)
- Emergency banner: 911 first, then Guest Support.
- McLeod Health Cheraw — full-service hospital with ER, 711 Chesterfield Hwy,
  Cheraw · 15.1 mi · 25–35 min.
- Carolina Pines Regional Medical Center — 24-hr ER, 1304 W Bobo Newsom Hwy,
  Hartsville · 23.8 mi · 30–40 min.
- Note: there is no hospital directly in Patrick, SC.

### 11 Help (`#support`)
- FAQ accordion, 10 items (Lovable questions, answers corrected to real data:
  Wi-Fi name/password location, contacting Daniil, sauna, parking A–D, nearest
  grocery, late checkout incl. 10% fee, pets, power outage, lockout, maintenance).
- Support card: Call / Text +1 (347) 729-3265 · **Report an Issue** → `sms:`.

### Footer
Reuse existing site `Footer` component. Guide-specific farewell line from Lovable
("Rest well. Explore slowly. Enjoy the Sandhills.") may close section 11 instead.

## Component breakdown (`src/components/guide/`)

- `GuideHero.tsx` — hero + info cards + quick actions.
- `GuideSectionNav.tsx` — sticky chips + scrollspy.
- `GuideSection.tsx` — shared section shell (numbered eyebrow, heading, sub, band bg).
- `PlaceList.tsx` — chips/featured/expander pattern (used by Local Guide and Things
  To Do; Medical can reuse the entry card).
- `PropertyMap.tsx` — schematic map + parking legend.
- `CheckoutChecklist.tsx` — checklist with progress + localStorage.
- Smaller pieces (copy button, steps list, FAQ accordion items, video embed) live in
  the page or shared shells — split further only if a file grows unwieldy.

## Data shape (`guide.ts`, indicative)

```ts
export const guideData = {
  meta: { title, phone: '+13477293265', phoneDisplay: '+1 (347) 729-3265',
          manager: 'Daniil', address, gps, mapsUrl },
  hero: { photo, eyebrow, title, sub, cards: {...}, quickActions: [...] },
  wifi: { network: 'Horizons Sandhills Guest', password: '@HorizonsSandhills' },
  arrival: { steps: [...], parking: [...], notes: [...] },
  access: { steps: [...], video: { id: 'byRKmNIeT2c', ... }, trouble: {...} },
  amenities: { featured: {...}, cards: [...] },
  safety: { emergency: {...}, cards: [...], facts: [...] },
  rules: [...9],
  checkout: { time, items: [...7], lateFeeNote },
  localGuide: { categories: [{ id, label, featured, places: [...] }] },
  thingsToDo: { categories: [...] },
  medical: { hospitals: [...], note },
  faq: [...10],
};
```

## Cross-cutting concerns

- **Reduced motion:** all new animation goes through `RevealOnScroll` or checks
  `useReducedMotion()`; static fallbacks everywhere (existing project constraint).
- **Print:** `.no-print` on StickyHeader wrapper (page variant usage), section nav,
  quick actions, video, copy buttons, checklist actions; `@media print` also flattens
  expanders (show all entries) so the PDF is complete. Basic page-break hygiene.
- **Copy buttons:** `navigator.clipboard.writeText` + transient "Copied" state;
  no-op fallback if clipboard API unavailable.
- **Scrollspy:** IntersectionObserver, no scroll-event polling.
- **Document title:** set "Guest Guide — Horizons Sandhills" on mount, restore
  default on unmount.
- **Scroll to top** on route mount (StayDetail precedent).
- **Mobile:** no fixed bottom booking bar on /guide (that bar is landing-only);
  section-nav chips scroll horizontally; cards stack single-column.
- **Z-index:** page content below 200 (StickyHeader); section nav sits under header
  (like Lovable's `top-14/16` pattern); modals portal to body as elsewhere.

## Error handling

- Clipboard failure → silently fall back to selecting text / no crash.
- YouTube unavailable → thumbnail card remains a plain link to the video URL.
- `localStorage` unavailable (private mode) → checklist works in-memory.

## Testing / verification

Project has no test suite; verification is manual + build:
1. `npm run build` and `npm run lint` pass.
2. `/guide` renders all 11 sections with real content; anchors from section nav land
   correctly under sticky chrome.
3. Nav: Guide link appears between Gallery and Reserve on landing (desktop + mobile
   menu); from /guide, Stays/Land/Reserve navigate to landing anchors; Gallery from
   /guide opens the landing gallery modal; Book on /guide opens BookingModal.
4. Landing behavior unchanged (header scroll choreography, gallery event, zones).
5. Checklist persists across reload; copy buttons copy; print preview hides chrome
   and shows expanded lists; video loads on click.
6. `Guide HSH.docx` removed from repo before commit.

## Out of scope

- `noindex` meta for /guide (not requested).
- Printed in-cabin info card, QR codes, guest messaging sequences (docx notes for
  the client's ops, not this page).
- Cloudbeds integration changes, StructuredData schema for the guide page.
- Urgent care / pharmacy entries (not present in docx; can be added when client
  supplies them).
