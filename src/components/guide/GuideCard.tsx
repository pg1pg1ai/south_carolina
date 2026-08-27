import type { ReactNode } from 'react';

interface Props {
  accent: 'green' | 'orange';
  className?: string;
  children: ReactNode;
}

const BAR = {
  green: 'bg-longleaf',
  orange: 'bg-signal',
} as const;

/**
 * §01 card shell. The accent bar runs 80% of the card's height, vertically
 * centred on the left edge — not full-bleed, per the client's revision.
 */
export default function GuideCard({ accent, className = '', children }: Props) {
  return (
    <div className={`guide-card relative rounded-2xl border border-divider bg-white/40 p-6 ${className}`}>
      <span
        aria-hidden="true"
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-full ${BAR[accent]}`}
        style={{ height: '80%' }}
      />
      {children}
    </div>
  );
}
