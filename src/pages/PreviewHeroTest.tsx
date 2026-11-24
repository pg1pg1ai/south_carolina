import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import SandhillsLanding from './SandhillsLanding';

// Unlinked A/B/C preview: the full homepage with one of three candidate hero photos.
// Not in any nav or sitemap, noindex. Delete once the team has picked a photo.
const OPTIONS: Record<string, { label: string; desktop: string; mobile: string; position: string }> = {
  a: { label: 'A · Two cabins & lake', desktop: '/images/sandhills/hero-test/a-desktop.webp', mobile: '/images/sandhills/hero-test/a-mobile.webp', position: '50% 60%' },
  b: { label: 'B · Cabin deck at sunset', desktop: '/images/sandhills/hero-test/b-desktop.webp', mobile: '/images/sandhills/hero-test/b-mobile.webp', position: '50% 60%' },
  c: { label: 'C · Sauna & dock', desktop: '/images/sandhills/hero-test/c-desktop.webp', mobile: '/images/sandhills/hero-test/c-mobile.webp', position: '50% 55%' },
};

export default function PreviewHeroTest() {
  const { id = 'a' } = useParams();
  const opt = OPTIONS[id] ?? OPTIONS.a;
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  return (
    <>
      <SandhillsLanding key={id} heroImage={opt} />
      <div className="max-md:!top-[72px] max-md:!bottom-auto" style={{ position: 'fixed', left: '50%', bottom: 16, transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', gap: 6, padding: 6, borderRadius: 999, background: 'rgba(16,13,9,.82)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', boxShadow: '0 8px 28px rgba(0,0,0,.35)', fontFamily: 'Inter, system-ui, sans-serif' }}>
        {Object.entries(OPTIONS).map(([k, o]) => (
          <Link key={k} to={`/preview/hero/${k}`} style={{ padding: '8px 14px', borderRadius: 999, fontSize: 13, whiteSpace: 'nowrap', textDecoration: 'none', color: k === id ? '#100D09' : 'rgba(242,237,227,.9)', background: k === id ? '#F2EDE3' : 'transparent' }}>
            <span className="hidden md:inline">{o.label}</span><span className="md:hidden">{k.toUpperCase()}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
