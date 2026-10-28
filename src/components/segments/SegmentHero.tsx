import type { Segment } from '../data/segments';
import Button from '../primitives/Button';
import { openRequestForm } from '../../lib/requestForm';

export default function SegmentHero({ hero }: { hero: Segment['hero'] }) {
  return (
    // Full window height on every screen; on mobile the copy sits a little
    // below centre rather than pinned to the bottom edge.
    <section data-zone="dark" className="relative flex min-h-[100svh] items-center overflow-hidden bg-night md:items-end">
      <img
        src={hero.photo}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Two scrims so the copy reads on any photo: a bottom-up fade for the
          text block, plus a left-side wash on desktop where the copy sits. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(10,8,5,0.88) 0%, rgba(10,8,5,0.6) 40%, rgba(10,8,5,0.38) 75%, rgba(10,8,5,0.5) 100%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block"
        style={{ background: 'linear-gradient(to right, rgba(10,8,5,0.55) 0%, rgba(10,8,5,0.2) 50%, transparent 75%)' }}
      />
      <div className="relative max-w-content mx-auto w-full px-6 pt-28 pb-16 md:px-12 md:pb-24 lg:px-16">
        <p className="font-eyebrow font-semibold uppercase text-linen text-[12px] tracking-[0.2em] md:text-[14px]">
          {hero.kicker}
        </p>
        <h1
          className="mt-5 max-w-[18ch] font-display font-light text-linen text-[clamp(40px,6.4vw,84px)]"
          style={{ letterSpacing: '-0.025em', lineHeight: 1.04, fontVariationSettings: '"SOFT" 40, "opsz" 72', textShadow: '0 2px 24px rgba(0,0,0,0.25)' }}
        >
          {hero.headline}
        </h1>
        <p className="mt-6 max-w-[36rem] text-linen text-[18px] leading-relaxed md:text-[22px]">{hero.sub}</p>
        <Button
          onClick={openRequestForm}
          variant="primary"
          className="mt-10 w-full !px-10 !py-5 !text-[13px] sm:w-auto md:!text-[14px]"
        >
          {hero.cta}
        </Button>
      </div>
    </section>
  );
}
