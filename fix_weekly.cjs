const fs = require('fs');
let c = fs.readFileSync('src/pages/WeeklyFeaturePage.tsx', 'utf8');
c = c.replace(/import \{ Link /g, "import { getArticleUrl } from '../utils/urlUtils';\nimport { Link ");
c = c.replace(/`\/article\/\$\{article\.slug\}`/g, "getArticleUrl(article, 'west-african-monitor')");
fs.writeFileSync('src/pages/WeeklyFeaturePage.tsx', c);
