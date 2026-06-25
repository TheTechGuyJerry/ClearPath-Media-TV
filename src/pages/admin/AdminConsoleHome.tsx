import React from 'react';
import { useAdmin } from './AdminContext';
import { useNavigate } from 'react-router-dom';
import { Search, Database, Plus } from 'lucide-react';

export default function AdminConsoleHome() {
  const { 
    programmes, 
    explainers, 
    programmeVideos, 
    subscribers, 
    partnerRequests, 
    contactMessages,
    runSeeder,
    runVideosSeeder,
    loading
  } = useAdmin();
  
  const navigate = useNavigate();

  const handleSeed = async () => {
    const confirmMsg = 'Are you sure you want to run the ClearPath Catalog Seed? This will safely seed default programmes, explainers, and base siteSettings into your Firestore database.';
    if (!confirm(confirmMsg)) return;
    try {
      await runSeeder();
      alert('ClearPath Catalog seeded successfully!');
    } catch (err: any) {
      alert('Error seeding database: ' + err.message);
    }
  };

  const handleSeedVideos = async () => {
    const confirmMsg = 'Are you sure you want to seed/restore all 70 daily-briefs videos from the complete static catalog? This runs safely client-side in your browser.';
    if (!confirm(confirmMsg)) return;
    try {
      await runVideosSeeder();
      alert('Seeded 70 complete catalog videos successfully!');
    } catch (err: any) {
      alert('Error seeding videos: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col md:flex-row justify-between md:items-center bg-white p-6 rounded-lg border border-outline-variant shadow-xs gap-4">
        <div>
          <h1 className="font-display font-semibold text-2xl text-primary">Console Home Dashboard</h1>
          <p className="text-sm text-on-surface-variant">Manage programs, newsletters, postings, and global layout timings.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button 
            onClick={() => navigate('/admin/youtube-research')}
            className="bg-primary hover:bg-primary-container text-white font-semibold text-xs px-4 py-2 transition-all flex items-center gap-2 rounded cursor-pointer"
          >
            <Search className="w-4 h-4" /> Review AI-Discovered YouTube Videos
          </button>
          <button 
            onClick={handleSeed}
            disabled={loading}
            className="bg-secondary text-primary font-semibold text-xs px-4 py-2 hover:bg-secondary-container transition-all flex items-center gap-2 rounded border border-primary/20 cursor-pointer disabled:opacity-50"
          >
            <Database className="w-4 h-4" /> {loading ? 'Seeding...' : 'Seed ClearPath Catalog'}
          </button>
          <button 
            onClick={handleSeedVideos}
            disabled={loading}
            className="bg-emerald-600 text-white font-semibold text-xs px-4 py-2 hover:bg-emerald-700 transition-all flex items-center gap-2 rounded cursor-pointer disabled:opacity-50"
          >
            <Database className="w-4 h-4" /> {loading ? 'Syncing...' : 'Sync 70 Complete Videos'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-6">
        <div className="bg-white p-5 rounded-lg border border-outline-variant shadow-xs">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant">Active programmes</span>
          <p className="text-4xl font-semibold text-primary mt-2">{programmes.filter(p => p.status === 'active').length}</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-outline-variant shadow-xs">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant">Active explainers</span>
          <p className="text-4xl font-semibold text-primary mt-2">{explainers.filter(e => e.status === 'active').length}</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-outline-variant shadow-xs">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant">Published Videos</span>
          <p className="text-4xl font-semibold text-primary mt-2">{programmeVideos.filter(v => v.status === 'published').length}</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-outline-variant shadow-xs">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant">Mailing subscribers</span>
          <p className="text-4xl font-semibold text-primary mt-2">{subscribers.length}</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-outline-variant shadow-xs">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant">Partnerships leads</span>
          <p className="text-4xl font-semibold text-primary mt-2">{partnerRequests.length}</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-outline-variant shadow-xs">
          <span className="text-[10px] uppercase font-bold text-on-surface-variant">Contact Messages</span>
          <p className="text-4xl font-semibold text-primary mt-2">{contactMessages.length}</p>
        </div>
      </div>

      <section className="bg-white p-6 rounded-lg border border-outline-variant shadow-xs">
        <h2 className="font-headline-md text-primary mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/admin/programmes?new=true')} 
            className="p-4 border border-outline-variant hover:bg-surface-container-high text-left rounded cursor-pointer transition-all flex items-center gap-3 w-full"
          >
            <Plus className="w-5 h-5 text-primary" />
            <div>
              <span className="block text-sm font-semibold text-primary">New Programme card</span>
              <span className="text-xs text-on-surface-variant">Create top-level dynamic categorizations</span>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/admin/explainers?new=true')} 
            className="p-4 border border-outline-variant hover:bg-surface-container-high text-left rounded cursor-pointer transition-all flex items-center gap-3 w-full"
          >
            <Plus className="w-5 h-5 text-primary" />
            <div>
              <span className="block text-sm font-semibold text-primary">New Explainer card</span>
              <span className="text-xs text-on-surface-variant">Define structured civics topic collections</span>
            </div>
          </button>

          <button 
            onClick={() => navigate('/admin/briefing?new=true')} 
            className="p-4 border border-outline-variant hover:bg-surface-container-high text-left rounded cursor-pointer transition-all flex items-center gap-3 w-full"
          >
            <Plus className="w-5 h-5 text-primary" />
            <div>
              <span className="block text-sm font-semibold text-primary">Publish new briefing</span>
              <span className="text-xs text-on-surface-variant">Upload new morning/weekly reports</span>
            </div>
          </button>
        </div>
      </section>
    </div>
  );
}
