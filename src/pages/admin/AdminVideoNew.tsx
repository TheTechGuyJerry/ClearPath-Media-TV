import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CMSForm from '../../components/admin/CMSForm';
import { ProgrammeVideo } from '../../types';

export default function AdminVideoNew() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    programmes, 
    handleSaveItem, 
    loading,
    effectiveRole
  } = useAdmin();

  const queryProgrammeId = searchParams.get('programmeId') || '';

  const [formData, setFormData] = useState<ProgrammeVideo>({
    id: '',
    programmeId: queryProgrammeId || (programmes[0]?.id || ''),
    title: '',
    slug: '',
    shortSummary: '',
    fullDescription: '',
    youtubeUrl: '',
    youtubeVideoId: '',
    thumbnailUrl: '',
    duration: '00:00',
    presenters: '',
    guests: '',
    transcript: '',
    keyPoints: '',
    sourceLinks: '',
    topicTags: [],
    coverageArea: 'Nigeria',
    status: 'published',
    isFeatured: false,
    publishedAt: new Date().toISOString().split('T')[0],
    seoTitle: '',
    seoDescription: '',
    createdAt: '',
    updatedAt: '',
    programmeTitle: ''
  });

  // Keep programmeId synced if first programme loads later
  useEffect(() => {
    if (!queryProgrammeId && programmes.length > 0 && !formData.programmeId) {
      setFormData(prev => ({ ...prev, programmeId: programmes[0].id }));
    }
  }, [programmes, queryProgrammeId, formData.programmeId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Read-only viewers are not allowed to submit modifications.');
      return;
    }
    if (!formData.title || !formData.slug) {
      alert('Title and Slug are required.');
      return;
    }

    const cleanSlug = formData.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const foundProg = programmes.find(p => p.id === formData.programmeId);
    
    const dataToSave = { 
      ...formData, 
      slug: cleanSlug,
      programmeTitle: foundProg ? foundProg.title : ''
    };

    try {
      await handleSaveItem('programmeVideos', dataToSave);
      alert('Saved Video successfully!');
      if (queryProgrammeId) {
        navigate(`/admin/programmes/${queryProgrammeId}`);
      } else {
        navigate('/admin/videos');
      }
    } catch (err: any) {
      alert('Error saving video record: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white p-6 border rounded-lg shadow-xs">
        <h1 className="font-display font-semibold text-2xl text-primary">Add New Programme Video</h1>
        <p className="text-sm text-on-surface-variant">Register a new media broadcast entry and index metadata annotations.</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-outline-variant">
        <CMSForm
          type="programmeVideos"
          data={formData}
          programmes={programmes}
          explainers={[]}
          onChange={(updated) => setFormData(updated as ProgrammeVideo)}
          onSave={handleSave}
          onCancel={() => {
            if (queryProgrammeId) {
              navigate(`/admin/programmes/${queryProgrammeId}`);
            } else {
              navigate('/admin/videos');
            }
          }}
          uploadProgress={null}
          onFileChange={() => {}}
        />
      </div>
    </div>
  );
}
