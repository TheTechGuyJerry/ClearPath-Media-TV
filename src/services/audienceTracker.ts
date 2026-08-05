/**
 * Client-Side Anonymized Audience Tracking Service
 * Zero PII logged - uses non-reversible local tokens & server IP geolocation
 */

function getOrCreateVisitorId(): string {
  try {
    let vid = localStorage.getItem('clearpath_vid');
    if (!vid || !vid.startsWith('v_')) {
      vid = 'v_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      localStorage.setItem('clearpath_vid', vid);
    }
    return vid;
  } catch {
    return 'v_' + Math.random().toString(36).substring(2, 11);
  }
}

function getOrCreateSessionId(): string {
  try {
    let sid = sessionStorage.getItem('clearpath_sid');
    if (!sid || !sid.startsWith('s_')) {
      sid = 's_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      sessionStorage.setItem('clearpath_sid', sid);
    }
    return sid;
  } catch {
    return 's_' + Math.random().toString(36).substring(2, 11);
  }
}

function getContentType(path: string): 'programme' | 'explainer' | 'briefing' | 'news' | 'home' | 'other' {
  if (path === '/' || path === '') return 'home';
  if (path.startsWith('/programmes') || path.startsWith('/election-matters')) return 'programme';
  if (path.startsWith('/explainers')) return 'explainer';
  if (path.startsWith('/briefing')) return 'briefing';
  if (path.startsWith('/news')) return 'news';
  return 'other';
}

function getTrafficSource(): 'direct' | 'google' | 'social' | 'referral' | 'other' {
  const ref = document.referrer.toLowerCase();
  if (!ref) return 'direct';
  if (ref.includes('google.') || ref.includes('bing.') || ref.includes('duckduckgo.') || ref.includes('yahoo.')) {
    return 'google';
  }
  if (ref.includes('t.co') || ref.includes('twitter.') || ref.includes('x.com') || ref.includes('facebook.') || ref.includes('instagram.') || ref.includes('linkedin.') || ref.includes('youtube.')) {
    return 'social';
  }
  if (ref.includes(window.location.hostname)) return 'direct';
  return 'referral';
}

function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  const width = window.innerWidth;
  const ua = navigator.userAgent.toLowerCase();
  if (width <= 640 || /mobile|iphone|ipod|android.*mobile/i.test(ua)) {
    return 'mobile';
  }
  if ((width > 640 && width <= 1024) || /ipad|tablet|android(?!.*mobile)/i.test(ua)) {
    return 'tablet';
  }
  return 'desktop';
}

class AudienceTracker {
  private currentPath: string = '';
  private startTime: number = Date.now();
  private isTracking: boolean = false;
  private lastWatchClickTime: Map<string, number> = new Map();

  public init() {
    if (typeof window === 'undefined' || this.isTracking) return;
    this.isTracking = true;

    // Track active engagement window state
    window.addEventListener('beforeunload', () => {
      this.sendPageEngagement();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.sendPageEngagement();
      } else {
        this.startTime = Date.now();
      }
    });
  }

  public trackPageView(path: string, pageTitle: string) {
    if (typeof window === 'undefined') return;

    // Flush previous page engagement if route changed
    if (this.currentPath && this.currentPath !== path) {
      this.sendPageEngagement();
    }

    this.currentPath = path;
    this.startTime = Date.now();

    const payload = {
      visitorId: getOrCreateVisitorId(),
      sessionId: getOrCreateSessionId(),
      path,
      pageTitle: pageTitle || document.title,
      contentType: getContentType(path),
      trafficSource: getTrafficSource(),
      deviceType: getDeviceType(),
      eventType: 'page_view',
      engagementSeconds: 2 // Initial default entry engagement
    };

    this.sendPayload(payload);
  }

  /**
   * Tracks a "Watch Now" video button click with accidental double-click de-duplication (2s window)
   */
  public trackWatchNowClick(params: {
    programmeId?: string;
    programmeName?: string;
    videoId?: string;
    videoTitle?: string;
    pageTitle?: string;
    path?: string;
    buttonLocation?: string;
  }) {
    if (typeof window === 'undefined') return;

    const key = `${params.programmeId || ''}_${params.videoId || ''}_${params.buttonLocation || ''}`;
    const now = Date.now();
    const lastTime = this.lastWatchClickTime.get(key) || 0;
    if (now - lastTime < 2000) {
      // Ignore rapid duplicate double-click
      return;
    }
    this.lastWatchClickTime.set(key, now);

    const path = params.path || this.currentPath || window.location.pathname;

    const payload = {
      visitorId: getOrCreateVisitorId(),
      sessionId: getOrCreateSessionId(),
      path,
      pageTitle: params.pageTitle || document.title,
      contentType: getContentType(path),
      trafficSource: getTrafficSource(),
      deviceType: getDeviceType(),
      eventType: 'watch_now_click',
      programmeId: params.programmeId || '',
      programmeName: params.programmeName || '',
      videoId: params.videoId || '',
      videoTitle: params.videoTitle || '',
      buttonLocation: params.buttonLocation || 'watch_button',
      engagementSeconds: 0
    };

    this.sendPayload(payload);
  }

  /**
   * Tracks a successful "Copy Weblink" click event
   */
  public trackCopyWeblinkSuccess(params: {
    programmeId?: string;
    programmeName?: string;
    videoId?: string;
    videoTitle?: string;
    pageTitle?: string;
    path?: string;
  }) {
    if (typeof window === 'undefined') return;

    const path = params.path || this.currentPath || window.location.pathname;

    const payload = {
      visitorId: getOrCreateVisitorId(),
      sessionId: getOrCreateSessionId(),
      path,
      pageTitle: params.pageTitle || document.title,
      contentType: getContentType(path),
      trafficSource: getTrafficSource(),
      deviceType: getDeviceType(),
      eventType: 'copy_weblink_click',
      programmeId: params.programmeId || '',
      programmeName: params.programmeName || '',
      videoId: params.videoId || '',
      videoTitle: params.videoTitle || '',
      engagementSeconds: 0
    };

    this.sendPayload(payload);
  }

  /**
   * Tracks a failed "Copy Weblink" attempt
   */
  public trackCopyWeblinkFailure(params: {
    programmeId?: string;
    programmeName?: string;
    videoId?: string;
    videoTitle?: string;
    pageTitle?: string;
    path?: string;
    errorMessage?: string;
  }) {
    if (typeof window === 'undefined') return;

    const path = params.path || this.currentPath || window.location.pathname;

    const payload = {
      visitorId: getOrCreateVisitorId(),
      sessionId: getOrCreateSessionId(),
      path,
      pageTitle: params.pageTitle || document.title,
      contentType: getContentType(path),
      trafficSource: getTrafficSource(),
      deviceType: getDeviceType(),
      eventType: 'copy_weblink_failure',
      programmeId: params.programmeId || '',
      programmeName: params.programmeName || '',
      videoId: params.videoId || '',
      videoTitle: params.videoTitle || '',
      errorMessage: params.errorMessage || 'Copy to clipboard failed',
      engagementSeconds: 0
    };

    this.sendPayload(payload);
  }

  /**
   * Tracks an explicit user click intended to open a programme page
   */
  public trackProgrammePageClick(params: {
    programmeId: string;
    programmeName: string;
    path: string;
  }) {
    if (typeof window === 'undefined') return;

    const payload = {
      visitorId: getOrCreateVisitorId(),
      sessionId: getOrCreateSessionId(),
      path: params.path,
      pageTitle: `Programme: ${params.programmeName}`,
      contentType: 'programme',
      trafficSource: getTrafficSource(),
      deviceType: getDeviceType(),
      eventType: 'programme_page_click',
      programmeId: params.programmeId,
      programmeName: params.programmeName,
      engagementSeconds: 0
    };

    this.sendPayload(payload);
  }

  /**
   * Tracks a successful programme page load
   */
  public trackProgrammePageLoad(params: {
    programmeId: string;
    programmeName: string;
    path: string;
  }) {
    if (typeof window === 'undefined') return;

    const payload = {
      visitorId: getOrCreateVisitorId(),
      sessionId: getOrCreateSessionId(),
      path: params.path,
      pageTitle: `Programme: ${params.programmeName}`,
      contentType: 'programme',
      trafficSource: getTrafficSource(),
      deviceType: getDeviceType(),
      eventType: 'programme_page_load',
      programmeId: params.programmeId,
      programmeName: params.programmeName,
      engagementSeconds: 2
    };

    this.sendPayload(payload);
  }

  /**
   * Tracks a failed or unavailable programme page attempt
   */
  public trackProgrammePageFailed(params: {
    programmeId?: string;
    programmeName?: string;
    path: string;
    errorMessage?: string;
  }) {
    if (typeof window === 'undefined') return;

    const payload = {
      visitorId: getOrCreateVisitorId(),
      sessionId: getOrCreateSessionId(),
      path: params.path,
      pageTitle: `Failed Attempt: ${params.path}`,
      contentType: 'programme',
      trafficSource: getTrafficSource(),
      deviceType: getDeviceType(),
      eventType: 'programme_page_failed',
      programmeId: params.programmeId || '',
      programmeName: params.programmeName || 'Unavailable Programme',
      errorMessage: params.errorMessage || 'Programme page not found',
      engagementSeconds: 0
    };

    this.sendPayload(payload);
  }

  private sendPageEngagement() {
    if (!this.currentPath) return;

    const durationSeconds = Math.round((Date.now() - this.startTime) / 1000);
    if (durationSeconds < 2) return; // ignore sub-2s bounces

    const payload = {
      visitorId: getOrCreateVisitorId(),
      sessionId: getOrCreateSessionId(),
      path: this.currentPath,
      pageTitle: document.title,
      contentType: getContentType(this.currentPath),
      trafficSource: getTrafficSource(),
      deviceType: getDeviceType(),
      eventType: 'page_view',
      engagementSeconds: Math.min( durationSeconds, 1800 ) // max 30m session block
    };

    this.sendPayload(payload, true);
  }

  private sendPayload(payload: any, isBeacon: boolean = false) {
    try {
      const body = JSON.stringify(payload);
      if (isBeacon && navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon('/api/track', blob);
      } else {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true
        }).catch(() => {
          // Silent catch to guarantee zero impact on user experience
        });
      }
    } catch {
      // Ignore errors
    }
  }
}

export const audienceTracker = new AudienceTracker();
