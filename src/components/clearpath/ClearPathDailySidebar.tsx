import React, { useState, useEffect } from 'react';
import { getArticleUrl } from '../../utils/urlUtils';
import { Link } from 'react-router-dom';
import { Play, Calendar, ExternalLink, ArrowRight, BookOpen, Layers, BarChart3, Quote, Target, Radio, CheckCircle2, Clock } from 'lucide-react';
import { CURRENT_DAILY_EDITION, DailyEdition, DailyArticle } from '../../data/clearpath_daily_data';
import { getPublishedProgrammeVideos } from '../../services/publicContentService';
import { ProgrammeVideo } from '../../types';

export interface ClearPathDailySidebarProps {
  currentDate?: string;
  currentSectionSlug?: 'todays-brief' | 'in-focus' | 'the-indicator' | 'the-public-record' | 'clearpath-lens' | 'signals-to-watch' | 'weekly-feature' | string;
  currentArticleSlug?: string;
  articleTitleOrSubject?: string;
  edition?: DailyEdition;
}

export function ClearPathDailySidebar({
  currentDate,
  currentSectionSlug,
  currentArticleSlug,
  articleTitleOrSubject,
  edition = CURRENT_DAILY_EDITION
}: ClearPathDailySidebarProps) {
  const publicationDate = currentDate || edition.formattedDate;

  // Dynamic Programme Video state
  const [video, setVideo] = useState<ProgrammeVideo | null>(null);
  const [loadingVideo, setLoadingVideo] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchDynamicVideo() {
      try {
        setLoadingVideo(true);
        const publishedVideos = await getPublishedProgrammeVideos();
        if (!isMounted) return;

        if (publishedVideos && publishedVideos.length > 0) {
          const searchTerms = [
            currentSectionSlug || '',
            currentArticleSlug || '',
            articleTitleOrSubject || '',
            edition.todaysBrief?.title || ''
          ].join(' ').toLowerCase();

          // Extract non-trivial words (length > 3)
          const words = searchTerms.split(/\W+/).filter(w => w.length > 3);

          // Find best matching video dynamically
          const matched = publishedVideos.find(v => {
            const vTitle = (v.title || '').toLowerCase();
            const vSummary = (v.shortSummary || v.fullDescription || '').toLowerCase();
            const vProg = (v.programmeTitle || v.programmeId || '').toLowerCase();
            const tags = (v.topicTags || []).map(t => t.toLowerCase());
            const keyPts = typeof v.keyPoints === 'string' ? v.keyPoints.toLowerCase() : '';

            const combined = `${vTitle} ${vSummary} ${vProg} ${tags.join(' ')} ${keyPts}`;

            return words.some(word => combined.includes(word));
          }) || publishedVideos[0];

          setVideo(matched);
        }
      } catch (err) {
        console.error('Error loading dynamic programme video:', err);
      } finally {
        if (isMounted) setLoadingVideo(false);
      }
    }

    fetchDynamicVideo();
    return () => { isMounted = false; };
  }, [currentSectionSlug, currentArticleSlug, articleTitleOrSubject, edition]);

  return (
    <aside className="w-full space-y-6">
      {/* Same Edition Header & Navigation Card */}
      <div className="bg-surface-bright border-2 border-primary/20 rounded-2xl p-5 md:p-6 shadow-sm">
        {/* Section List */}
        <div className="space-y-3.5">
          {/* 2. In Focus */}
          {(() => {
            const isCurrent = currentSectionSlug === 'in-focus' || edition.inFocus.some(f => f.article.slug === currentArticleSlug);
            const mainInFocus = edition.inFocus[0]?.article;
            if (!mainInFocus) return null;
            return (
              <div className={`p-3 rounded-xl border transition-all ${isCurrent ? 'bg-primary/5 border-primary/40' : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/60'}`}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    IN FOCUS
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-mono font-bold text-secondary bg-secondary/15 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Reading
                    </span>
                  )}
                </div>
                <Link
                  to={getArticleUrl(mainInFocus, 'in-focus')}
                  className="font-serif font-bold text-xs sm:text-sm text-on-surface hover:text-primary transition-colors line-clamp-2 block leading-snug"
                >
                  {mainInFocus.title}
                </Link>
                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
                  <span>{publicationDate}</span>
                  <Link to={`/clearpath-daily/in-focus`} className="text-primary font-bold hover:underline inline-flex items-center gap-0.5">
                    Deep Analysis <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })()}

          {/* 3. The Indicator */}
          {(() => {
            const isCurrent = currentSectionSlug === 'the-indicator';
            return (
              <div className={`p-3 rounded-xl border transition-all ${isCurrent ? 'bg-primary/5 border-primary/40' : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/60'}`}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    THE INDICATOR
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Reading
                    </span>
                  )}
                </div>
                <Link
                  to="/clearpath-daily/the-indicator"
                  className="flex items-baseline gap-2 group"
                >
                  <span className="text-base font-black font-mono text-primary group-hover:underline">
                    {edition.indicator.number}
                  </span>
                  <span className="font-serif font-bold text-xs text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                    {edition.indicator.title}
                  </span>
                </Link>
                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
                  <span>{publicationDate}</span>
                  <Link to="/clearpath-daily/the-indicator" className="text-primary font-bold hover:underline inline-flex items-center gap-0.5">
                    View Data <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })()}

          {/* 4. The Public Record */}
          {(() => {
            const isCurrent = currentSectionSlug === 'the-public-record';
            return (
              <div className={`p-3 rounded-xl border transition-all ${isCurrent ? 'bg-primary/5 border-primary/40' : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/60'}`}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Quote className="w-3 h-3" />
                    THE PUBLIC RECORD
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Reading
                    </span>
                  )}
                </div>
                <Link
                  to="/clearpath-daily/the-public-record"
                  className="font-serif italic text-xs text-on-surface hover:text-primary transition-colors line-clamp-2 block leading-snug"
                >
                  "{edition.publicRecord.quote}"
                </Link>
                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
                  <span className="font-sans font-semibold text-on-surface">{edition.publicRecord.speakerName}</span>
                  <Link to="/clearpath-daily/the-public-record" className="text-primary font-bold hover:underline inline-flex items-center gap-0.5">
                    View Record <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })()}

          {/* 5. The ClearPath Lens */}
          {(() => {
            const isCurrent = currentSectionSlug === 'clearpath-lens' || currentArticleSlug === edition.clearpathLens.slug;
            return (
              <div className={`p-3 rounded-xl border transition-all ${isCurrent ? 'bg-primary/5 border-primary/40' : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/60'}`}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    THE CLEARPATH LENS
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Reading
                    </span>
                  )}
                </div>
                <Link
                  to={getArticleUrl(edition.clearpathLens, 'clearpath-lens')}
                  className="font-serif font-bold text-xs sm:text-sm text-on-surface hover:text-primary transition-colors line-clamp-2 block leading-snug"
                >
                  {edition.clearpathLens.headline}
                </Link>
                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
                  <span>{publicationDate}</span>
                  <Link to={getArticleUrl(edition.clearpathLens, 'clearpath-lens')} className="text-primary font-bold hover:underline inline-flex items-center gap-0.5">
                    Read Lens <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })()}

          {/* 6. Signals to Watch */}
          {(() => {
            const isCurrent = currentSectionSlug === 'signals-to-watch';
            const topSignal = edition.signalsToWatch[0];
            return (
              <div className={`p-3 rounded-xl border transition-all ${isCurrent ? 'bg-primary/5 border-primary/40' : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/60'}`}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
                    <Radio className="w-3 h-3" />
                    SIGNALS TO WATCH
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-mono font-bold text-rose-700 dark:text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Reading
                    </span>
                  )}
                </div>
                {topSignal && (
                  <Link
                    to="/clearpath-daily/signals-to-watch"
                    className="font-serif font-bold text-xs text-on-surface hover:text-primary transition-colors line-clamp-2 block leading-snug"
                  >
                    {topSignal.event}
                  </Link>
                )}
                <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
                  <span>{publicationDate}</span>
                  <Link to="/clearpath-daily/signals-to-watch" className="text-primary font-bold hover:underline inline-flex items-center gap-0.5">
                    View Signals <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Related Programme Video Widget */}
      <div className="bg-surface-bright border border-outline-variant rounded-2xl p-5 md:p-6 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase tracking-wider">
            <Play className="w-4 h-4 fill-primary text-primary" />
            RELATED PROGRAMME EPISODE
          </div>
          
        </div>

        {loadingVideo ? (
          <div className="animate-pulse space-y-3">
            <div className="w-full aspect-video bg-surface-container-high rounded-xl" />
            <div className="h-3 bg-surface-container-high rounded w-1/3" />
            <div className="h-4 bg-surface-container-high rounded w-4/5" />
            <div className="h-9 bg-surface-container-high rounded-xl w-full" />
          </div>
        ) : video ? (
          <>
            <div className="rounded-xl overflow-hidden border border-outline-variant/80 relative mb-3.5 group aspect-video bg-slate-900">
              <img
                src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=600'}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                <a
                  href={video.youtubeUrl || `https://www.youtube.com/watch?v=${video.youtubeVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </a>
              </div>
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-slate-950/80 text-white text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                  <Clock className="w-3 h-3" />
                  {video.duration}
                </div>
              )}
            </div>

            <span className="text-[10px] font-mono font-bold uppercase text-primary block mb-1">
              {video.programmeTitle || (video as any).programmeName || video.programmeId || 'ClearPath Media'}
            </span>
            <h4 className="text-sm font-bold font-serif text-on-surface mb-3 leading-snug line-clamp-2">
              {video.title}
            </h4>

            <a
              href={video.youtubeUrl || `https://www.youtube.com/watch?v=${video.youtubeVideoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
            >
              <span>Watch Episode</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </>
        ) : (
          <div className="text-xs text-on-surface-variant italic py-4 text-center">
            No related programme episode available.
          </div>
        )}
      </div>
    </aside>
  );
}
