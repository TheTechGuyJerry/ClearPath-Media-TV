export function getArticleUrl(article: any, fallbackCategorySlug = 'todays-brief'): string {
  if (!article || !article.slug) return '#';
  
  const slug = article.slug;
  const categorySlug = article.categorySlug || fallbackCategorySlug;
  
  const weeklySlugs = ['west-african-monitor', 'state-in-focus', 'lga-brief', 'governance-brief', 'bccn-news'];
  
  if (weeklySlugs.includes(categorySlug)) {
    return `/weekly-feature/${slug}`;
  }
  
  return `/clearpath-daily/${categorySlug}/${slug}`;
}
