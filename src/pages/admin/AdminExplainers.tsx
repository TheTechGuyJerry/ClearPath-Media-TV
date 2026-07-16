import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CMSForm from '../../components/admin/CMSForm';
import { Plus, Trash2 } from 'lucide-react';
import { Explainer } from '../../types';

export default function AdminExplainers() {
  const { 
    explainers, 
    handleSaveItem, 
    handleDeleteItem, 
    loading,
    effectiveRole
  } = useAdmin();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isCreateMode = searchParams.get('new') === 'true';

  const [formData, setFormData] = useState<Explainer>({
    id: '',
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    tagline: '',
    coverageArea: 'Nigeria',
    topicFocus: [],
    coverImage: '',
    thumbnailImage: '',
    status: 'active',
    isFeatured: false,
    sortOrder: explainers.length + 1,
    seoTitle: '',
    seoDescription: '',
    createdAt: '',
    updatedAt: ''
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Read-only accounts cannot publish modifications.');
      return;
    }
    if (!formData.title || !formData.slug) {
      alert('Title and Slug are required fields.');
      return;
    }

    const cleanSlug = formData.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const dataToSave = { ...formData, slug: cleanSlug };

    try {
      await handleSaveItem('explainers', dataToSave);
      alert('Saved Explainer successfully!');
      navigate('/admin/explainers');
    } catch (err: any) {
      alert('Error saving record: ' + err.message);
    }
  };

  const handleDelete = async (ex: Explainer) => {
    if (effectiveRole === 'viewer_admin' || effectiveRole === 'viewer') {
      alert('Access Denied: Viewers cannot make modifications.');
      return;
    }
    if (confirm(`Are you sure you want to permanently delete Explainer classification: "${ex.title}"?`)) {
      try {
        const deleted = await handleDeleteItem('explainers', ex.id, true);
        if (deleted) {
          alert('Deleted successfully.');
        }
      } catch (err: any) {
        alert('Deletion failed: ' + err.message);
      }
    }
  };

  if (isCreateMode) {
    return (
      <div className="space-y-6">
        <CMSForm
          type="explainers"
          data={formData}
          programmes={[]}
          explainers={explainers}
          onChange={(updated) => setFormData(updated)}
          onSave={handleSave}
          onCancel={() => navigate('/admin/explainers')}
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
          <h1 className="font-display font-semibold text-2xl text-primary">Civics Explainers Categories</h1>
          <p className="text-sm text-on-surface-variant">Configure visual deep dives, systematic structural coverage, and knowledge modules.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/explainers?new=true')}
          className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-surface-container-high border-b border-outline-variant text-[10px] font-bold text-on-surface uppercase tracking-wider">
            <tr>
              <th className="p-4">Cover Image</th>
              <th className="p-4">Title</th>
              <th className="p-4">Slug ID</th>
              <th className="p-4">Coverage Area</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {explainers.map((ex) => (
              <tr key={ex.id} className="hover:bg-surface-container-low transition-colors">
                <td className="p-4">
                  <img 
                    src={ex.thumbnailImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=320&q=80'} 
                    className="w-16 h-10 object-cover rounded border border-outline-variant" 
                    alt=""
                  />
                </td>
                <td className="p-4">
                  <p className="font-bold text-primary">{ex.title}</p>
                  <p className="text-[10px] text-on-surface-variant line-clamp-1">{ex.tagline}</p>
                </td>
                <td className="p-4 font-mono text-[11px] text-gray-500">{ex.id}</td>
                <td className="p-4 text-on-surface-variant">{ex.coverageArea}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${
                    ex.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-850'
                  }`}>{ex.status}</span>
                </td>
                <td className="p-4 text-right space-x-1.5 shrink-0">
                  <button 
                    onClick={() => navigate(`/admin/explainers/${ex.id}`)} 
                    className="bg-primary/5 hover:bg-primary/10 text-primary px-3 py-1.5 rounded text-[11px] font-bold uppercase cursor-pointer"
                  >
                    Manage Category & Items
                  </button>
                  <button 
                    onClick={() => handleDelete(ex)} 
                    className="text-gray-400 hover:text-error p-1.5 cursor-pointer ml-1 inline-block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {explainers.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-on-surface-variant italic">No explainer modules found. Click 'Add Category' to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
