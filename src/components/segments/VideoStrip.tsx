import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Segment } from '../data/segments';
import RevealOnScroll from '../primitives/RevealOnScroll';
import ShortThumb from '../primitives/ShortThumb';

const CHANNEL_URL = 'https://www.youtube.com/@HorizonsGetaways/';

/** Desktop card width, sized from the viewport height so the heading and the
 *  9:16 cards fit on one screen together (the 340px covers the fixed header,
 *  the heading and the section padding). */
const DESKTOP_CARD_W = 'md:w-[min(30%,calc((100svh-340px)*9/16))]';

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
    const stride = card.offsetWidth + 12; // card + gap-3
    const idx = Math.round(el.scrollLeft / stride);
    const target = Math.max(0, Math.min(video.shorts.length - 1, idx + dir));
    el.scrollTo({ left: target * stride, behavior: 'smooth' });
  };

  const arrowCls =
    'grid h-11 w-11 place-items-center rounded-full border border-ink/30 text-ink transition-opacity hover:bg-ink/5 disabled:opacity-30';

  return (
    <section data-zone="light" className="bg-bone px-6 py-20 md:px-12 md:py-14 lg:px-16">
      <div className="max-w-content mx-auto">
        <RevealOnScroll className="mb-8 flex items-end justify-between gap-6 md:mb-8">
          <h2 className="display-h2 text-ink text-[clamp(28px,3.6vw,44px)]">{video.heading}</h2>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 eyebrow text-signal underline-offset-4 hover:underline md:inline"
          >
            Watch more on YouTube →
          </a>
        </RevealOnScroll>

        <RevealOnScroll>
          {/* Mobile: a snap carousel; desktop: one centred row. */}
          <div
            ref={scroller}
            className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-6 px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:snap-none md:justify-center md:gap-5 md:overflow-visible md:px-0"
          >
            {video.shorts.map((id, i) => (
              <div key={id} className={`w-[72%] shrink-0 snap-start sm:w-[45%] ${DESKTOP_CARD_W}`}>
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
          <a href={CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="eyebrow text-signal underline-offset-4 hover:underline">
            Watch more on YouTube →
          </a>
        </div>
      </div>
    </section>
  );
}
