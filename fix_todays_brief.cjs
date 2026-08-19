const fs = require('fs');
let content = fs.readFileSync('src/pages/news/TodaysBriefPage.tsx', 'utf8');

// Replace "Previous Today's Brief Editions" with "Latest from ClearPath Daily"
content = content.replace(
  /Previous Today's Brief Editions/,
  "Latest from ClearPath Daily"
);

// We need to fetch other daily categories for the latest section. Let's do a more comprehensive replacement.
// Wait, the prompt says: "since today brief is what is displayed in featured analysis, there is no need to show it again the the latest section, let the latest section show latest other daily category aside today brief"

const regexFetch = /const q = query\(collection\(db, 'articles'\), where\('categorySlug', '==', 'todays-brief'\), orderBy\('publishedAt', 'desc'\), limit\(10\)\);/;
const replaceFetch = `
        // Fetch Today's Brief for featured
        const qBrief = query(collection(db, 'articles'), where('categorySlug', '==', 'todays-brief'), orderBy('publishedAt', 'desc'), limit(1));
        const briefSnap = await getDocs(qBrief);
        const briefData = briefSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Fetch latest from OTHER clearpath daily categories
        const qOther = query(collection(db, 'articles'), where('type', '==', 'clearpath-daily'), orderBy('publishedAt', 'desc'), limit(10));
        const otherSnap = await getDocs(qOther);
        const otherData = otherSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(doc => doc.categorySlug !== 'todays-brief')
          .slice(0, 6);
        
        setArticles(briefData.concat(otherData));
`;

content = content.replace(regexFetch, replaceFetch);

fs.writeFileSync('src/pages/news/TodaysBriefPage.tsx', content);
