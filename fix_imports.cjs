const fs = require('fs');

const files = [
  'src/pages/CategoryPage.tsx',
  'src/pages/SearchPage.tsx',
  'src/pages/TopicPage.tsx',
  'src/pages/WeeklyFeaturePage.tsx',
  'src/pages/ArchivePage.tsx'
];

files.forEach(file => {
  let c = fs.readFileSync(file, 'utf8');
  if (!c.includes('import { getArticleUrl }')) {
    c = "import { getArticleUrl } from '../utils/urlUtils';\n" + c;
    fs.writeFileSync(file, c);
  }
});

