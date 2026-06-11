import { Play, ArrowRight, Bell, Search, CheckCircle2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Briefing as BriefingType } from '../types';
import { formatFirestoreDate, renderSafe } from '../utils/formatters';

const fallbackBriefings: BriefingType[] = [
  {
    id: 'brief-1',
    title: 'Understanding the week in Nigerian politics',
    slug: 'nigerian-politics-brief',
    excerpt: 'A breakdown of legislative maneuvers and executive actions shaping the political landscape this week.',
    content: 'A breakdown of legislative maneuvers and executive actions shaping the political landscape this week.',
    briefingType: 'weekly',
    presenter: 'Annabel K.',
    youtubeUrl: 'https://www.youtube.com/watch?v=3H95x0BV9nA',
    youtubeVideoId: '3H95x0BV9nA',
    thumbnailUrl: 'https://img.youtube.com/vi/3H95x0BV9nA/maxresdefault.jpg',
    keyPoints: 'The central bank announced a 50bps rate hike following higher-than-expected inflation data in the logistics sector.&#15;This marks a hawkish shift that could dampen private sector credit growth during the critical Q4 trade window.&#15;Secondary bond market yields and the upcoming manufacturing PMI reports for cross-sector contagion.',
    sourceLinks: 'https://clearpath.media',
    topicTags: ['POLICY', 'ECONOMY'],
    coverageArea: 'Nigeria',
    status: 'published',
    isFeatured: true,
    publishedAt: '2026-10-24',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'brief-2',
    title: 'Resource Diplomacy in the Sahel',
    slug: 'sahel-resource-brief',
    excerpt: 'Analyzing the new lithium mining agreements and their impact on regional security partnerships.',
    content: 'Analyzing the new lithium mining agreements and their impact on regional security partnerships.',
    briefingType: 'analysis',
    presenter: 'Annabel K.',
    youtubeUrl: 'https://www.youtube.com/watch?v=3H95x0BV9nA',
    youtubeVideoId: '3H95x0BV9nA',
    thumbnailUrl: 'https://img.youtube.com/vi/3H95x0BV9nA/maxresdefault.jpg',
    keyPoints: 'Sahel mining terms renegotiated.&#15;European firms replace legacy trade agreements.&#15;Security loops remain highly fragile.',
    sourceLinks: 'https://clearpath.media',
    topicTags: ['POLICY', 'MINING'],
    coverageArea: 'Sahel',
    status: 'published',
    isFeatured: false,
    publishedAt: '2026-10-23',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'brief-3',
    title: 'Digital Infrastructure Expansion',
    slug: 'infrastructure-brief',
    excerpt: 'Submarine cable investments and the competitive landscape for pan-African cloud providers.',
    content: 'Submarine cable investments and the competitive landscape for pan-African cloud providers.',
    briefingType: 'daily',
    presenter: 'Annabel K.',
    youtubeUrl: 'https://www.youtube.com/watch?v=3H95x0BV9nA',
    youtubeVideoId: '3H95x0BV9nA',
    thumbnailUrl: 'https://img.youtube.com/vi/3H95x0BV9nA/maxresdefault.jpg',
    keyPoints: 'Submarine cables expand high capacity.&#15;Local server nodes are deployed.',
    sourceLinks: 'https://clearpath.media',
    topicTags: ['TECH', 'ECONOMY'],
    coverageArea: 'Africa',
    status: 'published',
    isFeatured: false,
    publishedAt: '2026-10-22',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'brief-4',
    title: 'The Port Congestion Crisis',
    slug: 'congestion-brief',
    excerpt: 'Supply chain bottlenecks at regional hubs and the implications for seasonal inflation.',
    content: 'Supply chain bottlenecks at regional hubs and the implications for seasonal inflation.',
    briefingType: 'daily',
    presenter: 'Annabel K.',
    youtubeUrl: 'https://www.youtube.com/watch?v=3H95x0BV9nA',
    youtubeVideoId: '3H95x0BV9nA',
    thumbnailUrl: 'https://img.youtube.com/vi/3H95x0BV9nA/maxresdefault.jpg',
    keyPoints: 'Seasonal cargo levels surge at maritime hubs.&#15;Clearance processes trigger demurrage penalties.',
    sourceLinks: 'https://clearpath.media',
    topicTags: ['TRADE', 'LOGISTICS'],
    coverageArea: 'Nigeria',
    status: 'published',
    isFeatured: false,
    publishedAt: '2026-10-21',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function Briefing() {
  const [searchParams] = useSearchParams();
  const [briefings, setBriefings] = useState<BriefingType[]>([]);
  const [activeBriefing, setActiveBriefing] = useState<BriefingType | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('search') || '');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  
  // Newsletter subscription
  const [email, setEmail] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const qUrl = searchParams.get('search');
    if (qUrl !== null) {
      setSearchTerm(qUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadBriefings() {
      try {
        const q = query(
          collection(db, 'briefings'),
          where('status', '==', 'published'),
          orderBy('publishedAt', 'desc')
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list = snap.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              publishedAtLabel: formatFirestoreDate(data.publishedAt || data.createdAt),
              createdAtLabel: formatFirestoreDate(data.createdAt),
              updatedAtLabel: formatFirestoreDate(data.updatedAt)
            } as BriefingType;
          });
          setBriefings(list);
          setActiveBriefing(list[0]);
        } else {
          setBriefings(fallbackBriefings);
          setActiveBriefing(fallbackBriefings[0]);
        }
      } catch (err) {
        console.error('Error fetching briefings: ', err);
        setBriefings(fallbackBriefings);
        setActiveBriefing(fallbackBriefings[0]);
      }
    }
    loadBriefings();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailLower = email.toLowerCase().trim();
    if (!emailLower || !emailLower.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setSubmitting(true);
    try {
      // Prevent duplicate active subscribers
      try {
        const duplicateQuery = query(
          collection(db, 'newsletterSubscribers'),
          where('email', '==', emailLower),
          where('status', '==', 'active')
        );
        const dupSnap = await getDocs(duplicateQuery);
        if (!dupSnap.empty) {
          setSubscribed(true);
          setEmail('');
          return;
        }
      } catch (checkErr) {
        // Log gently and proceed directly with document creation if read fails (unauthenticated fallback)
        console.log('Pre-subscribe verification bypassed due to lack of public read credentials.');
      }

      await addDoc(collection(db, 'newsletterSubscribers'), {
        email: emailLower,
        selectedBriefings: [],
        status: 'active',
        source: 'briefing_page',
        subscribedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.error('Error subscribing to newsletter:', err);
      alert('Subscription failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const archiveList = activeBriefing 
    ? briefings.filter(b => b.id !== activeBriefing.id && b.title !== activeBriefing.title)
    : briefings;

  const filteredArchive = archiveList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic === '' || (item.topicTags && item.topicTags.some((t: string) => t.toLowerCase() === selectedTopic.toLowerCase()));
    return matchesSearch && matchesTopic;
  });

  // Split points for display
  const points = activeBriefing?.keyPoints 
    ? activeBriefing.keyPoints.split('&#15;').flatMap(p => p.split('\n'))
    : ['No detail loaded.'];

  const block1 = points[0] || 'Pending analysis';
  const block2 = points[1] || 'Pending analysis';
  const block3 = points[2] || 'Pending analysis';

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-unit-xl">
      <header className="mb-unit-xl border-b border-outline-variant pb-unit-lg">
        <h1 className="font-display-lg text-display-lg text-primary mb-unit-sm font-semibold">Daily Brief with Annabel</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[720px]">A weekday briefing that helps professionals interpret events without chasing headlines.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter font-sans">
        <div className="lg:col-span-8 space-y-unit-xl">
          {activeBriefing && (
            <section className="bg-surface-container-low p-unit-lg rounded-lg border border-outline-variant shadow-sm">
              <div className="flex items-center gap-unit-sm mb-unit-md">
                <span className="bg-primary text-white font-label-sm text-label-sm px-unit-sm py-unit-xs rounded-sm tracking-wide font-bold">LATEST BRIEFING</span>
                <span className="text-on-surface-variant font-label-sm text-label-sm uppercase font-bold">
                  {activeBriefing.publishedAtLabel || formatFirestoreDate(activeBriefing.publishedAt) || 'Today'}
                </span>
              </div>
              
              <div className="relative aspect-video w-full mb-unit-lg overflow-hidden rounded-lg group">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${activeBriefing.youtubeVideoId || '3H95x0BV9nA'}?rel=0`} 
                  title={activeBriefing.title || "Daily Brief with Annabel"} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-unit-lg">
                <div>
                  <h3 className="font-label-md text-label-md text-primary uppercase mb-unit-xs font-bold">What happened</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{block1.replace(/^- /, '')}</p>
                </div>
                <div>
                  <h3 className="font-label-md text-label-md text-primary uppercase mb-unit-xs font-bold">Why it matters</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{block2.replace(/^- /, '')}</p>
                </div>
                <div>
                  <h3 className="font-label-md text-label-md text-primary uppercase mb-unit-xs font-bold">What to watch next</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{block3.replace(/^- /, '')}</p>
                </div>
              </div>
            </section>
          )}

          <section>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-unit-lg gap-unit-md animate-fade-in">
              <h2 className="font-headline-md text-headline-md text-primary font-bold">Briefing Archive</h2>
              <div className="flex flex-col sm:flex-row items-center gap-unit-sm w-full md:w-auto">
                <div className="relative w-full sm:w-auto">
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search briefings..." 
                    className="w-full sm:w-64 px-4 py-2.5 border border-outline focus:border-primary focus:ring-0 rounded-sm text-body-md bg-transparent" 
                  />
                </div>
                <div className="flex gap-unit-sm w-full sm:w-auto">
                  <select 
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="flex-1 sm:flex-none px-4 py-2.5 border border-outline focus:border-primary focus:ring-0 rounded-sm text-body-md bg-transparent focus:outline-none"
                  >
                    <option value="">All Topics</option>
                    <option value="policy">Policy</option>
                    <option value="economy">Economy</option>
                    <option value="tech">Tech</option>
                    <option value="trade">Trade</option>
                  </select>
                </div>
              </div>
            </div>
            
            {filteredArchive.length === 0 ? (
              <div className="p-8 text-center text-on-surface-variant bg-surface-container-low border border-outline-variant rounded">
                No past briefings match your search criteria.
              </div>
            ) : (
              <div className="space-y-unit-md">
                {filteredArchive.map((item, index) => (
                  <div 
                    key={index} 
                    onClick={() => setActiveBriefing(item)}
                    className="flex flex-col md:flex-row gap-unit-md p-unit-md border border-outline-variant hover:bg-surface-container-high transition-all cursor-pointer group rounded"
                  >
                    <div className="md:w-32 flex-shrink-0">
                      <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
                        {item.publishedAtLabel || formatFirestoreDate(item.publishedAt) || 'Published'}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-headline-md text-headline-md !text-lg font-semibold text-on-surface group-hover:text-primary transition-colors mb-unit-xs">{item.title}</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-unit-sm">{item.excerpt}</p>
                      <div className="flex gap-unit-xs mb-unit-md flex-wrap">
                        {item.topicTags && item.topicTags.map((tag: string) => (
                          <span key={tag} className="bg-surface-container-highest px-unit-sm py-unit-xs text-[10px] font-bold uppercase rounded-sm tracking-widest text-on-surface-variant">{tag}</span>
                        ))}
                      </div>
                      <button className="flex items-center gap-unit-xs font-label-md text-label-md text-primary uppercase hover:underline cursor-pointer font-bold">
                        Watch Episode <Play className="w-3 h-3 ml-1 fill-current hover:text-primary-container" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-unit-lg">
          <div className="bg-white border border-outline-variant p-unit-lg rounded-lg">
            <h2 className="font-label-md text-label-md text-primary uppercase mb-unit-lg border-b border-outline-variant pb-unit-xs font-bold">Program Details</h2>
            <div className="space-y-unit-md">
              <div>
                <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Cadence</span>
                <span className="font-body-md text-body-md font-semibold text-primary">Weekdays</span>
              </div>
              <div>
                <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Format</span>
                <span className="font-body-md text-body-md font-semibold text-primary">5–7 minute briefing</span>
              </div>
              <div>
                <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">Target Audience</span>
                <ul className="list-disc list-inside font-body-md text-body-md text-on-surface-variant space-y-1">
                  <li>Professionals</li>
                  <li>Executives</li>
                  <li>Policy practitioners</li>
                </ul>
              </div>
            </div>
            <button className="w-full mt-unit-xl bg-primary text-white py-unit-md font-label-md text-label-md rounded-sm hover:bg-primary-container transition-all flex items-center justify-center gap-unit-sm cursor-pointer font-bold tracking-wider">
              <Bell className="w-4 h-4 text-white" /> SET REMINDER
            </button>
          </div>

          <div className="p-unit-lg border border-outline-variant bg-surface-container-low rounded-lg">
            <div className="flex items-center gap-unit-md mb-unit-md">
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-outline-variant">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvWqyfhT7JZ9U45Vk0xO3FMc92FU3k_fkcwsXKloBp2OLo_UEwflG6OQEXBjqAkdkQpbEOBamF4zJl_iMXdACZ8wO6PsSEGzSh3rTzLZojcx23xur-qSsfeiFwfYUNVOOBcK6Ni8IzSSn5r-rU5q6MPmEsKUYJm6uMS-86ETnpaDMLT7Lay6s_BuHPExGrsudQhUA63QtykEVYwXVn2Lw_lwU06qa7BvsDt0PAQXIa7i-xG-JCEIv1TH3CDVPx9AYBEvtiQ-lFjEM" alt="Host" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md !text-lg font-bold text-primary">Annabel K.</h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">Policy Lead & Host</p>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant italic leading-relaxed">
              "My goal is to distill the complexity of policy into actionable intelligence for those leading the continent's key sectors."
            </p>
          </div>
        </aside>
      </div>

      <section className="mt-unit-xl bg-primary text-white p-unit-xl rounded-lg text-center relative overflow-hidden font-sans">
        <div className="relative z-10 max-w-[600px] mx-auto">
          {subscribed ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <CheckCircle2 className="w-12 h-12 text-secondary animate-bounce" />
              <h2 className="font-headline-lg text-headline-lg font-bold">Successfully Subscribed!</h2>
              <p className="font-body-md text-white/80">Thank you for subscribing. You'll receive the next Daily Brief in your inbox.</p>
            </div>
          ) : (
            <>
              <h2 className="font-headline-lg text-headline-lg mb-unit-md font-bold">Subscribe to the Daily Brief</h2>
              <p className="font-body-md text-body-md text-white/80 mb-unit-lg leading-relaxed">Receive the daily executive summary and watch links directly in your inbox at 7:00 AM WAT every weekday morning.</p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-unit-sm items-stretch">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address" 
                  className="flex-grow bg-white/10 border border-white/20 text-white placeholder-white/55 px-6 py-3 rounded-sm focus:outline-none focus:border-white/60 focus:ring-0" 
                />
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-white text-primary px-8 py-3 font-label-md text-label-md rounded-sm hover:bg-surface-bright transition-all shrink-0 cursor-pointer disabled:opacity-50 font-bold"
                >
                  {submitting ? 'SUBSCRIBING...' : 'JOIN 12,000+ PROS'}
                </button>
              </form>
              <p className="mt-unit-md text-[10px] uppercase tracking-widest opacity-60 font-mono font-bold">NO SPAM. JUST THE BRIEFING. UNSUBSCRIBE ANYTIME.</p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
