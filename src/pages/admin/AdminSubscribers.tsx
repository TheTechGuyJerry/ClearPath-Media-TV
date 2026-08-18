import React, { useState, useMemo } from 'react';
import { useAdmin } from './AdminContext';
import { useSearchParams } from 'react-router-dom';
import DetailModal from '../../components/admin/DetailModal';
import { Trash2, Calendar, Filter, Users, Clock, Download, MapPin, ArrowUpDown, Search, Layers } from 'lucide-react';
import { NewsletterSubscriber } from '../../types';

export const ALL_NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Abuja (FCT)', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara'
];

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

const getSubscriberState = (s: NewsletterSubscriber | any): string => {
  const st = s?.stateOfOrigin || s?.state || s?.nigerianState || s?.location || s?.city;
  if (!st || !String(st).trim()) return 'Unspecified';
  const str = String(st).trim();
  const lower = str.toLowerCase();
  if (lower.includes('abuja') || lower.includes('fct') || lower.includes('federal capital')) {
    return 'Abuja (FCT)';
  }
  const matched = ALL_NIGERIAN_STATES.find(name => name.toLowerCase() === lower);
  return matched || str;
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

  // Filtering & Sorting States
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<'date-desc' | 'date-asc' | 'state-asc' | 'state-desc' | 'email-asc' | 'email-desc'>('date-desc');
  const [groupByOption, setGroupByOption] = useState<'date' | 'state' | 'none'>('date');

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (effectiveRole === 'viewer_admin' || effectiveRole === 'viewer') {
      console.log('Access Denied: Viewers cannot make deletions.');
      return;
    }
    try {
      const deleted = await handleDeleteItem('newsletterSubscribers', id, true);
      if (deleted) {
        console.log('Deleted successfully.');
        setConfirmDeleteId(null);
        await refreshCollections();
      }
    } catch (err: any) {
      console.log('Deletion failed: ' + err.message);
    }
  };

  const handleUpdateStatusProxy = async (collectionName: string, id: string, newStatus: string) => {
    if (effectiveRole === 'viewer') {
      console.log('Access Denied: Read-only accounts cannot modify statuses.');
      return;
    }
    try {
      await handleUpdateStatus(collectionName, id, newStatus);
      await refreshCollections();
    } catch (err: any) {
      console.log('Failed to update status: ' + err.message);
    }
  };

  // 1. Filter subscribers based on date, state, and search selections
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter(s => {
      // Date filter
      const sDate = getSubscriberDate(s);
      if (dateFilter !== 'all') {
        if (!sDate) return false;
        const now = new Date();
        if (dateFilter === 'today') {
          if (sDate.toDateString() !== now.toDateString()) return false;
        } else if (dateFilter === '7days') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          if (sDate < sevenDaysAgo) return false;
        } else if (dateFilter === '30days') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);
          if (sDate < thirtyDaysAgo) return false;
        } else if (dateFilter === 'custom') {
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
        }
      }

      // State filter
      const subState = getSubscriberState(s);
      if (selectedStateFilter !== 'All') {
        if (selectedStateFilter === 'Unspecified') {
          if (subState !== 'Unspecified') return false;
        } else {
          if (subState.toLowerCase() !== selectedStateFilter.toLowerCase()) return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const emailMatch = (s.email || '').toLowerCase().includes(q);
        const nameMatch = (s.fullName || '').toLowerCase().includes(q);
        const stateMatch = subState.toLowerCase().includes(q);
        if (!emailMatch && !nameMatch && !stateMatch) return false;
      }

      return true;
    });
  }, [subscribers, dateFilter, customStartDate, customEndDate, selectedStateFilter, searchQuery]);

  // 2. Sort subscribers according to selected sortOption
  const sortedSubscribers = useMemo(() => {
    return [...filteredSubscribers].sort((a, b) => {
      const dateA = getSubscriberDate(a);
      const dateB = getSubscriberDate(b);
      const stateA = getSubscriberState(a);
      const stateB = getSubscriberState(b);

      if (sortOption === 'date-desc') {
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateB.getTime() - dateA.getTime();
      }

      if (sortOption === 'date-asc') {
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateA.getTime() - dateB.getTime();
      }

      if (sortOption === 'state-asc') {
        return stateA.localeCompare(stateB);
      }

      if (sortOption === 'state-desc') {
        return stateB.localeCompare(stateA);
      }

      if (sortOption === 'email-asc') {
        return (a.email || '').localeCompare(b.email || '');
      }

      if (sortOption === 'email-desc') {
        return (b.email || '').localeCompare(a.email || '');
      }

      return 0;
    });
  }, [filteredSubscribers, sortOption]);

  // Count states represented
  const stateCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    subscribers.forEach(s => {
      const st = getSubscriberState(s);
      counts[st] = (counts[st] || 0) + 1;
    });
    return counts;
  }, [subscribers]);

  const uniqueStatesCount = useMemo(() => {
    return Object.keys(stateCounts).filter(st => st !== 'Unspecified').length;
  }, [stateCounts]);

  // 3. Group subscribers based on groupByOption
  const groups = useMemo(() => {
    if (groupByOption === 'none') {
      return [{
        key: 'all',
        label: 'All Subscribers',
        subLabel: `${sortedSubscribers.length} total`,
        items: sortedSubscribers
      }];
    }

    if (groupByOption === 'state') {
      const stateMap: Record<string, NewsletterSubscriber[]> = {};
      sortedSubscribers.forEach(s => {
        const st = getSubscriberState(s);
        if (!stateMap[st]) stateMap[st] = [];
        stateMap[st].push(s);
      });

      // Sort state group keys according to sortOption if state sort, else by count descending then alphabetical
      const keys = Object.keys(stateMap).sort((a, b) => {
        if (sortOption === 'state-desc') return b.localeCompare(a);
        if (sortOption === 'state-asc') return a.localeCompare(b);
        const diff = stateMap[b].length - stateMap[a].length;
        if (diff !== 0) return diff;
        return a.localeCompare(b);
      });

      return keys.map(st => ({
        key: `state-${st}`,
        label: st === 'Unspecified' ? 'State Unspecified / Not Provided' : `State: ${st}`,
        subLabel: `${stateMap[st].length} subscriber${stateMap[st].length === 1 ? '' : 's'}`,
        items: stateMap[st]
      }));
    }

    // Default: Group by Date (YYYY-MM-DD)
    const groupsMap: { [key: string]: NewsletterSubscriber[] } = {};
    const unknownGroup: NewsletterSubscriber[] = [];

    sortedSubscribers.forEach(s => {
      const sDate = getSubscriberDate(s);
      if (sDate) {
        const yyyy = sDate.getFullYear();
        const mm = String(sDate.getMonth() + 1).padStart(2, '0');
        const dd = String(sDate.getDate()).padStart(2, '0');
        const key = `${yyyy}-${mm}-${dd}`;
        if (!groupsMap[key]) groupsMap[key] = [];
        groupsMap[key].push(s);
      } else {
        unknownGroup.push(s);
      }
    });

    const sortedKeys = Object.keys(groupsMap).sort((a, b) => {
      return sortOption === 'date-asc' ? a.localeCompare(b) : b.localeCompare(a);
    });

    const result = sortedKeys.map(key => {
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
        label: dateLabel,
        subLabel: `${groupsMap[key].length} subscriber${groupsMap[key].length === 1 ? '' : 's'}`,
        items: groupsMap[key]
      };
    });

    if (unknownGroup.length > 0) {
      result.push({
        key: 'unknown',
        label: 'Unknown Date',
        subLabel: `${unknownGroup.length} subscriber${unknownGroup.length === 1 ? '' : 's'}`,
        items: unknownGroup
      });
    }

    return result;
  }, [sortedSubscribers, groupByOption, sortOption]);

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
      console.log('No subscribers to export.');
      return;
    }

    const headers = ['Email', 'Full Name', 'State', 'Phone', 'Status', 'Selected Briefings', 'Source', 'Registered Date'];
    const rows = dataToExport.map(s => {
      const sDate = getSubscriberDate(s);
      const dateStr = sDate ? sDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not available';
      return [
        s.email || '',
        s.fullName || '',
        getSubscriberState(s),
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

  const handleStateHeaderClick = () => {
    if (sortOption === 'state-asc') {
      setSortOption('state-desc');
    } else {
      setSortOption('state-asc');
    }
  };

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Top Banner */}
      <div className="bg-white p-6 border border-outline-variant rounded-lg shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-semibold text-2xl text-primary font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-on-surface-variant">Mailing lists and state demographics for daily briefings digests.</p>
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
          <div className="bg-surface-container-low px-3 py-1.5 border border-outline-variant rounded-md text-xs font-semibold text-primary font-mono flex items-center gap-2">
            <span>Total: {filteredSubscribers.length} / {subscribers.length}</span>
            <span className="text-gray-300">|</span>
            <span className="text-emerald-700 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-600" /> {uniqueStatesCount} States</span>
          </div>
        </div>
      </div>

      {/* Filter and Order Panel */}
      <div className="bg-white p-4 border border-outline-variant rounded-lg shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          
          {/* Search Box */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <Search className="w-3.5 h-3.5 text-gray-500" />
              <span>Search Subscribers</span>
            </label>
            <input
              type="text"
              placeholder="Search email, name or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filter by State */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex justify-between items-center">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                Filter by State
              </span>
              {selectedStateFilter !== 'All' && (
                <button
                  onClick={() => setSelectedStateFilter('All')}
                  className="text-[10px] text-primary hover:underline font-normal"
                >
                  Reset
                </button>
              )}
            </label>
            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className={`w-full text-xs border rounded-lg p-2.5 font-medium focus:ring-2 focus:ring-primary focus:border-transparent ${
                selectedStateFilter !== 'All'
                  ? 'border-primary bg-primary/10 text-primary font-bold'
                  : 'border-gray-300 bg-white text-gray-800'
              }`}
            >
              <option value="All">All States ({ALL_NIGERIAN_STATES.length} States + Unspecified)</option>
              {ALL_NIGERIAN_STATES.map(st => (
                <option key={st} value={st}>
                  {st} {stateCounts[st] ? `(${stateCounts[st]})` : ''}
                </option>
              ))}
              <option value="Unspecified">Unspecified / Not Stated {stateCounts['Unspecified'] ? `(${stateCounts['Unspecified']})` : ''}</option>
            </select>
          </div>

          {/* Order / Sort Option */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
              <span>Order / Sort Subscribers By</span>
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="w-full text-xs border border-primary/40 rounded-lg p-2.5 bg-primary/5 text-primary font-bold focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="date-desc">Newest First (Registration Date)</option>
              <option value="date-asc">Oldest First (Registration Date)</option>
              <option value="state-asc">State Name (A - Z)</option>
              <option value="state-desc">State Name (Z - A)</option>
              <option value="email-asc">Subscriber Email (A - Z)</option>
              <option value="email-desc">Subscriber Email (Z - A)</option>
            </select>
          </div>

          {/* Grouping View Toggle */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-gray-500" />
              <span>Group Table Rows By</span>
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 border border-gray-200 rounded-lg text-[11px] font-semibold">
              <button
                onClick={() => setGroupByOption('date')}
                className={`py-1.5 px-2 rounded text-center transition-all cursor-pointer ${
                  groupByOption === 'date'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Date
              </button>
              <button
                onClick={() => setGroupByOption('state')}
                className={`py-1.5 px-2 rounded text-center transition-all cursor-pointer ${
                  groupByOption === 'state'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                State
              </button>
              <button
                onClick={() => setGroupByOption('none')}
                className={`py-1.5 px-2 rounded text-center transition-all cursor-pointer ${
                  groupByOption === 'none'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Flat List
              </button>
            </div>
          </div>

        </div>

        {/* Date Filter Quick Bar */}
        <div className="flex flex-wrap gap-4 items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-on-surface-variant mr-1 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              Date Filter:
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
                className={`px-3 py-1 font-medium rounded transition-all cursor-pointer text-xs ${
                  dateFilter === opt.id
                    ? 'bg-slate-800 text-white shadow-xs font-bold'
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
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-outline-variant rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-surface-container-high border-b border-outline-variant text-[10px] font-bold text-on-surface uppercase tracking-wider">
            <tr>
              <th className="p-4">
                <button
                  onClick={() => setSortOption(sortOption === 'email-asc' ? 'email-desc' : 'email-asc')}
                  className="flex items-center gap-1 hover:text-primary transition-colors focus:outline-none cursor-pointer"
                >
                  <span>Subscriber Email</span>
                  <ArrowUpDown className={`w-3 h-3 ${sortOption.startsWith('email') ? 'text-primary font-bold' : 'text-gray-400'}`} />
                </button>
              </th>
              <th className="p-4">
                <button
                  onClick={handleStateHeaderClick}
                  className="flex items-center gap-1 hover:text-primary transition-colors focus:outline-none cursor-pointer"
                  title="Click to order by State"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>State</span>
                  <ArrowUpDown className={`w-3 h-3 ${sortOption.startsWith('state') ? 'text-primary font-bold' : 'text-gray-400'}`} />
                </button>
              </th>
              <th className="p-4">Selected Briefings</th>
              <th className="p-4">
                <button
                  onClick={() => setSortOption(sortOption === 'date-desc' ? 'date-asc' : 'date-desc')}
                  className="flex items-center gap-1 hover:text-primary transition-colors focus:outline-none cursor-pointer"
                >
                  <span>Registered Date</span>
                  <ArrowUpDown className={`w-3 h-3 ${sortOption.startsWith('date') ? 'text-primary font-bold' : 'text-gray-400'}`} />
                </button>
              </th>
              <th className="p-4">Subscription Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {groups.map(group => (
              <React.Fragment key={group.key}>
                {/* Group Header Row (if grouping enabled) */}
                {groupByOption !== 'none' && (
                  <tr className="bg-slate-50/80 select-none border-y border-outline-variant">
                    <td colSpan={6} className="p-3 font-semibold text-primary font-sans text-xs tracking-wide">
                      <span className="flex items-center gap-2">
                        {groupByOption === 'state' ? (
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <Calendar className="w-3.5 h-3.5 text-primary/70" />
                        )}
                        <span className="font-bold">{group.label}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono font-medium">
                          {group.subLabel}
                        </span>
                      </span>
                    </td>
                  </tr>
                )}

                {/* Subscriber Rows for this group */}
                {group.items.map(s => {
                  const stateVal = getSubscriberState(s);
                  return (
                    <tr 
                      key={s.id} 
                      onClick={() => setSearchParams({ id: s.id })} 
                      className="hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <td className="p-4 font-bold text-primary font-mono text-left">
                        <div>{s.email}</div>
                        {s.fullName && (
                          <div className="text-[11px] text-gray-500 font-sans font-normal">{s.fullName}</div>
                        )}
                      </td>
                      <td className="p-4 text-left">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold ${
                          stateVal === 'Unspecified' 
                            ? 'bg-gray-100 text-gray-500 border border-gray-200' 
                            : 'bg-primary/10 text-primary border border-primary/20'
                        }`}>
                          <MapPin className="w-3 h-3 text-primary/70" />
                          <span>{stateVal}</span>
                        </span>
                      </td>
                      <td className="p-4 text-on-surface-variant max-w-xs truncate text-left">
                        {s.selectedBriefings && Array.isArray(s.selectedBriefings) && s.selectedBriefings.length > 0 
                          ? s.selectedBriefings.join(', ') 
                          : 'None / General Weekly Brief'}
                      </td>
                      <td className="p-4 text-gray-500 font-mono text-left">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {formatFirebaseDate(s.subscribedAt || s.createdAt)}
                        </div>
                      </td>
                      <td className="p-4 text-left">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          (s.status || 'active') === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {s.status || 'active'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {confirmDeleteId === s.id ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(s.id);
                              }}
                              className="bg-error hover:bg-error/90 text-white px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer uppercase tracking-wider"
                            >
                              Unsub & Delete
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
                              setConfirmDeleteId(s.id); 
                            }} 
                            className="text-gray-400 hover:text-error p-1 cursor-pointer transition-colors"
                            title="Delete newsletter subscription"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}

            {subscribers.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-on-surface-variant italic">No email subscriptions recorded.</td>
              </tr>
            )}
            {subscribers.length > 0 && filteredSubscribers.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-on-surface-variant italic">No subscribers match the selected filters or search query.</td>
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
