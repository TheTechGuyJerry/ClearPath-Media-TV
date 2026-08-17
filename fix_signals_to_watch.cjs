const fs = require('fs');
const code = `
import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, ArrowRight, BookOpen, Calendar, AlertCircle } from 'lucide-react';
import SEO from '../../components/SEO';
import { AthenaEvidenceCard } from '../../components/clearpath/AthenaEvidenceCard';
import { ClearPathDailySidebar } from '../../components/clearpath/ClearPathDailySidebar';
import { ATHENA_PUBLICATIONS } from '../../data/clearpath_daily_data';
import { SubscriptionSection } from '../../components/clearpath/SubscriptionSection';
import { useClearPathArticles } from '../../hooks/useClearPathArticles';

export default function SignalsToWatchPage() {
  const { articles, loading } = useClearPathArticles('signals-to-watch');

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <p className="text-primary font-mono text-sm uppercase tracking-wider">Loading Signals to Watch...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background font-sans">
      <SEO
        title="Signals to Watch — ClearPath Daily"
        description="Looking ahead. Key upcoming events, statutory deadlines, and policy inflection points."
      />

      {/* Header Banner */}
      <div className="bg-[#1e1b4b] text-indigo-100 border-b border-indigo-900 py-10 md:py-14 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto flex items-center gap-4">
          <div className="p-3 bg-indigo-900 rounded-xl hidden sm:block">
            <Radio className="w-8 h-8 text-indigo-300" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif mb-3 tracking-tight">
              Signals to Watch
            </h1>
            <p className="text-base sm:text-lg text-indigo-200 max-w-3xl leading-relaxed font-medium">
              Looking ahead. Key upcoming events, statutory deadlines, and policy inflection points you need to have on your radar.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 space-y-12">
        {articles.length === 0 ? (
           <div className="py-20 text-center bg-surface-bright rounded-2xl border border-outline-variant shadow-sm">
             <Radio className="w-12 h-12 text-outline mx-auto mb-4" />
             <h3 className="text-xl font-bold text-on-surface mb-2">No Signals Published Yet</h3>
             <p className="text-on-surface-variant max-w-md mx-auto">Articles for Signals to Watch will appear here once they are published from the CMS.</p>
           </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Main Content Column */}
              <div className="lg:col-span-8 space-y-6">
                {articles.map((item, index) => (
                  <section 
                    key={item.id} 
                    className={\`bg-surface-bright border \${index === 0 ? 'border-indigo-200 shadow-md' : 'border-outline-variant shadow-sm'} rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-all hover:border-indigo-300 group\`}
                  >
                    {index === 0 && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                      {/* Date Block */}
                      <div className="shrink-0 flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-900 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <Calendar className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <span className="text-sm sm:text-xs font-mono font-bold text-indigo-900 uppercase tracking-wider mt-0 sm:mt-2">
                          {item.signalDateOrDay || item.publishedAt}
                        </span>
                      </div>

                      {/* Content Block */}
                      <div className="flex-grow space-y-4">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-extrabold font-serif text-on-surface leading-tight mb-2">
                            {item.signalEvent || item.title}
                          </h2>
                          <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                            {item.excerpt}
                          </p>
                        </div>

                        <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/60">
                          <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" /> Why It Matters
                          </h3>
                          <p className="text-sm text-on-surface leading-relaxed">
                            {item.whyItMatters}
                          </p>
                        </div>

                        {item.relatedLinkUrl && (
                          <div className="pt-2">
                            <a 
                              href={item.relatedLinkUrl}
                              target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-indigo-700 transition-colors"
                            >
                              {item.relatedLinkTitle || 'Read Background Document'} <ArrowRight className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                ))}
              </div>

              {/* Sidebar Column */}
              <div className="lg:col-span-4">
                <ClearPathDailySidebar
                  currentDate={articles[0]?.signalDateOrDay || articles[0]?.publishedAt || ''}
                  currentSectionSlug="signals-to-watch"
                  articleTitleOrSubject={articles[0]?.signalEvent || articles[0]?.title}
                />
              </div>
            </div>
          </>
        )}

        {/* Evidence from Athena */}
        <AthenaEvidenceCard publication={ATHENA_PUBLICATIONS[0]} />
      </main>

      <SubscriptionSection />
    </div>
  );
}
`;

fs.writeFileSync('src/pages/news/SignalsToWatchPage.tsx', code);
