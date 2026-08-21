import { slugify } from './slugUtils';

export function getDownloadablePdfUrl(url: string | undefined | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  const isSharePoint = trimmed.includes('sharepoint.com') || trimmed.includes('onedrive.live.com');
  if (isSharePoint) {
    try {
      const parsedUrl = new URL(trimmed);
      if (parsedUrl.searchParams.get('download') !== '1') {
        parsedUrl.searchParams.set('download', '1');
      }
      return parsedUrl.toString();
    } catch (e) {
      if (trimmed.includes('download=')) return trimmed;
      if (trimmed.includes('?')) {
        return `${trimmed}&download=1`;
      } else {
        return `${trimmed}?download=1`;
      }
    }
  }

  return trimmed;
}

export function getArticleUrl(article: any, fallbackCategorySlug = 'todays-brief'): string {
  if (!article) return '/clearpath-daily/todays-brief';
  
  const rawSlug = article.slug || article.id || article.title || article.title1 || article.lensHeadline || article.quote || 'article';
  const cleanSlug = slugify(rawSlug) || 'article';
  
  const categorySlug = (article.categorySlug || fallbackCategorySlug || 'todays-brief').toLowerCase().trim();
  
  if (categorySlug === 'weekly-features' || categorySlug === 'weekly-feature') {
    return `/clearpath-daily/weekly-features/${cleanSlug}`;
  }
  
  const weeklySlugs = [
    'west-african-monitor',
    'west-african-governance-monitor',
    'state-in-focus',
    'lga-brief',
    'governance-brief',
    'bccn-news'
  ];
  
  if (weeklySlugs.includes(categorySlug)) {
    return `/clearpath-daily/weekly-features/${cleanSlug}`;
  }
  
  return `/clearpath-daily/${categorySlug}/${cleanSlug}`;
}

