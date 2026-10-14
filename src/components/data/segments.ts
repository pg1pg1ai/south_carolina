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
  {
    slug: 'girls-weekend',
    leadLabel: "Girls' Weekend",
    seo: {
      title: "Girls' Weekend — Horizons Sandhills",
      description: 'A few days away with your favorite people in a place worth leaving the city for.',
    },
    hero: {
      kicker: "Girls' weekend at Horizons Sandhills",
      headline: 'The trip that finally made it out of the chat',
      sub: 'A few days away with your favorite people in a place worth leaving the city for.',
      cta: 'Plan your getaway',
      photo: heroPhoto('girls-weekend'),
    },
    amenities: {
      heading: 'Everything you need for a great weekend',
      cards: [
        { key: 'villa',    title: 'Private forest villa',  line: 'Five-star comfort with plenty of space to stay together.' },
        { key: 'lake',     title: 'Private lake',          line: 'Swim, kayak or paddleboard whenever you feel like it.' },
        { key: 'sauna',    title: 'Wood-fired sauna',      line: 'Unwind in a private sauna surrounded by the forest.' },
        { key: 'firepit',  title: 'Your own firepit',      line: 'Drinks, dinner, and long evenings around the fire.' },
        { key: 'ebikes',   title: 'E-bikes & trails',      line: 'A way to explore the property at your own pace.' },
        { key: 'acres',    title: '126 acres of nature',   line: 'Privacy, open space, and plenty of room to make the weekend your own.' },
      ],
    },
    video: {
      heading: 'Picture your weekend here',
      shorts: ['nxsh-EK2n8Y', 'oYPDdrlIlas', '1QG9txDjufw'],
    },
    finalCta: {
      headline: 'Stop talking about the trip. Take it.',
      cta: 'Plan your getaway',
    },
  },
  {
    slug: 'bachelorette',
    leadLabel: 'Bachelorette Weekend',
    seo: {
      title: 'Bachelorette Weekend — Horizons Sandhills',
      description: 'One place for the whole group to stay, celebrate, and spend the weekend together.',
    },
    hero: {
      kicker: 'Bachelorette weekend at Horizons Sandhills',
      headline: 'The bride gets more than a night out',
      sub: 'One place for the whole group to stay, celebrate, and spend the weekend together.',
      cta: 'Plan the bachelorette',
      photo: heroPhoto('bachelorette'),
    },
    amenities: {
      heading: 'Your weekend, already planned',
      cards: [
        { key: 'villa',       title: 'Private forest villas',  line: 'Five-star comfort designed for a group getaway.' },
        { key: 'lake',        title: 'Private lake',           line: 'Get the whole group out on kayaks and paddleboards.' },
        { key: 'sauna',       title: 'Wood-fired sauna',       line: 'Unwind together with a sauna session surrounded by forest.' },
        { key: 'firepit',     title: 'Your own firepit',       line: 'Your spot for drinks, stories, and late nights by the fire.' },
        { key: 'photoReady',  title: 'Photo-ready setting',    line: 'Forest, lake, and villas that look good from every angle.' },
        { key: 'acres',       title: '126 acres of nature',    line: 'Plenty of privacy to celebrate without an audience.' },
      ],
    },
    video: {
      heading: 'Bachelorette weekends at Horizons',
      shorts: ['nxsh-EK2n8Y', 'oYPDdrlIlas', 'CBvF-nFf7PE'],
    },
    finalCta: {
      headline: 'Make her bachelorette a getaway',
      cta: 'Plan the weekend',
    },
  },
  {
    slug: 'birthday',
    leadLabel: 'Birthday Getaway',
    seo: {
      title: 'Birthday Getaway — Horizons Sandhills',
      description: 'Bring your favorite people and turn your birthday into a weekend away together.',
    },
    hero: {
      kicker: 'Birthday getaway at Horizons Sandhills',
      headline: 'Skip the dinner reservation. Take the weekend.',
      sub: 'Bring your favorite people and turn your birthday into a weekend away together.',
      cta: 'Plan your birthday',
      photo: heroPhoto('birthday'),
    },
    amenities: {
      heading: 'More than a place to celebrate',
      cards: [
        { key: 'villa',    title: 'Private forest villas',  line: 'Five-star comfort with space for your favorite people.' },
        { key: 'lake',     title: 'Private lake',           line: 'Kayaks, paddleboards, and plenty of time on the water.' },
        { key: 'sauna',    title: 'Wood-fired sauna',       line: 'A private sauna session for you and your group.' },
        { key: 'firepit',  title: 'Your own firepit',       line: 'Drinks, cake, and late nights around the fire.' },
        { key: 'ebikes',   title: 'E-bikes & trails',       line: 'Explore the property between birthday plans.' },
        { key: 'acres',    title: '126 acres of nature',    line: 'Privacy and space to celebrate your way.' },
      ],
    },
    video: {
      heading: 'Birthdays at Horizons',
      shorts: ['QmYK8gLA3IU', 'IGZnO8Y21zU', 'TPL7NC1MhI0'],
    },
    finalCta: {
      headline: 'Your birthday deserves more than one night',
      cta: 'Plan your birthday',
    },
  },
  {
    slug: 'celebrations',
    leadLabel: 'Celebration Getaway',
    seo: {
      title: 'Celebration Getaway — Horizons Sandhills',
      description: 'Birthdays, engagements, anniversaries, graduations, and everything worth gathering for.',
    },
    hero: {
      kicker: 'Celebration getaway at Horizons Sandhills',
      headline: 'Turn any celebration into a weekend away',
      sub: 'Birthdays, engagements, anniversaries, graduations, and everything worth gathering for.',
      cta: 'Plan your celebration',
      photo: heroPhoto('celebrations'),
    },
    amenities: {
      heading: 'A place worth celebrating in',
      cards: [
        { key: 'villa',    title: 'Private forest villas',  line: 'Five-star comfort with space for your closest people.' },
        { key: 'lake',     title: 'Private lake',           line: 'Kayaks, paddleboards, and a lake to enjoy together.' },
        { key: 'sauna',    title: 'Wood-fired sauna',       line: 'A private sauna session for your group.' },
        { key: 'firepit',  title: 'Your own firepit',       line: 'Drinks, dinner, and the celebration after dark.' },
        { key: 'ebikes',   title: 'E-bikes & trails',       line: 'Plenty to do between the main plans.' },
        { key: 'acres',    title: '126 acres of nature',    line: 'Privacy and space for the occasion to feel your own.' },
      ],
    },
    video: {
      heading: 'Celebrations at Horizons',
      shorts: ['QmYK8gLA3IU', 'IGZnO8Y21zU', 'CBvF-nFf7PE'],
    },
    finalCta: {
      headline: 'Turn your special occasion into a getaway.',
      cta: 'Plan your celebration',
    },
  },
  {
    slug: 'wellness-retreat',
    leadLabel: 'Wellness Retreat',
    seo: {
      title: 'Wellness Retreat — Horizons Sandhills',
      description: 'For coaches and communities hosting small-group wellness experiences.',
    },
    hero: {
      kicker: 'Wellness retreats at Horizons Sandhills',
      headline: 'One place for the whole retreat',
      sub: 'For coaches and communities hosting small-group wellness experiences.',
      cta: 'Plan your retreat',
      photo: heroPhoto('wellness-retreat'),
    },
    amenities: {
      heading: 'Everything in one place for your retreat',
      cards: [
        { key: 'villa',    title: 'Private forest villas',  line: 'Keep the whole group together throughout the stay.' },
        { key: 'lake',     title: 'Private lake',           line: 'Use the water for swimming, paddling or guided sessions.' },
        { key: 'sauna',    title: 'Wood-fired sauna',       line: 'Build sauna and recovery into the program.' },
        { key: 'trails',   title: 'Trails & open grounds',  line: 'Space for movement, walks, and outdoor practices.' },
        { key: 'firepit',  title: 'Private firepits',       line: 'A natural setting for evening circles and conversations.' },
        { key: 'acres',    title: '126 private acres',      line: 'Run the full program with privacy and no outside crowds.' },
      ],
    },
    video: {
      heading: 'Wellness retreats at Horizons Sandhills',
      shorts: ['CBvF-nFf7PE', '7oEtvlNe5K4', 'BV1gqM_Aci8'],
    },
    finalCta: {
      headline: "You bring the program. We'll provide the setting.",
      cta: 'Plan your retreat',
    },
  },
  {
    slug: 'corporate-retreat',
    leadLabel: 'Corporate Retreat',
    seo: {
      title: 'Corporate Retreat — Horizons Sandhills',
      description: 'A private place to spend a few days together, get outside, and enjoy a real change of scenery.',
    },
    hero: {
      kicker: 'Corporate retreats at Horizons Sandhills',
      headline: 'Get the team out of the office',
      sub: 'A private place to spend a few days together, get outside, and enjoy a real change of scenery.',
      cta: 'Plan your retreat',
      photo: heroPhoto('corporate-retreat'),
    },
    amenities: {
      heading: 'Built for more than a team dinner',
      cards: [
        { key: 'villa',           title: 'Private forest villas',  line: 'Five-star comfort so the whole team can stay on property.' },
        { key: 'lake',            title: 'Private lake',           line: 'Kayaks and paddleboards for getting everyone out on the water.' },
        { key: 'teamActivities',  title: 'Team activities',        line: 'Volleyball, soccer, e-bikes, and plenty more to do together.' },
        { key: 'firepit',         title: 'Private firepits',       line: 'A place to unwind together after a full day.' },
        { key: 'trails',          title: 'Trails & open grounds',  line: 'Plenty of room to walk, explore, and spend time outside.' },
        { key: 'acres',           title: '126 private acres',      line: "All the space and privacy you won't get at a hotel." },
      ],
    },
    video: {
      heading: 'Team retreats at Horizons',
      shorts: ['CBvF-nFf7PE', 'd_X7zP-uHFc', 'IGZnO8Y21zU'],
    },
    finalCta: {
      headline: 'Skip the usual offsite. Do something different.',
      cta: 'Plan your retreat',
    },
  },
  {
    slug: 'group',
    leadLabel: 'Group Getaway',
    seo: {
      title: 'Group Getaway — Horizons Sandhills',
      description: 'Premium forest villas, private grounds, and experiences the whole group can enjoy together.',
    },
    hero: {
      kicker: 'Group getaway at Horizons Sandhills',
      headline: 'Bring the whole crew. Stay for the weekend.',
      sub: 'Premium forest villas, private grounds, and experiences the whole group can enjoy together.',
      cta: 'Plan your getaway',
      photo: heroPhoto('group'),
    },
    amenities: {
      heading: 'Everything for the weekend, all in one place',
      cards: [
        { key: 'villa',    title: 'Private forest villas',  line: 'Five-star comfort in modern forest villas.' },
        { key: 'lake',     title: 'Private lake',           line: 'Swim, kayak, and paddleboard right on site.' },
        { key: 'sports',   title: 'Sports & games',         line: 'Volleyball, soccer, and open space for casual games.' },
        { key: 'ebikes',   title: 'E-bikes & trails',       line: 'Ride the trails and explore the forest together.' },
        { key: 'firepit',  title: 'Private firepits',       line: 'Dinner, drinks, and late nights around the fire.' },
        { key: 'acres',    title: '126 acres of nature',    line: 'Wide-open space for activities, walks and downtime.' },
      ],
    },
    video: {
      heading: 'Group getaways at Horizons Sandhills',
      shorts: ['jd28Bxx-kCc', 'd_X7zP-uHFc', 'CWRL03sH5ok'],
    },
    finalCta: {
      headline: 'Your next group getaway starts at Horizons Sandhills',
      cta: 'Plan your getaway',
    },
  },
  {
    slug: 'solo',
    leadLabel: 'Solo Getaway',
    seo: {
      title: 'Solo Getaway — Horizons Sandhills',
      description: 'A private stay with the freedom to spend your time exactly how you want.',
    },
    hero: {
      kicker: 'Solo getaway at Horizons Sandhills',
      headline: 'Spend the weekend your way',
      sub: 'A private stay with the freedom to spend your time exactly how you want.',
      cta: 'Plan your getaway',
      photo: heroPhoto('solo'),
    },
    amenities: {
      heading: 'Everything you need for a solo getaway',
      cards: [
        { key: 'villa',    title: 'Private forest villa',  line: 'Five-star comfort with the entire villa to yourself.' },
        { key: 'lake',     title: 'Private lake',          line: 'Swim, paddle or simply spend time by the water.' },
        { key: 'sauna',    title: 'Wood-fired sauna',      line: 'A quiet sauna session surrounded by forest.' },
        { key: 'ebikes',   title: 'E-bikes & trails',      line: 'More of the forest to explore beyond the villa.' },
        { key: 'firepit',  title: 'Your own firepit',      line: 'A private spot for long evenings outside.' },
        { key: 'acres',    title: '126 acres of nature',   line: 'Space to walk, explore, and enjoy real privacy.' },
      ],
    },
    video: {
      heading: 'The Horizons Sandhills experience',
      shorts: ['0RtcdzerN2o', 'z1XeqOJ-pas', 'OxlfvYWUMuM'],
    },
    finalCta: {
      headline: 'Make the weekend your own',
      cta: 'Plan your getaway',
    },
  },
  {
    slug: 'remote-work',
    leadLabel: 'Remote Work Getaway',
    seo: {
      title: 'Remote Work Getaway — Horizons Sandhills',
      description: 'Work remotely from a private forest villa, with plenty to enjoy once you close your laptop.',
    },
    hero: {
      kicker: 'Remote work getaway at Horizons Sandhills',
      headline: 'Bring your laptop and stay for the week',
      sub: 'Work remotely from a private forest villa, with plenty to enjoy once you close your laptop.',
      cta: 'Plan your stay',
      photo: heroPhoto('remote-work'),
    },
    amenities: {
      heading: 'More than a change of scenery',
      cards: [
        { key: 'villa',    title: 'Private forest villa',  line: 'Five-star comfort for a longer stay.' },
        { key: 'lake',     title: 'Private lake',          line: 'Swimming, kayaking, and paddleboarding right on site.' },
        { key: 'sauna',    title: 'Wood-fired sauna',      line: 'A private sauna experience surrounded by forest.' },
        { key: 'ebikes',   title: 'E-bikes & trails',      line: 'Miles of nature to explore beyond the villa.' },
        { key: 'firepit',  title: 'Your own firepit',      line: 'Long evenings outside instead of another night at home.' },
        { key: 'acres',    title: '126 acres of nature',   line: 'Space, quiet, and a real change from the usual routine.' },
      ],
    },
    video: {
      heading: 'Life at Horizons Sandhills',
      shorts: ['7oEtvlNe5K4', 'z1XeqOJ-pas', 'JFfvJg10dUQ'],
    },
    finalCta: {
      headline: 'Turn a week of remote work into a getaway',
      cta: 'Plan your stay',
    },
  },
  {
    slug: 'road-trip',
    leadLabel: 'Road Trip Stay',
    seo: {
      title: 'Road Trip Stay — Horizons Sandhills',
      description: 'Stay in a private forest villa and turn an overnight stop into a moment worth staying for.',
    },
    hero: {
      kicker: 'Road trip stay at Horizons Sandhills',
      headline: 'Make the stop part of the trip',
      sub: 'Stay in a private forest villa and turn an overnight stop into a moment worth staying for.',
      cta: 'Plan your stay',
      photo: heroPhoto('road-trip'),
    },
    amenities: {
      heading: 'A stop worth staying for',
      cards: [
        { key: 'villa',    title: 'Private forest villa',  line: 'Five-star comfort after a full day on the road.' },
        { key: 'lake',     title: 'Private lake',          line: 'Swim, kayak or paddle before getting back on the road.' },
        { key: 'sauna',    title: 'Wood-fired sauna',      line: 'A proper reset after hours in the car.' },
        { key: 'ebikes',   title: 'E-bikes & trails',      line: 'Stretch the day out with a ride through the forest.' },
        { key: 'firepit',  title: 'Your own firepit',      line: 'Dinner and an evening outside before the next leg.' },
        { key: 'acres',    title: '126 acres of nature',   line: 'Space to slow the trip down for a night or two.' },
      ],
    },
    video: {
      heading: 'A look at Horizons Sandhills',
      shorts: ['1QG9txDjufw', 'JFfvJg10dUQ', 'BV1gqM_Aci8'],
    },
    finalCta: {
      headline: 'Add Horizons Sandhills to your route',
      cta: 'Plan your stay',
    },
  },
  {
    slug: 'pet-friendly',
    leadLabel: 'Pet-Friendly Getaway',
    seo: {
      title: 'Pet-Friendly Getaway — Horizons Sandhills',
      description: 'A private forest stay with plenty of space for both of you to get outside and explore.',
    },
    hero: {
      kicker: 'Pet-friendly getaway at Horizons Sandhills',
      headline: 'Bring your pet along for the getaway',
      sub: 'A private forest stay with plenty of space for both of you to get outside and explore.',
      cta: 'Plan your getaway',
      photo: heroPhoto('pet-friendly'),
    },
    amenities: {
      heading: 'More space to enjoy the stay together',
      cards: [
        { key: 'villa',           title: 'Private forest villa',  line: 'Five-star comfort for you and your four-legged companion.' },
        { key: 'acres',           title: '126 acres of nature',   line: 'Plenty of open space and fresh air to enjoy together.' },
        { key: 'forestTrails',    title: 'Forest trails',         line: 'Take your time exploring the property side by side.' },
        { key: 'lake',            title: 'Private lake',          line: 'A peaceful place for walks and time by the water.' },
        { key: 'firepit',         title: 'Your own firepit',      line: 'Wind down by the fire with your pet right beside you.' },
        { key: 'privateGrounds',  title: 'Private grounds',       line: 'More privacy, fewer crowds, and plenty of room to enjoy the outdoors.' },
      ],
    },
    video: {
      heading: 'Life outdoors at Horizons Sandhills',
      shorts: ['jXEQIPN2Xjk', 'AEN0eCcK4uU', '1QG9txDjufw'],
    },
    finalCta: {
      headline: 'Plan a getaway for you and your best friend',
      cta: 'Plan your stay',
    },
  },
];
