import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, X, Trash2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const formatFirebaseDate = (dateVal: any): string => {
  if (!dateVal) return 'Not available';
  if (typeof dateVal === 'string' && (dateVal.trim() === '' || dateVal.toLowerCase().includes('invalid'))) {
    return 'Not available';
  }
  
  if (dateVal && typeof dateVal.toDate === 'function') {
    try {
      const d = dateVal.toDate();
      if (d && !isNaN(d.getTime())) {
        return d.toLocaleDateString();
      }
    } catch (e) {}
  }

  if (dateVal && typeof dateVal.seconds === 'number') {
    try {
      return new Date(dateVal.seconds * 1000).toLocaleDateString();
    } catch (e) {}
  }

  if (dateVal && typeof dateVal._seconds === 'number') {
    try {
      return new Date(dateVal._seconds * 1000).toLocaleDateString();
    } catch (e) {}
  }

  try {
    const parsedDate = new Date(dateVal);
    if (parsedDate && !isNaN(parsedDate.getTime()) && parsedDate.toString() !== 'Invalid Date') {
      return parsedDate.toLocaleDateString();
    }
  } catch (e) {}

  return 'Not available';
};

export default function AdminVideos() {
  const navigate = useNavigate();
  const { 
    programmeVideos, 
    programmes, 
    handleDeleteItem, 
    refreshCollections,
    loading,
    effectiveRole
  } = useAdmin();

  const [videoSearchTerm, setVideoSearchTerm] = useState('');
  const [videoSelectedProgId, setVideoSelectedProgId] = useState('all');

  // Inline Editing States
  const [videoInlineEditId, setVideoInlineEditId] = useState<string | null>(null);
  const [videoInlineData, setVideoInlineData] = useState<{
    title: string;
    shortSummary: string;
    programmeId: string;
  } | null>(null);

  const startInlineEdit = (video: any) => {
    setVideoInlineEditId(video.id);
    setVideoInlineData({
      title: video.title || '',
      shortSummary: video.shortSummary || '',
      programmeId: video.programmeId || ''
    });
  };

  const saveInlineEdit = async (video: any) => {
    if (!videoInlineData) return;
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Read-only viewers cannot modify entries.');
      return;
    }
    try {
      const foundProg = programmes.find(p => p.id === videoInlineData.programmeId);
      const payload = {
        title: videoInlineData.title,
        shortSummary: videoInlineData.shortSummary,
        programmeId: videoInlineData.programmeId,
        programmeTitle: foundProg ? foundProg.title : '',
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'programmeVideos', video.id), payload);
      alert('Inline edits saved successfully!');
      setVideoInlineEditId(null);
      setVideoInlineData(null);
      await refreshCollections();
    } catch (err: any) {
      alert('Error saving inline edits: ' + err.message);
    }
  };

  const toggleStatus = async (video: any) => {
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Read-only viewers cannot toggle publish status.');
      return;
    }
    const newStatus = video.status === 'published' ? 'draft' : 'published';
    try {
      await updateDoc(doc(db, 'programmeVideos', video.id), { status: newStatus, updatedAt: new Date().toISOString() });
      alert(`Video status toggled to "${newStatus}"!`);
      await refreshCollections();
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    }
  };

  const archiveVideo = async (video: any) => {
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Read-only viewers cannot archive records.');
      return;
    }
    try {
      await updateDoc(doc(db, 'programmeVideos', video.id), { status: 'archived', updatedAt: new Date().toISOString() });
      alert('Video status archived successfully.');
      await refreshCollections();
    } catch (err: any) {
      alert('Error archiving video: ' + err.message);
    }
  };

  const handleDeleteVideo = async (video: any) => {
    if (effectiveRole === 'viewer_admin' || effectiveRole === 'viewer') {
      alert('Access Denied: Viewers cannot make modifications.');
      return;
    }
    if (confirm(`Are you sure you want to delete video record: "${video.title}" permanently?`)) {
      try {
        const deleted = await handleDeleteItem('programmeVideos', video.id, true);
        if (deleted) {
          alert('Deleted video successfully.');
          await refreshCollections();
        }
      } catch (err: any) {
        alert('Deletion failed: ' + err.message);
      }
    }
  };

  const filteredVideos = programmeVideos.filter(video => {
    if (videoSelectedProgId !== 'all' && video.programmeId !== videoSelectedProgId) return false;
    if (videoSearchTerm.trim() !== '') {
      const q = videoSearchTerm.toLowerCase();
      const matchTitle = video.title?.toLowerCase().includes(q);
      const matchTags = Array.isArray(video.topicTags) 
        ? video.topicTags.some(t => t.toLowerCase().includes(q))
        : typeof video.topicTags === 'string' && (video.topicTags as string).toLowerCase().includes(q);
      return matchTitle || matchTags;
    }
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white p-6 border border-outline-variant rounded-lg shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display font-semibold text-2xl text-primary">Programme Videos Management</h1>
          <p className="text-sm text-on-surface-variant">Update metadata, assign and categorize video assets, corrected display timings, or toggle featured statuses.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/videos/new')}
          className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Programme Video
        </button>
      </div>

      {/* Searching, Filtering & Actions panel */}
      <div className="bg-white p-4 border border-outline-variant rounded-lg shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto flex-1">
          {/* Text search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={videoSearchTerm}
              onChange={(e) => setVideoSearchTerm(e.target.value)}
              placeholder="Search by title, slugs or topic tag..."
              className="w-full pl-9 pr-4 py-2 border border-outline focus:border-primary focus:ring-0 rounded text-xs bg-transparent"
            />
            {videoSearchTerm && (
              <button onClick={() => setVideoSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-650">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dropdown Programme Filter */}
          <select 
            value={videoSelectedProgId}
            onChange={(e) => setVideoSelectedProgId(e.target.value)}
            className="px-3 py-2 border border-outline rounded text-xs bg-transparent min-w-[200px]"
          >
            <option value="all">All Programmes</option>
            {programmes.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-on-surface-variant font-medium shrink-0">
          Found <strong className="text-primary">{filteredVideos.length}</strong> entries
        </div>
      </div>

      {/* Video Records Table */}
      <div className="bg-white border border-outline-variant rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[1000px]">
            <thead className="bg-surface-container-high border-b border-outline-variant text-[10px] font-bold text-on-surface uppercase tracking-wider">
              <tr>
                <th className="p-3 w-28">Preview</th>
                <th className="p-3">Video Title & Slug</th>
                <th className="p-3">Programme Assigned</th>
                <th className="p-3">Summary</th>
                <th className="p-3">Status</th>
                <th className="p-3">Dates</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredVideos.map((video) => {
                const isInlineEditing = videoInlineEditId === video.id;

                return (
                  <tr key={video.id} className="hover:bg-slate-50 transition-colors">
                    {/* Thumbnail preview */}
                    <td className="p-3">
                      <div className="relative w-24 h-14 bg-gray-100 rounded overflow-hidden shadow-xs border border-outline">
                        <img 
                          referrerPolicy="no-referrer"
                          src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`} 
                          alt="thumbnail"
                          className="w-full h-full object-cover"
                        />
                        {video.isFeatured && (
                          <span className="absolute top-1 left-1 bg-amber-550 bg-amber-600 text-white font-bold text-[8px] px-1.5 py-0.5 rounded shadow-sm">
                            FEATURED
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Title and slug */}
                    <td className="p-3 max-w-xs text-left">
                      {isInlineEditing ? (
                        <div className="space-y-1.5">
                          <label className="block text-[8px] font-bold text-gray-400 uppercase">Title</label>
                          <input 
                            type="text"
                            value={videoInlineData?.title || ''}
                            onChange={(e) => setVideoInlineData({ ...videoInlineData!, title: e.target.value })}
                            className="w-full px-2 py-1 border rounded text-xs bg-white focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      ) : (
                        <div>
                          <span className="font-semibold text-primary block leading-snug">{video.title}</span>
                          <span className="font-mono text-[10px] text-on-surface-variant block mt-1">/{video.slug}</span>
                        </div>
                      )}
                    </td>

                    {/* Program select assignment */}
                    <td className="p-3">
                      {isInlineEditing ? (
                        <div className="space-y-1.5">
                          <label className="block text-[8px] font-bold text-gray-400 uppercase">Programme</label>
                          <select
                            value={videoInlineData?.programmeId || ''}
                            onChange={(e) => setVideoInlineData({ ...videoInlineData!, programmeId: e.target.value })}
                            className="w-full px-1.5 py-1 border rounded text-xs bg-white"
                          >
                            {programmes.map(p => (
                              <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span className="font-semibold text-amber-900 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded text-[10.5px]">
                          {video.programmeTitle || video.programmeId}
                        </span>
                      )}
                    </td>

                    {/* Summary / Tag list */}
                    <td className="p-3 max-w-sm">
                      {isInlineEditing ? (
                        <div className="space-y-1.5 text-left">
                          <label className="block text-[8px] font-bold text-gray-400 uppercase">Summary</label>
                          <textarea
                            rows={2}
                            value={videoInlineData?.shortSummary || ''}
                            onChange={(e) => setVideoInlineData({ ...videoInlineData!, shortSummary: e.target.value })}
                            className="w-full p-1 border rounded text-[11px] bg-white text-gray-600"
                          />
                        </div>
                      ) : (
                        <div className="space-y-1 text-left">
                          <span className="text-[11px] leading-relaxed block text-on-surface-variant line-clamp-2">
                            {video.shortSummary || 'No summary registered.'}
                          </span>
                          {/* Tags display */}
                          {Array.isArray(video.topicTags) && video.topicTags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {video.topicTags.map(tag => (
                                <span key={tag} className="text-[9px] bg-sky-50 text-sky-850 font-bold font-mono px-1.5 py-0.2 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Status label */}
                    <td className="p-3 font-mono text-[11px]">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9.5px] ${
                        video.status === 'published' ? 'bg-green-100 text-green-700' :
                        video.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-105 bg-gray-100 text-gray-600'
                      }`}>
                        {video.status || 'draft'}
                      </span>
                    </td>

                    {/* Dates correction */}
                    <td className="p-3 space-y-1 shrink-0 w-36">
                      <div className="text-[11px] font-medium font-mono text-gray-600">
                        <span className="text-[9px] text-gray-400 font-sans block">Display:</span>
                        {video.displayDate || 'Not specified'}
                      </div>
                      <div className="text-[10px] font-mono text-gray-400">
                        <span className="text-[9px] text-gray-400 font-sans block">Sort date:</span>
                        {video.publishedAt ? formatFirebaseDate(video.publishedAt) : 'None'}
                      </div>
                    </td>

                    {/* Actions panel */}
                    <td className="p-3 text-right shrink-0 w-48">
                      {isInlineEditing ? (
                        <div className="space-x-1.5 flex justify-end">
                          <button onClick={() => saveInlineEdit(video)} className="bg-primary hover:bg-primary-container text-white font-bold px-2 py-1 rounded text-[10px] cursor-pointer">
                            Save
                          </button>
                          <button onClick={() => setVideoInlineEditId(null)} className="bg-gray-100 hover:bg-gray-200 text-gray-705 px-2 py-1 rounded text-[10px] cursor-pointer">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap justify-end gap-1.5">
                          <button 
                            onClick={() => startInlineEdit(video)}
                            className="bg-yellow-50 hover:bg-yellow-105 text-yellow-805 border border-yellow-200 px-2 py-1 rounded text-[10px] font-medium cursor-pointer"
                            title="Quick edit text fields without launching full form"
                          >
                            Quick Edit
                          </button>
                          <button 
                            onClick={() => navigate(`/admin/videos/${video.id}/edit`)}
                            className="bg-sky-50 hover:bg-sky-105 text-sky-808 border border-sky-200 px-2 py-1 rounded text-[10px] font-medium cursor-pointer"
                            title="Launch full fields form"
                          >
                            Edit Full
                          </button>
                          <button 
                            onClick={() => toggleStatus(video)}
                            className="bg-slate-100 hover:bg-slate-205 text-slate-800 px-2 py-1 rounded text-[10px] font-medium cursor-pointer"
                            title={video.status === 'published' ? 'Unpublish video (toggles Draft state)' : 'Publish video'}
                          >
                            {video.status === 'published' ? 'Unpublish' : 'Publish'}
                          </button>
                          {video.status !== 'archived' && (
                            <button 
                              onClick={() => archiveVideo(video)}
                              className="bg-gray-100 hover:bg-gray-205 text-gray-600 px-2 py-1 rounded text-[10px] font-medium cursor-pointer"
                              title="Flag as archived"
                            >
                              Archive
                            </button>
                          )}
                          <a 
                            href={video.youtubeUrl || `https://www.youtube.com/watch?v=${video.youtubeVideoId}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="bg-red-50 hover:bg-red-105 border border-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-medium flex items-center gap-0.5"
                          >
                            Preview
                          </a>
                          <button 
                            onClick={() => handleDeleteVideo(video)}
                            className="text-red-500 hover:text-red-705 p-1 cursor-pointer"
                            title="Delete video record permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredVideos.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-on-surface-variant font-mono italic">
                    No videos registered. Try loading verified YouTube Library inside 'Console Home' or review seeder entries first!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
