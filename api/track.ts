import { Request, Response } from 'express';
import { db, collection, addDoc } from './_db.js';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
  'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara', 'Abuja (FCT)'
];

// In-memory IP cache to avoid redundant external geo lookups
const ipGeoCache = new Map<string, string>();

/**
 * Anonymizes an IP address by stripping the last octet or host portion
 */
function anonymizeIp(ip: string): string {
  if (!ip || ip === '::1' || ip === '127.0.0.1') return '127.0.0.0';
  if (ip.includes('.')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
  } else if (ip.includes(':')) {
    const parts = ip.split(':');
    return parts.slice(0, 3).join(':') + '::';
  }
  return '0.0.0.0';
}

/**
 * Detects Nigerian state using IP-based lookup with fallback
 */
async function resolveNigerianState(rawIp: string, clientHintState?: string): Promise<string> {
  if (clientHintState && NIGERIAN_STATES.includes(clientHintState)) {
    return clientHintState;
  }

  const anonIp = anonymizeIp(rawIp);
  if (ipGeoCache.has(anonIp)) {
    return ipGeoCache.get(anonIp) || 'Unknown';
  }

  // If local / private loopback
  if (anonIp.startsWith('127.') || anonIp.startsWith('10.') || anonIp.startsWith('192.168.')) {
    // For local dev / cloud preview testing, assign Lagos or Unknown deterministically
    return 'Lagos';
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(`http://ip-api.com/json/${rawIp}?fields=status,country,regionName,city`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success' && data.country === 'Nigeria') {
        const region = data.regionName || '';
        // Match region with Nigerian States
        const matchedState = NIGERIAN_STATES.find(s => 
          region.toLowerCase().includes(s.toLowerCase()) || 
          s.toLowerCase().includes(region.toLowerCase()) ||
          (region.toLowerCase().includes('federal capital') && s.includes('Abuja'))
        );
        const resolved = matchedState || 'Unknown';
        ipGeoCache.set(anonIp, resolved);
        return resolved;
      }
    }
  } catch {
    // Timeout or network error, fallback gracefully
  }

  const fallback = 'Unknown';
  ipGeoCache.set(anonIp, fallback);
  return fallback;
}

/**
 * Calculates West Africa Time (WAT / UTC+1) properties
 */
function getWATTime() {
  const now = new Date();
  // WAT is UTC + 1 hour (3600000 ms)
  const watMs = now.getTime() + (1 * 60 * 60 * 1000);
  const watDate = new Date(watMs);

  const isoString = now.toISOString(); // GMT/UTC timestamp
  const year = watDate.getUTCFullYear();
  const month = String(watDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(watDate.getUTCDate()).padStart(2, '0');
  const dateWAT = `${year}-${month}-${day}`;

  const days: ('Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];
  const dayOfWeek = days[watDate.getUTCDay()];
  const hourWAT = watDate.getUTCHours(); // 0 - 23

  return { timestamp: isoString, dateWAT, dayOfWeek, hourWAT };
}

export default async function trackHandler(req: Request, res: Response) {
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    const {
      visitorId = 'v_anon_' + Math.random().toString(36).substring(2, 10),
      sessionId = 's_anon_' + Math.random().toString(36).substring(2, 10),
      path = '/',
      pageTitle = 'ClearPath Media',
      contentType = 'other',
      trafficSource = 'direct',
      deviceType = 'desktop',
      engagementSeconds = 0,
      clientState,
      eventType = 'page_view',
      programmeId = '',
      programmeName = '',
      videoId = '',
      videoTitle = '',
      buttonLocation = '',
      errorMessage = ''
    } = body;

    // Detect client IP
    const xForwardedFor = req.headers['x-forwarded-for'];
    const rawIp = (typeof xForwardedFor === 'string' ? xForwardedFor.split(',')[0] : req.socket.remoteAddress) || '127.0.0.1';

    const state = await resolveNigerianState(rawIp.trim(), clientState);
    const { timestamp, dateWAT, dayOfWeek, hourWAT } = getWATTime();

    // Store in Firestore collection `audience_analytics_events` asynchronously
    const eventRecord = {
      visitorId: String(visitorId).substring(0, 64),
      sessionId: String(sessionId).substring(0, 64),
      path: String(path).substring(0, 256),
      pageTitle: String(pageTitle).substring(0, 256),
      eventType: ['page_view', 'watch_now_click', 'copy_weblink_click', 'copy_weblink_failure', 'programme_page_click', 'programme_page_load', 'programme_page_failed'].includes(eventType) ? eventType : 'page_view',
      programmeId: String(programmeId).substring(0, 100),
      programmeName: String(programmeName).substring(0, 200),
      videoId: String(videoId).substring(0, 100),
      videoTitle: String(videoTitle).substring(0, 200),
      buttonLocation: String(buttonLocation).substring(0, 100),
      errorMessage: String(errorMessage).substring(0, 256),
      contentType: ['programme', 'explainer', 'briefing', 'news', 'home', 'other'].includes(contentType) ? contentType : 'other',
      trafficSource: ['direct', 'google', 'social', 'referral', 'other'].includes(trafficSource) ? trafficSource : 'other',
      deviceType: ['mobile', 'tablet', 'desktop'].includes(deviceType) ? deviceType : 'desktop',
      state,
      timestamp,
      dateWAT,
      dayOfWeek,
      hourWAT,
      engagementSeconds: Math.max(0, Math.min(86400, Number(engagementSeconds) || 0))
    };

    // Save event to Firestore without blocking the client response
    addDoc(collection(db, 'audience_analytics_events'), eventRecord).catch(err => {
      console.warn('Failed to save audience analytics event to Firestore:', err);
    });

    res.status(200).json({
      success: true,
      recordedState: state,
      dateWAT,
      dayOfWeek,
      hourWAT
    });
  } catch (error) {
    console.error('Error in trackHandler:', error);
    res.status(500).json({ error: 'Internal server tracking error' });
  }
}
