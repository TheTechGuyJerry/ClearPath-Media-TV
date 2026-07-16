import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { useSearchParams } from 'react-router-dom';
import DetailModal from '../../components/admin/DetailModal';
import { Trash2 } from 'lucide-react';

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

  try {
    const parsedDate = new Date(dateVal);
    if (parsedDate && !isNaN(parsedDate.getTime()) && parsedDate.toString() !== 'Invalid Date') {
      return parsedDate.toLocaleDateString();
    }
  } catch (e) {}

  return 'Not available';
};

export default function AdminContactMessages() {
  const { 
    contactMessages, 
    handleDeleteItem, 
    handleUpdateStatus,
    refreshCollections,
    loading,
    effectiveRole
  } = useAdmin();

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('id');

  const selectedMessage = contactMessages.find(m => m.id === selectedId);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (effectiveRole === 'viewer_admin' || effectiveRole === 'viewer') {
      alert('Access Denied: Viewers cannot make deletions.');
      return;
    }
    try {
      const deleted = await handleDeleteItem('contactMessages', id, true);
      if (deleted) {
        alert('Deleted successfully.');
        setConfirmDeleteId(null);
        await refreshCollections();
      }
    } catch (err: any) {
      alert('Deletion failed: ' + err.message);
    }
  };

  const handleUpdateStatusProxy = async (collectionName: string, id: string, newStatus: string) => {
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Read-only accounts cannot modify statuses.');
      return;
    }
    try {
      await handleUpdateStatus(collectionName, id, newStatus);
      await refreshCollections();
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 text-left font-sans">
      <div className="bg-white p-6 border rounded-lg shadow-xs">
        <h1 className="font-display font-semibold text-2xl text-primary font-bold">Contact Messages</h1>
        <p className="text-sm text-on-surface-variant">Reach-out inquiries submitted from the subscribe modal.</p>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-surface-container-high border-b border-outline-variant text-[10px] font-bold text-on-surface uppercase tracking-wider">
            <tr>
              <th className="p-4">Sender Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Message</th>
              <th className="p-4">Submitted At</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {contactMessages.map(m => {
              const name = m.fullName || 'Anonymous';
              return (
                <tr 
                  key={m.id} 
                  onClick={() => setSearchParams({ id: m.id })} 
                  className="hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <td className="p-4 font-bold text-primary text-left">{name}</td>
                  <td className="p-4 font-mono text-on-surface-variant text-left">{m.email}</td>
                  <td className="p-4 font-normal text-on-surface max-w-sm whitespace-pre-wrap text-left">{m.message}</td>
                  <td className="p-4 text-gray-500 font-mono text-[11px] text-left">{formatFirebaseDate(m.submittedAt || m.createdAt)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                      (m.status || 'new') === 'new' ? 'bg-blue-100 text-blue-800' : 'bg-gray-105 bg-gray-100 text-gray-850'
                    }`}>
                      {m.status || 'new'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {confirmDeleteId === m.id ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(m.id);
                          }}
                          className="bg-error hover:bg-error/90 text-white px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer uppercase tracking-wider"
                        >
                          Delete
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(null);
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer uppercase tracking-wider"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setConfirmDeleteId(m.id); 
                        }} 
                        className="text-gray-400 hover:text-error p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {contactMessages.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-on-surface-variant italic">No messages found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedMessage && (
        <DetailModal
          type="contactMessages"
          data={selectedMessage}
          onClose={() => {
            searchParams.delete('id');
            setSearchParams(searchParams);
          }}
          onStatusUpdate={handleUpdateStatusProxy}
        />
      )}
    </div>
  );
}
