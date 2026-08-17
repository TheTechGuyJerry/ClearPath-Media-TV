
import React from 'react';
import { getArticleUrl } from '../../utils/urlUtils';
import { Link } from 'react-router-dom';
import { Target, Clock, ArrowRight, BookOpen, Layers, Sparkles } from 'lucide-react';
import SEO from '../../components/SEO';
import { AthenaEvidenceCard } from '../../components/clearpath/AthenaEvidenceCard';
import { ClearPathDailySidebar } from '../../components/clearpath/ClearPathDailySidebar';
import { ATHENA_PUBLICATIONS } from '../../data/clearpath_daily_data';
import { SubscriptionSection } from '../../components/clearpath/SubscriptionSection';
import { useClearPathArticles } from '../../hooks/useClearPathArticles';

export default function InFocusPage() {
  const { articles, loading } = useClearPathArticles('in-focus');

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <p className="text-primary font-mono text-sm uppercase tracking-wider">Loading In Focus...</p>
      </div>
    );
  }

  // We group them by goldNumber if present (01 and 02), but typically we just take the first few
  const story01 = articles.find(a => a.goldNumber === '01') || articles[0];
  const story02 = articles.find(a => a.goldNumber === '02' && a.id !== story01?.id) || articles[1];
  
  const inFocusStories = [story01, story02].filter(Boolean);
  const previousInFocus = articles.filter(a => a.id !== story01?.id && a.id !== story02?.id);

  return (
    <div className="w-full min-h-screen bg-background font-sans">
      <SEO
        title="In Focus — ClearPath Daily"
        description="Deep dives into the structural stories driving Nigeria's policy and governance landscape."
      />

      {/* Header Banner */}
      <div className="bg-[#0f172a] text-white border-b border-outline-variant py-10 md:py-14 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif text-white mb-3">
            In Focus
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Going beyond the headlines. Deep dives into the structural stories driving Nigeria's policy, economy, and governance landscape.
          </p>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 space-y-12">
        {inFocusStories.length === 0 ? (
           <div className="py-20 text-center bg-surface-bright rounded-2xl border border-outline-variant shadow-sm">
             <Target className="w-12 h-12 text-outline mx-auto mb-4" />
             <h3 className="text-xl font-bold text-on-surface mb-2">No In Focus Articles Yet</h3>
             <p className="text-on-surface-variant max-w-md mx-auto">Articles for In Focus will appear here once they are published from the CMS.</p>
           </div>
        ) : (
          <>
            {/* The Top 2 "In Focus" Stories (Gold Numbers) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inFocusStories.map((story, idx) => (
                <section key={story.id} className="bg-surface-bright border border-outline-variant hover:border-primary/40 rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all group">
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-outline-variant">
                      <div className="bg-[#1e293b] text-[#facc15] font-serif font-black text-2xl w-12 h-12 flex items-center justify-center rounded-xl shadow-inner">
                        {story.goldNumber || `0${idx + 1}`}
                      </div>
                      <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                        {story.publishedAt}
                      </span>
                    </div>

                    <div className="space-y-4 mb-6">
                      <span className="text-xs font-mono font-bold text-secondary uppercase tracking-wider block">
                        {story.category || 'DEEP DIVE'}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-on-surface leading-tight group-hover:text-primary transition-colors">
                        <Link to={getArticleUrl(story, 'in-focus')}>
                          {story.title}
                        </Link>
                      </h2>
                      <p className="text-sm font-medium text-on-surface-variant/90 leading-relaxed line-clamp-3">
                        {story.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-outline-variant/40 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface">
                        {story.authorName?.[0] || 'CP'}
                      </div>
                      <span className="text-[11px] font-bold text-on-surface uppercase tracking-wide">
                        {story.authorName || 'ClearPath'}
                      </span>
                    </div>
                    <Link
                      to={getArticleUrl(story, 'in-focus')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-primary hover:text-white text-on-surface font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </section>
              ))}
            </div>

            {/* Side-by-Side: More Deep Dives & Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Main Content Column: Previous Deep Dives */}
              <div className="lg:col-span-8">
                {previousInFocus.length > 0 && (
                  <section className="bg-surface-bright border border-outline-variant rounded-2xl p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6 pb-3 border-b border-outline-variant">
                      <div className="flex items-center gap-2">
                        <Layers className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-bold font-serif text-on-surface uppercase tracking-wide">
                          More Deep Dives
                        </h2>
                      </div>
                      <Link
                        to="/archive?category=in-focus"
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-wider"
                      >
                        In Focus Archive <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="space-y-6">
                      {previousInFocus.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row gap-5 pb-6 border-b border-outline-variant/60 last:border-0 last:pb-0 group">
                          {item.coverImage && (
                            <div className="w-full sm:w-1/3 aspect-[4/3] rounded-xl overflow-hidden shrink-0 border border-outline-variant">
                              <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                          )}
                          <div className="flex-grow flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider">
                                {item.category || 'ANALYSIS'}
                              </span>
                              <span className="text-[10px] text-outline-variant">•</span>
                              <span className="text-[10px] font-mono text-on-surface-variant">
                                {item.publishedAt}
                              </span>
                            </div>
                            <h3 className="font-serif font-bold text-lg text-on-surface leading-tight mb-2 group-hover:text-primary transition-colors">
                              <Link to={getArticleUrl(item, 'in-focus')}>
                                {item.title}
                              </Link>
                            </h3>
                            <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed mb-3">
                              {item.excerpt}
                            </p>
                            <Link
                              to={getArticleUrl(item, 'in-focus')}
                              className="text-xs font-bold text-secondary hover:text-primary transition-colors inline-flex items-center gap-1 mt-auto"
                            >
                              Read Full Analysis <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar Column: Related Content */}
              <div className="lg:col-span-4">
                <ClearPathDailySidebar
                  currentDate={story01?.publishedAt || ''}
                  currentSectionSlug="in-focus"
                  articleTitleOrSubject={story01?.title || ''}
                />
              </div>
            </div>
          </>
        )}
        
        {/* Evidence from Athena */}
        <AthenaEvidenceCard article={story01} />
      </main>
      
      {/* Subscription Block */}
      <SubscriptionSection />
    </div>
  );
}
