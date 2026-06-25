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
import { SiteSettings, Briefing, Programme, ProgrammeVideo } from '../types';
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
import SEO from '../components/SEO';
import ZohoSignupEmbed from '../components/ZohoSignupEmbed';

function getProgrammeImageUrl(p: Programme): string {
  if (p.cardImageUrl) return p.cardImageUrl;
  if (p.coverImageUrl) return p.coverImageUrl;
  if (p.thumbnailUrl) return p.thumbnailUrl;
  if (p.imageUrl) return p.imageUrl;
  if (p.latestVideoThumbnail) return p.latestVideoThumbnail;
  if (p.coverImage) return p.coverImage;
  if (p.thumbnailImage) return p.thumbnailImage;
  return 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj0sf1F6xFR6H3tbPIJPO_NYWyereW6LdnHUYz-S62krq0N-lI0KFfNNEMWcmcPVYBMQ487oKIJ5WTyDkMtu7VqlInld9PY0p_iGDAFpskRkHcarnEo0f98r8_Mp0IVtxc3Sk1YXbzQNmL1QtaWUWx7RCFWxaD1WLHSLnj7_XHTizqY8ztbb1R1WI8OXY9Hwdx0hkMrV9rLcSuXHEGAJcFN9xeAxubX7a-nYVdTEhDp99MUvwUxMnjs6BEXprW0Zoo980CBD029NM'; // Branded fallback
}

export default function Home() {
  const playerRef = useRef<any>(null);

  // Dynamic config states
  const [heroVideoId, setHeroVideoId] = useState<string>('3H95x0BV9nA');
  const [heroStart, setHeroStart] = useState<number>(14);
  const [heroEnd, setHeroEnd] = useState<number>(21);
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);

  // Lazy loading state for Today's Featured Video
  const [isFeaturedLoaded, setIsFeaturedLoaded] = useState<boolean>(false);
  const [isFeaturedPlayClicked, setIsFeaturedPlayClicked] = useState<boolean>(false);
  const featuredVideoRef = useRef<HTMLDivElement>(null);

  // Core content states from Firestore
  const [todayFeaturedVideo, setTodayFeaturedVideo] = useState<ProgrammeVideo | null>(null);
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
          const progTitle = safeText(video.programmeTitle, 'ClearPath Media');
          const videoProgSlug = getSlugFromTitleOrId(video.programmeId, progTitle, loadedProgrammes);
          
          return {
            tag: progTitle,
            title: safeText(video.title, 'Untitled video'),
            desc: safeText(video.shortSummary || video.fullDescription, ''),
            date: video.displayDate || formatFirestoreDate(video.publishedAt || video.createdAt, 'Recent'),
            action: 'Watch' as const,
            link: `/programmes/${videoProgSlug}`,
            thumbnail: video.thumbnailUrl || (video.youtubeVideoId ? `https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg` : ''),
            topicTags: safeArray(video.topicTags)
          };
        });
        setLatestFeed(mapped.slice(0, 4));

        // Today's Featured Programme Video Logic
        let featured: any = null;
        let isOverridden = false;

        const overrideVideoId = siteSettingsConfig?.overrideFeaturedVideoId;
        const overrideUntilStr = siteSettingsConfig?.overrideFeaturedUntil;

        if (overrideVideoId && overrideUntilStr) {
          const now = new Date();
          const untilDate = new Date(overrideUntilStr);
          if (now < untilDate) {
            const matchedOverride = loadedVideos.find((v: any) => v.id === overrideVideoId || v.youtubeVideoId === overrideVideoId);
            if (matchedOverride) {
              featured = matchedOverride;
              isOverridden = true;
            }
          }
        }

        if (!isOverridden) {
          const filteredForFeatured = loadedVideos.filter((video: any) => {
            return video.status === 'published' &&
                   video.hiddenFromPublic !== true &&
                   video.needsUrl !== true &&
                   video.youtubeVideoId;
          });

          const getDateVal = (item: any, key: string) => {
            if (key === 'sortDate' && item.displayDate) {
              const parsed = Date.parse(item.displayDate);
              if (!isNaN(parsed)) return parsed;
            }
            const val = item[key];
            if (!val) return 0;
            if (val.seconds) return val.seconds * 1000;
            const parsed = Date.parse(val);
            return isNaN(parsed) ? 0 : parsed;
          };

          filteredForFeatured.sort((a: any, b: any) => {
            const sortDateA = getDateVal(a, 'sortDate');
            const sortDateB = getDateVal(b, 'sortDate');
            if (sortDateA !== sortDateB) return sortDateB - sortDateA;

            const pubA = getDateVal(a, 'publishedAt');
            const pubB = getDateVal(b, 'publishedAt');
            if (pubA !== pubB) return pubB - pubA;

            const createA = getDateVal(a, 'createdAt');
            const createB = getDateVal(b, 'createdAt');
            return createB - createA;
          });

          featured = filteredForFeatured[0] || null;
        }

        setTodayFeaturedVideo(featured);
      } else {
        console.error('[Diagnostics - Home] Videos Load Error: ', results[3].reason);
        setDiagError(prev => (prev ? prev + '; ' : '') + 'Videos load error');
      }

      // 5. Briefings result (Client-side fail-safe logic skipped for Featured display)
      const isProgActive = (p: Programme) => p.status === 'active' || p.isActive === true;
      const activeProgsOnly = loadedProgrammes.filter(isProgActive);
      
      activeProgsOnly.sort((a, b) => {
        const sortA = a.sortOrder !== undefined && a.sortOrder !== null ? Number(a.sortOrder) : 999;
        const sortB = b.sortOrder !== undefined && b.sortOrder !== null ? Number(b.sortOrder) : 999;
        if (sortA !== sortB) return sortA - sortB;
        
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (timeA !== timeB) return timeA - timeB;
        
        return (a.title || '').localeCompare(b.title || '');
      });

      const activeWithVideos = activeProgsOnly.map(prog => {
        const filteredVideos = loadedVideos.filter(video => {
          const belongsToProg = video.programmeId === prog.id || 
                                video.programmeId === prog.slug || 
                                (video.programmeTitle && prog.title && video.programmeTitle.trim().toLowerCase() === prog.title.trim().toLowerCase());
          const isPublished = video.status === 'published';
          const notHidden = video.hiddenFromPublic !== true;
          const noNeedUrl = video.needsUrl !== true;
          return belongsToProg && isPublished && notHidden && noNeedUrl;
        });

        let latestVideo: ProgrammeVideo | null = null;
        if (filteredVideos.length > 0) {
          const getDateVal = (item: any, key: string) => {
            if (key === 'sortDate' && item.displayDate) {
              const parsed = Date.parse(item.displayDate);
              if (!isNaN(parsed)) return parsed;
            }
            const val = item[key];
            if (!val) return 0;
            if (val.seconds) return val.seconds * 1000;
            const parsed = Date.parse(val);
            return isNaN(parsed) ? 0 : parsed;
          };

          filteredVideos.sort((a: any, b: any) => {
            const sortDateA = getDateVal(a, 'sortDate');
            const sortDateB = getDateVal(b, 'sortDate');
            if (sortDateA !== sortDateB) return sortDateB - sortDateA;

            const pubA = getDateVal(a, 'publishedAt');
            const pubB = getDateVal(b, 'publishedAt');
            if (pubA !== pubB) return pubB - pubA;

            const createA = getDateVal(a, 'createdAt');
            const createB = getDateVal(b, 'createdAt');
            return createB - createA;
          });
          latestVideo = filteredVideos[0];
        }

        return {
          ...prog,
          latestVideoTitle: latestVideo ? latestVideo.title : undefined,
          latestVideoThumbnail: latestVideo ? latestVideo.thumbnailUrl || (latestVideo.youtubeVideoId ? `https://img.youtube.com/vi/${latestVideo.youtubeVideoId}/hqdefault.jpg` : '') : undefined
        };
      }).filter(prog => prog.latestVideoTitle !== undefined);

      setActiveProgrammes(activeWithVideos);
      setLoading(false);
    }

    loadHomepageData();
  }, []);

  // IntersectionObserver to lazy load "Today's Featured" video iframe
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsFeaturedLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsFeaturedLoaded(true);
          observer.disconnect();
        }
      },
      { rootMargin: '250px' } // Pre-trigger 250px before screen exposure
    );

    if (featuredVideoRef.current) {
      observer.observe(featuredVideoRef.current);
    }

    return () => {
      observer.disconnect();
    };
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

  // Render fallbacks for Today's Featured Video
  const fallbackVideo: any = {
    title: "Election Matters Episode 1: INEC, Civic Structures and National Governance",
    programmeTitle: "Election Matters",
    publishedAt: new Date().toISOString(),
    displayDate: "Recent",
    shortSummary: "Exploring constitutional designs, public accountability, and the operational logistics of West African democratic processes.",
    youtubeVideoId: "3H95x0BV9nA",
  };

  const featuredVideo = todayFeaturedVideo || fallbackVideo;

  const featuredPoints = featuredVideo?.keyPoints
    ? String(featuredVideo.keyPoints).split('\n').map(p => p.trim()).filter(Boolean)
    : [];

  const featBlock1 = featuredPoints[0] || featuredVideo?.shortSummary || 'The core events and facts established, stripped of sensationalism.';
  const featBlock2 = featuredPoints[1] || 'The context, structural implications, and underlying dynamics driving the story.';
  const featBlock3 = featuredPoints[2] || 'Key indicators and future developments to monitor as the situation evolves.';

  return (
    <div className="w-full flex-grow flex flex-col font-sans">
      <SEO />
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
              ClearPath Media TV is a public-intellectual media platform focused on Nigeria and West Africa. We explain elections, governance, and political risk through evidence-based analysis for serious audiences. Intelligence, not advocacy.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto border-b border-outline-variant">
        <div className="mb-unit-lg">
          <h2 className="font-headline-lg text-3xl font-bold text-primary mb-2">Today's Featured</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter items-start">
          <div className="flex flex-col gap-unit-md">
            <div 
              ref={featuredVideoRef}
              className="aspect-video bg-surface-container-high rounded-xl border border-outline-variant relative overflow-hidden shadow-sm group cursor-pointer"
              onClick={() => setIsFeaturedPlayClicked(true)}
            >
              {isFeaturedPlayClicked ? (
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${featuredVideo?.youtubeVideoId || '3H95x0BV9nA'}?rel=0&autoplay=1`} 
                  title={featuredVideo?.title || "Today's Featured Video"} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              ) : (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-900">
                  <img 
                    src={featuredVideo?.thumbnailUrl || `https://img.youtube.com/vi/${featuredVideo?.youtubeVideoId || '3H95x0BV9nA'}/hqdefault.jpg`} 
                    alt={featuredVideo?.title} 
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/25" />
                  <div className="w-16 h-16 bg-white/15 backdrop-blur-md text-white rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-300 shadow-xl relative z-10">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </div>
              )}
            </div>

            {featuredVideo ? (
              <div className="mt-2 font-sans">
                <span className="block font-display font-bold text-xl text-slate-900 leading-tight mb-2">
                  {featuredVideo?.title}
                </span>
                <span className="flex flex-wrap items-center gap-2 text-sm text-primary font-bold tracking-wide uppercase">
                  <span>{featuredVideo.programmeTitle || 'ClearPath Media'}</span>
                  <span className="text-secondary">•</span>
                  <span className="text-on-surface-variant font-normal font-mono normal-case">{featuredVideo.displayDate || formatFirestoreDate(featuredVideo.publishedAt) || 'Recent'}</span>
                </span>
              </div>
            ) : null}

            <div className="flex flex-col sm:flex-row items-center gap-unit-md mt-2">
              <Link to={`/programmes/${slugify(featuredVideo?.programmeTitle || 'election-matters')}`} className="w-full sm:w-auto bg-primary text-white font-bold text-xs uppercase px-8 py-4 rounded hover:bg-primary-container transition-colors text-center tracking-wider shadow-sm">
                Watch full series
              </Link>
              <Link to="/programmes" className="w-full sm:w-auto border border-outline text-on-surface font-bold text-xs uppercase px-8 py-4 rounded hover:bg-surface-container transition-colors text-center tracking-wider">
                View all programmes
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-unit-md">
            {[
              { title: 'Overview', text: featBlock1.replace(/^- /, '') },
              { title: 'The context', text: featBlock2.replace(/^- /, '') },
              { title: 'What to monitor next', text: featBlock3.replace(/^- /, '') }
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
            ClearPath publishes a limited set of programmes, each designed to serve a specific institutional purpose.
          </p>
        </div>
      {renderedProgrammes.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant bg-surface-container-low rounded border border-outline-variant max-w-4xl">
            No programmes available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-unit-md w-full">
            {renderedProgrammes.map(prog => {
              const imageUrl = getProgrammeImageUrl(prog);
              return (
                <div key={prog.id} className="bg-white border border-outline-variant rounded overflow-hidden flex flex-col hover:bg-surface-container-low transition-all duration-300 group shadow-xs">
                  <div className="aspect-[16/10] bg-surface-container-high relative overflow-hidden flex-shrink-0">
                    <img 
                      src={imageUrl} 
                      alt={prog.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                  <div className="p-unit-lg flex flex-col flex-grow text-left">
                    <span className="font-label-sm text-xs font-bold text-primary uppercase tracking-wider mb-unit-xs block">{prog.tagline || 'Governance Overview'}</span>
                    <h3 className="font-headline-md text-xl font-bold text-on-surface mb-unit-sm group-hover:text-primary transition-colors leading-tight">{prog.title}</h3>
                    <p className="font-body-md text-sm text-on-surface-variant flex-grow mb-unit-md leading-relaxed line-clamp-3">{prog.shortDescription}</p>
                    
                    {prog.latestVideoTitle && (
                      <div className="bg-slate-50 border border-slate-100/80 rounded p-3 mb-unit-md text-left text-xs animate-fade-in mt-auto">
                        <span className="block text-[10px] uppercase font-bold text-primary tracking-wider mb-1">Latest Episode</span>
                        <span className="font-semibold text-slate-800 line-clamp-1">{prog.latestVideoTitle}</span>
                      </div>
                    )}

                    <Link to={`/programmes/${prog.slug || slugify(prog.title)}`} className="text-center text-primary font-bold border border-primary px-5 py-2.5 rounded hover:bg-primary/5 transition-colors uppercase tracking-wider text-xs w-full mt-2">View Library</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto border-b border-outline-variant">
        <div className="mb-unit-lg flex flex-col md:flex-row justify-between items-end gap-unit-md">
          <div>
            <h2 className="font-headline-lg text-3xl font-bold text-primary mb-2">Explainers</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
              ClearPath builds long-term explanatory assets designed to be revisited, cited, and trusted.
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
          <h2 className="font-headline-lg text-3xl font-bold text-primary mb-unit-md">Why ClearPath</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-unit-sm leading-relaxed">
            ClearPath exists because serious ideas often fail to reach wider publics — not because they are weak, but because they are poorly explained.
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
        <h2 className="font-headline-lg text-3xl font-bold text-primary mb-unit-md">Partner with ClearPath</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-unit-lg leading-relaxed">
          ClearPath works with institutions that value trust, clarity, and public understanding.
        </p>
        <Link to="/partner" className="inline-block bg-primary text-white font-bold px-8 py-4 rounded hover:bg-primary-container transition-colors tracking-wide text-sm uppercase shadow-sm">
          Partner with ClearPath
        </Link>
      </section>

      {/* Zoho campaigns newsletter embed */}
      <ZohoSignupEmbed />

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
