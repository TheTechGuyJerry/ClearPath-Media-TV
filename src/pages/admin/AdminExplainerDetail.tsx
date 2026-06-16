import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { useParams, useNavigate } from 'react-router-dom';
import CMSForm from '../../components/admin/CMSForm';
import { Plus, Trash2, ArrowLeft, Edit } from 'lucide-react';
import { ExplainerItem } from '../../types';

export default function AdminExplainerDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { 
    explainers, 
    explainerItems, 
    handleSaveItem, 
    handleDeleteItem,
    refreshCollections,
    loading,
    effectiveRole
  } = useAdmin();

  const [explSubTab, setExplSubTab] = useState<'profile' | 'items'>('profile');
  
  // Local Explainer Item Editing view state
  const [editingItem, setEditingItem] = useState<ExplainerItem | null>(null);

  const currentExpl = explainers.find(ex => ex.id === slug);

  if (loading && !currentExpl) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="font-mono text-xs text-primary">Loading explainer details...</p>
      </div>
    );
  }

  if (!currentExpl) {
    return (
      <div className="p-8 text-center bg-white border border-outline-variant rounded-lg max-w-md mx-auto mt-12 shadow-sm font-sans text-left">
        <h2 className="text-lg font-bold text-gray-800">Category Not Found</h2>
        <p className="text-sm text-gray-655 mt-2">The explainer category with ID "{slug}" does not exist.</p>
        <button 
          onClick={() => navigate('/admin/explainers')}
          className="mt-4 bg-primary text-white text-xs px-4 py-2 rounded font-bold uppercase transition-colors cursor-pointer"
        >
          Back to Explainers Categories
        </button>
      </div>
    );
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Read-only accounts cannot publish modifications.');
      return;
    }
    try {
      await handleSaveItem('explainers', currentExpl);
      alert('Explainer Category Profile updated successfully!');
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    }
  };

  const handleDeleteExpl = async () => {
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Viewers cannot delete categories.');
      return;
    }
    if (confirm(`Are you sure you want to permanently delete Explainer category: "${currentExpl.title}"?`)) {
      try {
        await handleDeleteItem('explainers', currentExpl.id);
        alert('Deleted category successfully.');
        navigate('/admin/explainers');
      } catch (err: any) {
        alert('Deletion failed: ' + err.message);
      }
    }
  };

  const handleItemSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Viewers are read-only.');
      return;
    }
    if (!editingItem.title || !editingItem.slug) {
      alert('Title and Slug are required characters.');
      return;
    }

    const cleanSlug = editingItem.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const dataToSave = { ...editingItem, slug: cleanSlug };

    try {
      await handleSaveItem('explainerItems', dataToSave);
      alert('Saved Explainer Item successfully!');
      setEditingItem(null);
      await refreshCollections();
    } catch (err: any) {
      alert('Saving item failed: ' + err.message);
    }
  };

  const handleCreateItemInit = () => {
    const defaultNewItem: ExplainerItem = {
      id: '',
      explainerId: currentExpl.id,
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      explainerType: 'video',
      youtubeUrl: '',
      youtubeVideoId: '',
      thumbnailUrl: '',
      featuredImage: '',
      transcript: '',
      keyQuestions: '',
      keyPoints: '',
      sourceLinks: '',
      relatedDocuments: [],
      topicTags: [],
      coverageArea: 'Nigeria',
      status: 'published',
      isFeatured: false,
      publishedAt: new Date().toISOString().split('T')[0],
      seoTitle: '',
      seoDescription: '',
      createdAt: '',
      updatedAt: ''
    };
    setEditingItem(defaultNewItem);
  };

  const handleItemDelete = async (item: ExplainerItem) => {
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Viewers cannot make modifications.');
      return;
    }
    if (confirm(`Are you sure you want to permanently delete knowledge asset: "${item.title}"?`)) {
      try {
        await handleDeleteItem('explainerItems', item.id);
        alert('Deleted successfully.');
        await refreshCollections();
      } catch (err: any) {
        alert('Deletion failed: ' + err.message);
      }
    }
  };

  // Filter children items
  const filteredItems = explainerItems.filter(item => item.explainerId === currentExpl.id);

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Row with Back button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-lg border border-outline-variant shadow-xs gap-4 font-sans">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/explainers')}
            className="p-2 border border-outline-variant hover:bg-surface-container-high rounded text-on-surface-variant cursor-pointer"
            title="Back to Explainers"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-xs uppercase text-primary font-bold font-mono tracking-wider bg-secondary px-2.5 py-0.5 rounded">Explainer Category</span>
            <h1 className="font-display font-semibold text-2xl text-primary mt-1">{currentExpl.title}</h1>
            <p className="text-xs text-on-surface-variant">Database Slug ID: <span className="font-mono text-primary font-semibold">{currentExpl.slug}</span></p>
          </div>
        </div>
        <div className="flex gap-2.5">
          <button 
            onClick={handleDeleteExpl}
            className="bg-error/10 hover:bg-error/20 text-error px-4 py-2 rounded text-xs font-semibold cursor-pointer"
          >
            Delete Explainer Category
          </button>
        </div>
      </div>

      {editingItem ? (
        <div className="bg-white p-6 rounded-lg border border-outline-variant">
          <div className="flex justify-between items-center border-b pb-3 mb-6">
            <h3 className="font-bold text-primary font-display">{editingItem.id ? 'Edit' : 'Add New'} Explainer Item</h3>
            <button 
              onClick={() => setEditingItem(null)} 
              className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black hover:bg-gray-100 px-3 py-1 bg-gray-50 border rounded cursor-pointer"
            >
              Back to List
            </button>
          </div>
          <CMSForm 
            type="explainerItems"
            data={editingItem}
            programmes={[]}
            explainers={explainers}
            onChange={(updated) => setEditingItem(updated as ExplainerItem)}
            onSave={handleItemSave}
            onCancel={() => setEditingItem(null)}
            uploadProgress={null}
            onFileChange={() => {}}
          />
        </div>
      ) : (
        <>
          {/* Sub Tab headers */}
          <div className="flex border-b border-outline-variant gap-4 bg-white/60 p-2 rounded">
            <button 
              onClick={() => setExplSubTab('profile')} 
              className={`px-4 py-2 text-sm font-medium rounded transition-colors cursor-pointer ${
                explSubTab === 'profile' ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
              }`}
            >
              Edit Category Profile
            </button>
            <button 
              onClick={() => setExplSubTab('items')} 
              className={`px-4 py-2 text-sm font-medium rounded transition-colors cursor-pointer ${
                explSubTab === 'items' ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
              }`}
            >
              Explainer Items / Content ({filteredItems.length})
            </button>
          </div>

          {explSubTab === 'profile' && (
            <div className="bg-white p-6 border rounded-lg overflow-hidden">
              <CMSForm 
                type="explainers"
                data={currentExpl}
                programmes={[]}
                explainers={explainers}
                onChange={async (updated) => {
                  const idx = explainers.findIndex(ex => ex.id === currentExpl.id);
                  if (idx > -1) {
                    explainers[idx] = updated;
                  }
                }}
                onSave={handleProfileSave}
                onCancel={() => navigate('/admin/explainers')}
                uploadProgress={null}
                onFileChange={() => {}}
              />
            </div>
          )}

          {explSubTab === 'items' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-4 border rounded-lg">
                <h3 className="font-semibold text-primary">Manage Items under {currentExpl.title}</h3>
                <button 
                  onClick={handleCreateItemInit}
                  className="bg-primary hover:bg-primary-container text-white px-3.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Explainer Item
                </button>
              </div>

              <div className="bg-white border rounded-lg overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-surface-container-high border-b border-outline-variant text-[10px] font-bold text-on-surface uppercase tracking-wider">
                    <tr>
                      <th className="p-3">Cover</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Slug / Path</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {filteredItems.map(item => (
                      <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="p-3">
                          <img 
                            referrerPolicy="no-referrer"
                            src={item.featuredImage || 'https://images.unsplash.com/photo-1522881111613-3efeb7397b9c?auto=format&fit=crop&w=320&q=80'} 
                            className="w-16 h-10 object-cover rounded border border-outline" 
                            alt=""
                          />
                        </td>
                        <td className="p-3 text-left">
                          <p className="font-bold text-primary">{item.title}</p>
                          <p className="text-[10px] text-on-surface-variant line-clamp-1">{item.excerpt}</p>
                        </td>
                        <td className="p-3">
                          <span className="bg-surface-container-highest text-on-surface px-2 py-0.5 rounded text-[10px] font-medium font-mono uppercase text-gray-600 font-bold">{item.explainerType}</span>
                        </td>
                        <td className="p-3 text-[11px] font-mono text-gray-500">/{item.slug}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${
                            item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-850'
                          }`}>{item.status}</span>
                        </td>
                        <td className="p-3 text-right space-x-1.5 shrink-0">
                          <button 
                            onClick={() => setEditingItem(item)} 
                            className="text-primary hover:text-primary-container p-1.5 hover:bg-primary/5 rounded cursor-pointer inline-block"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleItemDelete(item)} 
                            className="text-gray-400 hover:text-error p-1.5 hover:bg-error/5 rounded cursor-pointer inline-block"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredItems.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-on-surface-variant italic">No items have been assigned to this explainer folder yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
