import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark } from 'lucide-react';
import { getWeeklyFeatureForDay } from '../../data/clearpath_daily_data';

interface WeeklyFeatureSectionProps {
  dayName?: string;
}

export const WeeklyFeatureSection: React.FC<WeeklyFeatureSectionProps> = ({ dayName }) => {
  const feature = getWeeklyFeatureForDay(dayName);

  return (
    <section className="my-10 bg-surface-bright border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-surface-container-low px-6 py-3 border-b border-outline-variant flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
            WEEKLY SPECIALIZED PUBLICATION
          </span>
        </div>
        <span className="text-xs font-semibold text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded-full">
          {feature.date}
        </span>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-5 relative rounded-xl overflow-hidden border border-outline-variant/60 h-56 md:h-64">
          <img
            src={feature.image}
            alt={feature.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 bg-primary text-on-primary text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded shadow-md">
            {feature.category}
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-on-surface leading-tight mb-3 hover:text-primary transition-colors">
              <Link to={`/weekly-feature/${feature.slug}`}>
                {feature.title}
              </Link>
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              {feature.intro}
            </p>
          </div>

          <div>
            <Link
              to={`/weekly-feature/${feature.slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-container-high border border-outline-variant text-on-surface hover:bg-primary hover:text-on-primary font-bold text-xs uppercase tracking-wider rounded-lg transition-all group"
            >
              <span>Read Full Feature</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
