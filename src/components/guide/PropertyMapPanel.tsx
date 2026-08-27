import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Plus, Minus, Maximize2 } from 'lucide-react';
import { guideData as g, mapCategories, type MapCategory } from '../data/guide';
import MapPin from './MapPin';
import JumpToSpot from './JumpToSpot';

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const MAP_SRC = '/images/guide/property-map.webp';

interface View { scale: number; tx: number; ty: number }

const RESET: View = { scale: 1, tx: 0, ty: 0 };

export default function PropertyMapPanel() {
  const reduced = useReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>(RESET);
  const [hidden, setHidden] = useState<Set<MapCategory>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; y: number; tx: number; ty: number; moved: boolean; id: number } | null>(null);

  // Keep the image covering its box: at scale s the pannable slack is (s-1)/2
  // of the box in each direction.
  const clamp = useCallback((v: View): View => {
    const box = boxRef.current;
    if (!box) return v;
    const maxX = (box.clientWidth * (v.scale - 1)) / 2;
    const maxY = (box.clientHeight * (v.scale - 1)) / 2;
    return {
      scale: v.scale,
      tx: Math.max(-maxX, Math.min(maxX, v.tx)),
      ty: Math.max(-maxY, Math.min(maxY, v.ty)),
    };
  }, []);

  const zoomBy = useCallback((delta: number) => {
    setView((v) => clamp({ ...v, scale: Math.max(MIN_SCALE, Math.min(MAX_SCALE, v.scale + delta)) }));
  }, [clamp]);

  // React's onWheel is registered passively, so preventDefault() there is a
  // no-op and the page would scroll behind the map. Attach it natively instead.
  useEffect(() => {
    const box = boxRef.current;
    if (!box || reduced) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomBy(-e.deltaY * 0.002);
    };
    box.addEventListener('wheel', onWheel, { passive: false });
    return () => box.removeEventListener('wheel', onWheel);
  }, [reduced, zoomBy]);

  // Capturing the pointer on pointerdown would redirect every subsequent event
  // to this container, so a pin's click would never land once zoomed in. Arm the
  // drag here but only capture once the pointer has actually moved — a tap stays
  // a tap and reaches the pin underneath.
  const DRAG_THRESHOLD = 5;

  const onPointerDown = (e: React.PointerEvent) => {
    if (view.scale === 1) return;
    drag.current = { x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty, moved: false, id: e.pointerId };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      d.moved = true;
      (e.currentTarget as Element).setPointerCapture?.(d.id);
      setDragging(true);
    }
    setView((v) => clamp({ ...v, tx: d.tx + dx, ty: d.ty + dy }));
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (d?.moved) (e.currentTarget as Element).releasePointerCapture?.(d.id);
    drag.current = null;
    setDragging(false);
  };

  // Centre a pin: convert its percentage position to an offset from the map's
  // centre, then translate by the negative of that at the target scale.
  const jumpTo = (id: string) => {
    const pin = g.mapPins.find((p) => p.id === id);
    const box = boxRef.current;
    setActiveId(id);
    if (!pin || !box) return;
    const scale = Math.max(view.scale, 2.5);
    setView(clamp({
      scale,
      tx: -((pin.x - 50) / 100) * box.clientWidth * scale,
      ty: -((pin.y - 50) / 100) * box.clientHeight * scale,
    }));
  };

  const toggle = (id: MapCategory) => {
    setHidden((h) => {
      const next = new Set(h);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const visible = g.mapPins.filter((p) => !hidden.has(p.category));

  return (
    <div className="guide-card overflow-hidden rounded-2xl border border-divider bg-bone">
      {/* Category filters */}
      <div className="no-print flex flex-wrap items-center gap-2 p-5">
        <p className="eyebrow mr-2 text-signal">Property Map</p>
        {mapCategories.map((c) => {
          const on = !hidden.has(c.id);
          return (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              aria-pressed={on}
              className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 eyebrow transition-colors ${
                on ? 'border-ink/25 text-ink' : 'border-ink/10 text-ink2/50'
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: on ? c.color : 'transparent', border: `1px solid ${c.color}` }}
              />
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Viewport */}
      <div
        ref={boxRef}
        onPointerDown={reduced ? undefined : onPointerDown}
        onPointerMove={reduced ? undefined : onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="relative overflow-hidden bg-night"
        style={{
          aspectRatio: '2230 / 1026',
          cursor: view.scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'default',
          touchAction: 'pan-y',
        }}
      >
        <div
          className="absolute inset-0 origin-center"
          style={{
            transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.scale})`,
            transition: reduced || dragging ? 'none' : 'transform 420ms cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <img
            src={MAP_SRC}
            alt="Aerial map of Horizons Sandhills showing the villas, guest houses, parking, lake and amenities"
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
          {visible.map((p) => (
            <MapPin
              key={p.id}
              pin={p}
              active={activeId === p.id}
              invScale={1 / view.scale}
              onSelect={setActiveId}
            />
          ))}
        </div>

        {/* Zoom controls */}
        <div
          className="no-print absolute right-3 top-3 flex flex-col overflow-hidden rounded-lg border border-linen/25"
          style={{ background: 'rgba(26,31,27,0.75)' }}
        >
          <button onClick={() => zoomBy(0.6)} aria-label="Zoom in" className="grid h-9 w-9 place-items-center text-linen hover:bg-linen/15 transition-colors">
            <Plus size={15} strokeWidth={1.8} />
          </button>
          <button onClick={() => zoomBy(-0.6)} aria-label="Zoom out" className="grid h-9 w-9 place-items-center text-linen hover:bg-linen/15 transition-colors">
            <Minus size={15} strokeWidth={1.8} />
          </button>
          <button
            onClick={() => { setView(RESET); setActiveId(null); }}
            aria-label="Reset view"
            className="grid h-9 w-9 place-items-center text-linen hover:bg-linen/15 transition-colors"
          >
            <Maximize2 size={14} strokeWidth={1.8} />
          </button>
        </div>

        {!reduced && (
          <p
            className="no-print absolute bottom-3 left-3 rounded px-2.5 py-1.5 eyebrow text-[10px] text-linen/85"
            style={{ background: 'rgba(26,31,27,0.7)' }}
          >
            Scroll to zoom · Drag to pan
          </p>
        )}
      </div>

      <JumpToSpot pins={visible} activeId={activeId} onSelect={jumpTo} />
    </div>
  );
}
