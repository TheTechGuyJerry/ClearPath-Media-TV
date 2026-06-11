import { Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { 
  collection, 
  getDoc, 
  getDocs, 
  doc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SiteSettings, Briefing, Programme } from '../types';
import {
  getActiveProgrammes,
  getActiveExplainers,
  getPublishedProgrammeVideos,
  safeArray,
  safeDate,
  safeText,
  slugify
} from '../services/publicContentService';
import { formatFirestoreDate, renderSafe } from '../utils/formatters';

export default function Home() {
  const playerRef = useRef<any>(null);

  // Dynamic config states
  const [heroVideoId, setHeroVideoId] = useState<string>('3H95x0BV9nA');
  const [heroStart, setHeroStart] = useState<number>(14);
  const [heroEnd, setHeroEnd] = useState<number>(21);
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);

  // Core content states from Firestore
  const [todayBriefing, setTodayBriefing] = useState<Briefing | null>(null);
  const [latestFeed, setLatestFeed] = useState<any[]>([]);
  const [activeProgrammes, setActiveProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Diagnostics states
  const [diagProgrammes, setDiagProgrammes] = useState<number>(0);
  const [diagExplainers, setDiagExplainers] = useState<number>(0);
  const [diagVideos, setDiagVideos] = useState<number>(0);
  const [diagError, setDiagError] = useState<string | null>(null);

  // Helper to resolve or fallback programmeSlug
  const getSlugFromTitleOrId = (programmeId: string | undefined, programmeTitle: string | undefined, programmesList: any[]): string => {
    if (programmeId) {
      const match = programmesList.find(p => p.id === programmeId || p.slug === programmeId);
      if (match?.slug) return match.slug;
    }
    if (programmeTitle) {
      const titleClean = programmeTitle.trim().toLowerCase();
      const match = programmesList.find(p => p.title && p.title.trim().toLowerCase() === titleClean);
      if (match?.slug) return match.slug;
      
      return slugify(programmeTitle);
    }
    return 'osita-insights';
  };

  // 1. Fetch backend configurations using robust sequential-failure-proof Promise.allSettled
  useEffect(() => {
    async function loadHomepageData() {
      setLoading(true);
      setErrorStatus(null);
      setDiagError(null);
      
      const results = await Promise.allSettled([
        getDoc(doc(db, 'siteSettings', 'primary')),
        getActiveProgrammes(),
        getActiveExplainers(),
        getPublishedProgrammeVideos(),
        getDocs(collection(db, 'briefings'))
      ]);

      let siteSettingsConfig: any = null;
      let loadedProgrammes: Programme[] = [];
      let loadedExplainersCount = 0;
      let loadedVideos: any[] = [];

      // 1. Settings result
      if (results[0].status === 'fulfilled') {
        const settingsSnap = results[0].value;
        if (settingsSnap.exists()) {
          siteSettingsConfig = settingsSnap.data();
          if (siteSettingsConfig.heroVideoId) setHeroVideoId(siteSettingsConfig.heroVideoId);
          if (siteSettingsConfig.heroStart) setHeroStart(Number(siteSettingsConfig.heroStart));
          if (siteSettingsConfig.heroEnd) setHeroEnd(Number(siteSettingsConfig.heroEnd));
        }
      } else {
        console.error('[Diagnostics - Home] Settings Load Error: ', results[0].reason);
        setDiagError(prev => (prev ? prev + '; ' : '') + 'Settings load error');
      }
      setSettingsLoaded(true);

      // 2. Programmes result
      if (results[1].status === 'fulfilled') {
        loadedProgrammes = safeArray(results[1].value);
        setActiveProgrammes(loadedProgrammes.slice(0, 2));
        setDiagProgrammes(loadedProgrammes.length);
      } else {
        console.error('[Diagnostics - Home] Programmes Load Error: ', results[1].reason);
        setDiagError(prev => (prev ? prev + '; ' : '') + 'Programmes load error');
      }

      // 3. Explainers result
      if (results[2].status === 'fulfilled') {
        const exps = safeArray(results[2].value);
        loadedExplainersCount = exps.length;
        setDiagExplainers(loadedExplainersCount);
      } else {
        console.error('[Diagnostics - Home] Explainers Load Error: ', results[2].reason);
        setDiagError(prev => (prev ? prev + '; ' : '') + 'Explainers load error');
      }

      // 4. Videos result
      if (results[3].status === 'fulfilled') {
        loadedVideos = safeArray(results[3].value);
        setDiagVideos(loadedVideos.length);
        
        const mapped = loadedVideos.map((video: any) => {
          const progTitle = safeText(video.programmeTitle, 'Clearpath Media');
          const videoProgSlug = getSlugFromTitleOrId(video.programmeId, progTitle, loadedProgrammes);
          
          return {
            tag: progTitle,
            title: safeText(video.title, 'Untitled video'),
            desc: safeText(video.shortSummary || video.fullDescription, ''),
            date: formatFirestoreDate(video.publishedAt || video.createdAt, 'Recent'),
            action: 'Watch' as const,
            link: `/programmes/${videoProgSlug}`,
            thumbnail: video.thumbnailUrl || (video.youtubeVideoId ? `https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg` : ''),
            topicTags: safeArray(video.topicTags)
          };
        });
        setLatestFeed(mapped.slice(0, 4));
      } else {
        console.error('[Diagnostics - Home] Videos Load Error: ', results[3].reason);
        setDiagError(prev => (prev ? prev + '; ' : '') + 'Videos load error');
      }

      // 5. Briefings result (Client-side fail-safe logic)
      if (results[4].status === 'fulfilled') {
        try {
          const briefingSnap = results[4].value;
          const briefings = briefingSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Briefing));
          const publishedBriefings = briefings.filter((b: any) => b.status === 'published');
          
          if (siteSettingsConfig?.featuredBriefingId) {
            const featured = briefings.find((b: any) => b.id === siteSettingsConfig.featuredBriefingId);
            if (featured) {
              setTodayBriefing(featured);
            } else {
              setTodayBriefing(publishedBriefings[0] || null);
            }
          } else {
            publishedBriefings.sort((a: any, b: any) => {
              const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
              const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
              return dateB - dateA;
            });
            setTodayBriefing(publishedBriefings[0] || null);
          }
        } catch (briefingErr) {
          console.error('[Diagnostics - Home] Parsing briefings list failed, proceeding safely:', briefingErr);
        }
      } else {
        console.error('[Diagnostics - Home] Briefing query getDocs failed: ', results[4].reason);
        setDiagError(prev => (prev ? prev + '; ' : '') + 'Briefing getDocs failed');
      }

      setLoading(false);
    }

    loadHomepageData();
  }, []);

  // 2. Play background loop once settings loaded or default used
  useEffect(() => {
    if (!settingsLoaded) return;

    // Dynamically insert YouTube IFrame API if not already present
    let tag = document.getElementById('youtube-iframe-api');
    if (!tag) {
      tag = document.createElement('script');
      tag.id = 'youtube-iframe-api';
      (tag as HTMLScriptElement).src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!(window as any).YT || !document.getElementById('bg-player-element')) return;
      playerRef.current = new (window as any).YT.Player('bg-player-element', {
        videoId: heroVideoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 0, // Manual looping via interval/events
          playlist: heroVideoId,
          start: heroStart,
          end: heroEnd,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          autohide: 1
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo();
            event.target.mute();
          },
          onStateChange: (event: any) => {
            if (event.data === (window as any).YT.PlayerState.ENDED) {
              event.target.seekTo(heroStart);
              event.target.playVideo();
            }
          }
        }
      });
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    } else {
      const prevCallback = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };
    }

    // High frequency interval to achieve seamless loop before YouTube native transitions can trigger or pause the screen
    const interval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        const currentTime = playerRef.current.getCurrentTime();
        const state = playerRef.current.getPlayerState();
        if (state === 1) { // 1 = playing
          if (currentTime >= (heroEnd - 0.2)) {
            playerRef.current.seekTo(heroStart);
          }
        }
      }
    }, 100);

    return () => {
       clearInterval(interval);
       if (playerRef.current && typeof playerRef.current.destroy === 'function') {
         playerRef.current.destroy();
       }
    };
  }, [settingsLoaded, heroVideoId, heroStart, heroEnd]);

  // Handle fallback lists
  const renderedFeedList = latestFeed;

  const renderedProgrammes = activeProgrammes;

  // Key blocks for Today's Briefing
  const points = todayBriefing?.keyPoints 
    ? todayBriefing.keyPoints.split('&#15;').flatMap(p => p.split('\n'))
    : [];

  const block1 = String(points[0] || 'The core events and facts established, stripped of sensationalism.');
  const block2 = String(points[1] || 'The context, structural implications, and underlying dynamics driving the story.');
  const block3 = String(points[2] || 'Key indicators and future developments to monitor as the situation evolves.');

  return (
    <div className="w-full flex-grow flex flex-col font-sans">
      <section className="relative w-full min-h-[80vh] flex items-center border-b border-outline-variant overflow-hidden bg-slate-950">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div 
            id="bg-player-element" 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] opacity-30 pointer-events-none"
          />
        </div>

        <div className="relative w-full px-margin-mobile md:px-margin-desktop py-unit-xl md:py-24 max-w-container-max mx-auto z-10">
          <div className="max-w-3xl flex flex-col gap-unit-md">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-5xl md:font-display-lg md:text-display-lg text-white font-bold leading-tight font-display tracking-tight">
              Clear context <br/>for public life.
            </h1>
            <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mt-unit-sm leading-relaxed">
              Clearpath Media is a public-intellectual platform explaining power, policy, elections, and society in Africa — calmly, clearly, and with evidence.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto border-b border-outline-variant">
        <div className="mb-unit-lg">
          <h2 className="font-headline-lg text-3xl font-bold text-primary mb-2">Today's Briefing</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            {todayBriefing ? todayBriefing.excerpt : "A calm, structured explanation of what matters today — and why."}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter items-start">
          <div className="flex flex-col gap-unit-md">
            <div className="aspect-video bg-surface-container-high rounded-xl border border-outline-variant relative overflow-hidden group shadow-sm">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${todayBriefing?.youtubeVideoId || '3H95x0BV9nA'}?rel=0`} 
                title="Today's Briefing" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-unit-md mt-unit-sm">
              <Link to="/briefing" className="w-full sm:w-auto bg-primary text-white font-bold text-xs uppercase px-8 py-4 rounded hover:bg-primary-container transition-colors text-center tracking-wider shadow-sm">
                Watch today's brief
              </Link>
              <Link to="/briefing" className="w-full sm:w-auto border border-outline text-on-surface font-bold text-xs uppercase px-8 py-4 rounded hover:bg-surface-container transition-colors text-center tracking-wider">
                View all briefings
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-unit-md">
            {[
              { title: 'What happened', text: block1.replace(/^- /, '') },
              { title: 'Why it matters', text: block2.replace(/^- /, '') },
              { title: 'What to watch next', text: block3.replace(/^- /, '') }
            ].map(item => (
              <div key={item.title} className="bg-white border border-outline-variant rounded p-unit-lg hover:bg-surface-container-low transition-colors duration-300 shadow-xs">
                <h3 className="font-headline-md text-headline-md text-primary font-bold mb-unit-sm text-base uppercase tracking-wider">{item.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto border-b border-outline-variant">
        <div className="mb-unit-lg flex flex-col md:flex-row md:items-end justify-between gap-unit-md">
          <div>
            <h2 className="font-headline-lg text-3xl font-bold text-primary mb-2">Latest releases</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Our most recent publications and updates from around the continent.
            </p>
          </div>
          <Link to="/programmes" className="font-label-md text-label-md text-primary hover:underline flex items-center gap-1 font-bold">
            View all <ArrowRight className="w-4 h-4 text-primary" />
          </Link>
        </div>
        {errorStatus && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm font-sans flex flex-col gap-1">
            <span className="font-semibold">⚠️ Unable to load live programme content. (Active Offline Fallback Enabled)</span>
            <span className="text-xs opacity-90">{errorStatus}</span>
          </div>
        )}
        {renderedFeedList.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant bg-surface-container-low rounded border border-outline-variant">
            No videos published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-unit-md">
            {renderedFeedList.map((item, idx) => (
              <div key={idx} className="bg-white border border-outline-variant rounded overflow-hidden flex flex-col hover:bg-surface-container-low transition-colors duration-300 group shadow-xs">
                <div className="aspect-[16/9] bg-surface-container-high relative overflow-hidden">
                  <img src={item.thumbnail || `https://img.youtube.com/vi/3H95x0BV9nA/hqdefault.jpg`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 animate-fade-in" referrerPolicy="no-referrer" />
                </div>
                <div className="p-unit-md flex flex-col flex-grow">
                  <span className="font-label-sm text-xs font-bold text-primary uppercase tracking-wider mb-unit-xs block">{item.tag}</span>
                  <h3 className="font-body-lg text-base font-bold text-on-surface mb-unit-sm group-hover:text-primary transition-colors line-clamp-2 leading-snug">{item.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant flex-grow line-clamp-3 mb-2 leading-relaxed text-sm">
                    {item.desc}
                  </p>
                  {Array.isArray(item.topicTags) && item.topicTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.topicTags.map((tag: string) => (
                        <span key={tag} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                    <span className="font-label-sm text-on-text-container font-medium text-gray-500">{renderSafe(item.date)}</span>
                    <Link to={item.link} className="text-primary font-bold hover:underline">Watch</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto border-b border-outline-variant bg-surface-container-low">
        <div className="mb-unit-lg">
          <h2 className="font-headline-lg text-3xl font-bold text-primary mb-2">Our Programmes</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Clearpath publishes a limited set of programmes, each designed to serve a specific institutional purpose.
          </p>
        </div>
      {renderedProgrammes.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant bg-surface-container-low rounded border border-outline-variant max-w-4xl">
            No programmes available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md max-w-4xl">
            {renderedProgrammes.map(prog => (
              <div key={prog.title} className="bg-white border border-outline-variant rounded p-unit-lg flex flex-col shadow-xs">
                <h3 className="font-headline-md text-xl font-bold text-primary mb-unit-xs">{prog.title}</h3>
                <span className="font-label-sm text-on-surface-variant text-xs uppercase tracking-wider font-semibold text-primary mb-unit-sm block">{prog.tagline || 'Governance Overview'}</span>
                <p className="font-body-md text-on-surface-variant flex-grow mb-unit-md leading-relaxed">{prog.shortDescription}</p>
                <Link to={`/programmes/${prog.slug}`} className="text-primary font-bold border border-primary px-5 py-2.5 rounded self-start hover:bg-primary/5 transition-colors uppercase tracking-wider text-xs">View Library</Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto border-b border-outline-variant">
        <div className="mb-unit-lg flex flex-col md:flex-row justify-between items-end gap-unit-md">
          <div>
            <h2 className="font-headline-lg text-3xl font-bold text-primary mb-2">Explainers</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Clearpath builds long-term explanatory assets designed to be revisited, cited, and trusted.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
          <div className="bg-white border border-outline-variant rounded p-unit-xl flex flex-col items-center text-center shadow-xs">
            <h3 className="font-headline-md text-2xl font-bold text-primary mb-unit-sm">Explaining Nigeria</h3>
            <p className="font-body-md text-on-surface-variant mb-unit-md text-balance leading-relaxed">Foundational context on the systems, institutions, and dynamics that drive the nation.</p>
            <div className="flex flex-wrap gap-2 justify-center mb-unit-lg">
              {['Constitution', 'Economy', 'Federalism'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-surface-container-high rounded text-xs font-semibold text-primary">{tag}</span>
              ))}
            </div>
            <Link to="/explainers" className="bg-primary text-white font-bold px-6 py-3.5 rounded hover:bg-primary-container transition-colors mt-auto text-xs uppercase tracking-wider shadow-sm">Explore</Link>
          </div>
          <div className="bg-white border border-outline-variant rounded p-unit-xl flex flex-col items-center text-center shadow-xs">
            <h3 className="font-headline-md text-2xl font-bold text-primary mb-unit-sm">Explaining Africa</h3>
            <p className="font-body-md text-on-surface-variant mb-unit-md text-balance leading-relaxed">Broad structural analysis of continental trends, regional bodies, and geopolitical positioning.</p>
            <div className="flex flex-wrap gap-2 justify-center mb-unit-lg">
              {['AfCFTA', 'AU', 'Security'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-surface-container-high rounded text-xs font-semibold text-primary">{tag}</span>
              ))}
            </div>
            <Link to="/explainers" className="bg-primary text-white font-bold px-6 py-3.5 rounded hover:bg-primary-container transition-colors mt-auto text-xs uppercase tracking-wider shadow-sm">Explore</Link>
          </div>
        </div>
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto border-b border-outline-variant">
        <div className="mb-unit-lg text-center max-w-3xl mx-auto">
          <h2 className="font-headline-lg text-3xl font-bold text-primary mb-unit-md">Why Clearpath</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-unit-sm leading-relaxed">
            Clearpath exists because serious ideas often fail to reach wider publics — not because they are weak, but because they are poorly explained.
          </p>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            We sit between journalism and academia, where public understanding is formed.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-unit-md">
          {['Evidence-led, not partisan', 'Calm, not performative', 'Selective, not exhaustive', 'Built for longevity, not virality'].map(text => (
            <div key={text} className="bg-surface-container-low p-unit-lg rounded border border-outline-variant/50 text-center flex items-center justify-center min-h-[80px]">
              <h4 className="font-headline-md text-sm font-bold text-primary uppercase tracking-wider">{text}</h4>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto text-center">
        <h2 className="font-headline-lg text-3xl font-bold text-primary mb-unit-md">Partner with Clearpath</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-unit-lg leading-relaxed">
          Clearpath works with institutions that value trust, clarity, and public understanding.
        </p>
        <Link to="/partner" className="inline-block bg-primary text-white font-bold px-8 py-4 rounded hover:bg-primary-container transition-colors tracking-wide text-sm uppercase shadow-sm">
          Partner with Clearpath
        </Link>
      </section>

      {/* Preview diagnostics block */}
      {(process.env.NODE_ENV !== 'production' || window.location.hostname.includes('run.app') || window.location.hostname.includes('localhost')) && (
        <div id="diagnostics-panel" className="bg-slate-900 text-green-400 font-mono text-xs p-6 border-t border-slate-800 w-full text-left select-text mt-12">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <h4 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 mb-2 uppercase tracking-wider">🔬 Preview Diagnostics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><span className="text-slate-500">programmes loaded:</span> <span className="font-semibold text-white">{diagProgrammes}</span></div>
              <div><span className="text-slate-500">explainers loaded:</span> <span className="font-semibold text-white">{diagExplainers}</span></div>
              <div><span className="text-slate-500">videos loaded:</span> <span className="font-semibold text-white">{diagVideos}</span></div>
              <div><span className="text-slate-500">last error:</span> <span className={diagError ? "text-red-400 font-bold" : "text-green-400"}>{diagError || 'none'}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
