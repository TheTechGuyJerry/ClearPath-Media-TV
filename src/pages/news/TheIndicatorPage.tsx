
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, ExternalLink, ArrowRight, BookOpen, Database } from 'lucide-react';
import SEO from '../../components/SEO';
import { AthenaEvidenceCard } from '../../components/clearpath/AthenaEvidenceCard';
import { ClearPathDailySidebar } from '../../components/clearpath/ClearPathDailySidebar';
import { SubscriptionSection } from '../../components/clearpath/SubscriptionSection';
import { useClearPathArticles } from '../../hooks/useClearPathArticles';

export default function TheIndicatorPage() {
  const { articles, loading } = useClearPathArticles('the-indicator');

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <p className="text-primary font-mono text-sm uppercase tracking-wider">Loading The Indicator...</p>
      </div>
    );
  }

  const currentIndicator = articles[0];
  const previousIndicators = articles.slice(1);

  return (
    <div className="w-full min-h-screen bg-background font-sans">
      <SEO
        title="The Indicator — ClearPath Daily"
        description="One data point. What it is, and why it matters to Nigeria's political economy."
      />

      {/* Header Banner */}
      <div className="bg-[#f0fdf4] text-emerald-950 border-b border-emerald-200 py-10 md:py-14 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto flex items-center gap-4">
          <div className="p-3 bg-emerald-100 rounded-xl hidden sm:block">
            <BarChart3 className="w-8 h-8 text-emerald-700" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif mb-3 tracking-tight">
              The Indicator
            </h1>
            <p className="text-base sm:text-lg text-emerald-900/80 max-w-3xl leading-relaxed font-medium">
              One data point. What it is, and why it matters to Nigeria's political economy.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 space-y-12">
        {!currentIndicator ? (
           <div className="py-20 text-center bg-surface-bright rounded-2xl border border-outline-variant shadow-sm">
             <BarChart3 className="w-12 h-12 text-outline mx-auto mb-4" />
             <h3 className="text-xl font-bold text-on-surface mb-2">No Indicators Published Yet</h3>
             <p className="text-on-surface-variant max-w-md mx-auto">Articles for The Indicator will appear here once they are published from the CMS.</p>
           </div>
        ) : (
          <>
            {/* Featured Indicator */}
            <section className="bg-surface-bright border-2 border-emerald-200/60 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Number Display Column */}
                <div className="lg:col-span-5 text-center lg:text-left flex flex-col items-center lg:items-start justify-center">
                  <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full mb-6 inline-flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    LATEST INDICATOR • {currentIndicator.publishedAt}
                  </span>
                  
                  <div className="bg-emerald-950 text-white rounded-3xl p-8 sm:p-10 w-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-[1.02]">
                    <span className="text-5xl sm:text-6xl md:text-7xl font-black font-sans tracking-tighter">
                      {currentIndicator.indicatorNumber || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Context Column */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif text-on-surface leading-tight mb-3">
                      {currentIndicator.title}
                    </h2>
                    <p className="text-base sm:text-lg text-on-surface-variant font-medium leading-relaxed">
                      {currentIndicator.excerpt}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-outline-variant/60">
                    <div>
                      <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-2 font-mono flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" /> Why It Matters
                      </h3>
                      <p className="text-sm sm:text-base text-on-surface leading-relaxed">
                        {currentIndicator.whyItMatters}
                      </p>
                    </div>

                    
                  </div>
                </div>
              </div>
            </section>

            {/* Side-by-Side: Archive & Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Main Content Column: Previous Indicators */}
              <div className="lg:col-span-8">
                {previousIndicators.length > 0 && (
                  <section className="bg-surface-bright border border-outline-variant rounded-2xl p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8 pb-3 border-b border-outline-variant">
                      <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-bold font-serif text-on-surface uppercase tracking-wide">
                          Indicator Log
                        </h2>
                      </div>
                      <Link
                        to="/archive?category=the-indicator"
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-wider"
                      >
                        Full Data Archive <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="space-y-6">
                      {previousIndicators.map((item) => (
                        <div key={item.id} className="group bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 rounded-2xl p-5 sm:p-6 transition-all flex flex-col sm:flex-row gap-6 sm:items-center">
                          {/* Number Bubble */}
                          <div className="shrink-0 flex items-center justify-center bg-white border-2 border-emerald-100 rounded-xl w-24 h-24 sm:w-28 sm:h-28 shadow-sm group-hover:border-emerald-300 transition-colors">
                            <span className="text-xl sm:text-2xl font-black text-emerald-950 text-center leading-none px-2 break-all">
                              {item.indicatorNumber}
                            </span>
                          </div>

                          {/* Data Context */}
                          <div className="flex-grow space-y-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider">
                                {item.publishedAt}
                              </span>
                            </div>
                            <h3 className="font-serif font-bold text-lg text-on-surface leading-tight">
                              {item.title}
                            </h3>
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                              {item.excerpt}
                            </p>
                            <p className="text-xs font-medium text-emerald-800 leading-relaxed mt-2 pt-2 border-t border-outline-variant/40">
                              <span className="font-bold">Impact:</span> {item.whyItMatters}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar Column */}
              <div className="lg:col-span-4">
                <ClearPathDailySidebar
                  currentDate={currentIndicator.publishedAt || ''}
                  currentSectionSlug="the-indicator"
                  articleTitleOrSubject={currentIndicator.title}
                />
              </div>
            </div>
          </>
        )}

        {/* Evidence from Athena */}
        <AthenaEvidenceCard article={currentIndicator} />
      </main>

      <SubscriptionSection />
    </div>
  );
}
