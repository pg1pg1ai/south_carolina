# Blog Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standalone Blog section — a card-grid index at `/blog` and individual article pages at `/blog/:slug` — shipping with one real, complete article.

**Architecture:** Content lives in a typed TypeScript data file (`blog.ts`), same pattern as `sandhills.ts`/`guide.ts`. Two new route-level pages reuse the existing `StickyHeader variant="page"` + `Footer` shell. Article bodies are structured block arrays (`heading` | `paragraph` | `image`) rendered by a small dedicated component, not raw HTML or markdown.

**Tech Stack:** React 19, TypeScript, React Router 7, Tailwind CSS (existing design tokens only — no new dependencies). No test framework exists in this repo; verification is `npx tsc -b`, `npm run lint`, and manual checks against the Vite dev server (matches `IMAGE_MAP.md`'s own stated convention: "There is no test suite — this is the only automated check").

**Spec:** `docs/superpowers/specs/2026-09-03-blog-section-design.md`

## Global Constraints

- No new npm dependencies (spec decision: TS data file, not Markdown/CMS).
- No `category` field on articles yet (deferred until there's enough content to group).
- Do not add "Blog" to `StickyHeader` nav links or `Footer`'s Explore column (deferred per user — direct-URL only for now).
- Cover image `blog.PNG`'s baked-in title is used as-is; the page's real `<h1>` is styled small/understated (`.eyebrow`-style), not as a second large headline.
- Images already processed and on disk (done in a prior session step) — do not re-convert:
  - `public/images/blog/outdoor-hospitality-cover.webp` (+ `.png` sibling)
  - `public/images/blog/lake-sauna-inline.webp` (+ `.jpeg` sibling)
- Body copy is transcribed verbatim from `blog-structure.pdf` (repo root) except the excerpt, which was authored to match voice (user already reviewed and approved this in the spec).
- Follow existing site conventions exactly: `font-display`/`font-eyebrow` classes, `text-ink`/`text-ink2`/`border-divider` tokens, `max-w-content`/`max-w-text` containers — do not invent new design tokens.

---

### Task 1: Data layer — `blog.ts`

**Files:**
- Create: `src/components/data/blog.ts`

**Interfaces:**
- Produces: `BlogArticle` interface, `BlogBlock` union type, `blogArticles: BlogArticle[]` array — consumed by every later task.

- [ ] **Step 1: Create the data file**

```ts
// src/components/data/blog.ts

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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc -b` from the repo root.
Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/data/blog.ts
git commit -m "add blog data layer with first article"
```

---

### Task 2: `ArticleCard` component

**Files:**
- Create: `src/components/blog/ArticleCard.tsx`

**Interfaces:**
- Consumes: `BlogArticle` from `../data/blog` (Task 1).
- Produces: `ArticleCard` default export, props `{ article: BlogArticle }` — consumed by `BlogIndex` (Task 4).

- [ ] **Step 1: Create the component**

```tsx
// src/components/blog/ArticleCard.tsx
import { Link } from 'react-router-dom';
import type { BlogArticle } from '../data/blog';

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ArticleCard({ article }: { article: BlogArticle }) {
  return (
    <Link
      to={`/blog/${article.slug}`}
      className="group block overflow-hidden rounded-2xl border border-divider bg-white transition-shadow hover:shadow-lg"
    >
      <div className="overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
        <img
          src={article.cover}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <p className="font-eyebrow text-ink2/60 text-xs uppercase tracking-widest mb-2">
          {formatDate(article.date)}
        </p>
        <h3
          className="font-display font-light text-ink text-xl mb-2"
          style={{ letterSpacing: '-0.01em', fontVariationSettings: '"SOFT" 30, "opsz" 32' }}
        >
          {article.title}
        </h3>
        <p className="text-ink2 text-sm leading-relaxed">{article.excerpt}</p>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc -b && npx eslint src/components/blog/ArticleCard.tsx`
Expected: both exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/ArticleCard.tsx
git commit -m "add blog article card component"
```

---

### Task 3: `ArticleBody` component

**Files:**
- Create: `src/components/blog/ArticleBody.tsx`

**Interfaces:**
- Consumes: `BlogBlock` from `../data/blog` (Task 1).
- Produces: `ArticleBody` default export, props `{ blocks: BlogBlock[] }` — consumed by `ArticlePage` (Task 5).

- [ ] **Step 1: Create the component**

```tsx
// src/components/blog/ArticleBody.tsx
import type { BlogBlock } from '../data/blog';

export default function ArticleBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        if (block.type === 'heading') {
          return (
            <h2
              key={i}
              className="font-display font-light text-ink text-[clamp(22px,2.5vw,32px)] pt-4"
              style={{ letterSpacing: '-0.02em', fontVariationSettings: '"SOFT" 30, "opsz" 32' }}
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === 'paragraph') {
          return (
            <p key={i} className="text-ink2 text-[17px] leading-relaxed">
              {block.text}
            </p>
          );
        }
        return (
          <figure key={i} className="my-8">
            <img src={block.src} alt={block.alt} className="w-full rounded-xl object-cover" />
            {block.caption && (
              <figcaption className="mt-2 text-ink2/60 text-sm text-center">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc -b && npx eslint src/components/blog/ArticleBody.tsx`
Expected: both exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/ArticleBody.tsx
git commit -m "add blog article body renderer"
```

---

### Task 4: `BlogIndex` page

**Files:**
- Create: `src/pages/BlogIndex.tsx`

**Interfaces:**
- Consumes: `blogArticles` from `../components/data/blog` (Task 1), `ArticleCard` (Task 2), `StickyHeader`, `Footer`, `BookingModal` (existing).
- Produces: `BlogIndex` default export — consumed by `App.tsx` route (Task 6).

- [ ] **Step 1: Create the page**

```tsx
// src/pages/BlogIndex.tsx
import { useEffect } from 'react';
import StickyHeader from '../components/blocks/StickyHeader';
import Footer from '../components/blocks/Footer';
import BookingModal from '../components/blocks/BookingModal';
import ArticleCard from '../components/blog/ArticleCard';
import { blogArticles } from '../components/data/blog';

export default function BlogIndex() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Blog — Horizons Sandhills';
    const meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute('content') ?? null;
    meta?.setAttribute(
      'content',
      'Stories on outdoor hospitality, life on 126 acres, and what makes a real getaway — from Horizons Sandhills.'
    );
    window.scrollTo(0, 0);
    return () => {
      document.title = prevTitle;
      if (prevDescription !== null) meta?.setAttribute('content', prevDescription);
    };
  }, []);

  const sorted = [...blogArticles].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen bg-bone">
      <StickyHeader variant="page" />

      <div className="max-w-content mx-auto px-4 md:px-8 pt-40 pb-20 md:pb-28">
        <div className="mb-12 md:mb-16">
          <p className="font-eyebrow text-ink2/60 text-xs uppercase tracking-widest mb-3">
            Journal
          </p>
          <h1
            className="font-display font-light text-ink text-[clamp(32px,5vw,56px)]"
            style={{ letterSpacing: '-0.025em', fontVariationSettings: '"SOFT" 40, "opsz" 72' }}
          >
            Stories from the Sandhills
          </h1>
        </div>

        {sorted.length === 0 ? (
          <p className="font-eyebrow text-ink2">No articles yet — check back soon.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>

      <Footer />
      <BookingModal />
    </div>
  );
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc -b && npx eslint src/pages/BlogIndex.tsx`
Expected: both exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/pages/BlogIndex.tsx
git commit -m "add blog index page"
```

---

### Task 5: `ArticlePage` page + SEO schema

**Files:**
- Create: `src/pages/ArticlePage.tsx`
- Modify: `src/components/StructuredData.tsx` (add `BlogPostingSchema` export, after the existing `StayBreadcrumb` function)

**Interfaces:**
- Consumes: `blogArticles`, `BlogArticle` from `../components/data/blog` (Task 1), `ArticleBody` (Task 3), `StickyHeader`, `Footer`, `BookingModal` (existing).
- Produces: `ArticlePage` default export — consumed by `App.tsx` route (Task 6). `BlogPostingSchema` export from `StructuredData.tsx`, used only within this task.

- [ ] **Step 1: Add `BlogPostingSchema` to `StructuredData.tsx`**

Add this import at the top of `src/components/StructuredData.tsx` (alongside the file's existing top-level consts, before the `StructuredData` default export):

```tsx
import type { BlogArticle } from './data/blog';
```

Add this function at the end of the file, after the existing `StayBreadcrumb` function:

```tsx
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
```

- [ ] **Step 2: Create the article page**

```tsx
// src/pages/ArticlePage.tsx
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import StickyHeader from '../components/blocks/StickyHeader';
import Footer from '../components/blocks/Footer';
import BookingModal from '../components/blocks/BookingModal';
import ArticleBody from '../components/blog/ArticleBody';
import { blogArticles } from '../components/data/blog';
import { BlogPostingSchema } from '../components/StructuredData';

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = blogArticles.find((a) => a.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!article) return;
    const prevTitle = document.title;
    document.title = `${article.title} — Horizons Sandhills`;
    const meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute('content') ?? null;
    meta?.setAttribute('content', article.excerpt);
    return () => {
      document.title = prevTitle;
      if (prevDescription !== null) meta?.setAttribute('content', prevDescription);
    };
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <p className="font-eyebrow text-ink2">Article not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone">
      <BlogPostingSchema article={article} />
      <StickyHeader variant="page" />

      <div data-zone="dark" className="w-full" style={{ aspectRatio: '16 / 7', maxHeight: '70vh' }}>
        <img
          src={article.cover}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div data-zone="light" className="max-w-text mx-auto px-4 md:px-8 py-10 md:py-14">
        <Link
          to="/blog"
          className="font-eyebrow text-ink2/60 hover:text-ink2 text-xs uppercase tracking-widest transition-colors"
        >
          ← Back to Journal
        </Link>

        <p className="font-eyebrow text-ink2/60 text-xs uppercase tracking-widest mt-6 mb-2">
          {formatDate(article.date)}
        </p>
        <h1 className="font-eyebrow text-ink2 text-sm uppercase tracking-widest mb-10">
          {article.title}
        </h1>

        <ArticleBody blocks={article.body} />
      </div>

      <Footer />
      <BookingModal />
    </div>
  );
}
```

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc -b && npx eslint src/pages/ArticlePage.tsx src/components/StructuredData.tsx`
Expected: both exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/pages/ArticlePage.tsx src/components/StructuredData.tsx
git commit -m "add blog article page with BlogPosting schema"
```

---

### Task 6: Wire routes, update docs, full verification

**Files:**
- Modify: `src/App.tsx`
- Modify: `IMAGE_MAP.md`
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: `BlogIndex` (Task 4), `ArticlePage` (Task 5).

- [ ] **Step 1: Add routes**

In `src/App.tsx`, add imports:

```tsx
import BlogIndex from './pages/BlogIndex';
import ArticlePage from './pages/ArticlePage';
```

Add routes inside `<Routes>`, after the `/guide` route:

```tsx
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<ArticlePage />} />
```

- [ ] **Step 2: Document in `IMAGE_MAP.md`**

Add a new section after the existing "## Other live route: `/guide` (Guest Guide)" section (before the closing `---`):

```markdown
## Other live route: `/blog` and `/blog/:slug`

- **Pages:** `src/pages/BlogIndex.tsx` (grid), `src/pages/ArticlePage.tsx` (article)
- **Data:** `src/components/data/blog.ts`, `blogArticles` array — each entry's `cover`
  field is used both as the index-grid card thumbnail and the article page's
  full-bleed masthead; body `image` blocks are inline content photos.
- No nav link yet — reachable only by direct URL (`/blog`, `/blog/<slug>`).

| Article | Cover | Inline image |
|---|---|---|
| Why Outdoor Hospitality Is Redefining Luxury | `/images/blog/outdoor-hospitality-cover.webp` (png sibling alongside) | `/images/blog/lake-sauna-inline.webp` (jpeg sibling alongside) |
```

- [ ] **Step 3: Fix the stale route list in `CLAUDE.md`**

`CLAUDE.md` line 27 already understates the route list (it's missing `/guide`,
predating that page). While touching routing, correct it in the same commit:

Find:
```
- **React Router 7** — two routes: `/` → `SandhillsLanding`, `/stays/:slug` → `StayDetail`
```

Replace with:
```
- **React Router 7** — five routes: `/` → `SandhillsLanding`, `/stays/:slug` → `StayDetail`, `/guide` → `GuestGuide`, `/blog` → `BlogIndex`, `/blog/:slug` → `ArticlePage`
```

- [ ] **Step 4: Full build verification**

Run: `npx tsc -b && npm run build`
Expected: both exit 0, `dist/` produced with no new errors (the existing `mapbox` chunk-size warning is pre-existing and expected).

- [ ] **Step 5: Manual verification via dev server**

Run: `npm run dev` (use Node 20+ if the environment's default `node` is older — this repo's Vite requires it).

Check each of the following in a browser or via a Playwright script against `http://localhost:5173`:
1. `GET /blog` — page loads, shows "Stories from the Sandhills" heading and exactly one card (cover photo, date "September 3, 2026", title, excerpt).
2. Click the card (or navigate to `/blog/why-outdoor-hospitality-is-redefining-luxury`) — article loads: full-bleed cover banner at top, "← Back to Journal" link, date, small-caps title line, two intro paragraphs, "Comfort Without Excess" heading, two more paragraphs, "Nature, Privacy, and Space" heading, the lake/sauna inline image with its caption, three closing paragraphs.
3. Header logo color: confirm it renders in the light (linen) treatment over the cover photo and flips to the dark treatment once scrolled into the bone-colored text area (the `data-zone="dark"`/`"light"` split from Step 2 of Task 5).
4. `GET /blog/not-a-real-slug` — shows "Article not found." and nothing else crashes.
5. Resize to a mobile viewport (e.g. 390px wide) and confirm the grid collapses to one column and the article column stays readable.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx IMAGE_MAP.md CLAUDE.md
git commit -m "wire up blog routes and update docs"
```

---

## Self-Review Notes

- **Spec coverage:** main page grid (Task 4), article page (Task 5), cover/title/subheadings/paragraphs/inline-image structure (Tasks 1, 3, 5), TS-data-file content format (Task 1), no category field (Task 1 — absent by design), nav left unwired (Task 6 — not added), publish date shown on card + article (Tasks 2, 5), grid layout (Task 4), cover-image-as-is with understated real `<h1>` (Task 5), SEO schema (Task 5). All spec sections have a corresponding task.
- **Type consistency:** `BlogArticle`/`BlogBlock` defined once in Task 1 and imported (never redefined) in Tasks 2, 3, 5. `ArticleCard` prop is `{ article: BlogArticle }` in both its definition (Task 2) and call site (Task 4). `ArticleBody` prop is `{ blocks: BlogBlock[] }` in both its definition (Task 3) and call site (Task 5). `BlogPostingSchema` prop is `{ article: BlogArticle }`, matching the `article` variable's type in `ArticlePage`.
- **No placeholders:** every step has complete, runnable code; no "TBD"/"similar to Task N" shortcuts.
