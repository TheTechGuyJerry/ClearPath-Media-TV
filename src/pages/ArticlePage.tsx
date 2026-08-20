import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Share2, Printer, BookmarkPlus, ArrowRight, Copy, Check, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import SEO from '../components/SEO';
import { AthenaEvidenceCard } from '../components/clearpath/AthenaEvidenceCard';
import { ClearPathDailySidebar } from '../components/clearpath/ClearPathDailySidebar';
import { SubscriptionSection } from '../components/clearpath/SubscriptionSection';
import { RichContentRenderer } from '../components/common/RichContentRenderer';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';
import { ClearPathDailyArticle } from '../types';
import { matchesArticle, slugify } from '../utils/slugUtils';

export default function ArticlePage() {
  const { slug, menuSlug } = useParams<{ slug: string; menuSlug?: string }>();
  const [article, setArticle] = useState<ClearPathDailyArticle | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  useEffect(() => {
    async function fetchArticle() {
      if (!slug) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const cleanSlug = slugify(decodeURIComponent(slug));

      try {
        // 1. Direct document ID lookup in 'clearpath_daily_articles'
        try {
          const directSnap = await getDoc(doc(db, 'clearpath_daily_articles', slug));
          if (directSnap.exists()) {
            setArticle({ id: directSnap.id, ...directSnap.data() } as ClearPathDailyArticle);
            setLoading(false);
            return;
          }
        } catch {}

        if (cleanSlug && cleanSlug !== slug) {
          try {
            const cleanDirectSnap = await getDoc(doc(db, 'clearpath_daily_articles', cleanSlug));
            if (cleanDirectSnap.exists()) {
              setArticle({ id: cleanDirectSnap.id, ...cleanDirectSnap.data() } as ClearPathDailyArticle);
              setLoading(false);
              return;
            }
          } catch {}
        }

        // 2. Query Firestore by slug field
        try {
          const qSlug = query(collection(db, 'clearpath_daily_articles'), where('slug', '==', slug), limit(1));
          const snapSlug = await getDocs(qSlug);
          if (!snapSlug.empty) {
            const docSnap = snapSlug.docs[0];
            setArticle({ id: docSnap.id, ...docSnap.data() } as ClearPathDailyArticle);
            setLoading(false);
            return;
          }
        } catch {}

        if (cleanSlug && cleanSlug !== slug) {
          try {
            const qClean = query(collection(db, 'clearpath_daily_articles'), where('slug', '==', cleanSlug), limit(1));
            const snapClean = await getDocs(qClean);
            if (!snapClean.empty) {
              const docSnap = snapClean.docs[0];
              setArticle({ id: docSnap.id, ...docSnap.data() } as ClearPathDailyArticle);
              setLoading(false);
              return;
            }
          } catch {}
        }

        // 3. Scan all clearpath_daily_articles documents for fuzzy/title/id match
        try {
          const allDocsSnap = await getDocs(collection(db, 'clearpath_daily_articles'));
          const foundDoc = allDocsSnap.docs.find(d => {
            const data = { id: d.id, ...d.data() };
            return matchesArticle(data, slug) || (cleanSlug ? matchesArticle(data, cleanSlug) : false);
          });
          if (foundDoc) {
            setArticle({ id: foundDoc.id, ...foundDoc.data() } as ClearPathDailyArticle);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn("Scan clearpath_daily_articles failed:", e);
        }

        // 4. Also scan 'briefings' collection
        try {
          const briefingsSnap = await getDocs(collection(db, 'briefings'));
          const foundBriefing = briefingsSnap.docs.find(d => {
            const data = { id: d.id, ...d.data() };
            return matchesArticle(data, slug) || (cleanSlug ? matchesArticle(data, cleanSlug) : false);
          });
          if (foundBriefing) {
            setArticle({ id: foundBriefing.id, ...foundBriefing.data() } as ClearPathDailyArticle);
            setLoading(false);
            return;
          }
        } catch {}

        setArticle(null);
      } catch (e) {
        console.error("Error fetching article:", e);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug]);


  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <p className="text-primary font-mono text-sm uppercase tracking-wider animate-pulse">Loading Article...</p>
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
        <Link to="/clearpath-daily/todays-brief" className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Return to Today's Brief
        </Link>
      </div>
    );
  }

  const allWords = [
    article.content,
    article.content1,
    article.content2,
    article.excerpt,
    article.whyItMatters,
    article.institutionalAnalysis
  ].filter(Boolean).join(' ');

  const calculatedReadingTime = article.readingTime || (Math.max(1, Math.ceil(allWords.split(/\s+/).length / 200)) + ' Min Read');

  return (
    <div className="w-full min-h-screen bg-background font-sans overflow-x-hidden">
      <SEO
        title={`${article.title} — ClearPath Daily`}
        description={article.excerpt || article.subtitle || article.title}
        image={article.coverImage}
      />

      {/* Top Action Bar */}
      <div className="bg-surface-bright border-b border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 flex items-center justify-between">
          <Link to="/" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to News
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setIsShareOpen(!isShareOpen)}
                className="w-9 h-9 rounded-full bg-surface hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors" 
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              {isShareOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-bright rounded-xl shadow-lg border border-outline-variant py-2 z-50">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container text-sm text-on-surface transition-colors">
                    <Facebook className="w-4 h-4 text-blue-600" /> Facebook
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article?.title || '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container text-sm text-on-surface transition-colors">
                    <Twitter className="w-4 h-4 text-sky-500" /> Twitter
                  </a>
                  <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(article?.title || '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container text-sm text-on-surface transition-colors">
                    <Linkedin className="w-4 h-4 text-blue-700" /> LinkedIn
                  </a>
                  <a href={`mailto:?subject=${encodeURIComponent(article?.title || '')}&body=${encodeURIComponent(currentUrl)}`} className="flex items-center gap-3 px-4 py-2 hover:bg-surface-container text-sm text-on-surface transition-colors">
                    <Mail className="w-4 h-4 text-slate-500" /> Email
                  </a>
                  <button onClick={handleCopyLink} className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface-container text-sm text-on-surface transition-colors border-t border-outline-variant mt-1 pt-3">
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />} 
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              )}
            </div>
            <button 
              onClick={() => window.print()} 
              className="w-9 h-9 rounded-full bg-surface hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors" 
              aria-label="Print"
              title="Print Article"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Article Container */}
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Main Article Content Column */}
          <article className="lg:col-span-8 w-full max-w-full min-w-0">
            {/* Editorial Header */}
            <header className="mb-8 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                  {article.category || article.categorySlug?.replace('-', ' ') || 'ClearPath Daily'}
                </span>
                <span className="text-xs font-mono text-on-surface-variant flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" /> {calculatedReadingTime}
                </span>
                {article.publishedAt && (
                  <span className="text-xs font-mono text-on-surface-variant">
                    • {article.publishedAt}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-serif text-on-surface leading-tight break-words">
                {article.title}
              </h1>

              {article.subtitle && (
                <p className="text-lg sm:text-xl text-on-surface-variant font-medium leading-relaxed">
                  {article.subtitle}
                </p>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/60">
                <div className="flex items-center gap-3">
                  {article.authorName ? (
                    <>
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                        {article.authorName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface leading-none">{article.authorName}</p>
                        {article.authorTitle && (
                          <p className="text-xs text-on-surface-variant mt-1">{article.authorTitle}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div>
                      <p className="text-xs text-on-surface-variant font-mono">{article.publishedAt}</p>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/* Cover Image */}
            {article.coverImage && (
              <figure className="mb-10 rounded-2xl overflow-hidden border border-outline-variant shadow-xs bg-surface-container-low">
                <div className="aspect-[16/9] w-full max-w-full">
                  <img 
                    src={article.coverImage} 
                    alt={article.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                {(article.imageCaption || article.imageCredit) && (
                  <figcaption className="px-4 py-3 text-xs text-on-surface-variant border-t border-outline-variant flex flex-wrap justify-between gap-2 bg-surface-bright">
                    <span>{article.imageCaption}</span>
                    {article.imageCredit && (
                      <span className="font-mono text-[10px] uppercase text-on-surface-variant/80">{article.imageCredit}</span>
                    )}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Executive Summary / Excerpt Callout */}
            {article.excerpt && article.categorySlug !== 'in-focus' && (
              <div className="mb-8 p-5 sm:p-6 bg-surface-container-low rounded-2xl border-l-4 border-primary border border-outline-variant/60 shadow-xs">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary block mb-2">
                  Executive Summary
                </span>
                <p className="text-base sm:text-lg text-on-surface font-serif font-medium leading-relaxed italic">
                  "{article.excerpt}"
                </p>
              </div>
            )}

            {/* Specialized Indicator Callout */}
            {(article.categorySlug === 'the-indicator' || article.indicatorNumber) && article.indicatorNumber && (
              <div className="mb-8 p-6 sm:p-8 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-2xl shadow-xs">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-300 block mb-2">
                  The Indicator
                </span>
                <div className="text-4xl sm:text-5xl md:text-6xl font-black font-mono text-emerald-950 dark:text-emerald-100 tracking-tight break-words">
                  {article.indicatorNumber}
                </div>
                {article.indicatorContext && (
                  <p className="mt-3 text-sm sm:text-base text-on-surface-variant font-medium leading-relaxed">
                    {article.indicatorContext}
                  </p>
                )}
              </div>
            )}

            {/* Specialized Public Record Quote Callout */}
            {(article.categorySlug === 'the-public-record' || article.quote) && article.quote && (
              <blockquote className="mb-8 p-6 sm:p-8 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-2xl border-y border-r border-amber-500/20 shadow-xs">
                <p className="text-xl sm:text-2xl font-serif font-bold text-on-surface italic leading-snug mb-4">
                  "{article.quote}"
                </p>
                {(article.speakerName || article.speakerPosition || article.speakerInstitution) && (
                  <footer className="flex flex-col text-sm text-on-surface-variant font-sans not-italic pt-2 border-t border-amber-500/20">
                    {article.speakerName && (
                      <cite className="font-bold text-on-surface not-italic text-base">
                        {article.speakerName}
                      </cite>
                    )}
                    {(article.speakerPosition || article.speakerInstitution) && (
                      <span className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                        {[article.speakerPosition, article.speakerInstitution].filter(Boolean).join(' • ')}
                      </span>
                    )}
                    {article.speakerSetting && (
                      <span className="text-xs font-mono text-amber-800 dark:text-amber-400 mt-1">
                        Setting: {article.speakerSetting}
                      </span>
                    )}
                  </footer>
                )}
              </blockquote>
            )}

            {/* Body Content Rendering */}
            {article.categorySlug === 'in-focus' && (article.title1 || article.content1) ? (
              <div className="space-y-12">
                {/* Focus Story 1 */}
                <section className="space-y-4">
                  {article.title1 && (
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-mono font-bold text-sm flex items-center justify-center">
                        01
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-bold font-serif text-on-surface">
                        {article.title1}
                      </h2>
                    </div>
                  )}
                  {article.excerpt1 && (
                    <p className="text-base sm:text-lg text-on-surface-variant font-medium leading-relaxed italic pl-0 sm:pl-11">
                      {article.excerpt1}
                    </p>
                  )}
                  <div className="pt-2">
                    <RichContentRenderer content={article.content1 || article.content} />
                  </div>
                </section>

                {/* Focus Story 2 */}
                {(article.title2 || article.content2) && (
                  <section className="space-y-4 pt-8 border-t border-outline-variant/60">
                    {article.title2 && (
                      <div className="flex items-start gap-3">
                        <span className="shrink-0 w-8 h-8 rounded-full bg-secondary/10 text-secondary font-mono font-bold text-sm flex items-center justify-center">
                          02
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-on-surface">
                          {article.title2}
                        </h2>
                      </div>
                    )}
                    {article.excerpt2 && (
                      <p className="text-base sm:text-lg text-on-surface-variant font-medium leading-relaxed italic pl-0 sm:pl-11">
                        {article.excerpt2}
                      </p>
                    )}
                    <div className="pt-2">
                      <RichContentRenderer content={article.content2} />
                    </div>
                  </section>
                )}
              </div>
            ) : article.categorySlug === 'clearpath-lens' && (article.introductorySummary || article.institutionalAnalysis) ? (
              <div className="space-y-10">
                {article.introductorySummary && (
                  <section className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-5 bg-zinc-800 dark:bg-zinc-200 rounded-full" />
                      <h3 className="text-lg font-bold font-serif uppercase tracking-wider text-on-surface">
                        The Summary
                      </h3>
                    </div>
                    <RichContentRenderer content={article.introductorySummary} />
                  </section>
                )}
                {article.institutionalAnalysis && (
                  <section className="space-y-3 pt-6 border-t border-outline-variant/60">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-5 bg-primary rounded-full" />
                      <h3 className="text-lg font-bold font-serif uppercase tracking-wider text-on-surface">
                        Institutional Analysis
                      </h3>
                    </div>
                    <RichContentRenderer content={article.institutionalAnalysis} />
                  </section>
                )}
                {article.content && (
                  <section className="pt-6 border-t border-outline-variant/60">
                    <RichContentRenderer content={article.content} />
                  </section>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <RichContentRenderer content={article.content} />
              </div>
            )}

            {/* Why It Matters Callout */}
            {article.whyItMatters && (
              <div className="mt-10 p-6 bg-primary/5 border border-primary/20 rounded-2xl shadow-xs">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary block mb-2">
                  Why It Matters
                </span>
                <RichContentRenderer content={article.whyItMatters} />
              </div>
            )}

            {/* What To Watch Next Callout */}
            {article.whatToWatchNext && (
              <div className="mt-6 p-6 bg-surface-container-low border border-outline-variant rounded-2xl shadow-xs">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-secondary block mb-2">
                  What To Watch Next
                </span>
                <RichContentRenderer content={article.whatToWatchNext} />
              </div>
            )}

            {/* Tags */}
            {article.topicTags && article.topicTags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-outline-variant/60 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mr-2">
                  Topic Tags:
                </span>
                {article.topicTags.map((tag, i) => (
                  <span key={i} className="text-xs font-mono bg-surface-container px-3 py-1.5 rounded-full text-on-surface-variant">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8 w-full max-w-full min-w-0">
            <ClearPathDailySidebar 
              currentDate={article.publishedAt || ''}
              currentSectionSlug={article.categorySlug || 'todays-brief'}
              articleTitleOrSubject={article.title}
            />
          </aside>
        </div>
      </main>

      {/* Athena Evidence Bottom Card */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-10">
        <AthenaEvidenceCard article={article} />
      </div>

      <SubscriptionSection />
    </div>
  );
}
