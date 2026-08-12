import { guideData as g } from '../data/guide';
import PropertyMapPanel from './PropertyMapPanel';

/** Parking A–D legend, each led by a round letter badge. */
export function ParkingCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {g.arrival.parking.map((p) => (
        <div key={p.id} className="guide-card flex items-start gap-3 rounded-xl border border-divider bg-bone p-4">
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-signal/50 bg-signal/10 font-eyebrow text-xs font-semibold text-signal">
            {p.id}
          </span>
          <div>
            <p className="font-eyebrow text-sm text-ink">{p.title}</p>
            <p className="mt-0.5 text-[13px] leading-snug text-ink2">{p.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Parking rules, each with an orange left accent bar. */
export function ParkingNotes() {
  return (
    <ul className="mt-6 space-y-3">
      {g.arrival.parkingNotes.map((n) => (
        <li key={n} className="border-l-2 border-signal pl-4 text-[13px] leading-relaxed text-ink2">{n}</li>
      ))}
    </ul>
  );
}

export default function PropertyMap() {
  return <PropertyMapPanel />;
}
