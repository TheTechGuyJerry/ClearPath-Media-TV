const fs = require('fs');
let c = fs.readFileSync('src/components/clearpath/TodaysBriefSection.tsx', 'utf8');
c = c.replace(/import \{ Link /g, "import { getArticleUrl } from '../../utils/urlUtils';\nimport { Link ");
c = c.replace(/`\/article\/\$\{article\.slug\}`/g, "getArticleUrl(article, 'todays-brief')");
fs.writeFileSync('src/components/clearpath/TodaysBriefSection.tsx', c);
