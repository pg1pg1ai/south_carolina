# Blog Section (/blog) — Design

**Date:** 2026-09-03
**Status:** Approved by user (conversation), pending spec review

## Summary

Add a standalone Blog section: a main list page at `/blog` and individual article
pages at `/blog/:slug`. Single flat list for now (no categories — deferred until
there's enough content to group). First real article ships with this feature,
sourced from `blog-structure.pdf` (content) plus `blog.PNG` / `blog1.jpeg` (images),
all supplied by the user at the project root.

## Decisions already made with user

1. **Content format: TypeScript data file**, same pattern as `sandhills.ts` /
   `guide.ts` — not Markdown files, not a CMS. No new dependency, consistent with
   every other content type on this site. Publishing a post means editing the data
   file and redeploying (no backend, per project constraints).
2. **No `category` field yet** — YAGNI; add it when categories actually ship.
3. **Nav: not wired up.** No "Blog" link in `StickyHeader` or `Footer` yet — pages
   exist and are reachable by direct URL only, until the user is ready to publicize.
4. **Publish date: yes** — each article has a `date` field, used to sort newest-first
   and displayed on the card and at the top of the article.
5. **Layout: grid** (not list) on the main page — 3-col desktop / 1-col mobile,
   matching the card-grid pattern already used elsewhere on the site.
6. **Cover image duplication:** `blog.PNG` (the first article's cover) has its title
   baked into the image pixels. Decision: use it as-is, full-bleed, as a stylized
   masthead. The page still renders a real `<h1>` (required for SEO/accessibility/
   consistency with the rest of the site) but styled small/understated directly
   below the cover so the title doesn't visually repeat at the same weight.
7. **Chrome: reuse `StickyHeader variant="page"` + `Footer`**, same shell as
   `GuestGuide` / matches site-wide pattern — not a bespoke top bar (unlike the
   older `StayDetail` pattern).

## Content reconciled from blog-structure.pdf

The PDF is real, finished copy for one article — not just reference material. It
maps directly onto the block model below:

- **Title:** "Why Outdoor Hospitality Is Redefining Luxury" (PDF's "1. " prefix is
  the doc's own list numbering, dropped from the actual title)
- **Cover:** `blog.PNG` → converted to `public/images/blog/outdoor-hospitality-cover.webp`
  (1800px wide, q82, per `IMAGE_MAP.md` hero tier). PNG sibling kept alongside.
- **Excerpt** (for the card — not in the PDF, written to match the article's voice):
  "Outdoor hospitality is trading abundance for something calmer — space, privacy,
  and the freedom to set your own pace."
- **Body blocks, in order:**
  1. paragraph — "For a long time, luxury in the hospitality industry..."
  2. paragraph — "Today, as people find it increasingly difficult..."
  3. heading — "Comfort Without Excess"
  4. paragraph — "Outdoor hospitality has emerged as a response..."
  5. paragraph — "For us, modern luxury is about giving guests the freedom..."
  6. heading — "Nature, Privacy, and Space"
  7. image — `blog1.jpeg` → `public/images/blog/lake-sauna-inline.webp` (1200px, q80,
     per `IMAGE_MAP.md` content-image tier). JPEG sibling kept alongside.
  8. paragraph — "Nature is at the heart of this experience..."
  9. paragraph — "Our goal at Horizons Sandhills is not to turn nature..."
  10. paragraph — "Ultimately, the changing idea of luxury reflects..."

Full paragraph text is transcribed verbatim from the PDF into `blog.ts` at
implementation time.

`blog-structure.pdf` stays at the repo root as a reference document (not imported
by any code, same convention as `IMAGE_MAP.md`/`CLAUDE.md` living outside `src/`).

## Architecture

### Routing
- `App.tsx`: add `<Route path="/blog" element={<BlogIndex />} />` and
  `<Route path="/blog/:slug" element={<ArticlePage />} />`.

### Files
| File | Change |
|---|---|
| `src/pages/BlogIndex.tsx` | New. Grid of `ArticleCard`s, sorted newest-first, empty-state message. |
| `src/pages/ArticlePage.tsx` | New. Cover, understated `<h1>`, date, body renderer, "Article not found" fallback for a bad slug (mirrors `StayDetail`'s pattern). |
| `src/components/blog/ArticleCard.tsx` | New. Cover (fixed aspect-ratio, object-cover), date, title, excerpt. Links to `/blog/:slug`. |
| `src/components/blog/ArticleBody.tsx` | New. Maps `BlogBlock[]` → heading/paragraph/image renderers. |
| `src/components/data/blog.ts` | New. `BlogArticle`/`BlogBlock` types + `blogArticles` array (one real article). |
| `src/App.tsx` | Add the two routes. |
| `src/components/StructuredData.tsx` | Add `BlogPostingSchema({ article })` helper, same pattern as existing `StayBreadcrumb`. |
| `IMAGE_MAP.md` | Document the new `/blog` and `/blog/:slug` routes and image locations. |

### Data model (`src/components/data/blog.ts`)
```ts
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

export const blogArticles: BlogArticle[] = [ /* one entry, see Content above */ ];
```

### Page behavior
- Both pages set `document.title` / meta description on mount (same inline
  `useEffect` pattern already used in `SandhillsLanding.tsx` / `GuestGuide.tsx` —
  no new shared hook, consistent with existing duplication in the codebase).
- `BlogIndex`: `[...blogArticles].sort((a, b) => b.date.localeCompare(a.date))`.
- `ArticlePage`: `useParams<{ slug: string }>()`, `find` by slug, `scrollTo(0,0)` on
  slug change (mirrors `StayDetail`).
- Body max-width follows the site's existing `text` (680px) content-width token.

### SEO
- `BlogPostingSchema` emits a `BlogPosting` JSON-LD block (headline, image, datePublished,
  author/publisher = Horizons Sandhills) on the article page, mirroring how
  `StayBreadcrumb` is emitted on `/stays/:slug`.

## Explicitly out of scope
- Categories/filtering (deferred per user).
- Nav wiring (deferred per user).
- Pagination (moot at one article; revisit once the list is long).
- RSS/sitemap changes.
