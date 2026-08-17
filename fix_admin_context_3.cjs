const fs = require('fs');
let c = fs.readFileSync('src/pages/admin/AdminContext.tsx', 'utf8');

c = c.replace(/briefings,\s*siteSettings,/, 'briefings,\n      clearpathDailyArticles,\n      siteSettings,');

fs.writeFileSync('src/pages/admin/AdminContext.tsx', c);
