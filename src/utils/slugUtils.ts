/**
 * Universal slug generation and article matching utilities.
 * Handles messy user-entered slugs, spaces, uppercase letters, URL encodings,
 * punctuation, and fallback matching across Firestore document IDs and titles.
 */

export function slugify(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .toString()
    .trim()
    .replace(/^https?:\/\/[^/]+/i, '') // Remove domain if full URL was pasted
    .replace(/^\/+|\/+$/g, '') // Strip leading & trailing slashes
    .toLowerCase()
    .normalize('NFD') // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-_]/g, '') // Remove non-alphanumeric chars except space/dash/underscore
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with single hyphen
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
}

/**
 * Checks if two slug or ID strings match under any normalized representation.
 */
export function isSlugMatch(target: string | null | undefined, candidate: string | null | undefined): boolean {
  if (!target || !candidate) return false;
  
  const rawTarget = target.toString().trim();
  const rawCandidate = candidate.toString().trim();
  
  // 1. Exact raw match
  if (rawTarget === rawCandidate) return true;
  
  // 2. Case-insensitive raw match
  if (rawTarget.toLowerCase() === rawCandidate.toLowerCase()) return true;
  
  // 3. Slugified match
  const slugTarget = slugify(rawTarget);
  const slugCandidate = slugify(rawCandidate);
  if (slugTarget && slugCandidate && slugTarget === slugCandidate) return true;
  
  // 4. Decoded URI match
  try {
    const decodedTarget = decodeURIComponent(rawTarget).trim().toLowerCase();
    const decodedCandidate = decodeURIComponent(rawCandidate).trim().toLowerCase();
    if (decodedTarget === decodedCandidate) return true;
    if (slugify(decodedTarget) === slugify(decodedCandidate)) return true;
  } catch {
    // Ignore URI decode errors
  }
  
  return false;
}

/**
 * Determines if a given article object matches a search slug or ID across all its fields:
 * (id, slug, title, headline, subtitle, title1, quote)
 */
export function matchesArticle(article: any, searchSlugOrId: string | null | undefined): boolean {
  if (!article || !searchSlugOrId) return false;
  
  const query = searchSlugOrId.toString().trim();
  if (!query) return false;
  
  // Check ID
  if (article.id && isSlugMatch(article.id, query)) return true;
  
  // Check slug
  if (article.slug && isSlugMatch(article.slug, query)) return true;
  
  // Check title
  if (article.title && isSlugMatch(article.title, query)) return true;
  
  // Check focus title 1
  if (article.title1 && isSlugMatch(article.title1, query)) return true;
  
  // Check lens headline
  if (article.lensHeadline && isSlugMatch(article.lensHeadline, query)) return true;
  
  // Check quote (for public record)
  if (article.quote && isSlugMatch(article.quote, query)) return true;
  
  // Check signalEvent (for signals to watch)
  if (article.signalEvent && isSlugMatch(article.signalEvent, query)) return true;
  if (article.signalEvent1 && isSlugMatch(article.signalEvent1, query)) return true;

  // Substring match for slug inside ID (e.g., ID is "why-economic-reforms-fail-821" and search is "why-economic-reforms-fail")
  const cleanQ = slugify(query);
  if (cleanQ && cleanQ.length > 3) {
    if (article.id && slugify(article.id).startsWith(cleanQ)) return true;
    if (article.slug && slugify(article.slug).startsWith(cleanQ)) return true;
    if (article.title && slugify(article.title).startsWith(cleanQ)) return true;
  }
  
  return false;
}
