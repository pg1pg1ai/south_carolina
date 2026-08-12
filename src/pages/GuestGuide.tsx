import { useEffect } from 'react';
import { Printer, Umbrella, Utensils, Flame, Armchair, PlugZap } from 'lucide-react';
import StickyHeader from '../components/blocks/StickyHeader';
import Footer from '../components/blocks/Footer';
import BookingModal from '../components/blocks/BookingModal';
import GuideHero from '../components/guide/GuideHero';
import GuideSectionNav from '../components/guide/GuideSectionNav';
import GuideSection from '../components/guide/GuideSection';
import CopyButton from '../components/guide/CopyButton';
import GuideCard from '../components/guide/GuideCard';
import PropertyMap, { ParkingCards, ParkingNotes } from '../components/guide/PropertyMap';
import AccessSlideshow from '../components/guide/AccessSlideshow';
import PlaceList, { PlaceRow } from '../components/guide/PlaceList';
import Button from '../components/primitives/Button';
import RevealOnScroll from '../components/primitives/RevealOnScroll';
import { guideData as g, mapsDir, telHref, smsHref, GUIDE_PHONE_DISPLAY } from '../components/data/guide';

const AMENITY_ICONS = {
  umbrella: Umbrella,
  utensils: Utensils,
  flame: Flame,
  armchair: Armchair,
  'plug-zap': PlugZap,
} as const;

export default function GuestGuide() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = g.meta.title;
    window.scrollTo(0, 0);
    return () => { document.title = prevTitle; };
  }, []);

  return (
    <div className="min-h-screen bg-bone">
      <div className="no-print">
        <StickyHeader variant="page" />
      </div>

      <GuideHero />
      <GuideSectionNav />

      <main>
        <GuideSection id="start" index="01" eyebrow="Start Here" title="The essentials, in one place"
          sub="The details guests reach for first. Address, arrival times, Wi-Fi, and how to reach us.">
          <RevealOnScroll className="grid gap-4 md:grid-cols-2">
            {/* Address */}
            <GuideCard accent="orange">
              <p className="eyebrow text-ink2">Property Address</p>
              <p className="mt-2 font-display font-light text-ink text-xl">{g.meta.address}</p>
              <p className="mt-1 text-[13px] text-ink2">GPS {g.meta.gps} · Nearest town {g.meta.nearestTown}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button href={mapsDir(g.meta.address)} variant="primary" newTab className="!py-2 !px-5 !min-h-0">Get Directions</Button>
                <CopyButton value={g.meta.address} label="Copy Address" />
              </div>
            </GuideCard>

            {/* Wi-Fi */}
            <GuideCard accent="green">
              <p className="eyebrow text-ink2">Wi-Fi</p>
              <div className="mt-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] text-ink2">Network</p>
                    <p className="font-eyebrow text-sm text-ink">{g.wifi.network}</p>
                  </div>
                  <CopyButton value={g.wifi.network} label="Copy" accent="orange" />
                </div>
                {/* Literal divider hex — a gradient can't reference a Tailwind colour class. */}
                <hr
                  className="my-3 h-px border-0"
                  style={{ background: 'linear-gradient(to right, #D9CEB8 0%, #D9CEB8 55%, transparent 100%)' }}
                />
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] text-ink2">Password</p>
                    <p className="font-eyebrow text-sm text-ink">{g.wifi.password}</p>
                  </div>
                  <CopyButton value={g.wifi.password} label="Copy" accent="orange" />
                </div>
              </div>
            </GuideCard>

            {/* Support */}
            <GuideCard accent="green">
              <p className="eyebrow text-ink2">Guest Support · 24/7</p>
              <p className="mt-2 font-display font-light text-ink text-xl">{g.meta.manager} · {GUIDE_PHONE_DISPLAY}</p>
              <div className="no-print mt-4 flex gap-2">
                <Button href={telHref} variant="secondary" className="!py-2 !px-5 !min-h-0">Call</Button>
                <Button href={smsHref()} variant="secondary" className="!py-2 !px-5 !min-h-0">Text</Button>
              </div>
            </GuideCard>

            {/* Offline */}
            <GuideCard accent="orange">
              <p className="eyebrow text-ink2">Offline access</p>
              <p className="mt-2 font-display font-light text-ink text-xl">{g.offline.title}</p>
              <p className="mt-1 text-[13px] leading-snug text-ink2">{g.offline.note}</p>
              <button
                onClick={() => window.print()}
                className="no-print mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 eyebrow text-bone hover:bg-ink/85 transition-colors"
              >
                <Printer size={13} strokeWidth={1.6} />
                Download Guide
              </button>
            </GuideCard>
          </RevealOnScroll>
        </GuideSection>

        <GuideSection id="arrival" index="02" eyebrow="Arrival" title="Getting here" band>
          <div className="grid gap-10 lg:grid-cols-2">
            <RevealOnScroll>
              <ol className="space-y-5">
                {g.arrival.steps.map((s, i) => (
                  <li key={s} className="flex gap-4">
                    <span className="numeral mt-0.5 shrink-0 text-signal">{String(i + 1).padStart(2, '0')}</span>
                    <p className="text-[15px] leading-relaxed text-ink">{s}</p>
                  </li>
                ))}
              </ol>
              <div className="no-print mt-8">
                <Button href={mapsDir(g.meta.address)} variant="secondary" newTab className="!py-2.5 !px-6 !min-h-0">Open in Maps</Button>
              </div>
              <ParkingNotes />
            </RevealOnScroll>
            <RevealOnScroll delay={0.15}>
              <ParkingCards />
            </RevealOnScroll>
          </div>
          <RevealOnScroll className="mt-10">
            <PropertyMap />
          </RevealOnScroll>
        </GuideSection>

        <GuideSection id="access" index="03" eyebrow="Cabin Access" title="Getting into your cabin"
          sub="From your car to the porch in five steps. Read them first, then swipe through the photos.">
          <div className="grid gap-10 lg:grid-cols-2">
            <RevealOnScroll>
              <ol className="space-y-6">
                {g.access.steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="numeral mt-1 shrink-0 text-signal">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="font-display font-light text-ink text-lg" style={{ fontVariationSettings: '"SOFT" 30, "opsz" 32' }}>{s.title}</h3>
                      <p className="mt-1 text-[14px] leading-relaxed text-ink2">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </RevealOnScroll>
            <RevealOnScroll delay={0.15}>
              <AccessSlideshow />
              <div className="guide-card mt-4 rounded-2xl border border-signal/30 bg-signal/5 p-5">
                <p className="font-eyebrow text-sm text-ink">{g.access.trouble.title}</p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink2">{g.access.trouble.body}</p>
                <a href={telHref} className="no-print eyebrow mt-3 inline-block rounded-full bg-signal px-5 py-2.5 text-linen hover:bg-signal2 transition-colors">
                  Call Guest Support
                </a>
              </div>
            </RevealOnScroll>
          </div>
        </GuideSection>

        <GuideSection id="amenities" index="04" eyebrow="Amenities" title="Using the property" band
          sub="Cedar barrel sauna, firepit, grill, EV chargers, and the small comforts that make the stay easy.">
          {/* Featured: sauna */}
          <RevealOnScroll className="guide-card overflow-hidden rounded-2xl border border-divider bg-white/40 lg:grid lg:grid-cols-2">
            <img src={g.amenities.featured.photo} alt="Cedar barrel sauna interior" className="h-64 w-full object-cover lg:h-full" />
            <div className="p-6 md:p-8">
              <p className="eyebrow text-signal">{g.amenities.featured.kicker}</p>
              <h3 className="display-h2 mt-2 text-ink text-[clamp(24px,3vw,36px)]">{g.amenities.featured.name}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink2">{g.amenities.featured.body}</p>
              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-divider pt-5">
                {g.amenities.featured.stats.map((s) => (
                  <div key={s.label}>
                    <p className="eyebrow text-ink2">{s.label}</p>
                    <p className="mt-1 font-display font-light text-ink text-lg">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          {/* Smaller amenity cards */}
          <RevealOnScroll variant="stagger-parent" className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {g.amenities.cards.map((c) => {
              const Icon = AMENITY_ICONS[c.icon as keyof typeof AMENITY_ICONS];
              return (
                <RevealOnScroll variant="stagger-child" key={c.name}>
                  <div className="guide-card h-full rounded-xl border border-divider bg-white/40 p-4">
                    <Icon size={18} strokeWidth={1.4} className="text-ink2" />
                    <p className="mt-3 font-eyebrow text-sm text-ink">{c.name}</p>
                    <p className="mt-1 text-[13px] leading-snug text-ink2">{c.note}</p>
                  </div>
                </RevealOnScroll>
              );
            })}
          </RevealOnScroll>
        </GuideSection>

        <GuideSection id="house-rules" index="05" eyebrow="House Rules" title="A calm place for everyone"
          sub="A short list. Please treat the cabin the way you would want the next guest to treat it.">
          <RevealOnScroll variant="stagger-parent" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {g.rules.map((r, i) => (
              <RevealOnScroll variant="stagger-child" key={r.title}>
                <div className="guide-card h-full rounded-xl border border-divider bg-bone p-5">
                  <p className="numeral text-signal">{String(i + 1).padStart(2, '0')}</p>
                  <p className="mt-2 font-eyebrow text-sm text-ink">{r.title}</p>
                  <p className="mt-1 text-[13px] leading-snug text-ink2">{r.note}</p>
                </div>
              </RevealOnScroll>
            ))}
          </RevealOnScroll>
        </GuideSection>

        <GuideSection id="food" index="06" eyebrow="Local Guide" title="Nearby, curated" band
          sub="Where we send friends. One pick per category — tap “Show all” for the full list.">
          <PlaceList categories={g.localGuide} />
        </GuideSection>

        <GuideSection id="things-to-do" index="07" eyebrow="Things To Do" title="Explore the Sandhills"
          sub="Trails, parks, and quiet detours worth the drive.">
          <PlaceList categories={g.thingsToDo} />
        </GuideSection>

        <GuideSection id="medical" index="08" eyebrow="Medical" title="Care nearby" band sub={g.medical.note}>
          <RevealOnScroll className="mb-4">
            <div className="no-print flex gap-2">
              <a href="tel:911" className="eyebrow rounded-full bg-signal px-5 py-2.5 text-linen hover:bg-signal2 transition-colors">Call 911</a>
              <a href={telHref} className="eyebrow rounded-full border border-ink px-5 py-2.5 text-ink hover:bg-ink hover:text-bone transition-colors">Guest Support</a>
            </div>
          </RevealOnScroll>
          <RevealOnScroll className="grid gap-3 sm:grid-cols-2">
            {g.medical.hospitals.map((h) => <PlaceRow key={h.name} place={h} />)}
          </RevealOnScroll>
        </GuideSection>

        <GuideSection id="support" index="09" eyebrow="Help" title="Questions & guest support"
          sub="Common questions. If yours is not here, we are one tap away.">
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <RevealOnScroll>
              <div className="border-t border-divider">
                {g.faq.map((f) => (
                  <details key={f.q} className="border-b border-divider py-4">
                    <summary className="flex items-center justify-between gap-4">
                      <span className="font-eyebrow text-sm text-ink">{f.q}</span>
                      <span className="chev text-signal text-xl leading-none">+</span>
                    </summary>
                    <p className="mt-3 max-w-text text-[14px] leading-relaxed text-ink2">{f.a}</p>
                  </details>
                ))}
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.15}>
              <div className="guide-card rounded-2xl border border-divider bg-white/40 p-6">
                <p className="eyebrow text-ink2">Guest Support</p>
                <p className="mt-2 font-display font-light text-ink text-xl">Still need a hand?</p>
                <p className="mt-1 text-[13px] leading-snug text-ink2">
                  {g.meta.manager} is on call around the clock. Quick to answer, quick to help.
                </p>
                <div className="no-print mt-4 flex flex-col gap-2">
                  <a href={telHref} className="eyebrow rounded-full bg-signal px-5 py-3 text-center text-linen hover:bg-signal2 transition-colors">Call {GUIDE_PHONE_DISPLAY}</a>
                  <a href={smsHref()} className="eyebrow rounded-full border border-ink px-5 py-3 text-center text-ink hover:bg-ink hover:text-bone transition-colors">Text {GUIDE_PHONE_DISPLAY}</a>
                  <a href={smsHref('Hi Daniil, I would like to report an issue at Horizons Sandhills: ')} className="eyebrow px-5 py-2 text-center text-ink2 hover:text-ink transition-colors">Report an Issue</a>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Farewell */}
          <RevealOnScroll className="mt-16 border-t border-divider pt-10 text-center">
            <p className="font-display font-light italic text-ink text-[clamp(20px,2.6vw,30px)]" style={{ fontVariationSettings: '"SOFT" 50, "opsz" 72' }}>
              {g.farewell}
            </p>
          </RevealOnScroll>
        </GuideSection>
      </main>

      <div className="no-print">
        <Footer />
      </div>
      <BookingModal />
    </div>
  );
}
