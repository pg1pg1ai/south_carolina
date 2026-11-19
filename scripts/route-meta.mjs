// Post-build: give routes their own HTML head, so link previews (WhatsApp, iMessage,
// Slack, LinkedIn) and crawlers that don't run JS see the right title, description,
// image and hero preload instead of the homepage's. Vercel serves dist/<route>/index.html
// before the SPA rewrite. Add a route here when it needs its own preview.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const ORIGIN = 'https://sandhills.gohorizons.com';
const ROUTES = [
  {
    path: 'events',
    title: 'Private Events & Full-Property Buyouts | Horizons Sandhills',
    description:
      'Book all of Horizons Sandhills for your retreat, wedding or celebration: 126 private acres, an 18-acre lake, two indoor event spaces and room for 32 overnight (100 with RVs). All-inclusive from $1,770 per night.',
    image: '/images/og/events.jpg',
    preload: '/images/segments/heroes/birthday.webp',
  },
];

const base = readFileSync('dist/index.html', 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const swap = (html, re, val, what) => {
  if (!re.test(html)) throw new Error(`route-meta: ${what} not found in dist/index.html`);
  return html.replace(re, val);
};

for (const r of ROUTES) {
  const url = `${ORIGIN}/${r.path}`;
  let h = base;
  h = swap(h, /<title>[^<]*<\/title>/, `<title>${esc(r.title)}</title>\n    <link rel="canonical" href="${url}" />`, 'title');
  h = swap(h, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(r.description)}" />`, 'description');
  h = swap(h, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(r.title)}" />`, 'og:title');
  h = swap(h, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(r.description)}" />`, 'og:description');
  h = swap(h, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`, 'og:url');
  h = swap(h, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${ORIGIN}${r.image}" />`, 'og:image');
  // the homepage hero preloads don't apply here; preload this page's hero instead
  h = swap(h, /\s*<link rel="preload" as="image" href="\/images\/sandhills\/desktop\.webp"[^>]*>\s*<link rel="preload" as="image" href="\/images\/sandhills\/mobile\.webp"[^>]*>/,
    `\n    <link rel="preload" as="image" href="${r.preload}" fetchpriority="high" />`, 'hero preloads');
  mkdirSync(`dist/${r.path}`, { recursive: true });
  writeFileSync(`dist/${r.path}/index.html`, h);
  console.log(`route-meta: dist/${r.path}/index.html`);
}
