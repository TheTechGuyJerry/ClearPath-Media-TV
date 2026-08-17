import React from 'react';
import { TrendingUp, ExternalLink } from 'lucide-react';
import { IndicatorItem } from '../../data/clearpath_daily_data';

interface IndicatorSectionProps {
  indicator: IndicatorItem;
}

export const IndicatorSection: React.FC<IndicatorSectionProps> = ({ indicator }) => {
  if (!indicator) return null;

  return (
    <section className="my-10 bg-gradient-to-br from-surface-container-lowest via-surface-bright to-surface-container-low border-2 border-primary/20 rounded-2xl p-6 md:p-8 lg:p-10 shadow-sm relative overflow-hidden">
      {/* Decorative background accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2 mb-6">
        <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
          <TrendingUp className="w-4 h-4" />
        </span>
        <h2 className="text-xs font-mono font-extrabold uppercase tracking-widest text-primary">
          THE INDICATOR — KEY STATISTIC
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Oversized Statistic */}
        <div className="lg:col-span-4 bg-surface-bright border border-outline-variant/80 rounded-xl p-6 text-center shadow-inner flex flex-col items-center justify-center min-h-[160px]">
          <span className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif text-primary tracking-tight leading-none mb-2">
            {indicator.number}
          </span>
          <span className="text-xs font-bold font-mono text-on-surface-variant uppercase tracking-wider">
            {indicator.title}
          </span>
        </div>

        {/* Explanation & Context */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-on-surface mb-2">
              What This Number Represents
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
              {indicator.description}
            </p>

            <div className="bg-surface-container-high/60 rounded-xl p-4 border border-outline-variant/60 mb-4">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-primary mb-1">
                POLICY IMPLICATION & CONTEXT
              </h4>
              <p className="text-xs font-medium text-on-surface leading-normal">
                {indicator.whyItMatters}
              </p>
            </div>
          </div>

          {indicator.supportingSourceUrl && (
            <div className="pt-2">
              <a
                href={indicator.supportingSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline uppercase tracking-wider"
              >
                <span>Source: {indicator.supportingSourceTitle}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
