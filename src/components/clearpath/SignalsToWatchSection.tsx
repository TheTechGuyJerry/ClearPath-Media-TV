import React from 'react';
import { CalendarClock, ExternalLink, ChevronRight } from 'lucide-react';
import { SignalToWatchItem } from '../../data/clearpath_daily_data';

interface SignalsToWatchSectionProps {
  signals: SignalToWatchItem[];
}

export const SignalsToWatchSection: React.FC<SignalsToWatchSectionProps> = ({ signals }) => {
  if (!signals || signals.length === 0) return null;

  // Max 5 items as specified in requirements
  const displaySignals = signals.slice(0, 5);

  return (
    <section className="my-10 bg-surface-bright border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-outline-variant/60">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-mono font-extrabold uppercase tracking-widest text-primary">
            SIGNALS TO WATCH — UPCOMING MILESTONES
          </h2>
        </div>
        <span className="text-xs font-medium text-on-surface-variant font-mono">
          Next 14 Days
        </span>
      </div>

      <div className="divide-y divide-outline-variant/40">
        {displaySignals.map((signal, idx) => (
          <div key={signal.id || idx} className="py-4 first:pt-0 last:pb-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            {/* Date Badge */}
            <div className="md:col-span-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-md uppercase tracking-wider">
                {signal.dateOrDay}
              </span>
            </div>

            {/* Event & Explanation */}
            <div className="md:col-span-9 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-on-surface leading-snug mb-1">
                  {signal.event}
                </h3>
                <p className="text-xs text-on-surface-variant mb-2 leading-relaxed">
                  {signal.shortExplanation}
                </p>
                <div className="text-xs bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/40">
                  <strong className="text-primary font-mono text-[10px] uppercase tracking-wider block mb-0.5">WHY IT MATTERS:</strong>
                  <span className="text-on-surface font-medium leading-normal">{signal.whyItMatters}</span>
                </div>
              </div>

              {signal.relatedLinkUrl && (
                <div className="mt-2 text-right">
                  <a
                    href={signal.relatedLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline uppercase tracking-wider"
                  >
                    <span>{signal.relatedLinkTitle || 'Related Details'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
