const fs = require('fs');
let c = fs.readFileSync('src/components/clearpath/AnalysisAndFeaturesSection.tsx', 'utf8');
c = c.replace(/`\/article\/\$\{art\.id\}`/g, "getArticleUrl(art)");
fs.writeFileSync('src/components/clearpath/AnalysisAndFeaturesSection.tsx', c);
