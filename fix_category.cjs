const fs = require('fs');
let c = fs.readFileSync('src/pages/CategoryPage.tsx', 'utf8');
c = c.replace(/import \{ Link /g, "import { getArticleUrl } from '../utils/urlUtils';\nimport { Link ");
c = c.replace(/`\/clearpath-daily\/\$\{article\.categorySlug \|\| 'todays-brief'\}\/\$\{article\.slug\}`/g, "getArticleUrl(article)");
c = c.replace(/`\/article\/\$\{article\.slug\}`/g, "getArticleUrl(article)");
fs.writeFileSync('src/pages/CategoryPage.tsx', c);
