import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import Button from '../primitives/Button';
import RevealOnScroll from '../primitives/RevealOnScroll';

const MAPS_URL =
  'https://www.google.com/maps/place/Horizons+Sandhills/@34.6045975,-80.0974011,895m/data=!3m2!1e3!4b1!4m9!3m8!1s0x885509239aee533d:0xcf349eae7dad4eec!5m2!4m1!1i2!8m2!3d34.6045975!4d-80.0974011!16s%2Fg%2F11n3nvd0ww';

// Five-star Google reviews, supplied by the client (Oct 2026), wording verbatim.
const REVIEWS = [
  { name: 'Chelsea M.', quote: 'I don’t think I realized how much I needed a getaway like this until we arrived at Horizons Sandhills.' },
  { name: 'Kelsey C.', quote: 'Just 90 minutes from Charlotte, Horizons Sandhills has all the charm of camping with all the comforts of a boutique stay.' },
  { name: 'Justin W.', quote: 'As someone who travels quite a bit, it’s rare to find a place that genuinely feels like a getaway while still being comfortable and easy for families.' },
  { name: 'Nadine C.', quote: 'Two colleagues and I booked a villa at Horizons Sandhills for our business planning retreat and it was the perfect place!' },
  { name: 'Amber S.', quote: 'As a Mom of two young children I worried about how much I’d truly be able to relax and WOW - I feel so refreshed!' },
  { name: 'Joe M.', quote: 'Do not look for an excuse, find your way here and create memories with your favorite person.' },
  { name: 'Heather L.', quote: 'I would love to go back with my husband for a romantic type of getaway the place is so versatile!' },
  { name: 'Amanda R.', quote: 'Had a wonderful weekend retreat with our family for a sweet glamping experience. All the nature none of the hassle!' },
];

type Review = (typeof REVIEWS)[number];

/** Past this drag distance (px) or speed (px/s) a swipe changes the card. */
const SWIPE_DISTANCE = 50;
const SWIPE_VELOCITY = 400;

function Stars() {
  return (
    <div className="flex gap-0.5 text-signal" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} strokeWidth={0} fill="currentColor" />
      ))}
    </div>
  );
}

/** Google's multicolour "G" mark — brand colours kept literal on purpose. */
function GoogleLogo({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-divider bg-white/60 p-5">
      <Stars />
      <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink2">&ldquo;{review.quote}&rdquo;</p>
      <p className="mt-4 font-eyebrow text-sm text-ink">{review.name}</p>
    </div>
  );
}

/** Mobile/tablet: one card at a time; swipe or arrows, wrapping both ways. */
function ReviewCarousel() {
  const [[index, dir], setState] = useState<[number, 1 | -1]>([0, 1]);
  const reduceMotion = useReducedMotion();
  const go = (d: 1 | -1) => setState(([i]) => [(i + d + REVIEWS.length) % REVIEWS.length, d]);

  const arrowCls =
    'grid h-11 w-11 place-items-center rounded-full border border-ink/30 text-ink transition-colors hover:bg-ink/5';

  return (
    <div aria-roledescription="carousel" aria-label="Guest reviews">
      <div className="relative mx-auto max-w-md overflow-hidden">
        {/* Sizer: every card stacked invisibly in one grid cell, so the box is
            always as tall as the longest review and never jumps between cards. */}
        <div className="invisible grid" aria-hidden="true">
          {REVIEWS.map((r) => (
            <div key={r.name} className="[grid-area:1/1]"><ReviewCard review={r} /></div>
          ))}
        </div>
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
            variants={{
              enter: (d: number) => ({ x: reduceMotion ? 0 : `${d * 100}%`, opacity: reduceMotion ? 0 : 1 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: reduceMotion ? 0 : `${d * -100}%`, opacity: reduceMotion ? 0 : 1 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, { offset, velocity }) => {
              if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) go(1);
              else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) go(-1);
            }}
            aria-label={`Review ${index + 1} of ${REVIEWS.length}`}
          >
            <ReviewCard review={REVIEWS[index]} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mx-auto mt-6 flex max-w-md items-center justify-between">
        <button type="button" onClick={() => go(-1)} aria-label="Previous review" className={arrowCls}>
          <ArrowLeft size={18} strokeWidth={1.6} />
        </button>
        <p className="font-eyebrow text-[12px] tracking-[0.2em] text-ink2" aria-live="polite">
          {index + 1} / {REVIEWS.length}
        </p>
        <button type="button" onClick={() => go(1)} aria-label="Next review" className={arrowCls}>
          <ArrowRight size={18} strokeWidth={1.6} />
        </button>
      </div>
    </div>
  );
}

export default function GoogleReviewsWidget() {
  return (
    <section data-zone="light" className="bg-boneWarm py-20 px-6 md:py-28 md:px-12 lg:px-16">
      <div className="max-w-content mx-auto">
        <RevealOnScroll className="mb-10 md:mb-14">
          {/* Same heading treatment as VillaCascade's section headings ("Life Outside the Villa") */}
          <h2
            className="font-display text-ink md:whitespace-nowrap"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 0', fontWeight: 380, fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
          >
            In Our Guests’ Words
          </h2>
          <p className="mt-4 flex items-center gap-2.5 text-[15px] text-ink2 md:text-[17px]">
            <GoogleLogo />
            Rated 5.0 on Google
          </p>
        </RevealOnScroll>

        {/* Desktop: 2 rows of 4, every card the height of the tallest. */}
        <RevealOnScroll variant="stagger-parent" className="hidden auto-rows-fr grid-cols-4 gap-4 lg:grid">
          {REVIEWS.map((r) => (
            <RevealOnScroll variant="stagger-child" key={r.name} className="h-full">
              <ReviewCard review={r} />
            </RevealOnScroll>
          ))}
        </RevealOnScroll>

        <div className="lg:hidden">
          <ReviewCarousel />
        </div>

        <div className="mt-10 flex justify-center">
          <Button href={MAPS_URL} variant="secondary" newTab>Read All Reviews on Google</Button>
        </div>
      </div>
    </section>
  );
}
