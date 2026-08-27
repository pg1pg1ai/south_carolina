import { useState } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import RevealOnScroll from '../primitives/RevealOnScroll';
import DistanceChip from './DistanceChip';
import { mapsDir, type GuideCategory, type GuidePlace } from '../data/guide';

export function PlaceRow({ place }: { place: GuidePlace }) {
  return (
    <div className="guide-card flex h-full flex-col rounded-xl border border-divider bg-white/40 p-5">
      <p className="font-eyebrow text-sm text-ink">{place.name}</p>
      <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-ink2">{place.blurb}</p>
      <div className="mt-3 flex items-end justify-between gap-3 border-t border-divider pt-3">
        <div>
          <p className="text-[12px] text-ink2">{place.address}</p>
          <div className="mt-1.5"><DistanceChip distance={place.distance} drive={place.drive} /></div>
        </div>
        <a
          href={mapsDir(`${place.name}, ${place.address}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="no-print eyebrow flex shrink-0 items-center gap-1 text-signal hover:text-signal2 transition-colors"
        >
          Directions <ArrowUpRight size={12} strokeWidth={2} />
        </a>
      </div>
    </div>
  );
}

export default function PlaceList({ categories }: { categories: GuideCategory[] }) {
  const [activeId, setActiveId] = useState(categories[0].id);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div>
      {/* Category chips */}
      <div className="no-print flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className={`eyebrow rounded-full px-4 py-2 transition-colors ${
              activeId === c.id ? 'bg-ink text-bone' : 'border border-ink/20 text-ink2 hover:bg-ink/5'
            }`}
            aria-pressed={activeId === c.id}
          >
            {c.label}
          </button>
        ))}
      </div>

      {categories.map((c) => {
        const featured = c.places[c.featured];
        const rest = c.places.filter((_, i) => i !== c.featured);
        const open = !!expanded[c.id];
        const isActive = activeId === c.id;

        return (
          <div key={c.id} className={isActive ? 'mt-8' : 'hidden print:block mt-8'}>
            {/* Category label shows in print, where chips are hidden */}
            <p className="print-show hidden eyebrow mb-3 text-ink2">{c.label}</p>

            {/* Featured pick */}
            <RevealOnScroll className="guide-card rounded-2xl border border-signal/30 bg-white/40 p-6">
              <p className="eyebrow text-signal">Horizons Pick</p>
              <h3 className="mt-2 font-display font-light text-ink text-[clamp(20px,2.4vw,28px)]" style={{ fontVariationSettings: '"SOFT" 30, "opsz" 32' }}>
                {featured.name}
              </h3>
              <p className="mt-2 max-w-text text-[14px] leading-relaxed text-ink2">{featured.blurb}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                <DistanceChip distance={featured.distance} drive={featured.drive} />
                <span className="text-[12px] text-ink2">{featured.address}</span>
                <a
                  href={mapsDir(`${featured.name}, ${featured.address}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-print eyebrow flex items-center gap-1 text-signal hover:text-signal2 transition-colors"
                >
                  Directions <ArrowUpRight size={12} strokeWidth={2} />
                </a>
              </div>
            </RevealOnScroll>

            {/* The rest */}
            {rest.length > 0 && (
              <>
                <button
                  onClick={() => setExpanded((e) => ({ ...e, [c.id]: !e[c.id] }))}
                  className="no-print mt-4 flex items-center gap-1.5 eyebrow text-ink2 hover:text-ink transition-colors"
                  aria-expanded={open}
                >
                  {open ? 'Show less' : `Show all (${c.places.length})`}
                  <ChevronDown size={13} strokeWidth={2} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
                <div className={open ? 'mt-4 grid gap-3 sm:grid-cols-2' : 'hidden print:grid mt-4 gap-3 sm:grid-cols-2'}>
                  {rest.map((p) => <PlaceRow key={p.name} place={p} />)}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
