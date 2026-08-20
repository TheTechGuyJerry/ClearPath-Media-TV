import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ClearPathDailyArticle } from '../types';
import { slugify } from '../utils/slugUtils';

const WEEKLY_CATEGORY_SLUGS = [
  'weekly-features',
  'weekly-feature',
  'west-african-monitor',
  'west-african-governance-monitor',
  'state-in-focus',
  'lga-brief',
  'governance-brief',
  'bccn-news',
  'special-investigation'
];

export function useClearPathArticles(categorySlug?: string, limitCount?: number) {
  const [articles, setArticles] = useState<ClearPathDailyArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'clearpath_daily_articles'));
        let rawArticles = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ClearPathDailyArticle[];

        // Exclude archived only
        let validArticles = rawArticles.filter(a => a.status !== 'archived');

        const normalizedReqCategory = categorySlug ? slugify(categorySlug) : undefined;
        const isWeeklyReq = normalizedReqCategory && WEEKLY_CATEGORY_SLUGS.includes(normalizedReqCategory);

        let filtered = validArticles.filter(a => {
          if (!normalizedReqCategory) return true;
          const aCat = slugify(a.categorySlug || a.category || '');
          if (isWeeklyReq) {
            return WEEKLY_CATEGORY_SLUGS.includes(aCat) || !!a.weeklyFeatureType;
          }
          return aCat === normalizedReqCategory || aCat.includes(normalizedReqCategory);
        });

        // Sort in memory by published date or creation
        filtered.sort((a, b) => {
          const dateA = new Date(a.publishedAt || a.signalDateOrDay || a.createdAt || 0).getTime();
          const dateB = new Date(b.publishedAt || b.signalDateOrDay || b.createdAt || 0).getTime();
          return dateB - dateA;
        });

        if (limitCount && limitCount > 0) {
          setArticles(filtered.slice(0, limitCount));
        } else {
          setArticles(filtered);
        }
      } catch (err) {
        console.error("Error fetching ClearPath articles:", err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [categorySlug, limitCount]);

  return { articles, loading };
}

