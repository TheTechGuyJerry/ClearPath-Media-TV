const fs = require('fs');
let code = fs.readFileSync('src/components/clearpath/AnalysisAndFeaturesSection.tsx', 'utf8');

// Replace CURRENT_DAILY_EDITION references
code = code.replace(/import \{ InFocusStory, ClearPathLensStory, CURRENT_DAILY_EDITION \} from '\.\.\/\.\.\/data\/clearpath_daily_data';/, "import { InFocusStory, ClearPathLensStory } from '../../data/clearpath_daily_data';\nimport { ClearPathDailyArticle } from '../../types';");

code = code.replace(/interface AnalysisAndFeaturesSectionProps \{[\s\S]*?\}/, `interface AnalysisAndFeaturesSectionProps {
  inFocusStories?: ClearPathDailyArticle[];
  lensStory?: ClearPathDailyArticle | null;
  mainFeaturedAnalysis?: ClearPathDailyArticle | null;
  dayName?: string;
  latestStoriesList?: LatestStoryItem[];
  videoFeed?: ProgrammeVideo[];
}`);

// Remove hardcoded fallbacks
// Featured Analysis
code = code.replace(/const mainFeaturedAnalysis = useMemo\(\(\) => \{[\s\S]*?\} \[\]\);/, `
  // 1. Featured Analysis (Latest Today's Brief Article)
  const mainAnalysis = mainFeaturedAnalysis || null;
`);

// Latest Stories
code = code.replace(/const latestStories = useMemo\(\(\) => \{[\s\S]*?\} \[latestStoriesList, lensStory, inFocusStories\]\);/, `
  // 2. Latest Stories (Combination of Lens, InFocus, other News)
  const latestStories = latestStoriesList || [];
`);

// Video Feed
code = code.replace(/const releasesList = useMemo\(\(\) => \{[\s\S]*?\} \[videoFeed\]\);/, `
  // 3. Latest Programme Releases (Videos)
  const releasesList = videoFeed && videoFeed.length > 0 ? videoFeed.slice(0, 4) : [];
`);

// Now fix the template
code = code.replace(/mainFeaturedAnalysis\./g, 'mainAnalysis?.');
code = code.replace(/getArticleUrl\(mainFeaturedAnalysis, 'todays-brief'\)/, "mainAnalysis ? getArticleUrl(mainAnalysis as any, 'todays-brief') : '#'");
code = code.replace(/!mainFeaturedAnalysis/g, '!mainAnalysis');
code = code.replace(/const dateDisplay = mainFeaturedAnalysis\.publishedAt \|\| mainFeaturedAnalysis\.date;/, 'const dateDisplay = mainAnalysis?.publishedAt || mainAnalysis?.date;');

// Update In Focus to use the real array
code = code.replace(/const firstInFocus = inFocusStories\?\.\[0\];/, 'const firstInFocus = inFocusStories?.[0];');
code = code.replace(/const secondInFocus = inFocusStories\?\.\[1\];/, 'const secondInFocus = inFocusStories?.[1];');

fs.writeFileSync('src/components/clearpath/AnalysisAndFeaturesSection.tsx', code);
