import { Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { 
  collection, 
  getDoc, 
  getDocs, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SiteSettings, Post, Programme, Episode } from '../types';

export default function Home() {
  const playerRef = useRef<any>(null);

  // Dynamic config states
  const [heroVideoId, setHeroVideoId] = useState<string>('3H95x0BV9nA');
  const [heroStart, setHeroStart] = useState<number>(14);
  const [heroEnd, setHeroEnd] = useState<number>(21);
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);

  // Core content states from Firestore
  const [todayBriefing, setTodayBriefing] = useState<Post | null>(null);
  const [latestFeed, setLatestFeed] = useState<any[]>([]);
  const [activeProgrammes, setActiveProgrammes] = useState<Programme[]>([]);

  // 1. Fetch backend configurations
  useEffect(() => {
    async function loadHomepageData() {
      try {
        // Fetch Settings
        const settingsSnap = await getDoc(doc(db, 'siteSettings', 'primary'));
        let config: SiteSettings | null = null;
        if (settingsSnap.exists()) {
          config = settingsSnap.data() as SiteSettings;
          setHeroVideoId(config.heroVideoId);
          setHeroStart(config.heroStart);
          setHeroEnd(config.heroEnd);
        }
        setSettingsLoaded(true);

        // Fetch Today's Briefing
        if (config?.latestBriefingId) {
          const briefingSnap = await getDoc(doc(db, 'posts', config.latestBriefingId));
          if (briefingSnap.exists()) {
            setTodayBriefing({ id: briefingSnap.id, ...briefingSnap.data() } as Post);
          }
        } else {
          // Default: Fetch latest published Briefing
          const q = query(
            collection(db, 'posts'),
            where('category', '==', 'Briefing'),
            where('publishStatus', '==', 'published'),
            orderBy('publishedAt', 'desc'),
            limit(1)
          );
          const snap = await getDocs(q);
          if (!snap.empty) {
            setTodayBriefing({ id: snap.docs[0].id, ...snap.docs[0].data() } as Post);
          }
        }

        // Fetch Latest Feed (combination of published posts and episodes up to 4 items)
        const postQuery = query(
          collection(db, 'posts'),
          where('publishStatus', '==', 'published'),
          orderBy('publishedAt', 'desc'),
          limit(4)
        );
        const postSnap = await getDocs(postQuery);
        const fetchedPosts = postSnap.docs.map(doc => ({
          tag: doc.data().category,
          title: doc.data().title,
          desc: doc.data().desc || '',
          date: doc.data().publishedAt,
          action: doc.data().category === 'Briefing' ? 'Watch' : 'Read',
          link: doc.data().category === 'Briefing' ? '/briefing' : '/explainers'
        }));

        if (fetchedPosts.length > 0) {
          setLatestFeed(fetchedPosts);
        }

        // Fetch Programmes
        const progSnap = await getDocs(collection(db, 'programmes'));
        const progList = progSnap.docs.map(doc => doc.data() as Programme);
        progList.sort((a,b) => (a.order || 0) - (b.order || 0));
        if (progList.length > 0) {
          setActiveProgrammes(progList.slice(0, 2));
        }
      } catch (err) {
        console.error('Error fetching homepage dynamic modules: ', err);
        setSettingsLoaded(true); // fall back to local templates
      }
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
  const renderedFeedList = latestFeed.length > 0 ? latestFeed : [
    { tag: 'Briefing', title: 'Understanding the week in Nigerian politics', desc: 'A breakdown of legislative maneuvers and executive actions shaping the political landscape this week.', date: 'Today', action: 'Watch', link: '/briefing' },
    { tag: 'Explainer', title: 'What election reform really means', desc: 'Examining the structural proposals and their potential impact on electoral integrity and representation.', date: 'Yesterday', action: 'Read', link: '/explainers' },
    { tag: 'Analysis', title: 'Nigeria’s regional security outlook', desc: 'Assessing border policies, transnational challenges, and the shifting dynamics of West African security.', date: 'Oct 12', action: 'Read', link: '/explainers' },
    { tag: 'Conversation', title: 'How power works across African institutions', desc: 'A long-form dialogue on institutional capacity, historical legacies, and modern governance.', date: 'Oct 10', action: 'Watch', link: '/programmes' }
  ];

  const renderedProgrammes = activeProgrammes.length > 0 ? activeProgrammes : [
    { title: 'Osita Insights', tag: 'Weekly Analysis', desc: 'A structured conversation with leaders and thinkers on judgment, responsibility, and national choices.', link: '/programmes/three-things' },
    { title: 'Daily Brief with Annabel', tag: 'Daily Overview', desc: 'A weekday briefing that helps professionals interpret events without chasing headlines.', link: '/briefing' }
  ];

  return (
    <div className="w-full flex-grow flex flex-col">
      <section className="relative w-full min-h-[80vh] flex items-center border-b border-outline-variant overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div 
            id="bg-player-element" 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] opacity-90 pointer-events-none"
          />
        </div>

        <div className="relative w-full px-margin-mobile md:px-margin-desktop py-unit-xl md:py-24 max-w-container-max mx-auto z-10 font-sans">
          <div className="max-w-3xl flex flex-col gap-unit-md">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-display-lg md:text-display-lg text-white">
              Clear context for public life.
            </h1>
            <p className="font-body-lg text-body-lg text-white/90 max-w-2xl mt-unit-sm">
              Clearpath Media is a public-intellectual platform explaining power, policy, elections, and society in Africa — calmly, clearly, and with evidence.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto border-b border-outline-variant">
        <div className="mb-unit-lg">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Today's Briefing</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            {todayBriefing ? todayBriefing.desc : "A calm, structured explanation of what matters today — and why."}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter items-start">
          <div className="flex flex-col gap-unit-md">
            <div className="aspect-video bg-surface-container-high rounded-xl border border-outline-variant relative overflow-hidden group">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${todayBriefing?.videoId || '3H95x0BV9nA'}?rel=0`} 
                title="Today's Briefing" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-unit-md mt-unit-sm">
              <button className="w-full sm:w-auto bg-primary text-white font-label-md text-label-md px-6 py-3 rounded hover:bg-primary-container transition-colors">
                Watch today's brief
              </button>
              <Link to="/briefing" className="w-full sm:w-auto border border-outline text-on-surface font-label-md text-label-md px-6 py-3 rounded hover:bg-surface-container transition-colors text-center">
                View all briefings
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-unit-md">
            {[
              { title: 'What happened', text: todayBriefing?.whatHappened || 'The core events and facts established, stripped of sensationalism.' },
              { title: 'Why it matters', text: todayBriefing?.whyItMatters || 'The context, structural implications, and underlying dynamics driving the story.' },
              { title: 'What to watch', text: todayBriefing?.whatToWatchNext || 'Key indicators and future developments to monitor as the situation evolves.' }
            ].map(item => (
              <div key={item.title} className="bg-surface border border-outline-variant rounded p-unit-lg hover:bg-surface-container-low transition-colors duration-300">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-sm">{item.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto border-b border-outline-variant">
        <div className="mb-unit-lg flex flex-col md:flex-row md:items-end justify-between gap-unit-md">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Latest from Clearpath</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              A curated selection of our most recent work across briefings, explainers, and programmes.
            </p>
          </div>
          <Link to="/programmes" className="font-label-md text-label-md text-surface-tint hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-unit-md">
          {renderedFeedList.map(item => (
            <div key={item.title} className="bg-surface border border-outline-variant rounded overflow-hidden flex flex-col hover:bg-surface-container-low transition-colors duration-300 group">
              <div className="aspect-[16/9] bg-surface-container-high relative">
                {item.thumbnail || item.videoId ? (
                  <img src={item.thumbnail || `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`} alt={item.title} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="p-unit-md flex flex-col flex-grow">
                <span className="font-label-sm text-label-sm text-surface-tint uppercase tracking-wider mb-unit-xs block">{item.tag}</span>
                <h3 className="font-body-lg text-body-lg font-semibold text-on-surface mb-unit-sm group-hover:text-surface-tint transition-colors line-clamp-2">{item.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant flex-grow line-clamp-3 mb-unit-md">
                  {item.desc}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-text-container">{item.date}</span>
                  <Link to={item.link} className="text-primary font-label-sm hover:underline">{item.action}</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto border-b border-outline-variant bg-surface-container-low">
        <div className="mb-unit-lg">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Our Programmes</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Clearpath publishes a limited set of programmes, each designed to serve a specific institutional purpose.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md max-w-4xl">
          {renderedProgrammes.map(prog => (
            <div key={prog.title} className="bg-surface border border-outline-variant rounded p-unit-lg flex flex-col">
              <h3 className="font-headline-md text-headline-md text-primary mb-unit-xs">{prog.title}</h3>
              <span className="font-label-sm text-on-surface-variant mb-unit-sm block">{prog.tag}</span>
              <p className="font-body-md text-on-surface-variant flex-grow mb-unit-md">{prog.desc}</p>
              <Link to={prog.link} className="text-primary font-label-md border border-primary px-4 py-2 rounded self-start hover:bg-primary/5 transition-colors uppercase tracking-wider text-xs font-bold">View Library</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto border-b border-outline-variant">
        <div className="mb-unit-lg flex flex-col md:flex-row justify-between items-end gap-unit-md">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">Explainers</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Clearpath builds long-term explanatory assets designed to be revisited, cited, and trusted.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-md">
          <div className="bg-surface border border-outline-variant rounded p-unit-xl flex flex-col items-center text-center">
            <h3 className="font-headline-md text-headline-md text-primary mb-unit-sm">Explaining Nigeria</h3>
            <p className="font-body-md text-on-surface-variant mb-unit-md text-balance">Foundational context on the systems, institutions, and dynamics that drive the nation.</p>
            <div className="flex flex-wrap gap-2 justify-center mb-unit-lg">
              {['Constitution', 'Economy', 'Federalism'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-surface-container-high rounded-full text-label-sm">{tag}</span>
              ))}
            </div>
            <Link to="/explainers" className="bg-primary text-white font-label-md px-6 py-3 rounded hover:bg-primary-container transition-colors mt-auto">Explore</Link>
          </div>
          <div className="bg-surface border border-outline-variant rounded p-unit-xl flex flex-col items-center text-center">
            <h3 className="font-headline-md text-headline-md text-primary mb-unit-sm">Explaining Africa</h3>
            <p className="font-body-md text-on-surface-variant mb-unit-md text-balance">Broad structural analysis of continental trends, regional bodies, and geopolitical positioning.</p>
            <div className="flex flex-wrap gap-2 justify-center mb-unit-lg">
              {['AfCFTA', 'AU', 'Security'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-surface-container-high rounded-full text-label-sm">{tag}</span>
              ))}
            </div>
            <Link to="/explainers" className="bg-primary text-white font-label-md px-6 py-3 rounded hover:bg-primary-container transition-colors mt-auto">Explore</Link>
          </div>
        </div>
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto border-b border-outline-variant">
        <div className="mb-unit-lg text-center max-w-3xl mx-auto">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-unit-md">Why Clearpath</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-unit-sm">
            Clearpath exists because serious ideas often fail to reach wider publics — not because they are weak, but because they are poorly explained.
          </p>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            We sit between journalism and academia, where public understanding is formed.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-unit-md">
          {['Evidence-led, not partisan', 'Calm, not performative', 'Selective, not exhaustive', 'Built for longevity, not virality'].map(text => (
            <div key={text} className="bg-surface-container-low p-unit-lg rounded border border-outline-variant/50 text-center flex items-center justify-center">
              <h4 className="font-headline-md text-lg font-bold text-on-surface">{text}</h4>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full px-margin-mobile md:px-margin-desktop py-unit-xl max-w-container-max mx-auto text-center">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-unit-md">Partner with Clearpath</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-unit-lg">
          Clearpath works with institutions that value trust, clarity, and public understanding.
        </p>
        <Link to="/partner" className="inline-block bg-primary text-white font-label-md text-label-md px-8 py-4 rounded hover:bg-primary-container transition-colors text-lg">
          Partner with Clearpath
        </Link>
      </section>
    </div>
  );
}
