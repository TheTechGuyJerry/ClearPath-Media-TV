const fs = require('fs');
let c = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');

c = c.replace(/cleanPath\.startsWith\('\/admin\/briefing'\) \|\|/, 'cleanPath.startsWith(\'/admin/briefing\') ||\n      cleanPath.startsWith(\'/admin/clearpath-daily\') ||');

fs.writeFileSync('src/components/admin/AdminLayout.tsx', c);
