const fs = require('fs');
let c = fs.readFileSync('src/components/clearpath/ClearPathDailySidebar.tsx', 'utf8');
c = c.replace(/import \{ Link /g, "import { getArticleUrl } from '../../utils/urlUtils';\nimport { Link ");
c = c.replace(/`\/article\/\$\{mainInFocus\.slug\}`/g, "getArticleUrl(mainInFocus, 'in-focus')");
c = c.replace(/`\/article\/\$\{edition\.clearpathLens\.slug\}`/g, "getArticleUrl(edition.clearpathLens, 'clearpath-lens')");
fs.writeFileSync('src/components/clearpath/ClearPathDailySidebar.tsx', c);
