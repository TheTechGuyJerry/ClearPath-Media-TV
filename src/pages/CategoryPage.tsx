import { getArticleUrl } from '../utils/urlUtils';
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FolderOpen, Search, ArrowRight, Calendar, User } from 'lucide-react';
import SEO from '../components/SEO';
import { ALL_CATEGORIES, SAMPLE_DAILY_ARTICLES, DailyArticle } from '../data/clearpath_daily_data';
import { SubscriptionSection } from '../components/clearpath/SubscriptionSection';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchQuery, setSearchQuery] = useState('');

  const currentCategory = ALL_CATEGORIES.find(c => c.id === slug) || {
    id: slug || 'all',
    name: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'Category Archive',
    description: 'Explore ClearPath Daily publications and intelligence archives.'
  };

  // Filter articles matching category and search query
  const filteredArticles = SAMPLE_DAILY_ARTICLES.filter(a => {
    const matchesCategory = slug ? (a.categorySlug === slug || a.category.toLowerCase().includes(slug.replace(/-/g, ' '))) : true;
    const matchesSearch = searchQuery.trim() === '' || 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-background font-sans">
      <SEO
        title={`${currentCategory.name} — ClearPath Daily`}
        description={currentCategory.description}
      />

      {/* Header Banner */}
      <div className="bg-slate-950 text-white border-b border-outline-variant py-10 md:py-14 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <FolderOpen className="w-4 h-4" />
            <span>PUBLICATION CATEGORY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif text-white mb-3">
            {currentCategory.name}
          </h1>
          <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
            {currentCategory.description}
          </p>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 space-y-8">
        {/* Search & Filter Bar */}
        <div className="p-4 bg-surface-bright border border-outline-variant rounded-xl flex items-center gap-3">
          <Search className="w-5 h-5 text-on-surface-variant shrink-0" />
          <input
            type="text"
            placeholder={`Search within ${currentCategory.name}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-on-surface focus:outline-none font-medium"
          />
        </div>

        {/* Articles Grid or Empty State */}
        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center bg-surface-bright border border-outline-variant rounded-2xl">
            <FolderOpen className="w-12 h-12 text-on-surface-variant mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-on-surface mb-1">
              No publications available in this category
            </h3>
            <p className="text-xs text-on-surface-variant mb-6">
              There are currently no published articles matching your criteria in this section.
            </p>
            <Link
              to="/clearpath-daily"
              className="px-5 py-2.5 bg-primary text-on-primary text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm"
            >
              Back to ClearPath Daily
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((article: DailyArticle) => (
              <div
                key={article.id}
                className="bg-surface-bright border border-outline-variant rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-primary/40 transition-all group"
              >
                <div>
                  <div className="relative h-48 sm:h-56 overflow-hidden bg-surface-container">
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

                <div className="px-6 pb-6 pt-0 mt-auto flex items-center justify-end border-t border-outline-variant/40 pt-4 text-xs text-on-surface-variant">
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

        {/* Subscription */}
        <SubscriptionSection />
      </main>
    </div>
  );
}
