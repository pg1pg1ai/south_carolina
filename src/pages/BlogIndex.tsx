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
