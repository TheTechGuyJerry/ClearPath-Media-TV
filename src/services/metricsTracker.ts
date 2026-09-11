import { db } from '../lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

// In-memory session caches to prevent duplicate view increments on simple re-renders
const viewedVideosInSession = new Set<string>();
const viewedPubsInSession = new Set<string>();
const viewedBriefingsInSession = new Set<string>();

function sendAnalyticsBeacon(payload: Record<string, any>) {
  try {
    const body = JSON.stringify(payload);
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon('/api/track', blob);
    } else {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true
      }).catch(() => {});
    }
  } catch {
    // Graceful fallback
  }
}

/**
 * Tracks a video view and increments video viewCount
 */
export async function trackVideoView(videoId: string, videoTitle?: string, programmeId?: string) {
  if (!videoId) return;

  // Deduplicate within the same browser session
  const sessionKey = `vid_view_${videoId}`;
  if (viewedVideosInSession.has(sessionKey)) return;
  viewedVideosInSession.add(sessionKey);

  // 1. Direct Firestore increment
  try {
    const videoRef = doc(db, 'programmeVideos', videoId);
    await updateDoc(videoRef, {
      viewCount: increment(1)
    });
  } catch {
    // If client lacks direct write permission or record hasn't synced, fallback to API
  }

  // 2. Server analytics & fallback counter
  sendAnalyticsBeacon({
    eventType: 'video_view',
    contentType: 'programme',
    videoId,
    videoTitle: videoTitle || '',
    programmeId: programmeId || '',
    path: window.location.pathname,
    pageTitle: document.title
  });
}

/**
 * Tracks a video download and increments video downloadCount
 */
export async function trackVideoDownload(videoId: string, videoTitle?: string, programmeId?: string) {
  if (!videoId) return;

  // 1. Direct Firestore increment
  try {
    const videoRef = doc(db, 'programmeVideos', videoId);
    await updateDoc(videoRef, {
      downloadCount: increment(1)
    });
  } catch {
    // Fallback
  }

  // 2. Server analytics & fallback counter
  sendAnalyticsBeacon({
    eventType: 'video_download',
    contentType: 'programme',
    videoId,
    videoTitle: videoTitle || '',
    programmeId: programmeId || '',
    path: window.location.pathname,
    pageTitle: document.title
  });
}

/**
 * Tracks a publication view and increments publication viewCount
 */
export async function trackPublicationView(publicationId: string, title?: string) {
  if (!publicationId) return;

  const sessionKey = `pub_view_${publicationId}`;
  if (viewedPubsInSession.has(sessionKey)) return;
  viewedPubsInSession.add(sessionKey);

  // 1. Direct Firestore increment
  try {
    const pubRef = doc(db, 'electionMattersWeekly', publicationId);
    await updateDoc(pubRef, {
      viewCount: increment(1)
    });
  } catch {
    // Fallback
  }

  // 2. Server analytics & fallback counter
  sendAnalyticsBeacon({
    eventType: 'publication_view',
    contentType: 'publication',
    publicationId,
    publicationTitle: title || '',
    path: window.location.pathname,
    pageTitle: document.title
  });
}

/**
 * Tracks a publication download and increments publication downloadCount
 */
export async function trackPublicationDownload(publicationId: string, title?: string) {
  if (!publicationId) return;

  // 1. Direct Firestore increment
  try {
    const pubRef = doc(db, 'electionMattersWeekly', publicationId);
    await updateDoc(pubRef, {
      downloadCount: increment(1)
    });
  } catch {
    // Fallback
  }

  // 2. Server analytics & fallback counter
  sendAnalyticsBeacon({
    eventType: 'publication_download',
    contentType: 'publication',
    publicationId,
    publicationTitle: title || '',
    path: window.location.pathname,
    pageTitle: document.title
  });
}

/**
 * Tracks a briefing view and increments briefing viewCount
 */
export async function trackBriefingView(briefingId: string, title?: string) {
  if (!briefingId) return;

  const sessionKey = `briefing_view_${briefingId}`;
  if (viewedBriefingsInSession.has(sessionKey)) return;
  viewedBriefingsInSession.add(sessionKey);

  try {
    const briefingRef = doc(db, 'briefings', briefingId);
    await updateDoc(briefingRef, {
      viewCount: increment(1)
    });
  } catch {
    // Fallback
  }

  sendAnalyticsBeacon({
    eventType: 'briefing_view',
    contentType: 'briefing',
    videoId: briefingId,
    videoTitle: title || '',
    path: window.location.pathname,
    pageTitle: document.title
  });
}

/**
 * Tracks a briefing download
 */
export async function trackBriefingDownload(briefingId: string, title?: string) {
  if (!briefingId) return;

  try {
    const briefingRef = doc(db, 'briefings', briefingId);
    await updateDoc(briefingRef, {
      downloadCount: increment(1)
    });
  } catch {
    // Fallback
  }

  sendAnalyticsBeacon({
    eventType: 'briefing_download',
    contentType: 'briefing',
    videoId: briefingId,
    videoTitle: title || '',
    path: window.location.pathname,
    pageTitle: document.title
  });
}

/**
 * Tracks a publication share and increments publication shareCount
 */
export async function trackPublicationShare(publicationId: string, title?: string) {
  if (!publicationId) return;

  try {
    const pubRef = doc(db, 'electionMattersWeekly', publicationId);
    await updateDoc(pubRef, {
      shareCount: increment(1)
    });
  } catch {
    // Fallback
  }

  sendAnalyticsBeacon({
    eventType: 'publication_share',
    contentType: 'publication',
    publicationId,
    publicationTitle: title || '',
    path: window.location.pathname,
    pageTitle: document.title
  });
}

/**
 * Tracks a video share and increments video shareCount
 */
export async function trackVideoShare(videoId: string, videoTitle?: string, programmeId?: string) {
  if (!videoId) return;

  try {
    const videoRef = doc(db, 'programmeVideos', videoId);
    await updateDoc(videoRef, {
      shareCount: increment(1)
    });
  } catch {
    // Fallback
  }

  sendAnalyticsBeacon({
    eventType: 'video_share',
    contentType: 'programme',
    videoId,
    videoTitle: videoTitle || '',
    programmeId: programmeId || '',
    path: window.location.pathname,
    pageTitle: document.title
  });
}

/**
 * Tracks a briefing share and increments briefing shareCount
 */
export async function trackBriefingShare(briefingId: string, title?: string) {
  if (!briefingId) return;

  try {
    const briefingRef = doc(db, 'briefings', briefingId);
    await updateDoc(briefingRef, {
      shareCount: increment(1)
    });
  } catch {
    // Fallback
  }

  sendAnalyticsBeacon({
    eventType: 'briefing_share',
    contentType: 'briefing',
    videoId: briefingId,
    videoTitle: title || '',
    path: window.location.pathname,
    pageTitle: document.title
  });
}

