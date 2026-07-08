import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { useParams, useNavigate } from 'react-router-dom';
import CMSForm from '../../components/admin/CMSForm';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { Programme } from '../../types';

export default function AdminProgrammeDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { 
    programmes, 
    programmeVideos, 
    explainers, 
    handleSaveItem, 
    handleDeleteItem,
    refreshCollections,
    loading,
    effectiveRole
  } = useAdmin();

  const [progSubTab, setProgSubTab] = useState<'profile' | 'videos'>('profile');

  const currentProg = programmes.find(p => p.id === slug);

  // Local state for interactive editing of the programme profile
  const [editedProg, setEditedProg] = useState<Programme | null>(null);

  useEffect(() => {
    if (currentProg) {
      setEditedProg({ ...currentProg });
    }
  }, [currentProg]);

  if (loading && !currentProg) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="font-mono text-xs text-primary">Loading programme details...</p>
      </div>
    );
  }

  if (!currentProg) {
    return (
      <div className="p-8 text-center bg-white border border-outline-variant rounded-lg max-w-md mx-auto mt-12 shadow-sm font-sans text-left">
        <h2 className="text-lg font-bold text-gray-800">Programme Not Found</h2>
        <p className="text-sm text-gray-650 mt-2">The programme with database ID "{slug}" does not exist.</p>
        <button 
          onClick={() => navigate('/admin/programmes')}
          className="mt-4 bg-primary text-white text-xs px-4 py-2 rounded font-bold uppercase transition-colors cursor-pointer"
        >
          Back to Programmes
        </button>
      </div>
    );
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Read-only viewers are not allowed to submit modifications.');
      return;
    }
    try {
      const dataToSave = editedProg || currentProg;
      await handleSaveItem('programmes', dataToSave);
      alert('Programme Profile updated successfully!');
      await refreshCollections();
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleDeleteProg = async () => {
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Viewers cannot make modifications.');
      return;
    }
    if (confirm(`Are you sure you want to permanently delete program: "${currentProg.title}" and its configurations?`)) {
      try {
        await handleDeleteItem('programmes', currentProg.id);
        alert('Deleted successfully.');
        navigate('/admin/programmes');
      } catch (err: any) {
        alert('Deletion failed: ' + err.message);
      }
    }
  };

  // Filter videos for this programme
  const filteredVideos = programmeVideos.filter(v => v.programmeId === currentProg.id);

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Row with Back button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-lg border border-outline-variant shadow-xs gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/programmes')}
            className="p-2 border border-outline-variant hover:bg-surface-container-high rounded text-on-surface-variant cursor-pointer"
            title="Back to Programmes List"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-xs uppercase text-primary font-bold font-mono tracking-wider bg-secondary px-2.5 py-0.5 rounded">Programme Panel</span>
            <h1 className="font-display font-semibold text-2xl text-primary mt-1">{currentProg.title}</h1>
            <p className="text-xs text-on-surface-variant">Slug identifier: <span className="font-mono text-primary font-semibold">{currentProg.slug}</span></p>
          </div>
        </div>
        <div className="flex gap-2.5">
          <button 
            onClick={handleDeleteProg}
            className="bg-error/10 hover:bg-error/20 text-error px-4 py-2 rounded text-xs font-semibold cursor-pointer"
          >
            Delete Programme
          </button>
        </div>
      </div>

      {/* Sub headers Tabs */}
      <div className="flex border-b border-outline-variant gap-4 bg-white/60 p-2 rounded">
        <button 
          onClick={() => setProgSubTab('profile')} 
          className={`px-4 py-2 text-sm font-medium rounded transition-colors cursor-pointer ${
            progSubTab === 'profile' ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
          }`}
        >
          Edit Programme Profile
        </button>
        <button 
          onClick={() => setProgSubTab('videos')} 
          className={`px-4 py-2 text-sm font-medium rounded transition-colors cursor-pointer ${
            progSubTab === 'videos' ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
          }`}
        >
          Programme Videos ({filteredVideos.length})
        </button>
      </div>

      {progSubTab === 'profile' && (
        <div className="bg-white p-6 rounded-lg border border-outline-variant">
          <CMSForm 
            type="programmes"
            data={editedProg || currentProg}
            programmes={programmes}
            explainers={explainers}
            onChange={(updated) => {
              setEditedProg(updated as Programme);
            }}
            onSave={handleProfileSave}
            onCancel={() => navigate('/admin/programmes')}
            uploadProgress={null}
            onFileChange={() => {}}
          />
        </div>
      )}

      {progSubTab === 'videos' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 border rounded-lg gap-4">
            <h3 className="font-semibold text-primary">Manage Videos under {currentProg.title}</h3>
            <div className="flex gap-2.5">
              <button 
                onClick={() => navigate(`/admin/videos/new?programmeId=${currentProg.id}`)}
                className="bg-primary hover:bg-primary-container text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer animate-fade-in"
              >
                <Plus className="w-3.5 h-3.5" /> Add Video
              </button>
            </div>
          </div>

          <div className="bg-white border rounded-lg overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-surface-container-high border-b border-outline-variant text-[10px] font-bold text-on-surface uppercase tracking-wider">
                <tr>
                  <th className="p-3">Thumbnail</th>
                  <th className="p-3">Video Title</th>
                  <th className="p-3">Presenters/Guests</th>
                  <th className="p-3">Link/Slug</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredVideos.map(v => {
                  const toggleVideoStatus = async () => {
                    if (effectiveRole === 'viewer') {
                      alert('Access Denied: Read-only viewers cannot toggle publish status.');
                      return;
                    }
                    const nextStatus = v.status === 'published' ? 'draft' : 'published';
                    try {
                      await updateDoc(doc(db, 'programmeVideos', v.id), { status: nextStatus, updatedAt: new Date().toISOString() });
                      alert(`Video status updated to "${nextStatus}"!`);
                      await refreshCollections();
                    } catch (err: any) {
                      alert('Save error: ' + err.message);
                    }
                  };

                  const archiveVideoItem = async () => {
                    if (effectiveRole === 'viewer') {
                      alert('Access Denied: Read-only viewers cannot archive videos.');
                      return;
                    }
                    try {
                      await updateDoc(doc(db, 'programmeVideos', v.id), { status: 'archived', updatedAt: new Date().toISOString() });
                      alert(`Video archived successfully.`);
                      await refreshCollections();
                    } catch (err: any) {
                      alert('Save error: ' + err.message);
                    }
                  };

                  const handleDeleteVideo = async () => {
                    if (effectiveRole === 'viewer') {
                      alert('Access Denied: Viewers cannot delete records.');
                      return;
                    }
                    if (confirm(`Are you sure you want to permanently delete video record: "${v.title}"?`)) {
                      try {
                        await handleDeleteItem('programmeVideos', v.id);
                        alert('Deleted video successfully.');
                        await refreshCollections();
                      } catch (err: any) {
                        alert('Deletion failed: ' + err.message);
                      }
                    }
                  };

                  return (
                    <tr key={v.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="p-3">
                        <img 
                          referrerPolicy="no-referrer"
                          src={v.thumbnailUrl || `https://img.youtube.com/vi/${v.youtubeVideoId}/hqdefault.jpg`} 
                          className="w-16 h-10 object-cover rounded border border-outline-variant" 
                          alt=""
                        />
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-primary">{v.title}</p>
                        <span className="text-[10px] text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                          {v.isFeatured && <span className="bg-amber-100 text-amber-850 text-[8px] font-bold px-1 rounded">FEATURED</span>}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-on-surface-variant font-medium">
                        <p>{v.presenters || v.presenter || 'Unassigned'}</p>
                        <p className="text-[10px] text-gray-500">{v.guests || v.guestNames}</p>
                      </td>
                      <td className="p-3 text-[11px] font-mono text-gray-550">/{v.slug}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          v.status === 'published' ? 'bg-green-100 text-green-800' : 
                          v.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{v.status || 'draft'}</span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button 
                            onClick={() => navigate(`/admin/videos/${v.id}/edit`)} 
                            className="text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2 py-1 rounded text-[10px] cursor-pointer"
                            title="Edit full"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={toggleVideoStatus}
                            className="text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded text-[10px] cursor-pointer"
                            title={v.status === 'published' ? 'Mark draft' : 'Approve publish'}
                          >
                            {v.status === 'published' ? 'Unpublish' : 'Publish'}
                          </button>
                          {v.status !== 'archived' && (
                            <button 
                              onClick={archiveVideoItem}
                              className="text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded text-[10px] cursor-pointer"
                              title="Mark archived"
                            >
                              Archive
                            </button>
                          )}
                          <a 
                            href={v.youtubeUrl || `https://www.youtube.com/watch?v=${v.youtubeVideoId}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-105 px-2 py-1 rounded text-[10px] cursor-pointer inline-flex items-center"
                            title="Watch on YouTube"
                          >
                            Preview
                          </a>
                          <button 
                            onClick={handleDeleteVideo} 
                            className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                            title="Permanently remove video record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredVideos.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-on-surface-variant italic">No videos have been added to this dynamic programme yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
