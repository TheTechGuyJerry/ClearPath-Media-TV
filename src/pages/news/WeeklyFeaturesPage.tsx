import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BookmarkCheck, 
  Clock, 
  User, 
  ArrowRight, 
  BookOpen, 
  Lightbulb, 
  Eye,
  Share2
} from 'lucide-react';
import SEO from '../../components/SEO';
import { AthenaEvidenceCard } from '../../components/clearpath/AthenaEvidenceCard';
import { ClearPathDailySidebar } from '../../components/clearpath/ClearPathDailySidebar';
import { SubscriptionSection } from '../../components/clearpath/SubscriptionSection';
import { RichContentRenderer } from '../../components/common/RichContentRenderer';
import { useClearPathArticles } from '../../hooks/useClearPathArticles';
import { getArticleUrl } from '../../utils/urlUtils';
import { calculateReadTime } from '../../utils/formatters';
import { matchesArticle, slugify } from '../../utils/slugUtils';

export default function WeeklyFeaturesPage() {
  const { slug } = useParams<{ slug?: string }>();
  const { articles, loading } = useClearPathArticles('weekly-features');

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <p className="text-primary font-mono text-sm uppercase tracking-wider animate-pulse">
          Loading Weekly Features...
        </p>
      </div>
    );
  }

  // Use fetched articles from CMS
  const allWeeklyArticles = articles;

  // Find specific article by slug or default to the most recent one
  const cleanSlug = slug ? slugify(decodeURIComponent(slug)) : undefined;
  
  let currentFeature = slug 
    ? (allWeeklyArticles.find(a => matchesArticle(a, slug) || (cleanSlug ? matchesArticle(a, cleanSlug) : false)))
    : allWeeklyArticles[0];

  const previousFeatures = allWeeklyArticles.filter(a => a.id !== currentFeature?.id && a.slug !== currentFeature?.slug);


  const executiveSummary = currentFeature?.executiveSummary || currentFeature?.excerpt;
  const mainContent = currentFeature?.content || currentFeature?.institutionalAnalysis;

  return (
    <div className="w-full min-h-screen bg-background font-sans">
      <SEO
        title={currentFeature ? `${currentFeature.title} — Weekly Features` : 'Weekly Features — ClearPath Daily'}
        description={currentFeature?.excerpt || 'In-depth weekly investigations, analytical long-reads, and systemic policy features.'}
      />

      {/* Header Banner */}
      <div className="bg-[#0c1322] text-slate-100 border-b border-slate-800 py-10 md:py-14 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif text-white mb-2 tracking-tight">
            Weekly Features
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed font-medium">
            In-depth investigations, long-form policy analysis, and systemic institutional features published daily.
          </p>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 space-y-12">
        {!currentFeature ? (
          <div className="py-20 text-center bg-surface-bright rounded-2xl border border-outline-variant shadow-sm">
            <BookmarkCheck className="w-12 h-12 text-outline mx-auto mb-4" />
            <h3 className="text-xl font-bold text-on-surface mb-2">No Features Published Yet</h3>
            <p className="text-on-surface-variant max-w-md mx-auto">
              Features will appear here once they are created and published in the CMS.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Article Card */}
            <article className="bg-surface-bright border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
              {/* Article Top Header */}
              <div className="p-6 sm:p-8 md:p-10 border-b border-outline-variant/60 bg-surface-container-low/40">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
                    {(currentFeature.weeklyFeatureType || 'FEATURE').toUpperCase()} • {currentFeature.publishedAt}
                  </span>
                  <span className="text-xs font-mono text-on-surface-variant flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    {calculateReadTime([
                      currentFeature.title,
                      currentFeature.executiveSummary,
                      currentFeature.excerpt,
                      currentFeature.content,
                      currentFeature.institutionalAnalysis,
                      currentFeature.whyItMatters,
                      currentFeature.whatToWatchNext
                    ].filter(Boolean).join(' '))}
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif text-on-surface leading-tight max-w-4xl text-balance">
                  {currentFeature.title}
                </h2>

                {/* Cover Image positioned right after the title */}
                {currentFeature.coverImage && (
                  <div className="mt-6 rounded-xl overflow-hidden border border-outline-variant/80 bg-surface-container shadow-xs">
                    <div className="h-56 sm:h-64 md:h-72 w-full overflow-hidden">
                      <img 
                        src={currentFeature.coverImage} 
                        alt={currentFeature.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {(currentFeature.imageCaption || currentFeature.imageCredit) && (
                      <div className="px-4 py-2 bg-surface-container-low text-xs text-on-surface-variant flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant/40">
                        <span>{currentFeature.imageCaption}</span>
                        {currentFeature.imageCredit && (
                          <span className="font-mono text-[11px] opacity-80">{currentFeature.imageCredit}</span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Author & Byline Bar */}
                <div className="mt-6 pt-5 border-t border-outline-variant/60 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {currentFeature.authorAvatar ? (
                      <img 
                        src={currentFeature.authorAvatar} 
                        alt={currentFeature.authorName || 'Author'} 
                        className="w-11 h-11 rounded-full object-cover border border-outline-variant"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-indigo-900/10 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-base border border-indigo-200/40 dark:border-indigo-800/40">
                        {currentFeature.authorName ? currentFeature.authorName.charAt(0) : <User className="w-5 h-5" />}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-sm sm:text-base text-on-surface">
                        {currentFeature.authorName || 'ClearPath Editorial Desk'}
                      </div>
                      {currentFeature.authorTitle && (
                        <div className="text-xs text-on-surface-variant">
                          {currentFeature.authorTitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: currentFeature.title,
                            url: window.location.href
                          }).catch(() => {});
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Article URL copied to clipboard!');
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg border border-outline-variant/60 transition-colors"
                      title="Share this article"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content & Side-by-Side Sidebar */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start p-6 sm:p-8 md:p-10">
                {/* Left Column: Executive Summary, Main Content & Key Takeaways */}
                <div className="lg:col-span-8 space-y-10 min-w-0 w-full">
                  {/* Executive Summary Callout */}
                  {executiveSummary && (
                    <section className="bg-surface-container-low p-6 sm:p-8 rounded-2xl border-2 border-indigo-200/60 dark:border-indigo-900/50 relative overflow-hidden">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
                        <h3 className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                          Executive Summary
                        </h3>
                      </div>
                      <RichContentRenderer 
                        content={executiveSummary} 
                        className="text-base sm:text-lg leading-relaxed font-serif font-medium text-on-surface"
                      />
                    </section>
                  )}

                  {/* Main Long-Form Article Body */}
                  {mainContent && (
                    <section className="pt-2">
                      <div className="flex items-center gap-2 mb-6 pb-2 border-b border-outline-variant/60">
                        <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                        <h3 className="text-lg font-bold font-serif text-on-surface uppercase tracking-wide">
                          Full Investigation & Analysis
                        </h3>
                      </div>
                      <RichContentRenderer 
                        content={mainContent} 
                      />
                    </section>
                  )}

                  {/* Why It Matters Callout */}
                  {currentFeature.whyItMatters && (
                    <section className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-6 rounded-2xl">
                      <div className="flex items-center gap-2 mb-2.5 text-amber-800 dark:text-amber-300">
                        <Lightbulb className="w-4 h-4" />
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Why It Matters</h4>
                      </div>
                      <p className="text-sm sm:text-base text-on-surface leading-relaxed">
                        {currentFeature.whyItMatters}
                      </p>
                    </section>
                  )}

                  {/* What To Watch Next Callout */}
                  {currentFeature.whatToWatchNext && (
                    <section className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl">
                      <div className="flex items-center gap-2 mb-2.5 text-slate-800 dark:text-slate-200">
                        <Eye className="w-4 h-4" />
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider">What To Watch Next</h4>
                      </div>
                      <p className="text-sm sm:text-base text-on-surface leading-relaxed">
                        {currentFeature.whatToWatchNext}
                      </p>
                    </section>
                  )}

                  {/* Athena Evidence Embed inside the article */}
                  <AthenaEvidenceCard article={currentFeature} />
                </div>

                {/* Right Column: ClearPath Daily Sidebar */}
                <div className="lg:col-span-4 min-w-0 w-full">
                  {/* ClearPath Daily Navigation Sidebar */}
                  <ClearPathDailySidebar
                    currentDate={currentFeature.publishedAt}
                    currentSectionSlug="weekly-features"
                    articleTitleOrSubject={currentFeature.title}
                  />
                </div>
              </div>
            </article>

            {/* Previous Weekly Features Archive */}
            {previousFeatures.length > 0 && (
              <section className="bg-surface-bright border border-outline-variant rounded-2xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-8 pb-3 border-b border-outline-variant">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold font-serif text-on-surface uppercase tracking-wide">
                      Weekly Features Archive
                    </h2>
                  </div>
                  <Link
                    to="/archive?category=weekly-features"
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-wider"
                  >
                    Full Archive <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {previousFeatures.map((feature) => (
                    <article
                      key={feature.id}
                      className="bg-surface-container-low border border-outline-variant hover:border-primary/40 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {feature.coverImage && (
                          <div className="h-44 w-full overflow-hidden bg-surface-container">
                            <img
                              src={feature.coverImage}
                              alt={feature.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-5">
                          {feature.weeklyFeatureType && (
                            <div className="mb-2">
                              <span className="inline-block bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full">
                                {feature.weeklyFeatureType}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant mb-2">
                            <span>{feature.publishedAt}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                              {calculateReadTime([
                                feature.title,
                                feature.executiveSummary,
                                feature.excerpt,
                                feature.content,
                                feature.institutionalAnalysis
                              ].filter(Boolean).join(' '))}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold font-serif text-on-surface group-hover:text-primary transition-colors leading-tight mb-2">
                            <Link to={getArticleUrl(feature, 'weekly-features')}>
                              {feature.title}
                            </Link>
                          </h3>
                          <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                            {feature.executiveSummary || feature.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 pt-0 mt-auto border-t border-outline-variant/40 pt-3 flex items-center justify-between">
                        <span className="text-xs font-medium text-on-surface-variant truncate max-w-[150px]">
                          {feature.authorName}
                        </span>
                        <Link
                          to={getArticleUrl(feature, 'weekly-features')}
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                        >
                          Read Feature <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <SubscriptionSection />
      </main>
    </div>
  );
}
