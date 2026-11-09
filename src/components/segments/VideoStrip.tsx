import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Segment } from '../data/segments';
import RevealOnScroll from '../primitives/RevealOnScroll';
import ShortThumb from '../primitives/ShortThumb';
import SectionGlow from './SectionGlow';

const CHANNEL_URL = 'https://www.youtube.com/@HorizonsGetaways/';

/** Desktop block width: four 9:16 cards sized from the viewport height so the
 *  heading and the row fit on one screen together (the 360px covers the fixed
 *  header, the heading row and the panel/section padding; 60px is the 3 gaps).
 *  The heading row shares this width, so the heading's left edge, the YouTube
 *  link's right edge and the grid all line up. */
const DESKTOP_BLOCK_W = 'md:max-w-[min(100%,calc((100svh_-_360px)*9/16*4_+_60px))]';

export default function VideoStrip({ video }: { video: Segment['video'] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const update = () => {
      setAtStart(el.scrollLeft <= 4);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // Scroll to an absolute card position rather than by a relative amount — the
  // last card can't snap flush left, so relative steps back from it drift.
  const step = (dir: 1 | -1) => {
    const el = scroller.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const stride = card.offsetWidth + 12; // card + gap-3 (mobile only)
    const idx = Math.round(el.scrollLeft / stride);
    const target = Math.max(0, Math.min(video.shorts.length - 1, idx + dir));
    el.scrollTo({ left: target * stride, behavior: 'smooth' });
  };

  const arrowCls =
    'grid h-11 w-11 place-items-center rounded-full border border-linen/30 text-linen transition-opacity hover:bg-linen/10 disabled:opacity-30';

  return (
    <section data-zone="dark" className="relative px-6 py-16 md:px-12 md:py-14 lg:px-16">
      <SectionGlow className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" color="rgba(62,79,58,0.35)" />

      {/* Desktop: a translucent panel lifts the row off the page */}
      <div
        className={`relative mx-auto max-w-content md:rounded-[28px] md:border md:border-linen/10 md:p-10 md:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_30px_80px_rgba(0,0,0,0.3)] md:[background:rgba(231,222,199,0.035)] md:[backdrop-filter:blur(12px)]`}
      >
        <div className={`mx-auto ${DESKTOP_BLOCK_W}`}>
          <RevealOnScroll className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-4 flex items-center gap-3 text-ember">
                <span aria-hidden="true" className="h-px w-8 bg-ember/70" />
                On Video
              </p>
              <h2 className="display-h2 text-linen text-[clamp(28px,3.6vw,44px)]" style={{ lineHeight: 1.08, textWrap: 'balance' }}>
                {video.heading}
              </h2>
            </div>
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden shrink-0 eyebrow text-ember underline-offset-4 hover:underline md:inline"
            >
              Watch more on YouTube →
            </a>
          </RevealOnScroll>

          <RevealOnScroll>
            {/* Mobile: a snap carousel; desktop: a four-column grid at the block's width. */}
            <div
              ref={scroller}
              className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-6 px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:snap-none md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0"
            >
              {video.shorts.map((id, i) => (
                <div key={id} className="w-[72%] shrink-0 snap-start sm:w-[45%] md:w-auto">
                  <ShortThumb id={id} label={`Play video ${i + 1}`} />
                </div>
              ))}
            </div>
          </RevealOnScroll>

          <div className="mt-6 flex items-center justify-between md:hidden">
            <div className="flex gap-2">
              <button type="button" onClick={() => step(-1)} disabled={atStart} aria-label="Previous video" className={arrowCls}>
                <ArrowLeft size={18} strokeWidth={1.6} />
              </button>
              <button type="button" onClick={() => step(1)} disabled={atEnd} aria-label="Next video" className={arrowCls}>
                <ArrowRight size={18} strokeWidth={1.6} />
              </button>
            </div>
            <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="eyebrow text-ember underline-offset-4 hover:underline">
              Watch more on YouTube →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
