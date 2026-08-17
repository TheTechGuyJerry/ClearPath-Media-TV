import React from 'react';
import { getArticleUrl } from '../../utils/urlUtils';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import { InFocusStory } from '../../data/clearpath_daily_data';

interface InFocusSectionProps {
  stories: [InFocusStory, InFocusStory];
}

export const InFocusSection: React.FC<InFocusSectionProps> = ({ stories }) => {
  if (!stories || stories.length < 2) return null;

  return (
    <section className="my-10">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Layers className="w-4 h-4" />
          </span>
          <h2 className="text-xl font-bold font-serif text-on-surface uppercase tracking-wide">
            IN FOCUS
          </h2>
        </div>
        <Link
          to="/category/in-focus"
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-wider"
        >
          View All Focus Stories <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {stories.map((item, idx) => {
          const { goldNumber, article } = item;
          return (
            <div
              key={article.id || idx}
              className="bg-surface-bright border border-outline-variant rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-amber-500/40 transition-all group"
            >
              <div>
                {/* Image header with Gold Badge */}
                <div className="relative overflow-hidden h-52 sm:h-60 bg-surface-container">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Gold Number Badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs px-3 py-1.5 rounded-md shadow-lg tracking-widest flex items-center gap-1 uppercase">
                    <span className="text-[10px] opacity-80">GOLD</span>
                    <span className="text-sm">{goldNumber}</span>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-surface-bright/90 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-wider text-on-surface">
                    {article.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold font-serif text-on-surface leading-tight mb-2.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    <Link to={getArticleUrl(article, 'in-focus')}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                    {article.excerpt}
                  </p>

                  {/* Why it matters */}
                  <div className="bg-amber-500/5 border-l-3 border-amber-500 rounded-r-lg p-3 text-xs mb-4">
                    <span className="font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-0.5">
                      WHY THIS MATTERS:
                    </span>
                    <span className="text-on-surface font-medium leading-snug">
                      {article.whyItMatters}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="px-6 pb-6 pt-0 mt-auto flex items-center justify-between border-t border-outline-variant/40 pt-4">
                <span className="text-xs font-medium text-on-surface-variant">
                  {article.publishedAt}
                </span>
                <Link
                  to={getArticleUrl(article, 'in-focus')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 uppercase tracking-wider group/link"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
