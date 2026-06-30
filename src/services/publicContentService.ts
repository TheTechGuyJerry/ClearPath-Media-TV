import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Programme, ProgrammeVideo, Explainer } from '../types';
import { formatFirestoreDate, adjustObjectFormatting } from '../utils/formatters';
import { COMPLETE_CATALOG_VIDEOS } from '../data/complete_catalog_data';

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
// 2. Fallback / Default Author Cards & Enriching
// ==========================================

export const DEFAULT_AUTHOR_CARDS: Record<string, Partial<Programme>> = {
  'daily-brief-with-annabel': {
    authorName: 'Annabel Orji',
    authorTitle: 'Host, Daily Brief with Annabel',
    authorRoleLabel: 'Briefing Host',
    authorBio: 'ClearPath Media’s weekday briefing voice, helping audiences understand the public issues, policies, and power dynamics shaping Nigeria and Africa.',
    showAuthorCard: true,
  },
  'osita-insights': {
    authorName: 'Osita Chidoka',
    authorTitle: 'Host, OsitaInsight',
    authorRoleLabel: 'Programme Host',
    authorBio: 'OsitaInsight examines governance, public leadership, political institutions, and civic responsibility through calm, evidence-based commentary.',
    showAuthorCard: true,
  },
  'clearpath-insights': {
    authorName: 'ClearPath Editorial Team',
    authorTitle: 'ClearPath Media',
    authorRoleLabel: 'Editorial Desk',
    authorBio: 'ClearPath Insights provides context-rich analysis on policy, governance, society, and public life.',
    showAuthorCard: true,
  },
  'nigeria-neighbours': {
    authorName: 'ClearPath Editorial Team',
    authorTitle: 'Regional Affairs Desk',
    authorRoleLabel: 'Regional Analysis',
    authorBio: 'Nigeria & Neighbours explores the connections between Nigeria, Africa, diplomacy, borders, security, trade, and regional power.',
    showAuthorCard: true,
  },
  'nigeria-and-neighbours': {
    authorName: 'ClearPath Editorial Team',
    authorTitle: 'Regional Affairs Desk',
    authorRoleLabel: 'Regional Analysis',
    authorBio: 'Nigeria & Neighbours explores the connections between Nigeria, Africa, diplomacy, borders, security, trade, and regional power.',
    showAuthorCard: true,
  },
  'election-matters': {
    authorName: 'ClearPath Editorial Team',
    authorTitle: 'Elections Desk',
    authorRoleLabel: 'Electoral Analysis',
    authorBio: 'Election Matters explains electoral systems, campaigns, institutions, voter behaviour, and democratic accountability.',
    showAuthorCard: true,
  },
  'mekaria-series': {
    authorName: 'ClearPath Editorial Team',
    authorTitle: 'Mekaria Series',
    authorRoleLabel: 'Special Series',
    authorBio: 'Mekaria Series presents focused conversations and civic learning around leadership, institutions, public service, and development.',
    showAuthorCard: true,
  }
};

export function enrichProgramme(p: Programme): Programme {
  const slugKey = p.slug || slugify(p.title) || p.id || '';
  const cleanSlugKey = slugKey.toLowerCase().trim();
  
  // Try exact key or key with/without hyphens or prefix
  const matchKey = Object.keys(DEFAULT_AUTHOR_CARDS).find(k => 
    k === cleanSlugKey ||
    cleanSlugKey.includes(k) ||
    k.includes(cleanSlugKey) ||
    k.replace(/-/g, '') === cleanSlugKey.replace(/-/g, '')
  );
  
  const defaults = matchKey ? DEFAULT_AUTHOR_CARDS[matchKey] : {};
  
  return {
    ...p,
    // Author/Presenter fields with robust defaults
    authorName: p.authorName || defaults.authorName || 'ClearPath Editorial Team',
    authorTitle: p.authorTitle || defaults.authorTitle || 'ClearPath Media',
    authorRoleLabel: p.authorRoleLabel || defaults.authorRoleLabel || 'Editorial Desk',
    authorBio: p.authorBio || defaults.authorBio || 'ClearPath Insights provides context-rich analysis on policy, governance, society, and public life.',
    authorImage: p.authorImage || defaults.authorImage || '',
    authorSocialUrl: p.authorSocialUrl || defaults.authorSocialUrl || '',
    authorButtonText: p.authorButtonText || defaults.authorButtonText || '',
    authorButtonUrl: p.authorButtonUrl || defaults.authorButtonUrl || '',
    showAuthorCard: p.showAuthorCard !== undefined ? p.showAuthorCard : (defaults.showAuthorCard !== undefined ? defaults.showAuthorCard : true),
    
    // Coming soon fields with robust defaults
    comingSoon: p.comingSoon !== undefined ? p.comingSoon : false,
    comingSoonTitle: p.comingSoonTitle || 'Coming Soon',
    comingSoonMessage: p.comingSoonMessage || 'This programme is being prepared. Check back soon for new ClearPath Media content.'
  };
}

// ==========================================
// 3. Safe Firestore Operations
// ==========================================

export async function getActiveProgrammes(): Promise<Programme[]> {
  try {
    const snap = await getDocs(collection(db, 'programmes'));
    let list: Programme[] = [];
    
    if (!snap.empty) {
      list = snap.docs.map(doc => {
        const data = doc.data();
        const rawProg = { 
          id: doc.id, 
          ...data,
          createdAtLabel: formatFirestoreDate(data.createdAt),
          updatedAtLabel: formatFirestoreDate(data.updatedAt)
        } as Programme;
        return enrichProgramme(rawProg);
      });
    }

    const hasElectionMatters = list.some(p => (p.slug || '').toLowerCase().trim() === 'election-matters');
    if (!hasElectionMatters) {
      const seedProg: Programme = {
        id: 'election-matters',
        title: 'Election Matters',
        slug: 'election-matters',
        shortDescription: 'Data-led election intelligence on democratic processes, political risk, and institutional accountability.',
        fullDescription: 'Election Matters explains electoral systems, democratic accountability, campaign signals, voter behaviour, and the institutions that shape political outcomes.',
        tagline: 'Data-led election intelligence on democratic processes, political risk, and institutional accountability.',
        hostName: 'ClearPath Elections Desk',
        formatType: 'analysis',
        coverageArea: 'Nigeria & Africa',
        topicFocus: ['elections', 'governance', 'risk'],
        scheduleText: 'Weekly',
        youtubePlaylistUrl: '',
        coverImage: '',
        thumbnailImage: '',
        status: 'active',
        isFeatured: true,
        sortOrder: 10,
        seoTitle: 'Election Matters — Data-led election intelligence',
        seoDescription: 'Data-led election intelligence on democratic processes, political risk, and institutional accountability.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authorName: 'ClearPath Elections Desk',
        authorTitle: 'Election Intelligence Desk',
        authorRoleLabel: 'Election Intelligence',
        authorBio: 'Election Matters explains electoral systems, democratic accountability, campaign signals, voter behaviour, and the institutions that shape political outcomes.',
        comingSoon: false
      };
      
      list.push(seedProg);
      
      // Save in Firestore background silently
      setDoc(doc(db, 'programmes', 'election-matters'), seedProg).catch(err => {
        console.error('[publicContentService] SetDoc seed error:', err);
      });
    }

    const active = list.filter(p => p.status === 'active' || p.isActive === true);
    
    // Deduplicate by slug or slugified title to ensure each program is unique
    const uniqueActive: Programme[] = [];
    const seenSlugs = new Set<string>();
    
    active.forEach(p => {
      const key = (p.slug || slugify(p.title) || p.id || '').toLowerCase().trim();
      if (!seenSlugs.has(key)) {
        seenSlugs.add(key);
        uniqueActive.push(p);
      }
    });
    
    // Client-side sort order to avoid compound indexes
    uniqueActive.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    return uniqueActive.map(p => adjustObjectFormatting(p));
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
    return active.map(e => adjustObjectFormatting(e));
  } catch (error) {
    console.error('[publicContentService] Error in getActiveExplainers:', error);
    return [];
  }
}

export async function getPublishedProgrammeVideos(): Promise<ProgrammeVideo[]> {
  try {
    const snap = await getDocs(collection(db, 'programmeVideos'));
    const list = !snap.empty
      ? snap.docs.map(doc => {
          const data = doc.data();
          return { 
            id: doc.id, 
            ...data,
            publishedAtLabel: data.displayDate || formatFirestoreDate(data.publishedAt || data.createdAt),
            createdAtLabel: formatFirestoreDate(data.createdAt),
            updatedAtLabel: formatFirestoreDate(data.updatedAt)
          } as ProgrammeVideo;
        })
      : [];
    
    // Merge with COMPLETE_CATALOG_VIDEOS for completeness and offline fallback
    const mergedMap = new Map<string, ProgrammeVideo>();
    
    // 1. Seed from local complete catalog data
    for (const v of COMPLETE_CATALOG_VIDEOS) {
      mergedMap.set(v.id, v);
    }
    
    // 2. Overwrite/extend with Firestore videos
    for (const v of list) {
      mergedMap.set(v.id, v);
    }
    
    const mergedList = Array.from(mergedMap.values());
    const published = mergedList.filter(v => v.status === 'published');
    
    // Sort in reverse chronological order safely client-side, prioritizing designated displayDate if valid
    published.sort((a, b) => {
      const dateA = safeDate(a.displayDate) || safeDate(a.publishedAt) || safeDate(a.createdAt) || new Date(0);
      const dateB = safeDate(b.displayDate) || safeDate(b.publishedAt) || safeDate(b.createdAt) || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
    
    return published.map(v => adjustObjectFormatting(v));
  } catch (error) {
    console.error('[publicContentService] Error in getPublishedProgrammeVideos (falling back to local catalog):', error);
    // On failure/offline, return local catalog fallback cleanly
    return COMPLETE_CATALOG_VIDEOS.filter(v => v.status === 'published').map(v => adjustObjectFormatting(v));
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
