import { Star } from 'lucide-react';
import Button from '../primitives/Button';
import RevealOnScroll from '../primitives/RevealOnScroll';

const MAPS_URL =
  'https://www.google.com/maps/place/Horizons+Sandhills/@34.6045975,-80.0974011,895m/data=!3m2!1e3!4b1!4m9!3m8!1s0x885509239aee533d:0xcf349eae7dad4eec!5m2!4m1!1i2!8m2!3d34.6045975!4d-80.0974011!16s%2Fg%2F11n3nvd0ww';

// PLACEHOLDER CONTENT. These are not real guest reviews — swap them for actual
// five-star quotes from the Google Business Profile before this section ships.
const PLACEHOLDER_REVIEWS = [
  { name: 'Guest Name', quote: 'Sample review text goes here — swap in a real guest quote before this section goes live.' },
  { name: 'Guest Name', quote: 'Placeholder testimonial. Replace with an actual five-star review pulled from the Google Business Profile.' },
  { name: 'Guest Name', quote: 'This is draft copy only, standing in for a real guest review while we test the layout.' },
  { name: 'Guest Name', quote: 'Another placeholder quote — final content will come from your real Google reviews.' },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-signal" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} strokeWidth={0} fill="currentColor" />
      ))}
    </div>
  );
}

export default function GoogleReviewsWidget() {
  return (
    <section data-zone="light" className="bg-boneWarm py-20 px-6 md:py-28 md:px-12 lg:px-16">
      <div className="max-w-content mx-auto">
        <RevealOnScroll className="mb-10 md:mb-14 max-w-3xl">
          <p className="eyebrow text-signal">Five-Star Reviews on Google</p>
          <h2 className="display-h2 mt-4 text-ink text-[clamp(28px,4vw,48px)]">What guests are saying</h2>
        </RevealOnScroll>

        <div className="no-print mb-8 rounded-xl border border-signal/30 bg-signal/10 px-5 py-3 text-[13px] leading-relaxed text-ink2">
          <strong className="text-ink">Placeholder content —</strong> the four quotes below are sample copy for
          reviewing the layout only. Send over 4–6 real five-star reviews and they'll be swapped in before this
          ever reaches the live homepage.
        </div>

        <RevealOnScroll variant="stagger-parent" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLACEHOLDER_REVIEWS.map((r, i) => (
            <RevealOnScroll variant="stagger-child" key={i}>
              <div className="h-full rounded-2xl border border-divider bg-white/60 p-5">
                <Stars />
                <p className="mt-3 text-[14px] leading-relaxed text-ink2">&ldquo;{r.quote}&rdquo;</p>
                <p className="mt-4 font-eyebrow text-sm text-ink">{r.name}</p>
              </div>
            </RevealOnScroll>
          ))}
        </RevealOnScroll>

        <div className="mt-10 flex justify-center">
          <Button href={MAPS_URL} variant="secondary" newTab>Read All Reviews on Google</Button>
        </div>
      </div>
    </section>
  );
}
