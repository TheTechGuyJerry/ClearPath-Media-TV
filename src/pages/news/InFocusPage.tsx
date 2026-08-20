
import React from 'react';
import { getArticleUrl } from '../../utils/urlUtils';
import { Link } from 'react-router-dom';
import { Target, Clock, ArrowRight, BookOpen, Layers, Sparkles } from 'lucide-react';
import SEO from '../../components/SEO';
import { AthenaEvidenceCard } from '../../components/clearpath/AthenaEvidenceCard';
import { ClearPathDailySidebar } from '../../components/clearpath/ClearPathDailySidebar';
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

  
  const latestDoc = articles[0];
  const previousInFocus = articles.slice(1);
  
  const inFocusStories = [];
  if (latestDoc) {
    if (latestDoc.title1) {
      inFocusStories.push({
        ...latestDoc,
        title: latestDoc.title1,
        excerpt: latestDoc.excerpt1 || latestDoc.excerpt,
        goldNumber: '01'
      });
    }
    if (latestDoc.title2) {
      inFocusStories.push({
        ...latestDoc,
        title: latestDoc.title2,
        excerpt: latestDoc.excerpt2,
        goldNumber: '02'
      });
    }
    // Fallback if they haven't migrated data yet
    if (!latestDoc.title1 && latestDoc.title) {
       inFocusStories.push({
        ...latestDoc,
        goldNumber: '01'
      });
    }
  }


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
            {/* The Latest "In Focus" Story */}
            {latestDoc && (
              <section id="in-focus-hero-card" className="bg-surface-bright border border-outline-variant hover:border-primary/40 rounded-2xl p-6 sm:p-8 md:p-10 transition-all shadow-xs group">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-outline-variant/60 mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                      Today's In Focus
                    </span>
                  </div>
                  {latestDoc.publishedAt && (
                    <span className="text-xs font-mono font-bold text-on-surface-variant bg-surface-container px-3.5 py-1.5 rounded-full">
                      {latestDoc.publishedAt}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
                  {/* Focus Item 1 */}
                  <Link
                    to={getArticleUrl(latestDoc, 'in-focus')}
                    className="flex items-start gap-4 p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/50 group/item"
                  >
                    <div className="bg-[#1e293b] text-[#facc15] font-serif font-black text-xl w-10 h-10 flex items-center justify-center rounded-lg shrink-0 shadow-inner">
                      01
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-wider block">
                        Focus 1
                      </span>
                      <h3 className="font-serif font-bold text-base sm:text-lg text-on-surface leading-snug group-hover/item:text-primary transition-colors">
                        {latestDoc.title1 || latestDoc.title || 'In Focus Topic 1'}
                      </h3>
                    </div>
                  </Link>

                  {/* Focus Item 2 (if available) */}
                  {latestDoc.title2 ? (
                    <Link
                      to={getArticleUrl(latestDoc, 'in-focus')}
                      className="flex items-start gap-4 p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/50 group/item"
                    >
                      <div className="bg-[#1e293b] text-[#facc15] font-serif font-black text-xl w-10 h-10 flex items-center justify-center rounded-lg shrink-0 shadow-inner">
                        02
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-wider block">
                          Focus 2
                        </span>
                        <h3 className="font-serif font-bold text-base sm:text-lg text-on-surface leading-snug group-hover/item:text-primary transition-colors">
                          {latestDoc.title2}
                        </h3>
                      </div>
                    </Link>
                  ) : (
                    <div className="hidden md:flex items-center justify-center p-5 rounded-xl bg-surface-container-low/50 border border-dashed border-outline-variant/50 text-xs text-on-surface-variant italic">
                      Single comprehensive deep dive edition
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2 border-t border-outline-variant/40">
                  <Link
                    to={getArticleUrl(latestDoc, 'in-focus')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <span>Read Story</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>
            )}
            
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
                  currentDate={latestDoc?.publishedAt || ''}
                  currentSectionSlug="in-focus"
                  articleTitleOrSubject={latestDoc?.title || ''}
                />
              </div>
            </div>
          </>
        )}
        
        {/* Evidence from Athena */}
        <AthenaEvidenceCard article={latestDoc} />
      </main>
      
      {/* Subscription Block */}
      <SubscriptionSection />
    </div>
  );
}
