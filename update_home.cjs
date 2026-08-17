const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!code.includes('import { ClearPathDailyArticle }')) {
  code = code.replace(/import { SiteSettings, Briefing, Programme, ProgrammeVideo } from '\.\.\/types';/, "import { SiteSettings, Briefing, Programme, ProgrammeVideo, ClearPathDailyArticle } from '../types';\nimport { query, where, limit, orderBy } from 'firebase/firestore';");
}

if (!code.includes('const [cpArticles, setCpArticles] = useState<ClearPathDailyArticle[]>([])')) {
  code = code.replace(/const \[errorStatus, setErrorStatus\] = useState<string \| null>\(null\);/, `const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [cpArticles, setCpArticles] = useState<ClearPathDailyArticle[]>([]);`);
}

// Add the query to Promise.allSettled
code = code.replace(/getDocs\(collection\(db, 'briefings'\)\)/, `getDocs(collection(db, 'briefings')),
        getDocs(query(collection(db, 'clearpath_daily_articles'), where('status', '==', 'published'), orderBy('publishedAt', 'desc'), limit(15)))`);

// Process the result
code = code.replace(/\/\/ 5\. Briefings result[\s\S]*?if \(results\[4\]\.status === 'fulfilled'\) \{[\s\S]*?\} else \{[\s\S]*?\}/, `// 5. Briefings result (Client-side fail-safe logic skipped for Featured display)
      
      // 6. CP Articles result
      if (results[5] && results[5].status === 'fulfilled') {
        const articles = results[5].value.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ClearPathDailyArticle[];
        setCpArticles(articles);
      } else if (results[5]) {
        console.error('[Diagnostics - Home] CP Articles Load Error: ', results[5].reason);
      }`);

// Update AnalysisAndFeaturesSection props
const sectionRenderReplacement = `{/* Editorial 3-Column Section (Latest, Featured Analysis, Latest Releases) */}
        <AnalysisAndFeaturesSection 
          mainFeaturedAnalysis={cpArticles.find(a => a.categorySlug === 'todays-brief')}
          inFocusStories={cpArticles.filter(a => a.categorySlug === 'in-focus').slice(0, 2)}
          lensStory={cpArticles.find(a => a.categorySlug === 'clearpath-lens')}
          latestStoriesList={cpArticles.slice(0, 5).map(a => ({ id: a.id, category: a.category, title: a.title, link: '/daily/' + a.categorySlug + '/' + a.slug, date: a.publishedAt }))}
          videoFeed={renderedFeedList}
        />`;

code = code.replace(/\{.*?Editorial 3-Column Section.*?\}[\s\S]*?videoFeed=\{renderedFeedList\}[\s\S]*?\/>/, sectionRenderReplacement);

fs.writeFileSync('src/pages/Home.tsx', code);
