import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ChevronLeft, ChevronRight, Share2, Facebook, Twitter, Linkedin, Mail, Copy, Check, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import { CURRENT_DAILY_EDITION, PAST_DAILY_EDITIONS } from '../data/clearpath_daily_data';
import { TodaysBriefSection } from '../components/clearpath/TodaysBriefSection';
import { InFocusSection } from '../components/clearpath/InFocusSection';
import { WeeklyFeatureSection } from '../components/clearpath/WeeklyFeatureSection';
import { IndicatorSection } from '../components/clearpath/IndicatorSection';
import { PublicRecordSection } from '../components/clearpath/PublicRecordSection';
import { ClearPathLensSection } from '../components/clearpath/ClearPathLensSection';
import { SignalsToWatchSection } from '../components/clearpath/SignalsToWatchSection';
import { GoDeeperSection } from '../components/clearpath/GoDeeperSection';
import { SubscriptionSection } from '../components/clearpath/SubscriptionSection';

export default function DailyEditionPage() {
  const { year, month, day } = useParams<{ year: string; month: string; day: string }>();
  const [copied, setCopied] = useState(false);

  const requestedDateStr = `${year}-${month}-${day}`;
  const isCurrentDate = requestedDateStr === CURRENT_DAILY_EDITION.dateString || !year;

  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isCurrentDate && !PAST_DAILY_EDITIONS.some(e => e.dateString === requestedDateStr)) {
    return (
      <div className="w-full min-h-[70vh] bg-background flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-surface-bright border border-outline-variant p-8 rounded-2xl shadow-sm">
          <Calendar className="w-12 h-12 text-primary mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold text-on-surface mb-2 font-serif">
            No Edition Published for {requestedDateStr}
          </h2>
          <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
            There is no ClearPath Daily edition archived for this specific date. ClearPath Daily is published every weekday morning.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/clearpath-daily"
              className="px-5 py-2.5 bg-primary text-on-primary font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm"
            >
              Read Latest Edition
            </Link>
            <Link
              to="/archive?category=daily-editions"
              className="px-5 py-2.5 bg-surface-container border border-outline-variant text-on-surface font-bold text-xs uppercase tracking-wider rounded-lg"
            >
              View Full Archive
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const edition = CURRENT_DAILY_EDITION;

  return (
    <div className="w-full min-h-screen bg-background font-sans">
      <SEO
        title={`ClearPath Daily Edition — ${edition.formattedDate}`}
        description={edition.todaysBrief.excerpt}
      />

      {/* Date Header Banner */}
      <div className="bg-slate-950 text-white border-b border-outline-variant py-8 md:py-10 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CLEARPATH DAILY EDITION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white">
              {edition.editionTitle}
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Published: {edition.formattedDate} • Abuja, Nigeria
            </p>
          </div>

          {/* Edition Pagination Controls */}
          <div className="flex items-center gap-2">
            <Link
              to="/daily/2026/08/05"
              className="inline-flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors"
              title="Previous Edition (Aug 5, 2026)"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Edition</span>
            </Link>

            <Link
              to="/clearpath-daily"
              className="inline-flex items-center gap-1 px-3 py-2 bg-primary hover:bg-primary/90 text-on-primary rounded-lg text-xs font-bold transition-colors"
              title="Latest Edition"
            >
              <span>Latest Edition</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Edition Content */}
      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 space-y-8">
        {/* Social Sharing Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-surface-bright border border-outline-variant rounded-xl text-xs font-medium">
          <span className="font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
            <Share2 className="w-4 h-4 text-primary" />
            Share This Edition:
          </span>
          <div className="flex items-center gap-2">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-surface-container hover:bg-primary/10 rounded-lg text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Share on Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(edition.editionTitle)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-surface-container hover:bg-primary/10 rounded-lg text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Share on X"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-surface-container hover:bg-primary/10 rounded-lg text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(edition.editionTitle)}&body=${encodeURIComponent(currentUrl)}`}
              className="p-2 bg-surface-container hover:bg-primary/10 rounded-lg text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Share via Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Link' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Today's Brief */}
        <TodaysBriefSection article={edition.todaysBrief} />

        {/* In Focus */}
        <InFocusSection stories={edition.inFocus} />

        {/* Weekly Feature */}
        <WeeklyFeatureSection />

        {/* The Indicator */}
        <IndicatorSection indicator={edition.indicator} />

        {/* The Public Record */}
        <PublicRecordSection record={edition.publicRecord} />

        {/* The ClearPath Lens */}
        <ClearPathLensSection lens={edition.clearpathLens} />

        {/* Signals to Watch */}
        <SignalsToWatchSection signals={edition.signalsToWatch} />

        {/* Go Deeper */}
        <GoDeeperSection items={edition.goDeeper} />

        {/* Subscription Section */}
        <SubscriptionSection />
      </main>
    </div>
  );
}
