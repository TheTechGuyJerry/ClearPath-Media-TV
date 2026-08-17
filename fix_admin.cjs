const fs = require('fs');

let typesContent = fs.readFileSync('src/types.ts', 'utf8');
if (!typesContent.includes('export interface ClearPathDailyArticle')) {
  typesContent += `
export interface ClearPathDailyArticle {
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
  // Use JSON strings for arrays of objects to keep it simple with CMSForm
  supportingSourcesJson?: string;
  relatedArticlesJson?: string;
  relatedAthenaPublicationJson?: string;
  relatedProgrammeVideoJson?: string;
  
  // Specific fields for different categories:
  goldNumber?: '01' | '02'; // For In Focus
  indicatorNumber?: string; // For The Indicator
  indicatorContext?: string; // For The Indicator
  quote?: string; // For The Public Record
  speakerName?: string; // For The Public Record
  speakerTitle?: string; // For The Public Record
  lensHeadline?: string; // For The ClearPath Lens
  signalEvent?: string; // For Signals to Watch
  signalDateOrDay?: string; // For Signals to Watch
  signalDescription?: string; // For Signals to Watch
  
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
}
`;
  fs.writeFileSync('src/types.ts', typesContent);
}

