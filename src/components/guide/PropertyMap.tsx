import { guideData as g } from '../data/guide';

export default function PropertyMap() {
  return (
    <div>
      {/* Illustrated property map */}
      <div className="guide-card rounded-2xl border border-divider bg-bone overflow-hidden">
        <img
          src="/images/guide/property-map.webp"
          alt="Illustrated map of Horizons Sandhills — cabins, parking, sauna, firepit, and lake"
          className="block w-full h-auto"
        />
      </div>

      {/* Parking legend */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {g.arrival.parking.map((p) => (
          <div key={p.id} className="guide-card flex items-start gap-3 rounded-xl border border-divider bg-bone p-4">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-signal/50 bg-signal/10 font-eyebrow text-xs font-semibold text-signal">{p.id}</span>
            <div>
              <p className="font-eyebrow text-sm text-ink">{p.title}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-ink2">{p.note}</p>
            </div>
          </div>
        ))}
      </div>
      <ul className="mt-4 space-y-1.5">
        {g.arrival.parkingNotes.map((n) => (
          <li key={n} className="text-[13px] leading-relaxed text-ink2">— {n}</li>
        ))}
      </ul>
    </div>
  );
}
