const fs = require('fs');
let content = fs.readFileSync('src/pages/news/TheIndicatorPage.tsx', 'utf8');

// The prompt said: "for The Indicator, it shouldnt have source title and source"
// Let's remove the supporting source link rendering.

const regex = /\{currentIndicator\.supportingSourceUrl && \([\s\S]*?\}\)\}/;
content = content.replace(regex, '');

fs.writeFileSync('src/pages/news/TheIndicatorPage.tsx', content);
