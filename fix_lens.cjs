const fs = require('fs');
const p = 'src/pages/ClearPathLensPage.tsx';
let txt = fs.readFileSync(p, 'utf8');

txt = txt.replace(/lens\.topic/g, '"STRUCTURAL ANALYSIS"');
txt = txt.replace(/lens\.title/g, 'lens.headline');
txt = txt.replace(/lens\.detailedAnalysis/g, 'lens.introductorySummary');
txt = txt.replace(/lens\.coreFinding/g, 'lens.institutionalAnalysis');

fs.writeFileSync(p, txt);
