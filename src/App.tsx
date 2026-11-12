import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SandhillsLanding from './pages/SandhillsLanding';
import StayDetail from './pages/StayDetail';
import GuestGuide from './pages/GuestGuide';
import BlogIndex from './pages/BlogIndex';
import ArticlePage from './pages/ArticlePage';
import PreviewHomepageWidgets from './pages/PreviewHomepageWidgets';
import PrivacyPolicy, { PRIVACY_POLICY_PATH } from './pages/PrivacyPolicy';
import { segments } from './components/data/segments';
import PrivacyChoicesModal from './components/blocks/PrivacyChoicesModal';
import SegmentLanding from './pages/SegmentLanding';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SandhillsLanding />} />
        <Route path="/stays/:slug" element={<StayDetail />} />
        <Route path="/guide" element={<GuestGuide />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<ArticlePage />} />
        <Route path="/preview/homepage-widgets" element={<PreviewHomepageWidgets />} />
        <Route path={PRIVACY_POLICY_PATH} element={<PrivacyPolicy />} />
        {segments.map((s) => (
          <Route key={s.slug} path={`/${s.slug}`} element={<SegmentLanding segment={s} />} />
        ))}
      </Routes>
      <PrivacyChoicesModal />
    </BrowserRouter>
  );
}
