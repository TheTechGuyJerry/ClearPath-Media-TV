const fs = require('fs');
let c = fs.readFileSync('src/components/clearpath/ClearPathLensSection.tsx', 'utf8');
c = c.replace(/import \{ Link /g, "import { getArticleUrl } from '../../utils/urlUtils';\nimport { Link ");
c = c.replace(/`\/article\/\$\{story\.slug\}`/g, "getArticleUrl(story, 'clearpath-lens')");
fs.writeFileSync('src/components/clearpath/ClearPathLensSection.tsx', c);
