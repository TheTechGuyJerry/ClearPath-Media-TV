const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');
content = content.replace(
  /title: \(a\.categorySlug === 'the-indicator' \? a\.indicatorNumber \+ ' - ' : ''\) \+ \(a\.categorySlug === 'the-public-record' \? a\.quote : a\.title\)/g,
  "title: a.title"
);
fs.writeFileSync('src/pages/Home.tsx', content);
