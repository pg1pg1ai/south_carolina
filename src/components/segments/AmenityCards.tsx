import type { Segment } from '../data/segments';
import { cardPhoto } from '../data/segments';
import RevealOnScroll from '../primitives/RevealOnScroll';

export default function AmenityCards({ amenities }: { amenities: Segment['amenities'] }) {
  return (
    <section data-zone="light" className="bg-boneWarm px-6 py-20 md:px-12 md:py-28 lg:px-16">
      <div className="max-w-content mx-auto">
        <RevealOnScroll className="mb-10 max-w-3xl md:mb-14">
          <h2 className="display-h2 text-ink text-[clamp(26px,3.6vw,44px)]">{amenities.heading}</h2>
        </RevealOnScroll>
        <RevealOnScroll variant="stagger-parent" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.cards.map((card) => (
            <RevealOnScroll variant="stagger-child" key={card.key}>
              <article className="h-full overflow-hidden rounded-2xl bg-bone">
                <img
                  src={cardPhoto(card.key)}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="px-6 py-6">
                  <p className="font-display text-ink text-[19px] leading-snug">{card.title}</p>
                  <p className="mt-2 text-ink2 text-[15px]">{card.line}</p>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
