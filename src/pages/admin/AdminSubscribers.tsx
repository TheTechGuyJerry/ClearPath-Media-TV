import React from 'react';
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

export default function AdminSubscribers() {
  const { 
    subscribers, 
    handleDeleteItem, 
    handleUpdateStatus,
    refreshCollections,
    loading,
    effectiveRole
  } = useAdmin();

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('id');

  const selectedSubscriber = subscribers.find(s => s.id === selectedId);

  const handleDelete = async (id: string, email: string) => {
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Viewers cannot make deletions.');
      return;
    }
    if (confirm(`Are you sure you want to permanently unsubscribe and delete newsletter record for "${email}"?`)) {
      try {
        await handleDeleteItem('newsletterSubscribers', id);
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
    <div className="space-y-6 text-left font-sans">
      <div className="bg-white p-6 border rounded-lg shadow-xs">
        <h1 className="font-display font-semibold text-2xl text-primary font-bold">Newsletter Subscribers</h1>
        <p className="text-sm text-on-surface-variant">Mailing lists for morning Daily Briefings digests.</p>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-surface-container-high border-b border-outline-variant text-[10px] font-bold text-on-surface uppercase tracking-wider">
            <tr>
              <th className="p-4">Subscriber Email</th>
              <th className="p-4">Selected Briefings</th>
              <th className="p-4">Registered Date</th>
              <th className="p-4">Subscription Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {subscribers.map(s => (
              <tr 
                key={s.id} 
                onClick={() => setSearchParams({ id: s.id })} 
                className="hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <td className="p-4 font-bold text-primary font-mono text-left">{s.email}</td>
                <td className="p-4 text-on-surface-variant max-w-xs truncate text-left">
                  {s.selectedBriefings && Array.isArray(s.selectedBriefings) && s.selectedBriefings.length > 0 
                    ? s.selectedBriefings.join(', ') 
                    : 'None / General Weekly Brief'}
                </td>
                <td className="p-4 text-gray-500 font-mono text-left">{formatFirebaseDate(s.subscribedAt || s.createdAt)}</td>
                <td className="p-4 text-left">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                    (s.status || 'active') === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-105 bg-gray-100 text-gray-850'
                  }`}>
                    {s.status || 'active'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleDelete(s.id, s.email); 
                    }} 
                    className="text-gray-400 hover:text-error p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-on-surface-variant italic">No email subscriptions recorded.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedSubscriber && (
        <DetailModal
          type="subscribers"
          data={selectedSubscriber}
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
