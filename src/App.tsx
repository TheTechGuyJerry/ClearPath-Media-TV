/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SubscribeHover from './components/SubscribeHover';
import Home from './pages/Home';
import Programmes from './pages/Programmes';
import Briefing from './pages/Briefing';
import Explainers from './pages/Explainers';
import About from './pages/About';
import Partner from './pages/Partner';
import ElectionMatters from './pages/ElectionMatters';
import ThreeThings from './pages/ThreeThings';
import Insights from './pages/Insights';
import Regional from './pages/Regional';
import MekariaSeries from './pages/MekariaSeries';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-on-surface font-body-md antialiased selection:bg-secondary-container selection:text-on-secondary-container">
        <Navbar />
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/programmes" element={<Programmes />} />
            <Route path="/programmes/election-matters" element={<ElectionMatters />} />
            <Route path="/programmes/three-things" element={<ThreeThings />} />
            <Route path="/programmes/regional" element={<Regional />} />
            <Route path="/programmes/mekaria-series" element={<MekariaSeries />} />
            <Route path="/briefing" element={<Briefing />} />
            <Route path="/explainers" element={<Explainers />} />
            <Route path="/explainers/insights" element={<Insights />} />
            <Route path="/about" element={<About />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <SubscribeHover />
      </div>
    </Router>
  );
}
