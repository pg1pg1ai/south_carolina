import type { Segment } from '../data/segments';
import Button from '../primitives/Button';
import Eyebrow from '../primitives/Eyebrow';
import { openRequestForm } from '../../lib/requestForm';

export default function SegmentHero({ hero }: { hero: Segment['hero'] }) {
  return (
    <section data-zone="dark" className="relative flex min-h-[88svh] items-end overflow-hidden bg-night">
      <img
        src={hero.photo}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(10,8,5,0.82), rgba(10,8,5,0.35) 55%, rgba(10,8,5,0.45))' }}
      />
      <div className="relative max-w-content mx-auto w-full px-6 pb-16 md:px-12 md:pb-24 lg:px-16">
        <Eyebrow className="text-linen/70">{hero.kicker}</Eyebrow>
        <h1
          className="mt-5 max-w-[18ch] font-display font-light text-linen text-[clamp(34px,6vw,76px)]"
          style={{ letterSpacing: '-0.025em', lineHeight: 1.04, fontVariationSettings: '"SOFT" 40, "opsz" 72' }}
        >
          {hero.headline}
        </h1>
        <p className="mt-5 max-w-text text-linen/80 text-[15px] md:text-lg">{hero.sub}</p>
        <Button onClick={openRequestForm} variant="primary" className="mt-9">{hero.cta}</Button>
      </div>
    </section>
  );
}
