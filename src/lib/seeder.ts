import { db } from './firebase';
import { doc, setDoc, collection, getDocs, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Programme, Explainer, SiteSettings } from '../types';
import { COMPLETE_CATALOG_VIDEOS } from '../data/complete_catalog_data';

export async function seedProductionDatabase(currentUserUid: string, currentUserEmail: string, currentDisplayName: string): Promise<{ dailyBriefCount: number; ositaInsightsCount: number; errors?: string[] }> {
  // 1. Programmes
  const programmesToSeed: Programme[] = [
    {
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
      seoDescription: 'Distilled conversations on leadership and choices with Osita Chidoka.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
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
      seoDescription: 'A direct weekday morning digest explaining major economic and societal transformations.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
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
      seoDescription: 'Explaining state machines and corporate procedures clearly.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
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
      seoDescription: 'Understanding security networks and continental alignments.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
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
      seoDescription: 'Objective tracking of institutional ballots policies.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
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
      seoDescription: 'Empowering local communities with policy insights.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  for (const prog of programmesToSeed) {
    await setDoc(doc(db, 'programmes', prog.id), prog);
  }

  // 2. Explainers
  const explainersToSeed: Explainer[] = [
    {
      id: 'explaining-nigeria',
      title: 'Explaining Nigeria',
      slug: 'explaining-nigeria',
      tagline: 'Understanding structural institutions beyond individuals.',
      shortDescription: 'Establishing ClearPath as an authoritative interpreter of governance structures and federal dynamics.',
      fullDescription: 'Our framework details how exclusive list structures work, the boundaries of local authority, and the actual mechanics of state budgets.',
      coverageArea: 'Nigeria',
      topicFocus: ['federalism', 'institutions', 'legislation', 'autonomy'],
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd1xOuy3teqvz7a_E3Uf0JxXXeB7y-va4puR9WhlYOaMxZRra2hlgpd3Er58gCb15XLovnEFYIScjBj89lWXb5oFgkW2jNEObBh0ugl4GciFh2VrdXS3DZvdz0-rQzL-78nxsqThMacVb5RJQOMt6yhQuxiM831CmW0FzCtgODW5x7FDzy8VVJnZjYpwqN9umcCXTpDnTy3qn7djWGztFO2vXbMK1gPi0RXU1wYuVcl4S02-afhNpYxi3qrppr4siC1nHgEJeTecs',
      thumbnailImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd1xOuy3teqvz7a_E3Uf0JxXXeB7y-va4puR9WhlYOaMxZRra2hlgpd3Er58gCb15XLovnEFYIScjBj89lWXb5oFgkW2jNEObBh0ugl4GciFh2VrdXS3DZvdz0-rQzL-78nxsqThMacVb5RJQOMt6yhQuxiM831CmW0FzCtgODW5x7FDzy8VVJnZjYpwqN9umcCXTpDnTy3qn7djWGztFO2vXbMK1gPi0RXU1wYuVcl4S02-afhNpYxi3qrppr4siC1nHgEJeTecs',
      status: 'active',
      isFeatured: true,
      sortOrder: 1,
      seoTitle: 'Explaining Nigeria - Authority Series',
      seoDescription: 'Authoritative explanations on West Africa federal powers.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'explaining-africa',
      title: 'Explaining Africa',
      slug: 'explaining-africa',
      tagline: 'Distilling African sovereign systems.',
      shortDescription: 'Bridging the systemic information deficit about national structures across the continent.',
      fullDescription: 'Investigating institutional structures, central bank operations, power transfers, and socio-economic realities.',
      coverageArea: 'Africa',
      topicFocus: ['continent', 'sovereign', 'macro-civics', 'mechanisms'],
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNKSTe017KwF4P5tDrfPbgUDFKdtbE0uX2CL4fe-GGzUZFgW2Kj7l_yhAFWN9KtcdYZeCtL6IrwUf7qgeJvB3WDo96DaS6teP4-dYR7PZERUdB5BQsSmE0XE2fbZt96Tb8aNpGN_kLOU8V1bBtB620uHO0cDp9aysehKGWjUZ26n52xtGLOmkKGUm-1oq1ySJxEAGbfi1G4wiP-jBPTemlTbpgo0FiF6qxlhAZ7m7MTqPJNhf8LEM48dn_AbHBKVU59GTG3BzWpzU',
      thumbnailImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNKSTe017KwF4P5tDrfPbgUDFKdtbE0uX2CL4fe-GGzUZFgW2Kj7l_yhAFWN9KtcdYZeCtL6IrwUf7qgeJvB3WDo96DaS6teP4-dYR7PZERUdB5BQsSmE0XE2fbZt96Tb8aNpGN_kLOU8V1bBtB620uHO0cDp9aysehKGWjUZ26n52xtGLOmkKGUm-1oq1ySJxEAGbfi1G4wiP-jBPTemlTbpgo0FiF6qxlhAZ7m7MTqPJNhf8LEM48dn_AbHBKVU59GTG3BzWpzU',
      status: 'active',
      isFeatured: true,
      sortOrder: 2,
      seoTitle: 'Explaining Africa - Distilled Systems',
      seoDescription: 'Deep dives on African macroeconomics and frameworks.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  for (const ex of explainersToSeed) {
    await setDoc(doc(db, 'explainers', ex.id), ex);
  }

  // 3. Site Settings
  const defaultSettings: SiteSettings = {
    id: 'primary',
    siteName: 'ClearPath Media',
    siteTagline: 'Systems, Not Headlines',
    heroTitle: 'ClearPath Media',
    heroSubtitle: 'Public intelligence to interpret West African governance and policies without the noise.',
    heroVideoUrl: 'https://www.youtube.com/watch?v=3H95x0BV9nA',
    heroVideoId: '3H95x0BV9nA',
    featuredProgrammeId: 'osita-insights',
    featuredExplainerId: 'explaining-nigeria',
    featuredBriefingId: '',
    youtubeChannelUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    xUrl: '',
    tiktokUrl: '',
    contactEmail: 'contact@clearpath.media',
    partnershipEmail: 'partnerships@clearpath.media',
    newsletterTitle: 'Subscribe to the Daily Brief',
    newsletterDescription: 'A weekday morning briefing to understand deep system design inside civil policies.',
    footerText: '© 2026 ClearPath Media. All rights reserved.',
    updatedAt: new Date().toISOString()
  };

  await setDoc(doc(db, 'siteSettings', 'primary'), defaultSettings);

  // 4. Admin record
  if (currentUserUid) {
    await setDoc(doc(db, 'users', currentUserUid), {
      uid: currentUserUid,
      email: currentUserEmail,
      name: currentDisplayName || 'Administrator',
      role: 'admin',
      createdAt: new Date().toISOString()
    });
  }

  return { dailyBriefCount: 0, ositaInsightsCount: 0, errors: [] };
}

export async function repairClearPathProgrammesAndVideoLinks(): Promise<{ repairedProgrammesCount: number; repairedVideosCount: number }> {
  // 1. Fetch all existing programmes
  const progSnap = await getDocs(collection(db, 'programmes'));
  const existingProgs = progSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));

  // Definition of the 6 canonical programmes
  const canonicalProgs: Programme[] = [
    {
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
      seoDescription: 'Distilled conversations on leadership and choices with Osita Chidoka.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
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
      scheduleText: 'Weekdays at 9:00 AM WAT',
      youtubePlaylistUrl: 'https://www.youtube.com/playlist?list=PL3H95x0BV9nA',
      coverImage: '/images/daily_brief_annabel.jpg',
      thumbnailImage: '/images/daily_brief_annabel.jpg',
      status: 'active',
      isFeatured: true,
      sortOrder: 2,
      seoTitle: 'Daily Brief with Annabel - Policydistill',
      seoDescription: 'A direct weekday morning digest explaining major economic and societal transformations.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
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
      seoDescription: 'Explaining state machines and corporate procedures clearly.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
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
      seoDescription: 'Understanding security networks and continental alignments.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
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
      seoDescription: 'Objective tracking of institutional ballots policies.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
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
      seoDescription: 'Empowering local communities with policy insights.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const idMap: Record<string, string> = {
    'osita-insights': 'osita-insights',
    'daily-brief-with-annabel': 'daily-brief-with-annabel',
    'clearpath-insights': 'clearpath-insights',
    'nigeria-neighbours': 'nigeria-neighbours',
    'election-matters': 'election-matters',
    'mekaria-series': 'mekaria-series'
  };

  let repairedProgrammesCount = 0;

  // Process the programmes
  for (const canonical of canonicalProgs) {
    const normalizedCanonicalTitle = canonical.title.trim().toLowerCase();
    const cleanCanonicalSlug = canonical.slug.trim().toLowerCase();
    
    // Find all matching existing programmes by title, slug, or ID
    const matches = existingProgs.filter(p => {
      const titleMatch = (p.title || '').trim().toLowerCase() === normalizedCanonicalTitle;
      const slugMatch = (p.slug || '').trim().toLowerCase() === cleanCanonicalSlug || (p.id || '').trim().toLowerCase() === cleanCanonicalSlug;
      const idMatch = (p.id || '').trim().toLowerCase() === cleanCanonicalSlug;
      return titleMatch || slugMatch || idMatch;
    });

    const targetId = canonical.id;
    let originalCreatedAt = canonical.createdAt;

    // Record mappings and delete non-canonical duplicates
    for (const match of matches) {
      if (match.createdAt && originalCreatedAt === canonical.createdAt) {
        originalCreatedAt = match.createdAt;
      }
      
      if (match.id !== targetId) {
        idMap[match.id] = targetId;
        idMap[match.slug || ''] = targetId;
        try {
          await deleteDoc(doc(db, 'programmes', match.id));
          console.log(`Deleted duplicate programme doc from Firestore: ${match.id}`);
        } catch (err) {
          console.error(`Failed to delete duplicate programme doc ${match.id}:`, err);
        }
      }
    }

    // Explicitly add mapping for the target ID and canonical slug
    idMap[canonical.slug] = targetId;
    idMap[targetId] = targetId;

    const mergedData = {
      ...canonical,
      id: targetId,
      createdAt: originalCreatedAt,
      updatedAt: new Date().toISOString(),
      status: 'active' as const
    };

    await setDoc(doc(db, 'programmes', targetId), mergedData, { merge: true });
    repairedProgrammesCount++;
  }

  // Ensure the 2 explainers are active as well
  const explainersToUpsert = [
    {
      id: 'explaining-nigeria',
      title: 'Explaining Nigeria',
      slug: 'explaining-nigeria',
      status: 'active' as const,
      tagline: 'Understanding structural institutions beyond individuals.',
      shortDescription: 'Establishing ClearPath as an authoritative interpreter of governance structures and federal dynamics.',
      fullDescription: 'Our framework details how exclusive list structures work, the boundaries of local authority, and the actual mechanics of state budgets.',
      coverageArea: 'Nigeria' as const,
      topicFocus: ['federalism', 'institutions', 'legislation', 'autonomy'],
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd1xOuy3teqvz7a_E3Uf0JxXXeB7y-va4puR9WhlYOaMxZRra2hlgpd3Er58gCb15XLovnEFYIScjBj89lWXb5oFgkW2jNEObBh0ugl4GciFh2VrdXS3DZvdz0-rQzL-78nxsqThMacVb5RJQOMt6yhQuxiM831CmW0FzCtgODW5x7FDzy8VVJnZjYpwqN9umcCXTpDnTy3qn7djWGztFO2vXbMK1gPi0RXU1wYuVcl4S02-afhNpYxi3qrppr4siC1nHgEJeTecs',
      thumbnailImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd1xOuy3teqvz7a_E3Uf0JxXXeB7y-va4puR9WhlYOaMxZRra2hlgpd3Er58gCb15XLovnEFYIScjBj89lWXb5oFgkW2jNEObBh0ugl4GciFh2VrdXS3DZvdz0-rQzL-78nxsqThMacVb5RJQOMt6yhQuxiM831CmW0FzCtgODW5x7FDzy8VVJnZjYpwqN9umcCXTpDnTy3qn7djWGztFO2vXbMK1gPi0RXU1wYuVcl4S02-afhNpYxi3qrppr4siC1nHgEJeTecs',
      isFeatured: true,
      sortOrder: 1,
      seoTitle: 'Explaining Nigeria - Authority Series',
      seoDescription: 'Authoritative explanations on West Africa federal powers.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'explaining-africa',
      title: 'Explaining Africa',
      slug: 'explaining-africa',
      status: 'active' as const,
      tagline: 'Distilling African sovereign systems.',
      shortDescription: 'Bridging the systemic information deficit about national structures across the continent.',
      fullDescription: 'Investigating institutional structures, central bank operations, power transfers, and socio-economic realities.',
      coverageArea: 'Africa' as const,
      topicFocus: ['continent', 'sovereign', 'macro-civics', 'mechanisms'],
      coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNKSTe017KwF4P5tDrfPbgUDFKdtbE0uX2CL4fe-GGzUZFgW2Kj7l_yhAFWN9KtcdYZeCtL6IrwUf7qgeJvB3WDo96DaS6teP4-dYR7PZERUdB5BQsSmE0XE2fbZt96Tb8aNpGN_kLOU8V1bBtB620uHO0cDp9aysehKGWjUZ26n52xtGLOmkKGUm-1oq1ySJxEAGbfi1G4wiP-jBPTemlTbpgo0FiF6qxlhAZ7m7MTqPJNhf8LEM48dn_AbHBKVU59GTG3BzWpzU',
      thumbnailImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNKSTe017KwF4P5tDrfPbgUDFKdtbE0uX2CL4fe-GGzUZFgW2Kj7l_yhAFWN9KtcdYZeCtL6IrwUf7qgeJvB3WDo96DaS6teP4-dYR7PZERUdB5BQsSmE0XE2fbZt96Tb8aNpGN_kLOU8V1bBtB620uHO0cDp9aysehKGWjUZ26n52xtGLOmkKGUm-1oq1ySJxEAGbfi1G4wiP-jBPTemlTbpgo0FiF6qxlhAZ7m7MTqPJNhf8LEM48dn_AbHBKVU59GTG3BzWpzU',
      isFeatured: true,
      sortOrder: 2,
      seoTitle: 'Explaining Africa - Distilled Systems',
      seoDescription: 'Deep dives on African macroeconomics and frameworks.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  for (const exp of explainersToUpsert) {
    try {
      await setDoc(doc(db, 'explainers', exp.id), exp, { merge: true });
    } catch (e) {
      console.error('Error seeding explainer: ', exp.id, e);
    }
  }

  // 4. Backfill and link videos
  const videoSnap = await getDocs(collection(db, 'programmeVideos'));
  let repairedVideosCount = 0;

  for (const videoDoc of videoSnap.docs) {
    const videoData = videoDoc.data() as any;
    const origTitle = videoData.programmeTitle || '';
    const normTitle = origTitle.trim().toLowerCase();

    let targetProgSlug = '';
    let canonicalTitle = '';

    if (normTitle === 'osita insights' || normTitle === 'ositainsight') {
      targetProgSlug = 'osita-insights';
      canonicalTitle = 'OsitaInsight';
    } else if (
      normTitle === 'daily brief with annabel' ||
      normTitle === 'daily brief with annabel orji' ||
      normTitle === 'daily briefs with annabel'
    ) {
      targetProgSlug = 'daily-brief-with-annabel';
      canonicalTitle = 'Daily Brief with Annabel';
    } else if (normTitle === 'clearpath insights') {
      targetProgSlug = 'clearpath-insights';
      canonicalTitle = 'ClearPath Insights';
    } else if (
      normTitle === 'nigeria & neighbours' ||
      normTitle === 'nigeria and neighbours' ||
      normTitle === 'nigeria & neighbors' ||
      normTitle === 'nigeria and neighbors'
    ) {
      targetProgSlug = 'nigeria-neighbours';
      canonicalTitle = 'Nigeria & Neighbours';
    } else if (normTitle === 'election matters') {
      targetProgSlug = 'election-matters';
      canonicalTitle = 'Election Matters';
    } else if (normTitle === 'mekaria series') {
      targetProgSlug = 'mekaria-series';
      canonicalTitle = 'Mekaria Series';
    }

    if (targetProgSlug) {
      const actualProgId = idMap[targetProgSlug];
      if (actualProgId) {
        await updateDoc(doc(db, 'programmeVideos', videoDoc.id), {
          programmeId: actualProgId,
          programmeTitle: canonicalTitle,
          status: 'published',
          updatedAt: serverTimestamp()
        });
        repairedVideosCount++;
      }
    }
  }

  return { repairedProgrammesCount, repairedVideosCount };
}

export async function seedCompleteVideosCatalog(): Promise<{ seededCount: number; errors: string[] }> {
  let seededCount = 0;
  const errors: string[] = [];
  
  for (const video of COMPLETE_CATALOG_VIDEOS) {
    try {
      await setDoc(doc(db, 'programmeVideos', video.id), video, { merge: true });
      seededCount++;
    } catch (err: any) {
      console.error(`Error seeding video ${video.id}:`, err);
      errors.push(`Video ${video.id}: ${err.message || String(err)}`);
    }
  }
  
  return { seededCount, errors };
}
