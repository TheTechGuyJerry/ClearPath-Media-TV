const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminContext.tsx', 'utf8');

if (!code.includes('ClearPathDailyArticle')) {
  code = code.replace(/import { Programme, Briefing/g, 'import { Programme, Briefing, ClearPathDailyArticle');
  fs.writeFileSync('src/pages/admin/AdminContext.tsx', code);
}
