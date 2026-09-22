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

export type MapCategory = 'stays' | 'parking' | 'amenities' | 'service' | 'nature';

// How-to videos shot by the client. Sources are the untracked .MOV originals in
// video-sources/; the web copies here are 720x1280 H.264 with audio — see IMAGE_MAP.md.
export const guideVideos = {
  keypad: { src: '/videos/keypad.mp4', poster: '/videos/keypad-poster.webp', title: 'How to use the front door keypad' },
  curtains: { src: '/videos/curtains.mp4', poster: '/videos/curtains-poster.webp', title: 'How to use the curtains' },
  firepit: { src: '/videos/firepit.mp4', poster: '/videos/firepit-poster.webp', title: 'How to use the fire pit' },
  grill: { src: '/videos/grill.mp4', poster: '/videos/grill-poster.webp', title: 'How to use the grill' },
  ebikes: { src: '/videos/e-bikes.mp4', poster: '/videos/e-bikes-poster.webp', title: 'How to use the e-bike' },
  deckUmbrella: { src: '/videos/deck-umbrella.mp4', poster: '/videos/deck-umbrella-poster.webp', title: 'How to use the deck umbrella' },
  pelletGrill: { src: '/videos/pellet-grill.mp4', poster: '/videos/pellet-grill-poster.webp', title: 'How to use the pellet grill' },
} as const;

export type VideoKey = keyof typeof guideVideos;

/** One line in an amenity list. `video` attaches a how-to tile under the list. */
export interface AmenityItem {
  text: string;
  video?: VideoKey;
}

export interface AmenityGroup {
  title: string;
  /** Sentence above the list. */
  intro?: string;
  items?: AmenityItem[];
  /** Prose-only groups use paras instead of items. */
  paras?: string[];
  /** Sentence below the list. */
  outro?: string;
  /** Callout card under the group, e.g. the Lounge Deck's free private reservation. */
  highlight?: { label: string; value: string; note: string };
}

export interface AmenityBlockData {
  kicker: string;
  title: string;
  sub: string;
  intro?: string;
  groups: AmenityGroup[];
  note?: string;
  safety?: string[];
}

export interface MapPin {
  id: string;
  label: string;
  category: MapCategory;
  /** Percentage of the map image's width, 0–100. */
  x: number;
  /** Percentage of the map image's height, 0–100. */
  y: number;
}

// Chip colours are raw hex rather than Tailwind classes because the pin dots are
// rendered as inline styles inside a transformed layer.
export const mapCategories: { id: MapCategory; label: string; color: string }[] = [
  { id: 'stays', label: 'Stays', color: '#1F2420' },
  { id: 'amenities', label: 'Amenities', color: '#B05329' },
  { id: 'parking', label: 'Parking & Arrival', color: '#3E4F3A' },
  { id: 'service', label: 'Service', color: '#A67C52' },
  { id: 'nature', label: 'Nature', color: '#2A3A2A' },
];

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
      checkIn: { label: 'Check-in', value: '2:00 PM', note: '' },
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
      'Park in the designated parking space.',
      'Guests are not permitted to drive on premises.',
      'Continue past the gate to your assigned parking lot. The gate code is 6619.',
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

  // Pin coordinates are derived from map.pdf's text layer: each label's centre in
  // page space, transformed by x/1440*100 and (y-66.6)/662.25*100 into
  // percentages of the map image's box. They are only valid for the current
  // property-map.webp — see IMAGE_MAP.md before replacing it.
  mapPins: [
    { id: 'forest-villa-1', label: 'Forest Villa 1', category: 'stays', x: 54.88, y: 82.43 },
    { id: 'forest-villa-2', label: 'Forest Villa 2', category: 'stays', x: 54.37, y: 77.84 },
    { id: 'forest-villa-3', label: 'Forest Villa 3', category: 'stays', x: 53.23, y: 73.76 },
    { id: 'forest-villa-4', label: 'Forest Villa 4', category: 'stays', x: 53.05, y: 86.09 },
    { id: 'forest-villa-5', label: 'Forest Villa 5', category: 'stays', x: 50.55, y: 82.43 },
    { id: 'forest-villa-6', label: 'Forest Villa 6', category: 'stays', x: 48.49, y: 77.84 },
    { id: 'guest-house-1', label: 'Guest House 1', category: 'stays', x: 71.34, y: 87.01 },
    { id: 'guest-house-2', label: 'Guest House 2', category: 'stays', x: 58.65, y: 83.41 },
    { id: 'rv-hookups', label: 'RV hookups', category: 'stays', x: 77.40, y: 57.17 },
    { id: 'parking-a', label: 'Parking A — EV chargers', category: 'parking', x: 49.93, y: 89.30 },
    { id: 'parking-b', label: 'Parking B', category: 'parking', x: 51.86, y: 90.33 },
    { id: 'parking-c', label: 'Parking C', category: 'parking', x: 55.33, y: 89.62 },
    { id: 'parking-d', label: 'Parking D — overflow', category: 'parking', x: 52.53, y: 93.23 },
    { id: 'main-sign', label: 'Main sign', category: 'parking', x: 1.89, y: 80.54 },
    { id: 'sauna', label: 'Sauna', category: 'amenities', x: 40.46, y: 72.07 },
    { id: 'gazebo', label: 'Gazebo & cold plunge', category: 'amenities', x: 40.46, y: 77.75 },
    { id: 'outdoor-shower', label: 'Outdoor shower', category: 'amenities', x: 38.00, y: 72.34 },
    { id: 'dock', label: 'Dock', category: 'amenities', x: 38.47, y: 68.96 },
    { id: 'pool', label: 'Pool', category: 'amenities', x: 71.39, y: 65.29 },
    { id: 'pool-pavillion', label: 'Pool pavillion', category: 'amenities', x: 72.33, y: 70.64 },
    { id: 'beach-sports-courts', label: 'Beach sports courts', category: 'amenities', x: 71.20, y: 76.36 },
    // Offset from its label (y 65.81) so the pin covers a leftover Google
    // "saved place" marker on the same building.
    { id: 'stage-pavillion', label: 'Stage pavillion', category: 'amenities', x: 85.34, y: 61.60 },
    { id: 'kitchen-dining', label: 'Kitchen & dining area', category: 'amenities', x: 64.03, y: 80.59 },
    { id: 'fireplace-lounge-deck', label: 'Fireplace lounge deck', category: 'amenities', x: 66.50, y: 90.77 },
    { id: 'crabird-sculpture', label: 'Crabird sculpture', category: 'amenities', x: 66.06, y: 85.75 },
    { id: 'apiary', label: 'Apiary', category: 'amenities', x: 98.19, y: 73.85 },
    { id: 'front-desk', label: 'Front desk', category: 'service', x: 65.23, y: 89.78 },
    { id: 'managers-house', label: "Manager's house", category: 'service', x: 64.03, y: 89.42 },
    { id: 'laundry-room', label: 'Laundry room', category: 'service', x: 63.78, y: 71.21 },
    { id: 'storage-west', label: 'Storage — west', category: 'service', x: 49.53, y: 68.84 },
    { id: 'storage-east', label: 'Storage — east', category: 'service', x: 73.22, y: 45.68 },
    { id: 'water-shed-west', label: 'Water shed — west', category: 'service', x: 55.49, y: 65.97 },
    { id: 'water-shed-east', label: 'Water shed — east', category: 'service', x: 67.01, y: 73.46 },
    { id: 'pool-shed', label: 'Pool shed', category: 'service', x: 71.20, y: 61.73 },
    { id: 'mclean-pond', label: 'McLean Pond', category: 'nature', x: 35.03, y: 62.17 },
    { id: 'mt-prong-creek', label: 'Mt Prong Creek', category: 'nature', x: 52.78, y: 12.59 },
  ] as MapPin[],

  knowBeforeVisit: [
    {
      title: 'Security Deposit',
      note: 'A $300 refundable security deposit is required and will be returned within 5–10 business days after check-out, provided no damages inflicted by guests are found during the property inspection.',
    },
    {
      title: 'ID Requirement',
      note: 'A valid physical ID is required at check-in for reservation verification and waiver signatures.',
    },
    {
      title: 'Pets',
      note: 'Max. 3 per cabin with a $60 pet fee per cabin. Pets must be leashed in common areas. Please inform us in advance if you are bringing any. To ensure guest comfort and prevent snakes and pests from entering the facility, the territory is treated with a repellent — if consumed by pets, it may induce sickness.',
    },
  ],

  access: {
    steps: [
      { title: 'Enter the premises and park in the designated parking space', body: 'Follow Woodmen Rd to the property entrance. Signage marks the turn in.' },
      { title: 'Our manager Daniil will help with navigating your forest villa', body: 'Use the luggage carts to help you pull your suitcases to your forest villa.' },
      { title: 'Use your keypad or key', body: 'The 4-digit code will be shared with you by Daniil at check-in.' },
      { title: 'Enter, breathe, settle in', body: 'Take a moment on the porch. Let the trip melt off your shoulders.' },
      { title: 'Lock behind you', body: 'When leaving, close all doors and lock up.' },
    ],
    video: 'keypad' as VideoKey,
    trouble: {
      title: 'Trouble with the code?',
      body: 'Do not force the lock. Wait thirty seconds and try again. Still stuck? Call Guest Support and we will help right away.',
    },
  },

  amenities: {
    // Four blocks, in the order the client asked for: the villa, the water
    // (sauna included), the lounge deck, then the sports area.
    villa: {
      kicker: 'The Forest Villa',
      title: "What's in Your Forest Villa",
      sub: 'Everything you need for a comfortable stay',
      groups: [
        {
          title: 'Kitchenette',
          intro: 'Your Forest Villa includes a fully equipped kitchenette with:',
          items: [
            { text: 'Nespresso coffee machine with milk frother' },
            { text: 'Complimentary Nespresso coffee capsules — 1 capsule per adult guest, per night of the reservation, replenished daily' },
            { text: 'Complimentary Fiji water' },
            { text: 'Sea salt and pepper grinders' },
            { text: 'Olive oil' },
            { text: 'Honey and sugar' },
            { text: 'Premium SMEG kitchenware' },
            { text: 'Utensils' },
            { text: 'Dishes and glassware' },
            { text: 'Microwave' },
            { text: 'Full-size refrigerator' },
          ],
        },
        {
          title: 'Sleeping Area',
          items: [
            { text: 'King-size bed' },
            { text: 'Queen-size sofa bed' },
            { text: 'Additional bedding for the queen-size sofa bed is stored in the lower compartments of the king bed' },
            { text: 'Automatic curtains', video: 'curtains' },
            { text: 'Robe for each adult guest' },
          ],
        },
        {
          title: 'Bathroom',
          items: [
            { text: 'Complimentary toiletries' },
            { text: 'Hairdryer' },
            { text: 'Clothing steamer' },
          ],
        },
        {
          title: 'Additional In-Villa Amenities',
          intro: 'For your convenience, the villa also includes:',
          items: [
            { text: 'Flashlight' },
            { text: '2 helmets' },
            { text: 'Dog bowl for your pet' },
            { text: 'Bug zapper' },
            { text: '2 umbrellas' },
            { text: 'Marshall speaker' },
          ],
        },
        {
          title: 'Outside Your Forest Villa',
          intro: 'Each Forest Villa also includes access to:',
          items: [
            { text: 'Private fire pit', video: 'firepit' },
            { text: 'Grill', video: 'grill' },
            { text: 'E-bikes', video: 'ebikes' },
            { text: 'Deck umbrella', video: 'deckUmbrella' },
            { text: 'Cornhole game' },
          ],
        },
      ],
      note: 'Please return all provided items to the villa after use and leave outdoor equipment in its designated area.',
    } as AmenityBlockData,

    water: {
      kicker: 'The Water',
      title: 'Lake & Lounge Guidelines',
      sub: 'Relax, explore, and share the lake with care',
      groups: [
        {
          title: 'Lake Activities',
          intro: 'Guests are welcome to enjoy a variety of activities at the lake, including:',
          items: [
            { text: 'Kayaks' },
            { text: 'Paddleboards' },
            { text: 'Water bikes' },
            { text: 'Fishing' },
            { text: 'Swimming' },
            { text: 'Sauna' },
          ],
        },
        {
          title: 'Recreation Equipment',
          paras: [
            'To make sure all guests have an opportunity to enjoy the lake, kayaks, paddleboards, and water bikes may be used for up to 1 hour at a time.',
            'After your session, please return the equipment to its designated area and make it available for other guests.',
            'If no other guests are waiting, you are welcome to use the equipment again.',
          ],
        },
        {
          title: 'Shared Lounge Area',
          paras: [
            'The lakeside lounge and relaxation area is a shared amenity for all guests staying at the property.',
            'The area includes outdoor lounge furniture and spaces designed for relaxing and enjoying the lake. We kindly ask guests to be considerate of others and avoid reserving furniture or shared spaces when they are not actively being used.',
          ],
        },
        {
          title: 'Fishing & Swimming',
          paras: [
            'Fishing and swimming are available to property guests during their stay. Guests are encouraged to bring their own fishing rods and bait if willing to fish.',
            'Please be mindful of other guests using the lake and maintain a safe distance from kayaks, paddleboards, water bikes, and fishing areas.',
          ],
        },
      ],
      safety: [
        'Use the lake, swimming areas, and recreational equipment at your own risk.',
        'Children must be supervised by an adult at all times.',
        'Life jackets should be worn while using kayaks, paddleboards, and water bikes.',
        'Please return all recreational equipment after use.',
        'Do not leave equipment unattended in the water.',
        'Please respect other guests and keep noise to a reasonable level.',
        'No glass containers near or on the water.',
        'Please keep the lake and lounge areas clean and dispose of trash properly.',
        'Management reserves the right to limit lake or equipment access due to weather, maintenance, water conditions, or safety considerations.',
      ],
    } as AmenityBlockData,

    loungeDeck: {
      kicker: 'The Lounge Deck',
      title: 'Lounge Deck Guidelines',
      sub: 'Gather, grill, and relax with care',
      groups: [
        {
          title: 'Shared Lounge Deck',
          intro: 'The Lounge Deck is a shared amenity available to all guests staying at the property. The deck includes:',
          items: [
            { text: 'Fireplace' },
            { text: 'Large grill' },
            { text: 'Pellet grill', video: 'pelletGrill' },
            { text: 'Lounge seating' },
          ],
          outro: 'We kindly ask guests to be considerate of others and share the space so everyone has an opportunity to enjoy it.',
        },
        {
          title: 'Private Group Reservations',
          paras: [
            'Groups of 10 or more guests may reserve the Lounge Deck exclusively for their group at no additional charge.',
            'Please notify the property manager in advance so a complimentary reservation can be arranged.',
            'Outside of a reserved private session, the Lounge Deck remains a shared space available to all property guests.',
          ],
          highlight: {
            label: 'Complimentary Private Reservation',
            value: 'Up to 4 hours',
            note: 'Groups of 10+ · Subject to availability',
          },
        },
        {
          title: 'Grills & Fireplace',
          paras: [
            'Guests are welcome to use the fireplace, large grill, and pellet grill during their stay.',
            'Please use all equipment responsibly and follow any operating instructions provided. After use, please leave the grilling and seating areas clean and ready for the next guests.',
          ],
        },
      ],
      safety: [
        'Use the fireplace and grills responsibly and at your own risk.',
        'Children must be supervised by an adult around the fireplace and cooking equipment.',
        'Never leave an active fire or grill unattended.',
        'Please keep flammable items away from the fireplace and grills.',
        'Please respect other guests and keep noise to a reasonable level.',
        'Do not reserve tables or seating when they are not actively being used.',
        'Please dispose of trash and food waste properly after use.',
        'Management reserves the right to limit use of the deck, fireplace, or grills due to weather, maintenance, or safety considerations.',
      ],
    } as AmenityBlockData,

    sports: {
      kicker: 'The Sports',
      title: 'Sports Area Guidelines',
      sub: 'Play, compete, and share the space with care',
      intro: 'Guests are welcome to enjoy a variety of outdoor sports throughout the property.',
      groups: [
        {
          title: 'Sand Sports Area',
          intro: 'The sand court can be used for:',
          items: [
            { text: 'Beach volleyball' },
            { text: 'Beach soccer' },
            { text: 'Beach tennis' },
            { text: 'Beach badminton' },
          ],
          outro: 'Ask the manager for game inventory.',
        },
        {
          title: 'Table Tennis',
          paras: ['Two outdoor table tennis tables are available for guests. Ask the manager for rackets.'],
        },
        {
          title: 'Shared Sports Areas',
          paras: [
            'All sports areas and equipment are shared amenities available to guests staying at the property.',
            'Please be considerate of other guests waiting to play and avoid occupying a court, field, or table for an extended period when others would like to use it.',
            'After playing, please return balls, paddles, rackets, and other equipment to their designated storage areas.',
          ],
        },
      ],
      safety: [
        'Use all sports areas and equipment at your own risk.',
        'Children must be supervised by an adult.',
        'Please wear appropriate footwear for each activity.',
        'Be mindful of other guests and maintain a safe distance from nearby games and activities.',
        'Please do not remove sports equipment from its designated activity area.',
        'Return all equipment after use.',
        'Please keep the sports areas clean and dispose of trash properly.',
        'Respect other guests and keep noise to a reasonable level.',
        'Management reserves the right to limit access to sports areas or equipment due to weather, maintenance, or safety considerations.',
      ],
    } as AmenityBlockData,

    featured: {
      name: 'Cedar Barrel Sauna',
      photo: '/images/guide/sauna.webp',
      kicker: 'Featured amenity',
      body: 'Wood fired and tucked between the pines. Give it fifteen minutes to warm up, then let the forest do the rest.',
      // NOTE: capacity value carried over from the client's prototype — flagged for client verification.
      stats: [
        { label: 'Warmup', value: '15 min' },
        { label: 'Capacity', value: '15 people' },
        { label: 'Best time', value: 'Dusk' },
      ],
    },
    saunaGuidelines: {
      hours: '5:00 PM – 10:00 PM, daily',
      heatingNote: 'To avoid unnecessary heating, we prepare the sauna only when guests would like to use it. Please let our team know if you are interested, and we will be happy to get it ready. 1 (one) complimentary sauna session is included in your stay within the operating hours.',
      sharedNote: 'During regular operating hours, the sauna is a shared amenity available to all guests staying at the property. We kindly ask everyone to be respectful of other guests and help us create a relaxing atmosphere for all.',
      privateNote: 'If you would like to enjoy the sauna exclusively for yourself, your family, or your group outside of regular operating hours, private sessions may be available. Please speak with a manager in advance to arrange a private booking.',
      privateSession: { label: 'Private Session', duration: 'Up to 2 hours', price: '$250', note: 'Subject to availability' },
      extension: { label: 'Extension', duration: 'Additional 2 hours', price: '$250', note: 'Subject to availability' },
      safety: [
        'Use the sauna at your own risk.',
        'Stay hydrated and take breaks as needed.',
        'Children must be supervised by an adult at all times.',
        'Please respect other guests and keep noise to a minimum.',
        'No glass containers inside the sauna.',
        'Management reserves the right to limit sauna access due to weather, maintenance, or safety considerations.',
      ],
    },
  },

  rules: [
    { title: 'Quiet Hours', note: '10 PM to 8 AM. We share the woods with neighbors and wildlife.' },
    { title: 'Indoor Smoking & Vaping', note: 'Not permitted anywhere on the property. $350 fine per violation.' },
    { title: 'Visitors', note: 'Overnight guests are limited to booked occupancy. Our forest villa accommodates up to 4 people. Our guest house accommodates up to 8 people. To bring a child under 5 y.o. into the same residence, choose this fee. Limited to two additional children under 5 y.o. per reservation.' },
    { title: 'Grill', note: 'Please clean the grill after use to avoid a $50 cleaning fee deducted from your deposit.' },
    { title: 'Parties & Events', note: 'Not permitted without prior written approval.' },
    { title: 'Parking', note: 'Use your assigned parking area only.' },
    { title: 'First-Aid Kit', note: 'A basic First-Aid Kit is available on property. Please ask Daniil for help locating it. For life-threatening emergencies, please call 911.' },
    { title: 'Baby Crib & Bedding', note: 'If you are traveling with a child under 3 years old and are in need of a crib and bedding, please ask Daniil for complimentary installation in your room.' },
    { title: 'Nature', note: 'Please do not disturb wildlife or vegetation.' },
  ],

  // The Checkout section was removed; what remains feeds the hero's Checkout card.
  checkout: {
    time: '12:00 PM',
    lateNote: 'Late checkout is available on request, depending on availability. An extra fee of 10% of the nightly rate applies.',
    lateSms: 'Hi Daniil, we would like to request a late checkout for our stay at Horizons Sandhills. Is that possible?',
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
    { q: 'Can I request late checkout?', a: 'Yes — tap Request Late Checkout on the Checkout card at the top of this page. It depends on availability, and an extra fee of 10% of the nightly rate applies.' },
    { q: 'Are pets allowed?', a: 'Please confirm the pet policy with Guest Support before arriving with animals.' },
    { q: 'What should I do if the power goes out?', a: 'Check the breaker panel first, then contact Guest Support if power does not return.' },
    { q: "What should I do if I'm locked out?", a: 'Call Guest Support. We can share access instructions or send help.' },
    { q: 'How do I report maintenance issues?', a: 'Call or text Guest Support, or tap Report an Issue in this section.' },
  ],

  farewell: 'Rest well. Explore slowly. Enjoy the Sandhills.',
};
