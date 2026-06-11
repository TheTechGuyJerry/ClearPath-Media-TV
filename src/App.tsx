/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-on-surface font-body-md antialiased selection:bg-secondary-container selection:text-on-secondary-container">
        <Navbar />
        <main className="flex-grow w-full">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/programmes" element={<Programmes />} />
              
              {/* Dynamic Programme routes mapped directly to the universal Programme Detail component */}
              <Route path="/programmes/:slug" element={<ThreeThings />} />
              
              <Route path="/briefing" element={<Briefing />} />
              <Route path="/explainers" element={<Explainers />} />
              <Route path="/explainers/insights" element={<Explainers />} />
              
              {/* Fallbacks */}
              <Route path="/explainers/:id" element={<Explainers />} />

              <Route path="/about" element={<About />} />
              <Route path="/partner" element={<Partner />} />
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Redirect any other legacy URL home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </main>
        <Footer />
        <SubscribeHover />
      </div>
    </Router>
  );
}
