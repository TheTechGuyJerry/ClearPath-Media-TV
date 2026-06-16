import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { useParams, useNavigate } from 'react-router-dom';
import CMSForm from '../../components/admin/CMSForm';
import { ProgrammeVideo } from '../../types';

export default function AdminVideoEdit() {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { 
    programmeVideos, 
    programmes, 
    handleSaveItem, 
    loading,
    effectiveRole
  } = useAdmin();

  const currentVideo = programmeVideos.find(v => v.id === videoId);
  const [formData, setFormData] = useState<ProgrammeVideo | null>(null);

  // Initialize form data when video loads
  useEffect(() => {
    if (currentVideo && !formData) {
      setFormData({ ...currentVideo });
    }
  }, [currentVideo, formData]);

  if (loading && !formData) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="font-mono text-xs text-primary">Loading video profile...</p>
      </div>
    );
  }

  if (!currentVideo || !formData) {
    return (
      <div className="p-8 text-center bg-white border border-outline-variant rounded-lg max-w-md mx-auto mt-12 shadow-sm font-sans text-left">
        <h2 className="text-lg font-bold text-gray-800">Video Record Not Found</h2>
        <p className="text-sm text-gray-650 mt-2">The video record with database ID "{videoId}" does not exist.</p>
        <button 
          onClick={() => navigate('/admin/videos')}
          className="mt-4 bg-primary text-white text-xs px-4 py-2 rounded font-bold uppercase transition-colors cursor-pointer"
        >
          Back to Videos List
        </button>
      </div>
    );
  }

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
      navigate('/admin/videos');
    } catch (err: any) {
      alert('Error saving video record: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white p-6 border rounded-lg shadow-xs">
        <h1 className="font-display font-semibold text-2xl text-primary">Edit Programme Video</h1>
        <p className="text-sm text-on-surface-variant">Update metadata, thumbnail, guest registry, and content annotations for video "{currentVideo.title}".</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-outline-variant">
        <CMSForm
          type="programmeVideos"
          data={formData}
          programmes={programmes}
          explainers={[]}
          onChange={(updated) => setFormData(updated as ProgrammeVideo)}
          onSave={handleSave}
          onCancel={() => navigate('/admin/videos')}
          uploadProgress={null}
          onFileChange={() => {}}
        />
      </div>
    </div>
  );
}
