# Guest Guide Page (/guide) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the guest-stay guide page at `/guide` per the approved spec (`docs/superpowers/specs/2026-08-05-guest-guide-page-design.md`), reusing `StickyHeader` via a new `page` variant and the project's editorial design system.

**Architecture:** New route `/guide` → `src/pages/GuestGuide.tsx`; all copy in `src/components/data/guide.ts`; section components in `src/components/guide/`. Shared chrome (`StickyHeader`, `Footer`) gets minimal prop/href changes that leave landing behavior untouched.

**Tech Stack:** React 19 + TypeScript, Vite 8, Tailwind 3.4 (tokens in `tailwind.config.ts`), Framer Motion 12 (via existing `RevealOnScroll`), React Router 7, Lucide icons.

## Global Constraints

- **No test suite exists in this project.** Verification is `npm run build` (runs `tsc -b` first) + `npm run lint` + manual browser checks against the spec's checklist. Do not add a test framework.
- Every animated element must have a `prefers-reduced-motion` fallback — use `RevealOnScroll` (already handles it) or `useReducedMotion()`.
- All copy/image paths live in `src/components/data/guide.ts`, not in components (project convention, mirrors `sandhills.ts`).
- Design tokens only (from `tailwind.config.ts`): `bone #F2EDE3`, `boneWarm #EAE3D3`, `surface`, `dune`, `linen`, `divider`, `ink #1F2420`, `ink2`, `night`, `pineDeep`, `longleaf`, `signal #B05329`, `signal2`, `ember`, `wiregrass`, `honey`. Classes `.eyebrow`, `.eyebrow-lg`, `.display-h2`, `.numeral` exist in `index.css`.
- Facts come from the docx (authoritative): Wi-Fi **Horizons Sandhills Guest** / **@HorizonsSandhills**; support **Daniil +1 (347) 729-3265**; late checkout fee **10% of nightly rate**; address **423 Woodmen Rd, Patrick, SC 29584**; GPS **34.5663,-80.1024**.
- Directions links point to **each destination's address**, never to the property (the Lovable reference had this bug).
- `git add` explicit paths only — the working tree has an unrelated modified `package-lock.json` and the input file `Guide HSH.docx` (untracked); neither may be committed. `Guide HSH.docx` is deleted from disk in the final task (user request).
- Landing page (`/`) behavior must remain pixel-identical except: new "Guide" nav item, footer hrefs becoming absolute (`/#stays` etc. — same-page hash behavior is unchanged), and the new `#gallery` hash handling on mount.
- Commit messages end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Guide data layer (`guide.ts`)

**Files:**
- Create: `src/components/data/guide.ts`

**Interfaces:**
- Consumes: nothing.
- Produces (used by every later task):
  - `guideData` const object (shape below), `GuidePlace`, `GuideCategory` types
  - `mapsDir(destination: string): string` — Google Maps directions URL
  - `telHref: string` (`tel:+13477293265`), `smsHref(body?: string): string`

- [ ] **Step 1: Write the data file**

Create `src/components/data/guide.ts` with exactly this content:

```ts
// Guest Guide (/guide) content. Facts sourced from the client's guide document;
// structure mirrors sandhills.ts. Phone/Wi-Fi/places are real — edit here, not in components.

export const GUIDE_PHONE = '+13477293265';
export const GUIDE_PHONE_DISPLAY = '+1 (347) 729-3265';

export const telHref = `tel:${GUIDE_PHONE}`;
export const smsHref = (body?: string) =>
  body ? `sms:${GUIDE_PHONE}?&body=${encodeURIComponent(body)}` : `sms:${GUIDE_PHONE}`;
export const mapsDir = (destination: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;

export interface GuidePlace {
  name: string;
  blurb: string;
  address: string;
  distance: string;
  drive: string;
}

export interface GuideCategory {
  id: string;
  label: string;
  featured: number; // index into places[] of the "Horizons Pick"
  places: GuidePlace[];
}

export const guideData = {
  meta: {
    title: 'Guest Guide — Horizons Sandhills',
    manager: 'Daniil',
    address: '423 Woodmen Rd, Patrick, SC 29584',
    gps: '34.5663,-80.1024',
    nearestTown: 'Patrick, SC',
  },

  hero: {
    photo: '/images/experience/01-sauna.webp',
    eyebrow: 'Your stay at',
    title: 'Horizons Sandhills',
    sub: 'Everything you need for your stay, gathered in one place.',
    cards: {
      checkIn: { label: 'Check-in', value: '2:00 PM', note: 'Check-in instructions will be sent to you.' },
      checkOut: { label: 'Checkout', value: '12:00 PM', note: 'Late checkout available on request.' },
      support: { label: 'Guest Support', note: 'We are available around the clock.' },
    },
  },

  wifi: { network: 'Horizons Sandhills Guest', password: '@HorizonsSandhills' },

  offline: {
    title: 'Save this guide',
    note: 'Save this page as a PDF before you travel. Cell service is spotty near the property.',
  },

  arrival: {
    steps: [
      'Follow your GPS to the property address. Set navigation before you leave — cell service gets weaker as you approach.',
      'Watch for the marked entrance on the right. The sign is subtle, so slow down after the last farmhouse.',
      'Approach the gate slowly. Use the code sent in your arrival message.',
      'Continue past the gate to your assigned parking lot.',
      'Please avoid driving on unmarked paths. They are for walking only.',
    ],
    parking: [
      { id: 'A', title: 'Forest Villa Parking', note: 'Reserved for Forest Villa guests and vehicles using the EV charging stations.' },
      { id: 'B', title: 'Forest Villa Parking', note: 'Additional parking for Forest Villa guests.' },
      { id: 'C', title: 'Guest House Parking', note: 'Reserved for guests staying in the Guest House.' },
      { id: 'D', title: 'Additional Parking', note: 'Overflow parking located along the designated side of the road.' },
    ],
    parkingNotes: [
      'Level 2 chargers are at Parking A. Please unplug once your vehicle is charged so others can charge.',
      'Please keep vehicles within designated parking spaces — no lawns, pathways, or activity areas, and never block roads, gates, driveways, or fire-access routes.',
    ],
  },

  access: {
    steps: [
      { title: 'Enter through the front gate', body: 'Follow Woodmen Rd to the property entrance. Signage marks the turn in.' },
      { title: 'Find your assigned cabin', body: 'Each cabin is clearly numbered, with parking nearby.' },
      { title: 'Use your keypad or key', body: 'The 4-digit code or key location was sent in your arrival message.' },
      { title: 'Enter, breathe, settle in', body: 'Take a moment on the porch. Let the trip melt off your shoulders.' },
      { title: 'Lock behind you', body: 'When leaving, close all doors and lock up.' },
    ],
    video: { id: 'byRKmNIeT2c', title: 'How to Access Your Cabin', duration: '1:24', kicker: 'Watch in 90 seconds' },
    trouble: {
      title: 'Trouble with the code?',
      body: 'Do not force the lock. Wait thirty seconds and try again. Still stuck? Call Guest Support and we will help right away.',
    },
  },

  amenities: {
    featured: {
      name: 'Cedar Barrel Sauna',
      photo: '/images/villa/04_Sauna/1.webp',
      kicker: 'Featured amenity',
      body: 'Wood fired and tucked between the pines. Give it fifteen minutes to warm up, then let the forest do the rest.',
      // NOTE: capacity value carried over from the client's prototype — flagged for client verification.
      stats: [
        { label: 'Warmup', value: '15 min' },
        { label: 'Capacity', value: '15 people' },
        { label: 'Best time', value: 'Dusk' },
      ],
    },
    cards: [
      { name: 'Patio Umbrella', note: 'Crank umbrella on the deck for shade.' },
      { name: 'Grill', note: 'Propane grill on the back patio.' },
      { name: 'Firepit', note: 'Wood-burning firepit in the clearing.' },
      { name: 'Outdoor Furniture', note: 'Lounge chairs, dining set, and hammocks.' },
      { name: 'EV Charger', note: 'Level 2 charger at Parking A.' },
    ],
  },

  safety: {
    emergency: {
      title: 'Emergency',
      body: 'For a life-threatening emergency, call 911 first. Then notify Guest Support.',
    },
    cards: [
      { title: 'Fire safety', body: 'Locate the extinguisher near the kitchen. Never leave the firepit unattended.' },
      { title: 'Wildlife awareness', body: 'Keep food indoors and doors closed at night. Deer and wild turkey are common.' },
      { title: 'Severe weather', body: 'In a tornado warning, move to the interior bathroom on the ground floor.' },
      { title: 'Water and children', body: 'The lake and dock are unsupervised. Please watch children closely.' },
    ],
    facts: [
      'Property address and GPS are in Start Here',
      'First aid kit is under the kitchen sink',
      'Emergency assembly point is at the front gate',
      'For a power outage, check the breaker panel first',
      'If you are locked out, call Guest Support',
      'Nearest hospital is in the Medical section',
    ],
  },

  rules: [
    { title: 'Quiet Hours', note: '10 PM to 8 AM. We share the woods with neighbors and wildlife.' },
    { title: 'Smoking & Vaping', note: 'Not permitted anywhere on the property.' },
    { title: 'Visitors', note: 'Overnight guests are limited to booked occupancy.' },
    { title: 'Pets', note: 'Please confirm the pet policy with Guest Support before arriving.' },
    { title: 'Parties & Events', note: 'Not permitted without prior written approval.' },
    { title: 'Parking', note: 'Use your assigned parking area only.' },
    { title: 'Firepit', note: 'Fully extinguish before leaving it unattended.' },
    { title: 'Trash & Recycling', note: 'Bag trash and drop it at the marked bins near the drive.' },
    { title: 'Nature', note: 'Please do not disturb wildlife or vegetation.' },
  ],

  checkout: {
    time: '12:00 PM',
    sub: 'A short list. No need to strip beds or clean. Just the essentials before you head home.',
    lateNote: 'Late checkout is available on request, depending on availability. An extra fee of 10% of the nightly rate applies.',
    items: [
      'Turn off the lights, sauna, and appliances',
      'Close and lock all windows and doors',
      'Return keys, if applicable',
      'Bag trash and drop it in the marked bins',
      'Leave used towels in the bathroom',
      'Check for personal belongings',
      'Send a message confirming departure',
    ],
    lateSms: 'Hi Daniil, we would like to request a late checkout for our stay at Horizons Sandhills. Is that possible?',
    doneSms: 'Hi Daniil, we have checked out of Horizons Sandhills. Thank you for a wonderful stay!',
  },

  localGuide: [
    {
      id: 'groceries', label: 'Groceries', featured: 2,
      places: [
        { name: 'The Markette / Patrick General Store', blurb: 'Convenience store with snacks, drinks, basic groceries, everyday essentials, and fuel.', address: '13 Main St, Patrick, SC 29584', distance: '5.7 mi', drive: '8–10 min' },
        { name: 'Dollar General', blurb: 'Budget-friendly staples: pantry goods, frozen foods, household products, and toiletries.', address: '177 Main St, Patrick, SC 29584', distance: '5.8 mi', drive: '8–10 min' },
        { name: 'Piggly Wiggly', blurb: 'Closest full-service grocery: fresh produce, meat, dairy, frozen foods, and pantry staples.', address: '1303 W Main St, Chesterfield, SC 29709', distance: '12.6 mi', drive: '17–20 min' },
        { name: 'Walmart Supercenter – Cheraw', blurb: 'Large grocery and general merchandise store with the widest nearby selection.', address: '1040 Chesterfield Hwy, Cheraw, SC 29520', distance: '14.8 mi', drive: '22–27 min' },
      ],
    },
    {
      id: 'farm-markets', label: 'Farm Markets', featured: 3,
      places: [
        { name: "Jacob's Fresh Market", blurb: 'Local grocery and produce market with fresh fruits, vegetables, and seasonal products.', address: '1027 Chesterfield Hwy, Cheraw, SC 29520', distance: '14.8 mi', drive: '20–25 min' },
        { name: "Cheraw Farmers' Market", blurb: 'Seasonal market with locally grown fruits, vegetables, and regional products.', address: '201 Market St, Cheraw, SC 29520', distance: '16.5 mi', drive: '23–25 min' },
        { name: "O'Neal Farms & Produce", blurb: 'Fourth-generation family farm: seasonal produce, grass-fed Black Angus beef, and sweet treats. Certified South Carolina Grown.', address: '1664 Whites Cir, Society Hill, SC 29593', distance: '18.3 mi', drive: '25–30 min' },
        { name: 'McLeod Farms Roadside Market', blurb: 'Popular regional farm market known for peaches, baked goods, preserves, and locally made products.', address: '29247 SC-151, McBee, SC 29101', distance: '19.4 mi', drive: '25–30 min' },
        { name: 'Red River Bottom Dairy', blurb: 'Family-owned dairy and farm market: milk, butter, cheese curds, ice cream, beef, and pork.', address: '11377 SC-151, Jefferson, SC 29718', distance: '24 mi', drive: '30 min' },
      ],
    },
    {
      id: 'gas', label: 'Gas', featured: 0,
      places: [
        { name: 'The Markette / Patrick General Store', blurb: 'Closest fuel, plus snacks, drinks, and everyday essentials.', address: '13 Main St, Patrick, SC 29584', distance: '5.7 mi', drive: '8–10 min' },
        { name: 'Teals Mill Mini Mart', blurb: 'Local gas station and convenience store with regular fuel, snacks, and an air pump.', address: '5580 Teals Mill Rd, Cheraw, SC 29520', distance: '8.7 mi', drive: '10–12 min' },
        { name: 'Exxon', blurb: 'Gas station and convenience store with gasoline, diesel, snacks, and travel essentials.', address: '107 S Page St, Chesterfield, SC 29709', distance: '11 mi', drive: '13–15 min' },
        { name: 'Shell', blurb: '24-hour station with regular, midgrade, premium, and ethanol-free gasoline.', address: '1006 West Blvd, Chesterfield, SC 29709', distance: '12 mi', drive: '15–17 min' },
      ],
    },
    {
      id: 'coffee', label: 'Coffee & Breakfast', featured: 0,
      places: [
        { name: 'Cheraw Coffee Co.', blurb: 'Local drive-thru coffee shop: specialty coffee, teas, refreshers, pastries, and light breakfast.', address: '1210 Chesterfield Hwy, Cheraw, SC 29520', distance: '14.6 mi', drive: '20–23 min' },
        { name: 'The Caffeinated Cow', blurb: 'Local café with espresso drinks, cold brew, milkshakes, and ice cream.', address: '158 2nd St, Cheraw, SC 29520', distance: '16.3 mi', drive: '20–25 min' },
      ],
    },
    {
      id: 'restaurants', label: 'Restaurants', featured: 1,
      places: [
        { name: 'Carolina Restaurant & Steak House', blurb: 'Family-style restaurant serving steaks, comfort food, and classic American dishes.', address: '13882 SC-9, Chesterfield, SC 29709', distance: '13.5 mi', drive: '18–25 min' },
        { name: 'Bistro on 2nd Street', blurb: 'Steaks, seafood, sandwiches, small plates, cocktails, and Southern-inspired dishes.', address: '168 2nd St, Cheraw, SC 29520', distance: '16.3 mi', drive: '20–25 min' },
        { name: 'Monarcas Mexican Restaurant Bar & Grill', blurb: 'Tacos, fajitas, enchiladas, burritos, combination plates, margaritas, and beer.', address: '973 Chesterfield Hwy, Cheraw, SC 29520', distance: '15 mi', drive: '20–25 min' },
        { name: 'Fiesta Tapatia', blurb: 'Casual Mexican restaurant with traditional dishes, fajitas, and combination plates.', address: '807 Market St, Cheraw, SC 29520', distance: '15.4 mi', drive: '22–27 min' },
        { name: 'Little China Restaurant', blurb: 'Casual Chinese takeout: fried rice, noodles, chicken, beef, and seafood.', address: '1307 West Blvd A, Chesterfield, SC 29709', distance: '12.5 mi', drive: '17–23 min' },
        { name: 'Tokyo', blurb: 'Japanese restaurant serving soups, hibachi dishes, sushi, and combination meals.', address: '1640 State Rd #5106, Cheraw, SC 29520', distance: '15 mi', drive: '20–25 min' },
      ],
    },
    {
      id: 'pizza-fast-food', label: 'Pizza & Fast Food', featured: 0,
      places: [
        { name: 'Hunt Brothers Pizza', blurb: 'Pizza right in Patrick — specialty combinations and hot slices for a quick meal or takeout.', address: '13 S Main, Patrick, SC 29584', distance: '5.7 mi', drive: '7–10 min' },
        { name: 'Paisanos Pizza', blurb: 'Family-friendly spot: New York–style pizza, pasta, calzones, stromboli, subs, and Italian entrées.', address: '416 West Blvd, Chesterfield, SC 29709', distance: '11.3 mi', drive: '13–17 min' },
        { name: "Wendy's", blurb: 'Burgers, chicken sandwiches, fries, salads, and Frosty desserts.', address: '101 West Blvd, Chesterfield, SC 29709', distance: '11.1 mi', drive: '14–17 min' },
        { name: 'Taco Bell', blurb: 'Tacos, burritos, quesadillas, nachos, and customizable combo meals.', address: '1044 Chesterfield Hwy, Cheraw, SC 29520', distance: '14.7 mi', drive: '20–25 min' },
        { name: 'Burger King', blurb: 'Flame-grilled burgers, chicken sandwiches, fries, and breakfast items.', address: '1014 Chesterfield Hwy, Cheraw, SC 29520', distance: '14.8 mi', drive: '20–25 min' },
        { name: "McDonald's", blurb: 'Burgers, chicken sandwiches, fries, breakfast items, and coffee.', address: '500 Chesterfield Hwy, Cheraw, SC 29520', distance: '15.4 mi', drive: '23–28 min' },
      ],
    },
  ] as GuideCategory[],

  thingsToDo: [
    {
      id: 'nature', label: 'Nature & Trails', featured: 1,
      places: [
        { name: 'Sandhills Refuge Viewing Tower', blurb: "Elevated wildlife-viewing platform over the Carolina Sandhills National Wildlife Refuge's forests and wetlands.", address: 'Tates Tower Trail, McBee, SC 29101', distance: '15.1 mi', drive: '20–25 min' },
        { name: 'Cheraw State Park', blurb: 'Forest trails, Lake Juniper, a lakeside boardwalk, kayaking, fishing, and wildlife viewing.', address: '100 State Park Road, Cheraw, SC 29520', distance: '17.7 mi', drive: '22–28 min' },
        { name: 'Lawton Park', blurb: 'Lakeside park with a boardwalk, fishing pier, playgrounds, and picnic shelters.', address: '716 Prestwood Drive, Hartsville, SC 29550', distance: '20.3 mi', drive: '25–30 min' },
        { name: 'Kalmia Gardens', blurb: 'Woodland botanical garden: walking trails, native plants, birdwatching, and a blackwater swamp.', address: '1624 West Carolina Avenue, Hartsville, SC 29550', distance: '22.6 mi', drive: '28–34 min' },
      ],
    },
    {
      id: 'history', label: 'History & Museums', featured: 2,
      places: [
        { name: 'H. Cooper Black Jr. Recreation Area', blurb: 'More than 7,000 acres for horseback riding, camping, hiking, fishing, and field-trial events.', address: '279 Sporting Dog Trail, Cheraw, SC 29520', distance: '15.5 mi', drive: '22–26 min' },
        { name: 'Cheraw Lyceum Museum', blurb: "Small local-history museum about Cheraw's residents, businesses, and architecture.", address: '200 Market Street, Cheraw, SC 29520', distance: '16.2 mi', drive: '22–26 min' },
        { name: 'Dizzy Gillespie Homesite Park', blurb: "Memorial park at the jazz great's birthplace, with a sculpture of his bent trumpet.", address: '344 Huger Street, Cheraw, SC 29520', distance: '16.2 mi', drive: '22–26 min' },
        { name: 'McBee Library and Railroad Museum', blurb: "Historic 1914 railroad depot, now a library and small museum of McBee's railroad history.", address: '96 W Pine Avenue, McBee, SC 29101', distance: '18.2 mi', drive: '20–25 min' },
        { name: 'McLeod Farms Antique Museum', blurb: 'Free museum of antique automobiles, tractors, farming equipment, and historic household items.', address: '29247 Highway 151, McBee, SC 29101', distance: '19.5 mi', drive: '24–29 min' },
        { name: 'Hartsville Museum', blurb: 'Local-history and art museum in a 1930s post office, with an outdoor sculpture courtyard.', address: '222 N Fifth Street, Hartsville, SC 29550', distance: '20.7 mi', drive: '25–30 min' },
        { name: 'Coker Farms National Historic Landmark', blurb: 'Historic agricultural site with self-guided interpretive exhibits on scientific plant breeding.', address: '1257 S Fourth Street, Hartsville, SC 29550', distance: '22.2 mi', drive: '30–35 min' },
        { name: 'The Jacob Kelley House Museum', blurb: "Restored circa-1820 home that briefly served as a headquarters for Sherman's army.", address: '2585 Kelleytown Road, Hartsville, SC 29550', distance: '23.6 mi', drive: '28–32 min' },
        { name: 'John L. Hart House Historical Marker', blurb: "Historical marker at the former home of Hartsville's namesake merchant and landowner.", address: '1063 Society Hill Rd, Darlington, SC 29540', distance: '29.4 mi', drive: '35–40 min' },
        { name: 'West Broad Street Historic District', blurb: 'Preserved late-19th- and early-20th-century homes in several architectural styles.', address: 'West Broad Street, Hartsville, SC 29550', distance: '30.2 mi', drive: '35–40 min' },
      ],
    },
    {
      id: 'family', label: 'Family & Entertainment', featured: 6,
      places: [
        { name: 'Hemi Speedway', blurb: 'Local dirt-track speedway hosting scheduled racing events in a casual outdoor setting.', address: '1755 Cassidy Mill Road, Chesterfield, SC 29709', distance: '7.9 mi', drive: '12–15 min' },
        { name: 'Theatre on the Green', blurb: 'Historic community theater: plays, concerts, and films in downtown Cheraw.', address: '200 Market Street, Cheraw, SC 29520', distance: '16.2 mi', drive: '22–25 min' },
        { name: 'The Center Theater', blurb: 'Historic 1936 theater hosting concerts, community performances, and dance productions.', address: '212 N Fifth Street, Hartsville, SC 29550', distance: '20.7 mi', drive: '26–30 min' },
        { name: 'The Play Zone', blurb: 'Indoor playground for young children with imaginative play areas and open-play sessions.', address: '125 N Fifth Street, Hartsville, SC 29550', distance: '20.7 mi', drive: '26–30 min' },
        { name: 'Hartsville Skating Arena', blurb: 'Indoor roller-skating rink with public sessions, an arcade, and a snack bar.', address: '301 S Marquis Highway, Hartsville, SC 29550', distance: '21.6 mi', drive: '28–33 min' },
        { name: 'Pageland Dragway', blurb: 'Local drag-racing venue; review the event schedule and age suitability before visiting.', address: '3167 Peach Orchard Road, Pageland, SC 29728', distance: '22 mi', drive: '27–32 min' },
        { name: 'Neptune Island Waterpark', blurb: 'Seasonal family waterpark: slides, a lazy river, splash attractions, and cabanas.', address: '1109 14th Street, Hartsville, SC 29550', distance: '23.9 mi', drive: '33–36 min' },
        { name: 'Narrow Way Nature Center', blurb: 'Rural nature and horseback-riding destination; reservations may be required.', address: '1248 Windfall Farm Lane, Hartsville, SC 29550', distance: '24.2 mi', drive: '32–35 min' },
        { name: 'The Ball Theatre', blurb: 'Restored local movie theater showing current films and hosting community programs.', address: '220 W McGregor Street, Pageland, SC 29728', distance: '25.1 mi', drive: '32–35 min' },
        { name: 'Darlington Raceway', blurb: 'Historic NASCAR racetrack with major events, fan experiences, and a stock-car museum.', address: '1301 Harry Byrd Highway, Darlington, SC 29532', distance: '29.9 mi', drive: '38–44 min' },
      ],
    },
    {
      id: 'golf', label: 'Golf', featured: 1,
      places: [
        { name: 'Green River Country Club', blurb: 'Local course for recreational rounds; confirm tee times and public access in advance.', address: '782 State Road S-13-756, Chesterfield, SC 29709', distance: '12.8 mi', drive: '18–20 min' },
        { name: 'Cheraw State Park Golf', blurb: '18-hole championship course surrounded by pine forest, with driving range and pro shop.', address: '100 State Park Road, Cheraw, SC 29520', distance: '17.5 mi', drive: '22–25 min' },
      ],
    },
    {
      id: 'vineyards', label: 'Vineyards', featured: 0,
      places: [
        { name: 'Cash Winery and Vineyard', blurb: 'Small local winery known for blueberry wine; public tastings subject to availability.', address: '179-177 Cash Swamp Rd, Cheraw, SC 29520', distance: '19.5 mi', drive: '23–27 min' },
        { name: 'Vineyard at The Old Place', blurb: 'Family-owned winery: muscadine wines, food trucks, live events, and gathering spaces.', address: '5435 Austin Rd, Peachland, NC 28133', distance: '26.3 mi', drive: '33–37 min' },
        { name: 'Laurel Haven Estate Vineyard and Winery', blurb: 'Scenic vineyard estate with tastings, a bistro, and event spaces.', address: '3341 Taxahaw Road, Lancaster, SC 29720', distance: '42.7 mi', drive: '45–55 min' },
      ],
    },
    {
      id: 'hunting', label: 'Hunting', featured: 0,
      places: [
        { name: 'Hunter Run Farm', blurb: 'Private preserve five minutes away: guided upland bird, waterfowl, and big-game hunts.', address: '6574 SC-102, Chesterfield, SC 29709', distance: '3.6 mi', drive: '5 min' },
        { name: "Moree's Sportsman's Preserve", blurb: 'Large sporting preserve: quail, pheasant, duck, deer, fishing, and sporting clays.', address: '1217 Moree Rd, Society Hill, SC 29593', distance: '16.2 mi', drive: '20–25 min' },
      ],
    },
  ] as GuideCategory[],

  medical: {
    note: 'There is no hospital directly in Patrick, SC. For a life-threatening emergency, call 911 first, then notify Guest Support.',
    hospitals: [
      { name: 'McLeod Health Cheraw', blurb: 'Full-service acute-care hospital with an ER and general medical services.', address: '711 Chesterfield Hwy, Cheraw, SC 29520', distance: '15.1 mi', drive: '25–35 min' },
      { name: 'Carolina Pines Regional Medical Center', blurb: 'Regional acute-care hospital with 24-hour emergency services and inpatient care.', address: '1304 W Bobo Newsom Hwy, Hartsville, SC 29550', distance: '23.8 mi', drive: '30–40 min' },
    ] as GuidePlace[],
  },

  faq: [
    { q: 'What is the Wi-Fi password?', a: 'The network is “Horizons Sandhills Guest” and the password is “@HorizonsSandhills”. Both are in Start Here with one-tap copy buttons.' },
    { q: 'How do I contact the property manager?', a: `Daniil is on the property and available 24/7 — call or text ${GUIDE_PHONE_DISPLAY}.` },
    { q: 'How do I use the sauna?', a: 'See the Cedar Barrel Sauna card under Amenities — give it about fifteen minutes to warm up.' },
    { q: 'Where should I park?', a: 'Use your assigned lot: A or B for the Forest Villa, C for the Guest House, D for overflow. EV chargers are at Parking A.' },
    { q: 'Where is the nearest grocery store?', a: 'The Markette in Patrick (8–10 min) covers essentials; Piggly Wiggly in Chesterfield (17–20 min) is the closest full grocery store.' },
    { q: 'Can I request late checkout?', a: 'Yes — tap Request Late Checkout in the Checkout section. It depends on availability, and an extra fee of 10% of the nightly rate applies.' },
    { q: 'Are pets allowed?', a: 'Please confirm the pet policy with Guest Support before arriving with animals.' },
    { q: 'What should I do if the power goes out?', a: 'Check the breaker panel first, then contact Guest Support if power does not return.' },
    { q: "What should I do if I'm locked out?", a: 'Call Guest Support. We can share access instructions or send help.' },
    { q: 'How do I report maintenance issues?', a: 'Call or text Guest Support, or tap Report an Issue in this section.' },
  ],

  farewell: 'Rest well. Explore slowly. Enjoy the Sandhills.',
};
```

- [ ] **Step 2: Verify it compiles**

Run: `npm run build`
Expected: build succeeds (data file has no imports, only exports).

- [ ] **Step 3: Commit**

```bash
git add src/components/data/guide.ts
git commit -m "Add guest guide data layer (guide.ts)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Shared chrome — StickyHeader `page` variant, Guide nav link, landing `#gallery` handoff, Footer absolute hrefs

**Files:**
- Modify: `src/components/blocks/StickyHeader.tsx`
- Modify: `src/pages/SandhillsLanding.tsx:44-57` (hash effect)
- Modify: `src/components/blocks/Footer.tsx:1-37` (cols hrefs)

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: `StickyHeader` accepts `variant?: 'landing' | 'page'` (default `'landing'`). Task 3 renders `<StickyHeader variant="page" />`.

- [ ] **Step 1: Rework nav link lists in `StickyHeader.tsx`**

Replace the current module-level `navLinks` const (lines 9–14) with:

```ts
type NavLink = { label: string; href: string; onClick?: () => void };

const landingLinks: NavLink[] = [
  { label: 'Stays',    href: '#stays' },
  { label: 'The Land', href: '#land' },
  { label: 'Gallery',  href: '#', onClick: openGallery },
  { label: 'Guide',    href: '/guide' },
  { label: 'Reserve',  href: '#reserve' },
];

const pageLinks: NavLink[] = [
  { label: 'Stays',    href: '/#stays' },
  { label: 'The Land', href: '/#land' },
  { label: 'Gallery',  href: '/#gallery' },
  { label: 'Guide',    href: '/guide' },
  { label: 'Reserve',  href: '/#reserve' },
];
```

- [ ] **Step 2: Add the variant prop and static motion values**

Change the component signature and add an `isPage` flag:

```tsx
export default function StickyHeader({ variant = 'landing' }: { variant?: 'landing' | 'page' } = {}) {
  const isPage = variant === 'page';
  const navLinks = isPage ? pageLinks : landingLinks;
  ...
```

Then apply these conditional changes inside the JSX (leave everything else exactly as-is):

1. **Top gradient scrim**, **sun glow backdrop**, **large hero logo**, and **"View gallery" glass pill** blocks: wrap each in `{!isPage && ( ... )}`.
2. **Nav** (`<motion.nav>`): `style={isPage ? undefined : { opacity: navOpacity, x: navX }}`.
3. **Book button wrapper** (`<motion.div className="hidden md:flex justify-end ...">`): `style={isPage ? undefined : { opacity: bookOpacity }}`.
4. **Small logo** (`<motion.img src="/logo.svg">`): `opacity: isPage ? 1 : smallLogoOpacity` inside its existing `style` object.
5. **Logo anchor**: `href={isPage ? '/' : '#'}` and only attach the scroll-to-top `onClick` when `!isPage`:

```tsx
onClick={isPage ? undefined : (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, '', window.location.pathname);
}}
```

Keep the full-bg blur layer, `headerPb`, `overDark` zone logic, mobile burger menu, and mask logic untouched — they behave correctly on both variants.

- [ ] **Step 3: Handle `#gallery` hash in `SandhillsLanding.tsx`**

In the mount effect (currently lines 44–57), replace the hash block with:

```ts
const hash = window.location.hash;
if (hash === '#gallery') {
  // Arrived from another route (e.g. /guide nav) asking for the gallery modal.
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('open-gallery'));
    history.replaceState(null, '', window.location.pathname);
  }, 400);
} else if (hash) {
  const id = hash.replace('#', '');
  const el = document.getElementById(id);
  if (el) {
    setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
  }
}
```

- [ ] **Step 4: Make Footer hrefs absolute**

In `Footer.tsx` `cols` (lines 3–37), change only these hrefs: `#stays` → `/#stays`, `#reserve` → `/#reserve`, `#land` → `/#land`, `#day` → `/#day`, `#table` → `/#table`, `#gallery` → `/#gallery`. Leave all `#` dead links as they are.

- [ ] **Step 5: Verify**

Run: `npm run build` — expected: success.
Run: `npm run dev`, open `http://localhost:5173/`:
- Header at top of hero: large logo + sun glow + "View gallery" pill visible, no nav links (unchanged behavior).
- Scroll down: nav fades in and now reads Stays · The Land · Gallery · **Guide** · Reserve; Gallery still opens the modal; Guide navigates to `/guide` (blank route for now — that's expected until Task 3).
- Mobile viewport: burger menu shows the five links including Guide.

- [ ] **Step 6: Commit**

```bash
git add src/components/blocks/StickyHeader.tsx src/pages/SandhillsLanding.tsx src/components/blocks/Footer.tsx
git commit -m "Add StickyHeader page variant, Guide nav link, #gallery hash handoff

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Route, page shell, hero, sticky section nav

**Files:**
- Create: `src/pages/GuestGuide.tsx`
- Create: `src/components/guide/GuideSection.tsx`
- Create: `src/components/guide/GuideHero.tsx`
- Create: `src/components/guide/GuideSectionNav.tsx`
- Modify: `src/App.tsx`
- Modify: `src/index.css` (append print rules)

**Interfaces:**
- Consumes: `guideData`, `mapsDir`, `telHref`, `smsHref`, `GUIDE_PHONE_DISPLAY` (Task 1); `StickyHeader variant="page"` (Task 2).
- Produces:
  - `GuideSection` props: `{ id: string; index: string; eyebrow: string; title: string; sub?: string; band?: boolean; children?: ReactNode }` — every section task (4–8) wraps content in it.
  - `GuestGuide.tsx` contains placeholder-free sections that later tasks fill: it renders `<GuideSection …>` blocks whose children are added in Tasks 4–8.
  - `NAV_ITEMS` exported from `GuideSectionNav.tsx`: `{ id, label }[]` for the 11 sections.

- [ ] **Step 1: Append print rules to `src/index.css`** (at end of file):

```css
/* Guest guide print (save-as-PDF) */
@media print {
  .no-print { display: none !important; }
  .print-show { display: block !important; }
  .guide-card { break-inside: avoid; }
}
```

- [ ] **Step 2: Create `src/components/guide/GuideSection.tsx`**

```tsx
import type { ReactNode } from 'react';
import RevealOnScroll from '../primitives/RevealOnScroll';

interface Props {
  id: string;
  index: string;      // '01' … '11'
  eyebrow: string;    // section label, e.g. 'Start Here'
  title: string;
  sub?: string;
  band?: boolean;     // alternate warm background band
  children?: ReactNode;
}

export default function GuideSection({ id, index, eyebrow, title, sub, band = false, children }: Props) {
  return (
    <section
      id={id}
      data-zone="light"
      className={`scroll-mt-32 py-16 md:py-24 ${band ? 'bg-boneWarm' : 'bg-bone'}`}
    >
      <div className="max-w-content mx-auto px-6 md:px-10">
        <RevealOnScroll className="mb-10 md:mb-14 max-w-3xl">
          <p className="eyebrow text-signal">
            <span className="numeral mr-3 text-ink2">{index}</span>
            {eyebrow}
          </p>
          <h2 className="display-h2 mt-4 text-ink text-[clamp(28px,4vw,48px)]">{title}</h2>
          {sub && <p className="mt-4 text-ink2 text-[15px] md:text-base leading-relaxed">{sub}</p>}
        </RevealOnScroll>
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `src/components/guide/GuideSectionNav.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export const NAV_ITEMS = [
  { id: 'start', label: 'Start Here' },
  { id: 'arrival', label: 'Arrival' },
  { id: 'access', label: 'Cabin' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'safety', label: 'Safety' },
  { id: 'house-rules', label: 'Rules' },
  { id: 'checkout', label: 'Checkout' },
  { id: 'food', label: 'Local Guide' },
  { id: 'things-to-do', label: 'Things To Do' },
  { id: 'medical', label: 'Medical' },
  { id: 'support', label: 'Help' },
];

export default function GuideSectionNav() {
  const [active, setActive] = useState<string>(NAV_ITEMS[0].id);
  const barRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-35% 0px -60% 0px' },
    );
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // Keep the active chip in view on mobile.
  useEffect(() => {
    const el = itemRefs.current[active];
    const bar = barRef.current;
    if (el && bar) {
      bar.scrollTo({
        left: el.offsetLeft - bar.clientWidth / 2 + el.clientWidth / 2,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    }
  }, [active, reduceMotion]);

  return (
    <nav
      className="no-print sticky top-16 z-40 bg-bone/90 border-b border-divider"
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      aria-label="Guide sections"
    >
      <div
        ref={barRef}
        className="max-w-content mx-auto px-6 md:px-10 flex gap-2 overflow-x-auto py-3"
        style={{ scrollbarWidth: 'none' }}
      >
        {NAV_ITEMS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            ref={(el) => { itemRefs.current[id] = el; }}
            className={`eyebrow shrink-0 rounded-full px-4 py-2 transition-colors ${
              active === id
                ? 'bg-signal text-linen'
                : 'text-ink2 hover:text-ink hover:bg-ink/5'
            }`}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
```

- [ ] **Step 4: Create `src/components/guide/GuideHero.tsx`**

```tsx
import { MapPin, Phone, MessageSquare, Wifi, Map, Siren } from 'lucide-react';
import Button from '../primitives/Button';
import RevealOnScroll from '../primitives/RevealOnScroll';
import { guideData as g, mapsDir, telHref, smsHref, GUIDE_PHONE_DISPLAY } from '../data/guide';

const quickActions = [
  { label: 'Directions', icon: MapPin, href: mapsDir(g.meta.address) },
  { label: 'Call', icon: Phone, href: telHref },
  { label: 'Text', icon: MessageSquare, href: smsHref() },
  { label: 'Wi-Fi', icon: Wifi, href: '#start' },
  { label: 'Map', icon: Map, href: '#arrival' },
  { label: 'Emergency', icon: Siren, href: '#safety' },
];

export default function GuideHero() {
  const { cards } = g.hero;
  return (
    <section data-zone="dark" className="relative min-h-[92svh] flex flex-col justify-end overflow-hidden">
      <img
        src={g.hero.photo}
        alt="Horizons Sandhills — barrel sauna at the lake"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(10,8,5,0.35) 0%, rgba(10,8,5,0.2) 40%, rgba(10,8,5,0.78) 100%)' }}
      />

      <div className="relative max-w-content mx-auto w-full px-6 md:px-10 pb-10 md:pb-14 pt-40">
        <RevealOnScroll>
          <p className="eyebrow-lg text-linen/80">{g.hero.eyebrow}</p>
          <h1 className="display mt-3 text-linen text-[clamp(40px,7vw,84px)] leading-[1.02]">{g.hero.title}</h1>
          <p className="mt-4 max-w-text text-linen/80 text-[15px] md:text-lg">{g.hero.sub}</p>

          <div className="no-print mt-8 flex flex-wrap gap-3">
            <Button href="#start" variant="primary">Start Here</Button>
            <Button href={mapsDir(g.meta.address)} variant="ghost-light">Get Directions</Button>
          </div>
        </RevealOnScroll>

        {/* Info cards */}
        <RevealOnScroll variant="stagger-parent" className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            { label: cards.checkIn.label, value: cards.checkIn.value, note: cards.checkIn.note },
            { label: cards.checkOut.label, value: cards.checkOut.value, note: cards.checkOut.note },
            { label: cards.support.label, value: GUIDE_PHONE_DISPLAY, note: cards.support.note, support: true },
          ].map((c) => (
            <RevealOnScroll variant="stagger-child" key={c.label}>
              <div className="guide-card h-full rounded-2xl border border-linen/20 bg-night/40 p-5" style={{ backdropFilter: 'blur(8px)' }}>
                <p className="eyebrow text-linen/60">{c.label}</p>
                <p className="mt-2 font-display font-light text-linen text-2xl">{c.value}</p>
                <p className="mt-1 text-linen/60 text-[13px] leading-snug">{c.note}</p>
                {'support' in c && c.support && (
                  <div className="no-print mt-3 flex gap-2">
                    <a href={telHref} className="eyebrow rounded-full border border-linen/40 px-4 py-2 text-linen hover:bg-linen/10 transition-colors">Call</a>
                    <a href={smsHref()} className="eyebrow rounded-full border border-linen/40 px-4 py-2 text-linen hover:bg-linen/10 transition-colors">Text</a>
                  </div>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </RevealOnScroll>

        {/* Quick actions */}
        <div className="no-print mt-6 flex flex-wrap gap-2">
          {quickActions.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-2 rounded-full border border-linen/25 px-4 py-2 text-linen/85 hover:bg-linen/10 transition-colors"
            >
              <Icon size={14} strokeWidth={1.6} className="text-ember" />
              <span className="eyebrow">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create `src/pages/GuestGuide.tsx`** (shell — sections are filled by Tasks 4–8)

```tsx
import { useEffect } from 'react';
import StickyHeader from '../components/blocks/StickyHeader';
import Footer from '../components/blocks/Footer';
import BookingModal from '../components/blocks/BookingModal';
import GuideHero from '../components/guide/GuideHero';
import GuideSectionNav from '../components/guide/GuideSectionNav';
import GuideSection from '../components/guide/GuideSection';
import { guideData as g } from '../components/data/guide';

export default function GuestGuide() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = g.meta.title;
    window.scrollTo(0, 0);
    return () => { document.title = prevTitle; };
  }, []);

  return (
    <div className="min-h-screen bg-bone">
      <div className="no-print">
        <StickyHeader variant="page" />
      </div>

      <GuideHero />
      <GuideSectionNav />

      <main>
        <GuideSection id="start" index="01" eyebrow="Start Here" title="The essentials, in one place"
          sub="The details guests reach for first. Address, arrival times, Wi-Fi, and how to reach us.">
        </GuideSection>

        <GuideSection id="arrival" index="02" eyebrow="Arrival" title="Getting here" band>
        </GuideSection>

        <GuideSection id="access" index="03" eyebrow="Cabin Access" title="Getting into your cabin"
          sub="From your car to the porch in five steps. Read them first, then watch the video if you prefer.">
        </GuideSection>

        <GuideSection id="amenities" index="04" eyebrow="Amenities" title="Using the property" band
          sub="Cedar barrel sauna, firepit, grill, EV chargers, and the small comforts that make the stay easy.">
        </GuideSection>

        <GuideSection id="safety" index="05" eyebrow="Safety" title="Safety at Horizons"
          sub="Everyday information, precautions, and one-tap emergency help.">
        </GuideSection>

        <GuideSection id="house-rules" index="06" eyebrow="House Rules" title="A calm place for everyone" band
          sub="A short list. Please treat the cabin the way you would want the next guest to treat it.">
        </GuideSection>

        <GuideSection id="checkout" index="07" eyebrow="Checkout" title="Before you go" sub={g.checkout.sub}>
        </GuideSection>

        <GuideSection id="food" index="08" eyebrow="Local Guide" title="Nearby, curated" band
          sub="Where we send friends. One pick per category — tap “Show all” for the full list.">
        </GuideSection>

        <GuideSection id="things-to-do" index="09" eyebrow="Things To Do" title="Explore the Sandhills"
          sub="Trails, parks, and quiet detours worth the drive.">
        </GuideSection>

        <GuideSection id="medical" index="10" eyebrow="Medical" title="Care nearby" band sub={g.medical.note}>
        </GuideSection>

        <GuideSection id="support" index="11" eyebrow="Help" title="Questions & guest support"
          sub="Common questions. If yours is not here, we are one tap away.">
        </GuideSection>
      </main>

      <div className="no-print">
        <Footer />
      </div>
      <BookingModal />
    </div>
  );
}
```

- [ ] **Step 6: Add the route in `src/App.tsx`**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SandhillsLanding from './pages/SandhillsLanding';
import StayDetail from './pages/StayDetail';
import GuestGuide from './pages/GuestGuide';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SandhillsLanding />} />
        <Route path="/stays/:slug" element={<StayDetail />} />
        <Route path="/guide" element={<GuestGuide />} />
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] **Step 7: Verify**

Run: `npm run build` — expected success.
Dev server, open `http://localhost:5173/guide`:
- Hero photo with title, CTAs, three info cards, six quick-action chips.
- StickyHeader visible immediately with nav links + Book (no large logo/pill); logo light over hero, flips dark after scrolling past hero (`data-zone` works).
- Sticky chip nav below header; clicking a chip scrolls to the (currently header-only) section; active chip highlights while scrolling.
- Book button opens the booking modal.

- [ ] **Step 8: Commit**

```bash
git add src/pages/GuestGuide.tsx src/components/guide/GuideSection.tsx src/components/guide/GuideHero.tsx src/components/guide/GuideSectionNav.tsx src/App.tsx src/index.css
git commit -m "Add /guide route: page shell, hero, sticky section nav

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4: Start Here + Arrival (copy buttons, property map)

**Files:**
- Create: `src/components/guide/CopyButton.tsx`
- Create: `src/components/guide/PropertyMap.tsx`
- Modify: `src/pages/GuestGuide.tsx` (fill `#start` and `#arrival` sections)

**Interfaces:**
- Consumes: `GuideSection` shell (Task 3); `guideData`, `mapsDir`, `telHref`, `smsHref`, `GUIDE_PHONE_DISPLAY` (Task 1).
- Produces: `CopyButton` props `{ value: string; label?: string }` (reused by nothing else, but Task 8 print rules assume its `no-print` class); `PropertyMap` takes no props.

- [ ] **Step 1: Create `src/components/guide/CopyButton.tsx`**

```tsx
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable (permissions/HTTP) — leave the value visible for manual copy.
    }
  };

  return (
    <button
      onClick={copy}
      className="no-print inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-3 py-1.5 eyebrow text-ink2 hover:bg-ink/5 transition-colors"
      aria-label={`${label}: ${value}`}
    >
      {copied ? <Check size={12} strokeWidth={2} className="text-signal" /> : <Copy size={12} strokeWidth={1.6} />}
      {copied ? 'Copied' : label}
    </button>
  );
}
```

- [ ] **Step 2: Create `src/components/guide/PropertyMap.tsx`**

```tsx
import { guideData as g } from '../data/guide';

// Schematic, not to scale — matches the client's prototype map.
const spots = [
  { label: 'Cabin A', style: { left: '56%', top: '14%' } },
  { label: 'Cabin B', style: { left: '74%', top: '24%' } },
  { label: 'Guest House', style: { left: '60%', top: '46%' } },
  { label: 'Sauna', style: { left: '38%', top: '30%' } },
  { label: 'Firepit', style: { left: '48%', top: '60%' } },
];

const parkingSpots = [
  { id: 'A', style: { left: '14%', top: '64%' } },
  { id: 'B', style: { left: '28%', top: '72%' } },
  { id: 'C', style: { left: '68%', top: '64%' } },
  { id: 'D', style: { left: '80%', top: '76%' } },
];

export default function PropertyMap() {
  return (
    <div>
      <div className="guide-card relative rounded-2xl border border-divider bg-surface overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
        {/* Lake */}
        <div
          className="absolute grid place-items-center border border-longleaf/40 bg-longleaf/25"
          style={{ left: '6%', top: '8%', width: '36%', height: '40%', borderRadius: '48% 52% 55% 45% / 55% 48% 52% 45%' }}
        >
          <span className="eyebrow text-longleaf">Lake</span>
        </div>

        {/* Buildings & features */}
        {spots.map((s) => (
          <div key={s.label} className="absolute -translate-x-1/2 -translate-y-1/2 rounded-md border border-ink/25 bg-bone px-2.5 py-1.5" style={s.style}>
            <span className="eyebrow text-ink whitespace-nowrap">{s.label}</span>
          </div>
        ))}

        {/* Parking */}
        {parkingSpots.map((p) => (
          <div key={p.id} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1" style={p.style}>
            <span className="grid h-7 w-7 place-items-center rounded-full border border-signal/50 bg-signal/10 font-eyebrow text-xs font-semibold text-signal">{p.id}</span>
            <span className="eyebrow text-ink2 text-[9px]">Parking</span>
          </div>
        ))}

        {/* Road from entrance */}
        <div className="absolute" style={{ left: '46%', bottom: 0, height: '18%', borderLeft: '2px dashed rgba(31,36,32,0.25)' }} />
        <div className="absolute -translate-x-1/2 rounded-full bg-ink px-3 py-1" style={{ left: '46%', bottom: '4%' }}>
          <span className="eyebrow text-linen">Entrance</span>
        </div>

        {/* Compass */}
        <div className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-ink/20 bg-bone">
          <span className="numeral text-ink">N</span>
        </div>
      </div>

      {/* Parking legend */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {g.arrival.parking.map((p) => (
          <div key={p.id} className="guide-card flex items-start gap-3 rounded-xl border border-divider bg-bone p-4">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-signal/50 bg-signal/10 font-eyebrow text-xs font-semibold text-signal">{p.id}</span>
            <div>
              <p className="font-eyebrow text-sm text-ink">{p.title}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-ink2">{p.note}</p>
            </div>
          </div>
        ))}
      </div>
      <ul className="mt-4 space-y-1.5">
        {g.arrival.parkingNotes.map((n) => (
          <li key={n} className="text-[13px] leading-relaxed text-ink2">— {n}</li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Fill the two sections in `GuestGuide.tsx`**

Add imports at the top of `GuestGuide.tsx`:

```tsx
import CopyButton from '../components/guide/CopyButton';
import PropertyMap from '../components/guide/PropertyMap';
import { mapsDir, telHref, smsHref, GUIDE_PHONE_DISPLAY } from '../components/data/guide';
import Button from '../components/primitives/Button';
import RevealOnScroll from '../components/primitives/RevealOnScroll';
import { Printer } from 'lucide-react';
```

Replace the empty `#start` section children with:

```tsx
<GuideSection id="start" index="01" eyebrow="Start Here" title="The essentials, in one place"
  sub="The details guests reach for first. Address, arrival times, Wi-Fi, and how to reach us.">
  <RevealOnScroll className="grid gap-4 md:grid-cols-2">
    {/* Address */}
    <div className="guide-card rounded-2xl border border-divider bg-white/40 p-6">
      <p className="eyebrow text-ink2">Property Address</p>
      <p className="mt-2 font-display font-light text-ink text-xl">{g.meta.address}</p>
      <p className="mt-1 text-[13px] text-ink2">GPS {g.meta.gps} · Nearest town {g.meta.nearestTown}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button href={mapsDir(g.meta.address)} variant="primary" className="!py-2 !px-5 !min-h-0">Get Directions</Button>
        <CopyButton value={g.meta.address} label="Copy Address" />
      </div>
    </div>

    {/* Wi-Fi */}
    <div className="guide-card rounded-2xl border border-divider bg-white/40 p-6">
      <p className="eyebrow text-ink2">Wi-Fi</p>
      <div className="mt-2 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[12px] text-ink2">Network</p>
            <p className="font-eyebrow text-sm text-ink">{g.wifi.network}</p>
          </div>
          <CopyButton value={g.wifi.network} label="Copy" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[12px] text-ink2">Password</p>
            <p className="font-eyebrow text-sm text-ink">{g.wifi.password}</p>
          </div>
          <CopyButton value={g.wifi.password} label="Copy" />
        </div>
      </div>
    </div>

    {/* Support */}
    <div className="guide-card rounded-2xl border border-divider bg-white/40 p-6">
      <p className="eyebrow text-ink2">Guest Support · 24/7</p>
      <p className="mt-2 font-display font-light text-ink text-xl">{g.meta.manager} · {GUIDE_PHONE_DISPLAY}</p>
      <div className="no-print mt-4 flex gap-2">
        <Button href={telHref} variant="secondary" className="!py-2 !px-5 !min-h-0">Call</Button>
        <Button href={smsHref()} variant="secondary" className="!py-2 !px-5 !min-h-0">Text</Button>
      </div>
    </div>

    {/* Offline */}
    <div className="guide-card rounded-2xl border border-divider bg-white/40 p-6">
      <p className="eyebrow text-ink2">Offline access</p>
      <p className="mt-2 font-display font-light text-ink text-xl">{g.offline.title}</p>
      <p className="mt-1 text-[13px] leading-snug text-ink2">{g.offline.note}</p>
      <button
        onClick={() => window.print()}
        className="no-print mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 eyebrow text-bone hover:bg-ink/85 transition-colors"
      >
        <Printer size={13} strokeWidth={1.6} />
        Download Guide
      </button>
    </div>
  </RevealOnScroll>
</GuideSection>
```

Replace the empty `#arrival` section with:

```tsx
<GuideSection id="arrival" index="02" eyebrow="Arrival" title="Getting here" band>
  <div className="grid gap-10 lg:grid-cols-2">
    <RevealOnScroll>
      <ol className="space-y-5">
        {g.arrival.steps.map((s, i) => (
          <li key={s} className="flex gap-4">
            <span className="numeral mt-0.5 shrink-0 text-signal">{String(i + 1).padStart(2, '0')}</span>
            <p className="text-[15px] leading-relaxed text-ink">{s}</p>
          </li>
        ))}
      </ol>
      <div className="no-print mt-8">
        <Button href={mapsDir(g.meta.address)} variant="secondary" className="!py-2.5 !px-6 !min-h-0">Open in Maps</Button>
      </div>
    </RevealOnScroll>
    <RevealOnScroll delay={0.15}>
      <p className="eyebrow mb-4 text-ink2">Property Map</p>
      <PropertyMap />
    </RevealOnScroll>
  </div>
</GuideSection>
```

- [ ] **Step 4: Verify**

Run: `npm run build` — success.
Dev server `/guide`:
- Start Here: four cards; Copy Address / Copy network / Copy password each flash "Copied" and populate the clipboard; Get Directions opens Google Maps with the property address as destination; Call/Text open `tel:`/`sms:`.
- Arrival: five numbered steps; schematic map shows lake/cabins/guest house/sauna/firepit/parking A–D/entrance/N; parking legend shows the four docx descriptions + two notes.

- [ ] **Step 5: Commit**

```bash
git add src/components/guide/CopyButton.tsx src/components/guide/PropertyMap.tsx src/pages/GuestGuide.tsx
git commit -m "Guide: Start Here and Arrival sections with property map

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: Cabin Access + Amenities

**Files:**
- Create: `src/components/guide/VideoEmbed.tsx`
- Modify: `src/pages/GuestGuide.tsx` (fill `#access` and `#amenities`)

**Interfaces:**
- Consumes: `GuideSection` (Task 3), `guideData.access`, `guideData.amenities`, `telHref` (Task 1).
- Produces: `VideoEmbed` props `{ id: string; title: string; duration: string; kicker: string }`.

- [ ] **Step 1: Create `src/components/guide/VideoEmbed.tsx`** (click-to-load — no iframe until tapped)

```tsx
import { useState } from 'react';
import { Play } from 'lucide-react';

interface Props { id: string; title: string; duration: string; kicker: string }

export default function VideoEmbed({ id, title, duration, kicker }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="no-print guide-card overflow-hidden rounded-2xl border border-divider bg-night">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          className="aspect-video w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button onClick={() => setPlaying(true)} className="group relative block w-full" aria-label={`Play video: ${title}`}>
          <img
            src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
            alt=""
            className="aspect-video w-full object-cover opacity-80 transition-opacity group-hover:opacity-60"
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-signal text-linen transition-transform group-hover:scale-105">
              <Play size={22} strokeWidth={1.8} fill="currentColor" />
            </span>
          </span>
          <span className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4" style={{ background: 'linear-gradient(transparent, rgba(10,8,5,0.8))' }}>
            <span className="text-left">
              <span className="eyebrow block text-linen/70">{kicker}</span>
              <span className="font-display font-light text-linen text-lg">{title}</span>
            </span>
            <span className="eyebrow text-linen/70">{duration}</span>
          </span>
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Fill `#access` in `GuestGuide.tsx`**

Add import: `import VideoEmbed from '../components/guide/VideoEmbed';`

```tsx
<GuideSection id="access" index="03" eyebrow="Cabin Access" title="Getting into your cabin"
  sub="From your car to the porch in five steps. Read them first, then watch the video if you prefer.">
  <div className="grid gap-10 lg:grid-cols-2">
    <RevealOnScroll>
      <ol className="space-y-6">
        {g.access.steps.map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <span className="numeral mt-1 shrink-0 text-signal">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3 className="font-display font-light text-ink text-lg" style={{ fontVariationSettings: '"SOFT" 30, "opsz" 32' }}>{s.title}</h3>
              <p className="mt-1 text-[14px] leading-relaxed text-ink2">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </RevealOnScroll>
    <RevealOnScroll delay={0.15}>
      <VideoEmbed {...g.access.video} />
      <div className="guide-card mt-4 rounded-2xl border border-signal/30 bg-signal/5 p-5">
        <p className="font-eyebrow text-sm text-ink">{g.access.trouble.title}</p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink2">{g.access.trouble.body}</p>
        <a href={telHref} className="no-print eyebrow mt-3 inline-block rounded-full bg-signal px-5 py-2.5 text-linen hover:bg-signal2 transition-colors">
          Call Guest Support
        </a>
      </div>
    </RevealOnScroll>
  </div>
</GuideSection>
```

- [ ] **Step 3: Fill `#amenities` in `GuestGuide.tsx`**

```tsx
<GuideSection id="amenities" index="04" eyebrow="Amenities" title="Using the property" band
  sub="Cedar barrel sauna, firepit, grill, EV chargers, and the small comforts that make the stay easy.">
  {/* Featured: sauna */}
  <RevealOnScroll className="guide-card overflow-hidden rounded-2xl border border-divider bg-white/40 lg:grid lg:grid-cols-2">
    <img src={g.amenities.featured.photo} alt="Cedar barrel sauna interior" className="h-64 w-full object-cover lg:h-full" />
    <div className="p-6 md:p-8">
      <p className="eyebrow text-signal">{g.amenities.featured.kicker}</p>
      <h3 className="display-h2 mt-2 text-ink text-[clamp(24px,3vw,36px)]">{g.amenities.featured.name}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-ink2">{g.amenities.featured.body}</p>
      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-divider pt-5">
        {g.amenities.featured.stats.map((s) => (
          <div key={s.label}>
            <p className="eyebrow text-ink2">{s.label}</p>
            <p className="mt-1 font-display font-light text-ink text-lg">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  </RevealOnScroll>

  {/* Smaller amenity cards */}
  <RevealOnScroll variant="stagger-parent" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
    {g.amenities.cards.map((c) => (
      <RevealOnScroll variant="stagger-child" key={c.name}>
        <div className="guide-card h-full rounded-xl border border-divider bg-white/40 p-4">
          <p className="font-eyebrow text-sm text-ink">{c.name}</p>
          <p className="mt-1 text-[13px] leading-snug text-ink2">{c.note}</p>
        </div>
      </RevealOnScroll>
    ))}
  </RevealOnScroll>
</GuideSection>
```

- [ ] **Step 4: Verify**

`npm run build` — success. Dev server `/guide`:
- Access: 5 titled steps; video card shows YouTube thumbnail + play button, click loads and autoplays the embed; trouble card links to `tel:`.
- Amenities: featured sauna card with photo (`/images/villa/04_Sauna/1.webp` renders), 3 stats; 5 small cards below.

- [ ] **Step 5: Commit**

```bash
git add src/components/guide/VideoEmbed.tsx src/pages/GuestGuide.tsx
git commit -m "Guide: Cabin Access (click-to-load video) and Amenities sections

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Safety + House Rules + Checkout checklist

**Files:**
- Create: `src/components/guide/CheckoutChecklist.tsx`
- Modify: `src/pages/GuestGuide.tsx` (fill `#safety`, `#house-rules`, `#checkout`)

**Interfaces:**
- Consumes: `GuideSection` (Task 3); `guideData.safety`, `guideData.rules`, `guideData.checkout`, `smsHref`, `telHref` (Task 1).
- Produces: `CheckoutChecklist` (no props; reads `guideData.checkout` itself). localStorage key: `hs-guide-checkout-v1`.

- [ ] **Step 1: Create `src/components/guide/CheckoutChecklist.tsx`**

```tsx
import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import Button from '../primitives/Button';
import { guideData as g, smsHref } from '../data/guide';

const STORAGE_KEY = 'hs-guide-checkout-v1';

export default function CheckoutChecklist() {
  const items = g.checkout.items;
  const [checked, setChecked] = useState<boolean[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? (JSON.parse(raw) as unknown) : null;
      if (Array.isArray(arr) && arr.length === items.length && arr.every((v) => typeof v === 'boolean')) {
        return arr;
      }
    } catch { /* private mode etc. — fall through to fresh state */ }
    return items.map(() => false);
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(checked)); } catch { /* ignore */ }
  }, [checked]);

  const done = checked.filter(Boolean).length;

  return (
    <div className="guide-card rounded-2xl border border-divider bg-white/40 p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow text-ink2">Checkout time · {g.checkout.time}</p>
        <p className="eyebrow text-signal">Progress {done} / {items.length}</p>
      </div>

      <ul className="mt-6 space-y-1">
        {items.map((item, i) => (
          <li key={item}>
            <button
              onClick={() => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-ink/5 transition-colors"
              aria-pressed={checked[i]}
            >
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded border transition-colors ${
                checked[i] ? 'border-signal bg-signal text-linen' : 'border-ink/30 bg-transparent'
              }`}>
                {checked[i] && <Check size={12} strokeWidth={2.5} />}
              </span>
              <span className={`text-[15px] ${checked[i] ? 'text-ink2 line-through' : 'text-ink'}`}>{item}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[13px] leading-relaxed text-ink2">{g.checkout.lateNote}</p>

      <div className="no-print mt-5 flex flex-wrap gap-2">
        <Button href={smsHref(g.checkout.lateSms)} variant="secondary" className="!py-2.5 !px-6 !min-h-0">Request Late Checkout</Button>
        <Button href={smsHref(g.checkout.doneSms)} variant="primary" className="!py-2.5 !px-6 !min-h-0">I've Checked Out</Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Fill `#safety` in `GuestGuide.tsx`**

Add imports: `import CheckoutChecklist from '../components/guide/CheckoutChecklist';` and extend the lucide import with `Siren`.

```tsx
<GuideSection id="safety" index="05" eyebrow="Safety" title="Safety at Horizons"
  sub="Everyday information, precautions, and one-tap emergency help.">
  {/* Emergency */}
  <RevealOnScroll className="guide-card rounded-2xl border border-signal/40 bg-signal/5 p-6 md:flex md:items-center md:justify-between md:gap-6">
    <div className="flex items-start gap-4">
      <Siren size={22} strokeWidth={1.6} className="mt-1 shrink-0 text-signal" />
      <div>
        <p className="font-eyebrow text-sm text-ink">{g.safety.emergency.title}</p>
        <p className="mt-1 text-[14px] leading-relaxed text-ink2">{g.safety.emergency.body}</p>
      </div>
    </div>
    <div className="no-print mt-4 flex shrink-0 gap-2 md:mt-0">
      <a href="tel:911" className="eyebrow rounded-full bg-signal px-5 py-2.5 text-linen hover:bg-signal2 transition-colors">Call 911</a>
      <a href={telHref} className="eyebrow rounded-full border border-ink px-5 py-2.5 text-ink hover:bg-ink hover:text-bone transition-colors">Guest Support</a>
    </div>
  </RevealOnScroll>

  <RevealOnScroll variant="stagger-parent" className="mt-4 grid gap-3 sm:grid-cols-2">
    {g.safety.cards.map((c) => (
      <RevealOnScroll variant="stagger-child" key={c.title}>
        <div className="guide-card h-full rounded-xl border border-divider bg-white/40 p-5">
          <p className="font-eyebrow text-sm text-ink">{c.title}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink2">{c.body}</p>
        </div>
      </RevealOnScroll>
    ))}
  </RevealOnScroll>

  <RevealOnScroll className="mt-6">
    <ul className="grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
      {g.safety.facts.map((f) => (
        <li key={f} className="text-[13px] leading-relaxed text-ink2">— {f}</li>
      ))}
    </ul>
  </RevealOnScroll>
</GuideSection>
```

- [ ] **Step 3: Fill `#house-rules`**

```tsx
<GuideSection id="house-rules" index="06" eyebrow="House Rules" title="A calm place for everyone" band
  sub="A short list. Please treat the cabin the way you would want the next guest to treat it.">
  <RevealOnScroll variant="stagger-parent" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {g.rules.map((r, i) => (
      <RevealOnScroll variant="stagger-child" key={r.title}>
        <div className="guide-card h-full rounded-xl border border-divider bg-bone p-5">
          <p className="numeral text-signal">{String(i + 1).padStart(2, '0')}</p>
          <p className="mt-2 font-eyebrow text-sm text-ink">{r.title}</p>
          <p className="mt-1 text-[13px] leading-snug text-ink2">{r.note}</p>
        </div>
      </RevealOnScroll>
    ))}
  </RevealOnScroll>
</GuideSection>
```

- [ ] **Step 4: Fill `#checkout`**

```tsx
<GuideSection id="checkout" index="07" eyebrow="Checkout" title="Before you go" sub={g.checkout.sub}>
  <RevealOnScroll className="max-w-2xl">
    <CheckoutChecklist />
  </RevealOnScroll>
</GuideSection>
```

- [ ] **Step 5: Verify**

`npm run build` — success. Dev server `/guide`:
- Safety: emergency banner with 911 + support buttons; 4 cards; 6 facts.
- Rules: 9 numbered cards.
- Checkout: checkbox toggling updates "Progress n / 7"; reload page — state persists; both sms buttons open Messages with prefilled text (check `href` contains `?&body=`).

- [ ] **Step 6: Commit**

```bash
git add src/components/guide/CheckoutChecklist.tsx src/pages/GuestGuide.tsx
git commit -m "Guide: Safety, House Rules, and persistent Checkout checklist

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7: PlaceList (curated + expandable) — Local Guide, Things To Do, Medical

**Files:**
- Create: `src/components/guide/PlaceList.tsx`
- Modify: `src/pages/GuestGuide.tsx` (fill `#food`, `#things-to-do`, `#medical`)

**Interfaces:**
- Consumes: `GuideCategory`, `GuidePlace`, `mapsDir` (Task 1); `GuideSection` (Task 3).
- Produces: `PlaceList` props `{ categories: GuideCategory[] }`; exported `PlaceRow` component with props `{ place: GuidePlace }` (used directly for Medical hospitals).

- [ ] **Step 1: Create `src/components/guide/PlaceList.tsx`**

Key behaviors: chip per category; only the active category is *visible*, but all categories render in the DOM with `hidden print:block` so printing shows everything (Tailwind's `print:` variant); featured place gets a "Horizons Pick" card; remaining places sit behind a "Show all" toggle that also renders `hidden print:block` when collapsed.

```tsx
import { useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import RevealOnScroll from '../primitives/RevealOnScroll';
import { mapsDir, type GuideCategory, type GuidePlace } from '../data/guide';

export function PlaceRow({ place }: { place: GuidePlace }) {
  return (
    <div className="guide-card flex h-full flex-col rounded-xl border border-divider bg-white/40 p-5">
      <p className="font-eyebrow text-sm text-ink">{place.name}</p>
      <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-ink2">{place.blurb}</p>
      <div className="mt-3 flex items-end justify-between gap-3 border-t border-divider pt-3">
        <div>
          <p className="text-[12px] text-ink2">{place.address}</p>
          <p className="mt-0.5 eyebrow text-ink2">{place.distance} · {place.drive}</p>
        </div>
        <a
          href={mapsDir(`${place.name}, ${place.address}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="no-print eyebrow flex shrink-0 items-center gap-1 text-signal hover:text-signal2 transition-colors"
        >
          Directions <ArrowUpRight size={12} strokeWidth={2} />
        </a>
      </div>
    </div>
  );
}

export default function PlaceList({ categories }: { categories: GuideCategory[] }) {
  const [activeId, setActiveId] = useState(categories[0].id);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div>
      {/* Category chips */}
      <div className="no-print flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className={`eyebrow rounded-full px-4 py-2 transition-colors ${
              activeId === c.id ? 'bg-ink text-bone' : 'border border-ink/20 text-ink2 hover:bg-ink/5'
            }`}
            aria-pressed={activeId === c.id}
          >
            {c.label}
          </button>
        ))}
      </div>

      {categories.map((c) => {
        const featured = c.places[c.featured];
        const rest = c.places.filter((_, i) => i !== c.featured);
        const open = !!expanded[c.id];
        const isActive = activeId === c.id;

        return (
          <div key={c.id} className={isActive ? 'mt-8' : 'hidden print:block mt-8'}>
            {/* Category label shows in print, where chips are hidden */}
            <p className="print-show hidden eyebrow mb-3 text-ink2">{c.label}</p>

            {/* Featured pick */}
            <RevealOnScroll className="guide-card rounded-2xl border border-signal/30 bg-white/40 p-6">
              <p className="eyebrow text-signal">Horizons Pick</p>
              <h3 className="mt-2 font-display font-light text-ink text-[clamp(20px,2.4vw,28px)]" style={{ fontVariationSettings: '"SOFT" 30, "opsz" 32' }}>
                {featured.name}
              </h3>
              <p className="mt-2 max-w-text text-[14px] leading-relaxed text-ink2">{featured.blurb}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                <span className="eyebrow text-ink2">{featured.distance} · {featured.drive}</span>
                <span className="text-[12px] text-ink2">{featured.address}</span>
                <a
                  href={mapsDir(`${featured.name}, ${featured.address}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-print eyebrow flex items-center gap-1 text-signal hover:text-signal2 transition-colors"
                >
                  Directions <ArrowUpRight size={12} strokeWidth={2} />
                </a>
              </div>
            </RevealOnScroll>

            {/* The rest */}
            {rest.length > 0 && (
              <>
                <button
                  onClick={() => setExpanded((e) => ({ ...e, [c.id]: !e[c.id] }))}
                  className="no-print mt-4 flex items-center gap-1.5 eyebrow text-ink2 hover:text-ink transition-colors"
                  aria-expanded={open}
                >
                  {open ? 'Show less' : `Show all (${c.places.length})`}
                  <ChevronDown size={13} strokeWidth={2} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                <div className={open ? 'mt-4 grid gap-3 sm:grid-cols-2' : 'hidden print:grid mt-4 gap-3 sm:grid-cols-2'}>
                  {rest.map((p) => <PlaceRow key={p.name} place={p} />)}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Fill the three sections in `GuestGuide.tsx`**

Add import: `import PlaceList, { PlaceRow } from '../components/guide/PlaceList';`

```tsx
<GuideSection id="food" index="08" eyebrow="Local Guide" title="Nearby, curated" band
  sub="Where we send friends. One pick per category — tap “Show all” for the full list.">
  <PlaceList categories={g.localGuide} />
</GuideSection>

<GuideSection id="things-to-do" index="09" eyebrow="Things To Do" title="Explore the Sandhills"
  sub="Trails, parks, and quiet detours worth the drive.">
  <PlaceList categories={g.thingsToDo} />
</GuideSection>

<GuideSection id="medical" index="10" eyebrow="Medical" title="Care nearby" band sub={g.medical.note}>
  <RevealOnScroll className="mb-4">
    <div className="no-print flex gap-2">
      <a href="tel:911" className="eyebrow rounded-full bg-signal px-5 py-2.5 text-linen hover:bg-signal2 transition-colors">Call 911</a>
      <a href={telHref} className="eyebrow rounded-full border border-ink px-5 py-2.5 text-ink hover:bg-ink hover:text-bone transition-colors">Guest Support</a>
    </div>
  </RevealOnScroll>
  <RevealOnScroll className="grid gap-3 sm:grid-cols-2">
    {g.medical.hospitals.map((h) => <PlaceRow key={h.name} place={h} />)}
  </RevealOnScroll>
</GuideSection>
```

- [ ] **Step 3: Verify**

`npm run build` — success. Dev server `/guide`:
- Local Guide: 6 chips; switching chips swaps the featured card; "Show all (n)" expands the remaining places in a 2-col grid; every Directions link opens Google Maps with **that place** as destination (spot-check 2–3).
- Things To Do: 6 chips, same behavior; Hunter Run Farm featured under Hunting shows "3.6 mi · 5 min".
- Medical: two hospital cards + 911/support buttons.
- Print preview (Cmd+P): all categories and all places visible, chips/buttons hidden.

- [ ] **Step 4: Commit**

```bash
git add src/components/guide/PlaceList.tsx src/pages/GuestGuide.tsx
git commit -m "Guide: curated+expandable Local Guide, Things To Do, Medical

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8: Help/FAQ, farewell, docs, cleanup, final verification

**Files:**
- Modify: `src/pages/GuestGuide.tsx` (fill `#support`)
- Modify: `IMAGE_MAP.md` (document new image usages)
- Delete: `Guide HSH.docx` (untracked input file — user asked for its removal)

**Interfaces:**
- Consumes: `guideData.faq`, `guideData.farewell`, `telHref`, `smsHref`, `GUIDE_PHONE_DISPLAY` (Task 1). FAQ uses the native `<details>` styling already present in `index.css` (`details > summary`, `.chev`).

- [ ] **Step 1: Fill `#support` in `GuestGuide.tsx`**

```tsx
<GuideSection id="support" index="11" eyebrow="Help" title="Questions & guest support"
  sub="Common questions. If yours is not here, we are one tap away.">
  <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
    <RevealOnScroll>
      <div className="border-t border-divider">
        {g.faq.map((f) => (
          <details key={f.q} className="border-b border-divider py-4">
            <summary className="flex items-center justify-between gap-4">
              <span className="font-eyebrow text-sm text-ink">{f.q}</span>
              <span className="chev text-signal text-xl leading-none">+</span>
            </summary>
            <p className="mt-3 max-w-text text-[14px] leading-relaxed text-ink2">{f.a}</p>
          </details>
        ))}
      </div>
    </RevealOnScroll>

    <RevealOnScroll delay={0.15}>
      <div className="guide-card rounded-2xl border border-divider bg-white/40 p-6">
        <p className="eyebrow text-ink2">Guest Support</p>
        <p className="mt-2 font-display font-light text-ink text-xl">Still need a hand?</p>
        <p className="mt-1 text-[13px] leading-snug text-ink2">
          {g.meta.manager} is on call around the clock. Quick to answer, quick to help.
        </p>
        <div className="no-print mt-4 flex flex-col gap-2">
          <a href={telHref} className="eyebrow rounded-full bg-signal px-5 py-3 text-center text-linen hover:bg-signal2 transition-colors">Call {GUIDE_PHONE_DISPLAY}</a>
          <a href={smsHref()} className="eyebrow rounded-full border border-ink px-5 py-3 text-center text-ink hover:bg-ink hover:text-bone transition-colors">Text {GUIDE_PHONE_DISPLAY}</a>
          <a href={smsHref('Hi Daniil, I would like to report an issue at Horizons Sandhills: ')} className="eyebrow px-5 py-2 text-center text-ink2 hover:text-ink transition-colors">Report an Issue</a>
        </div>
      </div>
    </RevealOnScroll>
  </div>

  {/* Farewell */}
  <RevealOnScroll className="mt-16 border-t border-divider pt-10 text-center">
    <p className="font-display font-light italic text-ink text-[clamp(20px,2.6vw,30px)]" style={{ fontVariationSettings: '"SOFT" 50, "opsz" 72' }}>
      {g.farewell}
    </p>
  </RevealOnScroll>
</GuideSection>
```

- [ ] **Step 2: Update `IMAGE_MAP.md`**

Add a "Guest Guide page (/guide)" subsection documenting the two reused images:
- `/images/experience/01-sauna.webp` — GuideHero background (`src/components/guide/GuideHero.tsx`, `guideData.hero.photo` in `src/components/data/guide.ts`)
- `/images/villa/04_Sauna/1.webp` — Amenities featured card (`guideData.amenities.featured.photo`)

Note in each existing entry for these files that the guide page also uses them (per the file's own "keep updated" instruction).

- [ ] **Step 3: Delete the input docx**

```bash
rm "/Users/mbp/south_carolina/Guide HSH.docx"
```

(Untracked, so no git action needed — verify with `git status` that only intended files are staged/modified.)

- [ ] **Step 4: Full verification pass**

- `npm run lint` — expected: clean (fix any new-file warnings).
- `npm run build` — expected: success.
- Dev server, spec checklist:
  1. `/guide` renders all 11 sections with real content; chip nav anchors land under the sticky chrome (scroll-mt-32).
  2. Landing nav (desktop + mobile burger): Guide sits between Gallery and Reserve; from `/guide`, Stays/The Land/Reserve navigate to landing anchors; Gallery from `/guide` lands on `/` and opens the gallery modal; Book on `/guide` opens BookingModal.
  3. Landing unchanged: hero header choreography, gallery pill, scroll behavior.
  4. Checklist persists across reload; copy buttons work; print preview hides chrome and shows all places expanded; video loads on click.
  5. Reduced motion (macOS: System Settings → Accessibility → Display → Reduce motion): page renders fully static, all content visible.
- `git status` — confirm `package-lock.json` remains unstaged and `Guide HSH.docx` is gone.

- [ ] **Step 5: Commit**

```bash
git add src/pages/GuestGuide.tsx IMAGE_MAP.md
git commit -m "Guide: Help/FAQ section, farewell, IMAGE_MAP update

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Self-Review Notes

- **Spec coverage:** hero (T3), section nav + scrollspy (T3), Start Here incl. copy + print card (T4), Arrival + map + parking (T4), Cabin Access + video (T5), Amenities (T5), Safety (T6), Rules (T6), Checkout + localStorage + sms (T6), Local Guide + Things To Do curated/expandable (T7), Medical (T7), Help/FAQ + farewell (T8), StickyHeader variant + Guide link + `#gallery` handoff + Footer hrefs (T2), print styles (T3 CSS + `no-print`/`print:` usage throughout), title/scroll-top (T3), IMAGE_MAP + docx deletion (T8). Spec's "Footer farewell line" resolved as the section-11 closing line, per spec's own alternative.
- **Type consistency:** `GuideCategory.featured` is an index (number) everywhere; `PlaceRow` consumes `GuidePlace`; `smsHref(body?)`/`mapsDir(dest)` signatures match all call sites; `NAV_ITEMS` ids match `GuideSection` ids match spec anchors (`start`, `arrival`, `access`, `amenities`, `safety`, `house-rules`, `checkout`, `food`, `things-to-do`, `medical`, `support`).
- **Deviations from Lovable reference (intentional, spec-approved):** directions links target destinations; docx facts override prototype placeholders; dead links dropped; area intro blurbs for History omitted (spec marked them optional).
