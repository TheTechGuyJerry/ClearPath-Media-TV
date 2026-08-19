const fs = require('fs');
let content = fs.readFileSync('src/pages/news/TodaysBriefPage.tsx', 'utf8');

// Also update the category label to render properly
content = content.replace(
  /\{brief\.category\}/g,
  "{brief.category || 'TODAY\\'S BRIEF'}"
);

fs.writeFileSync('src/pages/news/TodaysBriefPage.tsx', content);
