const fs = require('fs');
const path = 'src/components/clearpath/AnalysisAndFeaturesSection.tsx';
let content = fs.readFileSync(path, 'utf8');

// Find everything from // 1. The Indicator up to // From PUBLICATIONS_DATA
content = content.replace(
  /\s*\/\/ 1\. The Indicator.*?(\/\/ From PUBLICATIONS_DATA)/s,
  '\n    $1'
);

fs.writeFileSync(path, content);
