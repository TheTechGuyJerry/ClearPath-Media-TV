const fs = require('fs');
let content = fs.readFileSync('src/pages/news/TodaysBriefPage.tsx', 'utf8');

const regex = /\{item\.category\}/g;
content = content.replace(regex, "{item.category || item.categorySlug?.replace(/-/g, ' ')}");

fs.writeFileSync('src/pages/news/TodaysBriefPage.tsx', content);
