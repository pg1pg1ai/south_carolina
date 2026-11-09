import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;
const PROPERTY_COORDS: [number, number] = [-80.042, 34.576];

const TOWNS = [
  { name: 'Cheraw, SC',        note: 'Nearest town',      time: '18 min',  coords: [-79.875, 34.700] as [number, number] },
  { name: 'Camden, SC',        note: 'Historic district', time: '32 min',  coords: [-80.607, 34.247] as [number, number] },
  { name: 'Florence, SC',      note: 'Regional center',   time: '45 min',  coords: [-79.763, 34.195] as [number, number] },
  { name: 'Columbia, SC',      note: 'State capital',     time: '1 hr',    coords: [-81.035, 33.999] as [number, number] },
  { name: 'Charlotte, NC',     note: 'Major city',        time: '1 hr 30', coords: [-80.843, 35.227] as [number, number] },
  { name: 'Raleigh-Durham, NC',note: 'Research triangle', time: '2 hr 30', coords: [-78.898, 35.994] as [number, number] },
];

/** Map + list palettes. `light` is the main site; `dark` is the segment
 *  landing pages, which run dark top to bottom. */
const TONES = {
  light: {
    style: 'mapbox://styles/mapbox/light-v11',
    land: '#EAE3D3', water: '#C9B898', waterOpacity: 0.6, green: 'rgba(62,79,58,0.14)',
    building: 'rgba(31,36,32,0.07)', roadMajor: 'rgba(31,36,32,0.45)', road: 'rgba(31,36,32,0.20)',
    waterLine: '#B8A888', label: '#5A5650', halo: '#EAE3D3',
    route: '#B05329', origin: '#5A5650',
  },
  dark: {
    style: 'mapbox://styles/mapbox/dark-v11',
    land: '#1F2620', water: '#2E3D30', waterOpacity: 0.9, green: 'rgba(120,150,110,0.12)',
    building: 'rgba(231,222,199,0.06)', roadMajor: 'rgba(231,222,199,0.38)', road: 'rgba(231,222,199,0.14)',
    waterLine: '#3E4F3A', label: '#B8AE94', halo: '#1A1F1B',
    route: '#D4804E', origin: '#D4C8A8',
  },
} as const;

export default function GettingHere({ tone = 'light' }: { tone?: 'light' | 'dark' } = {}) {
  const dark = tone === 'dark';
  const T = TONES[tone];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const originMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const townsRef = useRef<HTMLDivElement>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || !MAPBOX_TOKEN) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: T.style,
      center: PROPERTY_COORDS,
      zoom: 13.5,
      attributionControl: false,
      logoPosition: 'bottom-right',
    });

    mapRef.current = map;

    map.on('style.load', () => {
      map.addSource('route', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({ id: 'route-line', type: 'line', source: 'route', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': T.route, 'line-width': 2.5, 'line-opacity': 0.85 } });

      const layers = map.getStyle().layers;
      layers.forEach((layer: { id: string; type: string }) => {
        try {
          if (layer.id === 'land' || layer.id === 'background') {
            map.setPaintProperty(layer.id, 'background-color', T.land);
          }
          if (layer.type === 'fill') {
            const id = layer.id;
            if (id === 'water' || id.includes('water')) {
              map.setPaintProperty(id, 'fill-color', T.water);
              map.setPaintProperty(id, 'fill-opacity', T.waterOpacity);
            } else if (id.includes('park') || id.includes('landuse') || id.includes('green') || id.includes('wood') || id.includes('forest')) {
              map.setPaintProperty(id, 'fill-color', T.green);
            } else if (!id.includes('building') && !id.includes('tunnel')) {
              map.setPaintProperty(id, 'fill-color', T.land);
            } else if (id.includes('building')) {
              map.setPaintProperty(id, 'fill-color', T.building);
            }
          }
          if (layer.type === 'line') {
            const id = layer.id;
            if (id.includes('road') || id.includes('street') || id.includes('path') || id.includes('transit')) {
              const isMajor = id.includes('motorway') || id.includes('trunk') || id.includes('primary');
              map.setPaintProperty(id, 'line-color', isMajor ? T.roadMajor : T.road);
            } else if (id.includes('water')) {
              map.setPaintProperty(id, 'line-color', T.waterLine);
            }
          }
          if (layer.type === 'symbol') {
            map.setPaintProperty(layer.id, 'text-color', T.label);
            map.setPaintProperty(layer.id, 'text-halo-color', T.halo);
            map.setPaintProperty(layer.id, 'text-halo-width', 1.2);
          }
        } catch (_) { /* skip layers that don't support the property */ }
      });
    });

    const el = document.createElement('div');
    el.style.cssText = `width:14px;height:14px;border-radius:50%;background:${T.route};border:2px solid ${T.halo};box-shadow:0 0 0 5px rgba(176,83,41,0.25)`;
    new mapboxgl.Marker({ element: el }).setLngLat(PROPERTY_COORDS).addTo(map);

    map.scrollZoom.disable();
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

    return () => map.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- tone is fixed per mount
  }, []);

  const resetRoute = () => {
    const map = mapRef.current;
    if (!map || !map.getSource('route')) return;
    setActiveCity(null);
    (map.getSource('route') as mapboxgl.GeoJSONSource).setData({ type: 'FeatureCollection', features: [] });
    originMarkerRef.current?.remove();
    originMarkerRef.current = null;
    map.flyTo({ center: PROPERTY_COORDS, zoom: 13.5, duration: 1000 });
  };

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (activeCity && townsRef.current && !townsRef.current.contains(e.target as Node)) {
        resetRoute();
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [activeCity]);

  const showRoute = async (town: typeof TOWNS[0]) => {
    const map = mapRef.current;
    if (!map || !map.getSource('route')) return;

    if (activeCity === town.name) {
      resetRoute();
      return;
    }

    setActiveCity(town.name);
    setRouteLoading(true);
    try {
      const res = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${town.coords[0]},${town.coords[1]};${PROPERTY_COORDS[0]},${PROPERTY_COORDS[1]}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`
      );
      const data = await res.json();
      if (data.message) {
        console.error('[Directions API]', data.message, '— check token scopes at account.mapbox.com');
        setActiveCity(null);
        return;
      }
      const geometry = data.routes?.[0]?.geometry;
      if (!geometry) { setActiveCity(null); return; }

      (map.getSource('route') as mapboxgl.GeoJSONSource).setData({ type: 'Feature', properties: {}, geometry });

      originMarkerRef.current?.remove();
      const el = document.createElement('div');
      el.style.cssText = `width:10px;height:10px;border-radius:50%;background:${T.origin};border:2px solid ${T.halo};box-shadow:0 0 0 3px rgba(90,86,80,0.18)`;
      originMarkerRef.current = new mapboxgl.Marker({ element: el }).setLngLat(town.coords).addTo(map);

      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(town.coords);
      bounds.extend(PROPERTY_COORDS);
      map.fitBounds(bounds, { padding: 56, duration: 1100, maxZoom: 12 });
    } catch (_) {
      setActiveCity(null);
    } finally {
      setRouteLoading(false);
    }
  };

  return (
    <section
      id="getting-here"
      data-zone={dark ? 'dark' : 'light'}
      className={`relative py-20 px-6 md:py-24 md:px-12 lg:px-16 ${dark ? '' : 'bg-bone'}`}
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="relative max-w-content mx-auto">
        {dark ? (
          <p className="eyebrow mb-8 flex items-center gap-3 text-ember">
            <span aria-hidden="true" className="h-px w-8 bg-ember/70" />
            Getting Here
          </p>
        ) : (
          <p className="font-eyebrow text-ink2 mb-8" style={{ fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600 }}>
            Getting here
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]" style={{ gap: 'clamp(28px, 5vw, 64px)', alignItems: 'stretch' }}>

          {/* Map + button */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              flex: 1,
              minHeight: 'clamp(260px, 45vw, 480px)',
              boxShadow: dark ? '0 30px 80px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.25)' : '0 20px 60px rgba(31,36,32,0.18), 0 8px 24px rgba(31,36,32,0.10)',
              border: dark ? '1px solid rgba(231,222,199,0.10)' : undefined,
            }}>
              <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0 }} />
              {!MAPBOX_TOKEN && (
                <div
                  className="font-eyebrow"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: 24,
                    background: T.land,
                    color: dark ? 'rgba(231,222,199,0.5)' : 'rgba(90,86,80,0.7)',
                    fontSize: 12,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  Map preview unavailable — set VITE_MAPBOX_TOKEN
                </div>
              )}
            </div>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=423+Woodmen+Rd,+Patrick+SC+29584"
              target="_blank"
              rel="noopener noreferrer"
              className="font-eyebrow text-linen bg-signal hover:bg-signal2 transition-colors rounded-full inline-flex items-center gap-2 mt-4"
              style={{ fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 300, padding: '13px 28px', textDecoration: 'none' }}
            >
              Get directions ↗
            </a>
          </div>

          {/* Towns list */}
          <div ref={townsRef}>
            {TOWNS.map((t) => {
              const isActive = activeCity === t.name;
              return (
                <button
                  key={t.name}
                  onClick={() => showRoute(t)}
                  onMouseEnter={() => setHoveredCity(t.name)}
                  onMouseLeave={() => setHoveredCity(null)}
                  disabled={routeLoading && !isActive}
                  className="group"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    textAlign: 'left',
                    background: isActive
                      ? (dark ? 'rgba(212,128,78,0.12)' : 'rgba(176,83,41,0.06)')
                      : hoveredCity === t.name
                        ? (dark ? 'rgba(212,128,78,0.07)' : 'rgba(176,83,41,0.04)')
                        : (dark ? 'rgba(231,222,199,0.04)' : 'rgba(255,255,255,0.5)'),
                    border: dark
                      ? `1px solid rgba(231,222,199,${isActive ? '0.18' : '0.09'})`
                      : `1px solid rgba(31,36,32,${isActive ? '0.14' : '0.08'})`,
                    backdropFilter: dark ? 'blur(10px)' : undefined,
                    WebkitBackdropFilter: dark ? 'blur(10px)' : undefined,
                    borderLeft: `3px solid ${isActive ? '#B05329' : hoveredCity === t.name ? 'rgba(176,83,41,0.45)' : 'rgba(176,83,41,0.15)'}`,
                    borderRadius: 10,
                    paddingLeft: 12,
                    paddingRight: 10,
                    paddingTop: 'clamp(10px, 1.4vh, 16px)',
                    paddingBottom: 'clamp(10px, 1.4vh, 16px)',
                    marginBottom: 6,
                    cursor: routeLoading && !isActive ? 'default' : 'pointer',
                    transition: 'opacity 0.2s, border-color 0.25s, background 0.2s',
                    opacity: routeLoading && !isActive ? 0.4 : 1,
                  }}
                >
                  <div>
                    <span className="font-display group-hover:text-signal transition-colors duration-200" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', fontWeight: 400, lineHeight: 1.2, display: 'block', color: isActive ? T.route : dark ? '#E7DEC7' : '#1F2420' }}>
                      {t.name}
                    </span>
                    <span className="font-eyebrow font-light" style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: isActive ? 'rgba(212,128,78,0.75)' : dark ? 'rgba(231,222,199,0.45)' : 'rgba(90,86,80,0.45)', transition: 'color 0.25s' }}>
                      {isActive ? 'Route shown ↩' : t.note}
                    </span>
                  </div>
                  <span className="font-eyebrow font-light" style={{ fontSize: 11, letterSpacing: '0.14em', whiteSpace: 'nowrap', color: isActive ? T.route : dark ? 'rgba(231,222,199,0.6)' : 'rgba(90,86,80,0.55)', transition: 'color 0.25s' }}>
                    {t.time}
                  </span>
                  <span className="font-eyebrow text-signal/30 group-hover:text-signal group-hover:translate-x-0.5 transition-all duration-200" style={{ fontSize: 13 }}>
                    →
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
