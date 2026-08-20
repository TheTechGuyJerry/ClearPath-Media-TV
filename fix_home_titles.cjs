const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const regex = /title: a\.title,/g;
const replacement = "title: a.categorySlug === 'the-indicator' ? (a.indicatorNumber ? a.indicatorNumber + ' - ' : '') + (a.title || '') : a.categorySlug === 'the-public-record' ? (a.title || a.quote || 'The Public Record') : (a.title || 'Untitled'),";

content = content.replace(regex, replacement);
fs.writeFileSync('src/pages/Home.tsx', content);
