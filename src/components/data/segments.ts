/** Audience-targeted landing pages. Copy transcribed from
 *  docs/segment-landing-pages/client-brief.md.
 *
 *  Headings are Title Case (client, round 2): every word capitalised except
 *  articles, short conjunctions and prepositions — the main site's convention
 *  ("Take the Stay. Make the Story."). Buttons stay sentence case: Button
 *  applies `uppercase` itself. The property is always "Horizons Sandhills",
 *  never bare "Horizons".
 *
 *  `hero.headline` marks its accent words with *asterisks*; SegmentHero sets
 *  them in the brand accent colour. Keep one accent run per headline. */

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

/** Six cards and four videos are the brief's format, enforced as tuples so `tsc -b` fails
 *  on a page that gained or lost a card or a video during transcription. */
type SixCards = [AmenityCard, AmenityCard, AmenityCard, AmenityCard, AmenityCard, AmenityCard];
type FourShorts = [string, string, string, string];

export interface Segment {
  slug: string;
  /** Names the page in the lead email, e.g. 'Family Getaway'. */
  leadLabel: string;
  seo: { title: string; description: string };
  hero: { kicker: string; headline: string; sub: string; cta: string; photo: string };
  amenities: { heading: string; cards: SixCards };
  video: { heading: string; shorts: FourShorts };
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
      kicker: 'Romantic Getaway at Horizons Sandhills',
      headline: 'Just the *Two of You*',
      sub: 'A few days away. A little more time together.',
      cta: 'Plan your getaway',
      photo: heroPhoto('romantic'),
    },
    amenities: {
      heading: 'Settle In. Spend Some Time Together.',
      cards: [
        { key: 'villa',   title: 'Private Forest Villa', line: 'Five-star comfort in the middle of the forest.' },
        { key: 'lake',    title: 'Private Lake',         line: 'Swim, kayak or paddle across the 18-acre private lake.' },
        { key: 'sauna',   title: 'Wood-Fired Sauna',     line: 'A private sauna experience surrounded by forest.' },
        { key: 'firepit', title: 'Your Own Firepit',     line: 'Long evenings by the fire, entirely on your schedule.' },
        { key: 'ebikes',  title: 'E-Bikes & Trails',     line: 'Explore the property together on two wheels.' },
        { key: 'acres',   title: '126 Acres of Nature',  line: 'Quiet, privacy, and plenty of space around you.' },
      ],
    },
    video: {
      heading: 'Picture Your Weekend Here',
      shorts: ['atYpnzyry9o', '56iFsaKc6tE', 'VWzVORxlizg', 'fA1YN5rre94'],
    },
    finalCta: {
      headline: 'Make Your Next Date Last All Weekend',
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
      kicker: 'Family Getaway at Horizons Sandhills',
      headline: 'A Family Weekend *Everyone Actually Loves*',
      sub: 'Plenty to keep the kids busy. Plenty of comfort for the adults, too.',
      cta: 'Plan your getaway',
      photo: heroPhoto('family'),
    },
    amenities: {
      heading: 'Built for Days the Whole Family Can Get Into',
      cards: [
        { key: 'villa',   title: 'Private Forest Villa', line: 'Five-star comfort with space for the whole family.' },
        { key: 'lake',    title: 'Private Lake',         line: 'Swim, kayak, and paddleboard all in one place.' },
        { key: 'sports',  title: 'Sports & Games',       line: 'Volleyball, soccer, and plenty of space to play outside.' },
        { key: 'ebikes',  title: 'E-Bikes & Trails',     line: 'Easy rides and trails to explore together.' },
        { key: 'firepit', title: 'Your Own Firepit',     line: 'Evenings by the fire after a full day outside.' },
        { key: 'acres',   title: '126 Acres of Nature',  line: 'Space to roam, play, and spend the day outdoors.' },
      ],
    },
    video: {
      heading: 'Family Days at Horizons Sandhills',
      shorts: ['OkXZLmQq4lQ', 'ezPuRvMS4E4', 'LUbdzfgbH6Q', 'IGZnO8Y21zU'],
    },
    finalCta: {
      headline: 'Give Your Family More than Another Weekend at Home',
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
      kicker: "Girls' Weekend at Horizons Sandhills",
      headline: 'The Trip That Finally Made It *Out of the Chat*',
      sub: 'A few days away with your favorite people in a place worth leaving the city for.',
      cta: 'Plan your getaway',
      photo: heroPhoto('girls-weekend'),
    },
    amenities: {
      heading: 'Everything You Need for a Great Weekend',
      cards: [
        { key: 'villa',    title: 'Private Forest Villa',  line: 'Five-star comfort with plenty of space to stay together.' },
        { key: 'lake',     title: 'Private Lake',          line: 'Swim, kayak or paddleboard whenever you feel like it.' },
        { key: 'sauna',    title: 'Wood-Fired Sauna',      line: 'Unwind in a private sauna surrounded by the forest.' },
        { key: 'firepit',  title: 'Your Own Firepit',      line: 'Drinks, dinner, and long evenings around the fire.' },
        { key: 'ebikes',   title: 'E-Bikes & Trails',      line: 'A way to explore the property at your own pace.' },
        { key: 'acres',    title: '126 Acres of Nature',   line: 'Privacy, open space, and plenty of room to make the weekend your own.' },
      ],
    },
    video: {
      heading: 'Picture Your Weekend Here',
      shorts: ['nxsh-EK2n8Y', 'oYPDdrlIlas', '1QG9txDjufw', 'IGZnO8Y21zU'],
    },
    finalCta: {
      headline: 'Stop Talking about the Trip. Take It.',
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
      kicker: 'Bachelorette Weekend at Horizons Sandhills',
      headline: 'The Bride Gets *More than a Night Out*',
      sub: 'One place for the whole group to stay, celebrate, and spend the weekend together.',
      cta: 'Plan the bachelorette',
      photo: heroPhoto('bachelorette'),
    },
    amenities: {
      heading: 'Your Weekend, Already Planned',
      cards: [
        { key: 'villa',       title: 'Private Forest Villas',  line: 'Five-star comfort designed for a group getaway.' },
        { key: 'lake',        title: 'Private Lake',           line: 'Get the whole group out on kayaks and paddleboards.' },
        { key: 'sauna',       title: 'Wood-Fired Sauna',       line: 'Unwind together with a sauna session surrounded by forest.' },
        { key: 'firepit',     title: 'Your Own Firepit',       line: 'Your spot for drinks, stories, and late nights by the fire.' },
        { key: 'photoReady',  title: 'Photo-Ready Setting',    line: 'Forest, lake, and villas that look good from every angle.' },
        { key: 'acres',       title: '126 Acres of Nature',    line: 'Plenty of privacy to celebrate without an audience.' },
      ],
    },
    video: {
      heading: 'Bachelorette Weekends at Horizons Sandhills',
      shorts: ['nxsh-EK2n8Y', 'oYPDdrlIlas', 'CBvF-nFf7PE', 'IGZnO8Y21zU'],
    },
    finalCta: {
      headline: 'Make Her Bachelorette a Getaway',
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
      kicker: 'Birthday Getaway at Horizons Sandhills',
      headline: 'Skip the Dinner Reservation. *Take the Weekend.*',
      sub: 'Bring your favorite people and turn your birthday into a weekend away together.',
      cta: 'Plan your birthday',
      photo: heroPhoto('birthday'),
    },
    amenities: {
      heading: 'More than a Place to Celebrate',
      cards: [
        { key: 'villa',    title: 'Private Forest Villas',  line: 'Five-star comfort with space for your favorite people.' },
        { key: 'lake',     title: 'Private Lake',           line: 'Kayaks, paddleboards, and plenty of time on the water.' },
        { key: 'sauna',    title: 'Wood-Fired Sauna',       line: 'A private sauna session for you and your group.' },
        { key: 'firepit',  title: 'Your Own Firepit',       line: 'Drinks, cake, and late nights around the fire.' },
        { key: 'ebikes',   title: 'E-Bikes & Trails',       line: 'Explore the property between birthday plans.' },
        { key: 'acres',    title: '126 Acres of Nature',    line: 'Privacy and space to celebrate your way.' },
      ],
    },
    video: {
      heading: 'Birthdays at Horizons Sandhills',
      shorts: ['QmYK8gLA3IU', 'IGZnO8Y21zU', 'TPL7NC1MhI0', 'wZbtWhHf9vs'],
    },
    finalCta: {
      headline: 'Your Birthday Deserves More than One Night',
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
      kicker: 'Celebration Getaway at Horizons Sandhills',
      headline: 'Turn Any Celebration into *a Weekend Away*',
      sub: 'Birthdays, engagements, anniversaries, graduations, and everything worth gathering for.',
      cta: 'Plan your celebration',
      photo: heroPhoto('celebrations'),
    },
    amenities: {
      heading: 'A Place Worth Celebrating In',
      cards: [
        { key: 'villa',    title: 'Private Forest Villas',  line: 'Five-star comfort with space for your closest people.' },
        { key: 'lake',     title: 'Private Lake',           line: 'Kayaks, paddleboards, and a lake to enjoy together.' },
        { key: 'sauna',    title: 'Wood-Fired Sauna',       line: 'A private sauna session for your group.' },
        { key: 'firepit',  title: 'Your Own Firepit',       line: 'Drinks, dinner, and the celebration after dark.' },
        { key: 'ebikes',   title: 'E-Bikes & Trails',       line: 'Plenty to do between the main plans.' },
        { key: 'acres',    title: '126 Acres of Nature',    line: 'Privacy and space for the occasion to feel your own.' },
      ],
    },
    video: {
      heading: 'Celebrations at Horizons Sandhills',
      shorts: ['QmYK8gLA3IU', 'IGZnO8Y21zU', 'CBvF-nFf7PE', 'wZbtWhHf9vs'],
    },
    finalCta: {
      headline: 'Turn Your Special Occasion into a Getaway',
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
      kicker: 'Wellness Retreats at Horizons Sandhills',
      headline: 'One Place for *the Whole Retreat*',
      sub: 'For coaches and communities hosting small-group wellness experiences.',
      cta: 'Plan your retreat',
      photo: heroPhoto('wellness-retreat'),
    },
    amenities: {
      heading: 'Everything in One Place for Your Retreat',
      cards: [
        { key: 'villa',    title: 'Private Forest Villas',  line: 'Keep the whole group together throughout the stay.' },
        { key: 'lake',     title: 'Private Lake',           line: 'Use the water for swimming, paddling or guided sessions.' },
        { key: 'sauna',    title: 'Wood-Fired Sauna',       line: 'Build sauna and recovery into the program.' },
        { key: 'trails',   title: 'Trails & Open Grounds',  line: 'Space for movement, walks, and outdoor practices.' },
        { key: 'firepit',  title: 'Private Firepits',       line: 'A natural setting for evening circles and conversations.' },
        { key: 'acres',    title: '126 Private Acres',      line: 'Run the full program with privacy and no outside crowds.' },
      ],
    },
    video: {
      heading: 'Wellness Retreats at Horizons Sandhills',
      shorts: ['CBvF-nFf7PE', '7oEtvlNe5K4', 'BV1gqM_Aci8', 'IGZnO8Y21zU'],
    },
    finalCta: {
      headline: "You Bring the Program. We'll Provide the Setting.",
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
      kicker: 'Corporate Retreats at Horizons Sandhills',
      headline: 'Get the Team *Out of the Office*',
      sub: 'A private place to spend a few days together, get outside, and enjoy a real change of scenery.',
      cta: 'Plan your retreat',
      photo: heroPhoto('corporate-retreat'),
    },
    amenities: {
      heading: 'Built for More than a Team Dinner',
      cards: [
        { key: 'villa',           title: 'Private Forest Villas',  line: 'Five-star comfort so the whole team can stay on property.' },
        { key: 'lake',            title: 'Private Lake',           line: 'Kayaks and paddleboards for getting everyone out on the water.' },
        { key: 'teamActivities',  title: 'Team Activities',        line: 'Volleyball, soccer, e-bikes, and plenty more to do together.' },
        { key: 'firepit',         title: 'Private Firepits',       line: 'A place to unwind together after a full day.' },
        { key: 'trails',          title: 'Trails & Open Grounds',  line: 'Plenty of room to walk, explore, and spend time outside.' },
        { key: 'acres',           title: '126 Private Acres',      line: "All the space and privacy you won't get at a hotel." },
      ],
    },
    video: {
      heading: 'Team Retreats at Horizons Sandhills',
      shorts: ['CBvF-nFf7PE', 'd_X7zP-uHFc', 'IGZnO8Y21zU', 'QG7W20ZThoM'],
    },
    finalCta: {
      headline: 'Skip the Usual Offsite. Do Something Different.',
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
      kicker: 'Group Getaway at Horizons Sandhills',
      headline: 'Bring the Whole Crew. *Stay for the Weekend.*',
      sub: 'Premium forest villas, private grounds, and experiences the whole group can enjoy together.',
      cta: 'Plan your getaway',
      photo: heroPhoto('group'),
    },
    amenities: {
      heading: 'Everything for the Weekend, All in One Place',
      cards: [
        { key: 'villa',    title: 'Private Forest Villas',  line: 'Five-star comfort in modern forest villas.' },
        { key: 'lake',     title: 'Private Lake',           line: 'Swim, kayak, and paddleboard right on site.' },
        { key: 'sports',   title: 'Sports & Games',         line: 'Volleyball, soccer, and open space for casual games.' },
        { key: 'ebikes',   title: 'E-Bikes & Trails',       line: 'Ride the trails and explore the forest together.' },
        { key: 'firepit',  title: 'Private Firepits',       line: 'Dinner, drinks, and late nights around the fire.' },
        { key: 'acres',    title: '126 Acres of Nature',    line: 'Wide-open space for activities, walks and downtime.' },
      ],
    },
    video: {
      heading: 'Group Getaways at Horizons Sandhills',
      shorts: ['jd28Bxx-kCc', 'd_X7zP-uHFc', 'CWRL03sH5ok', 'IGZnO8Y21zU'],
    },
    finalCta: {
      headline: 'Your Next Group Getaway Starts at Horizons Sandhills',
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
      kicker: 'Solo Getaway at Horizons Sandhills',
      headline: 'Spend the Weekend *Your Way*',
      sub: 'A private stay with the freedom to spend your time exactly how you want.',
      cta: 'Plan your getaway',
      photo: heroPhoto('solo'),
    },
    amenities: {
      heading: 'Everything You Need for a Solo Getaway',
      cards: [
        { key: 'villa',    title: 'Private Forest Villa',  line: 'Five-star comfort with the entire villa to yourself.' },
        { key: 'lake',     title: 'Private Lake',          line: 'Swim, paddle or simply spend time by the water.' },
        { key: 'sauna',    title: 'Wood-Fired Sauna',      line: 'A quiet sauna session surrounded by forest.' },
        { key: 'ebikes',   title: 'E-Bikes & Trails',      line: 'More of the forest to explore beyond the villa.' },
        { key: 'firepit',  title: 'Your Own Firepit',      line: 'A private spot for long evenings outside.' },
        { key: 'acres',    title: '126 Acres of Nature',   line: 'Space to walk, explore, and enjoy real privacy.' },
      ],
    },
    video: {
      heading: 'The Horizons Sandhills Experience',
      shorts: ['0RtcdzerN2o', 'z1XeqOJ-pas', 'OxlfvYWUMuM', 'x7RtGgAQDJ4'],
    },
    finalCta: {
      headline: 'Make the Weekend Your Own',
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
      kicker: 'Remote Work Getaway at Horizons Sandhills',
      headline: 'Bring Your Laptop and *Stay for the Week*',
      sub: 'Work remotely from a private forest villa, with plenty to enjoy once you close your laptop.',
      cta: 'Plan your stay',
      photo: heroPhoto('remote-work'),
    },
    amenities: {
      heading: 'More than a Change of Scenery',
      cards: [
        { key: 'villa',    title: 'Private Forest Villa',  line: 'Five-star comfort for a longer stay.' },
        { key: 'lake',     title: 'Private Lake',          line: 'Swimming, kayaking, and paddleboarding right on site.' },
        { key: 'sauna',    title: 'Wood-Fired Sauna',      line: 'A private sauna experience surrounded by forest.' },
        { key: 'ebikes',   title: 'E-Bikes & Trails',      line: 'Miles of nature to explore beyond the villa.' },
        { key: 'firepit',  title: 'Your Own Firepit',      line: 'Long evenings outside instead of another night at home.' },
        { key: 'acres',    title: '126 Acres of Nature',   line: 'Space, quiet, and a real change from the usual routine.' },
      ],
    },
    video: {
      heading: 'Life at Horizons Sandhills',
      shorts: ['7oEtvlNe5K4', 'z1XeqOJ-pas', 'JFfvJg10dUQ', 'x7RtGgAQDJ4'],
    },
    finalCta: {
      headline: 'Turn a Week of Remote Work into a Getaway',
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
      kicker: 'Road Trip Stay at Horizons Sandhills',
      headline: 'Make the Stop *Part of the Trip*',
      sub: 'Stay in a private forest villa and turn an overnight stop into a moment worth staying for.',
      cta: 'Plan your stay',
      photo: heroPhoto('road-trip'),
    },
    amenities: {
      heading: 'A Stop Worth Staying For',
      cards: [
        { key: 'villa',    title: 'Private Forest Villa',  line: 'Five-star comfort after a full day on the road.' },
        { key: 'lake',     title: 'Private Lake',          line: 'Swim, kayak or paddle before getting back on the road.' },
        { key: 'sauna',    title: 'Wood-Fired Sauna',      line: 'A proper reset after hours in the car.' },
        { key: 'ebikes',   title: 'E-Bikes & Trails',      line: 'Stretch the day out with a ride through the forest.' },
        { key: 'firepit',  title: 'Your Own Firepit',      line: 'Dinner and an evening outside before the next leg.' },
        { key: 'acres',    title: '126 Acres of Nature',   line: 'Space to slow the trip down for a night or two.' },
      ],
    },
    video: {
      heading: 'A look at Horizons Sandhills',
      shorts: ['1QG9txDjufw', 'JFfvJg10dUQ', 'BV1gqM_Aci8', 'IGZnO8Y21zU'],
    },
    finalCta: {
      headline: 'Add Horizons Sandhills to Your Route',
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
      kicker: 'Pet-Friendly Getaway at Horizons Sandhills',
      headline: 'Bring Your Pet *Along for the Getaway*',
      sub: 'A private forest stay with plenty of space for both of you to get outside and explore.',
      cta: 'Plan your getaway',
      photo: heroPhoto('pet-friendly'),
    },
    amenities: {
      heading: 'More Space to Enjoy the Stay Together',
      cards: [
        { key: 'villa',           title: 'Private Forest Villa',  line: 'Five-star comfort for you and your four-legged companion.' },
        { key: 'acres',           title: '126 Acres of Nature',   line: 'Plenty of open space and fresh air to enjoy together.' },
        { key: 'forestTrails',    title: 'Forest Trails',         line: 'Take your time exploring the property side by side.' },
        { key: 'lake',            title: 'Private Lake',          line: 'A peaceful place for walks and time by the water.' },
        { key: 'firepit',         title: 'Your Own Firepit',      line: 'Wind down by the fire with your pet right beside you.' },
        { key: 'privateGrounds',  title: 'Private Grounds',       line: 'More privacy, fewer crowds, and plenty of room to enjoy the outdoors.' },
      ],
    },
    video: {
      heading: 'Life Outdoors at Horizons Sandhills',
      shorts: ['jXEQIPN2Xjk', 'AEN0eCcK4uU', '1QG9txDjufw', 'IGZnO8Y21zU'],
    },
    finalCta: {
      headline: 'Plan a Getaway for You and Your Best Friend',
      cta: 'Plan your stay',
    },
  },
];
