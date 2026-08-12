import type { MapPin as Pin } from '../data/guide';
import { mapCategories } from '../data/guide';

interface Props {
  pin: Pin;
  active: boolean;
  /** Inverse of the map's zoom, so pins keep a constant screen size. */
  invScale: number;
  onSelect: (id: string) => void;
}

export default function MapPin({ pin, active, invScale, onSelect }: Props) {
  const color = mapCategories.find((c) => c.id === pin.category)?.color ?? '#1F2420';

  return (
    <button
      type="button"
      onClick={() => onSelect(pin.id)}
      aria-label={pin.label}
      aria-pressed={active}
      className="absolute z-10 grid place-items-center"
      style={{
        left: `${pin.x}%`,
        top: `${pin.y}%`,
        // Counter-scale so the pin stays legible at any zoom, and keep a 44px
        // hit target regardless of the visual dot size.
        transform: `translate(-50%, -50%) scale(${invScale})`,
        width: 44,
        height: 44,
      }}
    >
      <span
        className="block rounded-full border-2 border-linen transition-transform"
        style={{
          background: color,
          width: active ? 18 : 13,
          height: active ? 18 : 13,
          boxShadow: '0 1px 6px rgba(10,8,5,0.55)',
        }}
      />
      <span
        className={`pointer-events-none absolute left-1/2 top-full -translate-x-1/2 mt-1 whitespace-nowrap rounded px-2 py-1 eyebrow text-[10px] text-linen transition-opacity ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ background: 'rgba(26,31,27,0.92)' }}
      >
        {pin.label}
      </span>
    </button>
  );
}
