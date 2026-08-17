const fs = require('fs');
let c = fs.readFileSync('src/pages/SearchPage.tsx', 'utf8');
c = c.replace(/import \{ Link /g, "import { getArticleUrl } from '../utils/urlUtils';\nimport { Link ");
c = c.replace(/`\/article\/\$\{article\.slug\}`/g, "getArticleUrl(article)");
fs.writeFileSync('src/pages/SearchPage.tsx', c);
