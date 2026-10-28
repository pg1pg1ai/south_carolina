import type { Segment } from '../data/segments';
import { cardPhoto } from '../data/segments';
import RevealOnScroll from '../primitives/RevealOnScroll';

/** Styled after the main site's "Just Beyond the Trees" cards (VillaCascade
 *  Act 4): full-bleed photo, copy on a dark fade at the bottom, dark section. */
export default function AmenityCards({ amenities }: { amenities: Segment['amenities'] }) {
  return (
    <section data-zone="dark" className="bg-night px-6 py-20 md:px-12 md:py-28 lg:px-16">
      <div className="max-w-content mx-auto">
        <RevealOnScroll className="mb-10 max-w-3xl md:mb-14">
          <h2 className="display-h2 text-linen text-[clamp(28px,3.8vw,48px)]">{amenities.heading}</h2>
        </RevealOnScroll>
        <RevealOnScroll variant="stagger-parent" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.cards.map((card) => (
            <RevealOnScroll variant="stagger-child" key={card.key}>
              <article className="group relative h-[clamp(240px,68vw,320px)] overflow-hidden rounded-xl sm:h-[clamp(260px,36vw,340px)] lg:h-[clamp(300px,42vh,420px)]">
                <img
                  src={cardPhoto(card.key)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-20"
                  style={{ background: 'linear-gradient(to top, rgba(8,6,4,0.97) 0%, rgba(8,6,4,0.72) 52%, transparent 100%)' }}
                >
                  <p
                    className="font-display italic text-linen leading-tight"
                    style={{ fontVariationSettings: '"opsz" 48, "SOFT" 20', fontWeight: 380, fontSize: 'clamp(1.25rem, 1.9vw, 1.55rem)', letterSpacing: '-0.01em' }}
                  >
                    {card.title}
                  </p>
                  <p className="mt-1.5 text-[14px] leading-snug text-linen/75">{card.line}</p>
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-linen/0 transition-all duration-300 group-hover:ring-linen/20" />
              </article>
            </RevealOnScroll>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
