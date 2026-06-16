import React from 'react';
import { useAdmin } from './AdminContext';
import YoutubeResearchPanel from '../../components/admin/YoutubeResearchPanel';

export default function AdminYoutubeResearch() {
  const { 
    programmes, 
    refreshCollections,
    effectiveRole
  } = useAdmin();

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white p-6 border rounded-lg shadow-xs">
        <h1 className="font-display font-semibold text-2xl text-primary font-bold">YouTube Research Panel</h1>
        <p className="text-sm text-on-surface-variant">Perform discovery scans, load verified YouTube channel uploads, annotate with AI, and import directly into active video indices.</p>
      </div>

      <div className="bg-white p-6 border rounded-lg shadow-xs">
        <YoutubeResearchPanel 
          programmes={programmes} 
          onVideoApproved={refreshCollections} 
          effectiveRole={effectiveRole}
        />
      </div>
    </div>
  );
}
