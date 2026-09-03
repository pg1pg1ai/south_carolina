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
];
