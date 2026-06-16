import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CMSForm from '../../components/admin/CMSForm';
import { Plus, Edit, Trash2, ShieldAlert } from 'lucide-react';
import { Programme } from '../../types';

export default function AdminProgrammes() {
  const { 
    programmes, 
    handleSaveItem, 
    handleDeleteItem, 
    loading,
    effectiveRole
  } = useAdmin();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isCreateMode = searchParams.get('new') === 'true';

  // Local editing/creating item state
  const [formData, setFormData] = useState<Programme>({
    id: '',
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    tagline: '',
    hostName: '',
    formatType: 'interview',
    coverageArea: 'Nigeria',
    topicFocus: [],
    scheduleText: '',
    youtubePlaylistUrl: '',
    coverImage: '',
    thumbnailImage: '',
    status: 'active',
    isFeatured: false,
    sortOrder: programmes.length + 1,
    seoTitle: '',
    seoDescription: '',
    createdAt: '',
    updatedAt: ''
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Viewer accounts are read-only.');
      return;
    }
    if (!formData.title || !formData.slug) {
      alert('Title and Slug are required characters.');
      return;
    }
    // ensure slug starts clean
    const cleanSlug = formData.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const dataToSave = { ...formData, slug: cleanSlug };
    try {
      await handleSaveItem('programmes', dataToSave);
      alert('Saved Programme successfully!');
      navigate('/admin/programmes');
    } catch (err: any) {
      alert('Error saving record: ' + err.message);
    }
  };

  const handleDelete = async (p: Programme) => {
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Viewers cannot make modifications.');
      return;
    }
    if (confirm(`Are you sure you want to permanently delete program: "${p.title}" and its configurations?`)) {
      try {
        await handleDeleteItem('programmes', p.id);
        alert('Deleted successfully.');
      } catch (err: any) {
        alert('Deletion failed: ' + err.message);
      }
    }
  };

  if (isCreateMode) {
    return (
      <div className="space-y-6">
        <CMSForm
          type="programmes"
          data={formData}
          programmes={programmes}
          explainers={[]}
          onChange={(updated) => setFormData(updated)}
          onSave={handleSave}
          onCancel={() => navigate('/admin/programmes')}
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
          <h1 className="font-display font-semibold text-2xl text-primary">Manage Programmes</h1>
          <p className="text-sm text-on-surface-variant">Configure channels, descriptions, metadata, and playlist sources.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/programmes?new=true')}
          className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Programme
        </button>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-surface-container-high border-b border-outline-variant text-[10px] font-bold text-on-surface uppercase tracking-wider">
            <tr>
              <th className="p-4">Thumbnail</th>
              <th className="p-4">Title</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Host Name</th>
              <th className="p-4">Coverage</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {programmes.map((p) => (
              <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                <td className="p-4">
                  <img 
                    src={p.thumbnailImage || 'https://images.unsplash.com/photo-1522881111613-3efeb7397b9c?auto=format&fit=crop&w=320&q=80'} 
                    className="w-16 h-10 object-cover rounded border border-outline-variant" 
                    alt=""
                  />
                </td>
                <td className="p-4">
                  <p className="font-bold text-primary">{p.title}</p>
                  <p className="text-[10px] text-on-surface-variant line-clamp-1">{p.tagline}</p>
                </td>
                <td className="p-4 text-[11px] font-mono text-gray-505">{p.id}</td>
                <td className="p-4 font-mono text-on-surface-variant">{p.hostName || 'N/A'}</td>
                <td className="p-4 text-on-surface-variant">{p.coverageArea}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${
                    p.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-105 bg-amber-100 text-amber-850'
                  }`}>{p.status}</span>
                </td>
                <td className="p-4 text-right space-x-1.5 shrink-0">
                  <button 
                    onClick={() => navigate(`/admin/programmes/${p.id}`)} 
                    className="bg-primary/5 hover:bg-primary/10 text-primary px-3 py-1.5 rounded text-[11px] font-bold uppercase cursor-pointer"
                  >
                    Manage Profile & Videos
                  </button>
                  <button 
                    onClick={() => handleDelete(p)} 
                    className="text-gray-400 hover:text-error p-1.5 cursor-pointer ml-1 inline-block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {programmes.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-on-surface-variant italic">No programmes found. Click 'Add Programme' to create one.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
