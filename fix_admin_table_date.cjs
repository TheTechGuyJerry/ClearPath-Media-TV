const fs = require('fs');

let c = fs.readFileSync('src/pages/admin/AdminClearPathDaily.tsx', 'utf8');

c = c.replace(/\{article\.publishedAt\}/g, '{article.publishedAt || article.signalDateOrDay}');

fs.writeFileSync('src/pages/admin/AdminClearPathDaily.tsx', c);
