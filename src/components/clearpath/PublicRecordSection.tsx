import React from 'react';
import { Quote, ExternalLink, ShieldCheck } from 'lucide-react';
import { PublicRecordItem } from '../../data/clearpath_daily_data';

interface PublicRecordSectionProps {
  record: PublicRecordItem;
}

export const PublicRecordSection: React.FC<PublicRecordSectionProps> = ({ record }) => {
  if (!record) return null;

  return (
    <section className="my-10 bg-surface-bright border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-outline-variant/60">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-secondary" />
          <h2 className="text-xs font-mono font-extrabold uppercase tracking-widest text-secondary">
            THE PUBLIC RECORD — VERIFIED STATEMENT
          </h2>
        </div>
        <span className="text-xs font-medium text-on-surface-variant font-mono">
          {record.date}
        </span>
      </div>

      <div className="relative pl-6 md:pl-8 border-l-4 border-secondary/80 my-4">
        <Quote className="w-8 h-8 text-secondary/30 absolute -top-3 -left-4" />
        <p className="text-lg sm:text-xl font-serif font-semibold text-on-surface leading-relaxed italic mb-4">
          "{record.quote}"
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs">
          <div>
            <span className="font-bold text-on-surface text-sm block">{record.speakerName}</span>
            <span className="text-on-surface-variant">{record.position} • {record.institution}</span>
          </div>
          <div className="text-on-surface-variant font-medium text-right sm:text-left">
            <span>Setting: {record.setting}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-outline-variant/40 bg-surface-container-low/50 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <p className="text-on-surface-variant">
          <strong className="text-on-surface font-semibold">Context:</strong> {record.context}
        </p>
        {record.sourceLinkUrl && (
          <a
            href={record.sourceLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-secondary hover:underline uppercase tracking-wider shrink-0"
          >
            <span>{record.sourceLinkTitle}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </section>
  );
};
