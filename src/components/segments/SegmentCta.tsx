import type { Segment } from '../data/segments';
import Button from '../primitives/Button';
import RevealOnScroll from '../primitives/RevealOnScroll';
import { openRequestForm } from '../../lib/requestForm';
import { CONTACT_WHATSAPP_HREF } from '../../lib/contact';

/** Same forest photo as the main site's "Take the Stay. Make the Story." block. */
const BG_PHOTO = '/images/sandhills/final_image.webp';

export default function SegmentCta({ finalCta }: { finalCta: Segment['finalCta'] }) {
  return (
    <section
      data-zone="dark"
      className="relative flex min-h-[70svh] items-center overflow-hidden bg-night px-6 py-24 md:min-h-[85svh] md:px-12 lg:px-16"
    >
      <img
        src={BG_PHOTO}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        width={2400}
        height={1600}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(8,10,8,0.55), rgba(8,10,8,0.45) 50%, rgba(8,10,8,0.7))' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(110% 70% at 50% 50%, rgba(8,10,8,0.45) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-content mx-auto w-full text-center">
        <RevealOnScroll>
          <h2
            className="mx-auto max-w-[18ch] font-display font-light text-linen text-[clamp(36px,6.4vw,84px)]"
            style={{ letterSpacing: '-0.03em', lineHeight: 1.04, fontVariationSettings: '"SOFT" 50, "opsz" 144' }}
          >
            {finalCta.headline}
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button onClick={openRequestForm} variant="primary" className="w-full !px-10 !py-5 !text-[13px] sm:w-auto">
              {finalCta.cta}
            </Button>
            <Button href={CONTACT_WHATSAPP_HREF} variant="ghost-light" newTab className="w-full backdrop-blur-md sm:w-auto">
              Message us on WhatsApp
            </Button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
