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
  const small = size.w < 520;
  const H = small ? 26 : 30;
  // Place each chip on the first free side (right, left, then a row below/above), so none overlap.
  const boxes: { l: number; r: number; t: number; b: number }[] = [];
  const place = pos.map((p, i) => {
    const t = towns[i];
    const on = active === t.name;
    if (p.x < -100 || (p.out && active && !on)) return null; // zoomed in: drop the others' edge chips
    const label = `${t.name.split(',')[0]} ${t.time}${p.out ? ' ↗' : ''}`;
    const w = Math.round(label.length * (small ? 6.3 : 6.9) + (small ? 20 : 26));
    const tries: [number, number][] = [[1, 0], [-1, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]];
    let best: { side: number; dy: number } = { side: p.x > size.w - w - 30 ? -1 : 1, dy: 0 };
    for (const [side, row] of tries) {
      const l = side > 0 ? p.x + 12 : p.x - 12 - w;
      const top = p.y - H / 2 + row * (H + 4);
      const box = { l, r: l + w, t: top, b: top + H };
      const inside = box.l >= 4 && box.r <= size.w - 4 && box.t >= 4 && box.b <= size.h - 4;
      if (inside && !boxes.some((o) => box.l < o.r && o.l < box.r && box.t < o.b && o.t < box.b)) { best = { side, dy: row * (H + 4) }; boxes.push(box); break; }
    }
    return best;
  });
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {pos.map((p, i) => {
        const t = towns[i];
        const on = active === t.name;
        const pl = place[i];
        if (!pl) return null;
        const flip = pl.side < 0;
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
                transform: `translate(${flip ? 'calc(-100% - 12px)' : '12px'}, calc(-50% + ${pl.dy}px))`,
                pointerEvents: 'auto', cursor: 'pointer', whiteSpace: 'nowrap',
                height: H, padding: small ? '0 9px' : '0 12px', borderRadius: 999, fontSize: small ? 11 : 12, letterSpacing: '0.03em',
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
