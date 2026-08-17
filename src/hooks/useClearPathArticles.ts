import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { ClearPathDailyArticle } from '../types';

export function useClearPathArticles(categorySlug?: string, limitCount?: number) {
  const [articles, setArticles] = useState<ClearPathDailyArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        let q = query(
          collection(db, 'clearpath_daily_articles'),
          where('status', '==', 'published')
        );

        if (categorySlug) {
          q = query(q, where('categorySlug', '==', categorySlug));
        }

        const snapshot = await getDocs(q);
        const fetchedArticles = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ClearPathDailyArticle[];

        // Sort in memory because string dates can be tricky if not stored as ISO, or we can use createdAt
        // We'll rely on string dates for now but parse them, or fallback to createdAt.
        fetchedArticles.sort((a, b) => {
          const dateA = new Date(a.publishedAt || a.signalDateOrDay || a.createdAt || 0).getTime();
          const dateB = new Date(b.publishedAt || b.signalDateOrDay || b.createdAt || 0).getTime();
          return dateB - dateA;
        });

        if (limitCount && limitCount > 0) {
          setArticles(fetchedArticles.slice(0, limitCount));
        } else {
          setArticles(fetchedArticles);
        }
      } catch (err) {
        console.error("Error fetching ClearPath articles:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [categorySlug, limitCount]);

  return { articles, loading };
}
