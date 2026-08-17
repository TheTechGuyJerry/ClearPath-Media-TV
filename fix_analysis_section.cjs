const fs = require('fs');
let c = fs.readFileSync('src/components/clearpath/AnalysisAndFeaturesSection.tsx', 'utf8');
c = c.replace(/import \{ Link /g, "import { getArticleUrl } from '../../utils/urlUtils';\nimport { Link ");
c = c.replace(/`\/article\/\$\{mainFeaturedAnalysis\.slug\}`/g, "getArticleUrl(mainFeaturedAnalysis, 'clearpath-lens')");
fs.writeFileSync('src/components/clearpath/AnalysisAndFeaturesSection.tsx', c);
