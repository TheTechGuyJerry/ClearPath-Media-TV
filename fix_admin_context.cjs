const fs = require('fs');

let c = fs.readFileSync('src/pages/admin/AdminContext.tsx', 'utf8');

if (!c.includes('const [clearpathDailyArticles, setClearpathDailyArticles]')) {
  c = c.replace(/const \[briefings, setBriefings\] = useState<Briefing\[\]>\(\[\]\);/, 'const [briefings, setBriefings] = useState<Briefing[]>([]);\n  const [clearpathDailyArticles, setClearpathDailyArticles] = useState<ClearPathDailyArticle[]>([]);');
  
  // Need to import ClearPathDailyArticle
  c = c.replace(/import \{.*?User.*?\} from '\.\.\/\.\.\/types';/, (match) => {
    return match.replace('}', ', ClearPathDailyArticle }');
  });

  // Export clearpathDailyArticles from context
  c = c.replace(/briefings: Briefing\[\];/, 'briefings: Briefing[];\n  clearpathDailyArticles: ClearPathDailyArticle[];');
  c = c.replace(/briefings,/, 'briefings,\n    clearpathDailyArticles,');

  // Load from DB
  c = c.replace(/setBriefings\(briefingsData as Briefing\[\]\);/, 'setBriefings(briefingsData as Briefing[]);\n\n      const clearpathDailyArticlesSnapshot = await getDocs(collection(db, \'clearpath_daily_articles\'));\n      const clearpathDailyArticlesData = clearpathDailyArticlesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));\n      setClearpathDailyArticles(clearpathDailyArticlesData as ClearPathDailyArticle[]);');
  
  fs.writeFileSync('src/pages/admin/AdminContext.tsx', c);
}
