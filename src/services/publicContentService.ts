import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Programme, ProgrammeVideo, Explainer } from '../types';
import { formatFirestoreDate } from '../utils/formatters';

// ==========================================
// 1. Safe Helper Functions
// ==========================================

export function safeArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

export function safeDate(value: any): Date | null {
  if (!value) return null;
  
  // Handle Firestore Timestamp object
  if (typeof value === 'object' && value !== null && 'seconds' in value && typeof value.toDate === 'function') {
    try {
      return value.toDate();
    } catch (e) {
      console.warn('[safeDate] Failed converting Timestamp:', e);
    }
  }
  
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }
  
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export function safeText(value: string | null | undefined, fallback: string): string {
  if (value === null || value === undefined || String(value).trim() === '') {
    return fallback;
  }
  return String(value);
}

export function slugify(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

// ==========================================
// 2. Safe Firestore Operations
// ==========================================

export async function getActiveProgrammes(): Promise<Programme[]> {
  try {
    const snap = await getDocs(collection(db, 'programmes'));
    if (snap.empty) return [];
    
    const list = snap.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        createdAtLabel: formatFirestoreDate(data.createdAt),
        updatedAtLabel: formatFirestoreDate(data.updatedAt)
      } as Programme;
    });
    const active = list.filter(p => p.status === 'active');
    
    // Client-side sort order to avoid compound indexes
    active.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    return active;
  } catch (error) {
    console.error('[publicContentService] Error in getActiveProgrammes:', error);
    return [];
  }
}

export async function getActiveExplainers(): Promise<Explainer[]> {
  try {
    const snap = await getDocs(collection(db, 'explainers'));
    if (snap.empty) return [];
    
    const list = snap.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        createdAtLabel: formatFirestoreDate(data.createdAt),
        updatedAtLabel: formatFirestoreDate(data.updatedAt)
      } as Explainer;
    });
    const active = list.filter(e => e.status === 'active');
    
    active.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    return active;
  } catch (error) {
    console.error('[publicContentService] Error in getActiveExplainers:', error);
    return [];
  }
}

export async function getPublishedProgrammeVideos(): Promise<ProgrammeVideo[]> {
  try {
    const snap = await getDocs(collection(db, 'programmeVideos'));
    if (snap.empty) return [];
    
    const list = snap.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        publishedAtLabel: formatFirestoreDate(data.publishedAt || data.createdAt),
        createdAtLabel: formatFirestoreDate(data.createdAt),
        updatedAtLabel: formatFirestoreDate(data.updatedAt)
      } as ProgrammeVideo;
    });
    const published = list.filter(v => v.status === 'published');
    
    // Sort in reverse chronological order safely client-side
    published.sort((a, b) => {
      const dateA = safeDate(a.publishedAt) || safeDate(a.createdAt) || new Date(0);
      const dateB = safeDate(b.publishedAt) || safeDate(b.createdAt) || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
    
    return published;
  } catch (error) {
    console.error('[publicContentService] Error in getPublishedProgrammeVideos:', error);
    return [];
  }
}

export async function getProgrammeBySlug(slug: string | undefined): Promise<Programme | null> {
  if (!slug) return null;
  try {
    const programmes = await getActiveProgrammes();
    const cleanSlug = slug.trim().toLowerCase();
    
    // Try exact slug match, fallback to fallback slugify check, fallback to matching ID
    const matched = programmes.find(p => 
      (p.slug && p.slug.trim().toLowerCase() === cleanSlug) ||
      slugify(p.title) === cleanSlug ||
      p.id === slug
    );
    
    return matched || null;
  } catch (error) {
    console.error(`[publicContentService] Error in getProgrammeBySlug for raw slug "${slug}":`, error);
    return null;
  }
}

export async function getVideosForProgramme(programme: Programme | null | undefined): Promise<ProgrammeVideo[]> {
  if (!programme) return [];
  try {
    const allPublished = await getPublishedProgrammeVideos();
    const progId = programme.id;
    const progSlug = programme.slug;
    const progTitleClean = programme.title ? programme.title.trim().toLowerCase() : '';
    const progSlugifiedTitle = slugify(programme.title);
    
    const matchedVideos = allPublished.filter(video => {
      // 1. Direct ID/slug comparison
      if (video.programmeId === progId || video.programmeId === progSlug) {
        return true;
      }
      
      // 2. Normalized original title check
      if (video.programmeTitle && progTitleClean && video.programmeTitle.trim().toLowerCase() === progTitleClean) {
        return true;
      }
      
      // 3. Slugified matching of video parameter titles
      if (video.programmeTitle && progSlugifiedTitle && slugify(video.programmeTitle) === progSlugifiedTitle) {
        return true;
      }
      
      // 4. Slugified matching of video's ID/Slug field itself with our program's slug
      if (video.programmeId && progSlug && slugify(video.programmeId) === progSlug) {
        return true;
      }
      
      return false;
    });
    
    return matchedVideos;
  } catch (error) {
    console.error('[publicContentService] Error in getVideosForProgramme:', error);
    return [];
  }
}
