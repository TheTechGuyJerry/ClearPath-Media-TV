import React from 'react';
import { Archive, Filter, ArrowRight, Calendar, Loader2 } from 'lucide-react';
import { getArticleUrl } from '../utils/urlUtils';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { PAST_DAILY_EDITIONS, SAMPLE_DAILY_ARTICLES, ALL_CATEGORIES } from '../data/clearpath_daily_data';
import { SubscriptionSection } from '../components/clearpath/SubscriptionSection';
import { useClearPathArticles } from '../hooks/useClearPathArticles';
import { ClearPathDailyArticle } from '../types';

export default function ArchivePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';

  // Fetch real articles from Firestore
  const { articles: dbArticles, loading } = useClearPathArticles(
    selectedCategory === 'all' ? undefined : selectedCategory
  );

  // Fallback to sample data if Firestore returns nothing (so page is never broken)
  const filteredSampleArticles = SAMPLE_DAILY_ARTICLES.filter(a => {
    if (selectedCategory === 'all') return true;
    return a.categorySlug === selectedCategory || a.category.toLowerCase().includes(selectedCategory.replace(/-/g, ' '));
  });

  const displayArticles: ClearPathDailyArticle[] = dbArticles.length > 0 
    ? dbArticles 
    : (filteredSampleArticles as ClearPathDailyArticle[]);

  // Metadata mapping for dedicated category archives
  const categoryMeta: Record<string, { title: string; badge: string; description: string }> = {
    'todays-brief': {
      title: "Today's Brief Archive",
      badge: "TODAY'S BRIEF ARCHIVE",
      description: "Daily lead analytical summaries breaking down Nigeria's governance, fiscal, and political developments."
    },
    'in-focus': {
      title: "In Focus Archive",
      badge: "IN FOCUS PUBLIC ARCHIVE",
      description: "Deep paired analytical briefings examining Nigeria's structural legislative, economic, and institutional issues."
    },
    'the-indicator': {
      title: "The Indicator Archive",
      badge: "THE INDICATOR ARCHIVE",
      description: "Crucial economic figures, fiscal statistics, and data-driven policy metrics contextualized for policy impact."
    },
    'the-public-record': {
      title: "The Public Record Archive",
      badge: "THE PUBLIC RECORD ARCHIVE",
      description: "Verified archive of official public statements, government directives, and institutional policy declarations."
    },
    'clearpath-lens': {
      title: "The ClearPath Lens Archive",
      badge: "CLEARPATH LENS ARCHIVE",
      description: "Comprehensive structural breakdowns connecting current events to long-term systemic dynamics."
    },
    'signals-to-watch': {
      title: "Signals to Watch Archive",
      badge: "SIGNALS TO WATCH ARCHIVE",
      description: "Key upcoming hearings, policy decisions, and democratic milestones across governance spheres."
    },
    'weekly-features': {
      title: "Weekly Features Archive",
      badge: "WEEKLY FEATURES ARCHIVE",
      description: "In-depth weekly investigations, analytical long-reads, and sub-national policy features."
    },
    'west-africa-monitor': {
      title: "West Africa Monitor Archive",
      badge: "WEST AFRICA MONITOR ARCHIVE",
      description: "Diplomatic relations, ECOWAS policy directions, and trans-border security across West Africa."
    },
    'state-in-focus': {
      title: "State in Focus Archive",
      badge: "STATE IN FOCUS ARCHIVE",
      description: "Sub-national governance, state assembly oversight, and local economic policy in Nigerian states."
    },
    'lga-brief': {
      title: "LGA Brief Archive",
      badge: "LGA BRIEF ARCHIVE",
      description: "Third-tier governance, grassroots revenue distribution, and municipal service delivery."
    },
    'governance-brief': {
      title: "Governance Brief Archive",
      badge: "GOVERNANCE BRIEF ARCHIVE",
      description: "Institutional accountability, civil service administration, and judicial compliance."
    },
    'bccn-news': {
      title: "BCCN News Archive",
      badge: "BCCN NEWS ARCHIVE",
      description: "Business, Climate, and Community Network updates shaping sustainable growth."
    }
  };

  const currentMeta = categoryMeta[selectedCategory] || {
    title: "Publications Archive",
    badge: "PERMANENT PUBLIC ARCHIVE",
    description: "Access previous daily editions, specialized weekly features, and foundational governance analysis."
  };

  const handleSelectCategory = (catId: string) => {
    if (catId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: catId });
    }
  };

  return (
    <div className="w-full min-h-screen bg-background font-sans">
      <SEO
        title={`${currentMeta.title} | ClearPath Media`}
        description={currentMeta.description}
      />

      {/* Header Banner */}
      <div className="bg-slate-950 text-white border-b border-outline-variant py-10 md:py-14 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <Archive className="w-4 h-4" />
            <span>{currentMeta.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif text-white mb-3">
            {currentMeta.title}
          </h1>
          <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
            {currentMeta.description}
          </p>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 space-y-10">
        
        {/* Previous Daily Editions List (Shown when viewing all or Today's Brief) */}
        {(selectedCategory === 'all' || selectedCategory === 'todays-brief') && (
          <section className="bg-surface-bright border border-outline-variant rounded-2xl p-6 md:p-8 shadow-2xs">
            <h2 className="text-xl font-bold font-serif text-on-surface mb-4 pb-2 border-b border-outline-variant uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              ClearPath Daily Past Editions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PAST_DAILY_EDITIONS.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.link}
                  className="p-4 bg-surface-container-low hover:bg-surface-container border border-outline-variant/60 rounded-xl transition-all group"
                >
                  <span className="text-[11px] font-mono font-bold text-primary block mb-1">
                    {item.formattedDate}
                  </span>
                  <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-mono font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1 shrink-0 mr-2">
            <Filter className="w-3.5 h-3.5" /> Publication Filter:
          </span>
          <button
            onClick={() => handleSelectCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
              selectedCategory === 'all'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
            }`}
          >
            All Publications
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="p-16 text-center bg-surface-bright border border-outline-variant rounded-2xl flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
            <p className="text-sm text-on-surface-variant font-mono uppercase tracking-wider">
              Loading {currentMeta.title}...
            </p>
          </div>
        ) : displayArticles.length === 0 ? (
          <div className="p-12 text-center bg-surface-bright border border-outline-variant rounded-2xl">
            <Archive className="w-12 h-12 text-on-surface-variant mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-bold text-on-surface mb-1">
              No publications found in this archive
            </h3>
            <p className="text-xs text-on-surface-variant max-w-md mx-auto mb-4">
              There are currently no published entries for {currentMeta.title}.
            </p>
            <button
              onClick={() => handleSelectCategory('all')}
              className="px-5 py-2.5 bg-primary text-on-primary text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:bg-primary/90 transition-colors"
            >
              Reset to All Archives
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayArticles.map((article: ClearPathDailyArticle) => {
              const artCategorySlug = article.categorySlug || selectedCategory;
              const articleUrl = getArticleUrl(article, artCategorySlug);
              const displayDate = article.publishedAt || article.signalDateOrDay || 'Published';

              return (
                <div
                  key={article.id}
                  className="bg-surface-bright border border-outline-variant rounded-2xl overflow-hidden shadow-2xs flex flex-col justify-between hover:border-primary/40 transition-all group"
                >
                  <div>
                    {article.coverImage ? (
                      <div className="relative h-48 overflow-hidden bg-surface-container">
                        <img
                          src={article.coverImage}
                          alt={article.title || 'Publication Cover'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 bg-surface-bright/90 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-primary shadow-xs">
                          {article.category || currentMeta.badge.replace(' ARCHIVE', '')}
                        </div>
                      </div>
                    ) : (
                      <div className="px-6 pt-5 flex items-center justify-between border-b border-outline-variant/40 pb-3">
                        <span className="bg-primary/10 text-primary px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                          {article.category || currentMeta.badge.replace(' ARCHIVE', '')}
                        </span>
                        <span className="text-[11px] font-mono text-on-surface-variant">{displayDate}</span>
                      </div>
                    )}

                    <div className="p-6 space-y-2">
                      {article.coverImage && (
                        <div className="text-[11px] font-mono text-on-surface-variant">
                          {displayDate}
                        </div>
                      )}
                      
                      <h3 className="text-xl font-bold font-serif text-on-surface leading-tight group-hover:text-primary transition-colors">
                        <Link to={articleUrl}>
                          {article.indicatorNumber ? `Indicator: ${article.indicatorNumber}` : (article.title || article.quote || 'Untitled Publication')}
                        </Link>
                      </h3>

                      {article.speakerName && (
                        <p className="text-xs font-semibold text-primary">
                          — {article.speakerName} {article.speakerTitle ? `(${article.speakerTitle})` : ''}
                        </p>
                      )}

                      <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">
                        {article.excerpt || article.quote || article.summary || article.content}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-4 mt-auto flex items-center justify-between border-t border-outline-variant/40 text-xs text-on-surface-variant">
                    <span className="font-mono text-[11px]">
                      {article.readingTime || (article.status === 'archived' ? 'Archived Record' : 'Verified Entry')}
                    </span>
                    <Link
                      to={articleUrl}
                      className="inline-flex items-center gap-1 font-bold text-primary uppercase tracking-wider hover:underline"
                    >
                      <span>Read Analysis</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <SubscriptionSection />
      </main>
    </div>
  );
}
