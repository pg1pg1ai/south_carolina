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
  {
    slug: 'the-future-of-corporate-retreats-isnt-another-conference-room',
    title: 'The Future of Corporate Retreats Isn’t Another Conference Room',
    excerpt:
      'A retreat works when it creates real distance from the routine — not when it moves the same workday into a nicer room.',
    cover: '/images/blog/corporate-retreats-cover.webp',
    date: '2026-09-18',
    body: [
      {
        type: 'paragraph',
        text: 'At Horizons, we believe that a corporate retreat is not just a change of location, but a shift away from the usual workplace. It is a chance to find space for new conversations and strengthen relationships, as well as an opportunity for collaborative planning and simply spending time together outside the usual routine. We are convinced that these experiences should not simply replicate a typical workday in a different location. Rather, the goal should be to take people out of their usual environment so that the experience does not feel like just another day at the office.',
      },
      { type: 'heading', text: 'Breaking the Daily Pattern' },
      {
        type: 'paragraph',
        text: 'Daily work creates patterns. People exist within their daily routines, talking about the same topics, working in the same room, and meeting the same people. Horizons offers the opportunity to hold an off-site seminar that is not only productive but also beneficial for both the body and the mind. A conversation that begins during a work session can continue on a walk. People who normally interact only in the context of specific responsibilities can sit down for breakfast or spend an evening together around a fire. There is more room for conversations that would probably never make it onto a meeting agenda. We believe this is the most valuable aspect of an off-site event. After all, sometimes what happens between scheduled sessions can be just as important as the sessions themselves.',
      },
      { type: 'heading', text: 'Bonding Beyond the Agenda' },
      {
        type: 'paragraph',
        text: 'People bond not only through conversations about work. Cooking together on the terrace of our “Forest Villa”, or sharing a meal overlooking the lake without any follow-up meetings, can change the nature of how people interact. These experiences do not need to be turned into formal team-building exercises to be valuable. In fact, we often prefer the opposite approach. Give people something to do and a place to spend time together, but don’t organize every interaction for them. Some of the best conversations happen precisely because nobody put them on the schedule.',
      },
      {
        type: 'paragraph',
        text: 'This is how we approach group stays at Horizons Sandhills. Teams are given the opportunity to relax and spend the night in our “Forest Villa,” as well as hold work sessions surrounded by nature. We do not see the goal as filling every available hour. We prefer to give guests the opportunity to choose for themselves how to spend their time, whether on relaxation or productive activities.',
      },
      {
        type: 'paragraph',
        text: 'We do not believe the future of corporate retreats will be defined by a more impressive conference room. In our view, the key is to create enough distance from the usual work routine so that people can have an exceptional experience. Teams still need places to think and work, but they also need meals, walks, conversations, and time together that have nothing to do with the next presentation. When a retreat combines both of these elements, it ceases to be just a typical work event moved to a more pleasant location. It becomes a memorable experience for the entire team, helping them bond and work productively.',
      },
    ],
  },
  {
    slug: 'why-people-need-places-to-disconnect-more-than-ever',
    title: 'Why People Need Places to Disconnect More Than Ever',
    excerpt:
      'Disconnecting doesn’t have to mean switching off your phone. It can simply mean being somewhere the phone becomes less interesting.',
    cover: '/images/blog/places-to-disconnect-cover.webp',
    date: '2026-09-20',
    body: [
      {
        type: 'paragraph',
        text: 'At Horizons, we do not believe that simply coming to relax in nature automatically guarantees disconnection from the outside world. Sometimes people bring their usual routines with them on a trip. Work messages, notifications, news, entertainment, and social media are always within reach. You can spend the entire day sitting by the lake while still being completely absorbed in the messages coming through your phone, just as you would be at home. That is why we believe hospitality is about more than simply creating distance between a guest and the city. The place itself should encourage people to take a break from their everyday routines.',
      },
      {
        type: 'paragraph',
        text: 'The atmosphere of a destination should encourage people to change their usual habits. At Horizons, guests can choose the way of relaxing that suits them best. A walking trail surrounded by forest and the riverbank gives people an opportunity to focus on their own thoughts and reflections, putting aside the routine that already takes up so much of everyday life. Kayaking or going for a bike ride gives those who prefer a more active experience another way to spend their time. For us, “disconnecting” does not mean giving up technology. We are not trying to encourage guests to switch off their phones. Instead, we want to create a place where, for a while, the phone simply becomes less interesting.',
      },
      { type: 'heading', text: 'Not Every Hour Needs a Result' },
      {
        type: 'paragraph',
        text: 'We also believe that sometimes the key to a successful getaway is not having a specific goal at all. In modern life, we already try to fill almost every hour with something to do. At work, there are always deadlines and schedules, and even a vacation can turn into a carefully planned itinerary built around reservations, activities, and places that have to be visited. At Horizons Sandhills, guests are not limited by time when talking around the fire or taking a boat out on the lake. They can enjoy the amenities across the property in any order and without having to follow a schedule. These are very simple things, but that simplicity is exactly the point. Not every hour has to produce a result.',
      },
      {
        type: 'paragraph',
        text: 'The absence of a strict schedule also affects how people spend time together. Families, couples, friends, and groups often do not need more entertainment in order to feel closer. Sometimes they simply need fewer reasons to interrupt a conversation. An evening meal can last longer simply because no one needs to rush anywhere afterward. We like this kind of flexibility because spending time together does not necessarily mean doing the same thing all day.',
      },
      { type: 'heading', text: 'Built Into the Landscape' },
      {
        type: 'paragraph',
        text: 'This idea became one of the foundations of Horizons Sandhills. The Forest Villas are part of the surrounding landscape rather than something that separates guests from nature. Each private terrace extends part of the living space outdoors. All the amenities available at Horizons Sandhills can be enjoyed without guests having to organize their day around a particular program.',
      },
      {
        type: 'paragraph',
        text: 'We want people to use these opportunities whenever they feel like it, or whenever they are ready to try something new. The point is not to create the longest possible list of activities. The point is to let the day unfold naturally, without constantly asking, “What are we doing next?”',
      },
      {
        type: 'paragraph',
        text: 'We believe this is becoming one of the most important roles that outdoor hospitality can play. Rest does not have to require people to give up technology, follow a particular wellness routine, or make every minute productive in its own way. It can simply provide an environment in which everyday concerns temporarily lose some of their importance. For us, that is what truly disconnecting from everyday life looks like. It does not mean doing absolutely nothing or forcing yourself to “be present.” It means reaching a state where you no longer feel that every moment has to lead to the next.',
      },
    ],
  },
  {
    slug: 'sustainability-isnt-a-marketing-strategy-anymore',
    title: 'Sustainability Isn’t a Marketing Strategy Anymore',
    excerpt:
      'Development should make a property more useful without making the landscape less recognizable — which means knowing when to build, and when to leave an area alone.',
    cover: '/images/blog/sustainability-cover.webp',
    date: '2026-09-22',
    body: [
      {
        type: 'paragraph',
        text: 'For a countryside retreat, the character of the surrounding environment is very important. If too much of the landscape is cleared, heavily altered, or developed with new structures, the place may lose the appeal that made people want to visit in the first place.',
      },
      {
        type: 'paragraph',
        text: 'Any changes made to the landscape should benefit the property without taking away from what makes it recognizable. This requires a clear understanding of what should be added, where it would be appropriate, and what is better left in its natural state.',
      },
      { type: 'heading', text: 'Building Without Erasing' },
      {
        type: 'paragraph',
        text: 'Sustainable development does not mean refusing to build or improve a hospitality project. It means understanding that every addition changes the environment around it.',
      },
      {
        type: 'paragraph',
        text: 'Accommodations, pathways, recreational areas, and activities should help guests truly experience the atmosphere of the property rather than compete with it. At Horizons Sandhills, our Forest Villas combine modern comfort with a connection to nature, allowing guests to stay close to the forest and lake while still enjoying a high level of comfort. Large windows, private terraces, and outdoor spaces extend the experience beyond the interior rather than separating people from nature.',
      },
      {
        type: 'paragraph',
        text: 'Our goal is to give people the freedom to move around Horizons Sandhills and build their own relationship with the surrounding environment. We would not want nature to become simply a view from the window.',
      },
      { type: 'heading', text: 'Beehives and an Orchard' },
      {
        type: 'paragraph',
        text: 'We have beehives on the property, which are a good example of how sustainability is an important part of our approach. They contribute to the health of the land while also allowing us to produce natural honey directly on the property. We are also developing a fruit orchard, which is another step in the long-term development of Horizons Sandhills.',
      },
      {
        type: 'paragraph',
        text: 'Of course, these things alone will not solve every environmental problem, and we are not claiming otherwise. We see value in making sustainability part of actual development rather than using it only to attract attention.',
      },
      { type: 'heading', text: 'No Demands on Guests' },
      {
        type: 'paragraph',
        text: 'Our environmental responsibility should not create restrictions for guests or require anything from them. We believe the most effective approach is to make ways of experiencing the property that cause less harm to the environment simple and appealing.',
      },
      {
        type: 'paragraph',
        text: 'The goal is not to tell people how they should interact with nature. The goal is to provide guests with comfort and freedom while maintaining the sustainability and cleanliness of the surrounding environment.',
      },
      {
        type: 'paragraph',
        text: 'As we continue developing in outdoor hospitality, we understand that new questions continue to arise: how the land is used, how activities change, what should be introduced, and what should remain as it is. That is why we believe sustainable development cannot be viewed simply as a marketing strategy. Environmental responsibility should be a standard when making decisions. The most convincing evidence is not a statement about sustainability, but the fact that the environment remains protected as the business continues to develop.',
      },
    ],
  },
  {
    slug: 'what-makes-a-destination-feel-authentic',
    title: 'What Makes a Destination Feel Authentic?',
    excerpt:
      'Guests can’t always explain why one place feels authentic and another doesn’t — but they can always feel the difference.',
    cover: '/images/blog/destination-authenticity-cover.webp',
    date: '2026-09-25',
    body: [
      {
        type: 'paragraph',
        text: 'Guests may not always be able to explain why one place feels authentic while another does not, but they can always feel the difference. We believe that a place becomes authentic when its individuality grows naturally out of the place itself. This cannot be achieved later by adding decorations, carefully choosing a visual style, or borrowing one from another successful property. A beautiful interior or simply a visually appealing setting will most likely attract attention, but appearance alone does not create a lasting identity.',
      },
      { type: 'heading', text: 'The Setting Already Exists' },
      {
        type: 'paragraph',
        text: 'Every place already has its own character before the first building is even designed. Climate, vegetation, bodies of water, open spaces, and the surrounding region create conditions that cannot be reproduced somewhere else. At Horizons Sandhills, an important part of this is the South Carolina landscape: 126 acres of private land, an 18-acre lake, forests, trails, and open spaces that change throughout the day and across different seasons. The property does not need to invent a setting for its guests - it already exists. Our task is to make that setting accessible without replacing it with an artificially created version of nature.',
      },
      {
        type: 'paragraph',
        text: 'Architecture is undoubtedly important in creating authenticity, but not because it should imitate a particular style. Its value comes from the harmony between the surrounding landscape and the design itself. The “Forest Villas” at Horizons Sandhills offer modern private accommodations with views of the surrounding landscape. Large windows direct attention outside. Private terraces make the forest part of everyday life rather than simply a distant view. Fire pits, outdoor dining areas, and walking paths surrounded by forest encourage guests to step outside and spend time outdoors throughout the property. We believe that design should not compete with its surroundings. It should complement them, and it is through this combination that guests can develop a genuine sense of comfort.',
      },
      { type: 'heading', text: 'A Place That Keeps Developing' },
      {
        type: 'paragraph',
        text: 'Authenticity also comes from the fact that a destination continues to live and develop even after guests leave. Not every element has to exist only for entertainment or decoration. The beehives at Horizons Sandhills are part of the property’s environmental approach and our plans to produce natural honey. The developing orchard is another project that will continue to change and mature over time. These elements are not themed installations created to make the property appear more natural. They are part of our approach to creating an authentic destination, and that is an approach we do not intend to change.',
      },
      {
        type: 'paragraph',
        text: 'Authenticity cannot be achieved simply by adding different elements in an attempt to give a place a particular appearance. It develops when each decision is made with respect for the identity and character the place already has. The landscape provides the foundation, architecture adds comfort, and long-term projects continue to improve the guest experience. At Horizons Sandhills, we believe that the identity of a destination becomes an advantage and creates authenticity when it remains in harmony with its surroundings. When all of these elements come together, the result is not simply a place that looks distinctive, but one that feels as though it could only exist exactly where it is.',
      },
    ],
  },
];
