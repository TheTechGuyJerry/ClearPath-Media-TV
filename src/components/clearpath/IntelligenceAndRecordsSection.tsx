import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck, CalendarClock, Compass, ExternalLink, ArrowRight, Quote, FileText, BookOpen, Play } from 'lucide-react';
import { IndicatorItem, PublicRecordItem, SignalToWatchItem, GoDeeperItem } from '../../data/clearpath_daily_data';

interface IntelligenceAndRecordsSectionProps {
  indicator: IndicatorItem;
  publicRecord: PublicRecordItem;
  signalsToWatch: SignalToWatchItem[];
  goDeeperItems: GoDeeperItem[];
}

export const IntelligenceAndRecordsSection: React.FC<IntelligenceAndRecordsSectionProps> = ({
  indicator,
  publicRecord,
  signalsToWatch,
  goDeeperItems
}) => {
  const displaySignals = signalsToWatch ? signalsToWatch.slice(0, 4) : [];
  const displayResources = goDeeperItems ? goDeeperItems.slice(0, 3) : [];

  const getTypeIcon = (type: GoDeeperItem['type']) => {
    switch (type) {
      case 'Background':
        return <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'Evidence':
        return <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'Watch':
        return <Play className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
    }
  };

  const getTypeBadge = (type: GoDeeperItem['type']) => {
    switch (type) {
      case 'Background':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20';
      case 'Evidence':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20';
      case 'Watch':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20';
    }
  };

  return (
    <section className="my-10 bg-surface-bright border border-outline-variant/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs relative">
      {/* Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-5 border-b border-outline-variant/70">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              Verified Public Records · Updated Regularly
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-on-surface tracking-tight">
            Key Metrics, Verified Records & Forward Signals
          </h2>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/athena"
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 inline-flex items-center gap-1.5 uppercase tracking-wider bg-emerald-500/10 px-4 py-2.5 rounded-xl border border-emerald-500/20 shadow-2xs transition-all hover:bg-emerald-500/15"
          >
            <span>View the Evidence Desk</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Two-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column — Verified Records & Forward Signals (7 cols on desktop) */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-6 sm:p-7 shadow-2xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/50">
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <h3 className="text-xs font-mono font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                VERIFIED RECORDS & MILESTONES TO WATCH
              </h3>
            </div>
            <span className="text-[11px] font-mono text-on-surface-variant font-medium">
              Verified Desk
            </span>
          </div>

          {/* Vertical Editorial List with Thin Horizontal Dividers */}
          <div className="divide-y divide-outline-variant/40">
            {displaySignals.map((signal, idx) => (
              <div key={signal.id || idx} className="py-5 first:pt-0 last:pb-0 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    <span className="text-[11px] font-mono font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded uppercase tracking-wider">
                      {signal.dateOrDay}
                    </span>
                  </div>
                  
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/15">
                    VERIFIED SIGNAL
                  </span>
                </div>

                <h4 className="text-base font-serif font-bold text-on-surface leading-snug">
                  {signal.event}
                </h4>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {signal.shortExplanation}
                </p>
                
                <div className="bg-surface-bright p-3 rounded-xl border border-outline-variant/50 text-xs">
                  <span className="text-emerald-800 dark:text-emerald-400 font-mono font-extrabold text-[10px] uppercase tracking-wider block mb-0.5">
                    POLICY IMPLICATION:
                  </span>
                  <span className="text-on-surface font-medium leading-snug block">
                    {signal.whyItMatters}
                  </span>
                </div>

                {signal.relatedLinkUrl && (
                  <div className="pt-1 text-right">
                    <a
                      href={signal.relatedLinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline uppercase tracking-wider"
                    >
                      <span>{signal.relatedLinkTitle || 'Source & Analysis'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column — Featured Metric Card & Forward Signal (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Primary Verified Metric (Large Highlighted Card) */}
          {indicator && (
            <div className="bg-gradient-to-br from-emerald-950 via-[#00142B] to-[#001B34] text-white border-2 border-emerald-500/30 rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-emerald-300">
                    FEATURED VERIFIED METRIC
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  REAL-TIME DATA
                </span>
              </div>

              <div className="space-y-4">
                {/* Large Metric Display */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center shadow-inner flex flex-col items-center justify-center backdrop-blur-xs">
                  <span className="text-4xl sm:text-5xl font-black font-serif text-amber-300 tracking-tight leading-none mb-2">
                    {indicator.number}
                  </span>
                  <span className="text-xs font-bold font-mono text-emerald-100 uppercase tracking-wider max-w-xs">
                    {indicator.title}
                  </span>
                </div>

                <div className="space-y-3 text-xs text-slate-200 leading-relaxed">
                  <p>{indicator.description}</p>

                  <div className="bg-emerald-500/15 rounded-xl p-3.5 border border-emerald-500/25 text-white">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 block mb-1">
                      EXPLANATION & IMPACT:
                    </span>
                    <p className="font-medium leading-snug">
                      {indicator.whyItMatters}
                    </p>
                  </div>
                </div>

                {indicator.supportingSourceUrl && (
                  <div className="pt-2 border-t border-white/10 text-right">
                    <a
                      href={indicator.supportingSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:underline uppercase tracking-wider"
                    >
                      <span>View Source and Methodology</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Forward Signal / Public Record Quotation */}
          {publicRecord && (
            <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-6 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
                <div className="flex items-center gap-2">
                  <Quote className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                    FORWARD SIGNAL · PUBLIC RECORD
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-on-surface-variant">
                  {publicRecord.date}
                </span>
              </div>

              <div className="relative pl-4 border-l-3 border-emerald-600 py-1">
                <p className="text-sm sm:text-base font-serif font-semibold text-on-surface leading-relaxed italic mb-3">
                  "{publicRecord.quote}"
                </p>

                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-on-surface block">{publicRecord.speakerName}</span>
                  <span className="text-on-surface-variant block text-[11px]">{publicRecord.position} • {publicRecord.institution}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-outline-variant/30 bg-surface-bright p-3 rounded-xl">
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  <strong className="text-on-surface">Context:</strong> {publicRecord.context}
                </p>
                {publicRecord.sourceLinkUrl && (
                  <div className="text-right mt-2">
                    <a
                      href={publicRecord.sourceLinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline uppercase tracking-wider"
                    >
                      <span>{publicRecord.sourceLinkTitle}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Related Resources Row (3-Column Layout beneath main metrics grid) */}
      {displayResources.length > 0 && (
        <div className="mt-8 pt-8 border-t border-outline-variant/60">
          <div className="flex items-center gap-2 mb-5">
            <Compass className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-xs font-mono font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              RELATED REPORTS & EVIDENCE DESK RESOURCES
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayResources.map((item, idx) => {
              const isExternal = item.linkUrl.startsWith('http');
              return (
                <div
                  key={idx}
                  className="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-all group shadow-2xs"
                >
                  <div>
                    <div className="mb-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${getTypeBadge(item.type)}`}>
                        {getTypeIcon(item.type)}
                        {item.type}
                      </span>
                    </div>

                    {item.thumbnail && (
                      <div className="relative rounded-xl overflow-hidden h-32 mb-3 bg-surface-container">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <h4 className="text-sm font-serif font-bold text-on-surface leading-snug mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {item.title}
                    </h4>

                    <p className="text-xs text-on-surface-variant leading-relaxed mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-outline-variant/30 mt-auto">
                    {isExternal ? (
                      <a
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline uppercase tracking-wider"
                      >
                        <span>{item.buttonText}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <Link
                        to={item.linkUrl}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline uppercase tracking-wider"
                      >
                        <span>{item.buttonText}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
