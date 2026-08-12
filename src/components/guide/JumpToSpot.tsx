import { MapPin as PinIcon } from 'lucide-react';
import type { MapPin as Pin } from '../data/guide';

interface Props {
  pins: Pin[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function JumpToSpot({ pins, activeId, onSelect }: Props) {
  return (
    <div className="no-print p-5">
      <p className="eyebrow mb-3 text-ink2">Jump to a spot</p>
      <div className="flex flex-wrap gap-2">
        {pins.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            aria-pressed={activeId === p.id}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 eyebrow transition-colors ${
              activeId === p.id
                ? 'border-signal bg-signal/10 text-signal'
                : 'border-ink/15 text-ink2 hover:bg-ink/5'
            }`}
          >
            <PinIcon size={11} strokeWidth={1.8} className="text-signal" />
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
