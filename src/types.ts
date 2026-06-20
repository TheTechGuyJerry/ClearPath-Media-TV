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
}

export interface SiteSettings {
  id: string;
  siteName: string;
  siteTagline: string;
  heroTitle: string;
  heroSubtitle: string;
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
  interestArea?: string;
  source?: string;
  status: 'active' | 'unsubscribed';
  selectedBriefings?: string[];
  subscribedAt?: any;
  createdAt: any;
  updatedAt?: any;
}
