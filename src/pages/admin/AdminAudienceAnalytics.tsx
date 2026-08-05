import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  MapPin, 
  Calendar, 
  Clock, 
  Download, 
  Filter, 
  RefreshCw, 
  ShieldCheck, 
  Users, 
  Eye, 
  Timer, 
  TrendingUp, 
  TrendingDown,
  ArrowUpDown,
  FileSpreadsheet,
  Play,
  Share2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { AudienceAnalyticsEvent } from '../../types';
import NigeriaMap from '../../components/admin/NigeriaMap';

// All 36 Nigerian States + FCT + Unknown
const ALL_NIGERIAN_STATES = [
  'Lagos', 'Abuja (FCT)', 'Kano', 'Rivers', 'Oyo', 'Kaduna', 'Edo', 'Enugu', 'Anambra',
  'Ogun', 'Delta', 'Abia', 'Adamawa', 'Akwa Ibom', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Ebonyi', 'Ekiti', 'Gombe', 'Imo', 'Jigawa', 'Katsina', 'Kebbi',
  'Kogi', 'Kwara', 'Nasarawa', 'Niger', 'Ondo', 'Plateau', 'Sokoto', 'Taraba', 'Yobe',
  'Zamfara', 'Unknown'
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

// Format Helper
const formatSeconds = (sec: number) => {
  if (!sec || isNaN(sec) || sec <= 0) return '0s';
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
};

export default function AdminAudienceAnalytics() {
  const [events, setEvents] = useState<AudienceAnalyticsEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter State
  const [dateRangePreset, setDateRangePreset] = useState<'today' | 'yesterday' | '7d' | '30d' | 'custom' | 'all'>('7d');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [comparePrevious, setComparePrevious] = useState<boolean>(false);

  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('All');
  const [selectedProgrammeFilter, setSelectedProgrammeFilter] = useState<string>('All');
  const [selectedVideoFilter, setSelectedVideoFilter] = useState<string>('All');
  const [selectedContentTypeFilter, setSelectedContentTypeFilter] = useState<string>('All');
  const [selectedTrafficSourceFilter, setSelectedTrafficSourceFilter] = useState<string>('All');
  const [selectedDeviceTypeFilter, setSelectedDeviceTypeFilter] = useState<string>('All');
  const [selectedDayOfWeekFilter, setSelectedDayOfWeekFilter] = useState<string>('All');
  const [selectedHourFilter, setSelectedHourFilter] = useState<string>('All');
  const [pageSearchFilter, setPageSearchFilter] = useState<string>('');

  // State Table Sorting / Ordering
  const [stateSortField, setStateSortField] = useState<'visitors' | 'state' | 'uniqueVisitors' | 'sessions' | 'percentage' | 'avgEngagement'>('visitors');
  const [stateSortOrder, setStateSortOrder] = useState<'asc' | 'desc'>('desc');

  const [activeTab, setActiveTab] = useState<'location' | 'dayOfWeek' | 'timeOfDay' | 'watchNow' | 'copyWeblink' | 'programmeRankings' | 'rawEvents'>('location');

  // Real-time Firestore subscription to audience_analytics_events
  useEffect(() => {
    setLoading(true);
    setError(null);

    const q = query(
      collection(db, 'audience_analytics_events'),
      orderBy('timestamp', 'desc'),
      limit(5000)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedEvents: AudienceAnalyticsEvent[] = [];
        snapshot.forEach((doc) => {
          fetchedEvents.push({ id: doc.id, ...(doc.data() as AudienceAnalyticsEvent) });
        });
        setEvents(fetchedEvents);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore Audience Analytics error:', err);
        setError('Failed to load audience analytics real-time data from database.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Extract unique programmes and videos for dropdown filters
  const availableProgrammes = useMemo(() => {
    const set = new Set<string>();
    events.forEach(ev => {
      if (ev.programmeName) set.add(ev.programmeName);
      else if (ev.programmeId) set.add(ev.programmeId);
    });
    return Array.from(set).sort();
  }, [events]);

  const availableVideos = useMemo(() => {
    const set = new Set<string>();
    events.forEach(ev => {
      if (ev.videoTitle) set.add(ev.videoTitle);
      else if (ev.videoId) set.add(ev.videoId);
    });
    return Array.from(set).sort();
  }, [events]);

  // Dynamic Event Filtering Engine
  const filteredData = useMemo(() => {
    let now = new Date();
    let currentStart = new Date(0); // All time default
    let currentEnd = new Date(8640000000000000);

    if (dateRangePreset === 'today') {
      currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (dateRangePreset === 'yesterday') {
      currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      currentEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (dateRangePreset === '7d') {
      currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (dateRangePreset === '30d') {
      currentStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (dateRangePreset === 'custom' && startDate) {
      currentStart = new Date(startDate);
      if (endDate) {
        currentEnd = new Date(new Date(endDate).getTime() + 86400000 - 1);
      }
    }

    const matchesFilters = (ev: AudienceAnalyticsEvent) => {
      const evDate = new Date(ev.timestamp);
      if (evDate < currentStart || evDate > currentEnd) return false;
      if (selectedStateFilter !== 'All' && ev.state !== selectedStateFilter) return false;
      if (selectedProgrammeFilter !== 'All' && ev.programmeName !== selectedProgrammeFilter && ev.programmeId !== selectedProgrammeFilter) return false;
      if (selectedVideoFilter !== 'All' && ev.videoTitle !== selectedVideoFilter && ev.videoId !== selectedVideoFilter) return false;
      if (selectedContentTypeFilter !== 'All' && ev.contentType !== selectedContentTypeFilter) return false;
      if (selectedTrafficSourceFilter !== 'All' && ev.trafficSource !== selectedTrafficSourceFilter) return false;
      if (selectedDeviceTypeFilter !== 'All' && ev.deviceType !== selectedDeviceTypeFilter) return false;
      if (selectedDayOfWeekFilter !== 'All' && ev.dayOfWeek !== selectedDayOfWeekFilter) return false;
      if (selectedHourFilter !== 'All' && ev.hourWAT !== Number(selectedHourFilter)) return false;
      if (pageSearchFilter && !ev.path.toLowerCase().includes(pageSearchFilter.toLowerCase()) && !ev.pageTitle.toLowerCase().includes(pageSearchFilter.toLowerCase())) return false;
      return true;
    };

    const currentEvents = events.filter(matchesFilters);

    // Calculate previous comparison period if requested
    let previousEvents: AudienceAnalyticsEvent[] = [];
    if (comparePrevious && dateRangePreset !== 'all') {
      const periodDurationMs = currentEnd.getTime() - currentStart.getTime();
      const prevStart = new Date(currentStart.getTime() - periodDurationMs);
      const prevEnd = new Date(currentStart.getTime());

      previousEvents = events.filter((ev) => {
        const evDate = new Date(ev.timestamp);
        if (evDate < prevStart || evDate >= prevEnd) return false;
        if (selectedStateFilter !== 'All' && ev.state !== selectedStateFilter) return false;
        if (selectedProgrammeFilter !== 'All' && ev.programmeName !== selectedProgrammeFilter && ev.programmeId !== selectedProgrammeFilter) return false;
        if (selectedVideoFilter !== 'All' && ev.videoTitle !== selectedVideoFilter && ev.videoId !== selectedVideoFilter) return false;
        if (selectedContentTypeFilter !== 'All' && ev.contentType !== selectedContentTypeFilter) return false;
        if (selectedTrafficSourceFilter !== 'All' && ev.trafficSource !== selectedTrafficSourceFilter) return false;
        if (selectedDeviceTypeFilter !== 'All' && ev.deviceType !== selectedDeviceTypeFilter) return false;
        if (selectedDayOfWeekFilter !== 'All' && ev.dayOfWeek !== selectedDayOfWeekFilter) return false;
        if (selectedHourFilter !== 'All' && ev.hourWAT !== Number(selectedHourFilter)) return false;
        if (pageSearchFilter && !ev.path.toLowerCase().includes(pageSearchFilter.toLowerCase()) && !ev.pageTitle.toLowerCase().includes(pageSearchFilter.toLowerCase())) return false;
        return true;
      });
    }

    return { currentEvents, previousEvents };
  }, [
    events,
    dateRangePreset,
    startDate,
    endDate,
    selectedStateFilter,
    selectedProgrammeFilter,
    selectedVideoFilter,
    selectedContentTypeFilter,
    selectedTrafficSourceFilter,
    selectedDeviceTypeFilter,
    selectedDayOfWeekFilter,
    selectedHourFilter,
    pageSearchFilter,
    comparePrevious
  ]);

  const { currentEvents, previousEvents } = filteredData;

  // Aggregate Primary Stats
  const metrics = useMemo(() => {
    const totalEvents = currentEvents.length;
    const pageViews = currentEvents.filter(e => !e.eventType || e.eventType === 'page_view').length;
    const uniqueVisitors = new Set(currentEvents.map(e => e.visitorId)).size;
    const sessions = new Set(currentEvents.map(e => e.sessionId)).size;
    
    const totalEngagementSec = currentEvents.reduce((acc, curr) => acc + (curr.engagementSeconds || 0), 0);
    const avgEngagementSec = pageViews > 0 ? Math.round(totalEngagementSec / pageViews) : 0;
    
    // Engagement rate = % of views with engagementSeconds >= 10
    const engagedViews = currentEvents.filter(e => (e.engagementSeconds || 0) >= 10).length;
    const engagementRate = pageViews > 0 ? ((engagedViews / pageViews) * 100).toFixed(1) : '0.0';

    // Watch Now metrics
    const watchNowClicks = currentEvents.filter(e => e.eventType === 'watch_now_click').length;
    const uniqueWatchNowVisitors = new Set(currentEvents.filter(e => e.eventType === 'watch_now_click').map(e => e.visitorId)).size;
    
    const programmePageVisitors = new Set(currentEvents.filter(e => e.contentType === 'programme' || e.path.startsWith('/programmes')).map(e => e.visitorId)).size;
    const watchNowCTR = programmePageVisitors > 0 ? ((uniqueWatchNowVisitors / programmePageVisitors) * 100).toFixed(1) : '0.0';

    // Copy Weblink metrics
    const copyWeblinkClicks = currentEvents.filter(e => e.eventType === 'copy_weblink_click').length;
    const uniqueCopyWeblinkVisitors = new Set(currentEvents.filter(e => e.eventType === 'copy_weblink_click').map(e => e.visitorId)).size;
    const copyWeblinkFailures = currentEvents.filter(e => e.eventType === 'copy_weblink_failure').length;
    const copyLinkRate = uniqueVisitors > 0 ? ((uniqueCopyWeblinkVisitors / uniqueVisitors) * 100).toFixed(1) : '0.0';

    return {
      totalEvents,
      pageViews,
      uniqueVisitors,
      sessions,
      avgEngagementSec,
      engagementRate,
      watchNowClicks,
      uniqueWatchNowVisitors,
      watchNowCTR,
      copyWeblinkClicks,
      uniqueCopyWeblinkVisitors,
      copyWeblinkFailures,
      copyLinkRate
    };
  }, [currentEvents]);

  // Aggregate State Analytics Table Data
  const stateAnalyticsMap = useMemo(() => {
    const map: Record<string, {
      state: string;
      visitors: number;
      uniqueVisitors: number;
      sessions: number;
      totalEngagementSec: number;
      sources: Record<string, number>;
      percentage: number;
      avgEngagement: string;
    }> = {};

    ALL_NIGERIAN_STATES.forEach(st => {
      map[st] = {
        state: st,
        visitors: 0,
        uniqueVisitors: 0,
        sessions: 0,
        totalEngagementSec: 0,
        sources: {},
        percentage: 0,
        avgEngagement: '0s'
      };
    });

    // Also handle unexpected foreign or unmapped states
    currentEvents.forEach(ev => {
      const stName = ALL_NIGERIAN_STATES.includes(ev.state) ? ev.state : 'Unknown';
      if (!map[stName]) {
        map[stName] = {
          state: stName,
          visitors: 0,
          uniqueVisitors: 0,
          sessions: 0,
          totalEngagementSec: 0,
          sources: {},
          percentage: 0,
          avgEngagement: '0s'
        };
      }
      map[stName].visitors += 1;
      map[stName].totalEngagementSec += (ev.engagementSeconds || 0);
      map[stName].sources[ev.trafficSource || 'direct'] = (map[stName].sources[ev.trafficSource || 'direct'] || 0) + 1;
    });

    const totalViews = metrics.pageViews || currentEvents.length || 1;

    Object.values(map).forEach(item => {
      const stateEvs = currentEvents.filter(e => (ALL_NIGERIAN_STATES.includes(e.state) ? e.state : 'Unknown') === item.state);
      item.uniqueVisitors = new Set(stateEvs.map(e => e.visitorId)).size;
      item.sessions = new Set(stateEvs.map(e => e.sessionId)).size;
      item.percentage = Number(((item.visitors / totalViews) * 100).toFixed(1));
      const avgSec = item.visitors > 0 ? Math.round(item.totalEngagementSec / item.visitors) : 0;
      item.avgEngagement = formatSeconds(avgSec);
    });

    return map;
  }, [currentEvents, metrics.pageViews]);

  // Sorted State list for table
  const sortedStateRows = useMemo(() => {
    const list = Object.values(stateAnalyticsMap)
      .filter(item => item.visitors > 0 || selectedStateFilter === item.state);

    return list.sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      if (stateSortField === 'state') {
        return stateSortOrder === 'asc' 
          ? a.state.localeCompare(b.state) 
          : b.state.localeCompare(a.state);
      } else if (stateSortField === 'visitors') {
        valA = a.visitors;
        valB = b.visitors;
      } else if (stateSortField === 'uniqueVisitors') {
        valA = a.uniqueVisitors;
        valB = b.uniqueVisitors;
      } else if (stateSortField === 'sessions') {
        valA = a.sessions;
        valB = b.sessions;
      } else if (stateSortField === 'percentage') {
        valA = a.percentage;
        valB = b.percentage;
      } else if (stateSortField === 'avgEngagement') {
        valA = a.visitors > 0 ? a.totalEngagementSec / a.visitors : 0;
        valB = b.visitors > 0 ? b.totalEngagementSec / b.visitors : 0;
      }

      if (valA < valB) return stateSortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return stateSortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [stateAnalyticsMap, selectedStateFilter, stateSortField, stateSortOrder]);

  const handleStateSort = (field: 'visitors' | 'state' | 'uniqueVisitors' | 'sessions' | 'percentage' | 'avgEngagement') => {
    if (stateSortField === field) {
      setStateSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setStateSortField(field);
      setStateSortOrder(field === 'state' ? 'asc' : 'desc');
    }
  };

  // Aggregate Day-of-Week Trends (WAT)
  const dayOfWeekTrends = useMemo(() => {
    return DAYS_OF_WEEK.map(day => {
      const dayEvs = currentEvents.filter(e => e.dayOfWeek === day);
      const views = dayEvs.filter(e => !e.eventType || e.eventType === 'page_view').length;
      const unique = new Set(dayEvs.map(e => e.visitorId)).size;
      const sess = new Set(dayEvs.map(e => e.sessionId)).size;
      const totalSec = dayEvs.reduce((acc, curr) => acc + (curr.engagementSeconds || 0), 0);
      const avgSec = views > 0 ? Math.round(totalSec / views) : 0;
      const engaged = dayEvs.filter(e => (e.engagementSeconds || 0) >= 10).length;
      const rate = views > 0 ? ((engaged / views) * 100).toFixed(1) : '0.0';

      return {
        day,
        views,
        unique,
        sessions: sess,
        avgSec,
        rate: Number(rate)
      };
    });
  }, [currentEvents]);

  const peakDay = useMemo(() => {
    const sorted = [...dayOfWeekTrends].sort((a, b) => b.views - a.views);
    return sorted[0]?.views > 0 ? sorted[0] : null;
  }, [dayOfWeekTrends]);

  const lowestDay = useMemo(() => {
    const sorted = [...dayOfWeekTrends].sort((a, b) => a.views - b.views);
    return sorted[0] ? sorted[0] : null;
  }, [dayOfWeekTrends]);

  // Aggregate Time-of-Day Engagement Patterns (00:00 to 23:00 WAT)
  const timeOfDayTrends = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return hours.map(hour => {
      const hourEvs = currentEvents.filter(e => e.hourWAT === hour);
      const views = hourEvs.filter(e => !e.eventType || e.eventType === 'page_view').length;
      const unique = new Set(hourEvs.map(e => e.visitorId)).size;
      const sess = new Set(hourEvs.map(e => e.sessionId)).size;
      const totalSec = hourEvs.reduce((acc, curr) => acc + (curr.engagementSeconds || 0), 0);
      const avgSec = views > 0 ? Math.round(totalSec / views) : 0;
      const engaged = hourEvs.filter(e => (e.engagementSeconds || 0) >= 10).length;
      const rate = views > 0 ? ((engaged / views) * 100).toFixed(1) : '0.0';

      return {
        hour,
        label: `${hour.toString().padStart(2, '0')}:00 WAT`,
        views,
        unique,
        sessions: sess,
        avgSec,
        rate: Number(rate)
      };
    });
  }, [currentEvents]);

  const peakHour = useMemo(() => {
    const sorted = [...timeOfDayTrends].sort((a, b) => b.views - a.views);
    return sorted[0]?.views > 0 ? sorted[0] : null;
  }, [timeOfDayTrends]);

  const lowestHour = useMemo(() => {
    const sorted = [...timeOfDayTrends].sort((a, b) => a.views - b.views);
    return sorted[0] ? sorted[0] : null;
  }, [timeOfDayTrends]);

  // Aggregate Most-Viewed Programme Pages with Separated Metrics
  const programmePageMetricsList = useMemo(() => {
    const map: Record<string, {
      path: string;
      title: string;
      programmeName: string;
      linkClicks: number;        // programme_page_click
      pageLoads: number;         // programme_page_load
      pageViews: number;         // page_view
      watchNowClicks: number;    // watch_now_click
      copyWeblinkClicks: number; // copy_weblink_click
      failedAttempts: number;    // programme_page_failed
      uniqueVisitorsSet: Set<string>;
      totalEngagementSec: number;
    }> = {};

    currentEvents.forEach(ev => {
      const key = ev.programmeName || ev.programmeId || ev.path || 'Unknown Programme';
      if (!map[key]) {
        map[key] = {
          path: ev.path,
          title: ev.programmeName || ev.pageTitle || ev.path,
          programmeName: ev.programmeName || key,
          linkClicks: 0,
          pageLoads: 0,
          pageViews: 0,
          watchNowClicks: 0,
          copyWeblinkClicks: 0,
          failedAttempts: 0,
          uniqueVisitorsSet: new Set(),
          totalEngagementSec: 0
        };
      }

      map[key].uniqueVisitorsSet.add(ev.visitorId);

      const type = ev.eventType || 'page_view';
      if (type === 'programme_page_click') map[key].linkClicks += 1;
      else if (type === 'programme_page_load') map[key].pageLoads += 1;
      else if (type === 'page_view') {
        map[key].pageViews += 1;
        map[key].totalEngagementSec += (ev.engagementSeconds || 0);
      }
      else if (type === 'watch_now_click') map[key].watchNowClicks += 1;
      else if (type === 'copy_weblink_click') map[key].copyWeblinkClicks += 1;
      else if (type === 'programme_page_failed') map[key].failedAttempts += 1;
    });

    return Object.values(map).map(p => {
      const uVis = p.uniqueVisitorsSet.size;
      const views = Math.max(1, p.pageViews);
      return {
        ...p,
        uniqueVisitors: uVis,
        avgEngagementSec: Math.round(p.totalEngagementSec / views),
        watchCTR: uVis > 0 ? ((p.watchNowClicks / uVis) * 100).toFixed(1) : '0.0',
        copyRate: uVis > 0 ? ((p.copyWeblinkClicks / uVis) * 100).toFixed(1) : '0.0'
      };
    }).sort((a, b) => b.pageViews - a.pageViews);
  }, [currentEvents]);

  // Export Filtered CSV Data
  const exportCSV = () => {
    if (currentEvents.length === 0) return;
    const headers = ['Timestamp WAT', 'Event Type', 'State', 'Path', 'Page Title', 'Programme', 'Video', 'Visitor ID', 'Session ID', 'Device', 'Traffic Source', 'Engagement Sec'];
    const rows = currentEvents.map(e => [
      `"${e.dateWAT || e.timestamp}"`,
      `"${e.eventType || 'page_view'}"`,
      `"${e.state}"`,
      `"${e.path}"`,
      `"${e.pageTitle.replace(/"/g, '""')}"`,
      `"${(e.programmeName || '').replace(/"/g, '""')}"`,
      `"${(e.videoTitle || '').replace(/"/g, '""')}"`,
      `"${e.visitorId}"`,
      `"${e.sessionId}"`,
      `"${e.deviceType}"`,
      `"${e.trafficSource}"`,
      e.engagementSeconds || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clearpath_audience_analytics_${dateRangePreset}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-outline-variant p-6 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Real Audience Telemetry Engine</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">100% Real Activity</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Audience & Content Analytics</h1>
          <p className="text-sm text-on-surface-variant">
            Live telemetry tracking Nigerian state locations, day/time trends, Watch Now clicks, and link sharing across clearpathmedia.ng
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportCSV}
            disabled={currentEvents.length === 0}
            className="flex items-center gap-2 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded hover:bg-primary-container transition-colors shadow-xs disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export Telemetry (CSV)</span>
          </button>
        </div>
      </div>

      {/* Database Error State Banner */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Database Telemetry Error:</span>
            <p className="mt-0.5 text-xs text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Global Filter Bar */}
      <div className="bg-surface-container-low border border-outline-variant p-5 rounded-xl space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <h3 className="text-sm font-bold text-primary flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" /> Filter Audience Telemetry
          </h3>
          <span className="text-xs text-on-surface-variant font-mono">
            Filtered Events: <strong className="text-primary font-bold">{currentEvents.length}</strong> / {events.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range Preset */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Date Range</label>
            <select
              value={dateRangePreset}
              onChange={(e) => setDateRangePreset(e.target.value as any)}
              className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="custom">Custom Range</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Nigerian State Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex justify-between items-center">
              <span>Filter by State</span>
              {selectedStateFilter !== 'All' && (
                <button 
                  onClick={() => setSelectedStateFilter('All')}
                  className="text-[10px] text-primary hover:underline font-normal"
                >
                  Reset State
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
              <option value="All">All States (36 + FCT + Unknown)</option>
              {ALL_NIGERIAN_STATES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* State Order / Sort Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
              <span>Order / Sort States By</span>
              <ArrowUpDown className="w-3 h-3 text-primary" />
            </label>
            <select
              value={`${stateSortField}-${stateSortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setStateSortField(field as any);
                setStateSortOrder(order as any);
              }}
              className="w-full text-xs border border-primary/30 rounded-lg p-2.5 bg-primary/5 text-primary font-bold focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="visitors-desc">Most Page Views (Default)</option>
              <option value="visitors-asc">Lowest Page Views</option>
              <option value="state-asc">State Name (A - Z)</option>
              <option value="state-desc">State Name (Z - A)</option>
              <option value="uniqueVisitors-desc">Highest Unique Visitors</option>
              <option value="percentage-desc">Highest Share (%)</option>
              <option value="avgEngagement-desc">Longest Avg Engagement</option>
              <option value="sessions-desc">Highest Sessions</option>
            </select>
          </div>

          {/* Programme Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Programme</label>
            <select
              value={selectedProgrammeFilter}
              onChange={(e) => setSelectedProgrammeFilter(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="All">All Programmes</option>
              {availableProgrammes.map(prog => (
                <option key={prog} value={prog}>{prog}</option>
              ))}
            </select>
          </div>

          {/* Episode / Video Filter */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Episode / Video</label>
            <select
              value={selectedVideoFilter}
              onChange={(e) => setSelectedVideoFilter(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="All">All Videos / Episodes</option>
              {availableVideos.map(vid => (
                <option key={vid} value={vid}>{vid}</option>
              ))}
            </select>
          </div>

          {/* Day of Week */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Day of Week</label>
            <select
              value={selectedDayOfWeekFilter}
              onChange={(e) => setSelectedDayOfWeekFilter(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="All">All Days (Mon-Sun)</option>
              {DAYS_OF_WEEK.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Hour of Day (WAT) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Hour of Day (WAT)</label>
            <select
              value={selectedHourFilter}
              onChange={(e) => setSelectedHourFilter(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="All">All Hours (00 to 23 WAT)</option>
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i.toString()}>{i.toString().padStart(2, '0')}:00 WAT</option>
              ))}
            </select>
          </div>

          {/* Device Type */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Device Type</label>
            <select
              value={selectedDeviceTypeFilter}
              onChange={(e) => setSelectedDeviceTypeFilter(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="All">All Devices</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
            </select>
          </div>

          {/* Traffic Source */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Traffic Source</label>
            <select
              value={selectedTrafficSourceFilter}
              onChange={(e) => setSelectedTrafficSourceFilter(e.target.value)}
              className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="All">All Sources</option>
              <option value="direct">Direct</option>
              <option value="google">Search (Google)</option>
              <option value="social">Social Media</option>
              <option value="referral">Referral</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Custom Date Range Picker */}
        {dateRangePreset === 'custom' && (
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-outline-variant">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs border border-gray-300 rounded p-2 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs border border-gray-300 rounded p-2 bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Overview Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Page Views */}
        <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Page Views</span>
            <Eye className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-primary">{metrics.pageViews}</div>
          <div className="text-[11px] text-gray-500 mt-1">Total page impressions</div>
        </div>

        {/* Unique Visitors */}
        <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Unique Visitors</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{metrics.uniqueVisitors}</div>
          <div className="text-[11px] text-gray-500 mt-1">Anonymized unique users</div>
        </div>

        {/* Watch Now Clicks */}
        <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Watch Clicks</span>
            <Play className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-700">{metrics.watchNowClicks}</div>
          <div className="text-[11px] font-semibold text-purple-600 mt-1">CTR: {metrics.watchNowCTR}%</div>
        </div>

        {/* Copy Weblink Clicks */}
        <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Copy Links</span>
            <Share2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700">{metrics.copyWeblinkClicks}</div>
          <div className="text-[11px] font-semibold text-amber-600 mt-1">Share Rate: {metrics.copyLinkRate}%</div>
        </div>

        {/* Avg Engagement Time */}
        <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Engagement</span>
            <Timer className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700">{formatSeconds(metrics.avgEngagementSec)}</div>
          <div className="text-[11px] text-gray-500 mt-1">Per page session</div>
        </div>

        {/* Engagement Rate */}
        <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Engagement Rate</span>
            <BarChart3 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-700">{metrics.engagementRate}%</div>
          <div className="text-[11px] text-gray-500 mt-1">Sessions ≥ 10 seconds</div>
        </div>
      </div>

      {/* Primary Analytics Tabs Navigation */}
      <div className="border-b border-outline-variant">
        <nav className="flex space-x-6 overflow-x-auto font-medium text-xs">
          <button
            onClick={() => setActiveTab('location')}
            className={`pb-3 whitespace-nowrap border-b-2 font-bold transition-colors ${
              activeTab === 'location'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🇳🇬 1. Audience Location by State
          </button>
          <button
            onClick={() => setActiveTab('dayOfWeek')}
            className={`pb-3 whitespace-nowrap border-b-2 font-bold transition-colors ${
              activeTab === 'dayOfWeek'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📅 2. Day-of-Week Trends
          </button>
          <button
            onClick={() => setActiveTab('timeOfDay')}
            className={`pb-3 whitespace-nowrap border-b-2 font-bold transition-colors ${
              activeTab === 'timeOfDay'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            ⏰ 3. Time-of-Day (WAT)
          </button>
          <button
            onClick={() => setActiveTab('watchNow')}
            className={`pb-3 whitespace-nowrap border-b-2 font-bold transition-colors ${
              activeTab === 'watchNow'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            ▶️ 4. "Watch Now" Video Clicks
          </button>
          <button
            onClick={() => setActiveTab('copyWeblink')}
            className={`pb-3 whitespace-nowrap border-b-2 font-bold transition-colors ${
              activeTab === 'copyWeblink'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🔗 5. "Copy Weblink" Clicks
          </button>
          <button
            onClick={() => setActiveTab('programmeRankings')}
            className={`pb-3 whitespace-nowrap border-b-2 font-bold transition-colors ${
              activeTab === 'programmeRankings'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🏆 6. Most-Viewed Programme Pages
          </button>
          <button
            onClick={() => setActiveTab('rawEvents')}
            className={`pb-3 whitespace-nowrap border-b-2 font-bold transition-colors ${
              activeTab === 'rawEvents'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🔍 7. Live Audit Inspector
          </button>
        </nav>
      </div>

      {/* TAB 1: Audience Location by State */}
      {activeTab === 'location' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <NigeriaMap
                data={stateAnalyticsMap}
                selectedState={selectedStateFilter}
                onSelectState={(st) => setSelectedStateFilter(st)}
              />
            </div>
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white border border-outline-variant p-4 rounded-xl shadow-xs">
                <h3 className="text-sm font-bold text-primary mb-1">State Geolocation Highlights</h3>
                <p className="text-xs text-gray-500 mb-4">IP-resolved Nigerian geographic distribution</p>
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Top State</span>
                    <strong className="text-primary text-sm font-sans">{sortedStateRows[0]?.state || 'No data'}</strong>
                    <div className="text-[11px] text-gray-600 font-sans mt-0.5">{sortedStateRows[0]?.visitors || 0} views ({sortedStateRows[0]?.percentage || 0}%)</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border border-slate-200">
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Unidentified ("Unknown")</span>
                    <strong className="text-amber-700 text-sm font-sans">{stateAnalyticsMap['Unknown']?.visitors || 0} views</strong>
                    <div className="text-[11px] text-gray-600 font-sans mt-0.5">{stateAnalyticsMap['Unknown']?.percentage || 0}% of total</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table of Nigerian States */}
          <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
              <h3 className="text-sm font-bold text-primary">Audience Breakdown by Nigerian State</h3>
              <span className="text-xs text-gray-500 font-mono">Total Active Records: {sortedStateRows.length}</span>
            </div>

            {sortedStateRows.length === 0 ? (
              <div className="p-12 text-center text-gray-500 font-sans">
                No audience data recorded for the selected filter criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-slate-100 border-b border-slate-200 text-gray-700 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3">
                        <button 
                          onClick={() => handleStateSort('state')}
                          className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-none"
                        >
                          <span>State</span>
                          <ArrowUpDown className={`w-3 h-3 ${stateSortField === 'state' ? 'text-primary font-bold' : 'text-slate-400'}`} />
                        </button>
                      </th>
                      <th className="p-3 text-right">
                        <button 
                          onClick={() => handleStateSort('visitors')}
                          className="flex items-center justify-end gap-1.5 w-full hover:text-primary transition-colors focus:outline-none"
                        >
                          <span>Page Views</span>
                          <ArrowUpDown className={`w-3 h-3 ${stateSortField === 'visitors' ? 'text-primary font-bold' : 'text-slate-400'}`} />
                        </button>
                      </th>
                      <th className="p-3 text-right">
                        <button 
                          onClick={() => handleStateSort('uniqueVisitors')}
                          className="flex items-center justify-end gap-1.5 w-full hover:text-primary transition-colors focus:outline-none"
                        >
                          <span>Unique Visitors</span>
                          <ArrowUpDown className={`w-3 h-3 ${stateSortField === 'uniqueVisitors' ? 'text-primary font-bold' : 'text-slate-400'}`} />
                        </button>
                      </th>
                      <th className="p-3 text-right">
                        <button 
                          onClick={() => handleStateSort('sessions')}
                          className="flex items-center justify-end gap-1.5 w-full hover:text-primary transition-colors focus:outline-none"
                        >
                          <span>Sessions</span>
                          <ArrowUpDown className={`w-3 h-3 ${stateSortField === 'sessions' ? 'text-primary font-bold' : 'text-slate-400'}`} />
                        </button>
                      </th>
                      <th className="p-3 text-right">
                        <button 
                          onClick={() => handleStateSort('percentage')}
                          className="flex items-center justify-end gap-1.5 w-full hover:text-primary transition-colors focus:outline-none"
                        >
                          <span>Share (%)</span>
                          <ArrowUpDown className={`w-3 h-3 ${stateSortField === 'percentage' ? 'text-primary font-bold' : 'text-slate-400'}`} />
                        </button>
                      </th>
                      <th className="p-3 text-right">
                        <button 
                          onClick={() => handleStateSort('avgEngagement')}
                          className="flex items-center justify-end gap-1.5 w-full hover:text-primary transition-colors focus:outline-none"
                        >
                          <span>Avg Engagement</span>
                          <ArrowUpDown className={`w-3 h-3 ${stateSortField === 'avgEngagement' ? 'text-primary font-bold' : 'text-slate-400'}`} />
                        </button>
                      </th>
                      <th className="p-3">Top Traffic Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {sortedStateRows.map((row) => {
                      const topSource = Object.entries(row.sources).sort((a, b) => b[1] - a[1])[0]?.[0] || 'direct';
                      const avgSec = row.visitors > 0 ? Math.round(row.totalEngagementSec / row.visitors) : 0;
                      return (
                        <tr key={row.state} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-primary flex items-center gap-2">
                            <span>{row.state === 'Unknown' ? '❓' : '📍'}</span>
                            {row.state}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">{row.visitors}</td>
                          <td className="p-3 text-right font-mono text-emerald-700 font-semibold">{row.uniqueVisitors}</td>
                          <td className="p-3 text-right font-mono text-slate-700">{row.sessions}</td>
                          <td className="p-3 text-right font-mono font-bold text-blue-700">
                            <div className="flex items-center justify-end gap-2">
                              <span>{row.percentage}%</span>
                              <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full" style={{ width: `${Math.min(100, row.percentage)}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-right font-mono text-slate-700">{formatSeconds(avgSec)}</td>
                          <td className="p-3 uppercase text-[10px] font-bold tracking-wider text-slate-600">{topSource}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Day-of-Week Trends */}
      {activeTab === 'dayOfWeek' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Highest Activity Day</span>
              <div className="text-xl font-bold text-emerald-950 mt-1">{peakDay ? peakDay.day : 'No data'}</div>
              <p className="text-xs text-emerald-800 mt-1">
                {peakDay ? `${peakDay.views} page views, ${peakDay.unique} unique visitors (${peakDay.rate}% engaged)` : 'No records logged.'}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Lowest Activity Day</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{lowestDay ? lowestDay.day : 'No data'}</div>
              <p className="text-xs text-slate-600 mt-1">
                {lowestDay ? `${lowestDay.views} page views, ${lowestDay.unique} unique visitors (${lowestDay.rate}% engaged)` : 'No records logged.'}
              </p>
            </div>
          </div>

          <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 bg-surface-container-low border-b border-outline-variant">
              <h3 className="text-sm font-bold text-primary">Day-of-Week Performance (Monday - Sunday WAT)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-100 border-b border-slate-200 text-gray-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Day of Week</th>
                    <th className="p-3 text-right">Page Views</th>
                    <th className="p-3 text-right">Unique Visitors</th>
                    <th className="p-3 text-right">Sessions</th>
                    <th className="p-3 text-right">Avg Engagement Time</th>
                    <th className="p-3 text-right">Engagement Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {dayOfWeekTrends.map((row) => (
                    <tr key={row.day} className={row.day === peakDay?.day ? 'bg-emerald-50/60 font-medium' : 'hover:bg-slate-50'}>
                      <td className="p-3 font-bold text-primary flex items-center gap-2">
                        {row.day === peakDay?.day && <span className="text-emerald-600 text-xs">⭐</span>}
                        {row.day}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">{row.views}</td>
                      <td className="p-3 text-right font-mono text-emerald-700 font-semibold">{row.unique}</td>
                      <td className="p-3 text-right font-mono text-slate-700">{row.sessions}</td>
                      <td className="p-3 text-right font-mono text-slate-700">{formatSeconds(row.avgSec)}</td>
                      <td className="p-3 text-right font-mono font-bold text-indigo-700">{row.rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Time-of-Day Engagement Patterns */}
      {activeTab === 'timeOfDay' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Peak Hour of Engagement (WAT)</span>
              <div className="text-xl font-bold text-blue-950 mt-1">{peakHour ? peakHour.label : 'No data'}</div>
              <p className="text-xs text-blue-800 mt-1">
                {peakHour ? `${peakHour.views} views, ${peakHour.unique} unique visitors (${peakHour.rate}% engaged)` : 'No activity.'}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Lowest Hour of Engagement (WAT)</span>
              <div className="text-xl font-bold text-slate-900 mt-1">{lowestHour ? lowestHour.label : 'No data'}</div>
              <p className="text-xs text-slate-600 mt-1">
                {lowestHour ? `${lowestHour.views} views, ${lowestHour.unique} unique visitors` : 'No activity.'}
              </p>
            </div>
          </div>

          <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 bg-surface-container-low border-b border-outline-variant">
              <h3 className="text-sm font-bold text-primary">Hourly Distribution Breakdown (West Africa Time - WAT/UTC+1)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-100 border-b border-slate-200 text-gray-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Hour (WAT)</th>
                    <th className="p-3 text-right">Page Views</th>
                    <th className="p-3 text-right">Unique Visitors</th>
                    <th className="p-3 text-right">Sessions</th>
                    <th className="p-3 text-right">Avg Engagement</th>
                    <th className="p-3 text-right">Engagement Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono">
                  {timeOfDayTrends.map((row) => (
                    <tr key={row.hour} className={row.hour === peakHour?.hour ? 'bg-blue-50/60 font-semibold' : 'hover:bg-slate-50'}>
                      <td className="p-3 font-sans font-bold text-primary">{row.label}</td>
                      <td className="p-3 text-right font-bold text-slate-900">{row.views}</td>
                      <td className="p-3 text-right text-emerald-700 font-semibold">{row.unique}</td>
                      <td className="p-3 text-right text-slate-700">{row.sessions}</td>
                      <td className="p-3 text-right text-slate-700">{formatSeconds(row.avgSec)}</td>
                      <td className="p-3 text-right font-bold text-indigo-700">{row.rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: "Watch Now" Video Clicks */}
      {activeTab === 'watchNow' && (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl text-purple-900 text-xs leading-relaxed flex items-start gap-3">
            <Play className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm">"Watch Now" Video Interaction Telemetry</span>
              Tracks actual clicks on "Watch Now" or episode play buttons. Accidental double clicks within 2 seconds are automatically de-duplicated. Clicks are tracked separately from full video watch completion.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-outline-variant p-4 rounded-xl">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Watch Clicks</span>
              <div className="text-2xl font-bold text-purple-700 mt-1">{metrics.watchNowClicks}</div>
            </div>
            <div className="bg-white border border-outline-variant p-4 rounded-xl">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unique Clickers</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">{metrics.uniqueWatchNowVisitors}</div>
            </div>
            <div className="bg-white border border-outline-variant p-4 rounded-xl">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Programme Watch CTR</span>
              <div className="text-2xl font-bold text-indigo-700 mt-1">{metrics.watchNowCTR}%</div>
            </div>
          </div>

          {/* Table of Watch Now Events */}
          <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 bg-surface-container-low border-b border-outline-variant">
              <h3 className="text-sm font-bold text-primary">Recorded "Watch Now" Click Log</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-100 border-b border-slate-200 text-gray-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Time WAT</th>
                    <th className="p-3">Programme</th>
                    <th className="p-3">Video / Episode</th>
                    <th className="p-3">State</th>
                    <th className="p-3">Device</th>
                    <th className="p-3">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentEvents.filter(e => e.eventType === 'watch_now_click').length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        No "Watch Now" clicks recorded in the selected period.
                      </td>
                    </tr>
                  ) : (
                    currentEvents.filter(e => e.eventType === 'watch_now_click').map((row) => (
                      <tr key={row.id || Math.random()} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-600">{row.dateWAT || row.timestamp}</td>
                        <td className="p-3 font-bold text-primary">{row.programmeName || 'General'}</td>
                        <td className="p-3 font-medium text-slate-800">{row.videoTitle || row.videoId || 'Default Episode'}</td>
                        <td className="p-3 font-semibold text-slate-700">📍 {row.state}</td>
                        <td className="p-3 uppercase text-[10px] font-bold text-slate-600">{row.deviceType}</td>
                        <td className="p-3 text-[10px] font-mono text-slate-500">{row.buttonLocation || 'watch_button'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: "Copy Weblink" Clicks */}
      {activeTab === 'copyWeblink' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 text-xs leading-relaxed flex items-start gap-3">
            <Share2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm">"Copy Weblink" Interaction Telemetry</span>
              Tracks verified clipboard copy operations. Successful copy actions (`copy_weblink_click`) are counted separately from clipboard errors (`copy_weblink_failure`).
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-outline-variant p-4 rounded-xl">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Successful Copies</span>
              <div className="text-2xl font-bold text-amber-700 mt-1">{metrics.copyWeblinkClicks}</div>
            </div>
            <div className="bg-white border border-outline-variant p-4 rounded-xl">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Unique Users</span>
              <div className="text-2xl font-bold text-emerald-700 mt-1">{metrics.uniqueCopyWeblinkVisitors}</div>
            </div>
            <div className="bg-white border border-outline-variant p-4 rounded-xl">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Clipboard Failures</span>
              <div className="text-2xl font-bold text-red-600 mt-1">{metrics.copyWeblinkFailures}</div>
            </div>
            <div className="bg-white border border-outline-variant p-4 rounded-xl">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Copy-Link Share Rate</span>
              <div className="text-2xl font-bold text-blue-700 mt-1">{metrics.copyLinkRate}%</div>
            </div>
          </div>

          {/* Table of Copy Weblink Events */}
          <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 bg-surface-container-low border-b border-outline-variant">
              <h3 className="text-sm font-bold text-primary">Recorded "Copy Weblink" Click Log</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-100 border-b border-slate-200 text-gray-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Time WAT</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Programme</th>
                    <th className="p-3">Video Title</th>
                    <th className="p-3">State</th>
                    <th className="p-3">Device</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentEvents.filter(e => e.eventType === 'copy_weblink_click' || e.eventType === 'copy_weblink_failure').length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        No copy link events recorded in the selected period.
                      </td>
                    </tr>
                  ) : (
                    currentEvents.filter(e => e.eventType === 'copy_weblink_click' || e.eventType === 'copy_weblink_failure').map((row) => (
                      <tr key={row.id || Math.random()} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-600">{row.dateWAT || row.timestamp}</td>
                        <td className="p-3">
                          {row.eventType === 'copy_weblink_click' ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">Success</span>
                          ) : (
                            <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded font-bold">Failure ({row.errorMessage})</span>
                          )}
                        </td>
                        <td className="p-3 font-bold text-primary">{row.programmeName || 'General'}</td>
                        <td className="p-3 font-medium text-slate-800">{row.videoTitle || 'Programme Page'}</td>
                        <td className="p-3 font-semibold text-slate-700">📍 {row.state}</td>
                        <td className="p-3 uppercase text-[10px] font-bold text-slate-600">{row.deviceType}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Programme Page Performance & Separated Metrics */}
      {activeTab === 'programmeRankings' && (
        <div className="space-y-6">
          <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-primary">Most-Viewed Programme Pages & Performance Rankings</h3>
                <p className="text-xs text-gray-500">Detailed metric breakdown separating link clicks, page loads, watch clicks, copy links, and failed attempts</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-100 border-b border-slate-200 text-gray-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Programme Page</th>
                    <th className="p-3 text-right">Link Clicks</th>
                    <th className="p-3 text-right">Page Loads</th>
                    <th className="p-3 text-right">Page Views</th>
                    <th className="p-3 text-right text-purple-700">Watch Clicks</th>
                    <th className="p-3 text-right text-amber-700">Copy Links</th>
                    <th className="p-3 text-right text-red-600">Failed Attempts</th>
                    <th className="p-3 text-right">Unique Users</th>
                    <th className="p-3 text-right">Avg Engagement</th>
                    <th className="p-3 text-right">Watch CTR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {programmePageMetricsList.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-gray-500">
                        No programme page data available for selected filters.
                      </td>
                    </tr>
                  ) : (
                    programmePageMetricsList.map((row) => (
                      <tr key={row.programmeName} className="hover:bg-slate-50 font-mono">
                        <td className="p-3 font-sans font-bold text-primary">
                          <div>{row.programmeName}</div>
                          <span className="text-[10px] font-mono text-gray-500 font-normal">{row.path}</span>
                        </td>
                        <td className="p-3 text-right text-slate-700">{row.linkClicks}</td>
                        <td className="p-3 text-right text-emerald-700 font-semibold">{row.pageLoads}</td>
                        <td className="p-3 text-right font-bold text-slate-900">{row.pageViews}</td>
                        <td className="p-3 text-right font-bold text-purple-700">{row.watchNowClicks}</td>
                        <td className="p-3 text-right font-bold text-amber-700">{row.copyWeblinkClicks}</td>
                        <td className="p-3 text-right font-bold text-red-600">{row.failedAttempts}</td>
                        <td className="p-3 text-right text-slate-800">{row.uniqueVisitors}</td>
                        <td className="p-3 text-right text-slate-700">{formatSeconds(row.avgEngagementSec)}</td>
                        <td className="p-3 text-right font-bold text-indigo-700">{row.watchCTR}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: Live Audit Inspector */}
      {activeTab === 'rawEvents' && (
        <div className="space-y-6">
          <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 font-mono text-xs flex justify-between items-center">
            <div>
              <span className="text-emerald-400 font-bold">🟢 Live Real-Time Telemetry Stream</span>
              <p className="text-slate-400 text-[11px] mt-0.5">Subscribed directly to Firestore collection `audience_analytics_events`</p>
            </div>
            <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded text-[11px] font-bold">
              {events.length} Total Events
            </span>
          </div>

          <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-xs">
            <div className="p-4 bg-surface-container-low border-b border-outline-variant">
              <h3 className="text-sm font-bold text-primary">Live Database Event Inspector</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-100 border-b border-slate-200 text-gray-700 font-bold uppercase tracking-wider font-mono text-[11px]">
                  <tr>
                    <th className="p-3">Time (WAT)</th>
                    <th className="p-3">Event Type</th>
                    <th className="p-3">State</th>
                    <th className="p-3">Page / Path</th>
                    <th className="p-3">Programme / Video</th>
                    <th className="p-3">Visitor ID</th>
                    <th className="p-3">Device / Source</th>
                    <th className="p-3 text-right">Secs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {currentEvents.slice(0, 100).map((ev) => (
                    <tr key={ev.id || Math.random()} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-600 whitespace-nowrap">{ev.dateWAT || ev.timestamp}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ev.eventType === 'watch_now_click' ? 'bg-purple-100 text-purple-800' :
                          ev.eventType === 'copy_weblink_click' ? 'bg-amber-100 text-amber-800' :
                          ev.eventType === 'programme_page_failed' ? 'bg-red-100 text-red-800' :
                          ev.eventType === 'programme_page_load' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {ev.eventType || 'page_view'}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-800">📍 {ev.state}</td>
                      <td className="p-3 text-slate-900 font-semibold max-w-[150px] truncate" title={ev.path}>{ev.path}</td>
                      <td className="p-3 text-slate-700 max-w-[150px] truncate">{ev.programmeName || ev.videoTitle || '-'}</td>
                      <td className="p-3 text-slate-500 font-mono text-[10px]">{ev.visitorId}</td>
                      <td className="p-3 text-slate-600 uppercase text-[10px]">{ev.deviceType} / {ev.trafficSource}</td>
                      <td className="p-3 text-right text-slate-900 font-bold">{ev.engagementSeconds || 0}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
