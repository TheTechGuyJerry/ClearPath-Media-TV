import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CMSForm from '../../components/admin/CMSForm';
import { Plus, Trash2, Edit, Eye, Download, Share2, FileText } from 'lucide-react';
import { Briefing } from '../../types';

export default function AdminBriefings() {
  const { 
    briefings, 
    handleSaveItem, 
    handleDeleteItem, 
    refreshCollections,
    loading,
    effectiveRole
  } = useAdmin();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isCreateParam = searchParams.get('new') === 'true';

  // Local state for editing/adding
  const [editingItem, setEditingItem] = useState<Briefing | null>(null);

  // Auto initialize create mode if new trigger exists in query params
  useEffect(() => {
    if (isCreateParam && !editingItem) {
      handleCreateInit();
    }
  }, [isCreateParam]);

  const handleCreateInit = () => {
    const defaultNewBriefing: Briefing = {
      id: '',
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      briefingType: 'daily',
      presenter: 'Annabel K.',
      youtubeUrl: '',
      youtubeVideoId: '',
      thumbnailUrl: '',
      featuredImage: '',
      keyPoints: '',
      sourceLinks: '',
      topicTags: [],
      coverageArea: 'Nigeria & Africa',
      status: 'published',
      isFeatured: false,
      allowDownload: false,
      allowSharing: true,
      viewCount: 0,
      downloadCount: 0,
      shareCount: 0,
      publishedAt: new Date().toISOString().split('T')[0],
      seoTitle: '',
      seoDescription: '',
      createdAt: '',
      updatedAt: ''
    };
    setEditingItem(defaultNewBriefing);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (effectiveRole === 'viewer') {
      console.log('Access Denied: Read-only accounts cannot submit changes.');
      return;
    }
    if (!editingItem.title || !editingItem.slug) {
      console.log('Title and Slug are required fields.');
      return;
    }

    const cleanSlug = editingItem.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const dataToSave = { ...editingItem, slug: cleanSlug };

    try {
      await handleSaveItem('briefings', dataToSave);
      console.log('Saved Briefing successfully!');
      setEditingItem(null);
      if (isCreateParam) {
        navigate('/admin/briefing');
      } else {
        await refreshCollections();
      }
    } catch (err: any) {
      console.log('Error saving record: ' + err.message);
    }
  };

  const handleDelete = async (b: Briefing) => {
    if (effectiveRole === 'viewer') {
      console.log('Access Denied: Viewers cannot make deletions.');
      return;
    }
    if (true) {
      try {
        await handleDeleteItem('briefings', b.id, true);
        console.log('Deleted successfully.');
        await refreshCollections();
      } catch (err: any) {
        console.log('Deletion failed: ' + err.message);
      }
    }
  };

  if (editingItem) {
    return (
      <div className="space-y-6 text-left">
        <div className="flex justify-between items-center border-b pb-3 mb-6 bg-white p-6 border rounded-lg">
          <h3 className="font-bold text-primary font-display text-lg">{editingItem.id ? 'Edit' : 'Add New'} Briefing</h3>
          <button 
            onClick={() => {
              setEditingItem(null);
              if (isCreateParam) navigate('/admin/briefing');
            }} 
            className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black hover:bg-gray-100 px-3 py-1 bg-gray-50 border rounded cursor-pointer"
          >
            Back to List
          </button>
        </div>
        <CMSForm
          type="briefings"
          data={editingItem}
          programmes={[]}
          explainers={[]}
          onChange={(updated) => setEditingItem(updated as Briefing)}
          onSave={handleSave}
          onCancel={() => {
            setEditingItem(null);
            if (isCreateParam) navigate('/admin/briefing');
          }}
          uploadProgress={null}
          onFileChange={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center bg-white p-6 border rounded-lg shadow-xs">
        <div>
          <h1 className="font-display font-semibold text-2xl text-primary font-bold">Manage Briefings</h1>
          <p className="text-sm text-on-surface-variant">Write and distribute daily or weekly macro analyses, and monitor audience reach.</p>
        </div>
        <button 
          onClick={handleCreateInit}
          className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Briefing
        </button>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-outline-variant shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Total Briefings</span>
            <p className="text-2xl font-bold text-primary">{briefings.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-outline-variant shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Total Views</span>
            <p className="text-2xl font-bold text-emerald-700">
              {briefings.reduce((acc, b) => acc + (Number(b.viewCount) || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-outline-variant shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Downloads</span>
            <p className="text-2xl font-bold text-indigo-700">
              {briefings.filter(b => b.allowDownload === true).reduce((acc, b) => acc + (Number(b.downloadCount) || 0), 0).toLocaleString()}
            </p>
            <span className="text-[9px] text-gray-500 font-mono font-medium block">
              {briefings.filter(b => b.allowDownload === true).length} of {briefings.length} permit dl
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-outline-variant shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Shares</span>
            <p className="text-2xl font-bold text-purple-700">
              {briefings.filter(b => b.allowSharing !== false).reduce((acc, b) => acc + (Number(b.shareCount) || 0), 0).toLocaleString()}
            </p>
            <span className="text-[9px] text-gray-500 font-mono font-medium block">
              {briefings.filter(b => b.allowSharing !== false).length} of {briefings.length} permit share
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-surface-container-high border-b border-outline-variant text-[10px] font-bold text-on-surface uppercase tracking-wider">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Type</th>
              <th className="p-4">Presenter</th>
              <th className="p-4">Release Date</th>
              <th className="p-4 text-center">Views</th>
              <th className="p-4 text-center">Downloads</th>
              <th className="p-4 text-center">Shares</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {briefings.map(b => (
              <tr key={b.id} className="hover:bg-surface-container-low transition-colors">
                <td className="p-4">
                  <p className="font-bold text-primary">{b.title}</p>
                  <p className="text-[10px] text-on-surface-variant line-clamp-1">{b.excerpt}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {b.allowDownload && (
                      <span className="text-[8px] bg-emerald-100 text-emerald-800 font-mono font-bold px-1.5 py-0.5 rounded">
                        DOWNLOADABLE
                      </span>
                    )}
                    {b.allowSharing !== false && (
                      <span className="text-[8px] bg-indigo-100 text-indigo-800 font-mono font-bold px-1.5 py-0.5 rounded">
                        SHARABLE
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-blue-50 text-blue-800 px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase font-mono font-bold">{b.briefingType}</span>
                </td>
                <td className="p-4 font-mono text-on-surface-variant font-medium">{b.presenter}</td>
                <td className="p-4 text-on-surface-variant">{b.publishedAt}</td>
                <td className="p-4 text-center">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-100 font-mono font-bold text-xs" title="Views">
                    <Eye className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    {(Number(b.viewCount) || 0).toLocaleString()}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {b.allowDownload ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-100 font-mono font-bold text-xs" title="Downloads">
                      <Download className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {(Number(b.downloadCount) || 0).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-gray-400 font-mono text-xs" title="Downloads not permitted for this publication">—</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {b.allowSharing !== false ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-50 text-purple-800 border border-purple-100 font-mono font-bold text-xs" title="Shares">
                      <Share2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      {(Number(b.shareCount) || 0).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-gray-400 font-mono text-xs" title="Sharing not permitted for this publication">—</span>
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                    b.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-850'
                  }`}>{b.status}</span>
                </td>
                <td className="p-4 text-right space-x-1.5 shrink-0">
                  <button 
                    onClick={() => setEditingItem(b)}
                    className="text-primary hover:text-primary-container p-1.5 hover:bg-primary/5 rounded cursor-pointer inline-block"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(b)}
                    className="text-gray-400 hover:text-error p-1.5 hover:bg-error/5 rounded cursor-pointer inline-block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {briefings.length === 0 && (
              <tr>
                <td colSpan={8} className="p-10 text-center text-on-surface-variant italic">No briefings found. Click 'Add Briefing' to create.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
