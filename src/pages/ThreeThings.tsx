import { Play, ArrowRight, Filter, Search, Clock, Users } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Programme, ProgrammeVideo } from '../types';
import {
  getProgrammeBySlug,
  getVideosForProgramme,
  safeArray,
  safeText,
  slugify
} from '../services/publicContentService';
import { formatFirestoreDate, renderSafe } from '../utils/formatters';
import SEO from '../components/SEO';
import ZohoSignupEmbed from '../components/ZohoSignupEmbed';
import LiteYouTube from '../components/LiteYouTube';

const fallbackProgramGrid: ProgrammeVideo[] = [
  {
    id: 'osit-1',
    programmeId: 'osita-insights',
    title: 'Executive Judgments and National Choices',
    slug: 'executive-judgments',
    shortSummary: 'Analyzing critical decision pathways in public systems.',
    fullDescription: 'Osita and experts deconstruct policy milestones and metrics.',
    youtubeUrl: 'https://www.youtube.com/watch?v=3H95x0BV9nA',
    youtubeVideoId: '3H95x0BV9nA',
    thumbnailUrl: 'https://img.youtube.com/vi/3H95x0BV9nA/maxresdefault.jpg',
    duration: '42:15',
    presenters: 'Osita Chidoka',
    guests: 'Director of Policy Reform',
    transcript: '',
    keyPoints: 'Revenue models are key',
    sourceLinks: 'https://clearpath.media',
    topicTags: ['POLICY', 'ECONOMY'],
    coverageArea: 'Nigeria',
    status: 'published',
    isFeatured: true,
    publishedAt: '2026-10-24',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

interface ThreeThingsProps {
  forcedSlug?: string;
}

export default function ThreeThings({ forcedSlug }: ThreeThingsProps = {}) {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const [searchParams] = useSearchParams();
  const [programme, setProgramme] = useState<Programme | null>(null);
  const [videos, setVideos] = useState<ProgrammeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Diagnostics states
  const [diagSlug, setDiagSlug] = useState<string>('');
  const [diagResolved, setDiagResolved] = useState<boolean>(false);
  const [diagProgrammeId, setDiagProgrammeId] = useState<string>('');
  const [diagVideosMatched, setDiagVideosMatched] = useState<number>(0);
  const [diagError, setDiagError] = useState<string | null>(null);

  // Active playing video
  const [activeVideoId, setActiveVideoId] = useState<string>('3H95x0BV9nA');
  const [activeTitle, setActiveTitle] = useState<string>('The Future of Central Banking');
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('search') || '');
  const playerSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const qUrl = searchParams.get('search');
    if (qUrl !== null) {
      setSearchTerm(qUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadDynamicProgrammeData() {
      setLoading(true);
      setErrorStatus(null);
      setDiagError(null);
      
      const progParam = forcedSlug || slug || id || '';
      setDiagSlug(progParam);

      if (!progParam) {
        setErrorStatus('No programme selected.');
        setLoading(false);
        return;
      }

      console.log(`[Diagnostics - UI Route Detail] Initializing detail page for slug/param: "${progParam}"`);
      
      try {
        const resolvedProg = await getProgrammeBySlug(progParam);
        if (resolvedProg) {
          setProgramme(resolvedProg);
          setDiagResolved(true);
          setDiagProgrammeId(resolvedProg.id);

          const matchedVideos = await getVideosForProgramme(resolvedProg);
          
          // Apply safety defaults to video elements
          const formattedVideos = safeArray(matchedVideos).map((video: any) => ({
            ...video,
            title: renderSafe(video.title, 'Untitled video'),
            youtubeVideoId: renderSafe(video.youtubeVideoId, '3H95x0BV9nA'),
            shortSummary: renderSafe(video.shortSummary, ''),
            topicTags: safeArray(video.topicTags),
            publishedAtLabel: video.displayDate || formatFirestoreDate(video.publishedAt || video.createdAt, 'Recent')
          }));

          setVideos(formattedVideos);
          setDiagVideosMatched(formattedVideos.length);

          if (formattedVideos.length > 0 && formattedVideos[0]?.youtubeVideoId) {
            setActiveVideoId(formattedVideos[0].youtubeVideoId);
            setActiveTitle(formattedVideos[0].title);
          } else {
            setActiveVideoId('');
            setActiveTitle('');
          }
        } else {
          setProgramme(null);
          setDiagResolved(false);
          setVideos([]);
          setActiveVideoId('');
          setActiveTitle('');
          console.warn(`[Diagnostics - Detail] Programme slug matching failed for param "${progParam}".`);
        }
      } catch (generalErr: any) {
        console.error('[Diagnostics - Detail] Broad exception in loadDynamicProgrammeData:', generalErr);
        const errMsg = generalErr?.message || String(generalErr);
        setErrorStatus(errMsg);
        setDiagError(errMsg);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    }
    loadDynamicProgrammeData();
  }, [slug, id]);

  const selectEpisodeForPlayback = (vidId: string, titleName: string) => {
    setActiveVideoId(vidId);
    setActiveTitle(titleName);
    if (playerSectionRef.current) {
      playerSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const filteredEpisodes = (Array.isArray(videos) ? videos : []).filter(v => 
    (v.title || '').toLowerCase().includes((searchTerm || '').toLowerCase()) || 
    (v.guests && v.guests.toLowerCase().includes((searchTerm || '').toLowerCase())) ||
    (v.shortSummary && v.shortSummary.toLowerCase().includes((searchTerm || '').toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-sans pr-margin-desktop">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          <p className="text-sm font-semibold text-primary">Fetching videos...</p>
        </div>
      </div>
    );
  }

  if (!programme) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center font-sans pr-margin-desktop py-unit-xl">
        <div className="text-center max-w-md mx-auto px-margin-mobile">
          <h2 className="text-2xl font-bold text-primary mb-3">Programme Not Found</h2>
          <p className="text-body-md text-on-surface-variant mb-6">
            We couldn't load the requested programme. It may have been renamed or archived.
          </p>
          <Link to="/" className="inline-flex bg-primary text-white px-6 py-2.5 rounded hover:bg-primary-container font-semibold transition-all">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const shownProg: Programme = programme;
  const shouldShowComingSoon = shownProg.comingSoon === true || videos.length === 0;

  return (
    <div className="w-full">
      <SEO 
        title={shownProg.title} 
        description={shownProg.tagline || shownProg.shortDescription || shownProg.fullDescription}
        image={shownProg.coverImage}
      />
      <header className="mb-unit-xl border-b border-outline-variant pb-unit-lg px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto pt-unit-xl">
        <div className="max-w-[800px] font-sans">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary mb-unit-sm block font-bold">Programme Series</span>
          <h1 className="font-display-lg text-display-lg text-primary mb-unit-sm font-semibold">{shownProg.title}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[720px] leading-relaxed">
            {shownProg.tagline || 'System investigations.'}
          </p>
        </div>
      </header>

      <section ref={playerSectionRef} className="mb-unit-xl grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto font-sans">
        <div className="lg:col-span-8">
          {shouldShowComingSoon ? (
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-12 text-center">
              <h2 className="text-[28px] font-bold text-primary mb-3">
                {shownProg.comingSoonTitle || "Coming Soon"}
              </h2>
              <p className="text-body-md text-on-surface-variant max-w-md mx-auto leading-relaxed">
                {shownProg.comingSoonMessage || "This programme is being prepared. Check back soon for new ClearPath Media content."}
              </p>
            </div>
          ) : (
            <>
              {activeVideoId ? (
                <LiteYouTube videoId={activeVideoId} title={activeTitle} />
              ) : (
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-outline-variant shadow-sm group font-sans">
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container-high text-on-surface-variant p-6 text-center">
                    <Play className="w-12 h-12 text-outline/50 mb-3" />
                    <span className="font-semibold text-sm">No videos published for this programme yet</span>
                    <p className="text-xs text-outline mt-1">Please seed or approve discovered videos in the admin console first.</p>
                  </div>
                </div>
              )}
              <div className="mt-4 bg-white p-4 border rounded-lg shadow-xs font-sans">
                <h2 className="font-semibold text-lg text-primary">{activeTitle || 'No Video Available'}</h2>
                {activeVideoId && videos.find(v => v.youtubeVideoId === activeVideoId)?.fullDescription && (
                  <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">{videos.find(v => v.youtubeVideoId === activeVideoId)?.fullDescription}</p>
                )}
              </div>
            </>
          )}
        </div>

        <aside className="lg:col-span-4 space-y-unit-lg">
          <div className="p-unit-lg bg-surface-container-low border border-outline-variant rounded shadow-xs">
            <h3 className="font-headline-md text-[20px] text-primary mb-unit-sm font-semibold">About the Programme</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-unit-md leading-relaxed">
              {shownProg.fullDescription}
            </p>
            <div className="space-y-unit-sm pt-unit-md border-t border-outline-variant text-sm">
              <div className="flex justify-between items-center">
                <span className="font-label-md text-label-md text-on-surface-variant">Cadence</span>
                <span className="font-label-md text-label-md text-primary font-bold">{shownProg.scheduleText || 'Periodic'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-label-md text-label-md text-on-surface-variant">Format</span>
                <span className="font-label-md text-label-md text-primary font-bold uppercase">{shownProg.formatType || 'Video'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-label-md text-label-md text-on-surface-variant">Coverage</span>
                <span className="font-label-md text-label-md text-primary font-bold">{shownProg.coverageArea || 'Nigeria'}</span>
              </div>
            </div>
          </div>

          {shownProg.showAuthorCard !== false && (
            <div className="p-unit-lg border border-outline-variant bg-surface-container-low rounded-lg font-sans">
              <div className="flex items-center gap-unit-md mb-unit-md">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-primary/10 border border-primary/25 flex items-center justify-center">
                  {shownProg.authorImage ? (
                    <img 
                      src={shownProg.authorImage} 
                      alt={shownProg.authorName || 'Host'} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-primary font-bold text-lg">
                      {(shownProg.authorName || 'CP')
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md !text-lg font-bold text-primary">{shownProg.authorName || 'ClearPath Editorial Team'}</h3>
                  {shownProg.authorTitle && (
                    <p className="text-xs text-on-surface-variant/80 italic mt-0.5">{shownProg.authorTitle}</p>
                  )}
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant italic leading-relaxed">
                {shownProg.authorBio}
              </p>
              {shownProg.authorButtonText && shownProg.authorButtonUrl && (
                <div className="mt-4">
                  <a 
                    href={shownProg.authorButtonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline uppercase"
                  >
                    {shownProg.authorButtonText} <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}
        </aside>
      </section>

      {!shouldShowComingSoon && (
        <section className="mt-unit-xl px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto pb-unit-xl font-sans font-sans">
          <div className="flex flex-col md:flex-row justify-between items-end mb-unit-lg gap-unit-md">
            <h3 className="font-headline-lg text-headline-md text-primary border-l-4 border-primary pl-unit-sm font-semibold">Video Library</h3>
            <div className="flex flex-col sm:flex-row items-center gap-unit-sm w-full md:w-auto mt-unit-sm md:mt-0">
              <div className="relative flex-grow w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search index or topics..." 
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 border border-outline focus:border-primary focus:ring-0 rounded-sm text-body-md bg-transparent" 
                />
              </div>
            </div>
          </div>

          {filteredEpisodes.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant bg-surface-container-low rounded border border-outline-variant">
              No videos matches your search criteria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {filteredEpisodes.map((item, idx) => (
                <article key={idx} className={`group bg-white border p-unit-lg flex flex-col hover:border-primary transition-colors duration-300 rounded ${activeVideoId === item.youtubeVideoId ? 'border-primary ring-1 ring-primary' : 'border-outline-variant'}`}>
                  <div className="flex justify-between items-start mb-unit-sm">
                    <span className="font-label-sm text-label-sm text-outline font-mono text-xs">
                      {item.publishedAtLabel || formatFirestoreDate(item.publishedAt || item.createdAt, 'Recent')}
                    </span>
                  </div>
                  <h4 className="font-headline-md text-xl font-semibold text-primary mb-2 group-hover:text-primary-container transition-colors leading-snug">{item.title}</h4>
                  <p className="font-label-md text-label-md text-secondary mb-unit-md flex items-center gap-1.5 text-xs font-semibold"><Users className="w-3.5 h-3.5" /> {item.presenters || 'OsitaInsight'}</p>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-unit-lg flex-grow leading-relaxed">{item.shortSummary}</p>
                  <button 
                    onClick={() => selectEpisodeForPlayback(item.youtubeVideoId || '3H95x0BV9nA', item.title)}
                    className="w-full bg-primary text-white py-unit-sm font-label-md text-label-md flex items-center justify-center gap-unit-sm hover:bg-primary-container transition-colors uppercase tracking-wide cursor-pointer font-bold rounded text-xs py-3 mt-2"
                  >
                    WATCH VIDEO <ArrowRight className="w-4 h-4" />
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Zoho campaigns newsletter embed */}
      <ZohoSignupEmbed />

      {/* Preview diagnostics block */}
      {(process.env.NODE_ENV !== 'production' || window.location.hostname.includes('run.app') || window.location.hostname.includes('localhost')) && (
        <div id="diagnostics-panel" className="bg-slate-900 text-green-400 font-mono text-xs p-6 border-t border-slate-800 w-full text-left select-text mt-12">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <h4 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 mb-2 uppercase tracking-wider">🔬 Preview Diagnostics</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div><span className="text-slate-500">target slug:</span> <span className="font-semibold text-white">{diagSlug}</span></div>
              <div><span className="text-slate-500">programme resolved:</span> <span className="font-semibold text-white">{programme ? 'true' : 'false'}</span></div>
              <div><span className="text-slate-500">programme id:</span> <span className="font-semibold text-white">{shownProg.id || 'none'}</span></div>
              <div><span className="text-slate-500">videos matched:</span> <span className="font-semibold text-white">{videos.length}</span></div>
              <div><span className="text-slate-500">last error:</span> <span className={diagError ? "text-red-400 font-bold" : "text-green-400"}>{diagError || 'none'}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
