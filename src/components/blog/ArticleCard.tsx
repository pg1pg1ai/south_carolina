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
      {/* Matches the cover's native ratio — cover art has the title baked into
          the pixels, so cropping to a different ratio truncates the text. */}
      <div className="overflow-hidden" style={{ aspectRatio: '1953 / 805' }}>
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
