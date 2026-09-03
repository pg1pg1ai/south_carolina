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
