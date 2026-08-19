import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { FileText, Plus, Edit2, Trash2, Save, X, ExternalLink } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../../lib/firebase';

export default function AdminElectionMatters() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

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
      pdfUrl: ''
    });
  };

  const handleEdit = (item: any) => {
    setIsEditing(item.id);
    setFormData(item);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing === 'new') {
        await addDoc(collection(db, 'electionMattersWeekly'), formData);
      } else if (isEditing) {
        await updateDoc(doc(db, 'electionMattersWeekly', isEditing), formData);
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

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center bg-white p-6 border rounded-lg shadow-xs">
        <div>
          <h1 className="font-display font-semibold text-2xl text-primary">Election Matters Weekly</h1>
          <p className="text-sm text-on-surface-variant">Manage weekly election publications and PDF uploads.</p>
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

              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-on-surface-variant mb-1">PDF URL</label>
                <input 
                  type="url" required
                  value={formData.pdfUrl} onChange={e => setFormData({...formData, pdfUrl: e.target.value})}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="https://example.com/document.pdf"
                />
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
        <div className="bg-white border rounded-lg overflow-hidden shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-lowest border-b border-outline-variant">
              <tr>
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">PDF</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-outline-variant/50 hover:bg-surface-container-lowest">
                  <td className="p-4 font-medium">{item.title}</td>
                  <td className="p-4 text-on-surface-variant">{item.publishedAt}</td>
                  <td className="p-4">
                    <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-1.5 text-secondary hover:bg-secondary/10 rounded cursor-pointer">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-error hover:bg-error/10 rounded cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-on-surface-variant">No publications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
