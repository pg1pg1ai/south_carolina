import { useEffect, useState } from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';

/** Dark-glass drive-time chips over the "Every road leads here" map.
 *  A town inside the frame gets a dot + chip; a town outside it (Raleigh on
 *  the cropped view) gets its chip where its route enters the frame, with ↗. */

type Town = { name: string; note: string; time: string; coords: [number, number] };
const EMBER = '#D4804E';
const EDGE = 14;

export default function RouteChips({ map, towns, routes, active, onPick }: {
  map: MapboxMap | null;
  towns: Town[];
  routes: Record<string, { coords: [number, number][] }>;
  active: string | null;
  onPick: (t: Town) => unknown;
}) {
  const [pos, setPos] = useState<{ x: number; y: number; out: boolean }[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!map) return;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = map.getContainer();
        const w = el.clientWidth, h = el.clientHeight;
        const inside = (x: number, y: number) => x > EDGE && x < w - EDGE && y > EDGE && y < h - EDGE;
        setSize({ w, h });
        setPos(towns.map((t) => {
          const p = map.project(t.coords);
          if (inside(p.x, p.y)) return { x: p.x, y: p.y, out: false };
          // walk the route from the town towards the property; first point in frame
          for (const c of routes[t.name]?.coords ?? []) {
            const q = map.project(c as [number, number]);
            if (inside(q.x, q.y)) return { x: q.x, y: q.y, out: true };
          }
          return { x: -999, y: -999, out: true };
        }));
      });
    };
    update();
    map.on('move', update);
    map.on('resize', update);
    return () => { map.off('move', update); map.off('resize', update); cancelAnimationFrame(raf); };
  }, [map, towns, routes]);

  if (!size.w) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {pos.map((p, i) => {
        const t = towns[i];
        const on = active === t.name;
        // zoomed onto one route: drop the edge chips of the others (they share highways and pile up)
        if (p.x < -100 || (p.out && active && !on)) return null;
        const flip = p.x > size.w - 190;
        return (
          <div key={t.name}>
            {!p.out && (
              <span aria-hidden="true" style={{
                position: 'absolute', left: p.x - 6, top: p.y - 6, width: 12, height: 12, borderRadius: '50%',
                background: on ? EMBER : '#1F2420', border: '2.5px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,.35)',
              }} />
            )}
            <button
              type="button"
              onClick={() => onPick(t)}
              aria-pressed={on}
              className="font-eyebrow"
              style={{
                position: 'absolute', left: p.x, top: p.y,
                transform: `translate(${flip ? 'calc(-100% - 14px)' : '14px'}, ${!p.out ? '-50%' : p.y > size.h / 2 ? 'calc(-100% - 6px)' : '6px'})`,
                pointerEvents: 'auto', cursor: 'pointer', whiteSpace: 'nowrap',
                padding: '6px 12px', borderRadius: 999, fontSize: 12, letterSpacing: '0.03em',
                background: on ? 'rgba(212,128,78,0.95)' : 'rgba(20,25,21,0.78)',
                border: `1px solid ${on ? EMBER : 'rgba(231,222,199,0.18)'}`,
                color: '#F2EDE3', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                boxShadow: '0 6px 18px rgba(0,0,0,.28)', transition: 'background .2s, border-color .2s',
              }}
            >
              {t.name.split(',')[0]} <span style={{ color: on ? '#fff' : EMBER }}>{t.time}</span>{p.out ? ' ↗' : ''}
            </button>
          </div>
        );
      })}
    </div>
  );
}
