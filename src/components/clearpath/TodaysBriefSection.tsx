import React, { useState } from 'react';
import { getArticleUrl } from '../../utils/urlUtils';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import { DailyArticle } from '../../data/clearpath_daily_data';

interface TodaysBriefSectionProps {
  article: DailyArticle;
}

export const TodaysBriefSection: React.FC<TodaysBriefSectionProps> = ({ article }) => {
  const [imageError, setImageError] = useState(false);

  if (!article) return null;

  // Format reading time nicely to uppercase (e.g., "16 MIN READ")
  const rawReadingTime = article.readingTime || '12 min read';
  const formattedReadingTime = rawReadingTime.toUpperCase().includes('READ')
    ? rawReadingTime.toUpperCase()
    : `${rawReadingTime.toUpperCase()} READ`;

  // Fallback high quality policy/editorial background if image fails
  const fallbackImage = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1600&q=80';

  return (
    <section className="relative w-full my-6 md:my-8 group">
      <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-outline-variant/60 shadow-xl bg-[#00142B] min-h-[420px] sm:min-h-[480px] md:min-h-[520px] lg:min-h-[560px] flex flex-col justify-end transition-all duration-300">
        
        {/* Full Card Background Image */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#00142B]">
          <img
            src={imageError ? fallbackImage : article.coverImage}
            alt={article.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
          
          {/* Dark Navy Gradient Overlay for Text Readability */}
          <div 
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(
                to top,
                rgba(0, 20, 43, 0.96) 0%,
                rgba(0, 20, 43, 0.82) 35%,
                rgba(0, 20, 43, 0.35) 68%,
                rgba(0, 20, 43, 0.08) 100%
              )`
            }}
          />

          {/* Subtle side shadow vignette to bolster contrast on left */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#00142B]/60 via-[#00142B]/20 to-transparent pointer-events-none" />
        </div>

        {/* Content Container positioned at Lower-Left */}
        <div className="relative z-20 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-end items-start text-left max-w-3xl lg:max-w-4xl space-y-3.5 sm:space-y-4">
          
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 text-white/90">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.15em] uppercase bg-white/10 backdrop-blur-md border border-white/25 text-white shadow-sm transition-all hover:bg-white/15">
              <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
              <span>TODAY'S BRIEF</span>
            </span>

            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase text-white/90 border-l border-white/30 pl-3">
              <Clock className="w-3.5 h-3.5 text-white/80 shrink-0" />
              <span>{formattedReadingTime}</span>
            </div>
          </div>

          {/* Large White Serif Headline */}
          <h2 className="text-white font-serif font-bold tracking-tight text-balance leading-[1.08] sm:leading-[1.05] drop-shadow-sm group-hover:text-white/95 transition-colors">
            <Link 
              to={getArticleUrl(article, 'todays-brief')}
              className="hover:underline hover:decoration-white/40 focus:outline-none focus:ring-2 focus:ring-white/80 rounded-sm inline-block"
              style={{ fontSize: 'clamp(1.75rem, 3.8vw, 3.25rem)' }}
            >
              <span className="line-clamp-3 sm:line-clamp-3">
                {article.title}
              </span>
            </Link>
          </h2>

          {/* Read More Link */}
          <div className="pt-2">
            <Link
              to={getArticleUrl(article, 'todays-brief')}
              className="inline-flex items-center gap-2.5 text-white font-bold text-sm sm:text-base tracking-wide group/link hover:text-white/90 focus:outline-none focus:ring-2 focus:ring-white/80 rounded-sm py-1 transition-all"
              aria-label={`Read More: ${article.title}`}
            >
              <span className="border-b-2 border-white/60 group-hover/link:border-white transition-colors pb-0.5">
                Read More
              </span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover/link:translate-x-1.5 transition-transform duration-200" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
