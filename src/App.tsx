/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Programmes from './pages/Programmes';
import Briefing from './pages/Briefing';
import Explainers from './pages/Explainers';
import ElectionMattersWeekly from './pages/ElectionMattersWeekly';
import AdminElectionMatters from './pages/admin/AdminElectionMatters';
import About from './pages/About';
import Partner from './pages/Partner';
import ThreeThings from './pages/ThreeThings';
import Subscribe from './pages/Subscribe';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import NewsPage from './pages/NewsPage';
import DailyEditionPage from './pages/DailyEditionPage';
import ArticlePage from './pages/ArticlePage';
import ClearPathLensPage from './pages/ClearPathLensPage';
import TodaysBriefPage from './pages/news/TodaysBriefPage';
import InFocusPage from './pages/news/InFocusPage';
import TheIndicatorPage from './pages/news/TheIndicatorPage';
import ThePublicRecordPage from './pages/news/ThePublicRecordPage';
import SignalsToWatchPage from './pages/news/SignalsToWatchPage';
import WeeklyFeaturePage from './pages/WeeklyFeaturePage';
import CategoryPage from './pages/CategoryPage';
import TopicPage from './pages/TopicPage';
import AthenaPage from './pages/AthenaPage';
import SearchPage from './pages/SearchPage';
import ArchivePage from './pages/ArchivePage';
import NotFoundPage from './pages/NotFoundPage';
import { audienceTracker } from './services/audienceTracker';

// Isolated authenticated admin imports
import { AdminProvider } from './pages/admin/AdminContext';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminConsoleHome from './pages/admin/AdminConsoleHome';
import AdminProgrammes from './pages/admin/AdminProgrammes';
import AdminClearPathDaily from './pages/admin/AdminClearPathDaily';
import AdminProgrammeDetail from './pages/admin/AdminProgrammeDetail';
import AdminVideos from './pages/admin/AdminVideos';
import AdminVideoNew from './pages/admin/AdminVideoNew';
import AdminVideoEdit from './pages/admin/AdminVideoEdit';
import AdminExplainers from './pages/admin/AdminExplainers';
import AdminExplainerDetail from './pages/admin/AdminExplainerDetail';
import AdminBriefings from './pages/admin/AdminBriefings';
import AdminPartnerships from './pages/admin/AdminPartnerships';
import AdminSubscribers from './pages/admin/AdminSubscribers';
import AdminContactMessages from './pages/admin/AdminContactMessages';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSiteSettings from './pages/admin/AdminSiteSettings';
import AdminYoutubeResearch from './pages/admin/AdminYoutubeResearch';
import AdminAudienceAnalytics from './pages/admin/AdminAudienceAnalytics';

function AppRoutes() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!isAdminPath) {
      audienceTracker.init();
      audienceTracker.trackPageView(location.pathname, document.title);
    }

    const gaId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
    if (gaId && gaId.startsWith('G-')) {
      // Initialize if script not already present
      const scriptId = 'google-analytics-gtag';
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      if (!script) {
        console.log(`[GA4] Initializing Google Analytics with ID: ${gaId}`);
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        script.async = true;
        document.head.appendChild(script);

        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).gtag = function () {
          (window as any).dataLayer.push(arguments);
        };
        (window as any).gtag('js', new Date());
      }
      
      // Send page view event
      console.log(`[GA4] Tracking pageview: ${location.pathname}${location.search}`);
      (window as any).gtag('config', gaId, {
        page_path: location.pathname + location.search,
        page_title: document.title
      });
    } else {
      console.warn('[GA4] Measurement ID is missing or invalid. Set VITE_GA4_MEASUREMENT_ID in environment variables.');
    }
  }, [location.pathname, location.search]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface font-body-md antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      {!isAdminPath && <Navbar />}
      <main className="flex-grow w-full">
        <ErrorBoundary>
          <Routes>
            {/* Public App Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/programmes" element={<Programmes />} />
            
            {/* Dynamic Programme routes mapped directly to the universal Programme Detail component */}
            <Route path="/programmes/:slug" element={<ThreeThings />} />
            <Route path="/election-matters" element={<ThreeThings forcedSlug="election-matters" />} />
            
            {/* ClearPath Daily Publications Platform Routes */}
            <Route path="/clearpath-daily" element={<Navigate to="/clearpath-daily/todays-brief" replace />} />
            <Route path="/news/todays-brief" element={<Navigate to="/clearpath-daily/todays-brief" replace />} />
            <Route path="/clearpath-daily/todays-brief" element={<TodaysBriefPage />} />
            <Route path="/todays-brief" element={<Navigate to="/clearpath-daily/todays-brief" replace />} />
            <Route path="/news/in-focus" element={<Navigate to="/clearpath-daily/in-focus" replace />} />
            <Route path="/clearpath-daily/in-focus" element={<InFocusPage />} />
            <Route path="/in-focus" element={<Navigate to="/clearpath-daily/in-focus" replace />} />
            <Route path="/news/the-indicator" element={<Navigate to="/clearpath-daily/the-indicator" replace />} />
            <Route path="/clearpath-daily/the-indicator" element={<TheIndicatorPage />} />
            <Route path="/the-indicator" element={<Navigate to="/clearpath-daily/the-indicator" replace />} />
            <Route path="/news/the-public-record" element={<Navigate to="/clearpath-daily/the-public-record" replace />} />
            <Route path="/clearpath-daily/the-public-record" element={<ThePublicRecordPage />} />
            <Route path="/the-public-record" element={<Navigate to="/clearpath-daily/the-public-record" replace />} />
            <Route path="/news/signals-to-watch" element={<Navigate to="/clearpath-daily/signals-to-watch" replace />} />
            <Route path="/clearpath-daily/signals-to-watch" element={<SignalsToWatchPage />} />
            <Route path="/signals-to-watch" element={<Navigate to="/clearpath-daily/signals-to-watch" replace />} />
            <Route path="/news/weekly-features" element={<Navigate to="/clearpath-daily/weekly-features" replace />} />
            <Route path="/news/weekly-feature" element={<Navigate to="/clearpath-daily/weekly-features" replace />} />
            <Route path="/clearpath-daily/weekly-features" element={<WeeklyFeaturePage />} />
            <Route path="/clearpath-daily/weekly-features/:slug" element={<WeeklyFeaturePage />} />
            <Route path="/clearpath-daily/weekly-feature/:slug" element={<WeeklyFeaturePage />} />
            <Route path="/clearpath-daily/weekly-feature" element={<Navigate to="/clearpath-daily/weekly-features" replace />} />
            <Route path="/weekly-features" element={<Navigate to="/clearpath-daily/weekly-features" replace />} />
            <Route path="/weekly-features/:slug" element={<WeeklyFeaturePage />} />
            <Route path="/weekly-feature" element={<Navigate to="/clearpath-daily/weekly-features" replace />} />
            <Route path="/weekly-feature/:slug" element={<WeeklyFeaturePage />} />
            <Route path="/daily/:year/:month/:day" element={<DailyEditionPage />} />
            <Route path="/daily/:year/:month/:day/:slug" element={<ArticlePage />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/clearpath-daily/:menuSlug/:slug" element={<ArticlePage />} />
            <Route path="/clearpath-lens" element={<Navigate to="/clearpath-daily/clearpath-lens" replace />} />
            <Route path="/clearpath-daily/clearpath-lens" element={<ClearPathLensPage />} />
            <Route path="/news/clearpath-lens" element={<Navigate to="/clearpath-daily/clearpath-lens" replace />} />
            <Route path="/weekly-feature/:slug" element={<WeeklyFeaturePage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/topic/:slug" element={<TopicPage />} />
            <Route path="/athena" element={<AthenaPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/archive" element={<ArchivePage />} />

            {/* Preserved Legacy Briefing and News Routes */}
            <Route path="/briefing" element={<Briefing />} />
            <Route path="/briefing/:slug" element={<Briefing />} />
            <Route path="/news/:slug" element={<NewsPage />} />
            <Route path="/explainers" element={<Explainers />} />
            <Route path="/explainers/insights" element={<Explainers />} />
            <Route path="/explainers/:id" element={<Explainers />} />

            <Route path="/election-matters-weekly" element={<ElectionMattersWeekly />} />
            <Route path="/about" element={<About />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/legal-notices" element={<Navigate to="/privacy-policy" replace />} />

            {/* Admin Authenticated Routes Group */}
            <Route path="/admin/*" element={
              <AdminProvider>
                <Routes>
                  <Route path="login" element={<AdminLogin />} />
                  
                  <Route element={<AdminLayout />}>
                    <Route index element={<AdminConsoleHome />} />
                    <Route path="programmes" element={<AdminProgrammes />} />
                    <Route path="clearpath-daily" element={<Navigate to="/admin/clearpath-daily/todays-brief" replace />} />
                    <Route path="clearpath-daily/:menuSlug" element={<AdminClearPathDaily />} />
                    <Route path="programmes/:slug" element={<AdminProgrammeDetail />} />
                    <Route path="videos" element={<AdminVideos />} />
                    <Route path="videos/new" element={<AdminVideoNew />} />
                    <Route path="videos/:videoId/edit" element={<AdminVideoEdit />} />
                    <Route path="explainers" element={<AdminExplainers />} />
                    <Route path="explainers/:slug" element={<AdminExplainerDetail />} />
                    <Route path="election-matters" element={<AdminElectionMatters />} />
                    <Route path="briefing" element={<AdminBriefings />} />
                    <Route path="partnerships" element={<AdminPartnerships />} />
                    <Route path="subscribers" element={<AdminSubscribers />} />
                    <Route path="contact-messages" element={<AdminContactMessages />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="settings" element={<AdminSiteSettings />} />
                    <Route path="youtube-research" element={<AdminYoutubeResearch />} />
                    <Route path="audience-analytics" element={<AdminAudienceAnalytics />} />
                  </Route>

                  {/* Fallback internal admin fallback redirect */}
                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
              </AdminProvider>
            } />

            {/* Catch-all route showing clean NotFoundPage */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </main>
      {!isAdminPath && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
