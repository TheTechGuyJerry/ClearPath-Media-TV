const fs = require('fs');
let content = fs.readFileSync('src/pages/news/InFocusPage.tsx', 'utf8');

// The logic for separating the stories:
const logicReplace = `
  const latestDoc = articles[0];
  const previousInFocus = articles.slice(1);
  
  const inFocusStories = [];
  if (latestDoc) {
    if (latestDoc.title1) {
      inFocusStories.push({
        ...latestDoc,
        title: latestDoc.title1,
        excerpt: latestDoc.excerpt1 || latestDoc.excerpt,
        goldNumber: '01'
      });
    }
    if (latestDoc.title2) {
      inFocusStories.push({
        ...latestDoc,
        title: latestDoc.title2,
        excerpt: latestDoc.excerpt2,
        goldNumber: '02'
      });
    }
    // Fallback if they haven't migrated data yet
    if (!latestDoc.title1 && latestDoc.title) {
       inFocusStories.push({
        ...latestDoc,
        goldNumber: '01'
      });
    }
  }
`;

content = content.replace(
  /\/\/ We group them by goldNumber[\s\S]*?const previousInFocus[\s\S]*?;/,
  logicReplace
);

// We need to also update the `currentDate={story01?.publishedAt || ''}`
content = content.replace(/story01/g, 'latestDoc');

fs.writeFileSync('src/pages/news/InFocusPage.tsx', content);
