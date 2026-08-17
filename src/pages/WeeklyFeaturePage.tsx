import { getArticleUrl } from '../utils/urlUtils';
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bookmark, Calendar, ArrowRight, User } from 'lucide-react';
import SEO from '../components/SEO';
import { SAMPLE_DAILY_ARTICLES, DailyArticle } from '../data/clearpath_daily_data';
import { SubscriptionSection } from '../components/clearpath/SubscriptionSection';

export default function WeeklyFeaturePage() {
  const { slug } = useParams<{ slug: string }>();

  const titleMap: Record<string, { title: string; desc: string }> = {
    'west-african-monitor': {
      title: 'West African Monitor',
      desc: 'Diplomatic relations, ECOWAS policy directions, and trans-border security developments across West Africa.'
    },
    'state-in-focus': {
      title: 'State in Focus',
      desc: 'Sub-national governance, state assembly oversight, and local economic policy across Nigerian states.'
    },
    'lga-brief': {
      title: 'LGA Brief',
      desc: 'Third-tier governance, grassroots revenue distribution, and municipal service delivery.'
    },
    'governance-brief': {
      title: 'Governance Brief',
      desc: 'Institutional accountability, civil service administration, and public expenditure transparency.'
    },
    'bccn-news': {
      title: 'BCCN News',
      desc: 'Business, Climate, and Community Network updates driving sustainable growth.'
    }
  };

  const featureInfo = (slug && titleMap[slug]) || {
    title: slug ? slug.replace(/-/g, ' ').toUpperCase() : 'Specialized Weekly Feature',
    desc: 'Weekly intelligence reports and domain-specific governance coverage.'
  };

  const articles = SAMPLE_DAILY_ARTICLES.filter(a =>
    slug ? (a.slug.includes(slug) || a.categorySlug.includes(slug) || a.category.toLowerCase().includes(slug.replace(/-/g, ' '))) : true
  );

  return (
    <div className="w-full min-h-screen bg-background font-sans">
      <SEO
        title={`${featureInfo.title} — ClearPath Weekly Features`}
        description={featureInfo.desc}
      />

      {/* Header Banner */}
      <div className="bg-slate-950 text-white border-b border-outline-variant py-10 md:py-14 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Bookmark className="w-3.5 h-3.5" />
            <span>WEEKLY SPECIALIZED PUBLICATION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif text-white mb-3">
            {featureInfo.title}
          </h1>
          <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
            {featureInfo.desc}
          </p>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(articles.length > 0 ? articles : SAMPLE_DAILY_ARTICLES.slice(0, 2)).map((article: DailyArticle) => (
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
                    {featureInfo.title}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold font-serif text-on-surface leading-tight mb-2 group-hover:text-primary transition-colors">
                    <Link to={getArticleUrl(article, 'west-african-monitor')}>
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
                  to={getArticleUrl(article, 'west-african-monitor')}
                  className="inline-flex items-center gap-1 font-bold text-primary uppercase tracking-wider hover:underline"
                >
                  <span>Read Full Feature</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <SubscriptionSection />
      </main>
    </div>
  );
}
