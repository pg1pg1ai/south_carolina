import { Fragment } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Segment } from '../data/segments';
import Button from '../primitives/Button';
import { openRequestForm } from '../../lib/requestForm';

/** Same on every page — the property facts that hold for every audience. */
const FACTS = [
  { value: '126', label: 'Private acres' },
  { value: '18-acre', label: 'Private lake' },
  { value: '1 hr 30', label: 'From Charlotte' },
] as const;

/** `*accent*` runs in the headline → italic, brand accent colour. */
function withAccent(text: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="font-normal italic text-ember" style={{ fontVariationSettings: '"SOFT" 80, "opsz" 72' }}>
        {part}
      </em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function SegmentHero({ hero }: { hero: Segment['hero'] }) {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay, ease: EASE } };

  return (
    <section data-zone="dark" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-night">
      <img
        src={hero.photo}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Scrims sit only where copy sits, so the rest of the photo stays bright:
          a short band at the top for the header + eyebrow, a pool behind the
          bottom-left copy block, and a fade at the very bottom that melts the
          photo into the page colour of the next section. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[34%]"
        style={{ background: 'linear-gradient(to bottom, rgba(10,8,5,0.5), transparent)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 md:hidden"
        style={{ background: 'linear-gradient(to top, rgba(10,8,5,0.82) 0%, rgba(10,8,5,0.55) 38%, transparent 68%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block"
        style={{ background: 'radial-gradient(70% 62% at 18% 88%, rgba(10,8,5,0.78) 0%, rgba(10,8,5,0.42) 48%, transparent 78%)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[22%]"
        style={{ background: 'linear-gradient(to bottom, transparent, #1A1F1B)' }}
      />

      {/* Top: the eyebrow, pulled up under the header */}
      <motion.div
        {...rise(0.1)}
        className="relative max-w-content mx-auto flex w-full items-center justify-between gap-6 px-6 pt-28 md:px-12 md:pt-40 lg:px-16"
      >
        <p className="flex items-center gap-4 font-eyebrow font-semibold uppercase text-linen text-[11px] tracking-[0.22em] md:text-[13px]">
          <span aria-hidden="true" className="h-px w-8 bg-ember md:w-12" />
          {hero.kicker}
        </p>
        <p className="hidden shrink-0 font-eyebrow font-medium uppercase text-linen/70 text-[11px] tracking-[0.22em] lg:block">
          Patrick, South Carolina
        </p>
      </motion.div>

      <div className="flex-1" />

      {/* Bottom: headline → sub + CTA, with the property facts on a glass panel */}
      <div className="relative max-w-content mx-auto w-full px-6 pb-14 md:px-12 md:pb-20 lg:px-16">
        <motion.h1
          {...rise(0.25)}
          className="max-w-[21ch] font-display font-light text-linen text-[clamp(40px,5.8vw,88px)]"
          style={{ letterSpacing: '-0.03em', lineHeight: 1, fontVariationSettings: '"SOFT" 40, "opsz" 144', textShadow: '0 2px 30px rgba(0,0,0,0.22)', textWrap: 'balance' }}
        >
          {withAccent(hero.headline)}
        </motion.h1>

        <div className="mt-8 grid grid-cols-1 items-end gap-8 md:mt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
          <motion.div {...rise(0.4)}>
            <div className="flex max-w-[38rem] gap-5">
              <span aria-hidden="true" className="mt-2 hidden w-px shrink-0 self-stretch bg-linen/30 md:block" />
              <p className="text-linen/90 text-[17px] leading-relaxed md:text-[20px]">{hero.sub}</p>
            </div>
            <Button
              onClick={openRequestForm}
              variant="primary"
              className="mt-8 w-full !px-10 !py-5 !text-[13px] shadow-[0_12px_40px_rgba(176,83,41,0.35)] sm:w-auto md:ml-[21px] md:!text-[14px]"
            >
              {hero.cta}
            </Button>
          </motion.div>

          <motion.dl
            {...rise(0.55)}
            className="hidden grid-cols-3 overflow-hidden rounded-2xl border border-linen/15 md:grid"
            style={{
              background: 'rgba(20,24,20,0.32)',
              backdropFilter: 'blur(18px) saturate(1.2)',
              WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 20px 60px rgba(0,0,0,0.25)',
            }}
          >
            {FACTS.map((f, i) => (
              <div key={f.label} className={`px-7 py-5 ${i > 0 ? 'border-l border-linen/10' : ''}`}>
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="block font-display font-light text-linen text-[28px] leading-none" style={{ letterSpacing: '-0.02em' }}>
                    {f.value}
                  </span>
                  <span className="mt-2 block eyebrow !text-[10px] text-linen/60">{f.label}</span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
