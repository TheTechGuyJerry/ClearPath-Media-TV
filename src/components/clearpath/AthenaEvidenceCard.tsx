import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import { AthenaPublication } from '../../data/clearpath_daily_data';

interface AthenaEvidenceCardProps {
  publication?: AthenaPublication;
  article?: any; // ClearPathDailyArticle
}

export const AthenaEvidenceCard: React.FC<AthenaEvidenceCardProps> = ({ publication, article }) => {
  let pub = publication;

  if (article && article.athenaEvidenceType && article.athenaEvidenceTitle && article.athenaEvidenceType !== 'None') {
    pub = {
      id: article.id || 'dynamic',
      type: article.athenaEvidenceType as any,
      title: article.athenaEvidenceTitle,
      summary: article.athenaEvidenceSummary || '',
      publishedAt: article.athenaEvidenceDate || '',
      url: article.athenaEvidenceUrl || '#',
      authors: ['Athena Centre for Policy & Leadership'],
      topicTags: []
    };
  }

  if (!pub) return null;

  return (
    <div className="bg-surface-bright border-2 border-emerald-600/30 rounded-2xl p-6 shadow-sm relative overflow-hidden my-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-outline-variant/60">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>EVIDENCE FROM ATHENA</span>
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full">
          {pub.type}
        </span>
      </div>

      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-on-surface leading-snug mb-2">
            {pub.title}
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-4">
            {pub.summary}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-outline-variant/40">
          <span className="text-[11px] text-on-surface-variant font-medium">
            {pub.publishedAt}
          </span>

          <a
            href={pub.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white hover:bg-emerald-800 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-sm"
          >
            <span>Read the Full Research on Athena</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
