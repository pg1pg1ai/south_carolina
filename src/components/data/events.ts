/**
 * /events — full-property private events landing page.
 * Copy follows the team brief (Google Doc "Horizons Sandhills - Events page", Nov 2026) with the owner's
 * answers of 2026-11-18: replies within an hour, 30% deposit locks in dates, $1,770/night all-inclusive
 * the Stage pavilion is not featured here. 2026-11-19: tax included, no minimum stay; day events
 * (no overnight stays) are the nightly rate less $50 per unit not cleaned: 6 villas + the Guest House.
 */

export const EVENT_TYPES = [
  'Corporate Retreat',
  'Wedding',
  'Family Reunion',
  'Wellness or Faith Retreat',
  'Birthday',
  'Bachelor or Bachelorette',
  'Private Celebration',
  'Other',
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const NIGHTLY_RATE = 1770;
export const DEPOSIT = '30%';
/** Day event: no cabins used, so no cleaning: $50 off for each of the 7 units. */
export const DAY_RATE = NIGHTLY_RATE - 7 * 50;
export const DAY_HOURS = '10 am to 10 pm';

export const eventsSeo = {
  title: 'Private Events & Full-Property Buyouts | Horizons Sandhills',
  description:
    'Book all of Horizons Sandhills for your retreat, wedding or celebration: 126 private acres, an 18-acre lake, two indoor event spaces and room for 32 overnight (100 with RVs). All-inclusive from $1,770 per night, tax included.',
};

export const hero = {
  eyebrow: 'Private events at Horizons Sandhills',
  lines: ['The Whole', 'Property Becomes'],
  accent: 'the Event.',
  sub: 'Retreats, celebrations and gatherings with the entire property to yourselves.',
  image: '/images/segments/heroes/birthday.webp',
};

export const facts = [
  { value: 126, label: 'Private acres' },
  { value: 18, suffix: ' ac', label: 'Private lake' },
  { value: 200, label: 'Day guests' },
  { text: '32/100', label: 'Overnight / with RVs' },
  { value: 2, label: 'Indoor spaces' },
  { text: '$1,770', label: 'Per night, tax included' },
] as const;

export const occasions = ['Corporate Retreats', 'Weddings', 'Family Reunions', 'Wellness & Faith Retreats', 'Birthday Weekends', 'Bachelor & Bachelorette', 'Private Celebrations'];

export const why = [
  { title: 'The property is yours.', body: 'The entire retreat is reserved for your group. No other guests, no shared spaces.' },
  { title: 'No neighbors. No noise curfew.', body: '126 private acres, no noise restrictions for groups.' },
  { title: 'Venue, stay and play.', body: 'Event spaces, villas, sauna and lake within walking distance.' },
  { title: 'On-site manager, 24/7.', body: 'Here around the clock, from arrival to checkout.' },
];

/** Five-star Google reviews supplied by the client (Oct 2026), wording verbatim — same source as GoogleReviewsWidget. */
export const reviews = [
  { name: 'Nadine C.', quote: 'Two colleagues and I booked a villa at Horizons Sandhills for our business planning retreat and it was the perfect place!' },
  { name: 'Amanda R.', quote: 'Had a wonderful weekend retreat with our family for a sweet glamping experience. All the nature none of the hassle!' },
  { name: 'Chelsea M.', quote: 'I don’t think I realized how much I needed a getaway like this until we arrived at Horizons Sandhills.' },
];

/** Event-format cards. `type` preselects the request form. The wedding card uses a lake photo until the
 *  team supplies a wedding shot. */
export const formats: { type: EventType; title: string; body: string; image: string }[] = [
  { type: 'Corporate Retreat', title: 'Corporate Retreats', body: 'The team connects with no one watching.', image: '/images/b2b/corporate-retreats.webp' },
  { type: 'Wedding', title: 'Weddings', body: 'Say your vows by the water. Celebrate under the stars.', image: '/images/sandhills/Guided_sunrise_paddle.webp' },
  { type: 'Family Reunion', title: 'Family Reunions', body: 'Every generation, finally under one roof.', image: '/images/b2b/family-reunions.webp' },
  { type: 'Wellness or Faith Retreat', title: 'Wellness & Faith Retreats', body: 'Space to slow down, with nothing pulling you back.', image: '/images/b2b/wellness-retreats.webp' },
  { type: 'Birthday', title: 'Birthday Weekends', body: 'Your celebration. Your timeline.', image: '/images/b2b/birthday-weekends.webp' },
  { type: 'Bachelor or Bachelorette', title: 'Bachelor & Bachelorette', body: 'Your crew, your rules, complete privacy.', image: '/images/b2b/bachelor-bachelorette.webp' },
  { type: 'Private Celebration', title: 'Private Celebrations', body: 'Enjoy the moment without sharing the space.', image: '/images/b2b/private-celebrations.webp' },
];

/**
 * Estate map spots. `pins` are ids from guideData.mapPins (positions as % of property-map.webp);
 * the Event Hall is the guide's "Kitchen & dining area", the Lounge its "Fireplace lounge deck"
 * (confirmed by the owner, 2026-11-18). Several pins (villas) are averaged into one marker.
 */
export const spaces = [
  { key: 'hall', pins: ['kitchen-dining'], cat: 'Indoor', title: 'The Event Hall', cap: 'Up to ~70 guests', body: 'Our largest indoor space, with a professional kitchen and restroom. For dinners, workshops, presentations and dance floors.' },
  { key: 'lounge', pins: ['fireplace-lounge-deck'], cat: 'Indoor', title: 'The Lounge', cap: 'Up to ~30 guests', body: 'A smaller indoor space with a restroom, fireplace lounge and a deck with grills. For breakout sessions, welcome drinks and cozy evenings.' },
  { key: 'gazebo', pins: ['gazebo'], cat: 'Outdoor', title: 'The Lakeside Gazebo', cap: 'Up to ~10 guests', body: 'Shaded seating right by the 18-acre lake. For ceremonies, toasts, morning practice and golden-hour photos.' },
  { key: 'dock', pins: ['dock'], cat: 'Outdoor', title: 'The Dock & Lake', cap: 'Swimming, kayaks, paddleboards', body: 'Water bikes too. For group activities and the lake days everyone remembers.' },
  { key: 'fields', pins: ['beach-sports-courts'], cat: 'Outdoor', title: 'The Fields', cap: 'Open lawn and sports fields', body: 'Beach volleyball, beach soccer, beach tennis and open space. For team games, tournaments and large outdoor setups.' },
  { key: 'villas', pins: ['forest-villa-1', 'forest-villa-2', 'forest-villa-3', 'forest-villa-4', 'forest-villa-5', 'forest-villa-6'], cat: 'Stay', title: '6 Forest Villas', cap: 'Up to 4 guests each', body: 'King bed and sofa bed, Brooklinen linens, a SMEG and Nespresso kitchen, a private deck with a Weber grill, cornhole, and e-bikes at the door.' },
  { key: 'house', pins: ['guest-house-1'], cat: 'Stay', title: 'The Guest House', cap: 'Up to 8 guests', body: 'Room for the organizers, the family elders or the people who want to stay up talking.' },
  { key: 'rv', pins: ['rv-hookups'], cat: 'Stay', title: '16 RV Hookups', cap: 'Up to 100 guests overnight', body: "Bringing a bigger group? We'll recommend a reliable RV vendor to keep everyone on-site." },
  { key: 'sauna', pins: ['sauna'], cat: 'Included', title: 'Sauna & Cold Plunge', cap: 'Groups of six', body: 'Heated to 194°F, right on the water. Take turns, then cool off by jumping off the dock into the lake.' },
] as const;

/** The map shows only the developed part of the aerial: this % box of property-map.webp. */
export const MAP_CROP = { x0: 30, y0: 38, x1: 86, y1: 100 };

export const activities = [
  { image: '/images/experience/01-sauna.webp', title: 'Wood-Fired Sauna & Cold Plunge', body: 'Heated to 194°F, right on the water. Take turns in groups of six, then cool off by jumping off the dock into the lake.', size: 'wide' },
  { image: '/images/experience/04-ready-for-the-water.webp', title: 'The Lake', body: '18 acres for swimming, fishing, kayaks, paddleboards and water bikes.', size: '' },
  { image: '/images/sandhills/twelve_miles.webp', title: 'Trails & E-Bikes', body: '12 miles of trails through the forest.', size: 'tall' },
  { image: '/images/experience/05-the-open-field.webp', title: 'Fields & Games', body: 'Beach volleyball, beach soccer, beach tennis, badminton, table tennis and cornhole.', size: '' },
  { image: '/images/experience/honey-from-the-land.webp', title: 'Hive Walks', body: 'Meet our bees and taste the honey from our own hives. By prior notice.', size: '' },
  { image: '/images/sandhills/fire_pit2.webp', title: 'Firepit Evenings', body: 'BBQ on the grill deck, a fire, and the night sky.', size: '' },
] as const;

export const steps = [
  { title: 'Tell us about your event.', body: 'Dates, number of guests, the occasion. In a couple of words, no commitment.' },
  { title: 'Talk to our team.', body: 'We call or message you within an hour to understand what you need.' },
  { title: 'Get your proposal.', body: "A clear quote for your dates, guest count, and the spaces you'll use." },
  { title: 'Lock in your dates.', body: `A ${DEPOSIT} deposit locks in your dates and the stay is all yours.` },
];

export const included = ['All 6 Forest Villas', 'The Guest House', 'The Event Hall and the Lounge', 'The lake, dock and fields', 'Sauna and cold plunge', '20+ complimentary activities'];

export const faq = [
  { q: 'How do I book the whole property?', a: 'Reserve all 6 Forest Villas and the property is yours during your dates. Group bookings are available year-round through our website or team: +1 (754) 667-9090.' },
  { q: 'How many guests can you host?', a: 'Up to 200 guests for day events and 32 overnight in our Villas and Guest House. With our 16 RV hookups, up to 100 guests can stay overnight.' },
  { q: 'What is included in the price?', a: 'Everything on the property: all 6 Forest Villas, the Guest House, both indoor event spaces, the grounds, the lake and 20+ complimentary activities. Tax is included, and there is no minimum stay. Day events without overnight stays are $1,420, from 10 am to 10 pm.' },
  { q: 'Do you have indoor event spaces?', a: 'Yes, two. One for up to 70 guests with a professional kitchen and restroom, and one for up to 30 guests with a restroom, fireplace lounge and grill deck.' },
  { q: 'Are there noise restrictions?', a: 'No. Horizons Sandhills has no neighbors and no noise restrictions for group reservations.' },
  { q: 'Is there someone on-site during our event?', a: 'Yes. Our property manager is on site 24/7.' },
  { q: 'What happens if it rains?', a: 'Every outdoor plan has an indoor backup: two indoor spaces are on the same property.' },
  { q: 'Can we bring our own caterer and vendors (decor, DJ, photographer)?', a: 'Yes, Horizons Sandhills accepts outside vendors.' },
  { q: 'Can we bring our own alcohol?', a: 'Yes, you can bring your own alcohol.' },
  { q: 'Do we need event insurance?', a: 'You would need event insurance dependent on the type of your event.' },
  { q: 'How do deposits and cancellations work?', a: `A ${DEPOSIT} deposit locks in your dates. Cancellation is free up to 7 days before the event. Cancelling between 4 and 7 days before arrival qualifies for a 50% refund. Cancellations less than 4 days before arrival are non-refundable, including taxes and fees.` },
  { q: 'Can we book just the event space, without staying overnight?', a: 'Yes. A day event gives you the whole property from 10 am to 10 pm for $1,420, tax included. The villas and the Guest House stay closed, which is why it costs less than a night.' },
  { q: 'What time is check-in?', a: 'Check-in is at 2 PM, and check-out is at 12 PM the following day. Early or late check-ins and check-outs can be accommodated with prior notice, subject to fees.' },
  { q: 'Can we bring pets?', a: 'Yes. Up to 3 pets per accommodation, $50 pet fee per stay. Pets stay leashed in common areas.' },
];
