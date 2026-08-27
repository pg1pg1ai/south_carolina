interface Props { distance: string; drive: string }

// Client-specified greens (2026-08-12). Not Tailwind tokens — kept literal here
// so the pill stays the single source of truth for them.
const DEEP = '#3c5944';  // text
const MID = '#638469';   // border, and the tint the fill is derived from

/**
 * Miles/minutes pill used across Local Guide, Things To Do, and Medical.
 * Text only, no icons.
 */
export default function DistanceChip({ distance, drive }: Props) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-3 py-1.5 eyebrow"
      style={{ color: DEEP, borderColor: MID, background: 'rgba(99,132,105,0.12)' }}
    >
      {distance} · {drive}
    </span>
  );
}
