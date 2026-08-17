import React from 'react';
import { getArticleUrl } from '../../utils/urlUtils';
import { Link } from 'react-router-dom';
import { Eye, ArrowRight, ExternalLink, ShieldAlert, BookOpen } from 'lucide-react';
import { ClearPathLensStory } from '../../data/clearpath_daily_data';

interface ClearPathLensSectionProps {
  lens: ClearPathLensStory;
}

export const ClearPathLensSection: React.FC<ClearPathLensSectionProps> = ({ lens }) => {
  if (!lens) return null;

  return (
    <section className="my-12 bg-surface-bright border-2 border-primary/30 rounded-2xl p-6 md:p-8 lg:p-10 shadow-md">
      {/* Header Badge */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-primary text-on-primary shadow-sm">
            <Eye className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold font-serif text-on-surface uppercase tracking-wider">
              THE CLEARPATH LENS
            </h2>
            <span className="text-xs text-on-surface-variant font-medium">
              Systemic & Structural Analysis
            </span>
          </div>
        </div>
        <Link
          to="/clearpath-lens"
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-wider"
        >
          Explore ClearPath Lens Archive <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Lens Left/Top Content */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black font-serif text-on-surface leading-tight mb-4">
              <Link to={`/clearpath-lens/${lens.slug}`} className="hover:text-primary transition-colors">
                {lens.headline}
              </Link>
            </h3>

            {lens.featuredImage && (
              <div className="relative rounded-xl overflow-hidden mb-6 h-64 sm:h-80 border border-outline-variant">
                <img
                  src={lens.featuredImage}
                  alt={lens.headline}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/60 mb-6">
              <p className="text-base text-on-surface leading-relaxed font-medium">
                {lens.introductorySummary}
              </p>
            </div>

            {/* Institutional Analysis excerpt */}
            <div className="prose prose-sm max-w-none text-on-surface-variant mb-6 leading-relaxed line-clamp-6">
              {lens.institutionalAnalysis.split('\n\n')[0]}
            </div>
          </div>

          <div>
            <Link
              to={`/clearpath-lens/${lens.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:bg-primary/90 transition-all group"
            >
              <span>Read Full Institutional Analysis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Lens Right Sidebar: Evidence, Related Stories & What to Watch */}
        <div className="lg:col-span-4 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l border-outline-variant/60 pt-6 lg:pt-0 lg:pl-8">
          {/* Related Athena Research Callout */}
          {lens.relatedAthenaResearch && (
            <div className="bg-surface-container-high/80 border border-outline-variant p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-2 text-xs font-mono font-bold text-primary uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                EVIDENCE FROM ATHENA
              </div>
              <h4 className="text-sm font-bold text-on-surface mb-2 leading-snug">
                {lens.relatedAthenaResearch.title}
              </h4>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                {lens.relatedAthenaResearch.summary}
              </p>
              <a
                href={lens.relatedAthenaResearch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-lg transition-colors"
              >
                <span>Read Research on Athena</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* What to Watch */}
          {lens.whatToWatch && lens.whatToWatch.length > 0 && (
            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/60">
              <div className="flex items-center gap-2 mb-3 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                WHAT TO WATCH
              </div>
              <ul className="space-y-2.5 text-xs text-on-surface">
                {lens.whatToWatch.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span className="leading-normal font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Stories */}
          {lens.relatedStories && lens.relatedStories.length > 0 && (
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant mb-3">
                RELATED ANALYSIS
              </h4>
              <ul className="space-y-2">
                {lens.relatedStories.map((story, idx) => (
                  <li key={idx}>
                    <Link
                      to={getArticleUrl(story, 'clearpath-lens')}
                      className="text-xs font-bold text-on-surface hover:text-primary transition-colors flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-surface-container"
                    >
                      <span>{story.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
