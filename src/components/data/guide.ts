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
    photo: '/images/guide/hero-sandhills-lake.webp',
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
