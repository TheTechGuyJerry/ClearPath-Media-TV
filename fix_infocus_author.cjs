const fs = require('fs');
let content = fs.readFileSync('src/pages/news/InFocusPage.tsx', 'utf8');

const regex = /\{story\.authorName && \([\s\S]*?\}\)\}/g;
content = content.replace(regex, '');

fs.writeFileSync('src/pages/news/InFocusPage.tsx', content);
