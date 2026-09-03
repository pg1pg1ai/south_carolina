import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SandhillsLanding from './pages/SandhillsLanding';
import StayDetail from './pages/StayDetail';
import GuestGuide from './pages/GuestGuide';
import BlogIndex from './pages/BlogIndex';
import ArticlePage from './pages/ArticlePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SandhillsLanding />} />
        <Route path="/stays/:slug" element={<StayDetail />} />
        <Route path="/guide" element={<GuestGuide />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
  );
}
