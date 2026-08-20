import { slugify } from './slugUtils';

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

