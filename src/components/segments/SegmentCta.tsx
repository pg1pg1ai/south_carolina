import type { Segment } from '../data/segments';
import Button from '../primitives/Button';
import RevealOnScroll from '../primitives/RevealOnScroll';
import { openRequestForm } from '../../lib/requestForm';
import { CONTACT_WHATSAPP_HREF } from '../../lib/contact';

/** Same forest photo as the main site's "Take the Stay. Make the Story." block. */
const BG_PHOTO = '/images/sandhills/final_image.webp';

/** Past this length a headline would wrap to a third line at the default size
 *  (client, round 2: keep it to two), so it steps down a size. */
const LONG_HEADLINE = 40;

/** Both buttons share these, so they render at exactly the same size. */
const BTN = 'w-full !px-8 !py-5 !text-[13px] border';

export default function SegmentCta({ finalCta }: { finalCta: Segment['finalCta'] }) {
  const long = finalCta.headline.length > LONG_HEADLINE;
  return (
    <section
      data-zone="dark"
      className="relative flex min-h-[70svh] items-center overflow-hidden px-6 py-28 md:min-h-[85svh] md:px-12 lg:px-16"
    >
      <img
        src={BG_PHOTO}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        width={2400}
        height={1600}
      />
      {/* The photo emerges from the page colour above and sinks into the
          footer below; in between it is darkened only behind the copy. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[28%]"
        style={{ background: 'linear-gradient(to bottom, #1A1F1B, transparent)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(60% 46% at 50% 52%, rgba(8,10,8,0.62) 0%, rgba(8,10,8,0.3) 55%, transparent 100%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[28%]"
        style={{ background: 'linear-gradient(to bottom, transparent, #232924)' }}
      />

      <div className="relative max-w-content mx-auto w-full text-center">
        <RevealOnScroll>
          <h2
            className={`mx-auto font-display font-light text-linen ${
              long ? 'max-w-[26ch] text-[clamp(32px,4.4vw,62px)]' : 'max-w-[22ch] text-[clamp(36px,5.6vw,80px)]'
            }`}
            style={{ letterSpacing: '-0.03em', lineHeight: 1.05, fontVariationSettings: '"SOFT" 50, "opsz" 144', textWrap: 'balance', textShadow: '0 2px 30px rgba(0,0,0,0.3)' }}
          >
            {finalCta.headline}
          </h2>
          <div className="mx-auto mt-10 grid max-w-[640px] grid-cols-1 gap-3 sm:grid-cols-2">
            <Button onClick={openRequestForm} variant="primary" className={`${BTN} border-signal hover:border-signal2`}>
              {finalCta.cta}
            </Button>
            <Button href={CONTACT_WHATSAPP_HREF} variant="ghost-light" newTab className={`${BTN} backdrop-blur-md`}>
              Message us on WhatsApp
            </Button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
