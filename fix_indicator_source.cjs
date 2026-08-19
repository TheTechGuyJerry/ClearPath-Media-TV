const fs = require('fs');
let content = fs.readFileSync('src/pages/news/TheIndicatorPage.tsx', 'utf8');

const regex = /\{currentIndicator\.supportingSourceUrl && \([\s\S]*?\}\)\}/g;
content = content.replace(regex, '');

fs.writeFileSync('src/pages/news/TheIndicatorPage.tsx', content);
