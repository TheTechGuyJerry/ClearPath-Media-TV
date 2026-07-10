import React, { useState } from 'react';
import { useAdmin } from './AdminContext';
import { useSearchParams } from 'react-router-dom';
import DetailModal from '../../components/admin/DetailModal';
import { Trash2, Calendar, Filter, Users, Clock, Download } from 'lucide-react';

const getSubscriberDate = (s: any): Date | null => {
  const dateVal = s.subscribedAt || s.createdAt;
  if (!dateVal) return null;
  
  if (typeof dateVal.toDate === 'function') {
    try {
      const d = dateVal.toDate();
      if (d && !isNaN(d.getTime())) return d;
    } catch (e) {}
  }
  
  if (dateVal && typeof dateVal.seconds === 'number') {
    try {
      return new Date(dateVal.seconds * 1000);
    } catch (e) {}
  }

  try {
    const parsedDate = new Date(dateVal);
    if (parsedDate && !isNaN(parsedDate.getTime()) && parsedDate.toString() !== 'Invalid Date') {
      return parsedDate;
    }
  } catch (e) {}

  return null;
};

const formatFirebaseDate = (dateVal: any): string => {
  const d = getSubscriberDate({ subscribedAt: dateVal });
  if (d) {
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }
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

  // Date filtering state
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

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

  // 1. Filter subscribers based on date selections
  const filteredSubscribers = subscribers.filter(s => {
    const sDate = getSubscriberDate(s);
    if (!sDate) {
      return dateFilter === 'all';
    }

    const now = new Date();
    
    if (dateFilter === 'today') {
      const todayStr = now.toDateString();
      return sDate.toDateString() === todayStr;
    }

    if (dateFilter === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return sDate >= sevenDaysAgo;
    }

    if (dateFilter === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      return sDate >= thirtyDaysAgo;
    }

    if (dateFilter === 'custom') {
      if (customStartDate) {
        const start = new Date(customStartDate);
        start.setHours(0, 0, 0, 0);
        if (sDate < start) return false;
      }
      if (customEndDate) {
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999);
        if (sDate > end) return false;
      }
      return true;
    }

    return true;
  });

  // 2. Sort subscribers by date descending (newest first)
  const sortedSubscribers = [...filteredSubscribers].sort((a, b) => {
    const dateA = getSubscriberDate(a);
    const dateB = getSubscriberDate(b);
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    return dateB.getTime() - dateA.getTime();
  });

  // 3. Group subscribers by calendar day (YYYY-MM-DD)
  const groupsMap: { [key: string]: any[] } = {};
  const unknownGroup: any[] = [];

  sortedSubscribers.forEach(s => {
    const sDate = getSubscriberDate(s);
    if (sDate) {
      const yyyy = sDate.getFullYear();
      const mm = String(sDate.getMonth() + 1).padStart(2, '0');
      const dd = String(sDate.getDate()).padStart(2, '0');
      const key = `${yyyy}-${mm}-${dd}`;
      if (!groupsMap[key]) {
        groupsMap[key] = [];
      }
      groupsMap[key].push(s);
    } else {
      unknownGroup.push(s);
    }
  });

  // Sort dates descending
  const sortedKeys = Object.keys(groupsMap).sort((a, b) => b.localeCompare(a));

  const groups = sortedKeys.map(key => {
    const [year, month, day] = key.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dateLabel = dateObj.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    return {
      key,
      dateLabel,
      items: groupsMap[key]
    };
  });

  if (unknownGroup.length > 0) {
    groups.push({
      key: 'unknown',
      dateLabel: 'Unknown Date',
      items: unknownGroup
    });
  }

  const escapeCSVField = (val: any): string => {
    if (val === null || val === undefined) return '';
    let str = '';
    if (Array.isArray(val)) {
      str = val.join('; ');
    } else {
      str = String(val);
    }
    if (str.includes(',') || str.includes('\n') || str.includes('\r') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const handleExportToCSV = () => {
    const dataToExport = sortedSubscribers;
    if (dataToExport.length === 0) {
      alert('No subscribers to export.');
      return;
    }

    const headers = ['Email', 'Full Name', 'Phone', 'Status', 'Selected Briefings', 'Source', 'Registered Date'];
    const rows = dataToExport.map(s => {
      const sDate = getSubscriberDate(s);
      const dateStr = sDate ? sDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not available';
      return [
        s.email || '',
        s.fullName || '',
        s.phone || '',
        s.status || 'active',
        s.selectedBriefings ? s.selectedBriefings.join('; ') : '',
        s.source || '',
        dateStr
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(escapeCSVField).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `subscribers_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-left font-sans">
      <div className="bg-white p-6 border border-outline-variant rounded-lg shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-semibold text-2xl text-primary font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-on-surface-variant">Mailing lists for morning Daily Briefings digests.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
          <button
            onClick={handleExportToCSV}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-md shadow-xs uppercase tracking-wider cursor-pointer transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
            title="Export filtered subscribers to CSV spreadsheet"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <div className="bg-surface-container-low px-4 py-2 border border-outline-variant rounded-md text-xs font-semibold text-primary font-mono">
            Total Filtered: {filteredSubscribers.length} / {subscribers.length}
          </div>
        </div>
      </div>

      {/* Date Filter Panel */}
      <div className="bg-white p-4 border border-outline-variant rounded-lg shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-on-surface-variant mr-1 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            Filter by Date:
          </span>
          {[
            { id: 'all', label: 'All Time' },
            { id: 'today', label: 'Today' },
            { id: '7days', label: 'Last 7 Days' },
            { id: '30days', label: 'Last 30 Days' },
            { id: 'custom', label: 'Custom Range' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => {
                setDateFilter(opt.id);
                if (opt.id !== 'custom') {
                  setCustomStartDate('');
                  setCustomEndDate('');
                }
              }}
              className={`px-3 py-1.5 font-medium rounded transition-all cursor-pointer ${
                dateFilter === opt.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface border border-outline-variant'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {dateFilter === 'custom' && (
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 font-medium">From:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="border border-outline rounded p-1.5 text-xs focus:ring-1 focus:ring-primary focus:outline-hidden bg-white"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 font-medium">To:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="border border-outline rounded p-1.5 text-xs focus:ring-1 focus:ring-primary focus:outline-hidden bg-white"
              />
            </div>
            {(customStartDate || customEndDate) && (
              <button
                onClick={() => {
                  setCustomStartDate('');
                  setCustomEndDate('');
                }}
                className="text-xs text-error hover:underline cursor-pointer font-bold ml-1"
              >
                Clear Range
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white border border-outline-variant rounded-lg overflow-hidden shadow-xs">
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
            {groups.map(group => (
              <React.Fragment key={group.key}>
                {/* Group Divider Row */}
                <tr className="bg-slate-50/70 select-none">
                  <td colSpan={5} className="p-3 font-semibold text-primary font-sans text-xs tracking-wide border-y border-outline-variant">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-primary/70" />
                      <span>{group.dateLabel}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono font-medium">
                        {group.items.length} {group.items.length === 1 ? 'subscriber' : 'subscribers'}
                      </span>
                    </span>
                  </td>
                </tr>
                {/* Subscriber Rows for this group */}
                {group.items.map(s => (
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
                    <td className="p-4 text-gray-500 font-mono text-left flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {formatFirebaseDate(s.subscribedAt || s.createdAt)}
                    </td>
                    <td className="p-4 text-left">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        (s.status || 'active') === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
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
                        className="text-gray-400 hover:text-error p-1 cursor-pointer transition-colors"
                        title="Delete newsletter subscription"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-on-surface-variant italic">No email subscriptions recorded.</td>
              </tr>
            )}
            {subscribers.length > 0 && filteredSubscribers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-on-surface-variant italic">No subscribers match the selected date filter.</td>
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
