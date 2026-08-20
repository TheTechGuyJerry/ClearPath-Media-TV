const fs = require('fs');
let content = fs.readFileSync('src/components/clearpath/AnalysisAndFeaturesSection.tsx', 'utf8');

content = content.replace(/function calculateReadTime[\s\S]*?return `\$\{mins\} mins read`;\n}/, '');

if (!content.includes("import { calculateReadTime }")) {
  content = content.replace("import { slugify } from '../../services/publicContentService';", "import { slugify } from '../../services/publicContentService';\nimport { calculateReadTime } from '../../utils/formatters';");
}

fs.writeFileSync('src/components/clearpath/AnalysisAndFeaturesSection.tsx', content);
