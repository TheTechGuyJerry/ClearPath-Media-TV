import React from 'react';
import { useAdmin } from './AdminContext';
import { useSearchParams } from 'react-router-dom';
import DetailModal, { getProspectName, getCorporateEntity, getContact, getPartnershipInterest, getKeyMessage } from '../../components/admin/DetailModal';
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

export default function AdminPartnerships() {
  const { 
    partnerRequests, 
    handleDeleteItem, 
    handleUpdateStatus,
    refreshCollections,
    loading,
    effectiveRole
  } = useAdmin();

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('id');

  const selectedRequest = partnerRequests.find(r => r.id === selectedId);

  const handleDelete = async (id: string, title: string) => {
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Viewers cannot make deletions.');
      return;
    }
    if (confirm(`Are you sure you want to permanently delete partnership request from "${title}"?`)) {
      try {
        await handleDeleteItem('partnerRequests', id);
        alert('Deleted successfully.');
        await refreshCollections();
      } catch (err: any) {
        alert('Deletion failed: ' + err.message);
      }
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
    <div className="space-y-6 text-left">
      <div className="bg-white p-6 border rounded-lg shadow-xs">
        <h1 className="font-display font-semibold text-2xl text-primary font-bold">Partnership Requests</h1>
        <p className="text-sm text-on-surface-variant">Incoming corporate collaborations and proposals.</p>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-surface-container-high border-b border-outline-variant text-[10px] font-bold text-on-surface uppercase tracking-wider">
            <tr>
              <th className="p-4">Prospect Name</th>
              <th className="p-4">Corporate Entity</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Partnership Interest</th>
              <th className="p-4">Key Message / Detail</th>
              <th className="p-4">Submitted At</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {partnerRequests.map(r => {
              const name = getProspectName(r);
              return (
                <tr 
                  key={r.id} 
                  onClick={() => setSearchParams({ id: r.id })} 
                  className="hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <td className="p-4 font-bold text-primary text-left">{name}</td>
                  <td className="p-4 font-medium text-on-surface text-left">{getCorporateEntity(r)}</td>
                  <td className="p-4 font-mono text-on-surface-variant text-left">{getContact(r)}</td>
                  <td className="p-4 font-medium text-on-surface text-left">{getPartnershipInterest(r)}</td>
                  <td className="p-4 text-on-surface-variant max-w-xs truncate text-left">{getKeyMessage(r)}</td>
                  <td className="p-4 text-gray-500 font-mono text-[11px] text-left">{formatFirebaseDate(r.submittedAt || r.createdAt)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                      (r.status || 'new') === 'new' ? 'bg-blue-100 text-blue-800' :
                      (r.status || '') === 'pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-105 bg-gray-100 text-gray-800'
                    }`}>
                      {r.status || 'new'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleDelete(r.id, name); 
                      }} 
                      className="text-gray-400 hover:text-error p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {partnerRequests.length === 0 && (
              <tr>
                <td colSpan={8} className="p-10 text-center text-on-surface-variant italic">No partnership submissions received yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <DetailModal
          type="partnerRequests"
          data={selectedRequest}
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
