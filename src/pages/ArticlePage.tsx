
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Share2, Printer, BookmarkPlus, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SEO from '../components/SEO';
import { AthenaEvidenceCard } from '../components/clearpath/AthenaEvidenceCard';
import { ClearPathDailySidebar } from '../components/clearpath/ClearPathDailySidebar';
import { ATHENA_PUBLICATIONS } from '../data/clearpath_daily_data';
import { SubscriptionSection } from '../components/clearpath/SubscriptionSection';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { ClearPathDailyArticle } from '../types';

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ClearPathDailyArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      if (!slug) return;
      setLoading(true);
      try {
        const q = query(collection(db, 'clearpath_daily_articles'), where('slug', '==', slug), limit(1));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setArticle({ id: doc.id, ...doc.data() } as ClearPathDailyArticle);
        } else {
          setArticle(null);
        }
      } catch (e) {
        console.error("Error fetching article:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-primary font-mono text-sm uppercase tracking-wider">Loading Article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <h1 className="text-3xl font-black font-serif text-on-surface mb-4">Article Not Found</h1>
        <p className="text-on-surface-variant mb-8 text-center max-w-md">
          The article you are looking for does not exist or has been removed.
        </p>
        <Link to="/daily/todays-brief" className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Return to Today's Brief
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background font-sans">
      <SEO
        title={`${article.title} — ClearPath Daily`}
        description={article.excerpt || article.title}
        image={article.coverImage}
      />

      <div className="bg-surface-bright border-b border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 flex items-center justify-between">
          <Link to="/daily/todays-brief" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to News
          </Link>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full bg-surface hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors" aria-label="Share">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-full bg-surface hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors" aria-label="Bookmark">
              <BookmarkPlus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <article className="lg:col-span-8">
            <header className="mb-10 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                  {article.category || article.categorySlug?.replace('-', ' ')}
                </span>
                <span className="text-xs font-mono text-on-surface-variant flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {article.readingTime || '5 Min Read'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif text-on-surface leading-tight text-balance">
                {article.title}
              </h1>
              {article.subtitle && (
                <p className="text-lg sm:text-xl text-on-surface-variant font-medium leading-relaxed">
                  {article.subtitle}
                </p>
              )}
              
              <div className="flex items-center justify-between pt-6 border-t border-outline-variant/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface">
                    {article.authorName?.[0] || 'C'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface leading-none">{article.authorName || 'ClearPath Editorial'}</p>
                    <p className="text-xs text-on-surface-variant mt-1">{article.publishedAt}</p>
                  </div>
                </div>
              </div>
            </header>

            {article.coverImage && (
              <figure className="mb-12 rounded-2xl overflow-hidden border border-outline-variant shadow-sm bg-surface-container-low">
                <div className="aspect-[16/9] w-full">
                  <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                </div>
                {(article.imageCaption || article.imageCredit) && (
                  <figcaption className="px-4 py-3 text-xs text-on-surface-variant border-t border-outline-variant flex justify-between bg-surface-bright">
                    <span>{article.imageCaption}</span>
                    <span className="font-mono text-[10px] uppercase">{article.imageCredit}</span>
                  </figcaption>
                )}
              </figure>
            )}

            <div className="prose prose-slate lg:prose-lg prose-headings:font-serif prose-headings:font-bold prose-p:leading-relaxed prose-a:text-primary max-w-none text-on-surface font-medium">
              <ReactMarkdown>
                {article.content || 'Content not found.'}
              </ReactMarkdown>
            </div>
            
            <div className="mt-12 pt-8 border-t border-outline-variant/60 flex flex-wrap gap-2">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mr-2 self-center">Tags:</span>
              <span className="text-xs font-mono bg-surface-container px-3 py-1.5 rounded text-on-surface-variant">Policy</span>
              <span className="text-xs font-mono bg-surface-container px-3 py-1.5 rounded text-on-surface-variant">Governance</span>
            </div>
          </article>

          <aside className="lg:col-span-4 space-y-8">
            <ClearPathDailySidebar 
              currentDate={article.publishedAt || ''}
              currentSectionSlug={article.categorySlug || 'todays-brief'}
              articleTitleOrSubject={article.title}
            />
          </aside>
        </div>
      </main>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-10">
        <AthenaEvidenceCard publication={ATHENA_PUBLICATIONS[0]} />
      </div>

      <SubscriptionSection />
    </div>
  );
}
