import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ClearPathDailyArticle } from '../../types';

const CATEGORY_NAMES: Record<string, string> = {
  'todays-brief': "Today's Brief",
  'in-focus': 'In Focus',
  'the-indicator': 'The Indicator',
  'the-public-record': 'The Public Record',
  'clearpath-lens': 'The ClearPath Lens',
  'signals-to-watch': 'Signals to Watch'
};

export default function AdminClearPathDaily() {
  const { menuSlug } = useParams<{ menuSlug: string }>();
  const categoryName = CATEGORY_NAMES[menuSlug || ''] || 'ClearPath Daily';
  
  const { 
    clearpathDailyArticles, 
    handleSaveItem, 
    handleDeleteItem, 
    loading,
    effectiveRole
  } = useAdmin();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isCreateMode = searchParams.get('new') === 'true';

  const [formData, setFormData] = useState<ClearPathDailyArticle>({
    id: '',
    slug: '',
    category: categoryName,
    categorySlug: menuSlug || '',
    topicTags: [],
    title: '',
    excerpt: '',
    whyItMatters: '',
    authorName: '',
    authorTitle: '',
    publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    readingTime: '5 min read',
    coverImage: '',
    content: '',
    status: 'draft',
    isFeatured: true
  });

  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Filter articles by the current category
  const currentCategoryArticles = clearpathDailyArticles.filter(a => a.categorySlug === menuSlug);

  const handleEdit = (article: ClearPathDailyArticle) => {
    setFormData(article);
    setSelectedArticleId(article.id);
  };

  const handleCreateNew = () => {
    setFormData({
      id: '',
      slug: '',
      category: categoryName,
      categorySlug: menuSlug || '',
      topicTags: [],
      title: '',
      excerpt: '',
      whyItMatters: '',
      authorName: '',
      authorTitle: '',
      publishedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readingTime: '5 min read',
      coverImage: '',
      content: '',
      status: 'draft',
      isFeatured: true
    });
    setSelectedArticleId('new');
    navigate(`/admin/clearpath-daily/${menuSlug}?new=true`, { replace: true });
  };

  const handleCancel = () => {
    setSelectedArticleId(null);
    navigate(`/admin/clearpath-daily/${menuSlug}`, { replace: true });
  };

  const handleSave = async (data: any) => {
    await handleSaveItem('clearpath_daily_articles', data);
    setSelectedArticleId(null);
    navigate(`/admin/clearpath-daily/${menuSlug}`, { replace: true });
  };

  if (loading) {
    return <div className="p-8 text-center text-primary">Loading {categoryName}...</div>;
  }

  // Define CMS form fields based on category
  

  
  let allFields: any[] = [];
  
  // Base fields that almost everything uses for routing/system
  const systemFields = [
    { name: 'slug', label: 'Slug / URL ID', type: 'text', required: true },
    { name: 'status', label: 'Status', type: 'select', options: ['draft', 'published', 'archived'] },
    { name: 'isFeatured', label: 'Is Featured?', type: 'boolean' }
  ];

  if (menuSlug === 'todays-brief') {
    allFields = [
      ...systemFields,
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'subtitle', label: 'Subtitle', type: 'text' },
      { name: 'publishedAt', label: 'Published Date', type: 'text' },
      
      { name: 'readingTime', label: 'Reading Time (e.g., 5 min read)', type: 'text' },
      { name: 'coverImage', label: 'Cover Image URL', type: 'image' },
      { name: 'imageCaption', label: 'Image Caption', type: 'text' },
      { name: 'imageCredit', label: 'Image Credit', type: 'text' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { name: 'content', label: 'Main Content (Markdown)', type: 'textarea' },
      { name: 'whyItMatters', label: 'Why It Matters', type: 'textarea' },
      { name: 'whatToWatchNext', label: 'What To Watch Next', type: 'textarea' },
    ];
    } else if (menuSlug === 'in-focus') {
    allFields = [
      ...systemFields,
      { name: 'publishedAt', label: 'Published Date', type: 'text' },      
      { name: 'readingTime', label: 'Reading Time (e.g., 5 min read)', type: 'text' },
      { name: 'coverImage', label: 'Cover Image URL', type: 'image' },
      { name: 'title1', label: 'Focus 1 Title', type: 'text', required: true },
      { name: 'excerpt1', label: 'Focus 1 Excerpt', type: 'textarea' },
      { name: 'content1', label: 'Focus 1 Main Content (Markdown)', type: 'textarea' },
      { name: 'title2', label: 'Focus 2 Title', type: 'text' },
      { name: 'excerpt2', label: 'Focus 2 Excerpt', type: 'textarea' },
      { name: 'content2', label: 'Focus 2 Main Content (Markdown)', type: 'textarea' },
      { name: 'whyItMatters', label: 'Why It Matters', type: 'textarea' },
    ];
  } else if (menuSlug === 'the-indicator') {
    allFields = [
      ...systemFields,
      { name: 'indicatorNumber', label: 'Indicator Number (e.g. ₦1.42T or 73.4%)', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'publishedAt', label: 'Published Date', type: 'text' },
      { name: 'excerpt', label: 'Description', type: 'textarea' },
      { name: 'whyItMatters', label: 'Why It Matters', type: 'textarea' },
      
      
    ];
  } else if (menuSlug === 'the-public-record') {
    allFields = [
      ...systemFields,
      { name: 'quote', label: 'Quote', type: 'textarea', required: true },
      { name: 'speakerName', label: 'Speaker Name', type: 'text', required: true },
      { name: 'speakerPosition', label: 'Speaker Position', type: 'text' },
      { name: 'speakerInstitution', label: 'Speaker Institution', type: 'text' },
      { name: 'speakerSetting', label: 'Setting (e.g., Press Conference)', type: 'text' },
      { name: 'publishedAt', label: 'Date', type: 'text' },
      { name: 'content', label: 'Context', type: 'textarea' },
      
      
    ];
  } else if (menuSlug === 'clearpath-lens') {
    allFields = [
      ...systemFields,
      
      { name: 'publishedAt', label: 'Published Date', type: 'text' },
      { name: 'coverImage', label: 'Featured Image URL', type: 'image' },
      { name: 'introductorySummary', label: 'Introductory Summary (Markdown)', type: 'textarea' },
      { name: 'institutionalAnalysis', label: 'Institutional Analysis (Markdown)', type: 'textarea' },
    ];
  } else if (menuSlug === 'signals-to-watch') {
    allFields = [
      ...systemFields,
      { name: 'signalEvent1', label: 'Event 1 Name', type: 'text', required: true },
      { name: 'signalDateOrDay1', label: 'Event 1 Date or Day', type: 'text' },
      { name: 'relatedLinkTitle1', label: 'Event 1 Related Link Title', type: 'text' },
      { name: 'relatedLinkUrl1', label: 'Event 1 Related Link URL', type: 'text' },
      { name: 'signalEvent2', label: 'Event 2 Name', type: 'text' },
      { name: 'signalDateOrDay2', label: 'Event 2 Date or Day', type: 'text' },
      { name: 'relatedLinkTitle2', label: 'Event 2 Related Link Title', type: 'text' },
      { name: 'relatedLinkUrl2', label: 'Event 2 Related Link URL', type: 'text' },
    ];
  } else {
    allFields = systemFields;
  }


  if (isCreateMode || selectedArticleId) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">{selectedArticleId === 'new' ? `Create New ${categoryName}` : `Edit ${categoryName}`}</h2>
          <button onClick={handleCancel} className="text-sm font-semibold text-primary hover:underline">Cancel</button>
        </div>
        
        <div className="bg-surface-container-low p-6 rounded-lg border border-outline-variant shadow-sm space-y-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSave(formData); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allFields.map((f, i) => (
                <div key={i} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                  <label className="block text-xs uppercase font-bold text-on-surface-variant mb-1">{f.label} {f.required && '*'}</label>
                  {f.type === 'textarea' ? (
                    <textarea 
                      required={f.required}
                      value={formData[f.name as keyof typeof formData] as string || ''}
                      onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                      rows={5}
                      className="w-full px-3 py-2 border border-outline rounded text-sm font-mono bg-transparent"
                    />
                  ) : f.type === 'select' ? (
                    <select
                      required={f.required}
                      value={formData[f.name as keyof typeof formData] as string || ''}
                      onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                      className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent"
                    >
                      <option value="">-- Select --</option>
                      {f.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : f.type === 'boolean' ? (
                    <select
                      value={formData[f.name as keyof typeof formData] ? 'true' : 'false'}
                      onChange={(e) => setFormData({...formData, [f.name]: e.target.value === 'true'})}
                      className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  ) : f.type === 'image' ? (
                    <div className="flex flex-col gap-3">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 300 * 1024) {
                            alert('Image must be less than 300KB');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({...formData, [f.name]: reader.result as string});
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="block w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                      {formData[f.name as keyof typeof formData] && typeof formData[f.name as keyof typeof formData] === 'string' && (formData[f.name as keyof typeof formData] as string).length > 0 && (
                        <div className="relative w-32 h-20 rounded overflow-hidden border border-outline">
                          <img src={formData[f.name as keyof typeof formData] as string} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <input 
                      type={f.type}
                      required={f.required}
                      value={formData[f.name as keyof typeof formData] as string || ''}
                      onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                      className="w-full px-3 py-2 border border-outline rounded text-sm bg-transparent"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-outline-variant">
              <h3 className="text-lg font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Optional: Evidence from Athena Centre
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-emerald-50/50 p-4 rounded-lg border border-emerald-100">
                {[
                  { name: 'athenaEvidenceType', label: 'Publication Type', type: 'select', options: ['Athena Perspectives', 'Policy Pulse', 'Athena Notes', 'Third Tier', 'Special Report'] },
                  { name: 'athenaEvidenceTitle', label: 'Publication Title', type: 'text' },
                  { name: 'athenaEvidenceDate', label: 'Published Date', type: 'text' },
                  { name: 'athenaEvidenceUrl', label: 'Link URL (must start with https://)', type: 'text' },
                  { name: 'athenaEvidenceSummary', label: 'Summary', type: 'textarea' },
                ].map((f, i) => (
                  <div key={i} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="block text-xs uppercase font-bold text-emerald-800/70 mb-1">{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea 
                        value={formData[f.name as keyof typeof formData] as string || ''}
                        onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-emerald-200 focus:border-emerald-500 rounded text-sm font-mono bg-white"
                      />
                    ) : f.type === 'select' ? (
                      <select
                        value={formData[f.name as keyof typeof formData] as string || ''}
                        onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                        className="w-full px-3 py-2 border border-emerald-200 focus:border-emerald-500 rounded text-sm bg-white"
                      >
                        <option value="">-- None --</option>
                        {f.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input 
                        type={f.type}
                        value={formData[f.name as keyof typeof formData] as string || ''}
                        onChange={(e) => setFormData({...formData, [f.name]: e.target.value})}
                        className="w-full px-3 py-2 border border-emerald-200 focus:border-emerald-500 rounded text-sm bg-white"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t border-outline-variant pt-4 mt-4">
              <button type="button" onClick={handleCancel} className="px-4 py-2 border border-outline hover:bg-surface-container-high rounded text-sm font-semibold cursor-pointer">
                Cancel
              </button>
              <button type="submit" className="bg-primary hover:bg-primary-container text-white px-5 py-2 rounded text-sm font-semibold flex items-center gap-2 cursor-pointer">
                Save Record
              </button>
            </div>
          </form>
        </div>

      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">{categoryName}</h2>
          <p className="text-sm text-gray-500 mt-1">Manage articles for {categoryName}</p>
        </div>
        {effectiveRole !== 'viewer_admin' && (
          <button 
            onClick={handleCreateNew}
            className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-bold hover:bg-primary-container transition-colors"
          >
            <Plus className="w-4 h-4" /> New Article
          </button>
        )}
      </div>

      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-xs uppercase tracking-wider text-on-surface-variant font-bold border-b border-outline-variant">
              <th className="p-4">Title / ID</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCategoryArticles.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-on-surface-variant">
                  No articles found for this category.
                </td>
              </tr>
            ) : (
              currentCategoryArticles.map(article => (
                <tr key={article.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-lowest transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-primary text-sm">{article.title || article.lensHeadline || article.quote || article.signalEvent || 'Untitled'}</p>
                    <p className="text-xs text-on-surface-variant font-mono mt-1">{article.id}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${article.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {article.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-on-surface-variant">{article.publishedAt || article.signalDateOrDay}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(article)} className="p-2 text-primary hover:bg-primary/10 rounded transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      {effectiveRole !== 'viewer_admin' && (
                        <button 
                          onClick={async () => {
                            await handleDeleteItem('clearpath_daily_articles', article.id, true);
                          }} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
