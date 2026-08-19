
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ExternalLink, ArrowRight, BookOpen, Layers, Play } from 'lucide-react';
import SEO from '../components/SEO';
import { AthenaEvidenceCard } from '../components/clearpath/AthenaEvidenceCard';
import { ClearPathDailySidebar } from '../components/clearpath/ClearPathDailySidebar';
import { SubscriptionSection } from '../components/clearpath/SubscriptionSection';
import ReactMarkdown from 'react-markdown';
import { useClearPathArticles } from '../hooks/useClearPathArticles';

export default function ClearPathLensPage() {
  const { articles, loading } = useClearPathArticles('clearpath-lens');

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <p className="text-primary font-mono text-sm uppercase tracking-wider">Loading The ClearPath Lens...</p>
      </div>
    );
  }

  const currentLens = articles[0];
  const previousLenses = articles.slice(1);

  return (
    <div className="w-full min-h-screen bg-background font-sans">
      <SEO
        title="The ClearPath Lens — ClearPath Daily"
        description="A weekly panoramic view connecting seemingly disparate events into a cohesive institutional analysis."
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
              A weekly panoramic view connecting seemingly disparate events into a cohesive institutional analysis.
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
              {/* Header Image & Title */}
              <div className="relative h-64 sm:h-80 md:h-96 w-full">
                <img 
                  src={currentLens.coverImage || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80'} 
                  alt={currentLens.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-[#18181b]/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider bg-zinc-800/80 backdrop-blur-sm px-3 py-1 rounded-full mb-4 inline-block border border-zinc-600">
                    WEEKLY LENS • {currentLens.publishedAt}
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif text-white leading-tight max-w-4xl text-balance">
                    {currentLens.title}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start p-6 md:p-10">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-10">
                  {/* Introductory Summary */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-zinc-800 rounded-full"></div>
                      <h3 className="text-lg font-bold font-serif text-on-surface uppercase tracking-wide">The Summary</h3>
                    </div>
                    <div className="prose prose-slate max-w-none text-base sm:text-lg leading-relaxed text-on-surface font-medium">
                      <ReactMarkdown>{currentLens.introductorySummary || currentLens.excerpt || ''}</ReactMarkdown>
                    </div>
                  </section>

                  {/* Institutional Analysis */}
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-primary rounded-full"></div>
                      <h3 className="text-lg font-bold font-serif text-on-surface uppercase tracking-wide">Institutional Analysis</h3>
                    </div>
                    <div className="prose prose-slate prose-headings:font-serif prose-headings:font-bold prose-p:leading-relaxed max-w-none text-on-surface-variant">
                      <ReactMarkdown>{currentLens.institutionalAnalysis || currentLens.content || ''}</ReactMarkdown>
                    </div>
                  </section>
                </div>

                {/* Meta Sidebar (Right column for Lens) */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Supporting Sources */}
                  {currentLens.supportingSourcesJson && (
                    <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant">
                      <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider mb-4 font-mono flex items-center gap-2 pb-2 border-b border-outline-variant">
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
                    <div key={item.id} className="group bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/60 rounded-xl p-5 transition-all flex flex-col sm:flex-row gap-5">
                      <div className="shrink-0 w-full sm:w-24 h-40 sm:h-24 rounded-lg overflow-hidden border border-outline-variant">
                        <img 
                          src={item.coverImage || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80'} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-grow flex flex-col justify-center">
                        <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider mb-1 block">
                          {item.publishedAt}
                        </span>
                        <h3 className="font-serif font-bold text-base text-on-surface leading-tight mb-2 group-hover:text-primary transition-colors">
                          <Link to={`{getArticleUrl(item, 'clearpath-lens')}`}>
                            {item.title}
                          </Link>
                        </h3>
                        <Link
                          to={`{getArticleUrl(item, 'clearpath-lens')}`}
                          className="text-xs font-bold text-secondary hover:text-primary transition-colors inline-flex items-center gap-1 mt-auto"
                        >
                          Read Analysis <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
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
