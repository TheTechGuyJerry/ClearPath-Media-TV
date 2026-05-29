import { Play, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import JoinModal from '../components/JoinModal';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Programme } from '../types';

const fallbackProgrammes: Programme[] = [
  {
    id: 'three-things',
    tag: 'Conversations',
    title: 'Osita Insights',
    desc: 'A structured conversation with leaders and thinkers on judgment, responsibility, and national choices.',
    about: 'Each episode, Osita Chidoka invites a prominent leader to discuss three specific events or decisions that defined their public service and the lessons they offer for future generations.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG9UKkTBTJxrs0d89Z9THsm9d7HdnWdijMGia0urYSILrGjnBFjfSilnyT4Oc5m4QoBIqJ-EVppuRvCaBzLme6DsHM8LwXw89mms40fOwZVkQJkMaYck9XOxAh9mbR5JuoL65y2oCdx5x3haP0uBev3jW-HdVPXV-jiOcBbVV9VBBFhpQhHiMJiIgeuLSsYwYbzU_bFANePmutyYqlK7oMnynm60WgyG6pfsybx4z7bN3RcIoa4Smu-Vm9XntZA1ADTWNU94lfti0',
    meta: { Cadence: 'Twice Monthly', Format: 'Video Conversation', Audience: 'Policy Makers, Executives' },
    link: '/programmes/three-things', 
    linkText: 'Browse Episodes'
  },
  {
    id: 'daily-brief',
    tag: 'Briefings',
    title: 'Daily Brief with Annabel',
    desc: 'A weekday briefing that helps professionals interpret events without chasing headlines.',
    about: 'Annabel provides a high-level synthesis of economic data and policy shifts from across West Africa, delivered every morning for the busy professional.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj0sf1F6xFR6H3tbPIJPO_NYWyereW6LdnHUYz-S62krq0N-lI0KFfNNEMWcmcPVYBMQ487oKIJ5WTyDkMtu7VqlInld9PY0p_iGDAFpskRkHcarnEo0f98r8_Mp0IVtxc3Sk1YXbzQNmL1QtaWUWx7RCFWxaD1WLHSLnj7_XHTizqY8ztbb1R1WI8OXY9Hwdx0hkMrV9rLcSuXHEGAJcFN9xeAxubX7a-nYVdTEhDp99MUvwUxMnjs6BEXprW0Zoo980CBD029NM',
    meta: { Cadence: 'Weekdays', Format: 'Daily Briefing', Audience: 'Professionals, Investors' },
    link: '/briefing', 
    linkText: "Watch Today's Brief"
  },
  {
    id: 'insights',
    tag: 'Explainers',
    title: 'Clearpath Insights',
    desc: 'Short explainers translating complex issues into clear, accessible understanding.',
    about: 'Designed for quick consumption, these visualizations break down legislative frameworks and market mechanics into their core elements.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeVLfCZOkjr_JQENUSHEqAjqhImldkoM6cBFtd6kJTkVvkqB1Wimrga4uO8bi_9o4q2GmcCqB1tZpqAGmQIDwPAH8F1lATsZJfeSCzrP22T0Mv2CtXzMkU1DGrd-n6wkR98R2pOU2-Bb8CoSuXOnxE-hNYap6qMwXPYvq3mXGh3sJTwEcq8rY7kMo7yUwcqwWZwNzxRmrh1F0qf5DlX7GX2ydgVgid5wF-DMmmYl5Ww1R3BtPERjhBA8yz74JaCGuiCimtXXaGFjk',
    meta: { Cadence: 'Ongoing', Format: '60–120s Explainers', Audience: 'General Public, Students' },
    link: '/explainers/insights', 
    linkText: "View Library",
    comingSoon: true
  },
  {
    id: 'regional',
    tag: 'Regional Analysis',
    title: 'Nigeria & Neighbours',
    desc: 'Expert-led analysis of West Africa’s political economy, security, and regional dynamics.',
    about: 'A deep dive into cross-border trade, ECOWAS policy, and the shared challenges of the Sahel and West African corridor.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCekczUBLCFB6lq5I2gvlelgOGUlV_PjHErwqwwMcbyquNLM3p2s3hLsEpXrbqkRoYQBYhcGd9W0Gv42Z-tw-fcs1D-3Pnkb-aqVlij1KZAXXZLK19n0OUxLDza_wwK1O0u4weRrbSyMJWpXqleBJJvnd2yQ9j8HM7If_hNItWtAsdE-Yb73QpBmhWz185CLsHeF-foKoFWQOBb9ZEdxcJWQz8BKTCZpVmMZgdYHIpuOaX59WMxlkYdcG-qxL6v9y0jaGF22k3Wbk',
    meta: { Cadence: 'Weekly / Bi-weekly', Format: 'Expert Analysis', Audience: 'Diplomats, Regional Trade' },
    link: '/programmes/regional', 
    linkText: "Notify Me",
    comingSoon: true
  },
  {
    id: 'elections',
    tag: 'Elections',
    title: 'Election Matters',
    desc: 'Calm, evidence-led explanations of electoral systems, democratic norms, and reform debates.',
    about: 'Moving beyond horse-race politics to focus on the institutional integrity of the electoral process and democratic consolidation.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTFpfSZaJTgSWr90PENCkNKkxbwHIPO0OmFx4ixOb1ZH0QIicQXdmyljT6ATj5Ex_ezlkLUaPYaMxqBImwXQh8awDSGmFgs7Or3ImAj_9hKaHqXGMgcwzfSpVSnpMhbT8UFiGCemcd_9-G_yFeQrB2bWilSQkJ7IoDokDV6Nbw-PKrXpOAXlecaJIaKsZIISY2boe3c-l7DfVLnS3-ZlPZAPrM9UtISdm-dkUrZfUVV1Ske-MtAEwCww-vEz0ixhOcyDqOW12Ty7E',
    meta: { Cadence: 'Seasonal', Format: 'Deep-Dive Series', Audience: 'Civil Society, Voters' },
    link: '/programmes/election-matters', 
    linkText: "Notify Me",
    comingSoon: true
  },
  {
    id: 'mekaria',
    tag: 'Leadership',
    title: 'Mekaria Series',
    desc: 'Conversations exploring the intersection of culture, leadership, and public service.',
    about: 'In-depth interviews and discussions focused on the cultural frameworks that guide effective leadership in complex environments.',
    img: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=1200&auto=format&fit=crop',
    meta: { Cadence: 'Monthly', Format: 'Video Conversation', Audience: 'General Public, Practitioners' },
    link: '/programmes/mekaria-series', 
    linkText: "Notify Me",
    comingSoon: true
  }
];

export default function Programmes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programmesList, setProgrammesList] = useState<Programme[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Programmes');

  useEffect(() => {
    async function fetchProgrammes() {
      try {
        const snap = await getDocs(collection(db, 'programmes'));
        if (!snap.empty) {
          const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Programme));
          list.sort((a,b) => (a.order || 0) - (b.order || 0));
          setProgrammesList(list);
        } else {
          setProgrammesList(fallbackProgrammes);
        }
      } catch (e) {
        console.error('Error fetching programmes: ', e);
        setProgrammesList(fallbackProgrammes);
      }
    }
    fetchProgrammes();
  }, []);

  const categories = [
    'All Programmes',
    'Conversations',
    'Briefings',
    'Explainers',
    'Regional Analysis',
    'Elections',
    'Leadership'
  ];

  // Dynamic filter matching category tab labels
  const filteredProgrammes = selectedCategory === 'All Programmes' 
    ? programmesList 
    : programmesList.filter(p => p.tag.toLowerCase().includes(selectedCategory.split(' ')[0].toLowerCase()));

  return (
    <div className="w-full">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-unit-xl">
        <section className="mb-unit-xl max-w-3xl">
          <h1 className="font-display-lg text-display-lg text-primary mb-unit-sm">Programmes</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Clearpath publishes a deliberately limited number of programmes. Each has a defined purpose, audience, and cadence.</p>
        </section>
      </div>
      
      <div className="sticky top-20 bg-background/95 backdrop-blur z-40 border-b border-outline-variant mb-unit-xl">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <ul className="flex space-x-unit-lg py-4 overflow-x-auto no-scrollbar">
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

      <div className="space-y-unit-xl pb-unit-xl">
        {filteredProgrammes.map(prog => (
          <section key={prog.id} className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop border-b border-outline-variant pb-unit-xl last:border-0">
            <div className="grid lg:grid-cols-12 gap-gutter mb-unit-lg">
              <div className="lg:col-span-8">
                <div className="mb-unit-md relative">
                  {prog.comingSoon && (
                    <span className="absolute top-0 right-0 bg-secondary/10 text-secondary text-[11px] font-bold px-3 py-1 rounded-sm uppercase tracking-wider">
                      Coming Soon
                    </span>
                  )}
                  <span className="text-label-sm font-label-md uppercase tracking-wider text-primary mb-2 block">{prog.tag}</span>
                  <h2 className="font-display-lg text-headline-lg text-primary mb-unit-sm">{prog.title}</h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-unit-md">{prog.desc}</p>
                </div>

                {prog.comingSoon ? (
                  <div 
                    onClick={() => setIsModalOpen(true)}
                    className="aspect-[16/9] bg-surface-container-high flex flex-col items-center justify-center rounded-DEFAULT overflow-hidden relative group cursor-pointer border border-outline-variant mt-12 bg-gradient-to-b from-surface-container-low to-surface-container-high"
                  >
                    <img src={prog.img} alt={prog.title} className="w-full h-full object-cover opacity-30 grayscale group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white p-6 text-center">
                      <div className="w-16 h-16 bg-white/10 backdrop-blur text-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl">
                        <Bell className="w-6 h-6 animate-pulse" />
                      </div>
                      <span className="font-display-sm text-lg uppercase tracking-[0.2em] font-medium">Coming Soon</span>
                      <p className="text-xs text-white/80 mt-2 max-w-sm">This programme is currently in pre-production. Tap to subscribe and get notified on launch.</p>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-surface-container-highest flex items-center justify-center rounded-DEFAULT overflow-hidden relative group cursor-pointer border border-outline-variant mt-12">
                    <div className="absolute -top-10 left-0 text-label-sm font-label-md uppercase tracking-widest text-on-surface-variant">Latest Episode</div>
                    <img src={prog.img} alt={prog.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Link to={prog.link} className="w-20 h-20 bg-primary/90 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                        <Play className="w-10 h-10 fill-current ml-1 animate-pulse" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-4 flex flex-col justify-center">
                <div className="bg-surface-container-low p-unit-lg rounded-DEFAULT border border-outline-variant">
                  <h3 className="font-headline-md text-headline-md text-primary mb-4">About the Programme</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-6">{prog.about}</p>
                  <div className="space-y-4 border-t border-outline-variant pt-6">
                    {prog.meta && Object.entries(prog.meta).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="font-label-md text-on-surface-variant">{key}</span>
                        <span className="font-label-md text-primary font-semibold">{value as string}</span>
                      </div>
                    ))}
                  </div>

                  {prog.comingSoon ? (
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="mt-8 w-full bg-secondary text-white font-label-md py-4 rounded-DEFAULT hover:bg-secondary/90 transition-colors block text-center uppercase tracking-wide text-xs font-bold shadow-sm cursor-pointer"
                    >
                      Notify Me
                    </button>
                  ) : (
                    <Link to={prog.link} className="mt-8 w-full bg-primary text-white font-label-md py-4 rounded-DEFAULT hover:bg-primary-fixed-variant transition-colors block text-center uppercase tracking-wide text-xs font-bold shadow-sm">
                      {prog.linkText}
                    </Link>
                  )}

                  {!prog.comingSoon && (
                    <Link to={prog.link} className="mt-4 w-full border border-primary text-primary font-label-md py-4 rounded-DEFAULT hover:bg-surface-container-high transition-colors block text-center uppercase tracking-wider text-xs font-bold">
                      View Library
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
      
      <JoinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
