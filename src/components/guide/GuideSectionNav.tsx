import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'start', label: 'Start Here' },
  { id: 'arrival', label: 'Arrival' },
  { id: 'access', label: 'Cabin' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'safety', label: 'Safety' },
  { id: 'house-rules', label: 'Rules' },
  { id: 'checkout', label: 'Checkout' },
  { id: 'food', label: 'Local Guide' },
  { id: 'things-to-do', label: 'Things To Do' },
  { id: 'medical', label: 'Medical' },
  { id: 'support', label: 'Help' },
];

export default function GuideSectionNav() {
  const [active, setActive] = useState<string>(NAV_ITEMS[0].id);
  const barRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-35% 0px -60% 0px' },
    );
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // Keep the active chip in view on mobile.
  useEffect(() => {
    const el = itemRefs.current[active];
    const bar = barRef.current;
    if (el && bar) {
      bar.scrollTo({
        left: el.offsetLeft - bar.clientWidth / 2 + el.clientWidth / 2,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    }
  }, [active, reduceMotion]);

  return (
    <nav
      className="no-print sticky top-16 z-40 bg-bone/90 border-b border-divider"
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      aria-label="Guide sections"
    >
      <div
        ref={barRef}
        className="max-w-content mx-auto px-6 md:px-10 flex gap-2 overflow-x-auto py-3"
        style={{ scrollbarWidth: 'none' }}
      >
        {NAV_ITEMS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            ref={(el) => { itemRefs.current[id] = el; }}
            className={`eyebrow shrink-0 rounded-full px-4 py-2 transition-colors ${
              active === id
                ? 'bg-signal text-linen'
                : 'text-ink2 hover:text-ink hover:bg-ink/5'
            }`}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
