import type { Segment } from '../data/segments';
import { cardPhoto } from '../data/segments';
import RevealOnScroll from '../primitives/RevealOnScroll';
import SectionGlow from './SectionGlow';

/** Styled after the main site's "Just Beyond the Trees" cards (VillaCascade
 *  Act 4): full-bleed photo, copy on a translucent frosted panel. The photo
 *  is darkened only under that panel, so the rest of it stays bright. */
export default function AmenityCards({ amenities }: { amenities: Segment['amenities'] }) {
  return (
    <section data-zone="dark" className="relative px-6 pb-20 pt-10 md:px-12 md:pb-28 md:pt-16 lg:px-16">
      <SectionGlow className="right-[-10%] top-[-8%]" color="rgba(62,79,58,0.45)" />
      <SectionGlow className="bottom-[-12%] left-[-12%]" color="rgba(176,83,41,0.14)" />

      <div className="relative max-w-content mx-auto">
        <RevealOnScroll className="mb-10 max-w-3xl md:mb-14">
          <p className="eyebrow mb-4 flex items-center gap-3 text-ember">
            <span aria-hidden="true" className="h-px w-8 bg-ember/70" />
            On the Property
          </p>
          <h2 className="display-h2 text-linen text-[clamp(30px,4vw,52px)]" style={{ lineHeight: 1.06, textWrap: 'balance' }}>
            {amenities.heading}
          </h2>
        </RevealOnScroll>
        <RevealOnScroll variant="stagger-parent" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.cards.map((card) => (
            <RevealOnScroll variant="stagger-child" key={card.key}>
              <article
                className="group relative h-[clamp(260px,72vw,340px)] overflow-hidden rounded-2xl sm:h-[clamp(280px,38vw,360px)] lg:h-[clamp(320px,44vh,440px)]"
                style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.35), 0 6px 18px rgba(0,0,0,0.2)' }}
              >
                <img
                  src={cardPhoto(card.key)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1/2"
                  style={{ background: 'linear-gradient(to top, rgba(8,6,4,0.55), transparent)' }}
                />
                <div
                  className="absolute inset-x-3 bottom-3 rounded-xl border border-linen/15 px-5 py-4 transition-colors duration-300 group-hover:border-linen/25"
                  style={{
                    background: 'rgba(16,20,17,0.42)',
                    backdropFilter: 'blur(16px) saturate(1.2)',
                    WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)',
                  }}
                >
                  <h3
                    className="font-display italic text-linen leading-tight"
                    style={{ fontVariationSettings: '"opsz" 48, "SOFT" 20', fontWeight: 380, fontSize: 'clamp(1.25rem, 1.9vw, 1.55rem)', letterSpacing: '-0.01em' }}
                  >
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-[14px] leading-snug text-linen/80">{card.line}</p>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
