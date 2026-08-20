export interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  role: 'admin';
  createdAt: string;
}

export interface Programme {
  id: string; // Document ID (slug or generated ID)
  title: string;
  title1?: string;
  title2?: string;
  excerpt1?: string;
  excerpt2?: string;
  content1?: string;
  content2?: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  tagline: string;
  hostName: string;
  formatType: 'interview' | 'commentary' | 'daily-brief' | 'documentary' | 'panel' | 'analysis' | 'other';
  coverageArea: 'Nigeria' | 'Africa' | 'Global' | 'Nigeria & Africa' | 'other';
  topicFocus: string[]; // e.g. ['governance', 'policy']
  scheduleText: string;
  youtubePlaylistUrl: string;
  coverImage: string;
  thumbnailImage: string;
  status: 'active' | 'inactive';
  isFeatured: boolean;
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
  createdAtLabel?: string;
  updatedAtLabel?: string;
  
  // Author/Presenter fields
  authorName?: string;
  authorTitle?: string;
  authorBio?: string;
  authorImage?: string;
  authorRoleLabel?: string;
  authorSocialUrl?: string;
  authorButtonText?: string;
  authorButtonUrl?: string;
  showAuthorCard?: boolean;

  // Coming Soon fields
  comingSoon?: boolean;
  comingSoonTitle?: string;
  comingSoonMessage?: string;

  // Optional image URLs
  cardImageUrl?: string;
  coverImageUrl?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  isActive?: boolean;
  latestVideoTitle?: string;
  latestVideoThumbnail?: string;
}

export interface ProgrammeVideo {
  id: string; // Document ID
  programmeId: string; // ID or Slug reference to Programme
  programmeTitle?: string;
  title: string;
  title1?: string;
  title2?: string;
  excerpt1?: string;
  excerpt2?: string;
  content1?: string;
  content2?: string;
  slug: string;
  shortSummary: string;
  fullDescription: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  embedUrl?: string;
  thumbnailUrl: string;
  duration: string;
  presenters: string; // We can parse/split if needed, keep input as string
  guests: string;
  transcript: string;
  keyPoints: string; // newline/comma-separated list of points or raw text
  sourceLinks: string; // list of links or raw text
  topicTags: string[]; // e.g., ['policy']
  coverageArea: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  presenter?: string;
  guestNames?: string;
  displayDate?: string;
  sortOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  sourceChannelTitle?: string;
  sourcePlaylistTitle?: string;
  sourcePlaylistId?: string;
  importedFromYoutube?: boolean;
  lastSyncedAt?: string;
  publishedAtLabel?: string;
  createdAtLabel?: string;
  updatedAtLabel?: string;
  sortDate?: string;
  hiddenFromPublic?: boolean;
  needsUrl?: boolean;
}

export interface Explainer {
  id: string; // Document ID (slug or generated ID)
  title: string;
  title1?: string;
  title2?: string;
  excerpt1?: string;
  excerpt2?: string;
  content1?: string;
  content2?: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  tagline: string;
  coverageArea: 'Nigeria' | 'Africa' | 'Global' | 'other';
  topicFocus: string[]; // list of topics
  coverImage: string;
  thumbnailImage: string;
  status: 'active' | 'inactive';
  isFeatured: boolean;
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
  createdAtLabel?: string;
  updatedAtLabel?: string;
}

export interface ExplainerItem {
  id: string;
  explainerId: string; // references Explainer slug or ID
  title: string;
  title1?: string;
  title2?: string;
  excerpt1?: string;
  excerpt2?: string;
  content1?: string;
  content2?: string;
  slug: string;
  excerpt: string;
  content: string;
  explainerType: 'text' | 'video' | 'text-and-video';
  youtubeUrl: string;
  youtubeVideoId: string;
  thumbnailUrl: string;
  featuredImage: string;
  transcript: string;
  keyQuestions: string; // string or separated lines
  keyPoints: string; // string or separated lines
  sourceLinks: string; // newline-separated links
  relatedDocuments: string[]; // list of document URLs/titles
  topicTags: string[];
  coverageArea: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAtLabel?: string;
  createdAtLabel?: string;
  updatedAtLabel?: string;
}

export interface Briefing {
  id: string;
  title: string;
  title1?: string;
  title2?: string;
  excerpt1?: string;
  excerpt2?: string;
  content1?: string;
  content2?: string;
  slug: string;
  excerpt: string;
  content: string;
  briefingType: 'daily' | 'weekly' | 'special' | 'analysis';
  presenter: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  thumbnailUrl: string;
  featuredImage?: string;
  keyPoints: string; // newline/comma separated points or raw text
  sourceLinks: string; // line-seperated links
  topicTags: string[];
  coverageArea: string;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAtLabel?: string;
  createdAtLabel?: string;
  updatedAtLabel?: string;
  whatHappened?: string;
  whyItMatters?: string;
  whatToWatchNext?: string;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  siteTagline: string;
  heroTitle: string;
  heroSubtitle: string;
  title1?: string;
  title2?: string;
  excerpt1?: string;
  excerpt2?: string;
  content1?: string;
  content2?: string;
  heroVideoUrl: string;
  heroVideoId: string;
  featuredProgrammeId: string;
  featuredExplainerId: string;
  featuredBriefingId: string;
  youtubeChannelUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  xUrl: string;
  tiktokUrl: string;
  contactEmail: string;
  partnershipEmail: string;
  newsletterTitle: string;
  newsletterDescription: string;
  footerText: string;
  updatedAt: string;
  zohoElectionSignupEmbed?: string;
  newsletterSignupUrl?: string;
  overrideFeaturedVideoId?: string;
  overrideFeaturedUntil?: string;
  overrideFeaturedDays?: number;
}

export interface PartnerRequest {
  id: string;
  name?: string;
  fullName?: string;
  organization?: string;
  organisation?: string;
  email?: string;
  workEmail?: string;
  phone?: string;
  partnershipType?: string;
  partnershipInterest?: string;
  jobTitle?: string;
  message?: string;
  additionalInformation?: string;
  status?: string;
  source?: string;
  submittedAt?: any;
  createdAt: any;
  updatedAt?: any;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  phone?: string;
  fullName?: string;
  stateOfOrigin?: string;
  state?: string;
  nigerianState?: string;
  location?: string;
  city?: string;
  occupation?: string;
  interestArea?: string;
  source?: string;
  status: 'active' | 'unsubscribed';
  selectedBriefings?: string[];
  subscribedAt?: any;
  createdAt: any;
  updatedAt?: any;
}

export interface AudienceAnalyticsEvent {
  id?: string;
  visitorId: string;
  sessionId: string;
  path: string;
  pageTitle: string;
  eventType?: 'page_view' | 'watch_now_click' | 'copy_weblink_click' | 'copy_weblink_failure' | 'programme_page_click' | 'programme_page_load' | 'programme_page_failed';
  programmeId?: string;
  programmeName?: string;
  videoId?: string;
  videoTitle?: string;
  buttonLocation?: string;
  errorMessage?: string;
  contentType: 'programme' | 'explainer' | 'briefing' | 'news' | 'home' | 'other';
  trafficSource: 'direct' | 'google' | 'social' | 'referral' | 'other';
  deviceType: 'desktop' | 'mobile' | 'tablet';
  state: string;
  timestamp: string;
  dateWAT: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  hourWAT: number;
  engagementSeconds: number;
}


export interface ClearPathDailyArticle {
  createdAt?: string;
  introductorySummary?: string;
  institutionalAnalysis?: string;
  relatedLinkUrl?: string;
  relatedLinkTitle?: string;
  supportingSourceUrl?: string;
  supportingSourceTitle?: string;
  speakerPosition?: string;
  speakerSetting?: string;
  speakerInstitution?: string;
  context?: string;
  id: string;
  slug: string;
  category: string;
  categorySlug: string;
  topicTags: string[];
  title: string;
  title1?: string;
  title2?: string;
  excerpt1?: string;
  excerpt2?: string;
  content1?: string;
  content2?: string;
  subtitle?: string;
  excerpt: string;
  executiveSummary?: string;
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
  // Use JSON strings for arrays of objects to keep it simple with CMSForm
  supportingSourcesJson?: string;
  relatedArticlesJson?: string;
  relatedAthenaPublicationJson?: string;
  relatedProgrammeVideoJson?: string;
  
  // Athena Evidence specific fields
  athenaEvidenceType?: string;
  athenaEvidenceTitle?: string;
  athenaEvidenceSummary?: string;
  athenaEvidenceUrl?: string;
  athenaEvidenceDate?: string;

  // Specific fields for different categories:
  weeklyFeatureType?: string; // For Weekly Features (e.g. State in Focus, LGA Brief, West African Governance Monitor, Governance Brief, BCCN News)
  goldNumber?: '01' | '02'; // For In Focus
  indicatorNumber?: string; // For The Indicator
  indicatorContext?: string; // For The Indicator
  quote?: string; // For The Public Record
  speakerName?: string; // For The Public Record
  speakerTitle?: string; // For The Public Record
  lensHeadline?: string; // For The ClearPath Lens
  signalEvent?: string;
  signalEvent1?: string;
  signalEvent2?: string;
  signalDateOrDay1?: string;
  signalDateOrDay2?: string;
  relatedLinkTitle1?: string;
  relatedLinkTitle2?: string;
  relatedLinkUrl1?: string;
  relatedLinkUrl2?: string; // For Signals to Watch
  signalDateOrDay?: string; // For Signals to Watch
  signalDescription?: string; // For Signals to Watch
  
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
}
