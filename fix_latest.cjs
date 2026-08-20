const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const regex = /latestStoriesList=\{cpArticles\.filter\(a => a\.categorySlug !== 'todays-brief'\)\.slice\(0, 5\)\.map\(a => \(\{ id: a\.id, category: a\.category, title: a\.title, link: getArticleUrl\(a, a\.categorySlug\), date: a\.publishedAt \}\)\)\}/;

const newString = `latestStoriesList={
            ['in-focus', 'the-indicator', 'the-public-record', 'clearpath-lens', 'signals-to-watch']
              .map(slug => cpArticles.find(a => a.categorySlug === slug))
              .filter(Boolean)
              .map(a => ({ 
                id: a.id, 
                category: a.category, 
                title: (a.categorySlug === 'the-indicator' ? a.indicatorNumber + ' - ' : '') + (a.categorySlug === 'the-public-record' ? a.quote : a.title), 
                link: getArticleUrl(a, a.categorySlug), 
                date: a.publishedAt 
              }))
          }`;

if (content.match(regex)) {
  content = content.replace(regex, newString);
  fs.writeFileSync('src/pages/Home.tsx', content);
  console.log("Success modifying Home.tsx latest stories");
} else {
  console.log("Regex did not match");
}
