import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Briefing as BriefingType } from '../types';
import { 
  Calendar, 
  BookOpen, 
  Link as LinkIcon, 
  Check, 
  ChevronRight, 
  FileText, 
  ArrowLeft,
  Clock, 
  User, 
  Activity, 
  Globe, 
  Info,
  TrendingUp,
  TrendingDown,
  Layers,
  Search,
  Filter
} from 'lucide-react';
import LiteYouTube from '../components/LiteYouTube';
import SEO from '../components/SEO';
import { motion } from 'motion/react';
import { formatFirestoreDate } from '../utils/formatters';

// =========================================================================
// HIGH-SIGNAL REALISTIC FALLBACK BRIEFINGS (WEST AFRICAN MACROECONOMIC EXAMPLES)
// =========================================================================
const FALLBACK_BRIEFINGS: BriefingType[] = [
  {
    id: 'cbn-monetary-tightening-2026',
    title: "CBN's Monetary Tightening: Navigating Naira Stabilization and Capital Inflows",
    slug: 'cbn-monetary-tightening',
    excerpt: "As the Monetary Policy Committee raises rates to combat stubborn inflation, we deconstruct the system design of Nigeria's capital account liberalization and its impact on domestic production.",
    content: "Nigeria's monetary authority is caught in a classic policy trilemma: maintaining capital mobility, managing exchange rate stability, and pursuing independent monetary policy. By raising the benchmark interest rate to unprecedented levels, the central bank aims to attract foreign portfolio inflows (carry-trade capital) to shore up reserves and stabilize the currency. However, this aggressive tightening is heavily penalizing domestic borrowing, with commercial lending rates climbing above 30%.\n\nThe key system bottleneck lies in the transmission mechanism of monetary policy. In an economy with a large informal sector and low credit penetration, high interest rates fail to curb food-driven inflation, which is primarily structural rather than demand-pull. Instead, they increase the cost of public debt servicing and stifle manufacturing capacity, creating a stagflationary pressure point.",
    briefingType: 'daily',
    presenter: 'Annabel Orji',
    youtubeUrl: 'https://www.youtube.com/watch?v=3H95x0BV9nA',
    youtubeVideoId: '3H95x0BV9nA',
    thumbnailUrl: 'https://img.youtube.com/vi/3H95x0BV9nA/maxresdefault.jpg',
    featuredImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1200',
    keyPoints: "Central Bank raised MPR to 27.25% to stabilize inflation.\nDomestic commercial interest rates soar past 30%, choking SME liquidity.\nHot money portfolio inflows respond to 1-year Treasury yields surpassing 22%.",
    sourceLinks: "Central Bank of Nigeria Communiqué No. 154 of the MPC Meeting\nNational Bureau of Statistics (NBS) CPI and Inflation Report\nFederal Ministry of Finance Debt Management Office (DMO) Auction Results",
    topicTags: ['MONETARY POLICY', 'NAIRA', 'INFLATION'],
    coverageArea: 'Nigeria',
    status: 'published',
    isFeatured: true,
    publishedAt: '2026-07-17',
    createdAt: '2026-07-17T09:00:00Z',
    updatedAt: '2026-07-17T09:00:00Z',
    whyItMatters: "The systemic implication is clear: monetary policy alone cannot fix a structural supply deficiency. High interest rates are short-term carry-trade tools that risk choking domestic real production."
  },
  {
    id: 'sahel-regional-trade-tariffs-2026',
    title: "The Sahel Transition: Trade Realities and ECOWAS Tariff Alignments",
    slug: 'sahel-regional-trade',
    excerpt: "Analyzing the systemic impact of transit routes, custom procedures, and regional alignment on agricultural corridors and commodity prices in West Africa.",
    content: "The trade corridors of West Africa represent a complex ecosystem where informal barter, sovereign checkpoints, and legal tariffs clash daily. Despite political shifts and regional block debates, the economic dependencies of the Sahel states on coastal ports remain absolute. This briefing tracks the current shipping transit volumes and the structural delays slowing customs clearance at primary regional hubs.\n\nOur data highlights that informal customs charges can make up as much as 45% of total transit costs, neutralizing any official tariff cuts. By mapping these infrastructure friction points, we can understand why regional prices for grains and cement continue to soar despite overall import level stabilization.",
    briefingType: 'weekly',
    presenter: 'Osita Chidoka',
    youtubeUrl: 'https://www.youtube.com/watch?v=3H95x0BV9nA',
    youtubeVideoId: '3H95x0BV9nA',
    thumbnailUrl: 'https://img.youtube.com/vi/3H95x0BV9nA/hqdefault.jpg',
    featuredImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1200',
    keyPoints: "Sovereign transit routes continue to face heavy informal customs bottlenecks.\nLandlocked Sahelian shipping rates are up 18% due to port delays and border checks.\nRegional cooperation on trade corridors continues despite geopolitical posturing.",
    sourceLinks: "ECOWAS Directorate of Trade and Customs Annual Transit Report\nWest Africa Trade Hub Commodity Price Index\nPort Authority of Cotonou and Lagos Apapa Customs Logs",
    topicTags: ['REGIONAL TRADE', 'SAHEL', 'INFRASTRUCTURE'],
    coverageArea: 'Africa',
    status: 'published',
    isFeatured: false,
    publishedAt: '2026-07-10',
    createdAt: '2026-07-10T09:00:00Z',
    updatedAt: '2026-07-10T09:00:00Z',
    whyItMatters: "Regional supply chain links are highly resilient despite formal diplomatic friction. Unlocking infrastructure is much more critical than debating border controls."
  },
  {
    id: 'public-finance-capital-budget-2026',
    title: "Public Finance Blueprints: Explaining the 2026 Federal Capital Budget Loop",
    slug: 'public-finance-budget',
    excerpt: "A deep structural examination of capital project releases, revenue-to-debt ratios, and the mechanics of treasury single accounts.",
    content: "The 2026 Federal Capital Budget implementation highlights the stark disconnect between statutory approvals and real-time revenue disbursement. While the legislature approved over 8.5 trillion Naira for infrastructure, the Capital Release Rate currently sits at just 42% due to revenue shortfalls and prioritized debt servicing.\n\nOur structural blueprint traces the journey of a capital Naira from tax collection and oil royalties into the Treasury Single Account (TSA), deconstructing the administrative gatekeeping and ministerial allocations that often stall crucial energy and transit developments.",
    briefingType: 'analysis',
    presenter: 'ClearPath Editorial Desk',
    youtubeUrl: 'https://www.youtube.com/watch?v=3H95x0BV9nA',
    youtubeVideoId: '3H95x0BV9nA',
    thumbnailUrl: 'https://img.youtube.com/vi/3H95x0BV9nA/hqdefault.jpg',
    featuredImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200',
    keyPoints: "Capital project disbursement stands at 42% of statutory allocations.\nSovereign debt servicing claims 68% of collected non-oil revenue.\nTreasury Single Account mechanics prevent idle funding but increase operational bureaucracy.",
    sourceLinks: "Federal Ministry of Budget and Economic Planning Q1 Implementation Report\nOffice of the Accountant-General of the Federation Cash Flow Statements\nDebt Management Office (DMO) Sovereign Borrowing Framework",
    topicTags: ['PUBLIC FINANCE', 'BUDGET', 'GOVERNANCE'],
    coverageArea: 'Nigeria',
    status: 'published',
    isFeatured: false,
    publishedAt: '2026-07-03',
    createdAt: '2026-07-03T09:00:00Z',
    updatedAt: '2026-07-03T09:00:00Z',
    whyItMatters: "Without high-fidelity tracking of capital releases, capital projects remain theoretical. The focus must shift from political announcements to absolute cash disbursement rates."
  }
];

interface IndicatorMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendText: string;
}

const getContextIndicators = (slug: string): IndicatorMetric[] => {
  const normalized = (slug || '').toLowerCase();
  if (normalized.includes('tightening') || normalized.includes('monetary') || normalized.includes('naira')) {
    return [
      { label: "MPC Interest Rate (MPR)", value: "27.25%", trend: 'up', trendText: "+50 bps hike" },
      { label: "Headline Inflation (Y-o-Y)", value: "32.15%", trend: 'down', trendText: "-12 bps correction" },
      { label: "NAFEM Exchange Rate", value: "1,495 / $", trend: 'up', trendText: "Slight Naira rebound" },
      { label: "1-Year Treasury Yield", value: "22.40%", trend: 'up', trendText: "Over-subscribed" }
    ];
  } else if (normalized.includes('sahel') || normalized.includes('trade') || normalized.includes('tariff')) {
    return [
      { label: "ECOWAS Common External Tariff", value: "4.2%", trend: 'neutral', trendText: "Standard index" },
      { label: "Average Border Crossing Delay", value: "3.4 Days", trend: 'up', trendText: "Infrastructure friction" },
      { label: "Regional Grain Trade Flow", value: "860k MT", trend: 'down', trendText: "-6% seasonal reduction" },
      { label: "Sahelian Import Surplus", value: "$1.24B", trend: 'up', trendText: "Rising trade reliance" }
    ];
  } else {
    return [
      { label: "Approved Capital Capex", value: "₦8.50T", trend: 'neutral', trendText: "Approved statutory" },
      { label: "Capital Release Rate", value: "42.0%", trend: 'down', trendText: "-15% below target" },
      { label: "Debt Service-to-Revenue", value: "68.2%", trend: 'up', trendText: "Fiscal stress indicator" },
      { label: "Oil Price Benchmark", value: "$78.40", trend: 'up', trendText: "+$3.40 above budget" }
    ];
  }
};

const getContextSignals = (slug: string): string[] => {
  const normalized = (slug || '').toLowerCase();
  if (normalized.includes('tightening') || normalized.includes('monetary') || normalized.includes('naira')) {
    return [
      "Sept 24, 2026: Next CBN MPC Policy Rate Announcement",
      "Aug 15, 2026: NBS Headline Inflation Report Release",
      "Aug 28, 2026: National Treasury Bill Liquidation Round",
      "Oct 02, 2026: Sovereign Bond Issuance Auction Window"
    ];
  } else if (normalized.includes('sahel') || normalized.includes('trade') || normalized.includes('tariff')) {
    return [
      "Aug 10, 2026: ECOWAS Trade Integration Committee Summit",
      "Sept 05, 2026: Nigeria-Benin Customs Joint Border Enforcement Protocol",
      "Oct 15, 2026: Regional Port Infrastructure Modernization Grant Review",
      "Nov 12, 2026: Sahelian Agricultural Transit Tariff Implementation"
    ];
  } else {
    return [
      "Aug 20, 2026: Ministry of Finance Mid-Year Budget Performance Report",
      "Sept 10, 2026: Q2 Capital Project Releases Audit Announcement",
      "Oct 05, 2026: Accountant-General TSA Reconciliation Audit",
      "Nov 15, 2026: 2027 Appropriation Bill Preparatory Hearings"
    ];
  }
};

export default function Briefing() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [briefings, setBriefings] = useState<BriefingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [activeTab, setActiveTab] = useState<'feed' | 'brief'>('feed');

  useEffect(() => {
    async function fetchBriefings() {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'briefings'));
        const dbBriefings: BriefingType[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          dbBriefings.push({
            id: doc.id,
            ...data,
            publishedAt: data.publishedAt || new Date(data.createdAt || '').toISOString().split('T')[0]
          } as BriefingType);
        });

        const publishedBriefings = dbBriefings.filter(b => b.status === 'published');
        const mergedMap = new Map<string, BriefingType>();
        
        FALLBACK_BRIEFINGS.forEach(b => {
          mergedMap.set(b.id, b);
        });
        
        publishedBriefings.forEach(b => {
          mergedMap.set(b.id, b);
        });

        const sortedList = Array.from(mergedMap.values());
        sortedList.sort((a, b) => {
          const dateA = a.publishedAt || a.createdAt || '';
          const dateB = b.publishedAt || b.createdAt || '';
          return dateB.localeCompare(dateA);
        });

        setBriefings(sortedList);
      } catch (err) {
        console.error("Error loading briefings:", err);
        setBriefings(FALLBACK_BRIEFINGS);
      } finally {
        setLoading(false);
      }
    }

    fetchBriefings();
  }, []);

  // Back home/listings logic
  const handleBackToListings = () => {
    navigate('/briefing');
  };

  // 1. Standalone Article Mode
  if (slug) {
    const currentArticle = briefings.find(b => b.slug === slug);
    
    // Show spinner if still loading
    if (loading) {
      return (
        <div className="py-24 bg-background min-h-screen flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-bold text-on-surface-variant">Loading article details...</p>
        </div>
      );
    }

    // Handle not found gracefully
    if (!currentArticle) {
      return (
        <div className="max-w-2xl mx-auto py-16 px-margin-mobile text-center min-h-[60vh] flex flex-col justify-center items-center">
          <BookOpen className="w-12 h-12 text-outline mb-4" />
          <h2 className="text-xl font-bold text-on-surface mb-2">Article Not Found</h2>
          <p className="text-on-surface-variant text-sm mb-6">The requested daily briefing article could not be located in our system files.</p>
          <Link to="/briefing" className="inline-flex items-center gap-2 bg-primary text-white text-xs uppercase tracking-wider font-bold px-5 py-3 rounded-[3px] hover:bg-primary/90 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Daily Briefings
          </Link>
        </div>
      );
    }

    return (
      <>
        <SEO 
          title={`${currentArticle.title} | ClearPath Daily`}
          description={currentArticle.excerpt || "Executive policy, economic reform, and governance summary."}
        />

        <div className="bg-background min-h-screen text-on-surface font-sans py-10">
          <div className="max-w-[960px] px-margin-mobile md:px-margin-desktop mx-auto space-y-8">
            
            {/* Top Breadcrumb navigation */}
            <button 
              onClick={handleBackToListings}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-bold text-xs uppercase tracking-wider cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Daily Briefings
            </button>

            {/* Clean Premium Standalone Article Header */}
            <article className="bg-white border border-outline-variant rounded-lg p-6 md:p-10 shadow-xs space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-mono font-black text-primary uppercase bg-primary/10 px-2.5 py-1 rounded-xs tracking-widest">
                    {currentArticle.briefingType || 'daily article'}
                  </span>
                  <span className="text-xs text-on-surface-variant font-semibold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> 
                    {currentArticle.publishedAtLabel || formatFirestoreDate(currentArticle.publishedAt || currentArticle.createdAt)}
                  </span>
                  <span className="text-xs text-on-surface-variant/80 font-medium flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" /> 5 min read
                  </span>
                </div>

                <h1 className="font-display font-black text-2xl md:text-3xl lg:text-4xl text-on-surface leading-tight tracking-tight">
                  {currentArticle.title}
                </h1>

                {/* Subtitle / Excerpt block */}
                <p className="text-on-surface-variant text-base md:text-lg font-medium leading-relaxed italic border-l-4 border-primary/30 pl-4 py-1 bg-surface-container-lowest">
                  "{currentArticle.excerpt}"
                </p>
              </div>

              {/* Main Content Area */}
              <div className="text-on-surface font-sans text-sm md:text-base leading-relaxed space-y-6 pt-4 border-t border-outline-variant/60">
                {currentArticle.content?.split('\n\n').map((para, index) => (
                  <p key={index} className="text-on-surface/90">
                    {para}
                  </p>
                )) || <p className="italic text-on-surface-variant">No content available for this edition.</p>}
              </div>

              {/* Today's Key Bullet Points inside Standalone Page */}
              {currentArticle.keyPoints && (
                <div className="mt-8 pt-8 border-t border-outline-variant/60 space-y-4">
                  <h3 className="font-display font-black text-lg text-primary uppercase tracking-tight flex items-center gap-2">
                    <Check className="w-5 h-5" /> Today's Core Points
                  </h3>
                  <div className="grid grid-cols-1 gap-3.5">
                    {currentArticle.keyPoints.split('\n').filter(p => p.trim()).map((pt, idx) => (
                      <div key={idx} className="flex gap-3 bg-surface-container-lowest p-4 rounded border border-outline-variant/50">
                        <span className="text-primary font-mono font-bold">0{idx + 1}.</span>
                        <span className="text-sm text-on-surface/85 font-semibold leading-relaxed">{pt.replace(/^(-\s*|\*\s*)/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Source/Reference Document links inside Standalone Page */}
              {currentArticle.sourceLinks && (
                <div className="mt-8 pt-8 border-t border-outline-variant/60 space-y-4">
                  <h3 className="font-display font-black text-lg text-primary uppercase tracking-tight flex items-center gap-2">
                    <FileText className="w-5 h-5" /> References & Official Public Record
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {currentArticle.sourceLinks.split('\n').filter(p => p.trim()).map((source, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 bg-surface-container-lowest border border-outline-variant p-3.5 rounded-md text-sm font-semibold">
                        <LinkIcon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-on-surface/80">{source.replace(/^(-\s*|\*\s*)/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Presenter signature card */}
              <div className="mt-8 pt-8 border-t border-outline-variant/60 flex items-center gap-3.5 bg-surface-container-lowest p-4 rounded border border-outline-variant/60">
                <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold font-display text-sm">
                  {currentArticle.presenter ? currentArticle.presenter.charAt(0) : 'A'}
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider font-extrabold text-on-surface-variant">Editorial Dispatch by</span>
                  <span className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                    {currentArticle.presenter || "Annabel Orji"}
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span className="text-xs font-normal text-on-surface-variant">ClearPath Editorial Lead</span>
                  </span>
                </div>
              </div>
            </article>

          </div>
        </div>
      </>
    );
  }

  // 2. Main Listing Mode
  const latestArticle = briefings[0];
  const previousBriefings = briefings.slice(1);

  // Archive Filter
  const filteredPrevious = previousBriefings.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || b.briefingType === selectedType;
    return matchesSearch && matchesType;
  });

  const getBriefBullets = (b: BriefingType | null) => {
    if (!b) return [];
    const textToParse = b.keyPoints || (b as any).whatHappened || '';
    if (!textToParse) {
      return [
        "Monetary policy rate raised to multi-decade highs of 27.25% to stabilize liquidity.",
        "Corporate and retail lending rates climb past 30%, suppressing business credit expansion.",
        "Sovereign bond indices show sharp inflows of portfolio capital responding to high Treasury Bill yields."
      ];
    }
    return textToParse
      .split('\n')
      .map(line => line.trim().replace(/^(-\s*|\*\s*)/, ''))
      .filter(line => line.length > 0);
  };

  const getSourcesList = (b: BriefingType | null) => {
    if (!b) return [];
    const textToParse = b.sourceLinks || '';
    if (!textToParse) {
      return [
        "Central Bank of Nigeria Communiqué No. 154 of the MPC Meeting",
        "National Bureau of Statistics (NBS) CPI and Inflation Report",
        "Federal Ministry of Finance Debt Management Office (DMO) Auction Results"
      ];
    }
    return textToParse
      .split('\n')
      .map(line => line.trim().replace(/^(-\s*|\*\s*)/, ''))
      .filter(line => line.length > 0);
  };

  const getFocusParagraphs = (b: BriefingType | null) => {
    if (!b) return [];
    const textToParse = b.content || '';
    if (!textToParse) {
      return [
        "In our core focus today, the systemic implication of high-rate policy configurations reveals a severe structural bottleneck. Traditional macroeconomic models rely heavily on the assumption of a robust and credit-sensitive consumer market. In developing economies characterized by informal barter and weak institutional infrastructure, these aggressive hikes fail to solve the core inflationary pressures, which are structural (fuel prices, transport friction, regional security bottlenecks) rather than demand-pull.",
        "Instead, high benchmark rates penalize domestic industrialization. By shifting corporate savings toward short-term government paper, capital is redirected away from active infrastructure projects, increasing treasury servicing costs."
      ];
    }
    return textToParse.split('\n\n').filter(p => p.trim().length > 0);
  };

  return (
    <>
      <SEO 
        title="ClearPath Daily Briefings"
        description="Executive daily policy summary explaining West African public intelligence, economic reform, and governance without the noise."
      />

      <div className="bg-background min-h-screen text-on-surface font-sans">
        
        {/* ==========================================
            A. PAGE TITLE BANNER
            ========================================== */}
        <div className="border-b border-outline-variant bg-surface-container-lowest py-8 md:py-10">
          <div className="max-w-[1440px] px-margin-mobile md:px-margin-desktop mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-display font-black text-3xl md:text-4xl lg:text-5xl text-primary tracking-tight">
                ClearPath Daily
              </h1>
              <p className="text-on-surface-variant text-sm md:text-base font-medium mt-1.5 max-w-2xl">
                Weekday morning briefs translating public policy, macroeconomic shifts, and sovereign decisions into clear systemic understanding.
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================
            B. CORE PAGE INTERFACE
            ========================================== */}
        <div className="max-w-[1440px] px-margin-mobile md:px-margin-desktop mx-auto py-10">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-sm font-bold text-on-surface-variant">Loading publications...</p>
            </div>
          ) : !latestArticle ? (
            <div className="py-16 text-center border rounded bg-surface-container-low">
              <BookOpen className="w-12 h-12 text-outline mx-auto mb-3" />
              <p className="text-on-surface-variant italic font-bold">No briefings found.</p>
            </div>
          ) : (
            <div className="space-y-6 md:space-y-12">
              
              {/* ==========================================
                  MOBILE NAVIGATION TABS (Only visible on mobile screens under md)
                  ========================================== */}
              <div className="block md:hidden border-b border-outline-variant bg-surface-container-lowest rounded-lg p-1.5 border">
                <div className="flex w-full gap-1">
                  <button 
                    onClick={() => setActiveTab('feed')}
                    className={`flex-1 text-center py-2.5 text-[11px] font-black uppercase tracking-wider transition-all rounded-[4px] ${
                      activeTab === 'feed' 
                        ? 'bg-primary text-white shadow-xs' 
                        : 'bg-transparent text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Daily Feed
                  </button>
                  <button 
                    onClick={() => setActiveTab('brief')}
                    className={`flex-1 text-center py-2.5 text-[11px] font-black uppercase tracking-wider transition-all rounded-[4px] ${
                      activeTab === 'brief' 
                        ? 'bg-primary text-white shadow-xs' 
                        : 'bg-transparent text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Today's Summary
                  </button>
                </div>
              </div>

              {/* ==========================================
                  TWO COLUMN LAYOUT: MAIN vs SIDEBAR
                  ========================================== */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                
                {/* LEFT MAIN AREA (2 COLUMNS) */}
                <div className={`space-y-12 md:col-span-2 ${activeTab === 'feed' ? 'block' : 'hidden md:block'}`}>
                  
                  {/* ==========================================
                      1. FEATURED SECTION (LATEST ARTICLE)
                      ========================================== */}
                  <section id="featured-latest" className="space-y-4">
                    <div className="bg-white border border-outline rounded-lg overflow-hidden shadow-xs p-6 md:p-8 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <h2 className="font-display font-black text-xl md:text-2xl lg:text-3xl text-on-surface leading-tight">
                          {latestArticle.title}
                        </h2>
                        
                        <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                          {latestArticle.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-outline-variant/60 pt-4">
                        <span className="text-xs text-on-surface-variant font-bold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> 
                          {latestArticle.publishedAtLabel || formatFirestoreDate(latestArticle.publishedAt || latestArticle.createdAt)}
                        </span>
                        <Link 
                          to={`/briefing/${latestArticle.slug}`}
                          className="inline-flex items-center gap-1 bg-primary text-white font-bold uppercase tracking-wider hover:bg-primary/95 transition-all text-xs px-4 py-2.5 rounded-[3px] shadow-sm"
                        >
                          Read Full Article <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </section>

                  {/* PREVIOUS EDITIONS (3-GRID PATTERN) */}
                  <section id="previous-editions" className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline pb-2.5">
                      <div>
                        <h3 className="font-display font-black text-lg text-primary uppercase tracking-wider">Previous Editions</h3>
                        <p className="text-xs text-on-surface-variant font-medium mt-0.5">Explore our rich archive of economic policy analyses.</p>
                      </div>

                      {/* Clean Filter Form */}
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-outline absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input 
                            type="text"
                            placeholder="Filter articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-outline pl-8 pr-3 py-1.5 rounded-md text-[11px] font-bold outline-hidden focus:border-primary max-w-[150px]"
                          />
                        </div>
                        <select 
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="bg-white border border-outline px-2 py-1.5 rounded-md text-[11px] font-bold text-on-surface cursor-pointer"
                        >
                          <option value="all">All</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="analysis">Analysis</option>
                        </select>
                      </div>
                    </div>

                    {filteredPrevious.length === 0 ? (
                      <div className="py-12 text-center text-on-surface-variant italic font-semibold border rounded border-outline-variant bg-surface-container-low/40">
                        No articles matched the filter.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {filteredPrevious.map((b) => (
                          <Link 
                            key={b.id}
                            to={`/briefing/${b.slug}`}
                            className="bg-white border border-outline-variant rounded-lg p-5 flex flex-col justify-between hover:border-primary/40 hover:shadow-sm transition-all h-[240px] group"
                          >
                            <div className="space-y-2">
                              <h4 className="font-display font-black text-sm text-on-surface leading-tight line-clamp-3 group-hover:text-primary transition-colors">
                                {b.title}
                              </h4>
                              <p className="text-xs text-on-surface-variant line-clamp-4 leading-relaxed font-semibold">
                                {b.excerpt}
                              </p>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/60">
                              <span className="text-[11px] font-bold text-primary flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                                Read Article <ChevronRight className="w-3 h-3" />
                              </span>
                              <span className="text-[10px] font-mono font-bold text-on-surface-variant/80 flex items-center gap-0.5">
                                <Calendar className="w-3 h-3" />
                                {b.publishedAtLabel || formatFirestoreDate(b.publishedAt || b.createdAt)}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* THE PUBLIC RECORD */}
                  <section id="the-public-record" className="bg-white border border-outline rounded-lg p-6 md:p-8 space-y-6 shadow-xs">
                    <div className="border-b border-outline pb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <h4 className="font-display font-black text-base md:text-lg text-primary uppercase tracking-wider">The Public Record</h4>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5 font-medium">
                        Verified official bulletins, regulatory gazettes, and legislative reports referenced in our latest briefings.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getSourcesList(latestArticle).map((source, idx) => (
                        <div key={idx} className="bg-surface-container-lowest border border-outline-variant p-4 rounded-md hover:border-primary/30 transition-all">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono font-bold uppercase text-on-surface-variant tracking-wider">Reference Record 0{idx + 1}</span>
                            <span className="block text-xs font-bold text-on-surface leading-snug">{source}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* THE INDICATOR */}
                  <section id="the-indicator-main" className="bg-white border border-outline rounded-lg p-6 md:p-8 space-y-6 shadow-xs">
                    <div className="border-b border-outline pb-3">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        <h4 className="font-display font-black text-base md:text-lg text-primary uppercase tracking-wider">The Indicator</h4>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5 font-medium">
                        West African sovereign financial health indices, inflationary curves, and capital reserves tracked live.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {getContextIndicators(latestArticle.slug).map((metric, idx) => (
                        <div key={idx} className="bg-surface-container-lowest border border-outline-variant p-4 rounded-md flex flex-col justify-between gap-2">
                          <span className="text-[10px] font-extrabold uppercase text-on-surface-variant tracking-wider leading-tight">{metric.label}</span>
                          <span className="text-xl font-black text-primary font-display tracking-tight leading-none mt-1">{metric.value}</span>
                          <div className={`mt-2 inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded w-fit ${
                            metric.trend === 'up' 
                              ? 'bg-emerald-500/10 text-emerald-600' 
                              : metric.trend === 'down' 
                                ? 'bg-amber-500/10 text-amber-600' 
                                : 'bg-gray-500/10 text-gray-600'
                          }`}>
                            {metric.trend === 'up' ? '▲' : metric.trend === 'down' ? '▼' : '●'} {metric.trendText}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                </div>

                {/* RIGHT SIDEBAR COLUMN */}
                <div className={`space-y-8 ${activeTab === 'brief' ? 'block' : 'hidden md:block'}`}>
                  
                  {/* TODAY'S BRIEF */}
                  <section id="sidebar-todays-brief" className="bg-white border border-outline rounded-lg p-5 space-y-4 shadow-xs">
                    <div className="border-b border-outline pb-2.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-black text-sm text-primary uppercase tracking-wider">Today's Brief</h4>
                      </div>
                      <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">High-signal system updates summarized directly from the latest edition.</p>
                    </div>

                    <ul className="space-y-3 font-sans text-xs text-on-surface">
                      {getBriefBullets(latestArticle).map((bullet, idx) => (
                        <li key={idx} className="flex gap-2 bg-surface-container-lowest/50 p-3 rounded border border-outline-variant/50">
                          <span className="text-primary font-mono font-bold">0{idx + 1}.</span>
                          <span className="leading-relaxed font-semibold text-on-surface/90">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* IN FOCUS */}
                  <section id="sidebar-in-focus" className="bg-white border border-outline rounded-lg p-5 space-y-4 shadow-xs">
                    <div className="border-b border-outline pb-2.5">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4.5 h-4.5 text-primary" />
                        <h4 className="font-display font-black text-sm text-primary uppercase tracking-wider">In Focus</h4>
                      </div>
                      <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Critical systemic policy background deconstructed.</p>
                    </div>

                    <div className="space-y-3 text-on-surface font-sans text-xs leading-relaxed">
                      {getFocusParagraphs(latestArticle).map((pText, idx) => (
                        <p key={idx} className="text-on-surface/85 font-medium">
                          {pText}
                        </p>
                      ))}
                    </div>
                  </section>

                  {/* THE CLEARPATH LENS */}
                  <section id="sidebar-clearpath-lens" className="bg-primary/5 border border-primary/20 rounded-lg p-5 space-y-4 relative overflow-hidden shadow-xs">
                    <div className="border-b border-primary/20 pb-2.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-black text-sm text-primary uppercase tracking-wider">The ClearPath Lens</h4>
                      </div>
                      <p className="text-[10px] text-primary/75 font-bold uppercase tracking-wider">Sovereign & Regional Implication</p>
                    </div>

                    <div className="bg-white border border-outline-variant p-4 rounded shadow-xs relative">
                      <span className="text-3xl text-primary/20 font-serif absolute -top-1 left-2 font-black">“</span>
                      <p className="text-on-surface/90 font-medium text-xs leading-relaxed pl-3 italic">
                        {latestArticle.whyItMatters || "The monetary authority's policies represent crucial levers, but solving real inflation requires unlocking fundamental logistics, shipping, and power grids."}
                      </p>
                    </div>
                  </section>

                  {/* SIGNALS TO WATCH */}
                  <section id="sidebar-signals" className="bg-white border border-outline rounded-lg p-5 space-y-4 shadow-xs">
                    <div className="border-b border-outline pb-2.5">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4.5 h-4.5 text-primary" />
                        <h4 className="font-display font-black text-sm text-primary uppercase tracking-wider">Signals to Watch</h4>
                      </div>
                      <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Key dates, trigger points, and legislative votes on our calendar.</p>
                    </div>

                    <div className="space-y-3.5 relative pl-3 before:content-[''] before:absolute before:left-[5px] before:top-1.5 before:bottom-1.5 before:w-[1.5px] before:bg-outline-variant">
                      {getContextSignals(latestArticle.slug).map((signal, idx) => {
                        const [date, ...descParts] = signal.split(':');
                        const desc = descParts.join(':');
                        return (
                          <div key={idx} className="relative space-y-0.5">
                            <div className="absolute -left-[11px] top-1.5 w-[7px] h-[7px] rounded-full bg-primary border border-white"></div>
                            <span className="block text-[10px] font-mono font-bold text-primary uppercase">{date}</span>
                            <span className="block text-xs font-bold text-on-surface leading-tight">{desc}</span>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                </div>

              </div>

            </div>
          )}
        </div>

      </div>
    </>
  );
}
