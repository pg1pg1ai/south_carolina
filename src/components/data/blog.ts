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
  {
    slug: 'building-more-than-resorts-creating-places-people-return-to',
    title: 'Building More Than Resorts: Creating Places People Return To',
    excerpt:
      'People don’t return to the places that impressed them most. They return to the ones that became part of their memories, relationships, and traditions.',
    cover: '/images/blog/building-more-than-resorts-cover.webp',
    date: '2026-09-17',
    body: [
      { type: 'heading', text: 'Emotional Connection Drives Return Visits' },
      {
        type: 'paragraph',
        text: 'There is a meaningful difference between places that impress people and places that remain in their memories. This distinction rarely depends on scale, level of comfort, architecture, or the number of guests a destination can accommodate.',
      },
      {
        type: 'paragraph',
        text: 'We believe people return to places that have become an inseparable part of their memories, relationships, and traditions.',
      },
      { type: 'heading', text: 'A Clear Philosophy Comes First' },
      {
        type: 'paragraph',
        text: 'At Horizons Sandhills, a clear philosophy guides every decision, from the overall layout of the property to the smallest details inside each room. The hospitality concepts that guests find most compelling are often built around adventure, wellness, culture, or nature. Their outward appearance may evolve, but the central idea should remain consistent. Without this foundation, a property can become little more than a collection of attractive buildings and comfortable amenities without ever developing a distinct identity.',
      },
      {
        type: 'paragraph',
        text: 'Design also influences how people behave. A space that brings guests naturally together can turn an ordinary evening into something they begin to associate with the destination itself. Over time, those repeated moments can become part of what draws them back.',
      },
      {
        type: 'paragraph',
        text: 'We do not see good design as the way to control the guest experience. We create the conditions for connection, movement, and rest.',
      },
      {
        type: 'paragraph',
        text: 'In outdoor hospitality, nature should remain the main attraction. Constantly adding elaborate features can distract from the very reason guests chose the destination in the first place. Buildings should frame the surrounding environment, while activities should help people experience it more fully. At Horizons Sandhills, we approach development by asking how each new addition can bring guests closer to the environment rather than distract from it. The goal is to expand what people can experience while preserving the character of the landscape that brought them here in the first place.',
      },
      {
        type: 'paragraph',
        text: 'For us, a destination that gives people the freedom to shape their own experience allows guests to develop personal habits and traditions connected to the place. Over time, this can encourage them to return. A favorite spot by the lake or an evening spent beside the same firepit can gradually become part of a guest’s personal connection to the destination. A successful hospitality business is not simply a place people visit. It is an experience they carry with them, one that gives them a reason to return.',
      },
      { type: 'heading', text: 'Building Long-Term Value' },
      {
        type: 'image',
        src: '/images/blog/building-more-than-resorts-inline.webp',
        alt: 'Cedar barrel sauna, dock, and canoes on the lakeshore at Horizons Sandhills',
        caption: 'The lakeshore at Horizons Sandhills — a favorite spot many guests come back to.',
      },
      {
        type: 'paragraph',
        text: 'We see creating a place where people will want to return not as the result of a single element or design decision, but rather as a long-term process that never ends. It requires continuous attention to how the experience can evolve, improve, and offer guests something they have not encountered before. The goal is not to recreate the same emotions with every visit, but to build on them, giving returning guests new reasons to connect with the place and allowing that connection to become even stronger over time.',
      },
    ],
  },
  {
    slug: 'why-nature-is-becoming-the-new-wellness-center',
    title: 'Why Nature Is Becoming the New Wellness Center',
    excerpt:
      'Wellness doesn’t always need to be a program on a schedule. In the right setting, it’s simply the freedom to choose how you spend your day.',
    cover: '/images/blog/why-nature-is-becoming-the-new-wellness-center-cover.webp',
    date: '2026-09-14',
    body: [
      {
        type: 'paragraph',
        text: 'At Horizons Sandhills, we believe that in the hospitality industry, the most important aspect is the environment itself, not the list of programs offered. Fitness centers, spas, treatment rooms, and scheduled activities serve as tools that help people enhance their experience, but they are not the only factors that attract guests.',
      },
      {
        type: 'paragraph',
        text: 'Sometimes, people derive the most enjoyment from their stay when there are fewer demands placed on them, when they spend time outdoors, and when they are free to decide for themselves how to spend their leisure time. A healthy lifestyle doesn’t always need to be added to a stay as a separate activity. In the right setting, it can already be an integral part of it.',
      },
      { type: 'heading', text: 'The Environment Changes the Rhythm' },
      {
        type: 'paragraph',
        text: 'One of the core ideas behind Horizons Sandhills is that the surroundings directly influence how guests spend their free time. The morning doesn’t have to start with traffic jams, crowded streets, or a strict schedule. A walk around the grounds doesn’t require a specific destination. An afternoon by the lake can last as long as anyone wishes.',
      },
      {
        type: 'paragraph',
        text: 'For us, this change in the rhythm of life is of great importance. It gives people the opportunity to decide for themselves whether they want to be active, socialize with others, or simply enjoy some solitude. Leisure ceases to be about conforming to someone else’s idea of well-being and becomes, rather, the freedom to find one’s own rhythm.',
      },
      {
        type: 'paragraph',
        text: 'We believe that when physical activity is an integral part of the vacation destination itself, it begins to be perceived in a completely different way. Guests should be given the choice of which activity they prefer that day - whether it’s a ride on an electric bike, a kayaking trip on the lake, or simply a walk in the fresh air. This way, the experience doesn’t become just another workout - there are no goals to strive for - but rather an opportunity to spend time in comfort, exactly as you wish.',
      },
      {
        type: 'paragraph',
        text: 'For us, this distinction is very important. People often come on vacation because they want to take a break from their routine. It is precisely this comfort that makes this freedom possible. Hospitality in nature allows you to be active without feeling like it’s just another obligation.',
      },
      {
        type: 'paragraph',
        text: 'Being close to nature doesn’t have to mean sacrificing comfort. At Horizons Sandhills, the Forest Villas offer guests a modern, secluded space while allowing them to enjoy the proximity of the lake and the forest. Guests are provided with a wide range of services, from active recreation on electric bikes to relaxing saunas with a view of the lake.',
      },
      {
        type: 'paragraph',
        text: 'For us, comfort is what makes this kind of freedom possible. Our goal is not to complicate your stay so that it feels more “natural,” but rather to allow you to immerse yourself in the natural environment and freely choose how you spend your vacation without imposing our own rules.',
      },
      { type: 'heading', text: 'Wellness Through Choice' },
      {
        type: 'paragraph',
        text: 'We believe that wellness isn’t so much about activities as it is about having a choice. One guest might want to start the day early and spend most of their time outdoors. Others might prefer to take their time over breakfast, sit by the lake for hours, and join the others around the campfire in the evening. A group can spend the weekend together, even though not every member will follow exactly the same schedule.',
      },
      {
        type: 'paragraph',
        text: 'We believe that a vacation destination should allow room for such differences. Instead of dictating to guests what their vacation should look like, it can give them enough freedom to define it for themselves.',
      },
      {
        type: 'paragraph',
        text: 'For us, the future of wellness in the hospitality industry lies not only in expanding the range of amenities and programs, but also in creating an environment where guests can spend their time differently than they would at home. We believe that the surrounding amenities and comfort are not separate components of our project, but an integral part of the guest experience and an opportunity offered to every guest.',
      },
      {
        type: 'paragraph',
        text: 'It is in this direction, in our opinion, that nature-based hospitality can develop: not by turning nature into just another amenity, but by allowing the environment itself to guide guests on how to spend their leisure time.',
      },
    ],
  },
];
