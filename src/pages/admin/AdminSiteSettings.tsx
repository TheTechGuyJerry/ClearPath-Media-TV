import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { Save } from 'lucide-react';
import { SiteSettings } from '../../types';

export default function AdminSiteSettings() {
  const { 
    siteSettings, 
    programmes, 
    explainers, 
    handleUpdateSiteSettings, 
    loading,
    effectiveRole
  } = useAdmin();

  const [localSettings, setLocalSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (siteSettings && !localSettings) {
      setLocalSettings({ ...siteSettings });
    }
  }, [siteSettings, localSettings]);

  if (loading && !localSettings) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="font-mono text-xs text-primary">Loading timing parameters...</p>
      </div>
    );
  }

  if (!localSettings) {
    return (
      <div className="bg-white p-8 border border-outline-variant rounded-lg max-w-md mx-auto text-center font-sans mt-12 shadow-sm text-left">
        <h2 className="text-lg font-bold text-gray-800">Global Settings Not Initialized</h2>
        <p className="text-sm text-gray-655 mt-2">The system could not retrieve 'siteSettings/primary' document form Firestore. Please seed the database first.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Read-only viewers cannot modify site parameters.');
      return;
    }
    try {
      await handleUpdateSiteSettings(localSettings);
      alert('Global settings saved successfully!');
    } catch (err: any) {
      alert('Saving settings failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white p-6 border rounded-lg shadow-xs">
        <h1 className="font-display font-semibold text-2xl text-primary font-bold">Homepage Player Parameters</h1>
        <p className="text-sm text-on-surface-variant">Update primary layout parameters and background YouTube repeat loop frame numbers.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 border rounded-lg space-y-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Background Clip Video Play URL *</label>
            <input 
              type="text" 
              required 
              value={localSettings.heroVideoUrl || ''} 
              onChange={(e) => setLocalSettings({ ...localSettings, heroVideoUrl: e.target.value })} 
              className="w-full px-3 py-2 border border-outline focus:border-primary focus:ring-0 rounded text-sm bg-transparent" 
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Calculated video ID (YouTube)</label>
            <input 
              type="text" 
              disabled 
              value={localSettings.heroVideoId || ''} 
              className="w-full px-3 py-2 border border-outline rounded text-sm bg-gray-105 bg-gray-100 font-mono text-gray-500" 
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Featured Programme Identifier</label>
            <select 
              value={localSettings.featuredProgrammeId || ''} 
              onChange={(e) => setLocalSettings({ ...localSettings, featuredProgrammeId: e.target.value })} 
              className="w-full px-3 py-2 border border-outline focus:border-primary focus:ring-0 rounded text-sm bg-transparent"
            >
              <option value="">-- Choose Featured Programme --</option>
              {programmes.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Featured Explainer Identifier</label>
            <select 
              value={localSettings.featuredExplainerId || ''} 
              onChange={(e) => setLocalSettings({ ...localSettings, featuredExplainerId: e.target.value })} 
              className="w-full px-3 py-2 border border-outline focus:border-primary focus:ring-0 rounded text-sm bg-transparent"
            >
              <option value="">-- Choose Featured Explainer --</option>
              {explainers.map(ex => (
                <option key={ex.id} value={ex.id}>{ex.title}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 border-t pt-4">
            <h3 className="font-semibold text-primary mb-2 text-sm font-bold">Site Contact Coordinates</h3>
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Contact Email</label>
            <input 
              type="email" 
              value={localSettings.contactEmail || ''} 
              onChange={(e) => setLocalSettings({ ...localSettings, contactEmail: e.target.value })} 
              className="w-full px-3 py-2 border border-outline focus:border-primary focus:ring-0 rounded text-sm bg-transparent" 
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Partnership Email</label>
            <input 
              type="email" 
              value={localSettings.partnershipEmail || ''} 
              onChange={(e) => setLocalSettings({ ...localSettings, partnershipEmail: e.target.value })} 
              className="w-full px-3 py-2 border border-outline focus:border-primary focus:ring-0 rounded text-sm bg-transparent" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Mailing list Title</label>
            <input 
              type="text" 
              value={localSettings.newsletterTitle || ''} 
              onChange={(e) => setLocalSettings({ ...localSettings, newsletterTitle: e.target.value })} 
              className="w-full px-3 py-2 border border-outline focus:border-primary focus:ring-0 rounded text-sm bg-transparent" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Mailing list description</label>
            <textarea 
              value={localSettings.newsletterDescription || ''} 
              onChange={(e) => setLocalSettings({ ...localSettings, newsletterDescription: e.target.value })} 
              rows={2} 
              className="w-full px-3 py-2 border border-outline focus:border-primary focus:ring-0 rounded text-sm bg-transparent" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">Footer Copyright/Disclaimer text</label>
            <input 
              type="text" 
              value={localSettings.footerText || ''} 
              onChange={(e) => setLocalSettings({ ...localSettings, footerText: e.target.value })} 
              className="w-full px-3 py-2 border border-outline focus:border-primary focus:ring-0 rounded text-sm bg-transparent" 
            />
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t mt-4">
          <button 
            type="submit" 
            className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" /> Save timing parameters
          </button>
        </div>
      </form>
    </div>
  );
}
