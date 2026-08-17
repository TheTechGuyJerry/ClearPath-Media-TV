export interface DailyArticle {
  id: string;
  slug: string;
  category: string;
  categorySlug: string;
  topicTags: string[];
  title: string;
  subtitle?: string;
  excerpt: string;
  whyItMatters: string;
  whatToWatchNext?: string;
  authorName: string;
  authorTitle: string;
  authorAvatar?: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  coverImage: string;
  imageCaption?: string;
  imageCredit?: string;
  content: string;
  supportingSources?: { title: string; url: string }[];
  relatedArticles?: { title: string; slug: string; category: string }[];
  relatedAthenaPublication?: {
    title: string;
    type: 'Athena Perspectives' | 'Policy Pulse' | 'Athena Notes' | 'Third Tier';
    summary: string;
    url: string;
  };
  relatedProgrammeVideo?: {
    title: string;
    programmeName: string;
    youtubeUrl: string;
    thumbnailUrl: string;
  };
}

export interface InFocusStory {
  goldNumber: '01' | '02';
  article: DailyArticle;
}

export interface IndicatorItem {
  id: string;
  number: string; // e.g. "₦1.42T" or "73.4%" or "36/36"
  title: string;
  description: string;
  whyItMatters: string;
  supportingSourceTitle: string;
  supportingSourceUrl: string;
  publishedAt: string;
}

export interface PublicRecordItem {
  id: string;
  quote: string;
  speakerName: string;
  position: string;
  institution: string;
  setting: string;
  date: string;
  context: string;
  sourceLinkTitle: string;
  sourceLinkUrl: string;
}

export interface ClearPathLensStory {
  id: string;
  slug: string;
  headline: string;
  featuredImage: string;
  introductorySummary: string;
  institutionalAnalysis: string;
  relatedStories: { title: string; slug: string }[];
  supportingSources: { title: string; url: string }[];
  relatedAthenaResearch: {
    title: string;
    type: string;
    summary: string;
    url: string;
  };
  whatToWatch: string[];
  publishedAt: string;
}

export interface SignalToWatchItem {
  id: string;
  dateOrDay: string;
  event: string;
  shortExplanation: string;
  whyItMatters: string;
  relatedLinkTitle?: string;
  relatedLinkUrl?: string;
}

export interface GoDeeperItem {
  type: 'Background' | 'Evidence' | 'Watch';
  title: string;
  description: string;
  thumbnail?: string;
  buttonText: string;
  linkUrl: string;
}

export interface AthenaPublication {
  id: string;
  title: string;
  type: 'Athena Perspectives' | 'Policy Pulse' | 'Athena Notes' | 'Third Tier' | 'Special Report';
  summary: string;
  publishedAt: string;
  authors: string[];
  topicTags: string[];
  coverImage?: string;
  url: string;
}

export interface DailyEdition {
  id: string;
  dateString: string; // "2026-08-06"
  year: string;
  month: string;
  day: string;
  formattedDate: string; // "August 6, 2026"
  editionTitle: string;
  todaysBrief: DailyArticle;
  inFocus: [InFocusStory, InFocusStory];
  weeklyFeature: DailyArticle;
  indicator: IndicatorItem;
  publicRecord: PublicRecordItem;
  clearpathLens: ClearPathLensStory;
  signalsToWatch: SignalToWatchItem[];
  goDeeper: GoDeeperItem[];
}

// ==========================================
// REAL EXISTING CONTENT DATA
// ==========================================

export const ALL_CATEGORIES = [
  { id: 'todays-brief', name: "Today's Brief", description: "Daily lead analytical summary breaking down Nigeria's governance, fiscal, and political developments." },
  { id: 'in-focus', name: 'In Focus', description: 'Deep paired analysis examining structural legislative, economic, and institutional issues.' },
  { id: 'west-africa-monitor', name: 'West Africa Monitor', description: 'Diplomatic relations, ECOWAS policy directions, and trans-border security across West Africa.' },
  { id: 'state-in-focus', name: 'State in Focus', description: 'Sub-national governance, state assembly oversight, and local economic policy in Nigerian states.' },
  { id: 'lga-brief', name: 'LGA Brief', description: 'Third-tier governance, grassroots revenue distribution, and municipal service delivery.' },
  { id: 'governance-brief', name: 'Governance Brief', description: 'Institutional accountability, civil service administration, and judicial compliance.' },
  { id: 'bccn-news', name: 'BCCN News', description: 'Business, Climate, and Community Network updates shaping sustainable growth.' },
  { id: 'the-indicator', name: 'The Indicator', description: 'Crucial numbers and economic statistics contextualized for policy impact.' },
  { id: 'the-public-record', name: 'The Public Record', description: 'Verified public statements from official authorities and democratic institutions.' },
  { id: 'clearpath-lens', name: 'The ClearPath Lens', description: 'Comprehensive structural breakdowns connecting current events to long-term systemic dynamics.' },
  { id: 'signals-to-watch', name: 'Signals to Watch', description: 'Key upcoming hearings, policy decisions, and democratic milestones.' },
  { id: 'explainers', name: 'Explainers & Analysis', description: 'Clear, patient explanations of complex civil systems and policy frameworks.' },
];

export const ALL_TOPICS = [
  { id: 'elections', name: 'Elections' },
  { id: 'governance', name: 'Governance' },
  { id: 'economy', name: 'Economy' },
  { id: 'public-policy', name: 'Public Policy' },
  { id: 'institutions', name: 'Institutions' },
  { id: 'national-assembly', name: 'National Assembly' },
  { id: 'judiciary', name: 'Judiciary' },
  { id: 'security', name: 'Security' },
  { id: 'education', name: 'Education' },
  { id: 'health', name: 'Health' },
  { id: 'states', name: 'States' },
  { id: 'local-government', name: 'Local Government' },
  { id: 'west-africa', name: 'West Africa' },
  { id: 'african-union', name: 'African Union' },
  { id: 'ecowas', name: 'ECOWAS' },
  { id: 'foreign-affairs', name: 'Foreign Affairs' },
  { id: 'development', name: 'Development' },
  { id: 'data-and-indicators', name: 'Data & Indicators' },
];

export const ATHENA_PUBLICATIONS: AthenaPublication[] = [
  {
    id: 'athena-1',
    title: 'Fiscal Decentralization & Sub-National Debt Sustainability in Nigeria',
    type: 'Athena Perspectives',
    summary: 'A quantitative analysis of state government internal revenue generation versus debt servicing costs under current FAAC allocation benchmarks.',
    publishedAt: 'August 2, 2026',
    authors: ['Athena Centre for Policy & Leadership'],
    topicTags: ['economy', 'states', 'governance'],
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200',
    url: 'https://athenacentre.org/research/fiscal-decentralization-2026'
  },
  {
    id: 'athena-2',
    title: 'Evaluating Electronic Collation Integrity in West African Elections',
    type: 'Policy Pulse',
    summary: 'Assessing digital infrastructure resilience, audit trails, and voter verification protocol adoption across ECOWAS member states.',
    publishedAt: 'July 28, 2026',
    authors: ['Athena Electoral Systems Taskforce'],
    topicTags: ['elections', 'institutions', 'west-africa'],
    coverImage: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=1200',
    url: 'https://athenacentre.org/research/electronic-collation-integrity'
  },
  {
    id: 'athena-3',
    title: 'Local Government Financial Autonomy: Enforcement Mechanisms and Civil Oversight',
    type: 'Third Tier',
    summary: 'Legal pathways and operational guidelines for implementing Supreme Court rulings on direct local government allocations.',
    publishedAt: 'July 20, 2026',
    authors: ['Athena Governance & Law Clinic'],
    topicTags: ['local-government', 'judiciary', 'public-policy'],
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1200',
    url: 'https://athenacentre.org/research/lga-autonomy-enforcement'
  },
  {
    id: 'athena-4',
    title: 'Energy Transition Metrics in Sub-Saharan Africa: Balancing Off-Grid Expansion with Tariffs',
    type: 'Athena Notes',
    summary: 'Macroeconomic analysis of off-grid solar deployment, utility cost recovery, and industrial tariff frameworks in West Africa.',
    publishedAt: 'July 12, 2026',
    authors: ['Athena Energy & Climate Initiative'],
    topicTags: ['economy', 'development', 'public-policy'],
    coverImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200',
    url: 'https://athenacentre.org/research/energy-transition-metrics'
  }
];

export const SAMPLE_DAILY_ARTICLES: DailyArticle[] = [
  {
    id: 'cpd-subsidy-2026',
    slug: 'subsidy-conundrum-energy-inflation',
    category: 'ENERGY & ECONOMY',
    categorySlug: 'todays-brief',
    topicTags: ['economy', 'public-policy', 'governance'],
    title: "The Subsidy Conundrum: Navigating Nigeria's Energy Inflation",
    subtitle: 'An in-depth review of recent energy pricing policies, transport overheads, and fiscal trade-offs.',
    excerpt: 'As fuel price recalibrations ripple across inter-state transport networks, sub-national budgets face unprecedented pressure to balance social safety nets with infrastructure commitments.',
    whyItMatters: 'Energy pricing benchmarks directly dictate food transport costs, household inflation rates, and sub-national fiscal stability across all 36 states.',
    whatToWatchNext: 'Watch for upcoming FAAC allocation meetings and state legislative debates regarding emergency transport subsidies.',
    authorName: 'Annabel Orji',
    authorTitle: 'Senior Policy Analyst, ClearPath Media',
    publishedAt: 'August 6, 2026',
    updatedAt: 'August 6, 2026',
    readingTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1200',
    imageCaption: 'Fuel haulage trucks lined up at a distribution terminal in Lagos State.',
    imageCredit: 'ClearPath Media / Photo Desk',
    content: `### The Subsidy Conundrum: Navigating Nigeria's Energy Inflation

For decades, fuel subsidies represented a critical, albeit fiscally draining, component of the social contract in Nigeria. The sudden policy pivot to dismantle this regime has sparked a complex macroeconomic shift. While the federal government has clawed back billions in monthly savings, the secondary shocks have propagated swiftly through the domestic economy.

#### Transport Overheads and Local Logistics
The immediate casualty of rising petrol prices is the transport sector. Inter-state logistics costs have soared by upwards of 120%, directly impacting food supply chains. Agricultural produce moving from northern breadbaskets to southern urban centers now incurs premium transport rates, elevating food inflation to historic levels.

#### Sub-National Fiscal Allocations
A key argument for the subsidy removal was the promise of enhanced allocations to states and local government areas via the Federation Account Allocation Committee (FAAC). While state capitals are indeed reporting significantly higher nominal revenues, the purchasing power of these funds has been eroded by inflation and exchange rate depreciation.

#### The Policy Path Forward
To cushion the impact, experts recommend a phased investment in Compressed Natural Gas (CNG) public transport corridors and direct agricultural input subsidies. Without structural buffers, the fiscal space gained from subsidy removal risks being swallowed by systemic public discontent and declining consumer demand.`,
    supportingSources: [
      { title: 'National Bureau of Statistics — CPI & Inflation Report', url: 'https://nigerianstat.gov.ng' },
      { title: 'Central Bank of Nigeria Monetary Policy Communique', url: 'https://cbn.gov.ng' }
    ],
    relatedArticles: [
      { title: 'Electoral Act Reforms: Building Trust in Post-Election Technology', slug: 'electoral-act-reforms-2026', category: 'DEMOCRACY & GOVERNANCE' },
      { title: 'State In Focus: Rivers State Revenue Realignment', slug: 'state-in-focus-rivers-2026', category: 'STATE IN FOCUS' }
    ],
    relatedAthenaPublication: {
      title: 'Fiscal Decentralization & Sub-National Debt Sustainability in Nigeria',
      type: 'Athena Perspectives',
      summary: 'A quantitative analysis of state government internal revenue generation versus debt servicing costs under current FAAC allocation benchmarks.',
      url: 'https://athenacentre.org/research/fiscal-decentralization-2026'
    },
    relatedProgrammeVideo: {
      title: 'Daily Brief: Energy Policy & State Budget Balance',
      programmeName: 'Daily Brief with Annabel',
      youtubeUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=600'
    }
  },
  {
    id: 'cpd-electoral-2026',
    slug: 'electoral-act-reforms-2026',
    category: 'DEMOCRACY & GOVERNANCE',
    categorySlug: 'in-focus',
    topicTags: ['elections', 'institutions', 'national-assembly'],
    title: 'Electoral Act Reforms: Building Trust in Post-Election Technology',
    subtitle: 'How ongoing legislative proposals aim to digitize result transmission and secure voter verification.',
    excerpt: 'The National Assembly is considering sweeping amendments to statutory election transmission protocols to restore citizen trust in electronic result portals.',
    whyItMatters: 'Clear, tamper-proof result transmission standards reduce post-election litigation cycles and ensure voters hold elected officials accountable.',
    whatToWatchNext: 'Senate Committee on Electoral Matters public hearing scheduled for Thursday morning.',
    authorName: 'Elections & Governance Desk',
    authorTitle: 'ClearPath Media Editorial',
    publishedAt: 'August 6, 2026',
    readingTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&q=80&w=1200',
    imageCaption: 'Polling officials setting up electronic verification hardware during a civic demonstration.',
    imageCredit: 'INEC Media Relations',
    content: `### Electoral Act Reforms: Building Trust in Post-Election Technology

As Nigeria approaches its mid-term governance reviews, the debate surrounding the modernization of the electoral process has returned to the legislative forefront. The National Assembly is currently considering a series of amendments aimed at strengthening the statutory framework for electronic voting and transmission.

#### Digitizing Result Transmission
The core of the new proposals centers on making real-time upload of polling unit results a non-negotiable statutory requirement. By removing administrative discretion in the result collation chain, proponents argue that public confidence in election outcomes can be substantially restored.

#### Cybersecurity and Audit Trails
With increased technological dependence comes heightened exposure to digital vulnerabilities. The draft bill mandates regular, independent third-party audits of the electoral commission’s servers and backend databases. Furthermore, it outlines strict guidelines for forensic data preservation in the event of judicial challenges.

#### Public Outlook
Civil society organizations have largely welcomed the amendments but remain cautious about implementation timelines. "The technology itself is only as reliable as the institutional trust surrounding its operation," noted a lead policy analyst at ClearPath Media.`
  },
  {
    id: 'cpd-judicial-2026',
    slug: 'judicial-oversight-appellate-timelines',
    category: 'INSTITUTIONS & LAW',
    categorySlug: 'in-focus',
    topicTags: ['judiciary', 'institutions', 'governance'],
    title: 'Judicial Oversight: Streamlining Appellate Timelines for Commercial Disputes',
    subtitle: 'The Supreme Court introduces accelerated dockets to prevent multi-year contractual gridlocks.',
    excerpt: 'A new practice direction issued by the Chief Justice establishes strict statutory limits on commercial appeals, targeting a 180-day resolution window.',
    whyItMatters: 'Expedited commercial dispute resolution lowers the cost of doing business and enhances foreign direct investment confidence.',
    whatToWatchNext: 'First quarter review of commercial docket disposition rates by the National Judicial Council.',
    authorName: 'Legal & Judicial Desk',
    authorTitle: 'ClearPath Research Desk',
    publishedAt: 'August 6, 2026',
    readingTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200',
    imageCaption: 'The Supreme Court of Nigeria complex in the Central Business District, Abuja.',
    imageCredit: 'ClearPath Photo Archives',
    content: `### Judicial Oversight: Streamlining Appellate Timelines

Commercial litigations in Nigeria have long suffered from protracted appellate delays, often locking capital in escrow for over half a decade. The newly gazetted Practice Direction aims to enforce strict case management schedules for corporate and financial disputes.

#### Mandatory Pre-Trial Mediation
Under the new rules, appellate courts will mandate preliminary mediation sessions for monetary claims under ₦500 million before admitting full briefs of argument.

#### Electronic Brief Filings
All filings must now be transmitted through a unified digital court management registry, eliminating physical service bottlenecks between legal representatives.`
  },
  {
    id: 'cpd-weekly-gov-2026',
    slug: 'governance-brief-civil-service-digitization',
    category: 'GOVERNANCE BRIEF',
    categorySlug: 'governance-brief',
    topicTags: ['governance', 'public-policy', 'institutions'],
    title: 'Governance Brief: Civil Service Digitization & Payroll Audits',
    subtitle: 'Federal ministries deploy biometric tracking to eliminate ghost workers and streamline records.',
    excerpt: 'The Office of the Head of Civil Service reports a 14% drop in wage bill anomalies following the full integration of unified biometric verification.',
    whyItMatters: 'Plugging personnel expenditure leakages expands capital expenditure margins for critical public infrastructure.',
    whatToWatchNext: 'Phase 2 rollout extending biometric payroll audit across federal parastatals.',
    authorName: 'Governance Desk',
    authorTitle: 'ClearPath Media',
    publishedAt: 'August 6, 2026',
    readingTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    content: `### Civil Service Digitization & Payroll Audits

Administrative reform remains the linchpin of institutional effectiveness in Nigeria. The ongoing transition from physical paper archives to enterprise digital workflows is reducing bureaucratic turnarounds across federal ministries.`
  }
];

export const CURRENT_DAILY_EDITION: DailyEdition = {
  id: 'edition-2026-08-06',
  dateString: '2026-08-06',
  year: '2026',
  month: '08',
  day: '06',
  formattedDate: 'August 6, 2026',
  editionTitle: 'ClearPath Daily Briefing — Thursday, August 6, 2026',
  todaysBrief: SAMPLE_DAILY_ARTICLES[0],
  inFocus: [
    { goldNumber: '01', article: SAMPLE_DAILY_ARTICLES[1] },
    { goldNumber: '02', article: SAMPLE_DAILY_ARTICLES[2] }
  ],
  weeklyFeature: SAMPLE_DAILY_ARTICLES[3],
  indicator: {
    id: 'ind-1',
    number: '₦1.42T',
    title: 'Monthly FAAC Revenue Allocation Distribution',
    description: 'The total net disbursements shared among Federal, State, and Local Government Councils for the current budget cycle.',
    whyItMatters: 'Higher nominal receipts are offsetting debt servicing burdens at the state level, though real purchasing power remains constrained by foreign exchange rates.',
    supportingSourceTitle: 'FAAC Official Disbursement Communique',
    supportingSourceUrl: 'https://finance.gov.ng',
    publishedAt: 'August 6, 2026'
  },
  publicRecord: {
    id: 'pr-1',
    quote: 'We must treat public revenue allocation not as a discretionary favor from Abuja, but as a binding statutory trust owed to every Nigerian citizen in every local council.',
    speakerName: 'Dr. Yerima Aliyu',
    position: 'Chairman, Revenue Mobilisation Allocation and Fiscal Commission (RMAFC)',
    institution: 'RMAFC Secretariat',
    setting: 'National Assembly Joint Committee on Finance Hearing, Abuja',
    date: 'August 5, 2026',
    context: 'Delivered during the inaugural session on sub-national revenue sharing formula recalibration.',
    sourceLinkTitle: 'Official RMAFC Session Proceedings',
    sourceLinkUrl: 'https://rmafc.gov.ng'
  },
  clearpathLens: {
    id: 'lens-1',
    slug: 'remodeling-subnational-fiscal-autonomy',
    headline: 'Remodeling Sub-National Fiscal Autonomy: Beyond FAAC Allocations',
    featuredImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1200',
    introductorySummary: 'Nigeria’s federal structure faces a structural paradox: while 36 state governments command expanding nominal FAAC receipts, local revenue generation and municipal service delivery remain highly uneven.',
    institutionalAnalysis: `### Institutional Breakdown: The Mechanics of Sub-National Solvency

For decades, the monthly pilgrimage to Abuja for FAAC revenue sharing defined state budget planning. However, macroeconomic shifts, currency floating, and direct local government financial autonomy rulings are dismantling old assumptions.

#### 1. The Statutory Shift in Local Council Funding
Following landmark judicial clarifications regarding direct allocation to Local Government Areas (LGAs), state joint account committees are adapting to transparent transfer protocols. This shift alters how state governors manage municipal infrastructure financing.

#### 2. Internally Generated Revenue (IGR) Disparities
Data from state revenue boards reveals a widening gulf between industrial hubs (Lagos, Rivers, Ogun, Delta) and landlocked agricultural states. Building sustainable sub-national solvency requires state assemblies to streamline property tax, agricultural value chains, and digital business licensing.

#### 3. Institutional Accountability Frameworks
Without robust state house of assembly oversight, increased statutory transfers risk being absorbed by recurrent administrative overheads rather than capital infrastructure projects.`,
    relatedStories: [
      { title: 'The Subsidy Conundrum: Navigating Nigeria\'s Energy Inflation', slug: 'subsidy-conundrum-energy-inflation' },
      { title: 'Electoral Act Reforms: Building Trust in Post-Election Technology', slug: 'electoral-act-reforms-2026' }
    ],
    supportingSources: [
      { title: 'Supreme Court Ruling on Local Government Autonomy', url: 'https://supremecourt.gov.ng' },
      { title: 'ClearPath Sub-National Fiscal Audit Index 2026', url: 'https://clearpath.media' }
    ],
    relatedAthenaResearch: {
      title: 'Fiscal Decentralization & Sub-National Debt Sustainability in Nigeria',
      type: 'Athena Perspectives',
      summary: 'A quantitative analysis of state government internal revenue generation versus debt servicing costs under current FAAC allocation benchmarks.',
      url: 'https://athenacentre.org/research/fiscal-decentralization-2026'
    },
    whatToWatch: [
      'State House of Assembly hearings on 2027 Supplementary Budget proposals.',
      'Quarterly RMAFC review of horizontal revenue allocation factors.',
      'Implementation of state-level digital tax collection corridors.'
    ],
    publishedAt: 'August 6, 2026'
  },
  signalsToWatch: [
    {
      id: 'sig-1',
      dateOrDay: 'Mon, Aug 10',
      event: 'CBN Monetary Policy Committee (MPC) Rate Decision Meeting',
      shortExplanation: 'The central bank policy committee convenes in Abuja to set the benchmark interest rate amidst ongoing inflation pressures.',
      whyItMatters: 'Signals whether commercial borrowing costs will remain high for manufacturing and small businesses.',
      relatedLinkTitle: 'CBN Policy Schedule',
      relatedLinkUrl: 'https://cbn.gov.ng'
    },
    {
      id: 'sig-2',
      dateOrDay: 'Wed, Aug 12',
      event: 'National Assembly Public Hearing on Electoral Act Amendments',
      shortExplanation: 'Joint committee reviews public memoranda on electronic result transmission protocols and polling unit security.',
      whyItMatters: 'Will shape legal requirements for electoral technology ahead of upcoming off-cycle gubernatorial elections.',
      relatedLinkTitle: 'NASS Order Paper',
      relatedLinkUrl: 'https://nass.gov.ng'
    },
    {
      id: 'sig-3',
      dateOrDay: 'Fri, Aug 14',
      event: 'ECOWAS Extraordinary Summit on Regional Security Corridors',
      shortExplanation: 'West African heads of state gather in Abuja to discuss joint counter-terrorism patrols and border trade protocols.',
      whyItMatters: 'Impacts cross-border logistics and security along northern border corridors.',
      relatedLinkTitle: 'ECOWAS Official Portal',
      relatedLinkUrl: 'https://ecowas.int'
    },
    {
      id: 'sig-4',
      dateOrDay: 'Tue, Aug 18',
      event: 'Release of NBS Q2 Sub-National IGR Performance Report',
      shortExplanation: 'National Bureau of Statistics publishes audited revenue figures for all 36 states and the FCT.',
      whyItMatters: 'Provides evidence on which states are successfully diversifying away from FAAC reliance.',
      relatedLinkTitle: 'NBS Data Portal',
      relatedLinkUrl: 'https://nigerianstat.gov.ng'
    },
    {
      id: 'sig-5',
      dateOrDay: 'Thu, Aug 20',
      event: 'FAAC August Revenue Disbursement Session',
      shortExplanation: 'Federation Account Allocation Committee meets to approve federal, state, and local council disbursements.',
      whyItMatters: 'Determines monthly budget execution capacity across all tiers of government.',
      relatedLinkTitle: 'Ministry of Finance FAAC Portal',
      relatedLinkUrl: 'https://finance.gov.ng'
    }
  ],
  goDeeper: [
    {
      type: 'Background',
      title: 'Explainer: Understanding Nigeria’s Federation Account (FAAC) Sharing Formula',
      description: 'A step-by-step breakdown of how oil revenues, VAT, and custom duties are split between federal, state, and local governments.',
      buttonText: 'Read Explainer',
      linkUrl: '/explainers/insights'
    },
    {
      type: 'Evidence',
      title: 'Athena Research: Fiscal Decentralization & Sub-National Debt Sustainability',
      description: 'Quantitative evidence examining state debt servicing limits and local revenue generation benchmarks.',
      buttonText: 'Open Athena Paper',
      linkUrl: 'https://athenacentre.org/research/fiscal-decentralization-2026'
    },
    {
      type: 'Watch',
      title: 'OsitaInsight: The Mechanics of Sub-National Accountability',
      description: 'Osita Chidoka examines why state legislative oversight is crucial to preventing public expenditure leakages.',
      thumbnail: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=600',
      buttonText: 'Watch Programme',
      linkUrl: '/programmes/osita-insights'
    }
  ]
};

export const PAST_DAILY_EDITIONS: { dateString: string; formattedDate: string; title: string; link: string }[] = [
  { dateString: '2026-08-06', formattedDate: 'August 6, 2026', title: 'The Subsidy Conundrum & FAAC Revenue Realignment', link: '/daily/2026/08/06' },
  { dateString: '2026-08-05', formattedDate: 'August 5, 2026', title: 'Electoral Technology Mandates & State Assembly Oversight', link: '/daily/2026/08/05' },
  { dateString: '2026-08-04', formattedDate: 'August 4, 2026', title: 'ECOWAS Border Security Corridors & Grain Transport Logistics', link: '/daily/2026/08/04' },
  { dateString: '2026-07-17', formattedDate: 'July 17, 2026', title: 'Energy Pricing Shifts & Sub-National Fiscal Allocations', link: '/daily/2026/07/17' },
  { dateString: '2026-07-15', formattedDate: 'July 15, 2026', title: 'Electoral Act Amendments & Digital Result Integrity', link: '/daily/2026/07/15' },
];

export const WEEKLY_FEATURE_PUBLICATIONS: Record<string, { category: string; title: string; slug: string; image: string; intro: string; date: string }> = {
  'west-african-monitor': {
    category: 'WEST AFRICA MONITOR',
    title: 'ECOWAS Sanctions and Diplomatic Backchannels in the Sahel Corridor',
    slug: 'west-african-monitor',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1200',
    intro: 'How West African leaders are leveraging non-governmental mediation and traditional diplomatic channels to maintain cross-border security cooperation.',
    date: 'Monday Feature'
  },
  'state-in-focus': {
    category: 'STATE IN FOCUS',
    title: 'State in Focus: Rivers State Revenue Realignment and Capital Projects',
    slug: 'state-in-focus',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=1200',
    intro: 'Examining sub-national financial allocations, infrastructural bonds, and legislative oversight dynamics in Rivers State.',
    date: 'Tuesday Feature'
  },
  'lga-brief': {
    category: 'LGA BRIEF',
    title: 'LGA Brief: Grassroots Financial Autonomy and Municipal Service Audits',
    slug: 'lga-brief',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=1200',
    intro: 'How direct federal allocations to Local Government Areas are impacting primary healthcare funding and rural road maintenance.',
    date: 'Wednesday Feature'
  },
  'governance-brief': {
    category: 'GOVERNANCE BRIEF',
    title: 'Governance Brief: Civil Service Biometric Audits and Wage Bill Transparency',
    slug: 'governance-brief',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    intro: 'A national assessment of digital personnel management systems across federal and state ministries.',
    date: 'Thursday Feature'
  },
  'bccn-news': {
    category: 'BCCN NEWS',
    title: 'BCCN News: Sustainable Off-Grid Energy Corridors for Agro-Processing',
    slug: 'bccn-news',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200',
    intro: 'Exploring business, climate, and community initiatives driving decentralized solar power adoption in rural commercial clusters.',
    date: 'Weekly Feature'
  }
};

export function getWeeklyFeatureForDay(dayName?: string): { category: string; title: string; slug: string; image: string; intro: string; date: string } {
  const currentDay = dayName || new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  switch (currentDay) {
    case 'Monday':
      return WEEKLY_FEATURE_PUBLICATIONS['west-african-monitor'];
    case 'Tuesday':
      return WEEKLY_FEATURE_PUBLICATIONS['state-in-focus'];
    case 'Wednesday':
      return WEEKLY_FEATURE_PUBLICATIONS['lga-brief'];
    case 'Thursday':
      return WEEKLY_FEATURE_PUBLICATIONS['governance-brief'];
    case 'Friday':
    case 'Saturday':
    case 'Sunday':
    default:
      return WEEKLY_FEATURE_PUBLICATIONS['bccn-news'];
  }
}
