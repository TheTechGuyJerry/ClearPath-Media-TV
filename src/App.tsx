/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SubscribeHover from './components/SubscribeHover';
import Home from './pages/Home';
import Programmes from './pages/Programmes';
import Briefing from './pages/Briefing';
import Explainers from './pages/Explainers';
import About from './pages/About';
import Partner from './pages/Partner';
import ThreeThings from './pages/ThreeThings';

// Isolated authenticated admin imports
import { AdminProvider } from './pages/admin/AdminContext';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminConsoleHome from './pages/admin/AdminConsoleHome';
import AdminProgrammes from './pages/admin/AdminProgrammes';
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

function AppRoutes() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    const gaId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
    if (gaId && gaId.startsWith('G-')) {
      // Initialize if script not already present
      const scriptId = 'google-analytics-gtag';
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      if (!script) {
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
      (window as any).gtag('config', gaId, {
        page_path: location.pathname + location.search,
        page_title: document.title
      });
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
            
            <Route path="/briefing" element={<Briefing />} />
            <Route path="/explainers" element={<Explainers />} />
            <Route path="/explainers/insights" element={<Explainers />} />
            
            {/* Fallbacks */}
            <Route path="/explainers/:id" element={<Explainers />} />

            <Route path="/about" element={<About />} />
            <Route path="/partner" element={<Partner />} />

            {/* Admin Authenticated Routes Group */}
            <Route path="/admin/*" element={
              <AdminProvider>
                <Routes>
                  <Route path="login" element={<AdminLogin />} />
                  
                  <Route element={<AdminLayout />}>
                    <Route index element={<AdminConsoleHome />} />
                    <Route path="programmes" element={<AdminProgrammes />} />
                    <Route path="programmes/:slug" element={<AdminProgrammeDetail />} />
                    <Route path="videos" element={<AdminVideos />} />
                    <Route path="videos/new" element={<AdminVideoNew />} />
                    <Route path="videos/:videoId/edit" element={<AdminVideoEdit />} />
                    <Route path="explainers" element={<AdminExplainers />} />
                    <Route path="explainers/:slug" element={<AdminExplainerDetail />} />
                    <Route path="briefing" element={<AdminBriefings />} />
                    <Route path="partnerships" element={<AdminPartnerships />} />
                    <Route path="subscribers" element={<AdminSubscribers />} />
                    <Route path="contact-messages" element={<AdminContactMessages />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="settings" element={<AdminSiteSettings />} />
                    <Route path="youtube-research" element={<AdminYoutubeResearch />} />
                  </Route>

                  {/* Fallback internal admin fallback redirect */}
                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
              </AdminProvider>
            } />

            {/* Redirect any other legacy URL home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <SubscribeHover />}
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
