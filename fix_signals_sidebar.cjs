const fs = require('fs');
let content = fs.readFileSync('src/pages/news/SignalsToWatchPage.tsx', 'utf8');

content = content.replace(
  /articles\[0\]\?\.signalDateOrDay \|\| articles\[0\]\?\.publishedAt \|\| ''/g,
  "articles[0]?.signalDateOrDay1 || articles[0]?.publishedAt || ''"
);

content = content.replace(
  /articles\[0\]\?\.signalEvent \|\| articles\[0\]\?\.title/g,
  "articles[0]?.signalEvent1 || articles[0]?.title"
);

fs.writeFileSync('src/pages/news/SignalsToWatchPage.tsx', content);
