import type { Segment } from '../data/segments';
import Button from '../primitives/Button';
import RevealOnScroll from '../primitives/RevealOnScroll';
import { openRequestForm } from '../../lib/requestForm';

export default function SegmentCta({ finalCta }: { finalCta: Segment['finalCta'] }) {
  return (
    <section data-zone="dark" className="bg-nightWarm px-6 py-24 md:px-12 md:py-32 lg:px-16">
      <div className="max-w-content mx-auto text-center">
        <RevealOnScroll>
          <h2
            className="mx-auto max-w-[24ch] font-display font-light text-linen text-[clamp(28px,4.4vw,56px)]"
            style={{ letterSpacing: '-0.02em', lineHeight: 1.08, fontVariationSettings: '"SOFT" 40, "opsz" 60' }}
          >
            {finalCta.headline}
          </h2>
          <Button onClick={openRequestForm} variant="primary" className="mt-10">{finalCta.cta}</Button>
        </RevealOnScroll>
      </div>
    </section>
  );
}
