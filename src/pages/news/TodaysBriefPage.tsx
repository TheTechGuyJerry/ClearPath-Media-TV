import { calculateReadTime } from '../../utils/formatters';

import React from 'react';
import { getArticleUrl } from '../../utils/urlUtils';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, Clock, ArrowRight, ShieldAlert, Sparkles, BookOpen, Share2 } from 'lucide-react';
import SEO from '../../components/SEO';
import { AthenaEvidenceCard } from '../../components/clearpath/AthenaEvidenceCard';
import { ClearPathDailySidebar } from '../../components/clearpath/ClearPathDailySidebar';
import { SubscriptionSection } from '../../components/clearpath/SubscriptionSection';
import { useClearPathArticles } from '../../hooks/useClearPathArticles';

export default function TodaysBriefPage() {
  const { articles, loading } = useClearPathArticles('todays-brief');
  
  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <p className="text-primary font-mono text-sm uppercase tracking-wider">Loading Today's Brief...</p>
      </div>
    );
  }

  const brief = articles[0];
  const previousBriefs = articles.slice(1);

  return (
    <div className="w-full min-h-screen bg-background font-sans">
      <SEO
        title="Today's Brief — ClearPath Daily"
        description="Every weekday morning briefing on Nigeria's politics, governance, economy, and public policy."
      />

      {/* Header Banner */}
      <div className="bg-slate-950 text-white border-b border-outline-variant py-10 md:py-14 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif text-white mb-3">
            Today's Brief
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Essential morning analysis breaking down Nigeria's governance, fiscal decisions, and public policy developments before the noise begins.
          </p>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 space-y-12">
        {!brief ? (
           <div className="py-20 text-center bg-surface-bright rounded-2xl border border-outline-variant shadow-sm">
             <BookOpen className="w-12 h-12 text-outline mx-auto mb-4" />
             <h3 className="text-xl font-bold text-on-surface mb-2">No Briefs Published Yet</h3>
             <p className="text-on-surface-variant max-w-md mx-auto">Articles for Today's Brief will appear here once they are published from the CMS.</p>
           </div>
        ) : (
          <>
            {/* Featured Today's Brief */}
            <section className="bg-surface-bright border-2 border-primary/20 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-outline-variant/60">
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  FEATURED BRIEF • {brief.publishedAt}
                </span>
                <span className="text-xs font-mono text-on-surface-variant flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  {brief.readingTime || calculateReadTime(brief.content || brief.excerpt)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-7 space-y-4">
                  <span className="text-xs font-mono font-bold text-secondary uppercase tracking-wider block">
                    {brief.category || 'TODAY\'S BRIEF'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-on-surface leading-tight">
                    <Link to={getArticleUrl(brief, 'todays-brief')} className="hover:text-primary transition-colors">
                      {brief.title}
                    </Link>
                  </h2>
                  {brief.subtitle && (
                    <p className="text-sm font-medium text-on-surface-variant/90 leading-relaxed">
                      {brief.subtitle}
                    </p>
                  )}
                  <div className="pt-2 flex items-center gap-4">
                    <Link
                      to={getArticleUrl(brief, 'todays-brief')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                    >
                      <span>Read Full Briefing</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="md:col-span-5 rounded-2xl overflow-hidden border border-outline-variant h-56 sm:h-64 relative group">
                  <img
                    src={brief.coverImage || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80'}
                    alt={brief.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </section>

            {/* Side-by-Side: Previous Editions & Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Main Content Column: Previous Editions */}
              <div className="lg:col-span-8">
                {previousBriefs.length > 0 && (
                  <section className="bg-surface-bright border border-outline-variant rounded-2xl p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6 pb-3 border-b border-outline-variant">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-bold font-serif text-on-surface uppercase tracking-wide">
                          Latest from ClearPath Daily
                        </h2>
                      </div>
                      <Link
                        to="/archive"
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-wider"
                      >
                        All ClearPath Daily Archive <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {previousBriefs.map((item) => (
                        <div
                          key={item.id}
                          className="bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 rounded-xl p-5 flex flex-col justify-between transition-all group"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">
                                {item.category || item.categorySlug?.replace(/-/g, ' ')}
                              </span>
                              <span className="text-[11px] font-mono text-on-surface-variant">{item.publishedAt}</span>
                            </div>
                            <h3 className="font-serif font-bold text-base text-on-surface group-hover:text-primary transition-colors leading-snug mb-2">
                              <Link to={getArticleUrl(item, item.categorySlug)}>
                                {item.title}
                              </Link>
                            </h3>
                            <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                              {item.excerpt}
                            </p>
                          </div>
                          <div className="pt-4 mt-4 border-t border-outline-variant/40 flex items-center justify-between">
                            <Link
                              to={getArticleUrl(item, item.categorySlug)}
                              className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                            >
                              Read Edition <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar Column: Related Programme Video & Same Edition Section */}
              <div className="lg:col-span-4">
                <ClearPathDailySidebar
                  currentDate={brief.publishedAt}
                  currentSectionSlug="todays-brief"
                  articleTitleOrSubject={brief.title}
                />
              </div>
            </div>
          </>
        )}

        {/* Evidence from Athena */}
        <AthenaEvidenceCard article={brief} />
      </main>

      {/* Subscription Block */}
      <SubscriptionSection />
    </div>
  );
}
