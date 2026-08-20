
import React from 'react';
import { Link } from 'react-router-dom';
import { Quote, ExternalLink, ArrowRight, BookOpen, UserCheck, Shield, MapPin, Landmark } from 'lucide-react';
import SEO from '../../components/SEO';
import { AthenaEvidenceCard } from '../../components/clearpath/AthenaEvidenceCard';
import { ClearPathDailySidebar } from '../../components/clearpath/ClearPathDailySidebar';
import { SubscriptionSection } from '../../components/clearpath/SubscriptionSection';
import { RichContentRenderer } from '../../components/common/RichContentRenderer';
import { useClearPathArticles } from '../../hooks/useClearPathArticles';

export default function ThePublicRecordPage() {
  const { articles, loading } = useClearPathArticles('the-public-record');

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <p className="text-primary font-mono text-sm uppercase tracking-wider">Loading The Public Record...</p>
      </div>
    );
  }

  const currentRecord = articles[0];
  const previousRecords = articles.slice(1);

  return (
    <div className="w-full min-h-screen bg-background font-sans">
      <SEO
        title="The Public Record — ClearPath Daily"
        description="Who said what, and the context behind the statement."
      />

      {/* Header Banner */}
      <div className="bg-[#451a03] text-orange-50 border-b border-[#78350f] py-10 md:py-14 px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto flex items-center gap-4">
          <div className="p-3 bg-[#78350f] rounded-xl hidden sm:block">
            <Quote className="w-8 h-8 text-orange-200" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif mb-3 tracking-tight">
              The Public Record
            </h1>
            <p className="text-base sm:text-lg text-orange-200/80 max-w-3xl leading-relaxed font-medium">
              Who said what, and the context behind the statement. Tracking accountability in public discourse.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 space-y-12">
        {!currentRecord ? (
           <div className="py-20 text-center bg-surface-bright rounded-2xl border border-outline-variant shadow-sm">
             <Quote className="w-12 h-12 text-outline mx-auto mb-4" />
             <h3 className="text-xl font-bold text-on-surface mb-2">No Records Published Yet</h3>
             <p className="text-on-surface-variant max-w-md mx-auto">Articles for The Public Record will appear here once they are published from the CMS.</p>
           </div>
        ) : (
          <>
            {/* Featured Quote */}
            <section className="bg-surface-bright border-2 border-orange-900/20 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
              <Quote className="absolute top-4 sm:top-10 right-6 sm:right-10 w-24 sm:w-40 h-24 sm:h-40 text-orange-900/5 rotate-12 -z-0" />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                {/* Main Quote Column */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-between min-w-0">
                  <div>
                    <span className="text-xs font-mono font-bold text-orange-900 uppercase tracking-wider bg-orange-100 px-3 py-1 rounded-full mb-6 inline-flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5" />
                      ON THE RECORD • {currentRecord.publishedAt}
                    </span>
                    
                    <blockquote className="mt-4 mb-8">
                      <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif text-on-surface leading-tight text-balance">
                        "{currentRecord.quote}"
                      </p>
                    </blockquote>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-outline-variant/60">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant shrink-0">
                        <UserCheck className="w-5 h-5 text-on-surface-variant" />
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-lg leading-none">{currentRecord.speakerName}</p>
                        <p className="text-sm font-medium text-on-surface-variant mt-1">
                          {[currentRecord.speakerPosition, currentRecord.speakerInstitution].filter(Boolean).join(' • ') || currentRecord.speakerTitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Column within the Block Card */}
                <div className="lg:col-span-5 xl:col-span-4 bg-surface-container-low/80 rounded-2xl p-6 border border-outline-variant/60 space-y-6 min-w-0 w-full">
                  {/* Context Section */}
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-orange-950 dark:text-orange-300 flex items-center gap-2 pb-2.5 border-b border-outline-variant/60 mb-3">
                      <BookOpen className="w-3.5 h-3.5 text-orange-800 dark:text-orange-400" />
                      Context
                    </h4>
                    <RichContentRenderer 
                      content={currentRecord.content || currentRecord.context || currentRecord.whyItMatters || currentRecord.excerpt}
                      fallbackText="No additional context has been provided for this public record statement."
                      className="text-xs sm:text-sm leading-relaxed text-on-surface"
                    />
                  </div>

                  {/* Setting Section */}
                  <div className="pt-4 border-t border-outline-variant/60">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-orange-950 dark:text-orange-300 flex items-center gap-2 pb-2.5 border-b border-outline-variant/60 mb-3">
                      <Landmark className="w-3.5 h-3.5 text-orange-800 dark:text-orange-400" />
                      Setting & Details
                    </h4>
                    
                    <div className="space-y-3 text-xs">
                      {currentRecord.speakerSetting && (
                        <div className="flex items-start gap-2 text-on-surface">
                          <MapPin className="w-3.5 h-3.5 text-orange-800 dark:text-orange-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-mono text-[10px] uppercase text-on-surface-variant block">Setting / Venue</span>
                            <span className="font-medium text-on-surface">{currentRecord.speakerSetting}</span>
                          </div>
                        </div>
                      )}

                      {(currentRecord.speakerInstitution || currentRecord.speakerPosition) && (
                        <div className="flex items-start gap-2 text-on-surface">
                          <Landmark className="w-3.5 h-3.5 text-orange-800 dark:text-orange-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-mono text-[10px] uppercase text-on-surface-variant block">Institution / Role</span>
                            <span className="font-medium text-on-surface">
                              {[currentRecord.speakerInstitution, currentRecord.speakerPosition].filter(Boolean).join(' • ')}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold pt-1">
                        <Shield className="w-3.5 h-3.5 shrink-0" />
                        <span>Verified Public Statement</span>
                      </div>

                      {(currentRecord.relatedLinkUrl || currentRecord.supportingSourceUrl) && (
                        <div className="pt-2">
                          <a
                            href={currentRecord.relatedLinkUrl || currentRecord.supportingSourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-between w-full gap-2 text-[11px] font-mono font-bold text-primary hover:underline bg-surface-container px-3 py-2 rounded-xl border border-outline-variant/60"
                          >
                            <span className="truncate">{currentRecord.relatedLinkTitle || currentRecord.supportingSourceTitle || 'Official Source Reference'}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Side-by-Side: Archive & Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Main Content Column */}
              <div className="lg:col-span-8">
                {previousRecords.length > 0 && (
                  <section className="bg-surface-bright border border-outline-variant rounded-2xl p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8 pb-3 border-b border-outline-variant">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-bold font-serif text-on-surface uppercase tracking-wide">
                          Public Record Ledger
                        </h2>
                      </div>
                      <Link
                        to="/archive?category=the-public-record"
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-wider"
                      >
                        Ledger Archive <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    <div className="space-y-6">
                      {previousRecords.map((item) => (
                        <div key={item.id} className="group bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/60 rounded-xl p-5 transition-all relative overflow-hidden">
                          <Quote className="absolute top-4 right-4 w-12 h-12 text-surface-container-high rotate-12 -z-0" />
                          
                          <div className="relative z-10">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-outline-variant/40">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold text-orange-900 uppercase tracking-wider">
                                  {item.publishedAt}
                                </span>
                              </div>
                              <span className="text-[10px] text-on-surface-variant font-medium bg-surface px-2 py-0.5 rounded">
                                {item.speakerSetting || item.speakerInstitution}
                              </span>
                            </div>
                            
                            <blockquote className="mb-4">
                              <p className="text-base sm:text-lg font-serif font-bold text-on-surface leading-snug group-hover:text-orange-950 transition-colors">
                                "{item.quote}"
                              </p>
                            </blockquote>

                            <div className="flex items-center gap-3 mt-4">
                              <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant shrink-0">
                                <UserCheck className="w-3.5 h-3.5 text-on-surface-variant" />
                              </div>
                              <div>
                                <p className="font-bold text-on-surface text-sm leading-none">{item.speakerName}</p>
                                <p className="text-[11px] text-on-surface-variant mt-0.5">{item.speakerTitle || item.speakerPosition}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Sidebar Column */}
              <div className="lg:col-span-4">
                <ClearPathDailySidebar
                  currentDate={currentRecord.publishedAt || ''}
                  currentSectionSlug="the-public-record"
                  articleTitleOrSubject={currentRecord.speakerName}
                />
              </div>
            </div>
          </>
        )}

        {/* Evidence from Athena */}
        <AthenaEvidenceCard article={currentRecord} />
      </main>

      <SubscriptionSection />
    </div>
  );
}
