import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { guideData as g } from '../data/guide';

export default function AccessSlideshow() {
  const slides = g.access.slides;
  const [i, setI] = useState(0);
  const go = (n: number) => setI((n + slides.length) % slides.length);

  return (
    <div
      className="no-print guide-card overflow-hidden rounded-2xl border border-divider bg-night"
      role="group"
      aria-roledescription="carousel"
      aria-label="Cabin access walkthrough"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
      }}
    >
      <div className="relative aspect-video">
        {slides.map((s, n) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.caption}
            aria-hidden={n !== i}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            style={{ opacity: n === i ? 1 : 0 }}
          />
        ))}

        <button
          onClick={() => go(i - 1)}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-linen/30 text-linen transition-colors hover:bg-linen/15"
          style={{ background: 'rgba(26,31,27,0.6)' }}
        >
          <ChevronLeft size={18} strokeWidth={1.8} />
        </button>
        <button
          onClick={() => go(i + 1)}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-linen/30 text-linen transition-colors hover:bg-linen/15"
          style={{ background: 'rgba(26,31,27,0.6)' }}
        >
          <ChevronRight size={18} strokeWidth={1.8} />
        </button>

        <div
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{ background: 'linear-gradient(transparent, rgba(10,8,5,0.85))' }}
        >
          <p className="eyebrow text-linen/70">Step {i + 1} of {slides.length}</p>
          <p className="mt-1 text-[14px] leading-snug text-linen">{slides[i].caption}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2 py-3">
        {slides.map((s, n) => (
          <button
            key={s.src}
            onClick={() => setI(n)}
            aria-label={`Go to slide ${n + 1}`}
            aria-current={n === i}
            className="h-1.5 rounded-full transition-all"
            style={{ width: n === i ? 22 : 6, background: n === i ? '#B05329' : 'rgba(231,222,199,0.35)' }}
          />
        ))}
      </div>
    </div>
  );
}
