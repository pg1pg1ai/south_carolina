import { useEffect } from 'react';
import StickyHeader from '../components/blocks/StickyHeader';
import Footer from '../components/blocks/Footer';
import BookingModal from '../components/blocks/BookingModal';
import YouTubeShortsWidget from '../components/blocks/YouTubeShortsWidget';
import GoogleReviewsWidget from '../components/blocks/GoogleReviewsWidget';

// Unlinked draft route for reviewing new homepage sections before they ship.
// Not in any nav, not in the sitemap — kept out of search results via robots
// meta below. Delete this page once both widgets have been approved and moved
// onto SandhillsLanding.tsx.
export default function PreviewHomepageWidgets() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  return (
    <div className="min-h-screen bg-bone">
      <StickyHeader variant="page" />

      <div data-zone="dark" className="bg-signal px-6 py-3 text-center">
        <p className="eyebrow text-linen">Draft preview — not live on the homepage yet</p>
      </div>

      <div style={{ paddingTop: 24 }}>
        <YouTubeShortsWidget />
        <GoogleReviewsWidget />
      </div>

      <Footer />
      <BookingModal />
    </div>
  );
}
