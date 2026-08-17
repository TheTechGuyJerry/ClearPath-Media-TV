const fs = require('fs');
let c = fs.readFileSync('src/pages/admin/AdminContext.tsx', 'utf8');

const fetchLogic = `
      // ClearPath Daily Articles
      const clearpathDailySnap = await getDocs(collection(db, 'clearpath_daily_articles'));
      const clearpathDailyList = clearpathDailySnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setClearpathDailyArticles(clearpathDailyList as ClearPathDailyArticle[]);
`;

c = c.replace(/setBriefings\(bList\);/, 'setBriefings(bList);\n' + fetchLogic);

fs.writeFileSync('src/pages/admin/AdminContext.tsx', c);
