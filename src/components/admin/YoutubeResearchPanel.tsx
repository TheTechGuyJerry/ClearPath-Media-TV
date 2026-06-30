import React, { useState } from 'react';
import { collection, doc, setDoc, getDocs, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Programme, ProgrammeVideo } from '../../types';
import { getYoutubeVideoId } from '../../lib/youtube';
import { repairClearPathProgrammesAndVideoLinks } from '../../lib/seeder';
import { 
  Search, 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Edit, 
  Save, 
  X, 
  ExternalLink,
  Info
} from 'lucide-react';

interface DiscoveredVideo {
  title: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  suggestedProgramme: string; // Used as the Program Title string during research
  confidenceLevel: string;
  evidenceText: string;
  suggestedTopicTags: string[];
  suggestedSummary: string;
}

interface YoutubeResearchPanelProps {
  programmes: Programme[];
  onVideoApproved: () => void;
  effectiveRole?: string;
}

const ALLOWED_PROGRAMMES = [
  "Daily Brief with Annabel",
  "OsitaInsight",
  "ClearPath Insights",
  "Nigeria & Neighbours",
  "Election Matters",
  "Mekaria Series"
];

const STANDARD_PROGRAMMES: Record<string, Omit<Programme, 'createdAt' | 'updatedAt'>> = {
  "OsitaInsight": {
    id: 'osita-insights',
    title: 'OsitaInsight',
    slug: 'osita-insights',
    tagline: 'Reflective national choices and leadership pathways.',
    shortDescription: 'A structured conversation on executive judgment, responsibility, and choices.',
    fullDescription: 'Osita Chidoka invites leading thinkers, public servants, and change agents to review the three critical decisions or milestones that shaped their leadership tenure.',
    hostName: 'Osita Chidoka',
    formatType: 'interview',
    coverageArea: 'Nigeria',
    topicFocus: ['governance', 'leadership', 'choices', 'policies'],
    scheduleText: 'Twice Monthly',
    youtubePlaylistUrl: 'https://www.youtube.com/playlist?list=PL3H95x0BV9nA',
    coverImage: '/images/ositainsight.jpg',
    thumbnailImage: '/images/ositainsight.jpg',
    status: 'active',
    isFeatured: true,
    sortOrder: 1,
    seoTitle: 'OsitaInsight - ClearPath Media',
    seoDescription: 'Distilled conversations on leadership and choices with Osita Chidoka.'
  },
  "Daily Brief with Annabel": {
    id: 'daily-brief-with-annabel',
    title: 'Daily Brief with Annabel',
    slug: 'daily-brief-with-annabel',
    tagline: 'High-level civil summary without news chasing.',
    shortDescription: 'Weekday morning policy syntheses for busy business leaders and policy makers.',
    fullDescription: 'Presented by Annabel K., this 5-7 minute weekday briefing provides critical analysis of monetary shifts, legislative acts, and treasury decisions across West Africa.',
    hostName: 'Annabel K.',
    formatType: 'daily-brief',
    coverageArea: 'Nigeria & Africa',
    topicFocus: ['policy', 'economy', 'macro-finance', 'trade'],
    scheduleText: 'Weekdays at 7:00 AM WAT',
    youtubePlaylistUrl: 'https://www.youtube.com/playlist?list=PL3H95x0BV9nA',
    coverImage: '/images/daily_brief_annabel.jpg',
    thumbnailImage: '/images/daily_brief_annabel.jpg',
    status: 'active',
    isFeatured: true,
    sortOrder: 2,
    seoTitle: 'Daily Brief with Annabel - Policydistill',
    seoDescription: 'A direct weekday morning digest explaining major economic and societal transformations.'
  },
  "ClearPath Insights": {
    id: 'clearpath-insights',
    title: 'ClearPath Insights',
    slug: 'clearpath-insights',
    tagline: 'Visual blueprints breaking down system structures.',
    shortDescription: 'Clear visual graphics translating complex state processes into clear understandings.',
    fullDescription: 'Evergreen dynamic explainers tracking public finance loops, civil service processes, and constitutional power allocations.',
    hostName: 'ClearPath Team',
    formatType: 'analysis',
    coverageArea: 'Nigeria',
    topicFocus: ['systems', 'civics', 'mechanics', 'state-structure'],
    scheduleText: 'Ongoing Releases',
    youtubePlaylistUrl: 'https://www.youtube.com/playlist?list=PL3H95x0BV9nA',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeVLfCZOkjr_JQENUSHEqAjqhImldkoM6cBFtd6kJTkVvkqB1Wimrga4uO8bi_9o4q2GmcCqB1tZpqAGmQIDwPAH8F1lATsZJfeSCzrP22T0Mv2CtXzMkU1DGrd-n6wkR98R2pOU2-Bb8CoSuXOnxE-hNYap6qMwXPYvq3mXGh3sJTwEcq8rY7kMo7yUwcqwWZwNzxRmrh1F0qf5DlX7GX2ydgVgid5wF-DMmmYl5Ww1R3BtPERjhBA8yz74JaCGuiCimtXXaGFjk',
    thumbnailImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeVLfCZOkjr_JQENUSHEqAjqhImldkoM6cBFtd6kJTkVvkqB1Wimrga4uO8bi_9o4q2GmcCqB1tZpqAGmQIDwPAH8F1lATsZJfeSCzrP22T0Mv2CtXzMkU1DGrd-n6wkR98R2pOU2-Bb8CoSuXOnxE-hNYap6qMwXPYvq3mXGh3sJTwEcq8rY7kMo7yUwcqwWZwNzxRmrh1F0qf5DlX7GX2ydgVgid5wF-DMmmYl5Ww1R3BtPERjhBA8yz74JaCGuiCimtXXaGFjk',
    status: 'active',
    isFeatured: true,
    sortOrder: 3,
    seoTitle: 'ClearPath Insights - Civics Unmasked',
    seoDescription: 'Explaining state machines and corporate procedures clearly.'
  },
  "Nigeria & Neighbours": {
    id: 'nigeria-neighbours',
    title: 'Nigeria & Neighbours',
    slug: 'nigeria-neighbours',
    tagline: 'Regional diplomacy and Sahelian security.',
    shortDescription: 'Deep structural studies on West African regional trends and multi-lateral diplomacy.',
    fullDescription: 'Explores cross-border investments, maritime routes, ECOWAS initiatives, and security dynamics shaping West Africa.',
    hostName: 'ClearPath Analyst Group',
    formatType: 'documentary',
    coverageArea: 'Africa',
    topicFocus: ['diplomacy', 'geopolitics', 'Sahel', 'trade-routes'],
    scheduleText: 'Monthly special',
    youtubePlaylistUrl: '',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNKSTe017KwF4P5tDrfPbgUDFKdtbE0uX2CL4fe-GGzUZFgW2Kj7l_yhAFWN9KtcdYZeCtL6IrwUf7qgeJvB3WDo96DaS6teP4-dYR7PZERUdB5BQsSmE0XE2fbZt96Tb8aNpGN_kLOU8V1bBtB620uHO0cDp9aysehKGWjUZ26n52xtGLOmkKGUm-1oq1ySJxEAGbfi1G4wiP-jBPTemlTbpgo0FiF6qxlhAZ7m7MTqPJNhf8LEM48dn_AbHBKVU59GTG3BzWpzU',
    thumbnailImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNKSTe017KwF4P5tDrfPbgUDFKdtbE0uX2CL4fe-GGzUZFgW2Kj7l_yhAFWN9KtcdYZeCtL6IrwUf7qgeJvB3WDo96DaS6teP4-dYR7PZERUdB5BQsSmE0XE2fbZt96Tb8aNpGN_kLOU8V1bBtB620uHO0cDp9aysehKGWjUZ26n52xtGLOmkKGUm-1oq1ySJxEAGbfi1G4wiP-jBPTemlTbpgo0FiF6qxlhAZ7m7MTqPJNhf8LEM48dn_AbHBKVU59GTG3BzWpzU',
    status: 'active',
    isFeatured: false,
    sortOrder: 5,
    seoTitle: 'Nigeria & Neighbours - Regional Analysis',
    seoDescription: 'Understanding security networks and continental alignments.'
  },
  "Election Matters": {
    id: 'election-matters',
    title: 'Election Matters',
    slug: 'election-matters',
    tagline: 'Deconstructing active ballot structures.',
    shortDescription: 'In-depth analysis of electoral reform bills, voting counts, and franchise access.',
    fullDescription: 'Breaking down electoral commissions policies, voting technologies, boundaries, and democratic security indices.',
    hostName: 'Electoral Desk Lead',
    formatType: 'panel',
    coverageArea: 'Nigeria',
    topicFocus: ['elections', 'reform', 'voting-systems', 'civic-trust'],
    scheduleText: 'During political windows',
    youtubePlaylistUrl: '',
    coverImage: '/images/election_matters.jpg',
    thumbnailImage: '/images/election_matters.jpg',
    status: 'active',
    isFeatured: false,
    sortOrder: 4,
    seoTitle: 'Election Matters - ClearPath Media',
    seoDescription: 'Objective tracking of institutional ballots policies.'
  },
  "Mekaria Series": {
    id: 'mekaria-series',
    title: 'Mekaria Series',
    slug: 'mekaria-series',
    tagline: 'Grassroots development paradigms.',
    shortDescription: 'Exploring regional growth plans, local government allocations, and community projects.',
    fullDescription: 'Tracks local governance, budget accountability at state level, and the integration of small economic regions.',
    hostName: 'Local Governance Desk',
    formatType: 'commentary',
    coverageArea: 'Nigeria',
    topicFocus: ['grassroots', 'budgets', 'LGA-autonomy', 'community'],
    scheduleText: 'Twice Monthly',
    youtubePlaylistUrl: '',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG9UKkTBTJxrs0d89Z9THsm9d7HdnWdijMGia0urYSILrGjnBFjfSilnyT4Oc5m4QoBIqJ-EVppuRvCaBzLme6DsHM8LwXw89mms40fOwZVkQJkMaYck9XOxAh9mbR5JuoL65y2oCdx5x3haP0uBev3jW-HdVPXV-jiOcBbVV9VBBFhpQhHiMJiIgeuLSsYwYbzU_bFANePmutyYqlK7oMnynm60WgyG6pfsybx4z7bN3RcIoa4Smu-Vm9XntZA1ADTWNU94lfti0',
    thumbnailImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG9UKkTBTJxrs0d89Z9THsm9d7HdnWdijMGia0urYSILrGjnBFjfSilnyT4Oc5m4QoBIqJ-EVppuRvCaBzLme6DsHM8LwXw89mms40fOwZVkQJkMaYck9XOxAh9mbR5JuoL65y2oCdx5x3haP0uBev3jW-HdVPXV-jiOcBbVV9VBBFhpQhHiMJiIgeuLSsYwYbzU_bFANePmutyYqlK7oMnynm60WgyG6pfsybx4z7bN3RcIoa4Smu-Vm9XntZA1ADTWNU94lfti0',
    status: 'active',
    isFeatured: false,
    sortOrder: 6,
    seoTitle: 'Mekaria Series - Distilled Budgets',
    seoDescription: 'Empowering local communities with policy insights.'
  }
};

const VERIFIED_VIDEOS: DiscoveredVideo[] = [
  // Daily Brief with Annabel
  {
    title: "What Nigeria's Power Crisis Reveals About Governance",
    youtubeUrl: "https://www.youtube.com/watch?v=4T1rf2uE1eY",
    youtubeVideoId: "4T1rf2uE1eY",
    suggestedProgramme: "Daily Brief with Annabel",
    suggestedSummary: "An analytical overview discussing the systemic challenges in Nigeria's power sector and its broader implications on governance and public administration.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["GOVERNANCE", "POWER", "INFRASTRUCTURE"]
  },
  {
    title: "Nigeria Doesn't Reward Hard Work",
    youtubeUrl: "https://www.youtube.com/watch?v=WEA1_bXybRY",
    youtubeVideoId: "WEA1_bXybRY",
    suggestedProgramme: "Daily Brief with Annabel",
    suggestedSummary: "A critical commentary on meritocracy, economic incentives, and the structural challenges facing workforce productivity in Nigeria.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["WORKFORCE", "ECONOMY", "LABOR"]
  },
  {
    title: "The Billions Spent Without Public Scrutiny",
    youtubeUrl: "https://www.youtube.com/watch?v=viEdl4wj1TA",
    youtubeVideoId: "viEdl4wj1TA",
    suggestedProgramme: "Daily Brief with Annabel",
    suggestedSummary: "An investigative discussion on public finance transparency, government expenditure, and the necessity of accountability.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["TRANSPARENCY", "FINANCE", "GOVERNANCE"]
  },
  {
    title: "The Mysterious Side of Child Adoption",
    youtubeUrl: "https://www.youtube.com/watch?v=Iwp8dodPlF4",
    youtubeVideoId: "Iwp8dodPlF4",
    suggestedProgramme: "Daily Brief with Annabel",
    suggestedSummary: "A sensitive and detailed examination of the legal, ethical, and bureaucratic processes surrounding child adoption.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["SOCIETY", "LAW", "ADOPTION"]
  },
  {
    title: "When School Became A Crime Scene",
    youtubeUrl: "https://www.youtube.com/watch?v=cZ5NBt5duv4",
    youtubeVideoId: "cZ5NBt5duv4",
    suggestedProgramme: "Daily Brief with Annabel",
    suggestedSummary: "A sober analysis of safety in educational institutions, security policies, and student protection frameworks.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["SECURITY", "EDUCATION", "SAFETY"]
  },
  {
    title: "Can JAMB Rebuild Public Trust?",
    youtubeUrl: "https://www.youtube.com/watch?v=5rg64BhH8x0",
    youtubeVideoId: "5rg64BhH8x0",
    suggestedProgramme: "Daily Brief with Annabel",
    suggestedSummary: "A policy review evaluating the Joint Admissions and Matriculation Board's recent administrative reforms and trust levels.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["EDUCATION", "REFORM", "JAMB"]
  },
  {
    title: "Leadership Recruitment Process",
    youtubeUrl: "https://www.youtube.com/watch?v=l7Ik5NV2FFI",
    youtubeVideoId: "l7Ik5NV2FFI",
    suggestedProgramme: "Daily Brief with Annabel",
    suggestedSummary: "An analytical discourse on public leadership recruitment, political party systems, and credentialing in governance.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["LEADERSHIP", "POLITICS", "GOVERNANCE"]
  },
  {
    title: "MoniePoint CEO: Nigeria Has No Talents",
    youtubeUrl: "https://www.youtube.com/watch?v=B1zsDCYr7YM",
    youtubeVideoId: "B1zsDCYr7YM",
    suggestedProgramme: "Daily Brief with Annabel",
    suggestedSummary: "A discussion surrounding statements from tech executives about talent acquisition, educational gaps, and workforce readiness.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["TECH", "TALENT", "EDUCATION"]
  },
  {
    title: "Inside Nigeria's Drug Abuse Crisis",
    youtubeUrl: "https://www.youtube.com/watch?v=V7EdEpqEDI0",
    youtubeVideoId: "V7EdEpqEDI0",
    suggestedProgramme: "Daily Brief with Annabel",
    suggestedSummary: "A health and social policy overview detailing the surge in substance abuse and regulatory responses in urban centers.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["HEALTH", "SOCIETY", "POLICY"]
  },
  {
    title: "Nigeria Is Losing Control of Its Borders",
    youtubeUrl: "https://www.youtube.com/watch?v=PIlFCOCKpaI",
    youtubeVideoId: "PIlFCOCKpaI",
    suggestedProgramme: "Daily Brief with Annabel",
    suggestedSummary: "A geopolitical and homeland security discussion concerning border patrol agency limits, trade smuggling, and regional safety.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["SECURITY", "BORDERS", "GEOPOLITICS"]
  },
  {
    title: "Nigeria's UTME Results Reveal a Broken System",
    youtubeUrl: "https://www.youtube.com/watch?v=_81y1V4Ilzc",
    youtubeVideoId: "_81y1V4Ilzc",
    suggestedProgramme: "Daily Brief with Annabel",
    suggestedSummary: "An educational analysis on performance trends in national matriculation exams and systemic education shortfalls.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["EDUCATION", "UTME", "YOUTH"]
  },
  {
    title: "Peter Obi And The Politics Of Exclusion",
    youtubeUrl: "https://www.youtube.com/watch?v=tBRrCjv4LUo",
    youtubeVideoId: "tBRrCjv4LUo",
    suggestedProgramme: "Daily Brief with Annabel",
    suggestedSummary: "A commentary on electoral politics, representative inclusivity, and political movements in contemporary Nigeria.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["POLITICS", "OBI", "ELECTIONS"]
  },
  {
    title: "Hantavirus Still Has Health Experts Worried",
    youtubeUrl: "https://www.youtube.com/watch?v=IrFwQWFgNl4",
    youtubeVideoId: "IrFwQWFgNl4",
    suggestedProgramme: "Daily Brief with Annabel",
    suggestedSummary: "A public health briefing examining research updates, transmission vectors, and clinical concern around Hantavirus.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["HEALTH", "PANDEMIC", "RESEARCH"]
  },
  {
    title: "Xenophobia In South Africa",
    youtubeUrl: "https://www.youtube.com/watch?v=PxlOsSM5tmc",
    youtubeVideoId: "PxlOsSM5tmc",
    suggestedProgramme: "Daily Brief with Annabel",
    suggestedSummary: "An investigation of regional migration, diplomatic relations, and socioeconomic tensions underpinning domestic xenophobia.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["DIPLOMACY", "GLOBAL", "AFRICA"]
  },
  {
    title: "El-Rufai Just Got Blocked",
    youtubeUrl: "https://www.youtube.com/watch?v=gM5PBYBx460",
    youtubeVideoId: "gM5PBYBx460",
    suggestedProgramme: "Daily Brief with Annabel",
    suggestedSummary: "A political update on administrative vetoes, legislative confirmations, and major party dynamics.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["POLITICS", "LEGISLATION", "APPOINTMENTS"]
  },

  // OsitaInsight
  {
    title: "Nigeria Still Has No Stable Power",
    youtubeUrl: "https://www.youtube.com/watch?v=bOa95j2iHc4",
    youtubeVideoId: "bOa95j2iHc4",
    suggestedProgramme: "OsitaInsight",
    suggestedSummary: "A structural assessment on power distribution, infrastructure investment delays, and legislative changes.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["POWER", "ENERGY", "INFRASTRUCTURE"]
  },
  {
    title: "AI Is Making Humans Irrelevant",
    youtubeUrl: "https://www.youtube.com/watch?v=W8zJo4xzWf0",
    youtubeVideoId: "W8zJo4xzWf0",
    suggestedProgramme: "OsitaInsight",
    suggestedSummary: "A technical and sociological review exploring generative AI, labor market displacement, and future workforce transitions.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["TECH", "AI", "FUTURE"]
  },
  {
    title: "Why Good Ideas Don't Work in Nigeria",
    youtubeUrl: "https://www.youtube.com/watch?v=9512AmG0djI",
    youtubeVideoId: "9512AmG0djI",
    suggestedProgramme: "OsitaInsight",
    suggestedSummary: "A policy implementation breakdown identifying the gap between policy design and field execution in executive agencies.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["POLICY", "GOVERNANCE", "EXECUTION"]
  },
  {
    title: "Nigeria's Trillion Naira Illusion",
    youtubeUrl: "https://www.youtube.com/watch?v=cxERxZ4t_ik",
    youtubeVideoId: "cxERxZ4t_ik",
    suggestedProgramme: "OsitaInsight",
    suggestedSummary: "An economic analysis on national budgeting, currency valuation, and the realities of fiscal deficits.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["ECONOMY", "BUDGET", "FINANCE"]
  },
  {
    title: "The Hidden Cost of Online Banking in Nigeria",
    youtubeUrl: "https://www.youtube.com/watch?v=pwo-SFKe4QI",
    youtubeVideoId: "pwo-SFKe4QI",
    suggestedProgramme: "OsitaInsight",
    suggestedSummary: "A financial analysis of electronic transaction fees, bank charges, cyber security, and consumer protection.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["FINANCE", "BANKING", "TECH"]
  },
  {
    title: "The 10 Companies Who Own Nigeria's Economy",
    youtubeUrl: "https://www.youtube.com/watch?v=hB91sq8MtDg",
    youtubeVideoId: "hB91sq8MtDg",
    suggestedProgramme: "OsitaInsight",
    suggestedSummary: "A market concentration study looking at major conglomerates, industrial sectors, and corporate influence.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["ECONOMY", "CORPORATE", "MONOPOLY"]
  },
  {
    title: "Why Nigeria's Wealth Doesn't Reach Most People",
    youtubeUrl: "https://www.youtube.com/watch?v=Cthhn92_u1s",
    youtubeVideoId: "Cthhn92_u1s",
    suggestedProgramme: "OsitaInsight",
    suggestedSummary: "A wealth inequality review discussing economic distribution models, resource allocation, and tax policy.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["ECONOMY", "INEQUALITY", "POLICY"]
  },
  {
    title: "See Where Your Money Goes",
    youtubeUrl: "https://www.youtube.com/watch?v=4OBqf8FKgAU",
    youtubeVideoId: "4OBqf8FKgAU",
    suggestedProgramme: "OsitaInsight",
    suggestedSummary: "A citizen's guide to public expenditure, tracking tax utilization, and the structure of public revenue streams.",
    confidenceLevel: "HIGH",
    evidenceText: "Verified on ClearPath Media channels.",
    suggestedTopicTags: ["TAXES", "BUDGET", "CITIZENS"]
  }
];

export default function YoutubeResearchPanel({ programmes, onVideoApproved, effectiveRole }: YoutubeResearchPanelProps) {
  const [loading, setLoading] = useState(false);
  const [discoveredVideos, setDiscoveredVideos] = useState<DiscoveredVideo[]>([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingVideo, setEditingVideo] = useState<DiscoveredVideo | null>(null);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [overwriteMetadata, setOverwriteMetadata] = useState<boolean>(false);

  // Live YouTube API configurations
  const [apiKey, setApiKey] = useState<string>(import.meta.env.VITE_YOUTUBE_API_KEY || '');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testResult, setTestResult] = useState<string>('');
  const [playlistId, setPlaylistId] = useState<string>('UCqzz74rtbB7Nnvj4NTfprgg'); // uploads playlist ID

  const testApiConnection = async () => {
    if (!apiKey.trim()) {
      setTestStatus('error');
      setTestResult('Please enter a YouTube API key first.');
      return;
    }
    setTestStatus('testing');
    setErrorStatus(null);
    setTestResult('');
    try {
      let targetPlaylist = playlistId.trim() || 'UCqzz74rtbB7Nnvj4NTfprgg';
      if (targetPlaylist.startsWith('UC') && targetPlaylist.length === 24) {
        targetPlaylist = 'UU' + targetPlaylist.substring(2);
      }
      
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${encodeURIComponent(targetPlaylist)}&maxResults=1&key=${encodeURIComponent(apiKey.trim())}`;
      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        const channelTitle = data.items[0].snippet?.channelTitle || 'YouTube Feed';
        setTestStatus('success');
        setTestResult(`Successfully connected! Validated Feed Source: "${channelTitle}" uploads playlist.`);
      } else {
        setTestStatus('success');
        setTestResult(`Successfully connected! Validated Feed Source, but the playlist contains 0 videos currently.`);
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestResult(`Connection failed: ${err.message || err}`);
    }
  };

  const fetchLiveYoutubeVideos = async () => {
    if (!apiKey.trim()) {
      setErrorStatus('Please enter a YouTube API key.');
      return;
    }
    setLoading(true);
    setErrorStatus(null);
    setStatusMessage('Querying YouTube Data API...');
    try {
      // Get existing videos from firestore
      const existingSnap = await getDocs(collection(db, 'programmeVideos'));
      const existingVideoIds = new Set(existingSnap.docs.map(doc => doc.data().youtubeVideoId));

      let targetPlaylist = playlistId.trim() || 'UCqzz74rtbB7Nnvj4NTfprgg';
      if (targetPlaylist.startsWith('UC') && targetPlaylist.length === 24) {
        targetPlaylist = 'UU' + targetPlaylist.substring(2);
      }
      
      const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${encodeURIComponent(targetPlaylist)}&maxResults=50&key=${encodeURIComponent(apiKey.trim())}`;
      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (!data.items || data.items.length === 0) {
        setStatusMessage('No videos returned from the YouTube playlist.');
        return;
      }

      const rawItems = data.items;
      const parsed: DiscoveredVideo[] = [];
      let skippedCount = 0;

      for (const item of rawItems) {
        const snip = item.snippet;
        const vidId = snip?.resourceId?.videoId;
        if (!vidId) continue;

        // Skip duplicates!
        if (existingVideoIds.has(vidId)) {
          skippedCount++;
          continue;
        }

        const title = snip.title || 'Untitled YouTube Video';
        const description = snip.description || '';
        const combinedText = (title + ' ' + description).toLowerCase();

        // Implement automatic program mapping based on title/desc keywords!
        let suggestedProgramme = 'Election Matters'; // Default
        if (combinedText.includes('annabel') || combinedText.includes('daily brief') || combinedText.includes('daily briefing')) {
          suggestedProgramme = 'Daily Brief with Annabel';
        } else if (combinedText.includes('osita') || combinedText.includes('chidoka') || combinedText.includes('insights')) {
          suggestedProgramme = 'OsitaInsight';
        } else if (combinedText.includes('three things') || combinedText.includes('mekaria')) {
          suggestedProgramme = 'Mekaria Series';
        } else if (combinedText.includes('clearpath insights') || combinedText.includes('explainer') || combinedText.includes('explainers')) {
          suggestedProgramme = 'ClearPath Insights';
        } else if (combinedText.includes('neighbours') || combinedText.includes('neighbors') || combinedText.includes('neighbour')) {
          suggestedProgramme = 'Nigeria & Neighbours';
        } else if (combinedText.includes('election matters') || combinedText.includes('election')) {
          suggestedProgramme = 'Election Matters';
        }

        parsed.push({
          title,
          youtubeUrl: `https://www.youtube.com/watch?v=${vidId}`,
          youtubeVideoId: vidId,
          suggestedProgramme,
          confidenceLevel: 'HIGH',
          evidenceText: snip.description || 'Imported from YouTube playlist.',
          suggestedTopicTags: ['YouTube'],
          suggestedSummary: description.slice(0, 150) + (description.length > 150 ? '...' : '')
        });
      }

      setDiscoveredVideos(parsed);
      setSelectedIds(new Set(parsed.map(v => v.youtubeVideoId)));
      setStatusMessage(`Found ${data.items.length} videos from playlist. Loaded ${parsed.length} new drafts into view (${skippedCount} duplicates skipped!).`);
    } catch (err: any) {
      setErrorStatus(`API Fetch Error: ${err.message || err}`);
      setStatusMessage('');
    } finally {
      setLoading(false);
    }
  };

  const startAnalysis = async () => {
    setLoading(true);
    setErrorStatus(null);
    setStatusMessage('Loading ClearPath Media verified static video assets and running program alignment repair...');
    try {
      // Run automatic repair of programmes and video links
      await repairClearPathProgrammesAndVideoLinks();

      // Simulate rapid, clean load of the static seed library
      setDiscoveredVideos(VERIFIED_VIDEOS);
      setSelectedIds(new Set(VERIFIED_VIDEOS.map(r => r.youtubeVideoId)));
      setStatusMessage(`Successfully aligned programs and loaded ${VERIFIED_VIDEOS.length} verified ClearPath video structures into local view!`);
    } catch (err: any) {
      setErrorStatus(err?.message || 'Failure loading verified static library or repairing programs.');
      setStatusMessage('');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (idx: number) => {
    setEditingIndex(idx);
    setEditingVideo({ ...discoveredVideos[idx] });
  };

  const saveEdit = () => {
    if (editingIndex !== null && editingVideo) {
      const oldVideo = discoveredVideos[editingIndex];
      const newVideo = editingVideo;
      
      const copy = [...discoveredVideos];
      copy[editingIndex] = newVideo;
      setDiscoveredVideos(copy);
      
      // Transfer selections
      if (oldVideo.youtubeVideoId !== newVideo.youtubeVideoId) {
        setSelectedIds(prev => {
          const next = new Set(prev);
          if (next.has(oldVideo.youtubeVideoId)) {
            next.delete(oldVideo.youtubeVideoId);
            next.add(newVideo.youtubeVideoId);
          }
          return next;
        });
        
        setApprovedIds(prev => {
          const next = new Set(prev);
          if (next.has(oldVideo.youtubeVideoId)) {
            next.delete(oldVideo.youtubeVideoId);
            next.add(newVideo.youtubeVideoId);
          }
          return next;
        });
      }
      
      setEditingIndex(null);
      setEditingVideo(null);
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === discoveredVideos.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(discoveredVideos.map(v => v.youtubeVideoId)));
    }
  };

  const createMissingProgramme = async (title: string): Promise<string> => {
    const standard = STANDARD_PROGRAMMES[title];
    const idValue = standard ? standard.id : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slugValue = standard ? standard.slug : idValue;
    
    const progData: any = {
      id: idValue,
      title,
      slug: slugValue,
      tagline: standard?.tagline || `Exploring ${title}.`,
      shortDescription: standard?.shortDescription || `An in-depth look at ${title}.`,
      fullDescription: standard?.fullDescription || `Welcome to ${title}, where we seek truth and clarity explaining system structures.`,
      hostName: standard?.hostName || 'ClearPath Team',
      formatType: standard?.formatType || 'analysis',
      coverageArea: standard?.coverageArea || 'Nigeria',
      topicFocus: standard?.topicFocus || ['governance'],
      scheduleText: standard?.scheduleText || 'Periodic',
      youtubePlaylistUrl: standard?.youtubePlaylistUrl || '',
      coverImage: standard?.coverImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG9UKkTBTJxrs0d89Z9THsm9d7HdnWdijMGia0urYSILrGjnBFjfSilnyT4Oc5m4QoBIqJ-EVppuRvCaBzLme6DsHM8LwXw89mms40fOwZVkQJkMaYck9XOxAh9mbR5JuoL65y2oCdx5x3haP0uBev3jW-HdVPXV-jiOcBbVV9VBBFhpQhHiMJiIgeuLSsYwYbzU_bFANePmutyYqlK7oMnynm60WgyG6pfsybx4z7bN3RcIoa4Smu-Vm9XntZA1ADTWNU94lfti0',
      thumbnailImage: standard?.thumbnailImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDG9UKkTBTJxrs0d89Z9THsm9d7HdnWdijMGia0urYSILrGjnBFjfSilnyT4Oc5m4QoBIqJ-EVppuRvCaBzLme6DsHM8LwXw89mms40fOwZVkQJkMaYck9XOxAh9mbR5JuoL65y2oCdx5x3haP0uBev3jW-HdVPXV-jiOcBbVV9VBBFhpQhHiMJiIgeuLSsYwYbzU_bFANePmutyYqlK7oMnynm60WgyG6pfsybx4z7bN3RcIoa4Smu-Vm9XntZA1ADTWNU94lfti0',
      status: 'active',
      isFeatured: standard?.isFeatured !== undefined ? standard.isFeatured : false,
      sortOrder: standard?.sortOrder || 10,
      seoTitle: standard?.seoTitle || `${title} - ClearPath`,
      seoDescription: standard?.seoDescription || `Understanding ${title} policies clearly.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'programmes', idValue), progData);
    return idValue;
  };

  const persistVideo = async (video: DiscoveredVideo) => {
    if (effectiveRole === 'viewer') {
      throw new Error('Access Denied: Read-only viewers are not allowed to persist video assets.');
    }
    // 1. Exact title matching & Seeding programmes if missing
    const matchedTitle = video.suggestedProgramme;
    const progSnap = await getDocs(collection(db, 'programmes'));
    const progList = progSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    
    let targetProg = progList.find(p => p.title.trim() === matchedTitle.trim());
    let progId = '';
    let progTitle = '';
    
    if (!targetProg) {
      progId = await createMissingProgramme(matchedTitle);
      progTitle = matchedTitle;
    } else {
      progId = targetProg.id;
      progTitle = targetProg.title;
    }

    const slug = video.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const docId = `${progId}_${video.youtubeVideoId}`;

    // Part E check: Avoid overwriting manual admin edits
    const docRef = doc(db, 'programmeVideos', docId);
    try {
      const existingSnap = await getDoc(docRef);
      if (existingSnap.exists() && !overwriteMetadata) {
        // Document exists and overwrite toggle is turned off, keep as is
        setApprovedIds(prev => {
          const next = new Set(prev);
          next.add(video.youtubeVideoId);
          return next;
        });
        return;
      }
    } catch (e) {
      console.warn("Could not inspect existing record state:", e);
    }

    const videoDoc: any = {
      id: docId, // Prevent duplication by using combined unique docId
      programmeId: progId,
      programmeTitle: progTitle,
      title: video.title,
      slug: slug || video.youtubeVideoId,
      shortSummary: video.suggestedSummary,
      fullDescription: video.suggestedSummary,
      youtubeUrl: video.youtubeUrl,
      youtubeVideoId: video.youtubeVideoId,
      embedUrl: `https://www.youtube.com/embed/${video.youtubeVideoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`,
      duration: '', // omitted from UI
      presenters: progId === 'osita-insights' ? 'Osita Chidoka' : (progId === 'daily-brief' || progId === 'daily-brief-with-annabel') ? 'Annabel K.' : 'ClearPath Analyst',
      guests: '',
      transcript: video.evidenceText,
      keyPoints: '• Verified on ClearPath Media channels.',
      sourceLinks: 'https://clearpath.media',
      topicTags: video.suggestedTopicTags || ['CIVICS'],
      coverageArea: (progId === 'daily-brief' || progId === 'daily-brief-with-annabel') ? 'Nigeria & Africa' : 'Nigeria',
      status: 'draft',
      isFeatured: false,
      importMethod: 'verified_static_seed',
      source: 'verified_clearpath_youtube_library',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: serverTimestamp(),
      importedFromYoutube: true,
      lastSyncedAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'programmeVideos', docId), videoDoc);
    setApprovedIds(prev => {
      const next = new Set(prev);
      next.add(video.youtubeVideoId);
      return next;
    });
  };

  const approveIndividual = async (idx: number) => {
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Read-only viewers are not allowed to persist video assets.');
      return;
    }
    const video = discoveredVideos[idx];
    try {
      await persistVideo(video);
      alert(`"${video.title}" approved and populated successfully under program!`);
      onVideoApproved();
    } catch (err: any) {
      alert('Error approving video: ' + err.message);
    }
  };

  const approveSelected = async () => {
    if (effectiveRole === 'viewer') {
      alert('Access Denied: Read-only viewers are not allowed to persist video assets.');
      return;
    }
    const toApprove = discoveredVideos.filter(v => selectedIds.has(v.youtubeVideoId) && !approvedIds.has(v.youtubeVideoId));
    if (toApprove.length === 0) {
      alert('No unapproved selected videos to save.');
      return;
    }

    try {
      setLoading(true);
      setStatusMessage(`Saving ${toApprove.length} approved videos and seeding programmes if needed...`);
      for (const video of toApprove) {
        await persistVideo(video);
      }
      alert(`Success! Saved ${toApprove.length} approved videos permanently.`);
      setStatusMessage(`Database successfully updated! Saved ${toApprove.length} video assets.`);
      onVideoApproved();
    } catch (err: any) {
      alert('Error during batch save: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-on-surface">
      <div className="bg-white p-6 border border-outline-variant rounded-lg shadow-sm">
        <span className="text-[10px] uppercase text-primary font-bold font-mono tracking-wider bg-secondary px-2.5 py-0.5 rounded">ClearPath Media TV API Discovery</span>
        <h1 className="font-display font-semibold text-2xl text-primary mt-1.5 mb-2">YouTube Video Discovery Integration</h1>
        <p className="text-sm text-on-surface-variant max-w-2xl mb-6">
          Query live video assets directly from the official YouTube Data API. Map them dynamically into program folders, filter duplicates automatically, and save as drafts for final validation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low p-5 rounded-lg border border-outline-variant mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">YouTube API Key</label>
              <input
                type="password"
                placeholder={apiKey ? "••••••••••••••••••••••••••••••••••••" : "No API key configured. Enter YouTube V3 API Key..."}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full text-xs font-mono p-2.5 bg-white border border-outline rounded focus:outline-primary"
              />
              <div className="flex justify-between items-center mt-1.5">
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  Reads from VITE_YOUTUBE_API_KEY environment variable if preconfigured.
                </p>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${apiKey ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  API Key Detected: {apiKey ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-primary uppercase tracking-wider mb-1.5">Source Playlist ID (Default: Channel Uploads)</label>
              <input
                type="text"
                placeholder="Playlist ID (e.g. UCqzz74rtbB7Nnvj4NTfprgg)"
                value={playlistId}
                onChange={(e) => setPlaylistId(e.target.value)}
                className="w-full text-xs font-mono p-2.5 bg-white border border-outline rounded focus:outline-primary"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between space-y-4">
            <div>
              <span className="block text-xs font-bold text-primary uppercase tracking-wider mb-2">Discovery Diagnostics Center</span>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); testApiConnection(); }}
                    disabled={testStatus === 'testing'}
                    className="bg-secondary hover:bg-secondary-container text-primary text-[11px] font-semibold px-4 py-2 rounded transition-colors"
                  >
                    {testStatus === 'testing' ? 'Testing...' : 'Test YouTube API Connection'}
                  </button>
                  
                  {testStatus === 'success' && <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded">✓ Connection Active</span>}
                  {testStatus === 'error' && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded">✗ Connection Failed</span>}
                  {testStatus === 'testing' && <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded animate-pulse">Checking credentials...</span>}
                </div>

                {testResult && (
                  <p className={`p-2.5 rounded text-[11px] font-mono leading-relaxed border ${
                    testStatus === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                  }`}>
                    {testResult}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-outline-variant flex flex-wrap gap-3 items-center justify-between">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="overwriteMetadata"
                  checked={overwriteMetadata} 
                  onChange={(e) => setOverwriteMetadata(e.target.checked)}
                  className="cursor-pointer rounded border-outline"
                />
                <label htmlFor="overwriteMetadata" className="text-[11px] font-medium text-on-surface-variant cursor-pointer select-none">
                  Overwrite existing video metadata / overrides
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); startAnalysis(); }}
                  disabled={loading}
                  className="bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline px-4 py-2.5 rounded text-xs font-semibold cursor-pointer transition-colors"
                  title="Fall back to the predefined seed list"
                >
                  Load Predefined Seed List
                </button>

                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); fetchLiveYoutubeVideos(); }}
                  disabled={loading}
                  className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Search className="w-4 h-4" /> 
                  {loading ? 'Fetching...' : 'Fetch Latest Videos'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-4 p-3 bg-surface-container-low text-xs font-mono text-primary flex items-center gap-2 rounded border border-outline-variant">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {errorStatus && (
          <div className="mt-4 p-4 bg-error/10 text-error rounded-lg flex items-start gap-3 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Sync suspended</p>
              <p className="mt-1">{errorStatus}</p>
            </div>
          </div>
        )}
      </div>

      {discoveredVideos.length > 0 && (
        <div className="space-y-4">
          <div className="bg-white p-4 border border-outline-variant rounded-lg flex flex-col md:flex-row justify-between items-center gap-2 shadow-xs">
            <div className="text-xs text-on-surface-variant">
              <span>Selected <strong className="text-primary">{selectedIds.size}</strong> out of {discoveredVideos.length} found. </span>
              {approvedIds.size > 0 && (
                <span className="text-green-700 font-semibold">• {approvedIds.size} successfully saved</span>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); approveSelected(); }}
              disabled={loading || selectedIds.size === 0}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold text-xs px-4 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Database className="w-3.5 h-3.5" /> Approve & Save Selected ({selectedIds.size})
            </button>
          </div>

          <div className="bg-white border border-outline-variant rounded-lg overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[1000px]">
                <thead className="bg-surface-container-high border-b border-outline-variant text-[10px] font-bold text-on-surface uppercase tracking-wider">
                  <tr>
                    <th className="p-3 w-10 text-center">
                      <input 
                        type="checkbox" 
                        className="cursor-pointer rounded border-outline"
                        checked={selectedIds.size === discoveredVideos.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="p-3 w-28">Preview</th>
                    <th className="p-3">Video Title & ID</th>
                    <th className="p-3">Suggested Programme</th>
                    <th className="p-3">Topic Tags</th>
                    <th className="p-3">Editable Summary</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {discoveredVideos.map((video, idx) => {
                    const isEditing = editingIndex === idx;
                    const isApproved = approvedIds.has(video.youtubeVideoId);
                    const isSelected = selectedIds.has(video.youtubeVideoId);

                    return (
                      <tr 
                        key={video.youtubeVideoId} 
                        className={`hover:bg-surface-container-low transition-colors ${
                          isApproved ? 'bg-green-50/40' : ''
                        }`}
                      >
                        {/* Checkbox selector */}
                        <td className="p-3 text-center">
                          <input 
                            type="checkbox"
                            className="cursor-pointer rounded border-outline"
                            disabled={isApproved}
                            checked={isSelected || isApproved}
                            onChange={() => toggleSelect(video.youtubeVideoId)}
                          />
                        </td>

                        {/* Thumbnail preview */}
                        <td className="p-3">
                          <div className="relative w-24 h-14 bg-gray-100 rounded overflow-hidden shadow-xs border border-outline">
                            <img 
                              referrerPolicy="no-referrer"
                              src={`https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`} 
                              alt="thumbnail"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>

                        {/* Video info */}
                        <td className="p-3 max-w-xs">
                          {isEditing ? (
                            <div className="space-y-2 bg-slate-50 p-2 rounded border border-gray-200">
                              <div>
                                <label className="block text-[9px] uppercase font-bold text-gray-400 mb-0.5">Title</label>
                                <input
                                  type="text"
                                  value={editingVideo?.title || ''}
                                  className="w-full px-2 py-1 border rounded text-xs bg-white text-primary font-medium focus:ring-1 focus:ring-primary"
                                  onChange={e => setEditingVideo({ ...editingVideo!, title: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase font-bold text-gray-400 mb-0.5">YouTube URL</label>
                                <input
                                  type="text"
                                  value={editingVideo?.youtubeUrl || ''}
                                  placeholder="https://www.youtube.com/watch?v=..."
                                  className="w-full px-2 py-1 border rounded text-[11px] bg-white font-mono text-gray-700"
                                  onChange={e => {
                                    const url = e.target.value;
                                    const extractedId = getYoutubeVideoId(url);
                                    setEditingVideo({ 
                                      ...editingVideo!, 
                                      youtubeUrl: url,
                                      youtubeVideoId: extractedId || editingVideo!.youtubeVideoId 
                                    });
                                  }}
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase font-bold text-gray-400 mb-0.5">Video ID</label>
                                <input
                                  type="text"
                                  maxLength={11}
                                  value={editingVideo?.youtubeVideoId || ''}
                                  placeholder="11-char ID"
                                  className="w-full px-2 py-1 border rounded text-xs bg-white font-mono text-primary font-bold"
                                  onChange={e => setEditingVideo({ 
                                    ...editingVideo!, 
                                    youtubeVideoId: e.target.value,
                                    youtubeUrl: e.target.value.length === 11 ? `https://www.youtube.com/watch?v=${e.target.value}` : editingVideo!.youtubeUrl
                                  })}
                                />
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className="font-bold text-primary leading-snug">{video.title}</p>
                              <span className="font-mono text-[10px] text-on-surface-variant block mt-1">
                                ID: {video.youtubeVideoId} • <a href={video.youtubeUrl} target="_blank" rel="noreferrer" className="text-secondary hover:underline inline-flex items-center gap-0.5">Watch <ExternalLink className="w-2.5 h-2.5" /></a>
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Programme assignment dropdown */}
                        <td className="p-3">
                          {isEditing ? (
                            <select
                              value={editingVideo?.suggestedProgramme || ''}
                              className="px-2 py-1 border rounded text-xs bg-white"
                              onChange={e => setEditingVideo({ ...editingVideo!, suggestedProgramme: e.target.value })}
                            >
                              {ALLOWED_PROGRAMMES.map(title => (
                                <option key={title} value={title}>{title}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="font-semibold text-primary/80 bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                              {video.suggestedProgramme}
                            </span>
                          )}
                        </td>

                        {/* Topic tags */}
                        <td className="p-3 font-mono text-[10px] text-gray-500 max-w-[150px]">
                          {isEditing ? (
                            <input
                              type="text"
                              placeholder="Comma-separated tags"
                              value={editingVideo?.suggestedTopicTags?.join(', ') || ''}
                              className="w-full px-2 py-1 border rounded text-xs bg-transparent"
                              onChange={e => setEditingVideo({ ...editingVideo!, suggestedTopicTags: e.target.value.split(',').map(t => t.trim().toUpperCase()) })}
                            />
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {video.suggestedTopicTags?.map(tag => (
                                <span key={tag} className="bg-surface-container-highest px-1.5 py-0.5 rounded font-bold text-[9px] text-on-surface-variant">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>

                        {/* Summary */}
                        <td className="p-3 max-w-sm text-on-surface-variant">
                          {isEditing ? (
                            <textarea
                              rows={2}
                              value={editingVideo?.suggestedSummary || ''}
                              className="w-full p-1 border rounded text-[11px] bg-transparent"
                              onChange={e => setEditingVideo({ ...editingVideo!, suggestedSummary: e.target.value })}
                            />
                          ) : (
                            <span className="text-[11px] leading-relaxed block">{video.suggestedSummary}</span>
                          )}
                        </td>

                        {/* Individual Actions */}
                        <td className="p-3 text-right space-x-2 shrink-0 w-32">
                          {isApproved ? (
                            <span className="text-green-700 font-bold text-xs inline-flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" /> Saved
                            </span>
                          ) : isEditing ? (
                            <div className="inline-flex gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); saveEdit(); }}
                                className="bg-primary hover:bg-primary-container text-white p-1 rounded font-semibold text-[10px] cursor-pointer"
                                title="Save current modifications"
                              >
                                <Save className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingIndex(null); }}
                                className="bg-gray-100 hover:bg-gray-250 text-gray-700 p-1 rounded font-semibold text-[10px] cursor-pointer"
                                title="Cancel editing"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="inline-flex gap-1.5 pt-1">
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); startEdit(idx); }}
                                className="text-gray-400 hover:text-primary p-1 cursor-pointer"
                                title="Edit suggested metadata"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); approveIndividual(idx); }}
                                className="bg-green-100 hover:bg-green-200 text-green-800 font-bold px-2.5 py-1 rounded text-[10px] cursor-pointer"
                                title="Approve & Persist directly"
                              >
                                Approve
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Static Info note */}
      <div className="bg-blue-50 border border-blue-150 p-4 rounded-lg text-xs text-blue-900 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
        <div>
          <p className="font-bold">Safer Production Seeding Workflow</p>
          <p className="mt-1 leading-relaxed">
            Unlike legacy dynamic engines requiring API keys or failing dynamically, this seed tool imports verified videos on clear channels with custom tag mappings. Clean, immediate, and completely secure.
          </p>
        </div>
      </div>
    </div>
  );
}
