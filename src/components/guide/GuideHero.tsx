import { MapPin, Phone, MessageSquare, Wifi, Map, Siren } from 'lucide-react';
import Button from '../primitives/Button';
import RevealOnScroll from '../primitives/RevealOnScroll';
import { guideData as g, mapsDir, telHref, smsHref, GUIDE_PHONE_DISPLAY } from '../data/guide';

// `newTab` only on the external maps link — tel:, sms:, and in-page anchors
// must stay in the current tab.
const quickActions = [
  { label: 'Directions', icon: MapPin, href: mapsDir(g.meta.address), newTab: true },
  { label: 'Call', icon: Phone, href: telHref, newTab: false },
  { label: 'Text', icon: MessageSquare, href: smsHref(), newTab: false },
  { label: 'Wi-Fi', icon: Wifi, href: '#start', newTab: false },
  { label: 'Map', icon: Map, href: '#arrival', newTab: false },
  // The Safety section was removed; Medical keeps the 911 button and hospitals.
  { label: 'Emergency', icon: Siren, href: '#medical', newTab: false },
];

export default function GuideHero() {
  const { cards } = g.hero;
  return (
    <section data-zone="dark" className="relative min-h-[92svh] flex flex-col justify-end overflow-hidden">
      <img
        src={g.hero.photo}
        alt="Horizons Sandhills — lake with barrel sauna, wooden dock and canoe at golden hour"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(10,8,5,0.35) 0%, rgba(10,8,5,0.2) 40%, rgba(10,8,5,0.78) 100%)' }}
      />

      <div className="relative max-w-content mx-auto w-full px-6 md:px-10 pb-10 md:pb-14 pt-40">
        <RevealOnScroll>
          <p className="eyebrow-lg text-linen/80">{g.hero.eyebrow}</p>
          <h1 className="display mt-3 text-linen text-[clamp(40px,7vw,84px)] leading-[1.02]">{g.hero.title}</h1>
          <p className="mt-4 max-w-text text-linen/80 text-[15px] md:text-lg">{g.hero.sub}</p>

          <div className="no-print mt-8 flex flex-wrap gap-3">
            <Button href="#start" variant="primary">Start Here</Button>
            {/* Overridden locally rather than in the ghost-light variant — five
                landing-page call sites depend on that variant unchanged. */}
            <Button
              href={mapsDir(g.meta.address)}
              variant="ghost-light"
              newTab
              className="!border-linen bg-linen/15 backdrop-blur-sm hover:!bg-linen/25"
            >
              Get Directions
            </Button>
          </div>
        </RevealOnScroll>

        {/* Info cards */}
        <RevealOnScroll variant="stagger-parent" className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            { label: cards.checkIn.label, value: cards.checkIn.value, note: cards.checkIn.note, support: false, lateCheckout: false },
            { label: cards.checkOut.label, value: cards.checkOut.value, note: cards.checkOut.note, support: false, lateCheckout: true },
            { label: cards.support.label, value: GUIDE_PHONE_DISPLAY, note: cards.support.note, support: true, lateCheckout: false },
          ].map((c) => (
            <RevealOnScroll variant="stagger-child" key={c.label}>
              <div className="guide-card h-full rounded-2xl border border-linen/20 bg-night/25 p-5" style={{ backdropFilter: 'blur(8px)' }}>
                <p className="eyebrow text-linen/60">{c.label}</p>
                <p className="mt-2 font-display font-light text-linen text-2xl">{c.value}</p>
                <p className="mt-1 text-linen/60 text-[13px] leading-snug">{c.note}</p>
                {c.support && (
                  <div className="no-print mt-3 flex gap-2">
                    <a href={telHref} className="eyebrow rounded-full border border-linen/40 px-4 py-2 text-linen hover:bg-linen/10 transition-colors">Call</a>
                    <a href={smsHref()} className="eyebrow rounded-full border border-linen/40 px-4 py-2 text-linen hover:bg-linen/10 transition-colors">Text</a>
                  </div>
                )}
                {/* The Checkout section was removed — this is now the only
                    late-checkout affordance on the page. */}
                {c.lateCheckout && (
                  <div className="no-print mt-3">
                    <a
                      href={smsHref(g.checkout.lateSms)}
                      className="eyebrow inline-block rounded-full border border-linen/40 px-4 py-2 text-linen hover:bg-linen/10 transition-colors"
                    >
                      Request Late Checkout
                    </a>
                  </div>
                )}
              </div>
            </RevealOnScroll>
          ))}
        </RevealOnScroll>

        {/* Quick actions */}
        <div className="no-print mt-6 flex flex-wrap gap-2">
          {quickActions.map(({ label, icon: Icon, href, newTab }) => (
            <a
              key={label}
              href={href}
              target={newTab ? '_blank' : undefined}
              rel={newTab ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-2 rounded-full border border-linen/25 px-4 py-2 text-linen/85 hover:bg-linen/10 transition-colors"
            >
              <Icon size={14} strokeWidth={1.6} className="text-ember" />
              <span className="eyebrow">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
