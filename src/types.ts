export interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  role: 'admin';
  createdAt: string;
}

export interface Programme {
  id: string; // unique slug e.g. 'three-things'
  tag: string;
  title: string;
  desc: string;
  about: string;
  img: string;
  meta: {
    Cadence: string;
    Format: string;
    Audience: string;
    [key: string]: string;
  };
  link: string;
  linkText: string;
  comingSoon?: boolean;
  order?: number;
}

export interface Episode {
  id: string; // unique document ID or slug
  programmeId: string; // references programme slug/id
  title: string;
  desc?: string;
  youtubeUrl: string;
  videoId: string;
  thumbnail?: string;
  publishStatus: 'published' | 'draft';
  publishedAt: string;
  duration?: string;
  order?: number;
  whatHappened?: string;
  whyItMatters?: string;
  whatToWatchNext?: string;
}

export interface Post {
  id: string; // doc ID or slug
  category: 'Briefing' | 'Explainer';
  title: string;
  desc?: string;
  content?: string;
  youtubeUrl?: string;
  videoId?: string;
  thumbnail?: string;
  publishStatus: 'published' | 'draft';
  publishedAt: string;
  tags?: string[];
  whatHappened?: string;
  whyItMatters?: string;
  whatToWatchNext?: string;
}

export interface Topic {
  id: string;
  slug: string;
  name: string;
}

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface SiteSettings {
  id: string;
  heroVideoUrl: string;
  heroVideoId: string;
  heroStart: number;
  heroEnd: number;
  latestBriefingId?: string;
  featuredExplainerId?: string;
}

export interface PartnerRequest {
  id: string;
  name: string;
  organization?: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}
