const fs = require('fs');
let content = fs.readFileSync('src/pages/news/TodaysBriefPage.tsx', 'utf8');

content = content.replace(
  /to=\{getArticleUrl\(item, 'todays-brief'\)\}/g,
  "to={getArticleUrl(item, item.categorySlug)}"
);

content = content.replace(
  /All Briefs Archive/,
  "All ClearPath Daily Archive"
);

content = content.replace(
  /\/archive\?category=todays-brief/,
  "/archive"
);

fs.writeFileSync('src/pages/news/TodaysBriefPage.tsx', content);
