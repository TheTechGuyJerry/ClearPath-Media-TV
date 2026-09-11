import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { FileText, Plus, Edit2, Trash2, Save, X, ExternalLink, Eye, Download, Share2, Search, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../../lib/firebase';
import { getDownloadablePdfUrl } from '../../utils/urlUtils';

export default function AdminElectionMatters() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'most-views' | 'most-downloads' | 'most-shares' | 'newest'>('default');

  const fetchData = async () => {
    try {
      const q = query(collection(db, 'electionMattersWeekly'), orderBy('publishedAt', 'desc'));
      const snapshot = await getDocs(q);
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'electionMattersWeekly');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    setIsEditing('new');
    setFormData({
      title: '',
      description: '',
      publishedAt: new Date().toISOString().split('T')[0],
      pdfUrl: '',
      allowDownload: false, // only a few publications permit download
      allowSharing: true, // sharing permitted by default
      viewCount: 0,
      downloadCount: 0,
      shareCount: 0
    });
  };

  const handleEdit = (item: any) => {
    setIsEditing(item.id);
    setFormData({
      ...item,
      allowDownload: item.allowDownload === true,
      allowSharing: item.allowSharing !== false,
      viewCount: Number(item.viewCount) || 0,
      downloadCount: Number(item.downloadCount) || 0,
      shareCount: Number(item.shareCount) || 0
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isDownloadAllowed = Boolean(formData.allowDownload);
      const isShareAllowed = Boolean(formData.allowSharing);

      const dataToSave = {
        ...formData,
        allowDownload: isDownloadAllowed,
        allowSharing: isShareAllowed,
        pdfUrl: getDownloadablePdfUrl(formData.pdfUrl),
        viewCount: Math.max(0, parseInt(formData.viewCount) || 0),
        // Allot counters according to privileges
        downloadCount: isDownloadAllowed ? Math.max(0, parseInt(formData.downloadCount) || 0) : 0,
        shareCount: isShareAllowed ? Math.max(0, parseInt(formData.shareCount) || 0) : 0
      };
      
      if (isEditing === 'new') {
        await addDoc(collection(db, 'electionMattersWeekly'), dataToSave);
      } else if (isEditing) {
        await updateDoc(doc(db, 'electionMattersWeekly', isEditing), dataToSave);
      }
      setIsEditing(null);
      fetchData();
    } catch (error) {
      const op = isEditing === 'new' ? OperationType.CREATE : OperationType.UPDATE;
      handleFirestoreError(error, op, 'electionMattersWeekly');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'electionMattersWeekly', id));
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `electionMattersWeekly/${id}`);
    }
  };

  const totalViews = items.reduce((acc, item) => acc + (Number(item.viewCount) || 0), 0);
  
  // Privilege-scoped metrics: only allot download metrics to publications permitting download
  const downloadPermittedItems = items.filter(item => item.allowDownload === true);
  const totalDownloads = downloadPermittedItems.reduce((acc, item) => acc + (Number(item.downloadCount) || 0), 0);

  // Privilege-scoped metrics: only allot share metrics to publications permitting sharing
  const sharePermittedItems = items.filter(item => item.allowSharing !== false);
  const totalShares = sharePermittedItems.reduce((acc, item) => acc + (Number(item.shareCount) || 0), 0);

  const filteredItems = items.filter(item => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.publishedAt && item.publishedAt.toLowerCase().includes(q))
    );
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'most-views') {
      return (Number(b.viewCount) || 0) - (Number(a.viewCount) || 0);
    }
    if (sortBy === 'most-downloads') {
      const aDl = a.allowDownload ? (Number(a.downloadCount) || 0) : -1;
      const bDl = b.allowDownload ? (Number(b.downloadCount) || 0) : -1;
      return bDl - aDl;
    }
    if (sortBy === 'most-shares') {
      const aSh = a.allowSharing !== false ? (Number(a.shareCount) || 0) : -1;
      const bSh = b.allowSharing !== false ? (Number(b.shareCount) || 0) : -1;
      return bSh - aSh;
    }
    if (sortBy === 'newest') {
      return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
    }
    return 0;
  });

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center bg-white p-6 border rounded-lg shadow-xs">
        <div>
          <h1 className="font-display font-semibold text-2xl text-primary">Election Matters Weekly</h1>
          <p className="text-sm text-on-surface-variant">Manage weekly election publications, PDF documents, and monitor readership engagement.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={handleCreate}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded text-sm font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Publication
          </button>
        )}
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-outline-variant shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Total Publications</span>
            <p className="text-2xl font-bold text-primary">{items.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-outline-variant shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Document Views</span>
            <p className="text-2xl font-bold text-emerald-700">{totalViews.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-outline-variant shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">PDF Downloads</span>
            <p className="text-2xl font-bold text-indigo-700">{totalDownloads.toLocaleString()}</p>
            <span className="text-[10px] text-gray-500 font-medium">({downloadPermittedItems.length} of {items.length} permit download)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-outline-variant shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block">Web Shares</span>
            <p className="text-2xl font-bold text-purple-700">{totalShares.toLocaleString()}</p>
            <span className="text-[10px] text-gray-500 font-medium">({sharePermittedItems.length} of {items.length} permit sharing)</span>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="bg-white p-6 border rounded-lg shadow-xs">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold">{isEditing === 'new' ? 'New Publication' : 'Edit Publication'}</h2>
            <button onClick={() => setIsEditing(null)} className="text-on-surface-variant hover:text-on-surface cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1">Title</label>
                <input 
                  type="text" required
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1">Date</label>
                <input 
                  type="date" required
                  value={formData.publishedAt} onChange={e => setFormData({...formData, publishedAt: e.target.value})}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1">PDF URL</label>
                <input 
                  type="url" required
                  value={formData.pdfUrl} onChange={e => setFormData({...formData, pdfUrl: e.target.value})}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="https://example.com/document.pdf"
                />
              </div>

              {/* Publication Access Privileges */}
              <div className="md:col-span-2 p-4 bg-surface-container-lowest rounded-lg border border-outline-variant space-y-3">
                <h4 className="text-xs font-bold uppercase text-primary tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Access Privileges & Counters Allotment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={Boolean(formData.allowDownload)}
                      onChange={e => setFormData({ ...formData, allowDownload: e.target.checked })}
                      className="mt-0.5 h-4 w-4 rounded border-outline text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="text-sm font-semibold text-on-surface block">Permit PDF Download</span>
                      <p className="text-xs text-on-surface-variant">Only a few publications allow download. When enabled, allots a Download Counter.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.allowSharing !== false}
                      onChange={e => setFormData({ ...formData, allowSharing: e.target.checked })}
                      className="mt-0.5 h-4 w-4 rounded border-outline text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="text-sm font-semibold text-on-surface block">Permit Web Sharing</span>
                      <p className="text-xs text-on-surface-variant">Enables social/web link sharing. When enabled, allots a Share Counter.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Allotted Counters according to privileges */}
              <div>
                <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1">
                  Views Count
                </label>
                <input 
                  type="number" min={0}
                  value={formData.viewCount ?? 0}
                  onChange={e => setFormData({...formData, viewCount: Math.max(0, parseInt(e.target.value) || 0)})}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1">
                  Downloads Count {formData.allowDownload ? '(Allotted)' : '(Not Allotted)'}
                </label>
                {formData.allowDownload ? (
                  <input 
                    type="number" min={0}
                    value={formData.downloadCount ?? 0}
                    onChange={e => setFormData({...formData, downloadCount: Math.max(0, parseInt(e.target.value) || 0)})}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                ) : (
                  <div className="w-full border border-dashed rounded px-3 py-2 text-xs bg-gray-50 text-gray-500 flex items-center gap-1.5">
                    <span className="font-mono text-gray-400">—</span> Download restricted. Download counter not allotted.
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1">
                  Shares Count {formData.allowSharing !== false ? '(Allotted)' : '(Not Allotted)'}
                </label>
                {formData.allowSharing !== false ? (
                  <input 
                    type="number" min={0}
                    value={formData.shareCount ?? 0}
                    onChange={e => setFormData({...formData, shareCount: Math.max(0, parseInt(e.target.value) || 0)})}
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                ) : (
                  <div className="w-full border border-dashed rounded px-3 py-2 text-xs bg-gray-50 text-gray-500 flex items-center gap-1.5">
                    <span className="font-mono text-gray-400">—</span> Sharing disabled. Share counter not allotted.
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t mt-6">
              <button type="button" onClick={() => setIsEditing(null)} className="px-4 py-2 border rounded font-bold text-sm cursor-pointer">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded font-bold text-sm flex items-center gap-2 cursor-pointer">
                <Save className="w-4 h-4" /> Save Publication
              </button>
            </div>
          </form>
        </div>
      )}

      {!isEditing && (
        <>
          {/* Search & Sort Bar */}
          <div className="bg-white p-4 border border-outline-variant rounded-lg shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search publications by title or date..."
                  className="w-full pl-9 pr-4 py-2 border border-outline focus:border-primary focus:ring-0 rounded text-xs bg-transparent"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-650">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-outline rounded text-xs bg-transparent min-w-[170px]"
              >
                <option value="default">Sort: Default</option>
                <option value="most-views">Sort: Most Views</option>
                <option value="most-downloads">Sort: Most Downloads</option>
                <option value="most-shares">Sort: Most Shares</option>
                <option value="newest">Sort: Newest</option>
              </select>
            </div>

            <div className="text-xs text-on-surface-variant font-medium shrink-0">
              Found <strong className="text-primary">{sortedItems.length}</strong> publications
            </div>
          </div>

          <div className="bg-white border rounded-lg overflow-hidden shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container-lowest border-b border-outline-variant text-xs uppercase tracking-wider text-on-surface font-bold">
                <tr>
                  <th className="p-4">Title & Privileges</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">PDF</th>
                  <th className="p-4 text-center">Views</th>
                  <th className="p-4 text-center">Downloads</th>
                  <th className="p-4 text-center">Shares</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {sortedItems.map(item => (
                  <tr key={item.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4 font-medium text-primary">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span>{item.title}</span>
                        {item.allowDownload && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Downloadable
                          </span>
                        )}
                        {item.allowSharing !== false ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                            Sharable
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200">
                            Private
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-on-surface-variant font-normal line-clamp-1 mt-0.5">{item.description}</p>
                      )}
                    </td>
                    <td className="p-4 text-on-surface-variant text-xs font-mono">{item.publishedAt}</td>
                    <td className="p-4">
                      <a href={getDownloadablePdfUrl(item.pdfUrl)} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 text-xs font-medium">
                        View <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-100 font-mono font-bold text-xs" title={`${(Number(item.viewCount) || 0).toLocaleString()} Views`}>
                        <Eye className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        {(Number(item.viewCount) || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {item.allowDownload ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-100 font-mono font-bold text-xs" title={`${(Number(item.downloadCount) || 0).toLocaleString()} Downloads`}>
                          <Download className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          {(Number(item.downloadCount) || 0).toLocaleString()}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-50 text-gray-400 font-mono text-xs" title="Download privilege not granted; download counter not allotted">
                          —
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {item.allowSharing !== false ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-50 text-purple-800 border border-purple-100 font-mono font-bold text-xs" title={`${(Number(item.shareCount) || 0).toLocaleString()} Shares`}>
                          <Share2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          {(Number(item.shareCount) || 0).toLocaleString()}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-50 text-gray-400 font-mono text-xs" title="Sharing privilege not granted; share counter not allotted">
                          —
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(item)} className="p-1.5 text-secondary hover:bg-secondary/10 rounded cursor-pointer" title="Edit Publication">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 text-error hover:bg-error/10 rounded cursor-pointer" title="Delete Publication">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedItems.length === 0 && (
                  <tr><td colSpan={7} className="p-8 text-center text-on-surface-variant">No publications found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
