import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ExternalLink, ArrowRight, BookOpen, Layers, Clock } from 'lucide-react';
import SEO from '../components/SEO';
import { AthenaEvidenceCard } from '../components/clearpath/AthenaEvidenceCard';
import { ClearPathDailySidebar } from '../components/clearpath/ClearPathDailySidebar';
import { SubscriptionSection } from '../components/clearpath/SubscriptionSection';
import { RichContentRenderer } from '../components/common/RichContentRenderer';
import { useClearPathArticles } from '../hooks/useClearPathArticles';
import { getArticleUrl } from '../utils/urlUtils';

export default function ClearPathLensPage() {
  const { articles, loading } = useClearPathArticles('clearpath-lens');

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <p className="text-primary font-mono text-sm uppercase tracking-wider animate-pulse">Loading The ClearPath Lens...</p>
      </div>
    );
  }

  const currentLens = articles[0];
  const previousLenses = articles.slice(1);

  return (
    <div className="w-full min-h-screen bg-background font-sans">
      <SEO
        title="The ClearPath Lens — ClearPath Daily"
        description="A daily panoramic view connecting seemingly disparate events into a cohesive institutional analysis."
      />

      {/* Header Banner */}
      <div className="bg-[#18181b] text-zinc-100 border-b border-zinc-800 py-10 md:py-14 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto flex items-center gap-4">
          <div className="p-3 bg-zinc-800 rounded-xl hidden sm:block">
            <Search className="w-8 h-8 text-zinc-300" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif mb-3 tracking-tight">
              The ClearPath Lens
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 max-w-3xl leading-relaxed font-medium">
              A daily panoramic view connecting seemingly disparate events into a cohesive institutional analysis.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 space-y-12">
        {!currentLens ? (
           <div className="py-20 text-center bg-surface-bright rounded-2xl border border-outline-variant shadow-sm">
             <Search className="w-12 h-12 text-outline mx-auto mb-4" />
             <h3 className="text-xl font-bold text-on-surface mb-2">No Lens Published Yet</h3>
             <p className="text-on-surface-variant max-w-md mx-auto">Articles for The ClearPath Lens will appear here once they are published from the CMS.</p>
           </div>
        ) : (
          <>
            {/* Featured Lens Article */}
            <article className="bg-surface-bright border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
              {/* Editorial Header (Text & Typography Focus - No Image) */}
              <div className="bg-gradient-to-br from-[#18181b] via-[#232328] to-[#121215] text-white p-6 sm:p-10 md:p-12 border-b border-zinc-800">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider bg-zinc-800/90 px-3 py-1 rounded-full border border-zinc-700">
                    CLEARPATH LENS • {currentLens.publishedAt}
                  </span>
                  {currentLens.readingTime && (
                    <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" /> {currentLens.readingTime}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif text-white leading-tight max-w-4xl text-balance">
                  {currentLens.title}
                </h2>
                {currentLens.subtitle && (
                  <p className="mt-4 text-base sm:text-lg text-zinc-300 max-w-3xl leading-relaxed font-serif italic">
                    {currentLens.subtitle}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start p-6 md:p-10">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-10 min-w-0 w-full">
                  {/* Introductory Summary */}
                  {(currentLens.introductorySummary || currentLens.excerpt) && (
                    <section className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/60">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-5 bg-zinc-800 dark:bg-zinc-200 rounded-full"></div>
                        <h3 className="text-sm font-mono font-bold text-on-surface uppercase tracking-wider">The Summary</h3>
                      </div>
                      <RichContentRenderer 
                        content={currentLens.introductorySummary || currentLens.excerpt} 
                        className="text-base sm:text-lg leading-relaxed font-serif font-medium italic text-on-surface"
                      />
                    </section>
                  )}

                  {/* Institutional Analysis */}
                  {(currentLens.institutionalAnalysis || currentLens.content) && (
                    <section className="pt-2">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                        <h3 className="text-lg font-bold font-serif text-on-surface uppercase tracking-wide">Institutional Analysis</h3>
                      </div>
                      <RichContentRenderer 
                        content={currentLens.institutionalAnalysis || currentLens.content} 
                      />
                    </section>
                  )}
                </div>

                {/* Meta Sidebar (Right column for Lens) */}
                <div className="lg:col-span-4 space-y-6 min-w-0 w-full">
                  {/* Supporting Sources */}
                  {currentLens.supportingSourcesJson && (
                    <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant">
                      <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider mb-4 font-mono flex items-center gap-2 pb-2 border-b border-outline-variant">
                        <Layers className="w-3.5 h-3.5" /> Core Primary Sources
                      </h4>
                      <ul className="space-y-3">
                        {JSON.parse(currentLens.supportingSourcesJson).map((source: any, i: number) => (
                          <li key={i}>
                            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline flex items-start gap-2 group">
                              <ExternalLink className="w-4 h-4 shrink-0 mt-0.5 text-outline-variant group-hover:text-primary transition-colors" />
                              <span className="leading-snug">{source.title}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <ClearPathDailySidebar
                    currentDate={currentLens.publishedAt}
                    currentSectionSlug="clearpath-lens"
                    articleTitleOrSubject={currentLens.title}
                  />
                </div>
              </div>
            </article>

            {/* Previous Lenses */}
            {previousLenses.length > 0 && (
              <section className="bg-surface-bright border border-outline-variant rounded-2xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-8 pb-3 border-b border-outline-variant">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold font-serif text-on-surface uppercase tracking-wide">
                      The Lens Archive
                    </h2>
                  </div>
                  <Link
                    to="/archive?category=clearpath-lens"
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-wider"
                  >
                    Full Archive <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {previousLenses.map((item) => (
                    <div key={item.id} className="group bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/60 rounded-xl p-5 transition-all flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider mb-1.5 block">
                          {item.publishedAt}
                        </span>
                        <h3 className="font-serif font-bold text-base text-on-surface leading-snug mb-3 group-hover:text-primary transition-colors">
                          <Link to={getArticleUrl(item, 'clearpath-lens')}>
                            {item.title}
                          </Link>
                        </h3>
                        {item.excerpt && (
                          <p className="text-xs text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                            {item.excerpt}
                          </p>
                        )}
                      </div>
                      <Link
                        to={getArticleUrl(item, 'clearpath-lens')}
                        className="text-xs font-bold text-secondary hover:text-primary transition-colors inline-flex items-center gap-1 pt-2 border-t border-outline-variant/40"
                      >
                        Read Analysis <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Evidence from Athena */}
        <AthenaEvidenceCard article={currentLens} />
      </main>

      <SubscriptionSection />
    </div>
  );
}
