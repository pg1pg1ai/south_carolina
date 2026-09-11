import { MapPin as PinIcon } from 'lucide-react';
import { mapCategories, type MapPin as Pin } from '../data/guide';

interface Props {
  pins: Pin[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function JumpToSpot({ pins, activeId, onSelect }: Props) {
  // Group by category, in the same order as the filter chips above the map.
  // A category with no visible pins (hidden by the filters) drops out entirely.
  const groups = mapCategories
    .map((c) => ({ ...c, pins: pins.filter((p) => p.category === c.id) }))
    .filter((c) => c.pins.length > 0);

  return (
    <div className="no-print p-5">
      <p className="eyebrow mb-4 text-ink2">Jump to a spot</p>
      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-5">
        {groups.map((c) => (
          <div key={c.id}>
            <p className="eyebrow mb-2 flex items-center gap-2 text-ink">
              <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: c.color }} />
              {c.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {c.pins.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelect(p.id)}
                  aria-pressed={activeId === p.id}
                  className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors ${
                    activeId === p.id
                      ? 'bg-signal/10 text-signal'
                      : 'text-ink2 hover:bg-ink/5 hover:text-ink'
                  }`}
                >
                  <PinIcon size={11} strokeWidth={1.8} className="shrink-0 text-signal" />
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
