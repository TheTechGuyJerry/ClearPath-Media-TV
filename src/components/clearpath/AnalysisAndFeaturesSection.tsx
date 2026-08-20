
import React, { useMemo } from 'react';
import { getArticleUrl } from '../../utils/urlUtils';
import { Link } from 'react-router-dom';
import { Play, Clock, ArrowRight } from 'lucide-react';
import { ClearPathDailyArticle } from '../../types';
import { ProgrammeVideo } from '../../types';
import { slugify } from '../../services/publicContentService';
import { calculateReadTime } from '../../utils/formatters';

interface LatestStoryItem {
  id: string;
  category: string;
  title: string;
  date?: string;
  link: string;
}

interface AnalysisAndFeaturesSectionProps {
  inFocusStories?: ClearPathDailyArticle[];
  lensStory?: ClearPathDailyArticle | null;
  mainFeaturedAnalysis?: ClearPathDailyArticle | null;
  dayName?: string;
  latestStoriesList?: LatestStoryItem[];
  videoFeed?: ProgrammeVideo[];
}




export const AnalysisAndFeaturesSection: React.FC<AnalysisAndFeaturesSectionProps> = ({
  inFocusStories,
  lensStory,
  mainFeaturedAnalysis,
  latestStoriesList,
  videoFeed,
}) => {
  // 1. Featured Analysis
  const mainAnalysis = mainFeaturedAnalysis || null;

  // 2. Latest Stories 
  const latestStories = latestStoriesList || [];

  // 3. Latest Programme Releases (Videos)
  const releasesList = videoFeed && videoFeed.length > 0 ? videoFeed.slice(0, 4) : [];

  const firstInFocus = inFocusStories?.[0];
  const secondInFocus = inFocusStories?.[1];

  const dateDisplay = mainAnalysis?.publishedAt || 'Recently';

  return (
    <section className="space-y-8">
      {/* TWO COLUMNS: Featured Analysis & Latest */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        
        {/* LEFT COLUMN: Main Featured Analysis (~66% / 8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-outline-variant/60">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-serif font-bold text-[#001e40] dark:text-on-surface tracking-tight">
                  Featured Analysis
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                {mainAnalysis?.category || "TODAY'S BRIEF"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-extrabold text-[#17181a] dark:text-on-surface leading-tight text-balance group-hover:text-primary transition-colors">
              <Link to={mainAnalysis ? getArticleUrl(mainAnalysis as any, 'todays-brief') : '#'}>
                {mainAnalysis?.title || 'No Featured Analysis available.'}
              </Link>
            </h2>

            {mainAnalysis?.coverImage && (
              <div className="w-full aspect-[21/9] sm:aspect-[16/6] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-xs mt-4 group">
                <Link to={mainAnalysis ? getArticleUrl(mainAnalysis as any, 'todays-brief') : '#'}>
                  <img
                    src={mainAnalysis.coverImage}
                    alt={mainAnalysis?.title || 'Placeholder'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                </Link>
              </div>
            )}
            <p className="text-sm sm:text-base text-slate-600 dark:text-on-surface-variant leading-relaxed max-w-3xl line-clamp-3">
              {mainAnalysis?.excerpt || 'No featured analysis is available at the moment.'}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 dark:text-on-surface-variant mb-5">
              <span>{dateDisplay}</span>
              {mainAnalysis && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    {mainAnalysis.readingTime || calculateReadTime(mainAnalysis.content || mainAnalysis.excerpt)}
                  </span>
                </>
              )}
            </div>
          </div>
          
          {mainAnalysis && (
            <div className="pt-4 border-t border-slate-100 dark:border-outline-variant/40 mt-auto">
              <Link
                to={getArticleUrl(mainAnalysis as any, 'todays-brief')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#001e40] hover:bg-[#00142b] dark:bg-primary dark:hover:bg-primary/90 text-white dark:text-on-primary font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all group/btn"
              >
                <span>Read Analysis</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Latest Stories (~33% / 4 cols) */}
        <div className="lg:col-span-4 bg-slate-50/80 dark:bg-surface-container-low border border-slate-200/80 dark:border-outline-variant/60 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-outline-variant/60">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#001e40] dark:text-on-surface tracking-tight shrink-0">
              Latest
            </h3>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-on-surface-variant">
              STORIES & BRIEFINGS
            </span>
          </div>

          <div className="space-y-4">
            {latestStories.length === 0 ? (
               <p className="text-sm text-on-surface-variant pt-4">No stories published yet.</p>
            ) : (
              latestStories.map((story, idx) => (
                <div 
                  key={story.id + idx} 
                  className="pb-3.5 border-b border-slate-200/80 dark:border-outline-variant/40 last:border-0 last:pb-0 group"
                >
                  <span className="block text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#001e40] dark:text-primary mb-1">
                    {story.category}
                  </span>
                  <Link 
                    to={story.link} 
                    className="font-serif font-bold text-sm sm:text-[15px] text-[#17181a] dark:text-on-surface group-hover:text-[#001e40] dark:group-hover:text-primary transition-colors leading-snug line-clamp-2 block"
                  >
                    {story.title}
                  </Link>
                  {story.date && (
                    <span className="block text-[11px] font-sans text-slate-400 dark:text-on-surface-variant/70 mt-1">
                      {story.date}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* SECTION WIDE: Latest Releases */}
      <div className="bg-slate-50/90 dark:bg-surface-container-low border border-slate-200/80 dark:border-outline-variant/60 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80 dark:border-outline-variant/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#001e40] dark:text-on-surface tracking-tight">
                Latest releases
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                PROGRAMMES & MEDIA
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-on-surface-variant">
              Watch recent video briefings, expert discussions, and policy roundtables.
            </p>
          </div>
          <Link 
            to="/programmes" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline uppercase tracking-wider shrink-0"
          >
            <span>View all releases</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {releasesList.length === 0 ? (
            <div className="col-span-full py-8 text-center text-sm text-on-surface-variant">No video releases available.</div>
          ) : (
            releasesList.map((vid, idx) => {
              const vidLink = (vid as any).link || (vid as any).youtubeUrl || `/programmes/${vid.programmeId || slugify(vid.programmeTitle || 'clearpath-media')}`;
              const thumb = (vid as any).thumbnail || vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.youtubeVideoId || 'IpF2T1-okyA'}/hqdefault.jpg`;
              const progTitle = vid.programmeTitle || (vid as any).tag || 'CLEARPATH TV';

              return (
                <div key={vid.id || idx} className="bg-white dark:bg-surface-bright border border-slate-200/80 dark:border-outline-variant/70 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between group hover:border-slate-300 transition-colors">
                  <div>
                    <Link to={vidLink} className="block relative aspect-video bg-slate-900 overflow-hidden">
                      <img 
                        src={thumb} 
                        alt={vid.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-slate-900/90 text-[#001e40] dark:text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-[#001e40] group-hover:text-white transition-all shadow-md">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                    </Link>
                    <div className="p-4 space-y-1.5">
                      <span className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#001e40] dark:text-primary">
                        {progTitle}
                      </span>
                      <h4 className="font-sans font-bold text-sm text-[#17181a] dark:text-on-surface leading-snug line-clamp-2 group-hover:text-[#001e40] dark:group-hover:text-primary transition-colors">
                        <Link to={vidLink}>
                          {vid.title}
                        </Link>
                      </h4>
                    </div>
                  </div>
                  <div className="px-4 pb-4 pt-1">
                    <Link 
                      to={vidLink}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#001e40] dark:text-primary hover:underline uppercase tracking-wider"
                    >
                      <span>Watch Release</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
