import type { BlogArticle } from './data/blog';

const SITE_URL = 'https://horizonssandhills.com';

const resort = {
  '@context': 'https://schema.org',
  '@type': ['Resort', 'LodgingBusiness'],
  '@id': `${SITE_URL}/#resort`,
  name: 'Horizons Sandhills',
  description:
    'Premium nature retreat on 126 private acres of longleaf pine savanna in the Carolina Sandhills. Private 18-acre lake, wood-fired sauna, six Forest Villas, and The House — 90 minutes from Charlotte.',
  url: SITE_URL,
  telephone: '+18035550180',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '423 Woodmen Rd',
    addressLocality: 'Patrick',
    addressRegion: 'SC',
    postalCode: '29584',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 34.5734,
    longitude: -80.038,
  },
  priceRange: '$609–$1200',
  checkinTime: '15:00',
  checkoutTime: '11:00',
  petsAllowed: true,
  smokingAllowed: false,
  numberOfRooms: 7,
  currenciesAccepted: 'USD',
  paymentAccepted: 'Credit Card, Cash',
  tourBookingPage: `${SITE_URL}/#reserve`,
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Private 18-acre lake', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Wood-fired lakeside sauna', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Canoes & paddleboards', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Twelve miles of hiking trails', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Outdoor firepit', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Stargazing chairs', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'E-bikes', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Peach orchard on property', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Welcome pantry box', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Starlink Wi-Fi (The House & sauna)', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Personal host concierge', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Private fishing lake', value: true },
  ],
  image: [
    `${SITE_URL}/images/sandhills/Villa.webp`,
    `${SITE_URL}/images/sandhills/house.webp`,
    `${SITE_URL}/images/sandhills/land.webp`,
    `${SITE_URL}/images/sandhills/canoes.webp`,
    `${SITE_URL}/images/sandhills/sauna_session.webp`,
  ],
  containsPlace: [
    {
      '@type': 'Accommodation',
      '@id': `${SITE_URL}/stays/boxble-villa#accommodation`,
      name: 'The Forest Villa',
      description:
        'Private lakefront villa with king bed, en-suite bathroom, outdoor deck, Marshall speaker, and Weber grill. Six villas spaced so you cannot see your neighbor. Intentionally offline — no Wi-Fi.',
      url: `${SITE_URL}/stays/boxble-villa`,
      image: [
        `${SITE_URL}/images/villa/01_Exterior/1.webp`,
        `${SITE_URL}/images/villa/02_Interior_Casita/1.webp`,
        `${SITE_URL}/images/villa/03_Terrace/1.webp`,
      ],
      occupancy: { '@type': 'QuantitativeValue', maxValue: 2 },
      bed: { '@type': 'BedDetails', typeOfBed: 'King size bed', numberOfBeds: 1 },
      numberOfBathroomsTotal: 1,
      numberOfBedrooms: 1,
      petsAllowed: true,
      smokingAllowed: false,
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Private deck with lake view', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'En-suite bathroom', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Marshall Bluetooth speaker', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Weber grill on deck', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Brooklinen linens', value: true },
      ],
      offers: {
        '@type': 'Offer',
        price: '609',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '609',
          priceCurrency: 'USD',
          unitText: 'NIGHT',
        },
      },
    },
    {
      '@type': 'Accommodation',
      '@id': `${SITE_URL}/stays/the-house#accommodation`,
      name: 'The House',
      description:
        'Flagship lakeside property sleeping eight. Four bedrooms, full kitchen, firepit deck, Starlink Wi-Fi. For families and groups. Exclusive buyout of the entire main property.',
      url: `${SITE_URL}/stays/the-house`,
      image: [
        `${SITE_URL}/images/sandhills/house.webp`,
      ],
      occupancy: { '@type': 'QuantitativeValue', maxValue: 8 },
      numberOfBathroomsTotal: 3,
      numberOfBedrooms: 4,
      smokingAllowed: false,
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Full kitchen', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Lakeside deck with firepit', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Starlink Wi-Fi', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Dining for 8+', value: true },
      ],
      offers: {
        '@type': 'Offer',
        price: '1200',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '1200',
          priceCurrency: 'USD',
          unitText: 'NIGHT',
        },
      },
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Horizons Sandhills?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Horizons Sandhills is a private getaway surrounded by nature, designed for relaxing getaways, family trips, group stays, celebrations, and outdoor experiences. The resort combines comfortable accommodations with a private lake, and 20+ complimentary wellness, recreation, and sports amenities, trails, and plenty of forested space to enjoy the outdoors.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many people can stay at Horizons Sandhills?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our 6 Forest Villas accommodate up to 4 guests each, and our Guest House accommodates up to 8 guests, for a total overnight capacity of 32 guests. We also have 16 RV hookups, so bringing RVs in maximizes the capacity up to 100 guests overnight.',
      },
    },
    {
      '@type': 'Question',
      name: 'What amenities and activities are included with my stay?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Guests have access to a wide range of resort amenities and recreational activities, including a private lake with swimming, fishing, kayaks, paddleboards, water bikes, wood-fired sauna, cold plunge, outdoor shower, lakeside gazebo and lounge area, beach volleyball field, beach soccer field, beach tennis field, badminton, table tennis, cornhole, walking and running trails, shared lounge area with a fireplace and a grilling area.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I book Horizons Sandhills for a group?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We welcome family gatherings, friend groups, retreats, corporate groups, celebrations, and other private stays. Unlike smaller stays, group reservations can be booked year-round through our customer service team: +1 (754) 667-9090. To reserve the entire property just for your group, a reservation of 6 forest villas is required.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can we host an event at Horizons Sandhills?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The property offers indoor and outdoor spaces suitable for private events and gatherings. Also, Horizons Sandhills does not have any neighbors or noise restrictions for group reservations.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you have an indoor event space?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. We have two indoor event spaces: one with a professional kitchen and a bathroom for around 70 guests comfortably, and another one with a bathroom and for around 30 guests comfortably, with an adjacent lounge area, fireplace, and grilling area deck.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are pets allowed?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. Horizons Sandhills is pet-friendly. Guests may bring up to 3 pets per accommodation for a $60 pet fee per stay. For everyone's safety, we require that pets are leashed while in common areas.",
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a manager on-site?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Our property manager is available on-site 24/7 to assist guests throughout their stay.',
      },
    },
  ],
};

export default function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(resort) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

/* Breadcrumb helper for stay detail pages */
export function StayBreadcrumb({ name, slug }: { name: string; slug: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Horizons Sandhills', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Stays', item: `${SITE_URL}/#stays` },
      { '@type': 'ListItem', position: 3, name, item: `${SITE_URL}/stays/${slug}` },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* BlogPosting schema for article pages */
export function BlogPostingSchema({ article }: { article: BlogArticle }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: `${SITE_URL}${article.cover}`,
    datePublished: article.date,
    url: `${SITE_URL}/blog/${article.slug}`,
    author: { '@type': 'Organization', name: 'Horizons Sandhills' },
    publisher: { '@type': 'Organization', name: 'Horizons Sandhills', url: SITE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${article.slug}` },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
