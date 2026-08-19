const fs = require('fs');
let content = fs.readFileSync('src/pages/news/TheIndicatorPage.tsx', 'utf8');

const regex = /\{currentIndicator\.supportingSourceUrl && \([\s\S]*?<div className="pt-2">[\s\S]*?<a[\s\S]*?href=\{currentIndicator\.supportingSourceUrl\}[\s\S]*?<\/a>[\s\S]*?<\/div>[\s\S]*?\}\)/g;
content = content.replace(regex, "");

fs.writeFileSync('src/pages/news/TheIndicatorPage.tsx', content);
