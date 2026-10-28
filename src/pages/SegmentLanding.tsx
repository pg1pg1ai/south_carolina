import { useEffect } from 'react';
import type { Segment } from '../components/data/segments';
import SegmentHeader from '../components/segments/SegmentHeader';
import SegmentHero from '../components/segments/SegmentHero';
import AmenityCards from '../components/segments/AmenityCards';
import VideoStrip from '../components/segments/VideoStrip';
import SegmentCta from '../components/segments/SegmentCta';
import RequestFormModal from '../components/blocks/RequestFormModal';
import Footer from '../components/blocks/Footer';
import { SITE_ORIGIN } from '../lib/site';

export default function SegmentLanding({ segment }: { segment: Segment }) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = segment.seo.title;

    const descTag = document.querySelector('meta[name="description"]');
    const prevDesc = descTag?.getAttribute('content') ?? null;
    descTag?.setAttribute('content', segment.seo.description);

    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = `${SITE_ORIGIN}/${segment.slug}`;
    document.head.appendChild(canonical);

    window.scrollTo(0, 0);
    return () => {
      document.title = prevTitle;
      if (prevDesc !== null) descTag?.setAttribute('content', prevDesc);
      canonical.remove();
    };
  }, [segment]);

  return (
    <div className="min-h-screen bg-bone">
      <SegmentHeader cta={segment.hero.cta} />
      <main>
        <SegmentHero hero={segment.hero} />
        <AmenityCards amenities={segment.amenities} />
        <VideoStrip video={segment.video} />
        <SegmentCta finalCta={segment.finalCta} />
      </main>
      <Footer compact />
      <RequestFormModal leadLabel={segment.leadLabel} />
    </div>
  );
}
