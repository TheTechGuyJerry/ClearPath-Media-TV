import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, BookOpen, Play, FileText, ArrowRight, ExternalLink } from 'lucide-react';
import { GoDeeperItem } from '../../data/clearpath_daily_data';

interface GoDeeperSectionProps {
  items: GoDeeperItem[];
}

export const GoDeeperSection: React.FC<GoDeeperSectionProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  const displayItems = items.slice(0, 3);

  const getTypeIcon = (type: GoDeeperItem['type']) => {
    switch (type) {
      case 'Background':
        return <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'Evidence':
        return <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Watch':
        return <Play className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
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
    <section className="my-10 bg-surface-bright border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-6 pb-3 border-b border-outline-variant/60">
        <Compass className="w-4 h-4 text-primary" />
        <h2 className="text-xs font-mono font-extrabold uppercase tracking-widest text-primary">
          GO DEEPER — RELATED RESOURCES & EVIDENCE
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayItems.map((item, idx) => {
          const isExternal = item.linkUrl.startsWith('http');

          return (
            <div
              key={idx}
              className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-5 flex flex-col justify-between hover:border-primary/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${getTypeBadge(item.type)}`}>
                    {getTypeIcon(item.type)}
                    {item.type}
                  </span>
                </div>

                {item.thumbnail && (
                  <div className="relative rounded-lg overflow-hidden h-36 mb-3 bg-surface-container">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}

                <h3 className="text-sm font-bold text-on-surface leading-snug mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-outline-variant/40 mt-auto">
                {isExternal ? (
                  <a
                    href={item.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline uppercase tracking-wider"
                  >
                    <span>{item.buttonText}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <Link
                    to={item.linkUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline uppercase tracking-wider"
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
    </section>
  );
};
