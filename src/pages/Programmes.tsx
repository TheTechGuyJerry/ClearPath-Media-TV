import { Play, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import JoinModal from '../components/JoinModal';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Programme } from '../types';
import {
  getActiveProgrammes,
  getPublishedProgrammeVideos,
  slugify,
  safeArray
} from '../services/publicContentService';
import SEO from '../components/SEO';

const fallbackProgrammes: Programme[] = [
  {
    id: 'osita-insights',
    title: 'Osita Insights',
    slug: 'osita-insights',
    tagline: 'Reflective national choices and leadership pathways.',
    shortDescription: 'A structured conversation on executive judgment, responsibility, and choices.',
    fullDescription: 'Osita Chidoka invites leading thinkers, public servants, and change agents to review the three critical decisions or milestones that shaped their leadership tenure.',
    hostName: 'Osita Chidoka',
    formatType: 'interview',
    coverageArea: 'Nigeria',
    topicFocus: ['governance', 'leadership'],
    scheduleText: 'Twice Monthly',
    youtubePlaylistUrl: '',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG9UKkTBTJxrs0d89Z9THsm9d7HdnWdijMGia0urYSILrGjnBFjfSilnyT4Oc5m4QoBIqJ-EVppuRvCaBzLme6DsHM8LwXw89mms40fOwZVkQJkMaYck9XOxAh9mbR5JuoL65y2oCdx5x3haP0uBev3jW-HdVPXV-jiOcBbVV9VBBFhpQhHiMJiIgeuLSsYwYbzU_bFANePmutyYqlK7oMnynm60WgyG6pfsybx4z7bN3RcIoa4Smu-Vm9XntZA1ADTWNU94lfti0',
    thumbnailImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG9UKkTBTJxrs0d89Z9THsm9d7HdnWdijMGia0urYSILrGjnBFjfSilnyT4Oc5m4QoBIqJ-EVppuRvCaBzLme6DsHM8LwXw89mms40fOwZVkQJkMaYck9XOxAh9mbR5JuoL65y2oCdx5x3haP0uBev3jW-HdVPXV-jiOcBbVV9VBBFhpQhHiMJiIgeuLSsYwYbzU_bFANePmutyYqlK7oMnynm60WgyG6pfsybx4z7bN3RcIoa4Smu-Vm9XntZA1ADTWNU94lfti0',
    status: 'active',
    isFeatured: true,
    sortOrder: 1,
    seoTitle: 'Osita Insights',
    seoDescription: 'Discussing civil leadership.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function Programmes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programmesList, setProgrammesList] = useState<Programme[]>([]);
  const [videoCounts, setVideoCounts] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All Programmes');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Diagnostics states
  const [diagProgrammes, setDiagProgrammes] = useState<number>(0);
  const [diagVideos, setDiagVideos] = useState<number>(0);
  const [diagSlugs, setDiagSlugs] = useState<string[]>([]);

  useEffect(() => {
    async function fetchProgrammes() {
      setLoading(true);
      setErrorStatus(null);
      
      const results = await Promise.allSettled([
        getActiveProgrammes(),
        getPublishedProgrammeVideos()
      ]);

      let programs: Programme[] = [];
      let videos: any[] = [];

      // Parse Programmes
      if (results[0].status === 'fulfilled') {
        const rawPrograms = safeArray(results[0].value);
        // Ensure no duplicates exist in state
        const uniquePrograms: Programme[] = [];
        const seenSlugs = new Set<string>();
        rawPrograms.forEach(p => {
          const key = (p.slug || slugify(p.title) || p.id || '').toLowerCase().trim();
          if (!seenSlugs.has(key)) {
            seenSlugs.add(key);
            uniquePrograms.push(p);
          }
        });
        programs = uniquePrograms;
        setProgrammesList(programs);
        setDiagProgrammes(programs.length);
        setDiagSlugs(programs.map(p => p.slug || slugify(p.title) || 'no-slug'));
      } else {
        console.error('[Diagnostics - Programmes] Failed loading programmes:', results[0].reason);
        setErrorStatus('Failed to load active programmes.');
        setProgrammesList(fallbackProgrammes);
        programs = fallbackProgrammes;
      }

      // Parse Videos
      if (results[1].status === 'fulfilled') {
        videos = safeArray(results[1].value);
        setDiagVideos(videos.length);
      } else {
        console.error('[Diagnostics - Programmes] Failed loading videos for counts:', results[1].reason);
      }

      // Safely aggregate video counts
      const counts: Record<string, number> = {};
      programs.forEach(prog => {
        counts[prog.id] = 0;
      });

      videos.forEach(video => {
        let matched = programs.find(p => p.id === video.programmeId || (p.slug && p.slug === video.programmeId));
        if (!matched && video.programmeTitle) {
          matched = programs.find(p => p.title && p.title.trim().toLowerCase() === video.programmeTitle.trim().toLowerCase());
        }
        if (!matched && video.programmeTitle) {
          matched = programs.find(p => slugify(p.title) === slugify(video.programmeTitle));
        }

        if (matched) {
          counts[matched.id] = (counts[matched.id] ?? 0) + 1;
        }
      });

      setVideoCounts(counts);
      setLoading(false);
    }
    fetchProgrammes();
  }, []);

  const categories = [
    'All Programmes',
    'Interview',
    'Daily Brief with Annabel',
    'Analysis',
    'Documentary',
    'Commentary'
  ];

  const filteredProgrammes = (Array.isArray(programmesList) ? (
    selectedCategory === 'All Programmes' 
      ? programmesList 
      : programmesList.filter(p => {
          const categoryClean = selectedCategory.toLowerCase().replace(/[^a-z0-9]/g, '');
          const formatTypeClean = (p.formatType || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const taglineClean = (p.tagline || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const titleClean = (p.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          
          return formatTypeClean.includes(categoryClean) || 
                 categoryClean.includes(formatTypeClean) ||
                 taglineClean.includes(categoryClean) ||
                 categoryClean.includes(taglineClean) ||
                 titleClean.includes(categoryClean) ||
                 categoryClean.includes(titleClean);
        })
  ) : []);

  return (
    <div className="w-full">
      <SEO 
        title="Programmes — Clearpath Media TV" 
        description="Explore Clearpath Media's series of structured programs on African policy, power, governance, and democratic accountability." 
      />
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-unit-xl">
        <section className="mb-unit-xl max-w-3xl">
          <h1 className="font-display-lg text-display-lg text-primary mb-unit-sm font-semibold">Programmes</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">Clearpath publishes a deliberately limited or structured selection of programs. Each has a clear focus, schedule, and targeted professional coverage.</p>
        </section>
      </div>
      
      <div className="sticky top-20 bg-background/95 backdrop-blur z-40 border-b border-outline-variant mb-unit-xl">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <ul className="flex space-x-unit-lg py-4 overflow-x-auto no-scrollbar font-sans font-medium text-xs">
            {categories.map(cat => {
              const isActive = selectedCategory === cat;
              return (
                <li key={cat}>
                  <button 
                    onClick={() => setSelectedCategory(cat)}
                    className={`font-label-md text-label-md pb-1 whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                      isActive ? 'text-primary border-primary font-bold' : 'text-on-surface-variant hover:text-primary border-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="space-y-unit-xl pb-unit-xl font-sans">
        {errorStatus && (
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
            <span>⚠️ Unable to load active programmes. Offline fallback preview is active.</span>
            <p className="text-xs opacity-80 mt-1">{errorStatus}</p>
          </div>
        )}

        {loading && programmesList.length === 0 ? (
          <div className="min-h-[200px] flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2"></div>
            <p className="text-xs text-on-surface-variant font-mono">Gathering programmes...</p>
          </div>
        ) : filteredProgrammes.length === 0 ? (
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop p-12 text-center text-on-surface-variant bg-surface-container-low rounded border border-outline-variant shadow-xs">
            No programmes available yet.
          </div>
        ) : (
          filteredProgrammes.map(prog => {
            const isComingSoon = prog.status === 'inactive' || !videoCounts[prog.id] || videoCounts[prog.id] === 0;
            return (
              <section key={prog.id} className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop border-b border-outline-variant pb-unit-xl last:border-0 last:pb-0">
              <div className="grid lg:grid-cols-12 gap-gutter mb-unit-lg">
                <div className="lg:col-span-8">
                  <div className="mb-unit-md relative">
                    {isComingSoon && (
                      <span className="absolute top-0 right-0 bg-secondary/10 text-secondary text-[11px] font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
                        Coming Soon
                      </span>
                    )}
                    <span className="text-label-sm font-label-md uppercase tracking-wider text-primary mb-2 block font-bold">{prog.tagline || 'SYSTEM SHOWS'}</span>
                    <h2 className="font-display-lg text-headline-lg text-primary mb-unit-sm font-bold">{prog.title}</h2>
                    <p className="font-body-lg text-body-lg text-on-surface-variant mb-unit-md leading-relaxed">{prog.shortDescription}</p>
                  </div>

                  {isComingSoon ? (
                    <div 
                      onClick={() => setIsModalOpen(true)}
                      className="aspect-[16/9] bg-surface-container-high flex flex-col items-center justify-center rounded overflow-hidden relative group cursor-pointer border border-outline-variant mt-12 bg-gradient-to-b from-surface-container-low to-surface-container-high"
                    >
                      <img src={prog.coverImage || prog.thumbnailImage} alt={prog.title} className="w-full h-full object-cover opacity-30 grayscale group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white p-6 text-center">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur text-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl">
                          <Bell className="w-6 h-6 animate-pulse" />
                        </div>
                        <span className="font-display-sm text-lg uppercase tracking-[0.2em] font-bold">Coming Soon</span>
                        <p className="text-xs text-white/80 mt-2 max-w-sm leading-relaxed">This programme is currently in pre-production. Tap to subscribe and get notified on launch.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-surface-container-highest flex items-center justify-center rounded overflow-hidden relative group cursor-pointer border border-outline-variant mt-12 animate-fade-in shadow-xs">
                      <div className="absolute -top-10 left-0 text-label-sm font-label-md uppercase tracking-widest text-on-surface-variant font-bold">Latest Release</div>
                      <img src={prog.coverImage || prog.thumbnailImage} alt={prog.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Link to={`/programmes/${prog.slug || slugify(prog.title)}`} className="w-20 h-20 bg-primary/90 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                          <Play className="w-10 h-10 fill-current ml-1 animate-pulse text-white" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="lg:col-span-4 flex flex-col justify-center">
                  <div className="bg-surface-container-low p-unit-lg rounded border border-outline-variant shadow-xs">
                    <h3 className="font-headline-md text-headline-md text-primary mb-4 font-semibold">About the Programme</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">{prog.fullDescription}</p>
                    <div className="space-y-4 border-t border-outline-variant pt-6 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-label-md text-on-surface-variant font-medium">Cadence</span>
                        <span className="font-label-md text-primary font-bold">{prog.scheduleText || 'Periodic'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-label-md text-on-surface-variant font-medium">Format</span>
                        <span className="font-label-md text-primary font-bold uppercase">{prog.formatType || 'Interview'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-label-md text-on-surface-variant font-medium">Coverage</span>
                        <span className="font-label-md text-primary font-bold">{prog.coverageArea || 'Nigeria'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-label-md text-on-surface-variant font-medium">Episodes</span>
                        <span className="font-label-md text-primary font-bold">{(videoCounts[prog.id] || 0)} published</span>
                      </div>
                    </div>

                    {isComingSoon ? (
                      <button 
                        onClick={() => setIsModalOpen(true)}
                        className="mt-8 w-full bg-secondary text-primary font-bold py-4 rounded hover:bg-secondary-container transition-colors block text-center uppercase tracking-wide text-xs shadow-sm cursor-pointer border border-primary/10"
                      >
                        Notify Me
                      </button>
                    ) : (
                      <Link to={`/programmes/${prog.slug || slugify(prog.title)}`} className="mt-8 w-full bg-primary text-white font-bold py-4 rounded hover:bg-primary-container transition-colors block text-center uppercase tracking-wide text-xs shadow-sm">
                        Browse Videos
                      </Link>
                    )}

                    {!isComingSoon && (
                      <Link to={`/programmes/${prog.slug || slugify(prog.title)}`} className="mt-4 w-full border border-primary text-primary font-bold py-4 rounded hover:bg-surface-container-high transition-colors block text-center uppercase tracking-wider text-xs">
                        View Library
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })
      )}
      </div>
      
      <JoinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Preview diagnostics block */}
      {(process.env.NODE_ENV !== 'production' || window.location.hostname.includes('run.app') || window.location.hostname.includes('localhost')) && (
        <div id="diagnostics-panel" className="bg-slate-900 text-green-400 font-mono text-xs p-6 border-t border-slate-800 w-full text-left select-text mt-12">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <h4 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-2 mb-2 uppercase tracking-wider">🔬 Preview Diagnostics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><span className="text-slate-500">programmes loaded:</span> <span className="font-semibold text-white">{diagProgrammes}</span></div>
              <div><span className="text-slate-500">videos loaded:</span> <span className="font-semibold text-white">{diagVideos}</span></div>
              <div><span className="text-slate-500">programme slugs:</span> <span className="font-semibold text-white">{(diagSlugs || []).join(', ')}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
