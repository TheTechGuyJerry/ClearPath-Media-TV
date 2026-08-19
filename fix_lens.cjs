const fs = require('fs');
let content = fs.readFileSync('src/pages/ClearPathLensPage.tsx', 'utf8');

content = content.replace(
  /\/clearpath-lens\/\$\{item\.slug\}/g,
  "{getArticleUrl(item, 'clearpath-lens')}"
);

fs.writeFileSync('src/pages/ClearPathLensPage.tsx', content);
