import { getArticleUrl } from '../utils/urlUtils';
import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight, User } from 'lucide-react';
import SEO from '../components/SEO';
import { SAMPLE_DAILY_ARTICLES, DailyArticle } from '../data/clearpath_daily_data';
import { SubscriptionSection } from '../components/clearpath/SubscriptionSection';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || searchParams.get('search') || '';
  const [query, setQuery] = useState(initialQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSearchParams(val ? { q: val } : {});
  };

  const results = SAMPLE_DAILY_ARTICLES.filter((article: DailyArticle) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      article.title.toLowerCase().includes(q) ||
      article.excerpt.toLowerCase().includes(q) ||
      article.category.toLowerCase().includes(q) ||
      article.authorName.toLowerCase().includes(q) ||
      article.topicTags.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full min-h-screen bg-background font-sans">
      <SEO
        title="Search ClearPath Daily & Media Archive"
        description="Search ClearPath Daily briefings, analysis, weekly features, and programmes."
      />

      <div className="bg-slate-950 text-white border-b border-outline-variant py-10 md:py-14 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-white mb-4">
            Search Publication Platform
          </h1>

          <div className="relative max-w-2xl">
            <SearchIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by keyword, topic, headline, category, or author..."
              value={query}
              onChange={handleSearchChange}
              autoFocus
              className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-medium text-white placeholder-slate-400 focus:outline-none focus:border-primary shadow-inner"
            />
          </div>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 space-y-8">
        <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant pb-2 border-b border-outline-variant/60">
          <span>Search Results: <strong>{results.length}</strong> publications found</span>
          {query && <span>Query: "{query}"</span>}
        </div>

        {results.length === 0 ? (
          <div className="p-12 text-center bg-surface-bright border border-outline-variant rounded-2xl max-w-xl mx-auto my-8">
            <SearchIcon className="w-12 h-12 text-on-surface-variant mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-bold text-on-surface mb-1">
              No matching publications found
            </h3>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              Try searching with broader terms such as "subsidy", "elections", "FAAC", "governance", or "ECOWAS".
            </p>
            <button
              onClick={() => { setQuery(''); setSearchParams({}); }}
              className="px-5 py-2.5 bg-primary text-on-primary text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm"
            >
              Clear Search Query
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((article: DailyArticle) => (
              <div
                key={article.id}
                className="bg-surface-bright border border-outline-variant rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-primary/40 transition-all group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-surface-container">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-surface-bright/90 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-primary">
                      {article.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold font-serif text-on-surface leading-tight mb-2 group-hover:text-primary transition-colors">
                      <Link to={getArticleUrl(article)}>
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 mt-auto flex items-center justify-between border-t border-outline-variant/40 pt-4 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    <span>{article.authorName}</span>
                  </div>
                  <Link
                    to={getArticleUrl(article)}
                    className="inline-flex items-center gap-1 font-bold text-primary uppercase tracking-wider hover:underline"
                  >
                    <span>Read Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <SubscriptionSection />
      </main>
    </div>
  );
}
