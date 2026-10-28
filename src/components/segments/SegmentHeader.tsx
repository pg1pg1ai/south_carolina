import { useEffect, useState } from 'react';
import Button from '../primitives/Button';
import ContactButton from '../blocks/ContactButton';
import WhatsAppIcon from '../icons/WhatsAppIcon';
import { openRequestForm } from '../../lib/requestForm';
import { CONTACT_WHATSAPP_HREF } from '../../lib/contact';

/** Past this many pixels of scroll the bar gains its background. */
const SOLID_AFTER_PX = 24;

/**
 * Segment-page header — the main site's StickyHeader minus the nav: transparent
 * over the hero, solid dark once the page scrolls. The bar stays dark-on-scroll
 * on every section (light ones included) so the logo and buttons never need to
 * flip colour. Every action here opens the request form, never openBooking().
 */
export default function SegmentHeader({ cta }: { cta: string }) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > SOLID_AFTER_PX);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-[200] transition-[background-color,box-shadow,backdrop-filter] duration-500"
      style={{
        backgroundColor: solid ? 'rgba(26,31,27,0.92)' : 'transparent',
        backdropFilter: solid ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(14px)' : 'none',
        boxShadow: solid ? '0 1px 0 rgba(231,222,199,0.08)' : 'none',
      }}
    >
      {/* Over the hero, a soft scrim keeps the logo legible on bright photos */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[120px] transition-opacity duration-500"
        style={{ opacity: solid ? 0 : 1, background: 'linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)' }}
      />

      <div className="relative max-w-content mx-auto flex h-16 items-center justify-between gap-3 px-4 sm:px-6 md:h-[72px] md:px-10">
        <a href="/" className="flex shrink-0 items-center" aria-label="Horizons Sandhills — home">
          <div
            role="img"
            aria-label="Horizons Sandhills"
            style={{
              height: 'clamp(26px, 2.2vw, 36px)',
              aspectRatio: '173.882 / 47.856',
              backgroundColor: '#B05329',
              WebkitMaskImage: 'url(/logo.svg)',
              maskImage: 'url(/logo.svg)',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'left center',
              maskPosition: 'left center',
            }}
          />
        </a>

        {/* Desktop: full contact pill + page CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <ContactButton overDark />
          <Button onClick={openRequestForm} variant="primary" className="!min-h-0 !px-6 !py-2.5 whitespace-nowrap">
            {cta}
          </Button>
        </div>

        {/* Mobile: WhatsApp icon + a short CTA (page CTAs run too long to fit) */}
        <div className="flex items-center gap-2 md:hidden">
          <a
            href={CONTACT_WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact us on WhatsApp"
            className="grid h-10 w-10 place-items-center rounded-full border border-linen/50 transition-colors hover:bg-linen/10"
          >
            <WhatsAppIcon size={18} />
          </a>
          {/* Tighter type below 380px so the row still fits a 320px phone */}
          <Button
            onClick={openRequestForm}
            variant="primary"
            className="!min-h-[40px] !px-4 !py-2 whitespace-nowrap max-[379px]:!px-3 max-[379px]:!text-[10px] max-[379px]:!tracking-[0.12em]"
          >
            Plan your stay
          </Button>
        </div>
      </div>
    </header>
  );
}
