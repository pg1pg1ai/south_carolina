export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  date: string; // ISO 'YYYY-MM-DD'
  body: BlogBlock[];
}

export type BlogBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string };

export const blogArticles: BlogArticle[] = [
  {
    slug: 'why-outdoor-hospitality-is-redefining-luxury',
    title: 'Why Outdoor Hospitality Is Redefining Luxury',
    excerpt:
      'Outdoor hospitality is trading abundance for something calmer — space, privacy, and the freedom to set your own pace.',
    cover: '/images/blog/outdoor-hospitality-cover.webp',
    date: '2026-09-03',
    body: [
      {
        type: 'paragraph',
        text: 'For a long time, luxury in the hospitality industry was associated with abundance: an extensive range of services, countless amenities, large spaces, and expensive interiors.',
      },
      {
        type: 'paragraph',
        text: 'Today, as people find it increasingly difficult to make room in their busy work schedules, they have started looking for something calmer and more personal. This shift is something we see at Horizons Sandhills. Privacy and the opportunity to slow down have become some of the most common expectations among modern travelers.',
      },
      { type: 'heading', text: 'Comfort Without Excess' },
      {
        type: 'paragraph',
        text: 'Outdoor hospitality has emerged as a response to this demand, combining modern comfort with natural surroundings. At Horizons Sandhills, this balance is essential to how we approach the guest experience. The experience is shaped not only by the amenities provided but also by the emotions that come from being immersed in nature.',
      },
      {
        type: 'paragraph',
        text: 'For us, modern luxury is about giving guests the freedom to manage their own time: to explore, spend meaningful moments with the people closest to them, or simply do nothing at all.',
      },
      { type: 'heading', text: 'Nature, Privacy, and Space' },
      {
        type: 'image',
        src: '/images/blog/lake-sauna-inline.webp',
        alt: 'Wood-fired barrel sauna beside the lake at dusk',
        caption: 'The lake at Horizons Sandhills, just steps from the barrel sauna.',
      },
      {
        type: 'paragraph',
        text: 'Nature is at the heart of this experience. In outdoor hospitality, the surroundings determine the rhythm of the stay. That idea continues to shape how we build Horizons Sandhills. The forest creates an atmosphere for quiet mornings, the lake becomes a place for both activity and reflection, and the fire pit turns into a natural gathering point.',
      },
      {
        type: 'paragraph',
        text: 'Our goal at Horizons Sandhills is not to turn nature into another luxury feature, but to allow the character of the destination to shape the entire stay. Guests may forget individual services, but they will remember the emotions they experienced: quiet and peaceful mornings, conversations by the fire, and the calming feeling that there is nowhere else they need to be.',
      },
      {
        type: 'paragraph',
        text: 'Ultimately, the changing idea of luxury reflects a broader shift in what people expect from travel. Comfort takes on its true meaning when it offers guests the opportunity and freedom to enjoy privacy and set their own schedule. In this sense, luxury is becoming less about how much a destination can offer and more about how thoughtfully everything comes together.',
      },
    ],
  },
  {
    slug: 'why-people-dont-remember-hotels-they-remember-experiences',
    title: "Why People Don't Remember Hotels. They Remember Experiences",
    excerpt:
      'Comfort and reliable service matter, but on their own they rarely make a trip unforgettable — the moments guests actually remember come from somewhere else.',
    cover: '/images/blog/why-people-dont-remember-hotels-cover.webp',
    date: '2026-09-08',
    body: [
      {
        type: 'paragraph',
        text: 'The value of a trip lies not in the number of amenities or the size of the room, but in the memories people create together. It can be as simple as everyone gathering around the fire after a long day, when a casual conversation becomes the part of the trip they remember most.',
      },
      {
        type: 'paragraph',
        text: 'Comfort and reliable service are undoubtedly important, but on their own, they are not enough to make a destination unforgettable.',
      },
      { type: 'heading', text: 'Hospitality Beyond Accommodation' },
      {
        type: 'paragraph',
        text: 'At Horizons Sandhills, we believe a successful retreat should give guests an opportunity to slow down, connect with their surroundings, and spend meaningful time with others. This creates a clear contrast between everyday life and time away. For this reason, we believe architecture, comfort, and landscape should work in harmony rather than exist as separate elements of the experience.',
      },
      {
        type: 'paragraph',
        text: 'The surrounding environment has a powerful influence on the memories people create. A private terrace overlooking the forest offers an entirely different atmosphere from a balcony facing a busy city.',
      },
      {
        type: 'paragraph',
        text: 'We believe amenities reveal their full potential when they invite guests to participate in the experience. What begins as an activity can continue into a conversation, a shared routine, or simply more time in each other’s company.',
      },
      {
        type: 'paragraph',
        text: 'Our approach is to create the conditions for memorable stories to emerge without trying to control every moment. Guests may leave with photographs, but what makes them remember the place are the feelings connected to those images: comfort, freedom, closeness, and time spent together.',
      },
      { type: 'heading', text: 'What Guests Take With Them' },
      {
        type: 'paragraph',
        text: 'It’s not the destination itself that determines which moments guests will remember, but rather the conditions under which the likelihood of experiencing those emotions is heightened. This is what we aim to create at Horizons Sandhills: an environment where amenities, design, and atmosphere come together in harmony, so even the most ordinary moments of a trip can become unforgettable. This is precisely where the value of hospitality lies: in creating an environment that allows guests to experience a story they’ll take home with them and remember forever.',
      },
      {
        type: 'image',
        src: '/images/blog/why-people-dont-remember-hotels-inline.webp',
        alt: 'Guest relaxing on a private terrace at Horizons Sandhills, coffee in hand',
        caption: 'A quiet morning on the terrace — the kind of moment guests remember long after checkout.',
      },
    ],
  },
];
