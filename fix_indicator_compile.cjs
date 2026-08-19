const fs = require('fs');
let content = fs.readFileSync('src/pages/news/TheIndicatorPage.tsx', 'utf8');

content = content.replace(/\{currentIndicator\.supportingSourceUrl && \(\s*\)\}/g, '');

fs.writeFileSync('src/pages/news/TheIndicatorPage.tsx', content);
