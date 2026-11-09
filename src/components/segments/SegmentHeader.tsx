import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../primitives/Button';
import ContactButton from '../blocks/ContactButton';
import WhatsAppIcon from '../icons/WhatsAppIcon';
import { openRequestForm } from '../../lib/requestForm';
import { CONTACT_WHATSAPP_HREF } from '../../lib/contact';

/** Scroll distance over which the header settles into its scrolled state. */
const SETTLE_PX = 180;

/** Logo heights, hero → scrolled. Desktop matches the main site's StickyHeader:
 *  the 64px full-colour hero logo, settling at the 36px it shows once scrolled. */
const LOGO_H = { desktop: [64, 36], mobile: [32, 28] } as const;

function useIsDesktop() {
  const query = '(min-width: 768px)';
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return match;
}

/**
 * Segment-page header — behaves like the main site's StickyHeader, minus the
 * nav: the full-colour logo starts large over the hero and shrinks as the page
 * scrolls, and the bar never turns into a solid block — a blurred, softly
 * masked backdrop fades in instead, so there is no hard bottom edge. Every
 * page is dark throughout, so the logo and buttons never need to flip colour.
 *
 * The CTA carries the page's own label at every breakpoint (client, round 2).
 * Every action here opens the request form, never openBooking().
 */
export default function SegmentHeader({ cta }: { cta: string }) {
  const isDesktop = useIsDesktop();
  const [from, to] = isDesktop ? LOGO_H.desktop : LOGO_H.mobile;
  const { scrollY } = useScroll();

  const logoH = useTransform(scrollY, [0, SETTLE_PX], [from, to]);
  const barH = useTransform(logoH, (h) => h + (isDesktop ? 36 : 28));
  const backdrop = useTransform(scrollY, [0, SETTLE_PX * 0.6], [0, 1]);
  const heroScrim = useTransform(scrollY, [0, SETTLE_PX], [1, 0]);
  const backdropH = useTransform(barH, (h) => h + 28);

  return (
    <header className="fixed inset-x-0 top-0 z-[200]">
      {/* Over the hero: a soft scrim keeps the logo legible on bright photos */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[140px]"
        style={{ opacity: heroScrim, background: 'linear-gradient(to bottom, rgba(0,0,0,0.42), transparent)' }}
      />
      {/* Scrolled: blur + a light tint that dissolves downward — no solid bar */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: backdropH,
          opacity: backdrop,
          background: 'linear-gradient(to bottom, rgba(16,20,17,0.62) 0%, rgba(16,20,17,0.34) 60%, transparent 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
        }}
      />

      <motion.div
        className="relative max-w-content mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 md:px-10"
        style={{ height: barH }}
      >
        <a href="/" className="flex shrink-0 items-center" aria-label="Horizons Sandhills — home">
          <motion.img
            src="/logo.svg"
            alt="Horizons Sandhills"
            style={{ height: logoH, width: 'auto', display: 'block' }}
          />
        </a>

        {/* Desktop: full contact pill + page CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <ContactButton overDark />
          <Button onClick={openRequestForm} variant="primary" className="!min-h-0 !px-6 !py-2.5 whitespace-nowrap">
            {cta}
          </Button>
        </div>

        {/* Mobile: WhatsApp icon + the same CTA label. On phones too narrow
            for both, the icon drops (WhatsApp is still in the final CTA) so
            the label always fits — sooner for the longer page labels. */}
        <div className="flex items-center gap-1.5 md:hidden">
          <a
            href={CONTACT_WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact us on WhatsApp"
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-linen/50 text-linen transition-colors hover:bg-linen/10 ${cta.length > 17 ? 'max-[399px]:hidden' : 'max-[349px]:hidden'}`}
          >
            <WhatsAppIcon size={16} />
          </a>
          <Button
            onClick={openRequestForm}
            variant="primary"
            className="!min-h-[38px] !px-4 !py-2 !text-[10px] !tracking-[0.12em] whitespace-nowrap max-[349px]:!px-3 max-[349px]:!tracking-[0.06em]"
          >
            {cta}
          </Button>
        </div>
      </motion.div>
    </header>
  );
}
